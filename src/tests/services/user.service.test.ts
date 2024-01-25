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
            email: "john.doe@example.com",
            password: "password123",
        };

        const result = await UserServices.createUser(userData, JWT.issueToken, EmailService.confirmationEmail);

        expect(result).toHaveProperty("id");
        expect(result).toHaveProperty("firstName");
        expect(result).toHaveProperty("lastName");
        expect(result).toHaveProperty("email");
        expect(result).toHaveProperty("password");
        expect(result).toHaveProperty("statusId");

        expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, config.BCRYPT.SALT_ROUNDS);

        expect(JWT.issueToken).toHaveBeenCalledWith({
            userId: expect.any(Number), // You can use more specific assertions if needed
        });

        expect(EmailService.confirmationEmail).toHaveBeenCalledWith("john.doe@example.com", "mockedToken");
    });

    it("throws an error if the email is already registered", async () => {

        const userData = {
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            password: "password123",
        };        
        await expect(UserServices.createUser(userData, JWT.issueToken, EmailService.confirmationEmail)).rejects.toThrow(new HttpError(httpStatus.BAD_REQUEST, "Email already registered"));

        // // Ensure that other functions were not called
        expect(bcrypt.hash).not.toHaveBeenCalled();
        expect(JWT.issueToken).not.toHaveBeenCalled();
        expect(EmailService.confirmationEmail).not.toHaveBeenCalled();
    });
});
