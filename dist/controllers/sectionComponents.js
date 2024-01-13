"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SectionComponentsController = void 0;
const mySqlManager_1 = require("../mysql/mySqlManager");
const base_1 = require("./base");
class SectionComponentsController extends base_1.BaseController {
    static async getInstance() {
        const mySqlHandler = await mySqlManager_1.MySqlHandler.getInstance();
        if (!SectionComponentsController._instance) {
            SectionComponentsController._instance = new SectionComponentsController(mySqlHandler);
        }
        return SectionComponentsController._instance;
    }
    constructor(mySqlHandler) {
        super(mySqlHandler);
        this._tableName = 'sections_components';
    }
}
exports.SectionComponentsController = SectionComponentsController;
