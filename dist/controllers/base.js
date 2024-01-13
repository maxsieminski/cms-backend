"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseController = void 0;
const mySqlManager_1 = require("../mysql/mySqlManager");
class BaseController {
    static async getInstance() {
        const mySqlHandler = await mySqlManager_1.MySqlHandler.getInstance();
        if (!BaseController._instance) {
            BaseController._instance = new BaseController(mySqlHandler);
        }
        return BaseController._instance;
    }
    constructor(mySqlHandler) {
        this._tableName = '';
        this._mySqlHandler = mySqlHandler;
    }
    _getFilter(filter) {
        if (!filter) {
            return undefined;
        }
        const dbFilter = Object.keys(filter).map((key) => {
            ;
            return {
                columnName: key,
                operand: '=',
                value: filter[key]
            };
        });
        return dbFilter.length > 1 ? dbFilter : dbFilter[0];
    }
    async get(filter) {
        const dbFilter = this._getFilter(filter);
        return await this._mySqlHandler.get(this._tableName, dbFilter);
    }
    async getLatest() {
        return await this._mySqlHandler.get(this._tableName, { columnName: 'id', operand: 'MAX', value: 0 });
    }
    async post(model) {
        await this._mySqlHandler.create(this._tableName, model);
    }
    async patch(model, filter) {
        const dbFilter = this._getFilter(filter);
        await this._mySqlHandler.update(this._tableName, model, dbFilter);
    }
    async delete(filter) {
        const dbFilter = this._getFilter(filter);
        await this._mySqlHandler.delete(this._tableName, dbFilter);
    }
}
exports.BaseController = BaseController;
