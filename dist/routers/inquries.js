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
const inquries_1 = require("../controllers/inquries");
const parser = bodyParser.json();
const inquriesRouter = express.Router();
async function controllerMiddleware(req, res, next) {
    console.log(`${req.method} /inquiries${req.path}`);
    res.locals.controller = await inquries_1.InquriesController.getInstance();
    next();
}
inquriesRouter.use(controllerMiddleware);
inquriesRouter.get('/', async (req, res) => {
    const controller = res.locals.controller;
    const response = await controller.get({});
    if (!response) {
        res.send([]);
    }
    if (!Array.isArray(response)) {
        res.send([response]);
    }
    else {
        res.send(response);
    }
});
inquriesRouter.post('/', parser, async (req, res) => {
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
inquriesRouter.get('/:inquryId', async (req, res) => {
    const controller = res.locals.controller;
    const inquryId = Number.parseInt(req.params.inquryId);
    const response = await controller.get({ id: inquryId });
    if (!response) {
        res.status(404).send("Not found");
    }
    res.send(response);
});
inquriesRouter.patch('/:inquryId', parser, async (req, res) => {
    const controller = res.locals.controller;
    const body = req.body;
    const inquryId = Number.parseInt(req.params.inquryId);
    try {
        await controller.patch(body, { id: inquryId });
        const response = await controller.get({ id: inquryId });
        res.send(response);
    }
    catch (err) {
        res.status(500).send(err);
    }
});
inquriesRouter.delete('/:inquryId', async (req, res) => {
    const controller = res.locals.controller;
    const inquryId = Number.parseInt(req.params.inquryId);
    await controller.delete({ id: inquryId });
    res.status(200).send();
});
exports.default = inquriesRouter;
