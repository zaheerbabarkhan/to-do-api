import { DataTypes, Model, Op, Optional, Sequelize } from "sequelize";
import status from "../../constants/status";
import { ToDoFile, User } from "./";
export interface ToDoAttributes {
    id: number;
    title: string;
    description: string;
    dueDate: Date;
    statusId: number;
    completedAt: Date;
    userId: number;

    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}


export interface ToDoInput extends Optional<ToDoAttributes, "id"> {}
export interface ToDoOutput extends Required<ToDoAttributes> {}

export class ToDo extends Model {
    public id!: number;
    public title!: string;
    public description!: string;
    public dueDate!: Date;
    public statusId!: number;
    public completedAt!: Date;
    public userId!: number;

    public createdAt!: Date;
    public updatedAt!: Date;
    public deletedAt!: Date;

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
                type: DataTypes.STRING(1000), // Adjust the length as needed
                field: "description",
                allowNull: true,
            },
            dueDate: {
                type: DataTypes.DATE,
                field: "due_date",
                allowNull: false,
            },
            statusId: {
                type: DataTypes.INTEGER.UNSIGNED,
                field: "status_id",
                allowNull: false,
                defaultValue: status.PENDING,
            },
            completedAt: {
                type: DataTypes.DATE,
                field: "completed_at",
                allowNull: true,
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

        ToDo.addScope("defaultScope", {
            where: {
                statusId: {
                    [Op.ne]: status.DELETED
                }
            },
            attributes: {
                exclude: ["createdAt", "deletedAt", "updatedAt"]
            }
        }, {
            override: true,
        });
    }

    public static associateModel() {
        ToDo.belongsTo(User, {
            foreignKey: "userId",
            as: "user"
        });
        ToDo.hasMany(ToDoFile, {
            foreignKey: "todoId",
            as: "files"
        });
    }

}

export default ToDo;