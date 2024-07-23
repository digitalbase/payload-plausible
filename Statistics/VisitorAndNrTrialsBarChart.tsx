'use client';

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export type PlausibleMonthlyDataType = Record<
    string,
    {
        visits: number;
        visitors: number;
        pageviews: number;
        bounce_rate: number;
        visit_duration: number;
        trial?: number;
        conversionRate?: number;
    }
>;

interface Props {
    data: PlausibleMonthlyDataType;
}

export function VisitorAndNrTrialsBarChart({ data }: Props) {
    const chartData = Object.entries(data).map(([date, entry]) => ({
        date,
        ...entry,
    }));

    return (
        <div style={{ position: 'relative', width: '100%' }}>
            <ResponsiveContainer>
                {/** @ts-expect-error types do not work with RC or React 19 */}
                <BarChart width={1000} height={300} data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis mirror={true} />
                    <Tooltip />
                    <Bar dataKey="pageviews" fill="#8884d8" />
                    <Bar dataKey="visitors" fill="#82ca9d" />
                    <Bar dataKey="trials" fill="#ffc658" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
