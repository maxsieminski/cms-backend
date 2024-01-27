import { RowDataPacket } from "mysql2";
import { MySqlHandler } from "../mysql/mySqlManager";
import { cms_types } from "../types";
import { Encrypt } from "../utils";
import { BaseController } from "./base";
import * as bcrypt from 'bcrypt';

export class ConfigController extends BaseController {
    protected static _instance: ConfigController;
    override _tableName = 'config';

    public static async getInstance(): Promise<ConfigController> {
        const mySqlHandler = await MySqlHandler.getInstance();

        if (!ConfigController._instance) {
            ConfigController._instance = new ConfigController(mySqlHandler);
        }
        return ConfigController._instance;
    }

    private constructor (mySqlHandler: MySqlHandler) {
        super(mySqlHandler);
    }

    override async get(): Promise<cms_types.models.ConfigObject> {
        return await this._mySqlHandler.get('config', {columnName: 'id', operand: '=', value: 1}) as cms_types.models.ConfigObject;
    }
}