
export async function getPlausibleDataForPath(paths: string[]) {
    const plausibleUrl = new URL('https://plausible.io/api/v1/stats/timeseries');
    const token = 'g8R9TNFpgeURGq7wWeaAeGm7k66N95lRsi6XUZAjHdhExWvKpQujewHyghtdD4Ay'

    plausibleUrl.searchParams.append('site_id', 'prezly.com');
    plausibleUrl.searchParams.append('period', '12mo');
    plausibleUrl.searchParams.append(
        'metrics',
        'visitors,visits,pageviews,bounce_rate,visit_duration',
    );
    // plausibleUrl.searchParams.append('interval', 'month');
    plausibleUrl.searchParams.append('filters', `event:page==${paths.join('|')}`);

    const response = await fetch(plausibleUrl.href, {
        method: 'GET',
        headers: {
            authorization: `Bearer ${token}`,
        },
    });

    const plausibleResponse = await response.json();
    if (!response.ok) {
        console.error(plausibleResponse);
        throw new Error(String(plausibleResponse));
    }

    return plausibleResponse.results;
}
