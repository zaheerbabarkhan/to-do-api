import axios, { AxiosError} from "axios";
import httpStatus from "http-status";
import config from "../../config/config";
import { ToDo, User } from "../../database/models";
import status from "../../constants/status";
import JWT from "../../utils/jwt.util";

const host = config.HOST || "localhost";
const port = config.PORT || 3000;

const app = `http://${host}:${port}`;

let user: User;
let token: string;

describe("POST /todo", () => {
    it("should create a new todo", async () => {
        const userData = {
            firstName: "testName",
            lastName: "testName",
            email: "todocreate@example.com",
            password: "password123", 
            statusId: status.ACTIVE 
        };
        
        user = await User.create(userData);
        token = JWT.issueToken({
            userId: user.id
        });


        const todoData = {
            title: "First Todo",
            descriptiong: "First Todo description",
            dueDate: new Date(new Date().setDate(new Date().getDate() + 5)),
        };
        const response = await axios.post(`${app}/todos`, todoData, {
            headers: {"Authorization": `Bearer ${token}`}
        });
        expect(response.status).toBe(httpStatus.CREATED);
        expect(response.data).toHaveProperty("id");
    });
});


describe("PUT /todo/:id", () => {
    const baseUrl =  app +"/todos";

    it("should update a to-do successfully", async () => {
        const newTodo = await ToDo.create({
            title: "First Todo",
            descriptiong: "First Todo description",
            dueDate: new Date(new Date().setDate(new Date().getDate() + 5)),
            userId: user.id
        });
        const updateData = {
            title: "Updated Title",
            description: "Updated Description",
            dueDate: new Date(new Date().setDate(new Date().getDate() + 5)),
        };

        const response = await axios.put(`${baseUrl}/${newTodo.id}`, updateData, {
            headers: {"Authorization": `Bearer ${token}`}
        });

        expect(response.status).toBe(httpStatus.OK);
        expect(response.data).toHaveProperty("title", updateData.title);
        expect(response.data).toHaveProperty("description", updateData.description);
        // expect(response.data).toHaveProperty("dueDate", new Date(updateData.dueDate));
        expect(updateData.dueDate.getTime() === new Date(response.data.dueDate).getTime()).toBe(true);
    });

    it("should handle not found error", async () => {
        const nonExistentTodoId = 999;

        try {
            await axios.put(`${baseUrl}/${nonExistentTodoId}`, {
                title: "Updated Title"
            }, {
                headers: {"Authorization": `Bearer ${token}`}
            });
            fail("Expected request to fail with status code 404");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError;
                expect(axiosError.response?.status).toBe(httpStatus.NOT_FOUND);
                expect(axiosError.response?.data).toHaveProperty("message", "To-Do not found");
            }
        }
    });

    it("should mark a to-do as completed", async () => {

        const newTodo = await ToDo.create({
            title: "First Todo",
            descriptiong: "First Todo description",
            dueDate: new Date(new Date().setDate(new Date().getDate() + 5)),
            userId: user.id
        });
        const updateData = {
            markCompleted: true
        };
        const response = await axios.put(`${baseUrl}/${newTodo.id}`, updateData, {
            headers: {"Authorization": `Bearer ${token}`}
        });

        expect(response.status).toBe(httpStatus.OK);
        expect(response.data).toHaveProperty("completedAt");
        expect(response.data).toHaveProperty("statusId", status.COMPLETED);
    });

});
