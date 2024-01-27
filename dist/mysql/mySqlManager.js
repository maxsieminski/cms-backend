"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MySqlHandler = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const defs_1 = require("../defs");
const utils_1 = require("./utils");
class MySqlHandler {
    constructor(dbConnection) {
        this.dbConnection = dbConnection;
    }
    static async getInstance() {
        if (!MySqlHandler.instance) {
            const connectionParams = {
                host: defs_1.cms_defs.MYSQL_HOST,
                port: defs_1.cms_defs.MYSQL_PORT,
                user: defs_1.cms_defs.MYSQL_ROOT_USERNAME,
                password: defs_1.cms_defs.MYSQL_ROOT_PASSWORD,
                database: defs_1.cms_defs.MYSQL_DB_NAME
            };
            const ca = defs_1.cms_defs.MYSQL_ROOT_CA;
            if (ca) {
                connectionParams['ssl'] = { ca };
            }
            const dbConnection = await promise_1.default.createConnection(connectionParams);
            MySqlHandler.instance = new MySqlHandler(dbConnection);
        }
        return MySqlHandler.instance;
    }
    async _query(query) {
        const [results, fields] = await this.dbConnection.query(query);
        return results.length > 1 ? results : results[0];
    }
    async get(tableName, filter) {
        const query = utils_1.mysql_utils.getSelectQuery(tableName, filter);
        return await this._query(query);
    }
    async create(tableName, data) {
        const query = utils_1.mysql_utils.getCreateQuery(tableName, data);
        await this._query(query);
    }
    async update(tableName, data, filter) {
        const query = utils_1.mysql_utils.getUpdateQuery(tableName, data, filter);
        await this._query(query);
    }
    async delete(tableName, filter) {
        const query = utils_1.mysql_utils.getDeleteQuery(tableName, filter);
        await this._query(query);
    }
}
exports.MySqlHandler = MySqlHandler;
