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
const sections_1 = require("../controllers/sections");
const parser = bodyParser.json();
const sectionsRouter = express.Router();
async function controllerMiddleware(req, res, next) {
    console.log(`${req.method} /sections${req.path}`);
    res.locals.controller = await sections_1.SectionsController.getInstance();
    next();
}
sectionsRouter.use(controllerMiddleware);
sectionsRouter.get('/', async (req, res) => {
    const controller = res.locals.controller;
    const includeComponents = req.query.includeComponents === "true";
    const includeParagraphs = req.query.includeParagraphs === "true";
    const response = await controller.get({}, includeComponents, includeParagraphs);
    res.send(response);
});
sectionsRouter.post('/', parser, async (req, res) => {
    const controller = res.locals.controller;
    const body = req.body;
    if (!body) {
        res.status(400).send("Body must be provided");
    }
    const { pageId, ...data } = body;
    try {
        await controller.post(data);
        const response = await controller.getLatest();
        await controller.createPageLink(response.id, pageId);
        res.status(201).send(response);
    }
    catch (err) {
        res.status(500).send(err);
    }
});
sectionsRouter.get('/:sectionId', async (req, res) => {
    const controller = res.locals.controller;
    const sectionId = Number.parseInt(req.params.sectionId);
    const includeComponents = req.query.includeComponents === "true";
    const includeParagraphs = req.query.includeParagraphs === "true";
    const response = await controller.get({ id: sectionId }, includeComponents, includeParagraphs);
    if (!response) {
        res.status(404).send("Not found");
    }
    res.send(response);
});
sectionsRouter.get('/:sectionId/components', async (req, res) => {
    const controller = res.locals.controller;
    const sectionId = Number.parseInt(req.params.sectionId);
    const response = await controller.get({ id: sectionId }, true, false);
    if (!response) {
        res.status(404).send("Not found");
    }
    if (Array.isArray(response)) {
        res.send(response[0].components);
    }
    res.send(response.components);
});
sectionsRouter.patch('/:sectionId', parser, async (req, res) => {
    const controller = res.locals.controller;
    const body = req.body;
    const sectionId = Number.parseInt(req.params.sectionId);
    try {
        await controller.patch(body, { id: sectionId });
        const response = await controller.get({ id: sectionId });
        res.send(response);
    }
    catch (err) {
        res.status(500).send(err);
    }
});
sectionsRouter.delete('/:sectionId', async (req, res) => {
    const controller = res.locals.controller;
    const sectionId = Number.parseInt(req.params.sectionId);
    try {
        await controller.delete({ id: sectionId });
        res.status(200).send();
    }
    catch (err) {
        res.status(400).send();
    }
});
exports.default = sectionsRouter;
