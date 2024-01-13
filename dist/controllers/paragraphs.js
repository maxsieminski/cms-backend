"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParagraphsController = void 0;
const mySqlManager_1 = require("../mysql/mySqlManager");
const base_1 = require("./base");
class ParagraphsController extends base_1.BaseController {
    constructor() {
        super(...arguments);
        this._tableName = 'paragraphs';
    }
    static async getInstance() {
        const mySqlHandler = await mySqlManager_1.MySqlHandler.getInstance();
        if (!ParagraphsController._instance) {
            ParagraphsController._instance = new ParagraphsController(mySqlHandler);
        }
        return ParagraphsController._instance;
    }
}
exports.ParagraphsController = ParagraphsController;
