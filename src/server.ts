import cors from "cors";
import express from "express";
import swaggerUi from "swagger-ui-express";
import * as swaggerJson from './swagger.json';
import helmet from "helmet";

import paragraphsRouter from './routers/paragraphs';
import componentsRouter from "./routers/components";
import sectionsRouter from "./routers/sections";
import inquriesRouter from "./routers/inquries";
import pagesRouter from "./routers/pages";



const app = express();
const port = process.env["PORT"] || 3000;


export default async function main() {
    app.use(cors());
    app.use(helmet());
    
    app.use('/paragraphs', paragraphsRouter);
    app.use('/components', componentsRouter);
    app.use('/sections', sectionsRouter);
    app.use('/pages', pagesRouter);
    app.use('/inquries', inquriesRouter)
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerJson));
        
    app.listen(port, () => {
        console.log(`Server is listening on port ${port}`);
    });
}

main();
