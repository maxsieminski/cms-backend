import { MySqlHandler } from "../mysql/mySqlManager";
import { BaseController } from "./base";

export class ComponentsCategoriesController extends BaseController {
    protected static _instance: ComponentsCategoriesController;
    override _tableName = 'components_categories';

    public static async getInstance(): Promise<ComponentsCategoriesController> {
        const mySqlHandler = await MySqlHandler.getInstance();

        if (!ComponentsCategoriesController._instance) {
            ComponentsCategoriesController._instance = new ComponentsCategoriesController(mySqlHandler);
        }
        return ComponentsCategoriesController._instance;
    }

    private constructor (mySqlHandler: MySqlHandler) {
        super(mySqlHandler);
    }
}