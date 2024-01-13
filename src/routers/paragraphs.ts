import * as express from "express";
import * as bodyParser from "body-parser";
import { cms_types } from "../types";
import { ParagraphsController } from "../controllers/paragraphs";

const parser = bodyParser.json();
const paragraphsRouter = express.Router();

async function controllerMiddleware(req: any, res: any, next: any) {
    console.log(`${req.method} /paragraphs${req.path}`);
    res.locals.controller = await ParagraphsController.getInstance();
    next();
}

paragraphsRouter.use(controllerMiddleware)

paragraphsRouter.get('/', async (req, res) => {
    const controller = res.locals.controller as ParagraphsController;
    const response = await controller.get();
    res.send(response);
});

paragraphsRouter.post('/', parser, async (req, res) => {
    const controller = res.locals.controller as ParagraphsController;
    const body = req.body as cms_types.models.ParagraphObject;

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

paragraphsRouter.get('/:paragraphId', async (req, res) => {
    const controller = res.locals.controller as ParagraphsController;
    const paragraphId = Number.parseInt(req.params.paragraphId);
    const response = await controller.get( { id: paragraphId } );

    if (!response) {
        res.status(404).send("Not found");
    }

    res.send(response);
});

paragraphsRouter.patch('/:paragraphId', parser, async (req, res) => {
    const controller = res.locals.controller as ParagraphsController;
    const body = req.body as cms_types.models.ModelCommonObject;
    const paragraphId = Number.parseInt(req.params.paragraphId);

    try {
        await controller.patch( body, { id: paragraphId } );
        const response = await controller.get({ id: paragraphId });
        res.send(response);
    } catch (err) {
        res.status(500).send(err);
    }
});

paragraphsRouter.delete('/:paragraphId', async (req, res) => {
    const controller = res.locals.controller as ParagraphsController;
    const paragraphId = Number.parseInt(req.params.paragraphId);
    await controller.delete( { id: paragraphId } );
    res.status(200).send();
});



export default paragraphsRouter;