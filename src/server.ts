import express from "express";
import config from "./config/config";
import sequelize, {initModels} from "./database/init";
import { Sequelize } from "sequelize";
import YAML from "yamljs";
import { connector} from "swagger-routes-express";
import * as api from "./controllers";
import path from "path";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import * as OpenApiValidator from "express-openapi-validator";
import { errorMiddleware } from "./middlewares/error.middleware";
import authMiddleware from "./middlewares/auth.middleware";
import passport from "./config/passport.config";
import googlePassportMiddleware from "./middlewares/googlePassport.middleware";
import githubpassportMiddleware from "./middlewares/githubpassport.middleware";
import morgan from "morgan";
import fs from "fs";
import { initCrons } from "./services/cron.service";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false}));


(() => {
    const accessLogStream = fs.createWriteStream(path.join(__dirname, "..","access.log"), { flags: "a" });

    // setup the logger
    app.use(morgan("combined", { stream: accessLogStream }));
})();
const apiDefinitionFilePath = path.join(__dirname, "api.yml");

// attaching swagger validator middleware
(() => {
    const validatorOptions = {
        apiSpec: apiDefinitionFilePath,
        validateRequests: true,
    };
    app.use(OpenApiValidator.middleware(validatorOptions));
})();


// attaching google and github oauth middleware to the app
(() => {
    app.use(passport.initialize());
    app.get("/auth/google",passport.authenticate("google", { scope: ["profile", "email"] }));
    app.get("/auth/github", passport.authenticate("github", { scope: [ "user:email" ] }));
})();

// making Db connection
let db: Sequelize;
(async () =>  {

    try {
        db = sequelize();
        await db.authenticate();
        initModels(db);
        config.NODE_ENV === "development" && await db.sync({
            force: config.DB.DB_SYNC,
            alter: config.DB.DB_ALTER
        });
    } catch (error) {
        console.log("DB Connection erorr:", error);
    }

})();

(() => {
    initCrons();
})();
// attaching routes to swagger-router
(()  => {
    const apiDefinition = YAML.load(apiDefinitionFilePath);
    const connect = connector(api, apiDefinition, {
        security: {
            JWTSecurity: authMiddleware,
        },
        middleware: {
            passportGoogle: googlePassportMiddleware,
            passportGitHub: githubpassportMiddleware,
        }
    });
    connect(app);
    const specs = swaggerJsDoc({
        swaggerDefinition: apiDefinition,
        apis: ["./controllers/*.ts"]
    });
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

})();

// attaching error middleware
app.use(errorMiddleware);



app.listen(config.PORT, () => {
    console.log(`API server is listening on the http://${config.HOST}:${config.PORT}`);
});