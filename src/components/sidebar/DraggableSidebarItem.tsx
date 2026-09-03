// 負責處理 @dnd-kit/core 的拖曳邏輯，作為可重用的封裝底層

import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';


export interface DraggableSidebarItemProps {    
    id: string;
    data?: Record<string, unknown>;
    onClick?: () => void;
    children: React.ReactNode;
    }

    export const DraggableSidebarItem: React.FC<DraggableSidebarItemProps> = ({
    id,
    data,
    onClick,
    children,
    }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id,
        data,
    });

    const style: React.CSSProperties = {
        transform: CSS.Translate.toString(transform),
        cursor: isDragging ? 'grabbing' : 'pointer',
        userSelect: 'none',
        opacity: isDragging ? 0.5 : 1,
        touchAction: 'none',
    };

    return (
        <div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        onClick={onClick}
        className="draggable-item p-2 bg-dark text-center rounded border border-secondary"
        >
        {children}
        </div>
    );
};