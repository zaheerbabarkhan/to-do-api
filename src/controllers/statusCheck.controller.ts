import { Response, Request } from "express";
import sequelize from "../database/init";
export const healthCheck = async (_req: Request, res: Response) => {
    const db = sequelize();
    const [result] = await db.query("SELECT 1+1 as result");
    if(!result) {
        res.status(500).send("Internal Server Error");
    }
    const data = {
        uptimeInSeconds: Math.floor(process.uptime()),
        message: "Ok",
        date: new Date()
    };
    res.status(200).send(data);
};