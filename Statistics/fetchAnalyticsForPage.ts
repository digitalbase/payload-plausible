import { fetchEntryPlausibleStatsAndUpdate } from '#/payload/modules/statistics/fetchEntryPlausibleStatsAndUpdate';
import type * as Generated from '#payload/generated-types';

type Collection = keyof Generated.Config['collections'];

export async function fetchAnalyticsForPage(collection: Collection, id: string | number) {
    'use server';

    try {
        const entry = await fetchEntryPlausibleStatsAndUpdate(collection, id);

        if (entry) {
            console.log(`Updated ${collection} entry #${id}`);
        }
    } catch (error) {
        console.error('entry not found');
        throw error;
    }
}
