import { doesCollectionHaveStatus } from '#/payload/components/Statistics/utils';
import { getPayloadLocalClient } from '#payload/client';

function chronologicallyDescendingWithNullsFirst() {
    return (a: any, b: any) => {
        // equal items sort equally
        if (a.lastSyncedMonthly === b.lastSyncedMonthly) {
            return 0;
        }

        // nulls sort after anything else
        if (a.lastSyncedMonthly === null) {
            return -1;
        }
        if (b.lastSyncedMonthly === null) {
            return 1;
        }

        return new Date(a.lastSyncedMonthly) < new Date(b.lastSyncedMonthly) ? -1 : 1;
    };
}

export async function getAllEntriesInOrderedMap(limit: number) {
    const payload = await getPayloadLocalClient();

    const collectionsToBeSynced = Object.values(payload.collections).filter(
        (collection) => collection.config.custom?.plausible,
    );

    const collectionsToBeSyncedSlugs = collectionsToBeSynced.map(
        (collection) => collection.config.slug,
    );

    let allEntries: any[] = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const collection of collectionsToBeSyncedSlugs) {
        const hasStatusColumn = doesCollectionHaveStatus(collection);
        const where =
            collection === 'stories'
                ? hasStatusColumn
                    ? { status: { equals: 'published' } }
                    : undefined
                : hasStatusColumn
                  ? { _status: { equals: 'published' } }
                  : undefined;

        // eslint-disable-next-line no-await-in-loop
        const results = await payload.find({
            // @ts-ignore
            collection,
            // @ts-ignore
            where,
            page: 0,
            limit: 10000,
            pagination: false,
            sort: '-lastSyncedMonthly',
        });

        const orderAndLimitedBecausePayloadSortingDoesNotWork = results.docs.sort(
            chronologicallyDescendingWithNullsFirst(),
        );

        const resultsMapped = orderAndLimitedBecausePayloadSortingDoesNotWork.map((item) => ({
            collection,
            id: item.id,
            // @ts-ignore
            lastSyncedMonthly: item.lastSyncedMonthly,
        }));

        allEntries = [...allEntries, ...resultsMapped];
    }

    const sortedEntries = allEntries.sort(chronologicallyDescendingWithNullsFirst());
    return sortedEntries.slice(0, limit);
}
