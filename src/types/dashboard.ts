export interface Widget {
    id: string;
    title: string;
    type: 'chart-line' | 'chart-bar' | 'chart-pie' | 'metrics' | 'progress' | 'table';
    position: { x: number; y: number }; // absolute position in pixels
    size: { width: number; height: number }; // size in pixels
    data?: any;
    config?: Record<string, any>;
    color?: string;
    zIndex?: number;
}

export interface DashboardState {
    widgets: Widget[];
    theme: 'light' | 'dark';
    canvasSize: { width: number; height: number };
}

export interface ChartData {
    name: string;
    value: number;
    [key: string]: any;
}