type PlausibleStat = {
    date: string;
    pageviews: number;
    visitors: number;
    visits: number;
};

export function unflattenPlausibleData(stats: PlausibleStat[]) {
    return Object.fromEntries(
        stats.map(({ date, ...rest }) => {
            const monthIdentifier = date.substring(0, 7); // @Yuriy was here
            return [monthIdentifier, rest];
        }),
    );
}
