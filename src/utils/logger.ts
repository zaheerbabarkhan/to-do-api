
import { createLogger, format, transports } from "winston";
import config from "../config/config";

const { combine, timestamp, printf } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});
const logger = createLogger({
    format: combine(
        timestamp(),
        myFormat,
    ),
    transports: [
        new transports.File({ filename: "error.log", level: "error" }),
        new transports.File({ filename: "combined.log"})
    ]
});

if (config.NODE_ENV !== "production") {
    logger.add(new transports.Console({
    }));
}
export default logger;