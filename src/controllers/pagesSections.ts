import { MySqlHandler } from "../mysql/mySqlManager";
import { cms_types } from "../types";
import { BaseController } from "./base";

export class PageSectionsController extends BaseController {
    protected static _instance: PageSectionsController;
    override _tableName = 'pages_sections';

    public static async getInstance(): Promise<PageSectionsController> {
        const mySqlHandler = await MySqlHandler.getInstance();

        if (!PageSectionsController._instance) {
            PageSectionsController._instance = new PageSectionsController(mySqlHandler);
        }
        return PageSectionsController._instance;
    }

    override async get(filter?: Partial<cms_types.models.PageSectionsObject>): Promise<cms_types.models.ModelCommonObjectAny> {
        const dbFilter = this._getFilter(filter);
        return await this._mySqlHandler.get(this._tableName, dbFilter) as unknown as cms_types.models.ModelCommonObjectAny;
    }

    private constructor (mySqlHandler: MySqlHandler) {
        super(mySqlHandler);
    }
}