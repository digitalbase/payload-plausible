import type { Field } from 'payload';

export const PlausibleData: Field[] = [
    {
        name: 'lastSyncedMonthly',
        label: 'When Plausible data was last fetched',
        type: 'date',
        admin: {
            readOnly: true,
        },
    },
    {
        name: 'monthlyData',
        type: 'json',
    },
    {
        name: 'monthlyDataAnalysed',
        type: 'json',
    },
    {
        name: 'averageMonthlyPageviews',
        defaultValue: 0,
        type: 'number',
    },
];
