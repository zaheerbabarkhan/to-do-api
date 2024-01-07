import dotenv from "dotenv";


dotenv.config();
const env = process.env;


export default {
    PORT: env.PORT,
    HOST: env.HOST,
    NODE_ENV: env.NODE_ENV,

    DB: {
        DB_ALTER: (env.DB_ALTER === "true"),
        DB_SYNC: (env.DB_SYNC === "true"),
        DB_NAME: env.DB_NAME,
        DB_USER: env.DB_USER,
        DB_PASSWORD: env.DB_PASSWORD,
        DB_HOST: env.DB_HOST,
        DB_DIALECT: env.DB_DIALECT
    },

    BCRYPT: {
        SALT_ROUNDS: Number(env.SALT_ROUNDS)
    }
};