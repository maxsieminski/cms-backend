import { MySqlHandler } from "../mysql/mySqlManager";
import { cms_types } from "../types";
import { BaseController } from "./base";
import { ComponentsCategoriesController } from "./componentsCategories";
import { ParagraphsController } from "./paragraphs";


export class ComponentsController extends BaseController {
    protected static _instance: ComponentsController;
    override _tableName = 'components';

    public static async getInstance(): Promise<ComponentsController> {
        const mySqlHandler = await MySqlHandler.getInstance();

        if (!ComponentsController._instance) {
            ComponentsController._instance = new ComponentsController(mySqlHandler);
        }
        return ComponentsController._instance;
    }

    private async getComponentCategoryName(component: cms_types.models.ComponentObject) {
        const categoryId = Number.parseInt(component.category);
        const componentsCategoriesController = await ComponentsCategoriesController.getInstance();
        const componentCategory = (await componentsCategoriesController.get( { id: categoryId  } )) as cms_types.models.ComponentCategoryObject;

        return componentCategory.category_name;
    };


    override async get(filter?: Partial<cms_types.models.ComponentObject>, includeParagraphs?: boolean): Promise<cms_types.models.ComponentObjectAny> {
        const dbFilter = this._getFilter(filter);
        const component = await this._mySqlHandler.get(this._tableName, dbFilter) as unknown as cms_types.models.ComponentObjectAny;

        const getParagraphs = async (component: cms_types.models.ComponentObject) => {
            const paragraphsController = await ParagraphsController.getInstance();
            const paragraphs = await paragraphsController.get({ component_id: component.id } as Partial<cms_types.models.ParagraphObject>);

            if (!paragraphs) {
                return [];
            }

            if (!Array.isArray(paragraphs)) {
                return [paragraphs];
            }

            return paragraphs
        };

        const parseComponent = async (component: cms_types.models.ComponentObject) => {
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
                }
            }))
        }

        return {
            ...component,
            category: await this.getComponentCategoryName(component)
        }
    }

    public createSectionsLink(component_id: number, section_id: number) {
        return this._mySqlHandler.create('sections_components', { section_id, component_id } as any);
    }
}