import { Model, Optional, DataTypes, Sequelize } from "sequelize";
import status from "../../constants/status";

export interface UserAttributes {
    id: number,
    firstName: string,
    lastName: string,
    email: string,
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
    public password!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public static initModel(sequelize: Sequelize) {
        User.init({
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                field: "id",
                autoIncrement: true,
                primaryKey: true
            },
            firstName: {
                type: DataTypes.STRING(20),
                field: "fitrst_name",
                allowNull: false,
            },
            lastName: {
                type: DataTypes.STRING(20),
                field: "last_name",
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING(250),
                field: "email",
                allowNull: false,
                unique: true
            },
            password: {
                type: DataTypes.STRING,
                field: "password",
                allowNull: false
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
        });
        
    }
}

export default User;