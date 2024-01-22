import cron from "node-cron";
import { ToDo, User } from "../database/models";
import status from "../constants/status";
import JWT from "../utils/jwt.util";
import { Sequelize } from "sequelize";
import EmailService from "./email.service";
const pendingTaskReminderCRONExpression = "0 0 * * *"; // This means 0 minutes, 0 hours (UTC time), every day

const dueDateReminder = cron.schedule(pendingTaskReminderCRONExpression, async () => {
    const allUsers = await User.findAll({
        attributes: [
            "id",
            "firstName",
            "lastName",
            "email",
            "accountType",
            "statusId",
            [
                Sequelize.literal(`(
              SELECT COUNT(*)
              FROM "todos"
              WHERE "todos"."user_id" = "User"."id"
              AND DATE("todos"."due_date") = CURRENT_DATE
              AND "todos"."status_id" = ${status.PENDING}
            )`),
                "todoCountDueToday",
            ],
        ],
        include: [
            {
                model: ToDo,
                as: "todos",
                attributes: [],
            },
        ],
    });
    for (const user of allUsers) {
        if(Number(user.dataValues.todoCountDueToday)) {
            const token = JWT.issueToken({
                userId: user.id
            });
            try {
                console.log(new Date());
                console.log("executing reminder email for user with id: ", user.id);
                await EmailService.todoReminderEmail(user.email, token, `&status_id=${status.PENDING}&dueDate=${new Date()}`);
                console.log("Reminder email send to user with iod: ", user.id);
            } catch (error) {
                console.log("error during reminder email for user with id: ", user.id);
                console.error(error);
            }
        }
        
    }
    console.log("Cron job executed at 12 AM UTC");
});

export const initCrons = () => {
    dueDateReminder.start();
};

