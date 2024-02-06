import cron from "node-cron";
import { ToDo, User } from "../database/models";
import status from "../constants/status";
import JWT from "../utils/jwt.util";
import { Sequelize } from "sequelize";
import EmailService from "./email.service";
import logger from "../utils/logger";
const pendingTaskReminderCRONExpression = "0 0 * * *"; // This means 0 minutes, 0 hours (UTC time), every day

const loggerLabel = "Reminder CRON Log";
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
    logger.info(`Cron job sarted at ${new Date()}`, {
        label: loggerLabel
    });
    for (const user of allUsers) {
        if(Number(user.dataValues.todoCountDueToday)) {
            const token = JWT.issueToken({
                userId: user.id
            });
            try {
                logger.info(`executing reminder email for user with id: ${user.id}`, {
                    label: loggerLabel
                });
                await EmailService.todoReminderEmail(user.email, token, `&status_id=${status.PENDING}&dueDate=${new Date()}`);
                logger.info(`Reminder email send to user with iod: ${user.id}`, {
                    label: loggerLabel
                });
            } catch (error) {
                console.error(error);
                logger.error(`error during reminder email for user with id: ${user.id} with error ${JSON.stringify(error)}`, {
                    label: loggerLabel
                });
            }
        }
        
    }
    logger.info(`Cron job ended at ${new Date()}`, {
        label: loggerLabel
    });
});

export const initCrons = () => {
    dueDateReminder.start();
};

