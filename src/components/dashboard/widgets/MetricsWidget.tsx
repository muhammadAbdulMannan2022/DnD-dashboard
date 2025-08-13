import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Users, DollarSign, Target, ShoppingCart } from 'lucide-react';
import { Widget } from '../../../types/dashboard';

interface MetricsWidgetProps {
    widget: Widget;
}

export const MetricsWidget: React.FC<MetricsWidgetProps> = ({ widget }) => {
    const { data, color = '#3B82F6' } = widget;

    const metrics = [
        {
            key: 'totalUsers',
            label: 'Total Users',
            icon: Users,
            color: '#3B82F6',
            growth: 12
        },
        {
            key: 'revenue',
            label: 'Revenue',
            icon: DollarSign,
            color: '#10B981',
            prefix: '$',
            growth: 8
        },
        {
            key: 'conversionRate',
            label: 'Conversion Rate',
            icon: Target,
            color: '#8B5CF6',
            suffix: '%',
            growth: -2
        },
        {
            key: 'avgOrderValue',
            label: 'Avg Order Value',
            icon: ShoppingCart,
            color: '#F59E0B',
            prefix: '$',
            growth: 15
        }
    ];

    const formatValue = (value: number, prefix = '', suffix = '') => {
        return `${prefix}${value.toLocaleString()}${suffix}`;
    };

    return (
        <div className="grid grid-cols-2 gap-4 h-full">
            {metrics.map((metric, index) => {
                const value = data?.[metric.key];
                const Icon = metric.icon;

                if (value === undefined) return null;

                return (
                    <motion.div
                        key={metric.key}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gradient-to-br from-gray-50/50 to-white/50 border border-gray-100/50 rounded-lg p-4 hover:shadow-md transition-all duration-200"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div
                                className="p-2 rounded-lg"
                                style={{ backgroundColor: `${metric.color}20` }}
                            >
                                <Icon size={20} style={{ color: metric.color }} />
                            </div>
                            <div className="flex items-center gap-1 text-xs">
                                {metric.growth > 0 ? (
                                    <>
                                        <TrendingUp size={12} className="text-green-500" />
                                        <span className="text-green-500 font-medium">+{metric.growth}%</span>
                                    </>
                                ) : (
                                    <>
                                        <TrendingDown size={12} className="text-red-500" />
                                        <span className="text-red-500 font-medium">{metric.growth}%</span>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-2xl font-bold text-gray-800">
                                {formatValue(value, metric.prefix, metric.suffix)}
                            </div>
                            <div className="text-sm text-gray-600">{metric.label}</div>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
};