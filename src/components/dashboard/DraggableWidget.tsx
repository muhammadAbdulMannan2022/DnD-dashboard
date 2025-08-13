import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Widget } from '../../types/dashboard';
import { WidgetCard } from './WidgetCard';

interface DraggableWidgetProps {
    widget: Widget;
    onMove: (id: string, position: { x: number; y: number }) => void;
    onResize: (id: string, size: { width: number; height: number }) => void;
    onRemove: (id: string) => void;
    onUpdate: (id: string, updates: Partial<Widget>) => void;
    onBringToFront: (id: string) => void;
    canvasSize: { width: number; height: number };
}

export const DraggableWidget: React.FC<DraggableWidgetProps> = ({
    widget,
    onMove,
    onResize,
    onRemove,
    onUpdate,
    onBringToFront,
    canvasSize
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
    const widgetRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).classList.contains('resize-handle')) {
            return; // Let resize handle take care of this
        }

        e.preventDefault();
        setIsDragging(true);
        onBringToFront(widget.id);

        const rect = widgetRef.current?.getBoundingClientRect();
        if (rect) {
            setDragStart({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            });
        }
    };

    const handleResizeMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsResizing(true);
        onBringToFront(widget.id);

        setResizeStart({
            x: e.clientX,
            y: e.clientY,
            width: widget.size.width,
            height: widget.size.height
        });
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) {
                const newX = Math.max(0, Math.min(canvasSize.width - widget.size.width, e.clientX - dragStart.x));
                const newY = Math.max(0, Math.min(canvasSize.height - widget.size.height, e.clientY - dragStart.y));

                onMove(widget.id, { x: newX, y: newY });
            }

            if (isResizing) {
                const deltaX = e.clientX - resizeStart.x;
                const deltaY = e.clientY - resizeStart.y;

                const newWidth = Math.max(200, Math.min(canvasSize.width - widget.position.x, resizeStart.width + deltaX));
                const newHeight = Math.max(150, Math.min(canvasSize.height - widget.position.y, resizeStart.height + deltaY));

                onResize(widget.id, { width: newWidth, height: newHeight });
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            setIsResizing(false);
        };

        if (isDragging || isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = isDragging ? 'grabbing' : 'nw-resize';
            document.body.style.userSelect = 'none';
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };
    }, [isDragging, isResizing, dragStart, resizeStart, widget, onMove, onResize, canvasSize]);

    return (
        <motion.div
            ref={widgetRef}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{
                position: 'absolute',
                left: widget.position.x,
                top: widget.position.y,
                width: widget.size.width,
                height: widget.size.height,
                zIndex: widget.zIndex || 1,
                cursor: isDragging ? 'grabbing' : 'grab'
            }}
            onMouseDown={handleMouseDown}
            className={`select-none ${isDragging ? 'shadow-2xl' : ''}`}
        >
            <WidgetCard
                widget={widget}
                onRemove={onRemove}
                onUpdate={onUpdate}
                isDragging={isDragging}
            />

            {/* Resize Handle */}
            <div
                className="absolute bottom-0 right-0 w-4 h-4 cursor-nw-resize resize-handle"
                onMouseDown={handleResizeMouseDown}
                style={{
                    background: 'linear-gradient(-45deg, transparent 30%, #3B82F6 30%, #3B82F6 70%, transparent 70%)',
                    borderRadius: '0 0 8px 0'
                }}
            />

            {/* Resize indicator lines */}
            <div
                className="absolute bottom-1 right-1 w-2 h-0.5 bg-white/60 resize-handle"
                style={{ transform: 'rotate(-45deg)', transformOrigin: 'center' }}
            />
            <div
                className="absolute bottom-0.5 right-0.5 w-1.5 h-0.5 bg-white/60 resize-handle"
                style={{ transform: 'rotate(-45deg)', transformOrigin: 'center' }}
            />
        </motion.div>
    );
};