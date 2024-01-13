import { MySqlHandler } from "../mysql/mySqlManager";
import { BaseController } from "./base";

export class InquriesController extends BaseController {
    protected static _instance: InquriesController;
    override _tableName = 'inquiries';

    public static async getInstance(): Promise<InquriesController> {
        const mySqlHandler = await MySqlHandler.getInstance();

        if (!InquriesController._instance) {
            InquriesController._instance = new InquriesController(mySqlHandler);
        }
        return InquriesController._instance;
    }

    private constructor (mySqlHandler: MySqlHandler) {
        super(mySqlHandler);
    }
}