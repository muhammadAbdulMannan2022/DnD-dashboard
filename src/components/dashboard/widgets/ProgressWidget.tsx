import React from 'react';
import { motion } from 'framer-motion';
import { Widget } from '../../../types/dashboard';

interface ProgressWidgetProps {
    widget: Widget;
}

export const ProgressWidget: React.FC<ProgressWidgetProps> = ({ widget }) => {
    const { data, color = '#3B82F6' } = widget;
    const goals = data?.goals || [];

    return (
        <div className="space-y-6 h-full">
            {goals.map((goal: any, index: number) => {
                const percentage = Math.min((goal.current / goal.target) * 100, 100);

                return (
                    <motion.div
                        key={goal.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="space-y-2"
                    >
                        <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-800 text-sm">{goal.name}</span>
                            <span className="text-sm text-gray-600">
                                {goal.current.toLocaleString()}{goal.unit} / {goal.target.toLocaleString()}{goal.unit}
                            </span>
                        </div>

                        <div className="relative">
                            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percentage}%` }}
                                    transition={{ duration: 1, delay: index * 0.2 }}
                                    className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-600"
                                    style={{
                                        background: `linear-gradient(90deg, ${color}80 0%, ${color} 100%)`
                                    }}
                                />
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-xs font-semibold text-white drop-shadow-sm">
                                    {percentage.toFixed(1)}%
                                </span>
                            </div>
                        </div>

                        {percentage >= 100 && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-xs text-green-600 font-medium flex items-center gap-1"
                            >
                                ✓ Goal achieved!
                            </motion.div>
                        )}
                    </motion.div>
                );
            })}
        </div>
    );
};