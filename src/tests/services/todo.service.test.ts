import httpStatus from "http-status";
import { ToDo, ToDoInput, User } from "../../database/models";
import { HttpError } from "../../errors/http.error";
import TodoService from "../../services/todo.service";
import { CreateToDoReq } from "../../types/todo.types";
import { AccountType } from "../../types/user.types";
import status from "../../constants/status";
import OverDueTodo from "../testData/overDue.todo";
import CountOnDOWTodo from "../testData/countOnDOW.todo";
describe("ToDO Service class operations",  () => {

    // Test suit for createToDo function
    describe("Todo Service create function", () => {

        it("create the todo against provided user", async () => {
            const user = await User.create({
                firstName: "testUser",
                lastName: "testUser",
                password: "testPassword",
                email: "testuser@email.com",
                accountType: AccountType.APP
            });
    
            const testToDoData: CreateToDoReq = {
                title: "Test ToDo",
                dueDate: new Date(),
                description: "Test description",
                userId: user.id,
            };
            
            const newTodo = await TodoService.createToDo(testToDoData) as ToDo;
            const retrievedToDo = await ToDo.findByPk(newTodo.id);
    
            expect(retrievedToDo).toBeDefined();
            expect(retrievedToDo?.title).toEqual(testToDoData.title);
            expect(retrievedToDo?.dueDate).toEqual(testToDoData.dueDate); 
            expect(retrievedToDo?.description).toEqual(testToDoData.description);
            expect(retrievedToDo?.userId).toEqual(testToDoData.userId); 
        });
    });

    // Test suit for updateToDo function
    describe("Todo Service updateToDo function", () => {

        
        it("updates the description of a to-do item", async () => {

            const user = await User.create({
                firstName: "testUser",
                lastName: "testUser",
                password: "testPassword",
                email: "testuser1@email.com",
                accountType: AccountType.APP
            });
    
            const testToDoData = {
                title: "Test ToDo",
                dueDate: new Date(),
                description: "Test description",
                userId: user.id,
            };
            const newTodo = await ToDo.create(testToDoData);
            const updatedToDo = await TodoService.updateToDo({ description: "New description", userId: user.id, todoId: newTodo.id});
        
            expect(updatedToDo.description).toEqual("New description");
        });
        
        
        it("updates the due date of a to-do item", async () => {
            const user = await User.create({
                firstName: "testUser",
                lastName: "testUser",
                password: "testPassword",
                email: "testuser2@email.com",
                accountType: AccountType.APP
            });
    
            const testToDoData = {
                title: "Test ToDo",
                dueDate: new Date(),
                description: "Test description",
                userId: user.id,
            };
            const newTodo = await ToDo.create(testToDoData);
            const newDueDate = new Date();
            const updatedToDo = await TodoService.updateToDo({ dueDate: newDueDate, userId: user.id, todoId: newTodo.id});
        
            expect(updatedToDo.dueDate).toEqual(newDueDate);
        });
        
        
        it("updates the title of a to-do item", async () => {
            const user = await User.create({
                firstName: "testUser",
                lastName: "testUser",
                password: "testPassword",
                email: "testuser3@email.com",
                accountType: AccountType.APP
            });
    
            const testToDoData = {
                title: "Test ToDo",
                dueDate: new Date(),
                description: "Test description",
                userId: user.id,
            };
            const newTodo = await ToDo.create(testToDoData);
            const updatedToDo = await TodoService.updateToDo({ title: "New title", userId: user.id, todoId: newTodo.id});
        
            expect(updatedToDo.title).toEqual("New title");
        });
        
        it("mark todo as completed",async () => {
            const user = await User.create({
                firstName: "testUser",
                lastName: "testUser",
                password: "testPassword",
                email: "testuser4@email.com",
                accountType: AccountType.APP
            });
    
            const testToDoData = {
                title: "Test ToDo",
                dueDate: new Date(),
                description: "Test description",
                userId: user.id,
            };
            const newTodo = await ToDo.create(testToDoData);
            const updatedToDo = await TodoService.updateToDo({ markCompleted: true, userId: user.id, todoId: newTodo.id });

            expect(updatedToDo.statusId).toEqual(status.COMPLETED);
            expect(updatedToDo.completedAt).toBeDefined();
        });

        
        it("throws an error if the todo is not there", async () => {
            const user = await User.create({
                firstName: "testUser",
                lastName: "testUser",
                password: "testPassword",
                email: "testuser5@email.com",
                accountType: AccountType.APP
            });
    
            const testToDoData = {
                title: "Test ToDo",
                dueDate: new Date(),
                description: "Test description",
                userId: user.id,
            };
            await ToDo.create(testToDoData);
            await expect(TodoService.updateToDo({userId: user.id, todoId: 0})).rejects.toThrow(new HttpError(httpStatus.NOT_FOUND, "To-Do not found"));
        });
    });

    // Test suit for getToDoById function
    describe("Todo Service getToDoById function", () => {

        it("returns the to-do item when found", async () => {
            const user = await User.create({
                firstName: "testUser",
                lastName: "testUser",
                password: "testPassword",
                email: "testuser6@email.com",
                accountType: AccountType.APP
            });
        
            const testToDoData = {
                title: "Test ToDo for get one by id",
                dueDate: new Date(),
                description: "Test description",
                userId: user.id,
                statusId: status.ACTIVE
            };
            const getByIdTodo = await ToDo.create(testToDoData);
            const toDo = await TodoService.getToDoById(getByIdTodo.id, user.id);
            expect(toDo.id).toEqual(getByIdTodo.id);
            
            
        });
          
        it("throws an error if the to-do item is not found", async () => {
            await expect(TodoService.getToDoById(0, 0)).rejects.toThrow(
                new HttpError(httpStatus.NOT_FOUND, "To-Do not found")
            );
        });
    });

    // Test suit for deleteToDo function
    describe("Todo Service deleteToDo function", () => {
        it("deletes a to-do item when found", async () => {
            const user = await User.create({
                firstName: "testUser",
                lastName: "testUser",
                password: "testPassword",
                email: "testuser7@email.com",
                accountType: AccountType.APP
            });
    
            const testToDoData = {
                title: "Test ToDo",
                dueDate: new Date(),
                description: "Test description",
                userId: user.id,
                statusId: status.ACTIVE
            };
            const newTodo = await ToDo.create(testToDoData);
            await TodoService.deleteToDo(newTodo.id, user.id);
            const retrievedToDo = await ToDo.unscoped().findOne({
                where: {
                    id: newTodo.id,
                }
            });
            expect(retrievedToDo?.statusId).toEqual(status.DELETED);
            expect(retrievedToDo?.deletedAt).toBeDefined();
        });
        

        it("throws an error if the to-do item is not found", async () => {
            await expect(TodoService.deleteToDo(0, 0)).rejects.toThrow(
                new HttpError(httpStatus.NOT_FOUND, "To-Do not found")
            );
        });
    });

    // Test suit for getOverdueTodoCount function
    describe("Todo Service getOverdueTodoCount function", () => {
        it("returns the count of todos that are overdue", async () => {
            const user = await User.create({
                firstName: "testUser",
                lastName: "testUser",
                password: "testPassword",
                email: "testuser9@email.com",
                accountType: AccountType.APP
            });
            const overDueTodos: ToDoInput[] = [];
            for(const todo of OverDueTodo) {
                overDueTodos.push({
                    ...todo,
                    userId: user.id,
                });
            }
            await ToDo.destroy({
                where: {}, // Empty condition to match all rows
                truncate: true // This ensures that the table is truncated (emptied) and not dropped
            });
            await ToDo.bulkCreate(overDueTodos);
            const count = await TodoService.getOverdueTodoCount(user.id);
            
            expect(count).toEqual(7);
        });
    });

    // Test suit for getPerDayCount function
    describe("Todo Service getPerDayCount function", () => {
        it("returns the count of todos that are overdue", async () => {
            const user = await User.create({
                firstName: "testUser",
                lastName: "testUser",
                password: "testPassword",
                email: "testuser10@email.com",
                accountType: AccountType.APP
            });
            const countOnDOWToDos = [];
            for(const todo of CountOnDOWTodo) {
                countOnDOWToDos.push({
                    ...todo,
                    userId: user.id,
                });
            }
            await ToDo.update({
                statusId: status.DELETED
            },{
                where: {}, // Empty condition to match all rows
            });
            
            await ToDo.bulkCreate(countOnDOWToDos);
            
            const countOnDOW = await TodoService.getPerDayCount(user.id);
            for (const dow of countOnDOW) {
                expect(dow.dataValues.countPerDay).toEqual("3");
            }
        });
    });
});
