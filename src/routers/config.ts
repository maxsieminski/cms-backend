import * as express from "express";
import * as bodyParser from "body-parser";
import * as jwt from 'jsonwebtoken';
import { cms_types } from "../types";
import { InquriesController } from "../controllers/inquries";
import { cms_defs } from "../defs";
import { UsersController } from "../controllers/user";
import { ConfigController } from "../controllers/config";

const parser = bodyParser.json();
const configRouter = express.Router();

async function controllerMiddleware(req: any, res: any, next: any) {
    console.log(`${req.method} /config${req.path}`);
    try {
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
        res.locals.controller = await ConfigController.getInstance();
        return next();
    } catch (err) {
        return res.status(401).send();
    }
}

configRouter.use(controllerMiddleware)

configRouter.get('/', async (req, res) => {
    const controller = res.locals.controller as ConfigController;
    const response = await controller.get();

    if (!response) {
        res.status(200).send([]);
    }
    else {
        res.status(200).send(response);
    }
});

configRouter.post('/', parser, async (req, res) => {
    res.status(405).send("Only one configuration is allowed!");
});

configRouter.patch('/', parser, async (req, res) => {
    const controller = res.locals.controller as ConfigController;
    const body = req.body as cms_types.models.ConfigObject;

    try {
        await controller.patch( body, { id: 1 } );
        const response = await controller.get();
        res.send(response);
    } catch (err) {
        return res.status(500).send(err);
    }
});

configRouter.delete('/:inquryId', async (req, res) => {
    res.status(405).send("Cannot delete config!");
});



export default configRouter;