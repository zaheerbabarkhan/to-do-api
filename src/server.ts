import express from "express";
import config from "./config/config";
import sequelize, {initModels} from "./database/init";
import { Sequelize } from "sequelize";


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

app.get("/status-check", (req, res) => {
    if (!db) {
        res.status(500).send("Internal Server Error");
        return;
    }
    const data = {
        uptimeInSeconds: Math.floor(process.uptime()),
        message: "Ok",
        date: new Date()
    };
    res.status(200).send(data);
});


app.listen(config.PORT, () => {
    console.log(`API server is listening on the http://${config.HOST}:${config.PORT}`);
});