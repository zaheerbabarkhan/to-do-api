import express from "express";
import config from "./config/config";

const app = express();

app.get("/status-check", (req, res) => {
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