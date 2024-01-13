export module cms_types {
    export module mysql {
        export interface MySqlFilter {
            columnName: string;
            operand: '=' | '>' | '<' | 'MAX';
            value: any;
        }

        export type MySqlFilterAny = cms_types.mysql.MySqlFilter | cms_types.mysql.MySqlFilter[];
    }

    export module models {
        export interface ModelCommonObject {
            id?: number;
        }

        export type ModelCommonObjectAny = ModelCommonObject | ModelCommonObject[];

        export interface ParagraphObject extends ModelCommonObject {
            component_id: number;
            position: number;
            header?: string;
            text?: string;
            image?: string;
            href?: string;
            href_text?: string;
            componentId?: string;
        }

        export type ParagraphObjectAny = ParagraphObject | ParagraphObject[];

        export interface ComponentCategoryObject extends ModelCommonObject { 
            category_name: string;
        }

        export interface ComponentObject extends ModelCommonObject {
            category: string;
            header?: string;
            image?: string;
            href?: string;
            href_text?: string;
            sectionId?: number;
        }

        export type ComponentObjectAny = ComponentObject | ComponentObject[];

        export interface SectionComponentsObject extends ModelCommonObject {
            section_id: number;
            component_id: number;
        }

        export interface SectionObject extends ModelCommonObject {
            header?: string;
            position: number;
            pageId?: number;
            is_active: boolean;
            changed_date: Date;
        }

        export type SectionObjectAny = SectionObject | SectionObject[];

        export interface PageSectionsObject extends ModelCommonObject {
            page_id: number;
            section_id: number;
        }

        export interface PageObject extends ModelCommonObject {
            title?: string;
            path: string;
            changed_date: Date;
            author: number;
        }

        export type PageObjectAny = PageObject | PageObject[];

        export interface InquryObject extends ModelCommonObject {
            email: string;
            name?: string;
            category: string;
            content: string;
        };
    }
}