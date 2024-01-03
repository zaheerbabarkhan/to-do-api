import { Dialect, Options, Sequelize } from "sequelize";
import config from "../config/config";


let sequelize: Sequelize;

const connectDB = () => {
    const dbConfig = config.DB;

    if(sequelize && sequelize instanceof Sequelize) {
        return sequelize;
    }

    const sequelizeOptions: Options = {
        database: dbConfig.DB_NAME,
        host: dbConfig.DB_HOST,
        username: dbConfig.DB_USER,
        password: dbConfig.DB_PASSWORD,
        dialect: dbConfig.DB_DIALECT as Dialect,
        sync: {
            alter: dbConfig.DB_ALTER,
            force: dbConfig.DB_SYNC
        }
        
    };
    sequelize = new Sequelize(sequelizeOptions);
    return sequelize;
};

export default connectDB;
