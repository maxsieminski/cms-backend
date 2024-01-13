"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mysql_utils = void 0;
var mysql_utils;
(function (mysql_utils) {
    const getFilterQuery = (filter) => {
        if (!filter) {
            return "";
        }
        if (Array.isArray(filter)) {
            const filtersGrouped = Object.keys(filter).map((key) => {
                const _key = key;
                if (typeof (filter[_key].value) === 'string') {
                    return `${key} ${filter[_key].operand} "${filter[_key].value}"`;
                }
                return `${key} ${filter[_key].operand} ${filter[_key].value}`;
            }).join(' AND ');
            return `WHERE ${filtersGrouped}`;
        }
        if (filter.operand == 'MAX') {
            return `ORDER BY ${filter.columnName} DESC LIMIT 1`;
        }
        if (typeof (filter.value) === 'string') {
            return `WHERE ${filter.columnName} ${filter.operand} "${filter.value}"`;
        }
        return `WHERE ${filter.columnName} ${filter.operand} ${filter.value}`;
    };
    mysql_utils.getUpdateQuery = (tableName, data, filter) => {
        const fieldsToUpdate = Object.keys(data).map((key) => {
            const _key = key;
            const _value = data[_key];
            if (typeof _value === 'string') {
                return `${_key} = "${_value}"`;
            }
            return `${_key} = ${_value}`;
        }).join(', ');
        return `UPDATE ${tableName} SET ${fieldsToUpdate} ${getFilterQuery(filter)}`;
    };
    mysql_utils.getSelectQuery = (tableName, filter) => {
        return `SELECT * FROM ${tableName} ${getFilterQuery(filter)}`;
    };
    mysql_utils.getCreateQuery = (tableName, data) => {
        const columnsProvided = Object.keys(data).join(', ');
        const valuesProvided = Object.values(data).map((value) => typeof value === 'string' ? `\'${value}\'` : value).join(', ');
        return `INSERT INTO ${tableName} (${columnsProvided}) VALUES (${valuesProvided})`;
    };
    mysql_utils.getDeleteQuery = (tableName, filter) => {
        return `DELETE FROM ${tableName} ${getFilterQuery(filter)}`;
    };
})(mysql_utils || (exports.mysql_utils = mysql_utils = {}));
