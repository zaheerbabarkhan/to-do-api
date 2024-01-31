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
        SALT_ROUNDS: 10
    },
    SMTP: {
        SMTP_EMAIL: env.SMTP_EMAIL,
        SMTP_PASSWORD: env.SMTP_PASSWORD
    },
    JWT: {
        SECRET_KEY: String(env.SECRET_KEY),
        EXPIRY: String(env.EXPIRY)
    },
    OAUTH: {
        GOOGLE_CLIENT_ID: String(env.GOOGLE_CLIENT_ID),
        GOOGLE_CLIENT_SECRET: String(env.GOOGLE_CLIENT_SECRET),
        GOOGLE_CALLBACK_URL: String(env.GOOGLE_CALLBACK_URL),
        GITHUB_CLIENT_ID: String(env.GITHUB_CLIENT_ID),
        GITHUB_CLIENT_SECRET: String(env.GITHUB_CLIENT_SECRET),
        GITHUB_CALLBACK_URL: String(env.GITHUB_CALLBACK_URL),
    },
    AWS: {
        ACCESS_KEY: String(env.AWS_CLIENT_ACCESS_KEY),
        SECRET_KEY: String(env.AWS_CLIENT_SECRET_KEY),
        REGION: env.AWS_REGION,
        BUCKET_NAME: env.AWS_S3_BUCKET
    }
};