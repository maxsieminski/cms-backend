"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MySqlHandler = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const defs_1 = require("./defs");
class MySqlHandler {
    constructor(dbConnection) {
        this.dbConnection = dbConnection;
    }
    static async getInstance() {
        if (!MySqlHandler.instance) {
            const dbConnection = await promise_1.default.createConnection({
                host: defs_1.cms_defs.MYSQL_HOST,
                port: defs_1.cms_defs.MYSQL_PORT,
                user: defs_1.cms_defs.MYSQL_ROOT_USERNAME,
                password: defs_1.cms_defs.MYSQL_ROOT_PASSWORD,
                database: defs_1.cms_defs.MYSQL_DB_NAME
            });
            MySqlHandler.instance = new MySqlHandler(dbConnection);
        }
        return MySqlHandler.instance;
    }
    buildSelectQuery(tableName, filter) {
        if (!filter) {
            return `SELECT * FROM ${tableName};`;
        }
        if (!Array.isArray(filter.value)) {
            return `SELECT * FROM ${tableName} WHERE ${filter.columnName} ${filter.operand} ${filter.value};`;
        }
        return `SELECT * FROM ${tableName} WHERE ${filter.columnName} IN (${filter.value});`;
    }
    async readTable(tableName, filter) {
        const query = this.buildSelectQuery(tableName, filter);
        const [results, fields] = await this.dbConnection.query(query);
        return (results);
    }
    async writeToTable(tableName, data) {
        const query = `INSERT INTO ${tableName} (${Object.keys(data).join(', ')}) VALUES (${Object.values(data).join(', ')})`;
        const [results, fields] = await this.dbConnection.query(query);
        return results;
    }
}
exports.MySqlHandler = MySqlHandler;
