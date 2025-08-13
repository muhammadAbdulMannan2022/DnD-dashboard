import React from 'react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { Widget } from '../../../types/dashboard';

interface ChartWidgetProps {
    widget: Widget;
}

export const ChartWidget: React.FC<ChartWidgetProps> = ({ widget }) => {
    const { type, data, color = '#3B82F6' } = widget;

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg p-3 shadow-lg">
                    <p className="font-semibold text-gray-800">{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <p key={index} className="text-sm" style={{ color: entry.color }}>
                            {`${entry.dataKey}: ${entry.value.toLocaleString()}`}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    const renderChart = () => {
        switch (type) {
            case 'chart-line':
                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="name" stroke="#666" fontSize={12} />
                            <YAxis stroke="#666" fontSize={12} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke={color}
                                strokeWidth={3}
                                dot={{ fill: color, strokeWidth: 2, r: 4 }}
                                activeDot={{ r: 6, stroke: color, strokeWidth: 2, fill: '#fff' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                );

            case 'chart-bar':
                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="name" stroke="#666" fontSize={12} />
                            <YAxis stroke="#666" fontSize={12} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                );

            case 'chart-pie':
                const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];
                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {data?.map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                );

            default:
                return <div>Unknown chart type</div>;
        }
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex-1 min-h-0">
                {renderChart()}
            </div>
        </div>
    );
};