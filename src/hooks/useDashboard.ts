import { useState, useCallback, useEffect } from 'react';
import { Widget, DashboardState } from '../types/dashboard';

const initialWidgets: Widget[] = [
    {
        id: '1',
        title: 'Revenue Overview',
        type: 'chart-line',
        position: { x: 50, y: 50 },
        size: { width: 400, height: 300 },
        color: '#3B82F6',
        zIndex: 1,
        data: [
            { name: 'Jan', value: 4200, growth: 8 },
            { name: 'Feb', value: 3800, growth: -5 },
            { name: 'Mar', value: 6200, growth: 15 },
            { name: 'Apr', value: 8100, growth: 22 },
            { name: 'May', value: 7800, growth: 18 },
            { name: 'Jun', value: 9200, growth: 28 }
        ]
    },
    {
        id: '2',
        title: 'Performance Metrics',
        type: 'chart-bar',
        position: { x: 500, y: 50 },
        size: { width: 400, height: 300 },
        color: '#8B5CF6',
        zIndex: 2,
        data: [
            { name: 'Desktop', value: 2400, percentage: 65 },
            { name: 'Mobile', value: 1398, percentage: 38 },
            { name: 'Tablet', value: 980, percentage: 26 },
            { name: 'Other', value: 390, percentage: 11 }
        ]
    },
    {
        id: '3',
        title: 'Key Metrics',
        type: 'metrics',
        position: { x: 50, y: 400 },
        size: { width: 350, height: 250 },
        color: '#10B981',
        zIndex: 3,
        data: {
            totalUsers: 12548,
            revenue: 98750,
            conversionRate: 4.2,
            avgOrderValue: 156.50
        }
    },
    {
        id: '4',
        title: 'Progress Tracking',
        type: 'progress',
        position: { x: 450, y: 400 },
        size: { width: 350, height: 250 },
        color: '#F59E0B',
        zIndex: 4,
        data: {
            goals: [
                { name: 'Monthly Sales', current: 75, target: 100, unit: '%' },
                { name: 'User Growth', current: 1247, target: 2000, unit: 'users' },
                { name: 'Customer Satisfaction', current: 4.8, target: 5.0, unit: '/5' }
            ]
        }
    }
];

export const useDashboard = () => {
    // Initialize state from local storage or fallback to initialWidgets
    const [dashboardState, setDashboardState] = useState<DashboardState>(() => {
        const savedState = localStorage.getItem('dashboardState');
        if (savedState) {
            try {
                return JSON.parse(savedState) as DashboardState;
            } catch (error) {
                console.error('Failed to parse saved state:', error);
            }
        }
        return {
            widgets: initialWidgets,
            theme: 'light',
            canvasSize: { width: 1400, height: 800 }
        };
    });

    // Save entire dashboard state to local storage whenever it changes
    useEffect(() => {
        localStorage.setItem('dashboardState', JSON.stringify(dashboardState));
    }, [dashboardState]);

    const moveWidget = useCallback((id: string, position: { x: number; y: number }) => {
        setDashboardState((prev) => ({
            ...prev,
            widgets: prev.widgets.map((w) =>
                w.id === id ? { ...w, position } : w
            )
        }));
    }, []);

    const resizeWidget = useCallback((id: string, size: { width: number; height: number }) => {
        setDashboardState((prev) => ({
            ...prev,
            widgets: prev.widgets.map((w) =>
                w.id === id ? { ...w, size } : w
            )
        }));
    }, []);

    const bringToFront = useCallback((id: string) => {
        setDashboardState((prev) => {
            const maxZ = Math.max(...prev.widgets.map((w) => w.zIndex || 0));
            return {
                ...prev,
                widgets: prev.widgets.map((w) =>
                    w.id === id ? { ...w, zIndex: maxZ + 1 } : w
                )
            };
        });
    }, []);

    const addWidget = useCallback((widget: Omit<Widget, 'id'>) => {
        const maxZ = Math.max(...dashboardState.widgets.map((w) => w.zIndex || 0), 0);
        const newWidget: Widget = {
            ...widget,
            id: `widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            zIndex: maxZ + 1
        };

        setDashboardState((prev) => ({
            ...prev,
            widgets: [...prev.widgets, newWidget]
        }));
    }, [dashboardState.widgets]);

    const removeWidget = useCallback((id: string) => {
        setDashboardState((prev) => ({
            ...prev,
            widgets: prev.widgets.filter((w) => w.id !== id)
        }));
    }, []);

    const updateWidget = useCallback((id: string, updates: Partial<Widget>) => {
        setDashboardState((prev) => ({
            ...prev,
            widgets: prev.widgets.map((w) =>
                w.id === id ? { ...w, ...updates } : w
            )
        }));
    }, []);

    const exportConfig = useCallback(() => {
        const config = JSON.stringify(dashboardState, null, 2);
        const blob = new Blob([config], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'dashboard-config.json';
        a.click();
        URL.revokeObjectURL(url);
    }, [dashboardState]);

    const importConfig = useCallback((config: string) => {
        try {
            const parsed = JSON.parse(config) as DashboardState;
            setDashboardState(parsed);
        } catch (error) {
            console.error('Failed to import configuration:', error);
        }
    }, []);

    return {
        ...dashboardState,
        moveWidget,
        resizeWidget,
        bringToFront,
        addWidget,
        removeWidget,
        updateWidget,
        exportConfig,
        importConfig,
        setTheme: (theme: 'light' | 'dark') => setDashboardState((prev) => ({ ...prev, theme }))
    };
};