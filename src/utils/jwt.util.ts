import * as jwt from "jsonwebtoken";
import { Payload } from "../types/jwt.types";
import config from "../config/config";

const issueToken = (payload: Payload): string => {
    const token = jwt.sign(payload, config.JWT.SECRET_KEY, { expiresIn: config.JWT.EXPIRY});
    return token;
};

const  verify = async (token: string) => {
    return jwt.verify(token, config.JWT.SECRET_KEY);
};

const decode = (token: string) => {
    return jwt.decode(token, {
        complete: true
    });
};
export default {
    issueToken,
    verify,
    decode,
};