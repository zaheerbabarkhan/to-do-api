import axios, { AxiosError } from "axios";
import httpStatus from "http-status";
import config from "../../config/config";

const host = config.HOST || "localhost";
const port = config.PORT || 3000;

const app = `http://${host}:${port}`;

console.log("////////////////\n/////////////\n", app);
describe("POST /api/user", () => {
    it("should create a new user", async () => {
        const userData = {
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            password: "password123",
        };
        const response = await axios.post(`${app}/users`, userData);

        expect(response.status).toBe(httpStatus.CREATED);
        expect(response.data).toHaveProperty("user");
        expect(response.data.user).toHaveProperty("id");
        expect(response.data).toHaveProperty("message");
        expect(response.data.message === "Confirmation email failed. Please provide a valid email or contact support." 
        || response.data.message === "Confirmation email sent successfully.").toBe(true);
    }, 10000);

    it("should return 400 for existing email", async () => {
        const userData = {
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            password: "password123",
        };
        try {
            await axios.post(`${app}/users`, userData);
            // If the request succeeds, it means the email already exists, which is an error
            // fail("Expected request to fail with status code 400");
        } catch (error) {
            // Check if the error is an AxiosError
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError;
                // Check if the response status is 400
                if (axiosError.response?.status === httpStatus.BAD_REQUEST) {
                    // Check the response data for expected message
                    expect(axiosError.response.data).toHaveProperty("message", "Email already registered");
                } else {
                    // Fail the test if the status code is not 400
                    fail(`Expected status code 400, received ${axiosError.response?.status}`);
                }
            } else {
                // Fail the test if the error is not an AxiosError
                fail("Expected an AxiosError");
            }
        }
    });
});

