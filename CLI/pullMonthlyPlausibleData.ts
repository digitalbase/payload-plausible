#!/usr/bin/node

import { exit } from 'process';

import { fetchEntryPlausibleStatsAndUpdate } from './statistics/fetchEntryPlausibleStatsAndUpdate';
import { getAllEntriesInOrderedMap } from '.statistics/getAllEntriesInOrderedMap';

const pullMonthlyPlausibleData = async (): Promise<void> => {
    const items = 10;
    const entries = await getAllEntriesInOrderedMap(items);

    console.log(`Syncing stats for the ${items} oldest items`);

    // eslint-disable-next-line no-restricted-syntax
    for (const entry of entries) {
        await fetchEntryPlausibleStatsAndUpdate(entry.collection, entry.id);
    }

    console.log('Finished syncing stats');
    exit();
};

pullMonthlyPlausibleData();
