import React from 'react';
import { useDroppable, useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import {
    useCanvasStore,
    type StimulusItem,
} from '../../stores/useCanvasStore';

// ==================== 單一方塊 ====================

interface CanvasItemNodeProps {
    item: StimulusItem;
}

const CanvasItemNode: React.FC<CanvasItemNodeProps> = ({ item }) => {
    const selectedItemId = useCanvasStore(
        (state) => state.selectedItemId
    );

    const selectItem = useCanvasStore(
        (state) => state.selectItem
    );

    const isRunning = useCanvasStore(
        (state) => state.globalConfig.isRunning
    );

    const brightness = useCanvasStore(
        (state) => state.stimulationState[item.id]?.brightness ?? 1
    );

    const isSelected = selectedItemId === item.id;

    // 設定方塊可以拖曳
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        isDragging,
    } = useDraggable({
        id: item.id,
        data: { isCanvasItem: true, item },
    });

    // 計算方塊透明度
    const opacity = isDragging
        ? 0.6
        : isRunning
            ? brightness
            : 1;

    // 方塊樣式
    const style: React.CSSProperties = {
        position: 'absolute',
        left: item.position.x,
        top: item.position.y,
        transform: CSS.Translate.toString(transform),
        opacity,
        transition: 'none',
        cursor: isDragging ? 'grabbing' : 'pointer',
        touchAction: 'none',
        userSelect: 'none',
        zIndex: isDragging ? 10 : isSelected ? 5 : 1,
        outline: isSelected ? '2px solid #38bdf8' : 'none',
        outlineOffset: '2px',
        boxShadow: isSelected
            ? '0 0 10px rgba(56, 189, 248, 0.5)'
            : undefined,
        backgroundColor: item.color || '#ffffff',
        minWidth: '120px',
        width : item.size.width,
        height : item.size.height,

        justifyContent: 'center',
    };

    // 點擊方塊時選取
    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        selectItem(item.id);
    };

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            onClick={handleClick}
            className="canvas-item p-3 rounded shadow-sm text-dark fw-bold d-flex align-items-center gap-2"
            style={style}
        >
            <span>{item.name}</span>
        </div>
    );
};

// ==================== 畫布 ====================

export const Canvas: React.FC = () => {
    const items = useCanvasStore((state) => state.items);
    const selectItem = useCanvasStore((state) => state.selectItem);

    // 將物件轉成陣列，方便使用 map()
    const itemList = Object.values(items);

    // 設定畫布可以接收拖曳物件
    const { setNodeRef, isOver } = useDroppable({
        id: 'canvas-droppable-zone',
    });

    return (
        <div
            ref={setNodeRef}
            onClick={() => selectItem(null)}
            className="canvas-container w-100 h-100 position-relative overflow-hidden"
            style={{
                backgroundColor: isOver ? '#1e293b' : '#0f172a',
                transition: 'background-color 0.2s ease',
                backgroundImage:
                    'radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
                backgroundSize: '20px 20px',
            }}
        >
            {/* 沒有方塊時顯示提示 */}
            {itemList.length === 0 && (
                <div className="position-absolute top-50 start-50 translate-middle text-secondary text-center pointer-events-none">
                    <i className="bi bi-hand-index-thumb fs-1 d-block mb-2"></i>
                    <div>
                        Drag elements here or click Toolbox to add ~
                    </div>
                </div>
            )}

            {/* 顯示所有方塊 */}
            {itemList.map((item) => (
                <CanvasItemNode key={item.id} item={item} />
            ))}
        </div>
    );
};
