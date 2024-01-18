import mysql, { RowDataPacket } from 'mysql2/promise';
import { cms_defs } from '../defs';
import { cms_types } from '../types';
import { mysql_utils } from './utils';


export class MySqlHandler {
    private static instance: MySqlHandler;
    private dbConnection: mysql.Connection;

    private constructor(dbConnection: mysql.Connection) { 
        this.dbConnection = dbConnection;
    }

    public static async getInstance(): Promise<MySqlHandler> {
        if (!MySqlHandler.instance) {
            const dbConnection = await mysql.createConnection({
                host: cms_defs.MYSQL_HOST,
                port: cms_defs.MYSQL_PORT,
                user: cms_defs.MYSQL_ROOT_USERNAME,
                ssl: {
                    ca: cms_defs.MYSQL_ROOT_CA
                },
                password: cms_defs.MYSQL_ROOT_PASSWORD,
                database: cms_defs.MYSQL_DB_NAME
            });

            MySqlHandler.instance = new MySqlHandler(dbConnection);
        }
        return MySqlHandler.instance;
    }

    private async _query(query: string): Promise<RowDataPacket | RowDataPacket[]> {
        const [results, fields] = await this.dbConnection.query<RowDataPacket[]>(query);
        return results.length > 1 ? results : results[0];
    }

    public async get(tableName: string, filter?: cms_types.mysql.MySqlFilterAny): Promise<RowDataPacket | RowDataPacket[]> {
        const query = mysql_utils.getSelectQuery(tableName, filter);
        return await this._query(query);
    }

    public async create(tableName: string, data: cms_types.models.ModelCommonObject): Promise<void> {
        const query = mysql_utils.getCreateQuery(tableName, data);
        await this._query(query);
    }

    public async update(tableName: string, data: cms_types.models.ModelCommonObject, filter: cms_types.mysql.MySqlFilterAny): Promise<void> {
        const query = mysql_utils.getUpdateQuery(tableName, data, filter);
        await this._query(query);
    }

    public async delete(tableName: string, filter: cms_types.mysql.MySqlFilterAny): Promise<void> {
        const query = mysql_utils.getDeleteQuery(tableName, filter);
        await this._query(query);
    }
}