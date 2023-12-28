import express from "express";
import config from "./config/config";

const app = express();

app.get("/status-check", (req, res) => {
    res.send("Health check successfull");
});


app.listen(config.PORT, () => {
    console.log(`API server is listening on the http://${config.HOST}:${config.PORT}`);
});