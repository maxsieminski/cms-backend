"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swaggerJson = __importStar(require("./swagger.json"));
const helmet_1 = __importDefault(require("helmet"));
const paragraphs_1 = __importDefault(require("./routers/paragraphs"));
const components_1 = __importDefault(require("./routers/components"));
const sections_1 = __importDefault(require("./routers/sections"));
const inquries_1 = __importDefault(require("./routers/inquries"));
const pages_1 = __importDefault(require("./routers/pages"));
const app = (0, express_1.default)();
const port = process.env["PORT"] || 3000;
async function main() {
    app.use((0, cors_1.default)());
    app.use((0, helmet_1.default)());
    app.use('/paragraphs', paragraphs_1.default);
    app.use('/components', components_1.default);
    app.use('/sections', sections_1.default);
    app.use('/pages', pages_1.default);
    app.use('/inquries', inquries_1.default);
    app.use('/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerJson));
    app.listen(port, () => {
        console.log(`Server is listening on port ${port}`);
    });
}
exports.default = main;
main();
