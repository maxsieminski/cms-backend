"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cms_handlers = void 0;
const dataHandler_1 = require("./dataHandler");
var cms_handlers;
(function (cms_handlers) {
    let paragraphs;
    (function (paragraphs) {
        const paragraphHandler = new dataHandler_1.DataHandler('paragraphs');
        paragraphs.getParagraphByComponentId = async (componentId) => {
            return paragraphHandler.getItemsFiltered('component_id', componentId.toString());
        };
    })(paragraphs = cms_handlers.paragraphs || (cms_handlers.paragraphs = {}));
    let components;
    (function (components) {
        const componentHandler = new dataHandler_1.DataHandler('components');
        const sectionComponentsHandler = new dataHandler_1.DataHandler('sections_components');
        const componentsCategoriesHandler = new dataHandler_1.DataHandler('components_categories');
        const getComponentCategory = async (component) => {
            const componentCategories = await (componentsCategoriesHandler.getItemsFiltered('id', component.category));
            return componentCategories.map((category) => category.category_name)[0];
        };
        components.getComponentById = async (componentId) => {
            return await componentHandler.getItemById(componentId);
        };
        components.getComponentBySectionId = async (sectionId) => {
            const sectionComponentsAll = await sectionComponentsHandler.getItemFull();
            const sectionComponentsIds = sectionComponentsAll
                .filter((entry) => {
                if (Array.isArray(sectionId)) {
                    return sectionId.includes(entry.section_id);
                }
                return Number.parseInt(entry.section_id) === sectionId;
            })
                .map((entry) => entry.component_id);
            const sectionComponents = await componentHandler.getItemById(sectionComponentsIds);
            return await Promise.all(sectionComponents.map(async (component) => {
                return {
                    ...component,
                    category: await getComponentCategory(component),
                    paragraphs: await cms_handlers.paragraphs.getParagraphByComponentId(component.id)
                };
            }));
        };
    })(components = cms_handlers.components || (cms_handlers.components = {}));
    let sections;
    (function (sections_1) {
        const sectionHandler = new dataHandler_1.DataHandler('sections');
        const pageSectionsHandler = new dataHandler_1.DataHandler('pages_sections');
        sections_1.getSection = async (sectionId) => {
            return await sectionHandler.getItemById(sectionId);
        };
        sections_1.getSectionsByPageId = async (pageId) => {
            const pageSectionsAll = await pageSectionsHandler.getItemFull();
            const pageSectionsIds = pageSectionsAll
                .filter((entry) => Number.parseInt(entry.page_id) === pageId)
                .map((section) => section.section_id);
            const sections = await Promise.all((await sectionHandler.getItemById(pageSectionsIds)).map(async (section) => {
                const sectionId = Number.parseInt(section.id);
                const components = await cms_handlers.components.getComponentBySectionId(sectionId);
                return {
                    ...section,
                    components
                };
            }));
            return sections;
        };
    })(sections = cms_handlers.sections || (cms_handlers.sections = {}));
    let pages;
    (function (pages) {
        const pageHandler = new dataHandler_1.DataHandler('pages');
        pages.getPageById = async (pageId) => {
            const page = await pageHandler.getItemById(pageId);
            const sections = await cms_handlers.sections.getSectionsByPageId(pageId);
            return {
                ...page[0],
                sections
            };
        };
    })(pages = cms_handlers.pages || (cms_handlers.pages = {}));
})(cms_handlers || (exports.cms_handlers = cms_handlers = {}));
