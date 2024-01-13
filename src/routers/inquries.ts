import * as express from "express";
import * as bodyParser from "body-parser";
import { cms_types } from "../types";
import { InquriesController } from "../controllers/inquries";

const parser = bodyParser.json();
const inquriesRouter = express.Router();

async function controllerMiddleware(req: any, res: any, next: any) {
    console.log(`${req.method} /inquiries${req.path}`);
    res.locals.controller = await InquriesController.getInstance();
    next();
}

inquriesRouter.use(controllerMiddleware)

inquriesRouter.get('/', async (req, res) => {
    const controller = res.locals.controller as InquriesController;
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
    const controller = res.locals.controller as InquriesController;
    const body = req.body as cms_types.models.InquryObject;

    if (!body) {
        res.status(400).send("Body must be provided");
    }

    try {
        await controller.post(body);
        const response = await controller.getLatest();
        res.status(201).send(response);
    } catch (err) {
        res.status(500).send(err);
    }
});

inquriesRouter.get('/:inquryId', async (req, res) => {
    const controller = res.locals.controller as InquriesController;
    const inquryId = Number.parseInt(req.params.inquryId);

    const response = await controller.get( { id: inquryId });

    if (!response) {
        res.status(404).send("Not found");
    }

    res.send(response);
    }
);

inquriesRouter.patch('/:inquryId', parser, async (req, res) => {
    const controller = res.locals.controller as InquriesController;
    const body = req.body as cms_types.models.InquryObject;
    const inquryId = Number.parseInt(req.params.inquryId);

    try {
        await controller.patch( body, { id: inquryId } );
        const response = await controller.get({ id: inquryId });
        res.send(response);
    } catch (err) {
        res.status(500).send(err);
    }
});

inquriesRouter.delete('/:inquryId', async (req, res) => {
    const controller = res.locals.controller as InquriesController;
    const inquryId = Number.parseInt(req.params.inquryId);
    await controller.delete( { id: inquryId } );
    res.status(200).send();
});



export default inquriesRouter;