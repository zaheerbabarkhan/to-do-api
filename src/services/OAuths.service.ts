import JWT from "../utils/jwt.util";
const googleLogin = (userId: number) => {
    const token = JWT.issueToken({
        userId,
    });
    return {
        message: "Login successful",
        token,
    };
};


export default {
    googleLogin,
};