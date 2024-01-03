import express from "express";
import config from "./config/config";
import sequelize, {initModels} from "./database/init";
import { Sequelize } from "sequelize";
import YAML from "yamljs";
import { connector} from "swagger-routes-express";
import * as api from "./controllers";
import path from "path";

const app = express();

let db: Sequelize;
(async () =>  {

    try {
        db = sequelize();
        await db.authenticate();
        initModels(db);
        config.NODE_ENV === "development" && await db.sync();
    } catch (error) {
        console.log("DB Connection erorr:", error);
    }

})();

// attaching routes to swagger-router
(()  => {
    const apiDefinition = YAML.load(path.join(__dirname, "api.yml"));
    const connect = connector(api, apiDefinition);
    connect(app);
})();


app.listen(config.PORT, () => {
    console.log(`API server is listening on the http://${config.HOST}:${config.PORT}`);
});