import * as express from "express";
import * as bodyParser from "body-parser";
import * as jwt from 'jsonwebtoken';
import { cms_types } from "../types";
import { InquriesController } from "../controllers/inquries";
import { cms_defs } from "../defs";
import { UsersController } from "../controllers/user";

const parser = bodyParser.json();
const inquriesRouter = express.Router();

async function controllerMiddleware(req: any, res: any, next: any) {
    console.log(`${req.method} /inquiries${req.path}`);
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
        res.locals.controller = await InquriesController.getInstance();
        return next();
    } catch (err) {
        return res.status(401).send();
    }
}

inquriesRouter.use(controllerMiddleware)

inquriesRouter.get('/', async (req, res) => {
    const controller = res.locals.controller as InquriesController;
    const response = await controller.get({});

    if (!response) {
        res.send([]);
    }
    else if (!Array.isArray(response)) {
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

inquriesRouter.get('/:inquryId', async (req, res) => {
    const controller = res.locals.controller as InquriesController;
    const inquryId = Number.parseInt(req.params.inquryId);

    const response = await controller.get( { id: inquryId });

    if (!response) {
        return res.status(404).send("Not found");
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
        return res.status(500).send(err);
    }
});

inquriesRouter.delete('/:inquryId', async (req, res) => {
    const controller = res.locals.controller as InquriesController;
    const inquryId = Number.parseInt(req.params.inquryId);
    await controller.delete( { id: inquryId } );
    return res.status(200).send();
});



export default inquriesRouter;