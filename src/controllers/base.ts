import { MySqlHandler } from "../mysql/mySqlManager";
import { cms_types } from "../types";

export class BaseController {
    protected static _instance: BaseController;
    protected _mySqlHandler: MySqlHandler;
    protected _tableName = '';


    public static async getInstance(): Promise<BaseController> {
        const mySqlHandler = await MySqlHandler.getInstance();

        if (!BaseController._instance) {
            BaseController._instance = new BaseController(mySqlHandler);
        }
        return BaseController._instance;
    }

    protected constructor (mySqlHandler: MySqlHandler) {
        this._mySqlHandler = mySqlHandler;
    }

    protected _getFilter(filter?: Partial<cms_types.models.ModelCommonObject>): cms_types.mysql.MySqlFilterAny | undefined {
        if (!filter) {
            return undefined;
        }

        const dbFilter: cms_types.mysql.MySqlFilterAny = Object.keys(filter).map((key: string) => {;
            return {
                columnName: key,
                operand: '=',
                value: filter[key as keyof cms_types.models.ModelCommonObject]
            }
        });

        return dbFilter.length > 1 ? dbFilter : dbFilter[0];
    }

    public async get(filter?: Partial<cms_types.models.ModelCommonObject>): Promise<cms_types.models.ModelCommonObjectAny> {
        const dbFilter = this._getFilter(filter);
        return await this._mySqlHandler.get(this._tableName, dbFilter) as unknown as cms_types.models.ModelCommonObjectAny;
    }

    public async getLatest(): Promise<cms_types.models.ModelCommonObject> {
        return await this._mySqlHandler.get(this._tableName, { columnName: 'id', operand: 'MAX', value: 0 }) as unknown as cms_types.models.ModelCommonObject;
    }

    public async post(model: cms_types.models.ModelCommonObject): Promise<void> {
        await this._mySqlHandler.create(this._tableName, model);
    }

    public async patch(model: cms_types.models.ModelCommonObject, filter: Partial<cms_types.models.ModelCommonObject>): Promise<void> {
        const dbFilter = this._getFilter(filter);
        await this._mySqlHandler.update(this._tableName, model, dbFilter!) as unknown as cms_types.models.ModelCommonObjectAny;
    }

    public async delete(filter: Partial<cms_types.models.ModelCommonObject>): Promise<void> {
        const dbFilter = this._getFilter(filter);
        await this._mySqlHandler.delete(this._tableName, dbFilter!);
    }
}