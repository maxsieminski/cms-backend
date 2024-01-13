"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InquriesController = void 0;
const mySqlManager_1 = require("../mysql/mySqlManager");
const base_1 = require("./base");
class InquriesController extends base_1.BaseController {
    static async getInstance() {
        const mySqlHandler = await mySqlManager_1.MySqlHandler.getInstance();
        if (!InquriesController._instance) {
            InquriesController._instance = new InquriesController(mySqlHandler);
        }
        return InquriesController._instance;
    }
    constructor(mySqlHandler) {
        super(mySqlHandler);
        this._tableName = 'inquiries';
    }
}
exports.InquriesController = InquriesController;
