import { Op, Sequelize, WhereOptions } from "sequelize";
import status from "../constants/status";
import { ToDo, ToDoAttributes, ToDoFile, ToDoOutput } from "../database/models";
import { CreateToDoReq, DayWithTasksRes, GetAllToDos, SimilarsQueryResult, ToDOCountsRes, UpdateToDoReq } from "../types/todo.types";
import { HttpError } from "../errors/http.error";
import httpStatus from "http-status";
import { Request } from "express";
import moment from "moment";


const createToDo = async (toDoData: CreateToDoReq): Promise<ToDoOutput> => {
    const { title, dueDate, description, userId, files } = toDoData;
    let newToDo = await ToDo.create({
        title,
        description,
        dueDate,
        userId,
    });
    if (files?.length) {
        const createFiles = [];
        for (const file of files) {
            createFiles.push(ToDoFile.create({
                title: file,
                todoId: newToDo.id,
            }));
        }
        await Promise.allSettled(createFiles);
        newToDo = await ToDo.findOne({
            where: {
                id: newToDo.id,
            },
            include: {
                model: ToDoFile,
                as: "files"
            }
        }) as ToDo;
    }
    return newToDo;
};

const updateToDo = async (toDoData: UpdateToDoReq): Promise<ToDoOutput> => {
    const {markCompleted, userId, description, dueDate, title} = toDoData;

    const todo = await ToDo.findOne({
        where: {
            statusId: {
                [Op.notIn]: [status.DELETED, status.COMPLETED],
            },
            userId,
            id: toDoData.todoId,
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
            id: id,
        },
    });
    if (!toDo) {
        throw new HttpError(httpStatus.NOT_FOUND, "To-Do not found");
    }
    return toDo;
};

const getAllToDos = (queryClause: GetAllToDos): Promise<ToDoOutput[]> => {
    const allTodos = ToDo.findAll(queryClause);
    return allTodos;
};

const deleteToDo = async (id: number, userId: number) => {
    const toDo = await ToDo.findOne({
        where: {
            statusId: {
                [Op.ne]: status.DELETED,
            },
            id,
            userId,
        },
    });
    if (!toDo) {
        throw new HttpError(httpStatus.NOT_FOUND, "To-Do not found");
    }
    toDo.statusId = status.DELETED;
    toDo.deletedAt = new Date();
    await toDo.save();
};

const getToDoCounts = async (userId: string): Promise<ToDOCountsRes> => {
    const results = await ToDo.findAll({
        where: {
            userId,
            statusId: {
                [Op.ne]: status.DELETED,
            },
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

const getPerDayCount = async (userId: number) => {

    const result = await ToDo.findAll({
        where: {
            userId,
            statusId: {
                [Op.ne]: status.DELETED,
            },
        },
        attributes: [
            [
                Sequelize.fn("EXTRACT", Sequelize.literal("'dow' FROM created_at")), "dayOfWeek",
            ],
            [Sequelize.fn("COUNT", Sequelize.col("*")), "countPerDay"],
        ],
        group: [Sequelize.fn("EXTRACT", Sequelize.literal("'dow' FROM created_at")), "dayOfWeek"],
        order: [Sequelize.fn("EXTRACT", Sequelize.literal("'dow' FROM created_at"))], // Use the alias directly in the order
    });

    return result;
};

const getOverdueTodoCount = async (userId: number) => {
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
            
            userId,
        },
    });
    return count;
};

const getAvgCompletedPerDay = async (userId: string) => {
    const result = await ToDo.findAll({
        where: {
            userId,
            statusId: status.COMPLETED, // Assuming statusId 4 is completed
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

const getDayWithMaxCompletedTasks = async (userId: string) => {
    const result = await ToDo.findAll({
        where: {
            userId,
            statusId: status.COMPLETED, // Assuming statusId 4 is completed
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


const getSimilars = async (userId: string) => {
    const results = await ToDo.findAll({
        where: {
            userId,
            statusId: {
                [Op.ne]: status.DELETED,
            }
        },
        attributes: [
            "title",
            [Sequelize.fn("STRING_AGG", Sequelize.literal("id::text"), ","), "ids"]
        ],
        group: ["title"],
        having: Sequelize.literal("COUNT(*) > 1"),
        raw: true
    }) as unknown as SimilarsQueryResult[];
    const allSimilarPromises = results.map(result=> {
        return ToDo.findAll({
            where: {
                id: {
                    [Op.in]: [...result.ids.split(",")]
                },
            },

        });
    });
    const allSimilarResults = await Promise.allSettled(allSimilarPromises);
    const similarTodos = allSimilarResults
        .filter((result): result is PromiseFulfilledResult<ToDo[]> => result.status === "fulfilled")
        .map((result) => result.value);
    return similarTodos;
};


const getQueryClauseForAllToDos = (req: Request, userId: string) => {
    const { query, statusId, completedAt, dueDate, attributes, sortBy, sortDir } = req.query;

    let whereClause: WhereOptions<ToDoAttributes> =  {
        userId,
        statusId: {
            [Op.ne]: status.DELETED,
        },
    };

    const queryClause: GetAllToDos = { where: whereClause};

    let requestAttributes: string[] = [];
    if (attributes) {
        requestAttributes = String(attributes).split(",");
        queryClause.attributes = requestAttributes;
    }
    
    if (query) {
        whereClause = {
            ...whereClause,
            [Op.or]: [{
                title: {
                    [Op.like]: `%${query}%`
                }
            },
            {
                description: {
                    [Op.like]: `%${query}%`
                }
            }]
        };
    }
    if (statusId) {
        whereClause = {
            ...whereClause,
            [Op.and] :{
                statusId: {
                    [Op.eq]: Number(statusId)
                }
            }
        };
    }
    if (completedAt) {
        whereClause = {
            ...whereClause,
            [Op.and]: [
                Sequelize.where(
                    Sequelize.fn("DATE", Sequelize.col("completed_at")),
                    "=",
                    moment(new Date(completedAt as unknown as string)).format("YYYY-MM-DD")
                ),
            ]
        };
    }
    if (dueDate) {
        whereClause = {
            ...whereClause,
            [Op.and]: [
                Sequelize.where(
                    Sequelize.fn("DATE", Sequelize.col("due_date")),
                    "=",
                    moment(new Date(dueDate as unknown as string)).format("YYYY-MM-DD")
                ),
            ]
        };
    }
    if (!sortBy) {
        queryClause.order = [["createdAt","desc"]];
    } else {
        queryClause.order = [[String(sortBy), String(sortDir)]];
    }   
    queryClause.where = whereClause;
    return queryClause;
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
    getSimilars,
    getQueryClauseForAllToDos,
};