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


const app = express();
app.use(express.json());

const apiDefinitionFilePath = path.join(__dirname, "api.yml");

// attaching swagger validator middleware
(() => {
    const validatorOptions = {
        apiSpec: apiDefinitionFilePath,
        validateRequests: true,
    };
    app.use(OpenApiValidator.middleware(validatorOptions));
})();

// attaching error middleware


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

// attaching routes to swagger-router
(()  => {
    const apiDefinition = YAML.load(apiDefinitionFilePath);
    const connect = connector(api, apiDefinition);
    connect(app);
    const specs = swaggerJsDoc({
        swaggerDefinition: apiDefinition,
        apis: ["./controllers/*.ts"]
    });
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

})();


app.use(errorMiddleware);



app.listen(config.PORT, () => {
    console.log(`API server is listening on the http://${config.HOST}:${config.PORT}`);
});