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
const jwt = __importStar(require("jsonwebtoken"));
const paragraphs_1 = require("../controllers/paragraphs");
const defs_1 = require("../defs");
const user_1 = require("../controllers/user");
const parser = bodyParser.json();
const paragraphsRouter = express.Router();
async function controllerMiddleware(req, res, next) {
    console.log(`${req.method} /paragraphs${req.path}`);
    try {
        if (req.method !== 'GET') {
            if ('authorization' in req.headers === false || req.headers.authorization.split(' ').length < 2) {
                return res.status(401).send();
            }
            if ('authorization' in req.headers && req.headers.authorization.split(' ').length > 1) {
                const token = req.headers.authorization.split(' ')[1] ?? '';
                const decoded = jwt.verify(token, defs_1.cms_defs.SECRET);
                if (typeof decoded === 'string') {
                    return res.status(401).send();
                }
                const usersController = await user_1.UsersController.getInstance();
                const user = await usersController.get({ id: decoded.data.id });
                if (!user.id) {
                    return res.status(401).send();
                }
            }
        }
        res.locals.controller = await paragraphs_1.ParagraphsController.getInstance();
        return next();
    }
    catch (err) {
        return res.status(401).send();
    }
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
        return res.status(400).send("Body must be provided");
    }
    try {
        await controller.post(body);
        const response = await controller.getLatest();
        return res.status(201).send(response);
    }
    catch (err) {
        return res.status(500).send(err);
    }
});
paragraphsRouter.get('/:paragraphId', async (req, res) => {
    const controller = res.locals.controller;
    const paragraphId = Number.parseInt(req.params.paragraphId);
    const response = await controller.get({ id: paragraphId });
    if (!response) {
        return res.status(404).send("Not found");
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
        return res.status(500).send(err);
    }
});
paragraphsRouter.delete('/:paragraphId', async (req, res) => {
    const controller = res.locals.controller;
    const paragraphId = Number.parseInt(req.params.paragraphId);
    await controller.delete({ id: paragraphId });
    return res.status(200).send();
});
exports.default = paragraphsRouter;
