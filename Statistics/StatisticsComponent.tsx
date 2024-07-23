import Link from 'next/link';
import type { ServerSideEditViewProps } from 'payload';

import { fetchAnalyticsForPage } from '#/payload/components/Statistics/fetchAnalyticsForPage';
import type * as Generated from '#payload/generated-types';
import { getPathsForEntry } from '@/lib/payload/getPathsForEntry';
import type { Page } from '@/types';
import { formatDate } from '@/util/formatDate';

import { ConversionRateChart } from './ConversionRateChart';
import { TrialsQualityBarChart } from './TrialsQualityBarChart';
import { getPage, getTrialsForPaths } from './utils';
import type { PlausibleMonthlyDataType } from './VisitorAndNrTrialsBarChart';
import { VisitorAndNrTrialsBarChart } from './VisitorAndNrTrialsBarChart';

export async function StatisticsComponent({ initPageResult }: ServerSideEditViewProps) {
    const id = parseInt(initPageResult.docID || '', 10);
    const collection = initPageResult.collectionConfig
        ?.slug! as keyof Generated.Config['collections'];
    const page = (await getPage(id, collection)) as Page;
    const paths = await getPathsForEntry(collection, id);

    const fetchAnalyticsByCollectionAndId = fetchAnalyticsForPage.bind(null, collection, id);

    if (!page) {
        return null;
    }

    const pageViewData = page.monthlyData as PlausibleMonthlyDataType;

    if (pageViewData) {
        const trials = await getTrialsForPaths(paths);
        // add property month
        const trialsButMappedWithMonth = trials.map((trial) => {
            // @ts-ignore
            const creationDate = new Date(trial.createdAt);
            const month = creationDate.toISOString().slice(0, 7);

            // @ts-ignore
            return { ...trial, month };
        });

        // count the trials per month
        const trialCounts = trialsButMappedWithMonth.reduce((acc, trial) => {
            acc[trial.month] = (acc[trial.month] || 0) + 1;
            return acc;
        }, {});

        // add a 'trial' property to pageViewdata with the trials
        // eslint-disable-next-line no-restricted-syntax
        for (const key of Object.keys(pageViewData)) {
            // Initialize trial count to zero for the month
            // @ts-ignore
            pageViewData[key].trials = Number(trialCounts[key]) ?? 0;
            pageViewData[key].conversionRate =
                // @ts-ignore
                (pageViewData[key].trials / pageViewData[key].visitors) * 100;
        }
    }

    return (
        <>
            <div className="gutter--left gutter--right doc-controls">
                <div className="doc-controls__wrapper">
                    <div className="doc-controls__content">
                        <ul className="doc-controls__meta">
                            {!page.lastSyncedMonthly && (
                                <li className="doc-controls__list-item doc-controls__value-wrap">
                                    <p className="doc-controls__label">
                                        Analytics not available yet.{' '}
                                    </p>
                                </li>
                            )}
                            {Boolean(page.averageMonthlyPageviews) && (
                                <li
                                    className="doc-controls__list-item doc-controls__value-wrap"
                                    title="Average monthly pageviews"
                                >
                                    <p className="doc-controls__label">Average/Month:&nbsp;</p>
                                    <p className="doc-controls__value">
                                        {page.averageMonthlyPageviews}
                                    </p>
                                </li>
                            )}
                            {page.lastSyncedMonthly && (
                                <li
                                    className="doc-controls__list-item doc-controls__value-wrap"
                                    title="June 10th 2024, 8:50 PM"
                                >
                                    <p className="doc-controls__label">Last Fetched:&nbsp;</p>
                                    <p className="doc-controls__value">
                                        {formatDate(page.lastSyncedMonthly)}
                                    </p>
                                </li>
                            )}
                            <li
                                className="doc-controls__list-item doc-controls__value-wrap"
                                title="Average monthly pageviews"
                            >
                                <p className="doc-controls__label">Plausible:&nbsp;</p>
                                <Link
                                    className="doc-controls__value"
                                    target="_blank"
                                    href={`https://plausible.io/prezly.com?period=12mo&keybindHint=L&filters=((is,page,(${page.path ?? '?'})))`}
                                >
                                    Open Report
                                </Link>
                            </li>
                            <li
                                className="doc-controls__list-item doc-controls__value-wrap"
                                title="Average monthly pageviews"
                            >
                                <p className="doc-controls__label">Google Search Console:&nbsp;</p>
                                <Link
                                    className="doc-controls__value"
                                    target="_blank"
                                    href={`https://search.google.com/search-console/performance/search-analytics?resource_id=https%3A%2F%2Fwww.prezly.com%2F&num_of_months=12&page=!https%3A%2F%2Fwww.prezly.com${page.path}`}
                                >
                                    Open Report
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="doc-controls__controls-wrapper">
                        <div className="doc-controls__controls">
                            <div className="form-submit">
                                <form action={fetchAnalyticsByCollectionAndId}>
                                    <button
                                        type="submit"
                                        className="btn btn--style-primary btn--icon-style-without-border btn--size-small btn--icon-position-right"
                                    >
                                        <span className="btn__content">
                                            <span className="btn__label">Fetch Analytics</span>
                                        </span>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="doc-controls__divider"></div>
            </div>
            <div style={{ padding: '24px 75px' }}>
                <h2 style={{ marginBottom: '10px' }}>Visitors & Nr Trials</h2>

                {page.monthlyData && <VisitorAndNrTrialsBarChart data={pageViewData} />}

                <h2 style={{ marginBottom: '10px' }}>Conversion Rate</h2>

                {page.monthlyData && <ConversionRateChart data={pageViewData} />}

                <h2 style={{ marginBottom: '10px' }}>Trials & Conversion Rate</h2>

                {page.monthlyData && <TrialsQualityBarChart data={pageViewData} />}
            </div>
        </>
    );
}
