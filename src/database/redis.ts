import * as redis from "redis";
import logger from "../utils/logger";

let client: redis.RedisClientType;

const createClient = (): redis.RedisClientType => {
    if (!client) {
        client = redis.createClient();
        client.on("connect", () => {
            logger.info("Connected to Redis", {
                label: "Redis Connection"
            });      
        });  
        client.on("error", (err: unknown) => {
            logger.error(`Error connecting to Redis: ${err}`, {
                label: "Redis Connection",
            });
        });
    }

    return client;
};

export default createClient();
