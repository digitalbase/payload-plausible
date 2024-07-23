import { analysePlausibleStats } from '#/payload/components/Statistics/analysePlausibleStats';
import { getPlausibleDataForPath } from '#/payload/modules/statistics/getPlausibleDataForPath';
import { unflattenPlausibleData } from '#/payload/modules/statistics/unflattenPlausibleData';
import type * as Generated from '#payload/generated-types';
import { getPathsForEntry } from '@/lib/payload/getPathsForEntry';

type Collection = keyof Generated.Config['collections'];

export async function fetchEntryPlausibleStatsAndUpdate(
    collection: Collection,
    id: string | number,
) {
    const { getPayloadLocalClient } = await import('#payload/client');
    const payload = await getPayloadLocalClient();
    const entry = await payload.findByID({ collection, id });

    if (!entry) {
        console.error(`Entry #${id} not found in collection ${collection}`);

        return null;
    }

    if (!('path' in entry) || !entry.path) {
        console.error(`can not find path on entry #${id} in collection ${collection}`);

        return null;
    }

    if (!('lastSyncedMonthly' in entry)) {
        console.error(
            `can not find required columns (lastSyncedMonthly) on entry #${id} in collection ${collection}`,
        );

        return null;
    }

    const { path } = entry;
    console.log(
        `Syncing entry #${entry.id} at ${path} because it was last synced on ${entry.lastSyncedMonthly}`,
    );

    const paths = await getPathsForEntry(collection, id);
    const plausibleData = await getPlausibleDataForPath(paths);
    const monthlyData = unflattenPlausibleData(plausibleData);
    const monthlyDataAnalysed = analysePlausibleStats(plausibleData);

    return payload.update({
        collection,
        id,
        data: {
            // @ts-ignore
            monthlyData,
            monthlyDataAnalysed,
            averageMonthlyPageviews: monthlyDataAnalysed?.average?.pageviews ?? 0,
            lastSyncedMonthly: new Date(),
        },
    });
}
