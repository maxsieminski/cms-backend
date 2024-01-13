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
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const bodyParser = __importStar(require("body-parser"));
const dataHandler_1 = require("./dataHandler");
const parser = bodyParser.json();
const paragraphsRouter = express.Router();
const handler = new dataHandler_1.DataHandler('paragraphs');
paragraphsRouter.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});
paragraphsRouter.get('/', async (req, res) => {
    res.send(await handler.getItemFull());
});
paragraphsRouter.post('/', parser, async (req, res) => {
    const body = req.body;
    if (!body) {
        res.statusCode = 400;
        res.send("Data is not valid");
    }
    try {
        await handler.createItem(body);
        res.send(body);
    }
    catch (err) {
        res.statusCode = 500;
        res.send(err);
    }
});
exports.default = paragraphsRouter;
