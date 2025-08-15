export interface WidgetStyle {
    id: string;
    type: 'chart-line' | 'chart-bar' | 'chart-pie' | 'metrics' | 'progress' | 'table';
    position: { x: number; y: number };
    size: { width: number; height: number };
    color: string;
    zIndex: number;
}

export interface ChartData {
    name: string;
    value: number;
    [key: string]: any;
}

export interface MetricsData {
    totalUsers: number;
    revenue: number;
    conversionRate: number;
    avgOrderValue: number;
}

export interface ProgressGoal {
    name: string;
    current: number;
    target: number;
    unit: string;
}

export interface ProgressData {
    goals: ProgressGoal[];
}

export interface Widget {
    id: string;
    title: string;
    type: 'chart-line' | 'chart-bar' | 'chart-pie' | 'metrics' | 'progress' | 'table';
    position: { x: number; y: number };
    size: { width: number; height: number };
    color: string;
    zIndex: number;
    data: ChartData[] | MetricsData | ProgressData | any; // Union type for different widget data
    config?: Record<string, any>;
}

export interface DashboardState {
    widgets: Widget[];
    theme: 'light' | 'dark';
    canvasSize: { width: number; height: number };
}