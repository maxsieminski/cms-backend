"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cms_exceptions = exports.cms_defs = void 0;
var cms_defs;
(function (cms_defs) {
    cms_defs.MYSQL_DB_NAME = process.env["MYSQL_DB_NAME"] ?? "cms";
    cms_defs.MYSQL_HOST = process.env["MYSQL_HOST"] ?? "localhost";
    cms_defs.MYSQL_PORT = Number.parseInt(process.env["MYSQL_PORT"] ?? "3306");
    cms_defs.MYSQL_ROOT_USERNAME = process.env["MYSQL_ROOT_USERNAME"] ?? "root";
    cms_defs.MYSQL_ROOT_PASSWORD = process.env["MYSQL_ROOT_PASSWORD"] ?? "spdspd12";
})(cms_defs || (exports.cms_defs = cms_defs = {}));
var cms_exceptions;
(function (cms_exceptions) {
    class InvalidDbFilterException extends Error {
        constructor(message) {
            super(message);
            this.message = message;
        }
    }
    cms_exceptions.InvalidDbFilterException = InvalidDbFilterException;
})(cms_exceptions || (exports.cms_exceptions = cms_exceptions = {}));
