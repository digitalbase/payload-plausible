'use client';

import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

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

// @ts-ignore
const toPercent = (decimal, fixed = 0) => `${decimal.toFixed(fixed)}%`;

// @ts-ignore
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip">
                <p className="label">{`${label} : ${toPercent(payload[0].value, 2)}`}</p>
            </div>
        );
    }

    return null;
};

export function ConversionRateChart({ data }: Props) {
    const chartData = Object.entries(data).map(([date, entry]) => ({
        date,
        ...entry,
    }));

    return (
        <div style={{ position: 'relative', width: '100%' }}>
            <ResponsiveContainer>
                {/** @ts-expect-error types do not work with RC or React 19 */}
                <AreaChart width={1000} height={300} data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis mirror={true} tickFormatter={toPercent} />
                    {/* @ts-ignore */}
                    <Tooltip content={<CustomTooltip />} />
                    <Tooltip />
                    <Area
                        type="monotone"
                        dataKey="conversionRate"
                        stroke="#82ca9d"
                        fill="#82ca9d"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
