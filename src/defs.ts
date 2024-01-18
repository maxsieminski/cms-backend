export module cms_defs {
    export const MYSQL_DB_NAME = process.env["MYSQL_DB_NAME"] ?? "cms";
    export const MYSQL_HOST = process.env["MYSQL_HOST"] ?? "localhost";
    export const MYSQL_PORT = Number.parseInt(process.env["MYSQL_PORT"] ?? "3306");
    export const MYSQL_ROOT_USERNAME = process.env["MYSQL_ROOT_USERNAME"] ?? "root";
    export const MYSQL_ROOT_PASSWORD = process.env["MYSQL_ROOT_PASSWORD"] ?? "spdspd12";
    export const MYSQL_ROOT_CA = process.env["MYSQL_ROOT_CA"] ?? "";
}

export module cms_exceptions {
    export class InvalidDbFilterException extends Error {
        constructor (public message: string) {
            super(message);
        }
    }
}
