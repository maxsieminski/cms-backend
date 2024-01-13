import { MySqlHandler } from "../mysql/mySqlManager";
import { BaseController } from "./base";

export class SectionComponentsController extends BaseController {
    protected static _instance: SectionComponentsController;
    override _tableName = 'sections_components';

    public static async getInstance(): Promise<SectionComponentsController> {
        const mySqlHandler = await MySqlHandler.getInstance();

        if (!SectionComponentsController._instance) {
            SectionComponentsController._instance = new SectionComponentsController(mySqlHandler);
        }
        return SectionComponentsController._instance;
    }

    private constructor (mySqlHandler: MySqlHandler) {
        super(mySqlHandler);
    }
}