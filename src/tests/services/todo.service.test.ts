import httpStatus from "http-status";
import { ToDo, User } from "../../database/models";
import { HttpError } from "../../errors/http.error";
import TodoService from "../../services/todo.service";
import { CreateToDoReq } from "../../types/todo.types";
import { AccountType } from "../../types/user.types";
import status from "../../constants/status";
let user: User;
let newTodo: ToDo;
describe("ToDO Service class operations",  () => {
    
    beforeEach(() => {
        jest.restoreAllMocks();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    // Test suit for createToDo function
    describe("Todo Service create function", () => {
        it("create the todo against provided user", async () => {
            user = await User.create({
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
            // Call the createToDo function with test data
            newTodo = await TodoService.createToDo(testToDoData) as ToDo;
    
            // Retrieve the ToDo item from the database to verify its existevnce
            const retrievedToDo = await ToDo.findByPk(newTodo.id);
    
            // Assertions
            expect(retrievedToDo).toBeDefined(); // Check if the ToDo item exists in the database
            expect(retrievedToDo?.title).toEqual(testToDoData.title); // Check if the title matches
            expect(retrievedToDo?.dueDate).toEqual(testToDoData.dueDate); // Check if the dueDate matches
            expect(retrievedToDo?.description).toEqual(testToDoData.description); // Check if the description matches
            expect(retrievedToDo?.userId).toEqual(testToDoData.userId); // Check if the userId matches
        });
    });

    describe("Todo Service update function", () => {

        it("updates the description of a to-do item", async () => {
            const updatedToDo = await TodoService.updateToDo({ description: "New description", userId: user.id, todoId: newTodo.id});
        
            expect(updatedToDo.description).toEqual("New description");
        });
        
        // Test case for updating the due date of a to-do item
        it("updates the due date of a to-do item", async () => {
            const newDueDate = new Date();
            const updatedToDo = await TodoService.updateToDo({ dueDate: newDueDate, userId: user.id, todoId: newTodo.id});
        
            expect(updatedToDo.dueDate).toEqual(newDueDate);
        });
        
        // Test case for updating the title of a to-do item
        it("updates the title of a to-do item", async () => {
            const updatedToDo = await TodoService.updateToDo({ title: "New title", userId: user.id, todoId: newTodo.id});
        
            expect(updatedToDo.title).toEqual("New title");
        });
        // if markCompleted is passed as true then todo is marked as complete
        it("mark todo as completed",async () => {
            const updatedToDo = await TodoService.updateToDo({ markCompleted: true, userId: user.id, todoId: newTodo.id });

            expect(updatedToDo.statusId).toEqual(status.COMPLETED);
            expect(updatedToDo.completedAt).toBeDefined();
        });

        // if todo is not found throws an error 
        it("throws an error if the todo is not there", async () => {
            await expect(TodoService.updateToDo({userId: user.id, todoId: 0})).rejects.toThrow(new HttpError(httpStatus.NOT_FOUND, "To-Do not found"));
        });
    });

    describe("Todo Service getToDoById function", () => {

        it("returns the to-do item when found", async () => {
            const toDo = await TodoService.getToDoById(newTodo.id) as ToDo;
        
            expect(toDo.id).toEqual(newTodo.id);
        });
          
        it("throws an error if the to-do item is not found", async () => {
            // Mock the case when the to-do item is not found
            jest.spyOn(ToDo, "findOne").mockResolvedValue(null);
        
            await expect(TodoService.getToDoById(1)).rejects.toThrow(
                new HttpError(httpStatus.NOT_FOUND, "To-Do not found")
            );
        });
    });

    describe("Todo Service deleteToDo function", () => {
        it("deletes a to-do item when found", async () => {

            await TodoService.deleteToDo(newTodo.id, user.id);
            const retrievedToDo = await ToDo.findByPk(newTodo.id);
            expect(retrievedToDo?.statusId).toEqual(status.DELETED);
            expect(retrievedToDo?.deletedAt).toBeDefined();
        });
        
        // Test case for handling when the to-do item is not found
        it("throws an error if the to-do item is not found", async () => {
        
            await expect(TodoService.deleteToDo(newTodo.id, user.id)).rejects.toThrow(
                new HttpError(httpStatus.NOT_FOUND, "To-Do not found")
            );
        });
    });
});
