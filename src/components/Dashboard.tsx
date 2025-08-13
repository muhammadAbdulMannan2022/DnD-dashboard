import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Download, Upload, Settings, Sun, Moon } from 'lucide-react';
import { useDashboard } from '../hooks/useDashboard';
import { DraggableWidget } from './dashboard/DraggableWidget';
import { AddWidgetModal } from './dashboard/AddWidgetModal';
// import { DraggableWidget } from './dashboard/DraggableWidget';
// import { AddWidgetModal } from './dashboard/AddWidgetModal';

export const Dashboard: React.FC = () => {
    const [showAddModal, setShowAddModal] = useState(false);

    const {
        widgets,
        theme,
        canvasSize,
        moveWidget,
        resizeWidget,
        bringToFront,
        addWidget,
        removeWidget,
        updateWidget,
        exportConfig,
        importConfig,
        setTheme
    } = useDashboard();

    const handleImportConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const content = event.target?.result as string;
                importConfig(content);
            };
            reader.readAsText(file);
        }
    };

    return (
        <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark'
            ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
            : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
            }`}>
            {/* Header */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="sticky top-0 z-40 backdrop-blur-md bg-white/80 border-b border-gray-200/50 shadow-sm"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <motion.h1
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                            >
                                Analytics Dashboard
                            </motion.h1>
                            <div className="hidden sm:block text-sm text-gray-500">
                                {widgets.length} widgets
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                            >
                                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                            </button>

                            <button
                                onClick={() => setShowAddModal(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                            >
                                <Plus size={18} />
                                <span className="hidden sm:inline">Add Widget</span>
                            </button>

                            <div className="relative">
                                <button
                                    onClick={exportConfig}
                                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                                    title="Export Configuration"
                                >
                                    <Download size={20} />
                                </button>
                            </div>

                            <div className="relative">
                                <input
                                    type="file"
                                    accept=".json"
                                    onChange={handleImportConfig}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    title="Import Configuration"
                                />
                                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all">
                                    <Upload size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {widgets.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-20"
                    >
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-lg max-w-md mx-auto">
                            <div className="mb-6">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Settings size={32} className="text-blue-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                    Welcome to your Dashboard
                                </h3>
                                <p className="text-gray-600">
                                    Get started by adding your first widget to visualize your data
                                </p>
                            </div>
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                            >
                                Add Your First Widget
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <div
                        className="relative bg-white/20 backdrop-blur-sm rounded-2xl border border-gray-200/30 overflow-hidden"
                        style={{
                            width: canvasSize.width,
                            height: canvasSize.height,
                            minHeight: '600px'
                        }}
                    >
                        {/* Grid pattern background */}
                        <div
                            className="absolute inset-0 opacity-10"
                            style={{
                                backgroundImage: `
                  linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
                `,
                                backgroundSize: '20px 20px'
                            }}
                        />

                        {widgets.map((widget) => (
                            <DraggableWidget
                                key={widget.id}
                                widget={widget}
                                onMove={moveWidget}
                                onResize={resizeWidget}
                                onRemove={removeWidget}
                                onUpdate={updateWidget}
                                onBringToFront={bringToFront}
                                canvasSize={canvasSize}
                            />
                        ))}
                    </div>
                )}
            </main>

            {/* Add Widget Modal */}
            <AddWidgetModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onAdd={addWidget}
            />
        </div>
    );
};