import { Response, Request } from "express";
import sequelize from "../database/init";
import httpStatus from "http-status";

export const healthCheck = async (_req: Request, res: Response) => {
    const db = sequelize();
    const [result] = await db.query("SELECT 1+1 as result");
    if(!result) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send("Internal Server Error");
    }
    const data = {
        uptimeInSeconds: Math.floor(process.uptime()),
        message: "Ok",
        date: new Date()
    };
    res.status(httpStatus.OK).send(data);
};