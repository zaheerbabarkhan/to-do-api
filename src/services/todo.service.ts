import { ToDo, ToDoOutput } from "../database/models";
import { CreateToDoReq } from "../types/todo.types";

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

export default {
    createToDo,
};