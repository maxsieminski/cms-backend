"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataHandler = void 0;
const mysql_1 = require("./mysql");
class DataHandler {
    constructor(tableName) {
        this.tableName = tableName;
    }
    async getItemFull() {
        return (await mysql_1.MySqlHandler.getInstance()).readTable(this.tableName);
    }
    async getItemsFiltered(columnName, value) {
        return (await mysql_1.MySqlHandler.getInstance()).readTable(this.tableName, {
            columnName,
            operand: '=',
            value
        });
    }
    ;
    async getItemById(item_id) {
        return (await mysql_1.MySqlHandler.getInstance()).readTable(this.tableName, {
            columnName: "id",
            operand: "=",
            value: item_id,
        });
    }
    ;
    async createItem(item) {
        return ((await mysql_1.MySqlHandler.getInstance()).writeToTable(this.tableName, item));
    }
}
exports.DataHandler = DataHandler;
