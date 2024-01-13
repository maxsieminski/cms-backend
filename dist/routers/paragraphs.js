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
const paragraphs_1 = require("../controllers/paragraphs");
const parser = bodyParser.json();
const paragraphsRouter = express.Router();
async function controllerMiddleware(req, res, next) {
    console.log(`${req.method} /paragraphs${req.path}`);
    res.locals.controller = await paragraphs_1.ParagraphsController.getInstance();
    next();
}
paragraphsRouter.use(controllerMiddleware);
paragraphsRouter.get('/', async (req, res) => {
    const controller = res.locals.controller;
    const response = await controller.get();
    res.send(response);
});
paragraphsRouter.post('/', parser, async (req, res) => {
    const controller = res.locals.controller;
    const body = req.body;
    if (!body) {
        res.status(400).send("Body must be provided");
    }
    try {
        await controller.post(body);
        const response = await controller.getLatest();
        res.status(201).send(response);
    }
    catch (err) {
        res.status(500).send(err);
    }
});
paragraphsRouter.get('/:paragraphId', async (req, res) => {
    const controller = res.locals.controller;
    const paragraphId = Number.parseInt(req.params.paragraphId);
    const response = await controller.get({ id: paragraphId });
    if (!response) {
        res.status(404).send("Not found");
    }
    res.send(response);
});
paragraphsRouter.patch('/:paragraphId', parser, async (req, res) => {
    const controller = res.locals.controller;
    const body = req.body;
    const paragraphId = Number.parseInt(req.params.paragraphId);
    try {
        await controller.patch(body, { id: paragraphId });
        const response = await controller.get({ id: paragraphId });
        res.send(response);
    }
    catch (err) {
        res.status(500).send(err);
    }
});
paragraphsRouter.delete('/:paragraphId', async (req, res) => {
    const controller = res.locals.controller;
    const paragraphId = Number.parseInt(req.params.paragraphId);
    await controller.delete({ id: paragraphId });
    res.status(200).send();
});
exports.default = paragraphsRouter;
