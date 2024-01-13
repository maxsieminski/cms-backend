import * as express from "express";
import * as bodyParser from "body-parser";
import { cms_types } from "../types";
import { PagesController } from "../controllers/pages";

const parser = bodyParser.json();
const pagesRouter = express.Router();

async function controllerMiddleware(req: any, res: any, next: any) {
    console.log(`${req.method} /pages${req.path}`);
    res.locals.controller = await PagesController.getInstance();
    next();
}

pagesRouter.use(controllerMiddleware)

pagesRouter.get('/', async (req, res) => {
    const controller = res.locals.controller as PagesController;

    const includeSections = req.query.includeSections === "true";
    const includeComponents = req.query.includeComponents === "true";
    const includeParagraphs = req.query.includeParagraphs === "true";

    const response = await controller.get({}, includeSections, includeComponents, includeParagraphs);
    res.send(response);
});

pagesRouter.post('/', parser, async (req, res) => {
    const controller = res.locals.controller as PagesController;
    const body = req.body as cms_types.models.PageObject;

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

pagesRouter.get('/:pageId', async (req, res) => {
    const controller = res.locals.controller as PagesController;
    const pageId = Number.parseInt(req.params.pageId);

    if (Number.isNaN(pageId)) {
        const pagePath = req.params.pageId;
        const response = await controller.get( { path: `/${pagePath}` }, true, true, true );

        if (!response) {
            res.status(404).send("Not found");
        }
    
        res.send(response);    
    } else {

    const includeSections = req.query.includeSections === "true";
    const includeComponents = req.query.includeComponents === "true";
    const includeParagraphs = req.query.includeParagraphs === "true";
    
    const response = await controller.get( { id: pageId }, includeSections, includeComponents, includeParagraphs );

    if (!response) {
        res.status(404).send("Not found");
    }

    res.send(response);
    }

});

pagesRouter.get('/:pageId/sections', async (req, res) => {
    const controller = res.locals.controller as PagesController;
    const pageId = Number.parseInt(req.params.pageId);
    
    const response = await controller.get( { id: pageId }, true, false, false ) as any;
    
    if (!response) {
        res.status(404).send("Not found");
    }

    if (Array.isArray(response)) {
        res.send(response[0].sections)
    }

    res.send(response.sections);
});

pagesRouter.patch('/:pageId', parser, async (req, res) => {
    const controller = res.locals.controller as PagesController;
    const body = req.body as cms_types.models.PageObject;
    const pageId = Number.parseInt(req.params.pageId);

    try {
        await controller.patch( body, { id: pageId } );
        const response = await controller.get({ id: pageId });
        res.send(response);
    } catch (err) {
        res.status(500).send(err);
    }
});

pagesRouter.delete('/:pageId', async (req, res) => {
    const controller = res.locals.controller as PagesController;
    const pageId = Number.parseInt(req.params.pageId);
    await controller.delete( { id: pageId } );
    res.status(200).send();
});



export default pagesRouter;