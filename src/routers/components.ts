import * as express from "express";
import * as bodyParser from "body-parser";
import * as jwt from 'jsonwebtoken';
import { ComponentsController } from "../controllers/component";
import { cms_types } from "../types";
import componentsCategoriesRouter from "./componentsCategories";
import { cms_defs } from "../defs";
import { UsersController } from "../controllers/user";

const parser = bodyParser.json();
const componentsRouter = express.Router();

async function controllerMiddleware(req: any, res: any, next: any) {
    console.log(`${req.method} /components${req.path}`);
    try {
        if (req.method !== 'GET') {
            if ('authorization' in req.headers === false || req.headers.authorization.split(' ').length < 2 ) {
                return res.status(401).send();
            }
            if ('authorization' in req.headers && req.headers.authorization.split(' ').length > 1) {
                const token = req.headers.authorization.split(' ')[1] ?? '';
                
                const decoded = jwt.verify(token, cms_defs.SECRET);

                if (typeof decoded === 'string') {
                    return res.status(401).send();
                }

                const usersController = await UsersController.getInstance();
                const user = await usersController.get({ id: decoded.data.id }) as cms_types.models.ModelCommonObject;

                if (!user.id) {
                    return res.status(401).send();
                }
            }
        }
        return next();
    } catch (err) {
        return res.status(401).send();
    }
}

componentsRouter.use('/categories', componentsCategoriesRouter)
componentsRouter.use(controllerMiddleware);

componentsRouter.get('/', async (req, res) => {
    const controller = await ComponentsController.getInstance();
    const response = await controller.get();
    res.send(response);
});

componentsRouter.post('/', parser, async (req, res) => {
    const controller = await ComponentsController.getInstance();
    const body = req.body as cms_types.models.ComponentObject;

    if (!body) {
        return res.status(400).send("Body must be provided");
    }

    const { sectionId, ...data } = body;


    try {
        await controller.post(data);
        const response = await controller.getLatest();
        await controller.createSectionsLink((response as cms_types.models.SectionObject).id!, sectionId!)
        return res.status(201).send(response);
    } catch (err) {
        return res.status(500).send(err);
    }
});

componentsRouter.get('/:componentId', async (req, res) => {
    const controller = await ComponentsController.getInstance();
    
    const componentId = Number.parseInt(req.params.componentId);
    const includeParagraphs = !!req.query.includeParagraphs ?? false;

    const response = await controller.get( { id: componentId }, includeParagraphs );

    if (!response) {
        return res.status(404).send("Not found");
    }

    res.send(response);
});

componentsRouter.get('/:componentId/paragraphs', async (req, res) => {
    const controller = await ComponentsController.getInstance();
    const componentId = Number.parseInt(req.params.componentId);
    
    const response = await controller.get( { id: componentId }, true ) as any;
    
    if (!response) {
        return res.status(404).send("Not found");
    }

    if (Array.isArray(response)) {
        res.send(response[0].paragraphs)
    }

    res.send(response.paragraphs);
});

componentsRouter.patch('/:componentId', parser, async (req, res) => {
    const controller = await ComponentsController.getInstance();
    const body = req.body as cms_types.models.ModelCommonObject;
    const componentId = Number.parseInt(req.params.componentId);

    try {
        await controller.patch( body, { id: componentId } );
        const response = await controller.get({ id: componentId });
        res.send(response);
    } catch (err) {
        return res.status(500).send(err);
    }
});

componentsRouter.delete('/:componentId', async (req, res) => {
    const controller = await ComponentsController.getInstance();
    const componentId = Number.parseInt(req.params.componentId);
    await controller.delete( { id: componentId } );
    return res.status(200).send();
});



export default componentsRouter;