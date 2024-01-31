import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { ToDo } from "./";
export interface FileAttributes {
    id: number;
    title: string;
    todoId: number;

    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}


export interface FileInput extends Optional<FileAttributes, "id"> {}
export interface FileOutput extends Required<FileAttributes> {}

export class ToDoFile extends Model {
    public id!: number;
    public title!: string;
    public todoId!: number;

    public createdAt!: Date;
    public updatedAt!: Date;
    public deletedAt!: Date;

    public static initModel(sequelize: Sequelize) {
        ToDoFile.init({
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
            todoId: {
                type: DataTypes.INTEGER.UNSIGNED,
                field: "todo_id",
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
            tableName: "todos_files"
        });
    }

    public static associateModel() {
        ToDoFile.belongsTo(ToDo, {
            foreignKey: "todoId",
            as: "Files"
        });
    }

}

export default ToDoFile;