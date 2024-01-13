"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PagesController = void 0;
const mySqlManager_1 = require("../mysql/mySqlManager");
const base_1 = require("./base");
const pagesSections_1 = require("./pagesSections");
const sections_1 = require("./sections");
class PagesController extends base_1.BaseController {
    static async getInstance() {
        const mySqlHandler = await mySqlManager_1.MySqlHandler.getInstance();
        if (!PagesController._instance) {
            PagesController._instance = new PagesController(mySqlHandler);
        }
        return PagesController._instance;
    }
    constructor(mySqlHandler) {
        super(mySqlHandler);
        this._tableName = 'pages';
    }
    async get(filter, includeSections, includeComponents, includeParagraphs) {
        const dbFilter = this._getFilter(filter);
        const page = await this._mySqlHandler.get(this._tableName, dbFilter);
        const getPageWithSections = async (page) => {
            const sectionController = await sections_1.SectionsController.getInstance();
            const pageSectionsController = await pagesSections_1.PageSectionsController.getInstance();
            const pageSections = await pageSectionsController.get({ page_id: page.id });
            const getSections = async (pageSections) => {
                if (!pageSections) {
                    return [];
                }
                if (Array.isArray(pageSections)) {
                    return Promise.all(pageSections.map(async (pageSection) => {
                        return await sectionController.get({ id: pageSection.section_id }, includeComponents, includeParagraphs);
                    }));
                }
                return [await sectionController.get({ id: pageSections.section_id }, includeComponents, includeParagraphs)];
            };
            const sections = (await getSections(pageSections));
            if (Array.isArray(sections)) {
                return {
                    ...page,
                    sections: sections.sort((a, b) => a.position - b.position)
                };
            }
            return {
                ...page,
                sections
            };
        };
        if (includeSections) {
            if (Array.isArray(page)) {
                return await Promise.all(page.map(async (entry) => {
                    return await getPageWithSections(entry);
                }));
            }
            return await getPageWithSections(page);
        }
        return page;
    }
}
exports.PagesController = PagesController;
