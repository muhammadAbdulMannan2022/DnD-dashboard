import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, X, Move } from 'lucide-react';
import { Widget } from '../../types/dashboard';
import { ChartWidget } from './widgets/ChartWidget';
import { MetricsWidget } from './widgets/MetricsWidget';
import { ProgressWidget } from './widgets/ProgressWidget';

interface WidgetCardProps {
    widget: Widget;
    onRemove: (id: string) => void;
    onUpdate: (id: string, updates: Partial<Widget>) => void;
    isDragging?: boolean;
}

export const WidgetCard: React.FC<WidgetCardProps> = ({
    widget,
    onRemove,
    onUpdate,
    isDragging
}) => {
    const [showSettings, setShowSettings] = useState(false);

    const renderContent = () => {
        switch (widget.type) {
            case 'chart-line':
            case 'chart-bar':
            case 'chart-pie':
                return <ChartWidget widget={widget} />;
            case 'metrics':
                return <MetricsWidget widget={widget} />;
            case 'progress':
                return <ProgressWidget widget={widget} />;
            default:
                return <div>Unknown widget type</div>;
        }
    };

    return (
        <motion.div
            whileHover={{ scale: isDragging ? 1 : 1.01 }}
            className={`
        bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-xl shadow-lg
        hover:shadow-xl transition-all duration-300 overflow-hidden h-full
        ${isDragging ? 'shadow-2xl ring-2 ring-blue-400/50' : ''}
      `}
        >
            {/* Widget Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100/50 bg-gradient-to-r from-gray-50/50 to-white/50">
                <div className="flex items-center gap-3">
                    <Move size={16} className="text-gray-400" />
                    <h3 className="font-semibold text-gray-800 truncate">{widget.title}</h3>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100/50 rounded-md transition-colors"
                    >
                        <Settings size={16} />
                    </button>
                    <button
                        onClick={() => onRemove(widget.id)}
                        className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>

            {/* Settings Panel */}
            {showSettings && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-b border-gray-100/50 bg-gray-50/50 p-4"
                >
                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Title
                            </label>
                            <input
                                type="text"
                                value={widget.title}
                                onChange={(e) => onUpdate(widget.id, { title: e.target.value })}
                                className="w-full px-3 py-1 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Color Theme
                            </label>
                            <div className="flex gap-2">
                                {['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'].map(color => (
                                    <button
                                        key={color}
                                        onClick={() => onUpdate(widget.id, { color })}
                                        className={`w-6 h-6 rounded-full border-2 ${widget.color === color ? 'border-gray-800' : 'border-gray-200'
                                            }`}
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Widget Content */}
            <div className="p-4 flex-1 overflow-hidden" style={{ height: 'calc(100% - 60px)' }}>
                {renderContent()}
            </div>
        </motion.div>
    );
};