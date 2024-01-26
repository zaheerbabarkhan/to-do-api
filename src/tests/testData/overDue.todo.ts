import status from "../../constants/status";
import { ToDoInput } from "../../database/models";

export default [
    {
        "title": "Pending ToDo 1",
        "description": "Description for Pending ToDo 1",
        "dueDate": new Date("2024-01-23T00:00:00.000Z"),
        "statusId": status.PENDING,
        "completedAt": null
    },
    {
        "title": "Pending ToDo 2",
        "description": "Description for Pending ToDo 2",
        "dueDate": new Date("2024-01-23T00:00:00.000Z"),
        "statusId": status.PENDING,
        "completedAt": null
    },
    {
        "title": "Pending ToDo 3",
        "description": "Description for Pending ToDo 3",
        "dueDate": new Date("2024-01-23T00:00:00.000Z"),
        "statusId": status.PENDING,
        "completedAt": null
    },
    {
        "title": "Pending ToDo 4",
        "description": "Description for Pending ToDo 4",
        "dueDate": new Date("2024-01-23T00:00:00.000Z"),
        "statusId": status.PENDING,
        "completedAt": null
    },
    {
        "title": "Pending ToDo 5",
        "description": "Description for Pending ToDo 5",
        "dueDate": new Date("2024-01-23T00:00:00.000Z"),
        "statusId": status.PENDING,
        "completedAt": null
    },
    {
        "title": "Completed ToDo 1",
        "description": "Description for Completed ToDo 1",
        "dueDate": new Date("2024-01-23T14:35:45.548Z"),
        "statusId": status.COMPLETED,
        "completedAt": new Date("2024-01-24T14:35:45.548Z")
    },
    {
        "title": "Completed ToDo 2",
        "description": "Description for Completed ToDo 2",
        "dueDate": new Date("2024-01-23T14:35:45.548Z"),
        "statusId": status.COMPLETED,
        "completedAt": new Date("2024-01-24T14:35:45.548Z")
    }
] as ToDoInput[];
  