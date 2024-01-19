import RedisClient from "../database/redis";

const storeUserToken = async (token: string, userId: number, expiry: number) => {
    try {
        await RedisClient.set(String(userId), token, {
            EX: expiry,
        });
    } catch (error) {
        console.log("error occurred while storing in redis: ", error);
    }
};

const getUserToken = async (userId: number) => {
    try {
        const value = await RedisClient.get(String(userId));
        if (value) {
            return value;
        }
    } catch (error) {
        console.log("error occurred while storing in redis: ", error);
    } 
};
export default {
    storeUserToken,
    getUserToken,
};