import { MySqlHandler } from "../mysql/mySqlManager";
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

    private constructor (mySqlHandler: MySqlHandler) {
        super(mySqlHandler);
    }
}