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
const pages_1 = require("../controllers/pages");
const parser = bodyParser.json();
const pagesRouter = express.Router();
async function controllerMiddleware(req, res, next) {
    console.log(`${req.method} /pages${req.path}`);
    res.locals.controller = await pages_1.PagesController.getInstance();
    next();
}
pagesRouter.use(controllerMiddleware);
pagesRouter.get('/', async (req, res) => {
    const controller = res.locals.controller;
    const includeSections = req.query.includeSections === "true";
    const includeComponents = req.query.includeComponents === "true";
    const includeParagraphs = req.query.includeParagraphs === "true";
    const response = await controller.get({}, includeSections, includeComponents, includeParagraphs);
    res.send(response);
});
pagesRouter.post('/', parser, async (req, res) => {
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
pagesRouter.get('/:pageId', async (req, res) => {
    const controller = res.locals.controller;
    const pageId = Number.parseInt(req.params.pageId);
    if (Number.isNaN(pageId)) {
        const pagePath = req.params.pageId;
        const response = await controller.get({ path: `/${pagePath}` }, true, true, true);
        if (!response) {
            res.status(404).send("Not found");
        }
        res.send(response);
    }
    else {
        const includeSections = req.query.includeSections === "true";
        const includeComponents = req.query.includeComponents === "true";
        const includeParagraphs = req.query.includeParagraphs === "true";
        const response = await controller.get({ id: pageId }, includeSections, includeComponents, includeParagraphs);
        if (!response) {
            res.status(404).send("Not found");
        }
        res.send(response);
    }
});
pagesRouter.get('/:pageId/sections', async (req, res) => {
    const controller = res.locals.controller;
    const pageId = Number.parseInt(req.params.pageId);
    const response = await controller.get({ id: pageId }, true, false, false);
    if (!response) {
        res.status(404).send("Not found");
    }
    if (Array.isArray(response)) {
        res.send(response[0].sections);
    }
    res.send(response.sections);
});
pagesRouter.patch('/:pageId', parser, async (req, res) => {
    const controller = res.locals.controller;
    const body = req.body;
    const pageId = Number.parseInt(req.params.pageId);
    try {
        await controller.patch(body, { id: pageId });
        const response = await controller.get({ id: pageId });
        res.send(response);
    }
    catch (err) {
        res.status(500).send(err);
    }
});
pagesRouter.delete('/:pageId', async (req, res) => {
    const controller = res.locals.controller;
    const pageId = Number.parseInt(req.params.pageId);
    await controller.delete({ id: pageId });
    res.status(200).send();
});
exports.default = pagesRouter;
