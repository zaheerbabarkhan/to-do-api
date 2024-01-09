import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import status from "../../constants/status";
import { User } from "./";
export interface ToDoAttributes {
    id: number;
    title: string;
    description: string;
    dueDatetime: Date;
    statusId: number;
    userId: number;

    createdAt: Date
    updatedAt: Date
    deletedAt: Date
}


export interface ToDoInput extends Optional<ToDoAttributes, "id"> {}
export interface ToDoOutput extends Required<ToDoAttributes> {}

export class ToDo extends Model {
    public id!: number;
    public title!: string;
    public description!: string;
    public dueDatetime!: Date;
    public statusId!: number;
    public userId!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date;

    public static initModel(sequelize: Sequelize) {
        ToDo.init({
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                field: "id",
                autoIncrement: true,
                primaryKey: true,
            },
            title: {
                type: DataTypes.STRING(255),
                field: "title",
                allowNull: false,
            },
            description: {
                type: DataTypes.TEXT("medium"), // Adjust the length as needed
                field: "description",
                allowNull: true,
            },
            dueDatetime: {
                type: DataTypes.DATE,
                field: "due_datetime",
                allowNull: false,
            },
            statusId: {
                type: DataTypes.INTEGER.UNSIGNED,
                field: "status_id",
                allowNull: false,
                defaultValue: status.PENDING,
            },
            userId: {
                type: DataTypes.INTEGER.UNSIGNED,
                field: "user_id",
                allowNull: false,
            },
            createdAt: {
                type: DataTypes.DATE,
                field: "created_at",
                allowNull: false,
            },
            updatedAt: {
                type: DataTypes.DATE,
                field: "updated_at",
                allowNull: false,
            },
            deletedAt: {
                type: DataTypes.DATE,
                field: "deleted_at",
            },
        }, {
            timestamps: true,
            paranoid: true, // Enable soft deletion
            deletedAt: "deletedAt", // Specify the field name for soft deletion
            sequelize,
            tableName: "todos"
        });
    }

    public static associateModel() {
        ToDo.belongsTo(User, {
            foreignKey: "userId",
            as: "user"
        });
    }

}

export default ToDo;