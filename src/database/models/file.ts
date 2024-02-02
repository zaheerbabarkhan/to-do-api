import { DataTypes, Model, Op, Optional, Sequelize } from "sequelize";
import { ToDo } from "./";
import s3Service from "../../services/s3.service";
import status from "../../constants/status";
export interface FileAttributes {
    id: number;
    title: string;
    todoId: number;
    statusID: number;
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
    public statusId!: number;

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
            statusId: {
                type: DataTypes.INTEGER.UNSIGNED,
                field: "status_id",
                allowNull: false,
                defaultValue: status.PENDING,
            },
            signedUrl: {
                type: DataTypes.VIRTUAL,
                get() {
                    if (!(this.getDataValue("title"))) return "";
                        
                    return s3Service.getSignedUrl(this.getDataValue("title"));
                },
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
            paranoid: true, 
            deletedAt: "deletedAt",
            sequelize,
            tableName: "todos_files"
        });
        ToDoFile.addScope("defaultScope", {
            where: {
                statusId: {
                    [Op.ne]: status.DELETED
                }
            },
            attributes: {
                exclude: ["createdAt", "deletedAt", "updatedAt"]
            }
        });
    }

    public static associateModel() {
        ToDoFile.belongsTo(ToDo, {
            foreignKey: "todoId",
            as: "todo"
        });
    }

}

export default ToDoFile;