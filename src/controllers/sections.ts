import { MySqlHandler } from "../mysql/mySqlManager";
import { cms_types } from "../types";
import { BaseController } from "./base";
import { ComponentsController } from "./component";
import { SectionComponentsController } from "./sectionComponents";

export class SectionsController extends BaseController {
    protected static _instance: SectionsController;
    override _tableName = 'sections';

    public static async getInstance(): Promise<SectionsController> {
        const mySqlHandler = await MySqlHandler.getInstance();

        if (!SectionsController._instance) {
            SectionsController._instance = new SectionsController(mySqlHandler);
        }
        return SectionsController._instance;
    }

    private constructor (mySqlHandler: MySqlHandler) {
        super(mySqlHandler);
    }

    override async get(filter?: Partial<cms_types.models.SectionObject>, includeComponents?: boolean, includeParagraphs?: boolean): Promise<cms_types.models.SectionObjectAny> {
        const dbFilter = this._getFilter(filter);
        const section = await this._mySqlHandler.get(this._tableName, dbFilter) as unknown as cms_types.models.SectionObjectAny;

        const getSectionWithComponents = async (section: cms_types.models.SectionObject) => {
            const componentController = await ComponentsController.getInstance();
            const sectionComponentsController = await SectionComponentsController.getInstance();
            const sectionComponents = await sectionComponentsController.get({ section_id: section.id } as cms_types.models.SectionComponentsObject) as cms_types.models.SectionComponentsObject | cms_types.models.SectionComponentsObject[];

            const getComponents = async (sectionComponents: cms_types.models.SectionComponentsObject | cms_types.models.SectionComponentsObject[]) => {
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
            }
        };

        if (includeComponents) {
            if (Array.isArray(section)) {
                return await Promise.all(section.map(async (entry) => {
                    return await getSectionWithComponents(entry);
                }));
            }
            return await getSectionWithComponents(section);    
        }

        return section;
    }

    public createPageLink(section_id: number, page_id: number) {
        return this._mySqlHandler.create('pages_sections', { section_id, page_id } as any);
    }
}