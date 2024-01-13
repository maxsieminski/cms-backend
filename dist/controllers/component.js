"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentsController = void 0;
const mySqlManager_1 = require("../mysql/mySqlManager");
const base_1 = require("./base");
const componentsCategories_1 = require("./componentsCategories");
const paragraphs_1 = require("./paragraphs");
class ComponentsController extends base_1.BaseController {
    constructor() {
        super(...arguments);
        this._tableName = 'components';
    }
    static async getInstance() {
        const mySqlHandler = await mySqlManager_1.MySqlHandler.getInstance();
        if (!ComponentsController._instance) {
            ComponentsController._instance = new ComponentsController(mySqlHandler);
        }
        return ComponentsController._instance;
    }
    async getComponentCategoryName(component) {
        const categoryId = Number.parseInt(component.category);
        const componentsCategoriesController = await componentsCategories_1.ComponentsCategoriesController.getInstance();
        const componentCategory = (await componentsCategoriesController.get({ id: categoryId }));
        return componentCategory.category_name;
    }
    ;
    async get(filter, includeParagraphs) {
        const dbFilter = this._getFilter(filter);
        const component = await this._mySqlHandler.get(this._tableName, dbFilter);
        const getParagraphs = async (component) => {
            const paragraphsController = await paragraphs_1.ParagraphsController.getInstance();
            const paragraphs = await paragraphsController.get({ component_id: component.id });
            if (!paragraphs) {
                return [];
            }
            if (!Array.isArray(paragraphs)) {
                return [paragraphs];
            }
            return paragraphs;
        };
        const parseComponent = async (component) => {
            return {
                ...component,
                paragraphs: await getParagraphs(component),
                category: await this.getComponentCategoryName(component)
            };
        };
        if (includeParagraphs) {
            if (Array.isArray(component)) {
                return await Promise.all(component.map(async (entry) => {
                    return await parseComponent(entry);
                }));
            }
            return parseComponent(component);
        }
        if (Array.isArray(component)) {
            return await Promise.all(component.map(async (entry) => {
                return {
                    ...entry,
                    category: await this.getComponentCategoryName(entry)
                };
            }));
        }
        return {
            ...component,
            category: await this.getComponentCategoryName(component)
        };
    }
    createSectionsLink(component_id, section_id) {
        return this._mySqlHandler.create('sections_components', { section_id, component_id });
    }
}
exports.ComponentsController = ComponentsController;
