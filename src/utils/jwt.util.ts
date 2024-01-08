import * as jwt from "jsonwebtoken";
import { Payload } from "../types/jwt.types";
import config from "../config/config";

const issueToken = (payload: Payload): string => {
    const token = jwt.sign(payload, config.JWT.SECRET_KEY, { expiresIn: config.JWT.EXPIRY});
    return token;
};


export default {
    issueToken,
};