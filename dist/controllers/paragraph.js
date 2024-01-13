"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParagraphsController = void 0;
const mySqlManager_1 = require("../mysql/mySqlManager");
class ParagraphsController {
    static async getInstance() {
        const mySqlHandler = await mySqlManager_1.MySqlHandler.getInstance();
        if (!ParagraphsController._instance) {
            ParagraphsController._instance = new ParagraphsController(mySqlHandler);
        }
        return ParagraphsController._instance;
    }
    constructor(mySqlHandler) {
        this._paragraphsTableName = 'paragraphs';
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
        return await this._mySqlHandler.get(this._paragraphsTableName, dbFilter);
    }
    async post(paragraph) {
        await this._mySqlHandler.create(this._paragraphsTableName, paragraph);
    }
    async patch(paragraph, filter) {
        const dbFilter = this._getFilter(filter);
        return await this._mySqlHandler.update(this._paragraphsTableName, paragraph, dbFilter);
    }
    async delete(filter) {
        const dbFilter = this._getFilter(filter);
        await this._mySqlHandler.delete(this._paragraphsTableName, dbFilter);
    }
}
exports.ParagraphsController = ParagraphsController;
