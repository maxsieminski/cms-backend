import * as express from "express";
import * as bodyParser from "body-parser";
import { cms_types } from "../types";
import { SectionsController } from "../controllers/sections";

const parser = bodyParser.json();
const sectionsRouter = express.Router();

async function controllerMiddleware(req: any, res: any, next: any) {
    console.log(`${req.method} /sections${req.path}`);
    res.locals.controller = await SectionsController.getInstance();
    next();
}

sectionsRouter.use(controllerMiddleware);

sectionsRouter.get('/', async (req, res) => {
    const controller = res.locals.controller as SectionsController;

    const includeComponents = req.query.includeComponents === "true";
    const includeParagraphs = req.query.includeParagraphs === "true";

    const response = await controller.get({}, includeComponents, includeParagraphs );
    res.send(response);
});

sectionsRouter.post('/', parser, async (req, res) => {
    const controller = res.locals.controller as SectionsController;
    const body = req.body as cms_types.models.SectionObject;

    if (!body) {
        res.status(400).send("Body must be provided");
    }

    const { pageId, ...data } = body;

    try {
        await controller.post(data);
        const response = await controller.getLatest();
        await controller.createPageLink((response as cms_types.models.SectionObject).id!, pageId!)
        res.status(201).send(response);
    } catch (err) {
        res.status(500).send(err);
    }
});

sectionsRouter.get('/:sectionId', async (req, res) => {
    const controller = res.locals.controller as SectionsController;

    const sectionId = Number.parseInt(req.params.sectionId);

    const includeComponents = req.query.includeComponents === "true";
    const includeParagraphs = req.query.includeParagraphs === "true";
    
    const response = await controller.get( { id: sectionId }, includeComponents, includeParagraphs );

    if (!response) {
        res.status(404).send("Not found");
    }

    res.send(response);
});


sectionsRouter.get('/:sectionId/components', async (req, res) => {
    const controller = res.locals.controller as SectionsController;
    const sectionId = Number.parseInt(req.params.sectionId);
    
    const response = await controller.get( { id: sectionId }, true, false ) as any;
    
    if (!response) {
        res.status(404).send("Not found");
    }

    if (Array.isArray(response)) {
        res.send(response[0].components)
    }

    res.send(response.components);
});


sectionsRouter.patch('/:sectionId', parser, async (req, res) => {
    const controller = res.locals.controller as SectionsController;
    const body = req.body as cms_types.models.SectionObject;
    const sectionId = Number.parseInt(req.params.sectionId);

    try {
        await controller.patch( body, { id: sectionId } );
        const response = await controller.get({ id: sectionId });
        res.send(response);
    } catch (err) {
        res.status(500).send(err);
    }
});

sectionsRouter.delete('/:sectionId', async (req, res) => {
    const controller = res.locals.controller as SectionsController;
    const sectionId = Number.parseInt(req.params.sectionId);
    try {
        await controller.delete( { id: sectionId } );
        res.status(200).send();
    } catch (err) {
        res.status(400).send();
    }
});



export default sectionsRouter;