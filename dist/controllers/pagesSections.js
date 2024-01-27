"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageSectionsController = void 0;
const mySqlManager_1 = require("../mysql/mySqlManager");
const base_1 = require("./base");
class PageSectionsController extends base_1.BaseController {
    static async getInstance() {
        const mySqlHandler = await mySqlManager_1.MySqlHandler.getInstance();
        if (!PageSectionsController._instance) {
            PageSectionsController._instance = new PageSectionsController(mySqlHandler);
        }
        return PageSectionsController._instance;
    }
    async get(filter) {
        const dbFilter = this._getFilter(filter);
        return await this._mySqlHandler.get(this._tableName, dbFilter);
    }
    constructor(mySqlHandler) {
        super(mySqlHandler);
        this._tableName = 'pages_sections';
    }
}
exports.PageSectionsController = PageSectionsController;
