import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload';

import { ALL_BLOCKS } from '#/payload/blocks/constants';
import { PreviewEntityTabLink } from '#/payload/components/PreviewEntityTabLink';
import { RedirectsComponent } from '#/payload/components/Redirects/RedirectsComponent';
import { RedirectsTab } from '#/payload/components/Redirects/RedirectsTab';
import { StatisticsComponent } from '#/payload/components/Statistics/StatisticsComponent';
import { StatisticsTab } from '#/payload/components/Statistics/StatisticsTab';
import { UsagesTab } from '#/payload/components/UsagesTab';
import { backgroundColor } from '#/payload/fields';
import { PlausibleData } from '#/payload/fields/PlausibleData';
import { formatSlug } from '#/payload/hooks/formatSlug';
import { revalidate } from '#/payload/hooks/revalidate';
import type { ContentBlock, Page } from '#payload/generated-types';
import { stringifySlateContent } from '@/lib/stringifySlateContent';

const guessMeta: CollectionBeforeChangeHook<Page> = async ({ data }) => {
    const newDoc = data;

    if (newDoc.meta && !newDoc.meta?.title) {
        newDoc.meta.title = data.title;
    }

    if (newDoc.meta && !newDoc.meta.description && newDoc.layout) {
        const firstContentBlock = newDoc.layout.find(
            (item) => item.blockType === 'content',
        ) as ContentBlock;

        if (firstContentBlock) {
            newDoc.meta.description = stringifySlateContent(firstContentBlock.body);
        }
    }
    return newDoc;
};

export const Pages: CollectionConfig = {
    slug: 'pages',
    custom: {
        plausible: true,
    },
    hooks: {
        beforeChange: [guessMeta],
        afterChange: [
            revalidate<Page>({
                path: (page) => page.path,
            }),
        ],
    },
    admin: {
        group: 'Page Entities',
        useAsTitle: 'path',
        defaultColumns: ['path', 'status', 'title', 'averageMonthlyPageviews', 'updatedAt'],
        pagination: {
            defaultLimit: 100,
            limits: [10, 25, 50, 100, 250, 500],
        },
        components: {
            views: {
                Edit: {
                    Statistics: {
                        Component: StatisticsComponent,
                        path: '/statistics',
                        Tab: StatisticsTab,
                    },
                },
            },
        },
    },
    versions: {
        drafts: true,
    },
    fields: [
        {
            type: 'tabs',
            tabs: [
                {
                    label: 'Content',
                    fields: [
                        {
                            name: 'migration_status',
                            label: 'Migration status',
                            type: 'radio',
                            options: [
                                {
                                    label: 'Contentful',
                                    value: 'contentful',
                                },
                                {
                                    label: 'PayloadCMS',
                                    value: 'payload',
                                },
                            ],
                            defaultValue: 'payload',
                            required: true,
                            admin: {
                                hidden: true,
                                layout: 'horizontal',
                            },
                        },
                        {
                            name: 'title',
                            label: 'Title',
                            type: 'text',
                        },
                        {
                            name: 'layout',
                            type: 'blocks',
                            admin: {
                                condition: (_, record) => isMigratedToPayload(record),
                                initCollapsed: true,
                            },
                            minRows: 1,
                            maxRows: 30,
                            blocks: ALL_BLOCKS,
                        },
                    ],
                },
                {
                    label: 'Plausible',
                    fields: PlausibleData,
                },
            ],
        },
    ],
};
