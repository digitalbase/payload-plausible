import type { Where } from 'payload';

import type { PageLike } from '@/src/types';

export async function getPage(id: number, collection: string) {
    const { getPayloadLocalClient } = await import('#payload/client');
    const payload = await getPayloadLocalClient();
    return payload.findByID({ collection: collection as any, id });
}

export async function getEventsForTrial(id: number) {
    const { getPayloadLocalClient } = await import('#payload/client');
    const payload = await getPayloadLocalClient();
    return payload.find({
        collection: 'events',
        where: { trial: { equals: id } },
        limit: 1000,
    });
}

export async function getEventsForPaths(paths: string[]) {
    const { getPayloadLocalClient } = await import('#payload/client');
    const payload = await getPayloadLocalClient();
    return payload.find({
        collection: 'events',
        where: {
            and: [{ path: { in: paths } }, { happenedAfterConversion: { equals: false } }],
        },
        limit: 1000,
    });
}

export function doesCollectionHaveStatus(collection: string) {
    const collectionsWithStatus = ['pages', 'example-category', 'casestudies', 'round-tables'];

    return collectionsWithStatus.includes(collection);
}

export async function getTrialsForPaths(path: string[]) {
    const allEvents = await getEventsForPaths(path);

    const trials = allEvents.docs.map((entry) => entry.trial);

    // @ts-ignore
    const uniqueTrialsInMap = new Map(trials.map((trial) => [trial.id, trial]));

    return [...uniqueTrialsInMap.values()];
}

export function whereConflicting(page: PageLike) {
    const [pathWithoutTrailingSlash, pathWithTrailingSlash] = pathVariations(page.path);

    return {
        or: [
            { from: { equals: pathWithoutTrailingSlash } },
            { from: { equals: pathWithTrailingSlash } },
        ],
    };
}

export function wherePointingTo(page: PageLike) {
    const [pathWithoutTrailingSlash, pathWithTrailingSlash] = pathVariations(page.path);

    return {
        or: [
            {
                'to.type': { equals: 'custom' },
                'to.url': { equals: pathWithTrailingSlash },
            },
            {
                'to.type': { equals: 'custom' },
                'to.url': { equals: pathWithoutTrailingSlash },
            },
            {
                'to.type': { equals: 'custom' },
                'to.url': { equals: `https://www.prezly.com${pathWithTrailingSlash}` },
            },
            {
                'to.type': { equals: 'custom' },
                'to.url': { equals: `https://www.prezly.com${pathWithoutTrailingSlash}` },
            },
            {
                'to.type': { equals: 'reference' },
                'to.reference.value': { equals: page.id },
            },
        ],
    } as Where;
}

function pathVariations(path: string): [string, string] {
    const pathWithTrailingSlash = path.endsWith('/') ? path : `${path}/`;
    const pathWithoutTrailingSlash = path.endsWith('/') ? path.substring(0, path.length - 1) : path;

    return [pathWithoutTrailingSlash, pathWithTrailingSlash];
}
