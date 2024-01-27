"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SectionsController = void 0;
const mySqlManager_1 = require("../mysql/mySqlManager");
const base_1 = require("./base");
const component_1 = require("./component");
const sectionComponents_1 = require("./sectionComponents");
class SectionsController extends base_1.BaseController {
    static async getInstance() {
        const mySqlHandler = await mySqlManager_1.MySqlHandler.getInstance();
        if (!SectionsController._instance) {
            SectionsController._instance = new SectionsController(mySqlHandler);
        }
        return SectionsController._instance;
    }
    constructor(mySqlHandler) {
        super(mySqlHandler);
        this._tableName = 'sections';
    }
    async get(filter, includeComponents, includeParagraphs) {
        const dbFilter = this._getFilter(filter);
        const section = await this._mySqlHandler.get(this._tableName, dbFilter);
        const isValidSectionObject = (obj) => {
            return obj !== undefined && obj !== null;
        };
        const getSectionWithComponents = async (section) => {
            const componentController = await component_1.ComponentsController.getInstance();
            const sectionComponentsController = await sectionComponents_1.SectionComponentsController.getInstance();
            const sectionComponents = await sectionComponentsController.get({ section_id: section.id });
            const getComponents = async (sectionComponents) => {
                if (!sectionComponents) {
                    return [];
                }
                if (Array.isArray(sectionComponents)) {
                    return Promise.all(sectionComponents.map(async (sectionComponent) => {
                        return await componentController.get({ id: sectionComponent.component_id }, includeParagraphs);
                    }));
                }
                return [await componentController.get({ id: sectionComponents.component_id }, includeParagraphs)];
            };
            const components = await getComponents(sectionComponents);
            return {
                ...section,
                components
            };
        };
        if (includeComponents) {
            if (Array.isArray(section)) {
                const validSections = section.filter(isValidSectionObject);
                return await Promise.all(validSections.map(async (entry) => {
                    return await getSectionWithComponents(entry);
                }));
            }
            if (isValidSectionObject(section)) {
                return await getSectionWithComponents(section);
            }
        }
        return isValidSectionObject(section) ? section : [];
    }
    createPageLink(section_id, page_id) {
        return this._mySqlHandler.create('pages_sections', { section_id, page_id });
    }
}
exports.SectionsController = SectionsController;
