import { Sequelize } from "sequelize";
import sequelize, { initModels } from "../database/init";
import config from "../config/config";

let db: Sequelize;

beforeAll(async () => {
    db = sequelize();
    await db.authenticate();
    initModels(db);
    config.NODE_ENV === "test" && await db.sync({
        force: true,
        alter: true
    });
});


afterAll(async () => {
    // Close the database connection after all tests
    await db.close();
});