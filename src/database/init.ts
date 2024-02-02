import { Dialect, Options, Sequelize } from "sequelize";
import config from "../config/config";
import { ToDo, ToDoFile, User } from "./models";


let sequelize: Sequelize;

const connectDB = () => {
    const dbConfig = config.NODE_ENV === "test" ? config.TEST_DB : config.DB;
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
        },
        logging: false,
        
    };
    sequelize = new Sequelize(sequelizeOptions);
    return sequelize;
};


export const initModels = (sequelize: Sequelize) => {
    User.initModel(sequelize);
    ToDo.initModel(sequelize);
    ToDoFile.initModel(sequelize);

    User.associcateModel();
    ToDo.associateModel();
    ToDoFile.associateModel();
};

export default connectDB;
