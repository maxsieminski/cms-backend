import { MySqlHandler } from "../mysql/mySqlManager";
import { BaseController } from "./base";

export class ParagraphsController extends BaseController {
    protected static _instance: ParagraphsController;
    override _tableName = 'paragraphs';

    public static async getInstance(): Promise<ParagraphsController> {
        const mySqlHandler = await MySqlHandler.getInstance();

        if (!ParagraphsController._instance) {
            ParagraphsController._instance = new ParagraphsController(mySqlHandler);
        }
        return ParagraphsController._instance;
    }
}