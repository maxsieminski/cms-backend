import { MySqlHandler } from "../mysql/mySqlManager";
import { cms_types } from "../types";
import { BaseController } from "./base";
import { PageSectionsController } from "./pagesSections";
import { SectionsController } from "./sections";

export class PagesController extends BaseController {
    protected static _instance: PagesController;
    override _tableName = 'pages';

    public static async getInstance(): Promise<PagesController> {
        const mySqlHandler = await MySqlHandler.getInstance();

        if (!PagesController._instance) {
            PagesController._instance = new PagesController(mySqlHandler);
        }
        return PagesController._instance;
    }

    private constructor (mySqlHandler: MySqlHandler) {
        super(mySqlHandler);
    }

    override async get(filter?: Partial<cms_types.models.PageObject>, includeSections?: boolean, includeComponents?: boolean, includeParagraphs?: boolean): Promise<cms_types.models.PageObjectAny> {
        const dbFilter = this._getFilter(filter);
        const page = await this._mySqlHandler.get(this._tableName, dbFilter) as unknown as cms_types.models.PageObjectAny;

        const getPageWithSections = async (page: cms_types.models.PageObject) => {
            const sectionController = await SectionsController.getInstance();
            const pageSectionsController = await PageSectionsController.getInstance();
            const pageSections = await pageSectionsController.get({ page_id: page.id } as cms_types.models.PageSectionsObject) as cms_types.models.PageSectionsObject | cms_types.models.PageSectionsObject[];

            const getSections = async (pageSections: cms_types.models.PageSectionsObject | cms_types.models.PageSectionsObject[]) => {
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
                    sections: (sections as cms_types.models.SectionObject[]).sort((a, b) => a.position - b.position)
                }
            }

            return {
                ...page,
                sections
            }
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