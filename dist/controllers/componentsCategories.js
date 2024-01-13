"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentsCategoriesController = void 0;
const mySqlManager_1 = require("../mysql/mySqlManager");
const base_1 = require("./base");
class ComponentsCategoriesController extends base_1.BaseController {
    static async getInstance() {
        const mySqlHandler = await mySqlManager_1.MySqlHandler.getInstance();
        if (!ComponentsCategoriesController._instance) {
            ComponentsCategoriesController._instance = new ComponentsCategoriesController(mySqlHandler);
        }
        return ComponentsCategoriesController._instance;
    }
    constructor(mySqlHandler) {
        super(mySqlHandler);
        this._tableName = 'components_categories';
    }
}
exports.ComponentsCategoriesController = ComponentsCategoriesController;
