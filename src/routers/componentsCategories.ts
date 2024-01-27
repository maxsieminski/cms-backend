import * as express from "express";
import * as bodyParser from "body-parser";
import * as jwt from 'jsonwebtoken';
import { cms_types } from "../types";
import { ComponentsCategoriesController } from "../controllers/componentsCategories";
import { cms_defs } from "../defs";
import { UsersController } from "../controllers/user";

const parser = bodyParser.json();
const componentsCategoriesRouter = express.Router();

async function controllerMiddleware(req: any, res: any, next: any) {
    console.log(`${req.method} /components/categories${req.path}`);
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
    res.locals.controller = await ComponentsCategoriesController.getInstance();
    next();
}

componentsCategoriesRouter.use(controllerMiddleware);

componentsCategoriesRouter.get('/', async (req, res) => {
    const controller = res.locals.controller as ComponentsCategoriesController;
    const response = await controller.get();
    res.send(response);
});

componentsCategoriesRouter.post('/', parser, async (req, res) => {
    const controller = res.locals.controller as ComponentsCategoriesController;
    const body = req.body as cms_types.models.ComponentCategoryObject;

    if (!body) {
        return res.status(400).send("Body must be provided");
    }

    try {
        await controller.post(body);
        const response = await controller.getLatest();
        return res.status(201).send(response);
    } catch (err) {
        return res.status(500).send(err);
    }
});

componentsCategoriesRouter.get('/:componentCategoryId', async (req, res) => {
    const controller = res.locals.controller as ComponentsCategoriesController;
    const componentCategoryId = Number.parseInt(req.params.componentCategoryId);
    const response = await controller.get( { id: componentCategoryId } );

    if (!response) {
        return res.status(404).send("Not found");
    }

    res.send(response);
});

componentsCategoriesRouter.patch('/:componentCategoryId', parser, async (req, res) => {
    const controller = res.locals.controller as ComponentsCategoriesController;
    const body = req.body as cms_types.models.ComponentCategoryObject;
    const componentCategoryId = Number.parseInt(req.params.componentCategoryId);

    try {
        await controller.patch( body, { id: componentCategoryId } );
        const response = await controller.get({ id: componentCategoryId });
        res.send(response);
    } catch (err) {
        return res.status(500).send(err);
    }
});

componentsCategoriesRouter.delete('/:componentCategoryId', async (req, res) => {
    const controller = res.locals.controller as ComponentsCategoriesController;
    const componentCategoryId = Number.parseInt(req.params.componentCategoryId);
    await controller.delete( { id: componentCategoryId } );
    return res.status(200).send();
});

componentsCategoriesRouter.get('/categories', async (req, res) => {
    
})


export default componentsCategoriesRouter;