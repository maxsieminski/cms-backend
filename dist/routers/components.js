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
const express = __importStar(require("express"));
const bodyParser = __importStar(require("body-parser"));
const jwt = __importStar(require("jsonwebtoken"));
const component_1 = require("../controllers/component");
const componentsCategories_1 = __importDefault(require("./componentsCategories"));
const defs_1 = require("../defs");
const user_1 = require("../controllers/user");
const parser = bodyParser.json();
const componentsRouter = express.Router();
async function controllerMiddleware(req, res, next) {
    console.log(`${req.method} /components${req.path}`);
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
        return next();
    }
    catch (err) {
        return res.status(401).send();
    }
}
componentsRouter.use('/categories', componentsCategories_1.default);
componentsRouter.use(controllerMiddleware);
componentsRouter.get('/', async (req, res) => {
    const controller = await component_1.ComponentsController.getInstance();
    const response = await controller.get();
    res.send(response);
});
componentsRouter.post('/', parser, async (req, res) => {
    const controller = await component_1.ComponentsController.getInstance();
    const body = req.body;
    if (!body) {
        return res.status(400).send("Body must be provided");
    }
    const { sectionId, ...data } = body;
    try {
        await controller.post(data);
        const response = await controller.getLatest();
        await controller.createSectionsLink(response.id, sectionId);
        return res.status(201).send(response);
    }
    catch (err) {
        return res.status(500).send(err);
    }
});
componentsRouter.get('/:componentId', async (req, res) => {
    const controller = await component_1.ComponentsController.getInstance();
    const componentId = Number.parseInt(req.params.componentId);
    const includeParagraphs = !!req.query.includeParagraphs ?? false;
    const response = await controller.get({ id: componentId }, includeParagraphs);
    if (!response) {
        return res.status(404).send("Not found");
    }
    res.send(response);
});
componentsRouter.get('/:componentId/paragraphs', async (req, res) => {
    const controller = await component_1.ComponentsController.getInstance();
    const componentId = Number.parseInt(req.params.componentId);
    const response = await controller.get({ id: componentId }, true);
    if (!response) {
        return res.status(404).send("Not found");
    }
    if (Array.isArray(response)) {
        res.send(response[0].paragraphs);
    }
    res.send(response.paragraphs);
});
componentsRouter.patch('/:componentId', parser, async (req, res) => {
    const controller = await component_1.ComponentsController.getInstance();
    const body = req.body;
    const componentId = Number.parseInt(req.params.componentId);
    try {
        await controller.patch(body, { id: componentId });
        const response = await controller.get({ id: componentId });
        res.send(response);
    }
    catch (err) {
        return res.status(500).send(err);
    }
});
componentsRouter.delete('/:componentId', async (req, res) => {
    const controller = await component_1.ComponentsController.getInstance();
    const componentId = Number.parseInt(req.params.componentId);
    await controller.delete({ id: componentId });
    return res.status(200).send();
});
exports.default = componentsRouter;
