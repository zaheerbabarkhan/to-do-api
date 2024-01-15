import { Op, WhereOptions } from "sequelize";
import status from "../constants/status";
import { ToDo, ToDoOutput } from "../database/models";
import { CreateToDoReq, UpdateToDoReq } from "../types/todo.types";
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

export default {
    createToDo,
    updateToDo,
    getToDoById,
    getAllToDos,
    deleteToDo,
};