import JWT from "../../utils/jwt.util"; 
import EmailService from "../../services/email.service";
import bcrypt from "bcrypt";
import httpStatus from "http-status";
import { HttpError } from "../../errors/http.error";
import config from "../../config/config";
import UserServices from "../../services/user.services";



describe("createUser", () => {
    beforeEach(() => {
        JWT.issueToken = jest.fn().mockReturnValue("mockedToken");
        EmailService.confirmationEmail = jest.fn().mockResolvedValue("");
        jest.spyOn(bcrypt, "hash").mockResolvedValue("hashedPassword" as never);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("creates a user and sends a confirmation email", async () => {

        const userData = {
            firstName: "John",
            lastName: "Doe",
            email: "unittest@example.com",
            password: "password123",
        };

        const result = await UserServices.createUser(userData, JWT.issueToken, EmailService.confirmationEmail);

        expect(result).toHaveProperty("user");
        expect(result.user).toHaveProperty("id");
        expect(result.user).toHaveProperty("firstName");
        expect(result.user).toHaveProperty("lastName");
        expect(result.user).toHaveProperty("email");
        expect(result.user).toHaveProperty("password");
        expect(result.user).toHaveProperty("statusId");
        expect(result).toHaveProperty("message", "Confirmation email sent successfully.");

        expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, config.BCRYPT.SALT_ROUNDS);

        expect(JWT.issueToken).toHaveBeenCalledWith({
            userId: expect.any(Number), // You can use more specific assertions if needed
        });

        expect(EmailService.confirmationEmail).toHaveBeenCalledWith(userData.email, "mockedToken");
    });

    it("should handle failure to send confirmation email", async () => {
        // Mock data and dependencies
        const userData = {
            firstName: "Jane",
            lastName: "Doe",
            email: "lorumipsum@email.com",
            password: "password456",
        };
    
        const token = "mockedToken";
        EmailService.confirmationEmail = jest.fn().mockRejectedValue("Failed to send email.");
    
        // Execute the service function
        const result = await UserServices.createUser(userData,JWT.issueToken, EmailService.confirmationEmail);
    
        // Assertions
        expect(result).toHaveProperty("user");
        expect(result).toHaveProperty("message", "Confirmation email failed. Please provide a valid email or contact support.");
    
        // Add more assertions as necessary
        expect(JWT.issueToken).toHaveBeenCalledWith({ userId: expect.any(Number) });
        expect(EmailService.confirmationEmail).toHaveBeenCalledWith(userData.email, token);
    });
    it("throws an error if the email is already registered", async () => {

        const userData = {
            firstName: "John",
            lastName: "Doe",
            email: "existing@example.com",
            password: "password123",
        };     
        
        await UserServices.createUser(userData, JWT.issueToken, EmailService.confirmationEmail);
        await expect(UserServices.createUser(userData, JWT.issueToken, EmailService.confirmationEmail)).rejects.toThrow(new HttpError(httpStatus.BAD_REQUEST, "Email already registered"));

        // // Ensure that other functions were not called
        expect(bcrypt.hash).toHaveBeenCalledTimes(1);
        expect(JWT.issueToken).toHaveBeenCalledTimes(1);
        expect(EmailService.confirmationEmail).toHaveBeenCalledTimes(1);
    });
});
