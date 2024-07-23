type PlausibleStat = {
    date: string;
    pageviews: number;
    visitors: number;
    visits: number;
};

export function analysePlausibleStats(stats: PlausibleStat[]) {
    const analysed = {
        totals: {
            pageviews: stats.reduce((accum, item) => accum + item.pageviews, 0),
            visitors: stats.reduce((accum, item) => accum + item.visitors, 0),
            visits: stats.reduce((accum, item) => accum + item.visits, 0),
        },
        months: {
            active: stats.filter((item) => item.pageviews > 0).length,
            inactive: stats.filter((item) => item.pageviews === 0).length,
        },
    };

    const average = {
        average: {
            pageviews: Math.round(analysed.totals.pageviews / analysed.months.active),
            visitors: Math.round(analysed.totals.visitors / analysed.months.active),
            visits: Math.round(analysed.totals.visits / analysed.months.active),
        },
    };

    return { ...analysed, ...average };
}
