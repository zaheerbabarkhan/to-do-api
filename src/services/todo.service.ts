import { Op, Sequelize, WhereOptions } from "sequelize";
import status from "../constants/status";
import { ToDo, ToDoOutput, UserOutput } from "../database/models";
import { CreateToDoReq, DayWithTasksRes, ToDOCountsRes, ToDoPerDayCountRes, UpdateToDoReq } from "../types/todo.types";
import { HttpError } from "../errors/http.error";
import httpStatus from "http-status";


const createToDo = async (toDoData: CreateToDoReq): Promise<ToDoOutput> => {
    const { title, dueDate, description, user } = toDoData;
    const newToDo = await ToDo.create({
        title,
        description,
        dueDate,
        userId: user.id,
    });
    return newToDo;
};

const updateToDo = async (toDoData: UpdateToDoReq): Promise<ToDoOutput> => {
    const {markCompleted, user, description, dueDate, title} = toDoData;

    const todo = await ToDo.findOne({
        where: {
            statusId: {
                [Op.notIn]: [status.DELETED, status.COMPLETED],
            },
            userId: user.id,

        }
    });
    if (!todo) {
        throw new HttpError(httpStatus.NOT_FOUND, "To-Do not found");
    }

    if (markCompleted) {
        todo.completedAt = new Date();
        todo.statusId = status.COMPLETED;
        await todo.save();
        return todo;
    }
    if (description) {
        todo.description = description;
    }
    if (dueDate) {
        todo.dueDate = dueDate;
    }
    if (title) {
        todo.title = title;
    }

    await todo.save();
    return todo;   
};

const getToDoById = async (id: number): Promise<ToDoOutput> => {
    const toDo = await ToDo.findOne({
        where: {
            statusId: {
                [Op.ne]: status.DELETED,
            },
            id,
        },
    });
    if (!toDo) {
        throw new HttpError(httpStatus.NOT_FOUND, "To-Do not found");
    }
    return toDo;
};

const getAllToDos = (whereClause: WhereOptions): Promise<ToDoOutput[]> => {
    const allTodos = ToDo.findAll({
        where: whereClause,
    });
    return allTodos;
};

const deleteToDo = async (id: number) => {
    const toDo = await ToDo.findOne({
        where: {
            statusId: {
                [Op.ne]: status.DELETED,
            },
            id,
        },
    });
    if (!toDo) {
        throw new HttpError(httpStatus.NOT_FOUND, "To-Do not found");
    }
    toDo.statusId = status.DELETED;
    toDo.deletedAt = new Date();
    await toDo.save();
};

const getToDoCounts = async (user: UserOutput): Promise<ToDOCountsRes> => {
    const results = await ToDo.findAll({
        where: {
            userId: user.id,
        },
        attributes: [
            [
                Sequelize.fn(
                    "SUM",
                    Sequelize.literal(`CASE WHEN status_id = ${status.COMPLETED} THEN 1 ELSE 0 END`)
                ),
                "totalCompleted"
            ],
            [
                Sequelize.fn(
                    "SUM",
                    Sequelize.literal(`CASE WHEN status_id = ${status.PENDING} THEN 1 ELSE 0 END`)
                ),
                "totalPending"
            ]
        ],
    });
    const counts = {
        totalCompleted: Number(results[0].getDataValue("totalCompleted")),
        totalPending: Number(results[0].getDataValue("totalPending")),
    };
    return {
        ...counts,
        totalCount: counts.totalCompleted + counts.totalPending
    };
};

const getPerDayCount = async (user: UserOutput) => {

    const result = await ToDo.findAll({
        where: {
            userId: user.id,
        },
        attributes: [
            [
                Sequelize.fn("EXTRACT", Sequelize.literal("'dow' FROM created_at")), "dayOfWeek",
            ],
            [Sequelize.fn("COUNT", Sequelize.col("*")), "countPerDay"],
        ],
        group: [Sequelize.fn("EXTRACT", Sequelize.literal("'dow' FROM created_at")), "dayOfWeek"],
        order: [Sequelize.fn("EXTRACT", Sequelize.literal("'dow' FROM created_at"))], // Use the alias directly in the order
    }) as unknown;

    return result as ToDoPerDayCountRes[];
};

const getOverdueTodoCount = async (user: UserOutput) => {
    const currentDate = new Date();

    const count = await ToDo.count({
        where: {
            [Op.or]: [
                {
                    statusId: status.PENDING,
                    dueDate: {
                        [Op.lt]: currentDate, // Less than current date
                    },
                },
                {
                    statusId: status.COMPLETED,
                    dueDate: {
                        [Op.lt]: Sequelize.col("completed_at"), // Less than current date
                    },
                }
            ],
            
            userId: user.id,
        },
    });
    return count;
};

const getAvgCompletedPerDay = async (user: UserOutput) => {
    const result = await ToDo.findAll({
        where: {
            userId: user.id,
            statusId: 4, // Assuming statusId 4 is completed
        },
        attributes: [
            [
                Sequelize.fn("date_trunc", Sequelize.literal("'day'"), Sequelize.col("completed_at")),
                "day",
            ],
            [Sequelize.fn("COUNT", Sequelize.col("*")), "countPerDay"],
        ],
        group: [Sequelize.fn("date_trunc", Sequelize.literal("'day'"), Sequelize.col("completed_at"))],
        order: [Sequelize.fn("date_trunc", Sequelize.literal("'day'"), Sequelize.col("completed_at"))],
    });

    const totalSum = result.reduce((acc, row) => acc + Number(row.dataValues.countPerDay), 0);
    return totalSum / result.length;
};

const getDayWithMaxCompletedTasks = async (user: UserOutput) => {
    const result = await ToDo.findAll({
        where: {
            userId: user.id,
            statusId: 4, // Assuming statusId 4 is completed
        },
        attributes: [
            [
                Sequelize.fn("date_trunc", Sequelize.literal("'day'"), Sequelize.col("completed_at")),
                "day",
            ],
            [Sequelize.fn("COUNT", Sequelize.col("*")), "countPerDay"],
        ],
        group: [Sequelize.fn("date_trunc", Sequelize.literal("'day'"), Sequelize.col("completed_at"))],
        order: [[Sequelize.fn("COUNT", Sequelize.col("*")), "DESC"]],
        limit: 1,
        raw: true,
    }) as unknown as DayWithTasksRes[];
    return result;
};

export default {
    createToDo,
    updateToDo,
    getToDoById,
    getAllToDos,
    deleteToDo,
    getToDoCounts,
    getPerDayCount,
    getOverdueTodoCount,
    getDayWithMaxCompletedTasks,
    getAvgCompletedPerDay,
};