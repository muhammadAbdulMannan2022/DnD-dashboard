import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BarChart3, LineChart as LineChartIcon, PieChart, Activity, Target, Gauge } from 'lucide-react';
import { Widget } from '../../types/dashboard';

interface AddWidgetModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (widget: Omit<Widget, 'id'>) => void;
}

const widgetTypes = [
    {
        type: 'chart-line' as const,
        name: 'Line Chart',
        icon: LineChartIcon,
        description: 'Display trends over time'
    },
    {
        type: 'chart-bar' as const,
        name: 'Bar Chart',
        icon: BarChart3,
        description: 'Compare different categories'
    },
    {
        type: 'chart-pie' as const,
        name: 'Pie Chart',
        icon: PieChart,
        description: 'Show proportional data'
    },
    {
        type: 'metrics' as const,
        name: 'Key Metrics',
        icon: Activity,
        description: 'Display important KPIs'
    },
    {
        type: 'progress' as const,
        name: 'Progress Tracker',
        icon: Target,
        description: 'Track goal completion'
    }
];

export const AddWidgetModal: React.FC<AddWidgetModalProps> = ({ isOpen, onClose, onAdd }) => {
    const [selectedType, setSelectedType] = useState<Widget['type']>('chart-line');
    const [title, setTitle] = useState('');
    const [color, setColor] = useState('#3B82F6');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        const sampleData = getSampleData(selectedType);

        onAdd({
            title: title.trim(),
            type: selectedType,
            position: { x: 100, y: 100 },
            size: {
                width: selectedType === 'metrics' ? 350 : 400,
                height: selectedType === 'progress' ? 250 : 300
            },
            color,
            data: sampleData
        });

        setTitle('');
        setSelectedType('chart-line');
        setColor('#3B82F6');
        onClose();
    };

    const getSampleData = (type: Widget['type']) => {
        switch (type) {
            case 'chart-line':
                return [
                    { name: 'Week 1', value: 400 },
                    { name: 'Week 2', value: 300 },
                    { name: 'Week 3', value: 600 },
                    { name: 'Week 4', value: 800 }
                ];
            case 'chart-bar':
                return [
                    { name: 'Product A', value: 2400 },
                    { name: 'Product B', value: 1398 },
                    { name: 'Product C', value: 9800 }
                ];
            case 'chart-pie':
                return [
                    { name: 'Desktop', value: 60 },
                    { name: 'Mobile', value: 30 },
                    { name: 'Tablet', value: 10 }
                ];
            case 'metrics':
                return {
                    totalUsers: 1000,
                    revenue: 50000,
                    conversionRate: 3.5,
                    avgOrderValue: 125
                };
            case 'progress':
                return {
                    goals: [
                        { name: 'Monthly Target', current: 75, target: 100, unit: '%' },
                        { name: 'Customer Growth', current: 850, target: 1000, unit: ' users' }
                    ]
                };
            default:
                return {};
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-800">Add New Widget</h2>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Widget Title
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    placeholder="Enter widget title..."
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Widget Type
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {widgetTypes.map((type) => {
                                        const Icon = type.icon;
                                        return (
                                            <motion.button
                                                key={type.type}
                                                type="button"
                                                onClick={() => setSelectedType(type.type)}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className={`p-4 rounded-lg border-2 transition-all text-left ${selectedType === type.type
                                                        ? 'border-blue-500 bg-blue-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className={`p-2 rounded-lg ${selectedType === type.type ? 'bg-blue-100' : 'bg-gray-100'
                                                        }`}>
                                                        <Icon size={20} className={
                                                            selectedType === type.type ? 'text-blue-600' : 'text-gray-600'
                                                        } />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-medium text-gray-800">{type.name}</h3>
                                                        <p className="text-sm text-gray-600">{type.description}</p>
                                                    </div>
                                                </div>
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Color Theme
                                </label>
                                <div className="flex gap-3">
                                    {['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'].map((colorOption) => (
                                        <button
                                            key={colorOption}
                                            type="button"
                                            onClick={() => setColor(colorOption)}
                                            className={`w-10 h-10 rounded-full border-4 transition-transform ${color === colorOption ? 'border-gray-800 scale-110' : 'border-gray-200'
                                                }`}
                                            style={{ backgroundColor: colorOption }}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Add Widget
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};