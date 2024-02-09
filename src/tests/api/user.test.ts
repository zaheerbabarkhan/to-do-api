import axios, { AxiosError } from "axios";
import httpStatus from "http-status";
import config from "../../config/config";
import status from "../../constants/status";
import { User } from "../../database/models";
import bcrypt from "bcrypt";


const host = config.HOST || "localhost";
const port = config.PORT || 3000;

const app = `http://${host}:${port}`;


describe("POST /user", () => {
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
            email: "user2@example.com",
            password: "password123",
        };
        await User.create(userData);
        try {
            await axios.post(`${app}/users`, userData);
        } catch (error) {
            
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError;
                expect(axiosError.response?.status).toBe(httpStatus.BAD_REQUEST);
                expect(axiosError.response?.data).toHaveProperty("message", "Email already registered");
            }
        }
    });
});

describe("POST /user/login", () => {
    it("should login a user with valid credentials", async () => {
        const userData = {
            firstName: "testName",
            lastName: "testName",
            email: "logintest@example.com",
            password: "password123", 
            statusId: status.ACTIVE 
        };
        const hashPassword = await bcrypt.hash(userData.password, config.BCRYPT.SALT_ROUNDS); 
        await User.create({
            ...userData,
            password: hashPassword
        });

        const response = await axios
            .post(`${app}/users/login`,{
                email: userData.email,
                password: userData.password
            });

        expect(response.status).toBe(httpStatus.OK);
        expect(response.data).toHaveProperty("message", "Login successful");
        expect(response.data).toHaveProperty("token");
    });

    it("should return 400 for invalid credentials", async () => {

        try {
            await axios.post(`${app}/users/login`,{
                email: "invalid@example.com",
                password: "invalidPassword"
            });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError;
                expect(axiosError.response?.data).toHaveProperty("message", "Invalid credentials.");
                expect(axiosError.response?.status).toBe(httpStatus.BAD_REQUEST);
            }
        }
    });

    it("should return 400 for pending user", async () => {
        try {
            const userData = {
                firstName: "testName",
                lastName: "testName",
                email: "logintest@example.com",
                password: "password123" 
            };
            const hashPassword = await bcrypt.hash(userData.password, config.BCRYPT.SALT_ROUNDS); 
            await User.create({
                ...userData,
                password: hashPassword
            });
    
            await axios
                .post(`${app}/users/login`,{
                    email: userData.email,
                    password: userData.password
                });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError;
                expect(axiosError.response?.data).toHaveProperty("message", "Confirm your email please");
                expect(axiosError.response?.status).toBe(httpStatus.BAD_REQUEST);
            }
        }
    });
});