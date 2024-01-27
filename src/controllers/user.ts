import { RowDataPacket } from "mysql2";
import { MySqlHandler } from "../mysql/mySqlManager";
import { cms_types } from "../types";
import { Encrypt } from "../utils";
import { BaseController } from "./base";
import * as bcrypt from 'bcrypt';

export class UsersController extends BaseController {
    protected static _instance: UsersController;
    override _tableName = 'users';

    public static async getInstance(): Promise<UsersController> {
        const mySqlHandler = await MySqlHandler.getInstance();

        if (!UsersController._instance) {
            UsersController._instance = new UsersController(mySqlHandler);
        }
        return UsersController._instance;
    }

    private constructor (mySqlHandler: MySqlHandler) {
        super(mySqlHandler);
    }

    public async post(model: cms_types.models.UserObject): Promise<void> {
        if (model.email && model.password) {
            model.password = await Encrypt.cryptPassword(model.password);
            await this._mySqlHandler.create(this._tableName, model);
        }
    }

    public async auth(model: cms_types.models.UserObject): Promise<any> {
        if (model.email && model.password) {
            const user = await this._mySqlHandler.get(this._tableName, {columnName: 'email', operand: '=', value: model.email}) as RowDataPacket;
            if (await Encrypt.comparePassword(model.password, user.password)) {
                return user
            }
            return {}
        }
    }
}