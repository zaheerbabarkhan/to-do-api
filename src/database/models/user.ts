import { Model, Optional, DataTypes, Sequelize } from "sequelize";
import status from "../../constants/status";
import { ToDo } from "./";
import { AccountType } from "../../types/user.types";

export interface UserAttributes {
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    accountType: AccountType
    password: string,
    statusId: number,
    createdAt: Date,
    updatedAt: Date,
}

export interface UserInput extends Optional<UserAttributes, "id"> {}
export interface UserOutput extends Required<UserAttributes> {}

export class User extends Model {
    
    public id!: number;
    public firstName!: string;
    public lastName!: string;
    public email!: string;
    public accountType!: AccountType;
    public password!: string;
    public statusId!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public static initModel(sequelize: Sequelize) {
        User.init({
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                field: "id",
                autoIncrement: true,
                primaryKey: true,
            },
            firstName: {
                type: DataTypes.STRING(20),
                field: "first_name",
                allowNull: false,
            },
            lastName: {
                type: DataTypes.STRING(20),
                field: "last_name",
                allowNull: true,
            },
            email: {
                type: DataTypes.STRING(250),
                field: "email",
                allowNull: false,
                unique: true
            },
            accountType: {
                type: DataTypes.STRING(10),
                field: "account_type",
                allowNull: false,
                defaultValue: AccountType.APP
            },
            password: {
                type: DataTypes.STRING,
                field: "password",
                allowNull: true
            },
            statusId: {
                type: DataTypes.SMALLINT,
                field: "status_id",
                allowNull: false,
                defaultValue: status.PENDING
            }
        }, {
            timestamps: true,
            sequelize,
            tableName: "users"
        });
        
    }

    public static associcateModel() {
        User.hasMany(ToDo, {
            foreignKey: "userId",
            as: "todos"
        });
    }
}

export default User;