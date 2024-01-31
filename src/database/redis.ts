// redisClient.ts
import * as redis from "redis";

let client: redis.RedisClientType;

const createClient = (): redis.RedisClientType => {
    if (!client) {
        client = redis.createClient();
        client.on("connect", () => {
            console.log("Connected to Redis");      
        });  
        client.on("error", (err: unknown) => {
            console.error(`Error connecting to Redis: ${err}`);
        });
    }

    return client;
};

export default createClient();
