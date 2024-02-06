import RedisClient from "../database/redis";
import logger from "../utils/logger";
const loggerLabel = "Redis Service";
const storeUserToken = async (token: string, userId: number, expiry: number) => {
    try {
        await RedisClient.set(String(userId), token, {
            EX: expiry,
        });
    } catch (error) {
        logger.error(`error occurred while storing in redis: ${JSON.stringify(error)}`, {
            label: loggerLabel
        });
    }
};

const getUserToken = async (userId: number) => {
    try {
        const value = await RedisClient.get(String(userId));
        if (value) {
            return value;
        }
    } catch (error) {
        logger.error(`error occurred while fetching from redis: ${JSON.stringify(error)}`, {
            label: loggerLabel
        });
    } 
};
export default {
    storeUserToken,
    getUserToken,
};