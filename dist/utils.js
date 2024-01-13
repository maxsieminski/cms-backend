"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cms_utils = void 0;
const dataHandler_1 = require("./dataHandler");
var cms_utils;
(function (cms_utils) {
    cms_utils.getDataHandler = (requestHref) => {
        switch (requestHref) {
            case "paragraphs":
                return new dataHandler_1.DataHandler("paragraphs");
            case "components":
                return new dataHandler_1.DataHandler("components");
            case "sections":
                return new dataHandler_1.DataHandler("sections");
            case "pages":
                return new dataHandler_1.DataHandler("pages");
            default:
                throw "Invalid path selected!";
        }
    };
})(cms_utils || (exports.cms_utils = cms_utils = {}));
