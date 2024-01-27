import mysql from "mysql2/promise";
import { cms_types } from "../types";

export module mysql_utils {
    const getFilterQuery = (filter?: cms_types.mysql.MySqlFilterAny): string => {
        if (!filter) {
            return ""
        }
        
        if (Array.isArray(filter)) {
            const filtersGrouped = Object.keys(filter).map((key) => {
                const _key = key as keyof cms_types.mysql.MySqlFilterAny;
                if (typeof(filter[_key].value) === 'string') {
                    return `${key} ${filter[_key].operand} ${mysql.escape(filter[_key].value)}`
                }
                return `${key} ${filter[_key].operand} ${filter[_key].value}`
            }).join(' AND ');
            
            return `WHERE ${filtersGrouped}`;
        }

        if (filter.operand == 'MAX') {
            return `ORDER BY ${filter.columnName} DESC LIMIT 1`;
        }

        if (typeof(filter.value) === 'string') {
            return `WHERE ${filter.columnName} ${filter.operand} ${mysql.escape(filter.value)}`
        }
        
        return `WHERE ${filter.columnName} ${filter.operand} ${mysql.escape(filter.value)}`
    };

    export const getUpdateQuery = (tableName: string, data: cms_types.models.ModelCommonObject, filter: cms_types.mysql.MySqlFilterAny): string => {        
        const fieldsToUpdate = Object.keys(data).map((key) => {
            const _key = key as keyof cms_types.models.ModelCommonObject;
            const _value = data[_key];

            if (typeof _value === 'string') {
                return `${_key} = "${_value}"`;
            }
            return `${_key} = ${_value}`;
        }).join(', ');

        return `UPDATE ${tableName} SET ${fieldsToUpdate} ${getFilterQuery(filter)}`;
    }

    export const getSelectQuery = (tableName: string, filter?: cms_types.mysql.MySqlFilterAny): string => {
        return `SELECT * FROM ${tableName} ${getFilterQuery(filter)}`
    }

    export const getCreateQuery = (tableName: string, data: cms_types.models.ModelCommonObject): string => {
        const columnsProvided = Object.keys(data).join(', ');
        // const valuesProvided = Object.values(data).map((value) => typeof value === 'string' ? `\'${value}\'` : value).join(', ');
        const valuesProvided = Object.values(data).map((value) => mysql.escape(value));


        return `INSERT INTO ${tableName} (${columnsProvided}) VALUES (${valuesProvided})`
    }

    export const getDeleteQuery = (tableName: string, filter: cms_types.mysql.MySqlFilterAny): string => {
        return `DELETE FROM ${tableName} ${getFilterQuery(filter)}`;
    }
}
