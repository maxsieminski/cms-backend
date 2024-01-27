import * as express from "express";
import * as bodyParser from "body-parser";
import * as jwt from 'jsonwebtoken';
import { cms_types } from "../types";
import { UsersController } from "../controllers/user";
import { cms_defs } from "../defs";

const parser = bodyParser.json();
const userRouter = express.Router();

async function controllerMiddleware(req: any, res: any, next: any) {
    console.log(`${req.method} /users${req.path}`);
    
    try {
        if (req.path != '/register' && req.path != '/login') {
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
        
        res.locals.controller = await UsersController.getInstance();
        return next();
    } catch (err) {
        return res.status(401).send();
    }
}

userRouter.use(controllerMiddleware);

userRouter.get('', async(req, res) => {

});

userRouter.get('/:id', async(req, res) => {

});

userRouter.post('/register', parser, async(req, res) => {
    const controller = res.locals.controller as UsersController;
    const body = req.body as cms_types.models.UserObject;

    if (!body) {
        return res.status(400).send("Body must be provided");
    }

    try {
        controller.post(body);
        return res.status(201).send(controller.getLatest());
    } catch (err) {
        return res.status(500).send(err);
    }
});

userRouter.post('/login', parser, async(req, res) => {
    const controller = res.locals.controller as UsersController;
    const body = req.body as cms_types.models.UserObject;

    if (!body) {
        return res.status(400).send("Body must be provided");
    }

    try {
        const user = await controller.auth(body);
        
        if (!user) {
            throw "No user found";
        }

        const data = {
            id: user.id,
            email: user.email,
            name: user.name,
            position: user.position
        }

        const token = jwt.sign({
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 48),
            data
        }, cms_defs.SECRET);

        return res.status(200).send({ data, token });
    } catch (err) {
        return res.status(500).send(err);
    }
});

export default userRouter;