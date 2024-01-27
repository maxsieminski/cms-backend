import * as express from "express";
import * as bodyParser from "body-parser";
import * as jwt from 'jsonwebtoken';
import { cms_types } from "../types";
import { ParagraphsController } from "../controllers/paragraphs";
import { cms_defs } from "../defs";
import { UsersController } from "../controllers/user";

const parser = bodyParser.json();
const paragraphsRouter = express.Router();

async function controllerMiddleware(req: any, res: any, next: any) {
    console.log(`${req.method} /paragraphs${req.path}`);
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
        res.locals.controller = await ParagraphsController.getInstance();
        return next();
    } catch (err) {
        return res.status(401).send();
    }
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

paragraphsRouter.get('/:paragraphId', async (req, res) => {
    const controller = res.locals.controller as ParagraphsController;
    const paragraphId = Number.parseInt(req.params.paragraphId);
    const response = await controller.get( { id: paragraphId } );

    if (!response) {
        return res.status(404).send("Not found");
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
        return res.status(500).send(err);
    }
});

paragraphsRouter.delete('/:paragraphId', async (req, res) => {
    const controller = res.locals.controller as ParagraphsController;
    const paragraphId = Number.parseInt(req.params.paragraphId);
    await controller.delete( { id: paragraphId } );
    return res.status(200).send();
});



export default paragraphsRouter;