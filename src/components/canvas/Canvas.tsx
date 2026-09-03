import React from 'react';
import { useDroppable, useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useCanvasStore, type CanvasItem } from '../../stores/useCanvasStore';

/* -------------------------------------------------------------------------- */
/*                 子組件：畫布內部可移動的單一物件 (CanvasItemNode)             */
/* -------------------------------------------------------------------------- */

interface CanvasItemNodeProps {
    item: CanvasItem;
}

const CanvasItemNode: React.FC<CanvasItemNodeProps> = ({ item }) => {
  // 將畫布上的物件也註冊為可拖曳（ID 必須唯一）
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: item.id,
        data: { isCanvasItem: true, item }, // 標記這是在 Canvas 內部的物件
    });

  // 計算最終位置：基礎座標 (item.position) + 正在拖曳中的位移 (transform)
    const style: React.CSSProperties = {
        position: 'absolute',
        left: `${item.position.x}px`,
        top: `${item.position.y}px`,
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.6 : 1,
        cursor: isDragging ? 'grabbing' : 'grab',
        touchAction: 'none',
        userSelect: 'none',
        zIndex: isDragging ? 10 : 1,
    };

    return (
        <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        className="canvas-item p-3 rounded shadow-sm border border-secondary text-dark fw-bold d-flex align-items-center gap-2"
        style={{
            ...style,
            backgroundColor: item.color || '#ffffff',
            minWidth: '120px',
            justifyContent: 'center',
        }}
        >
        <i className="bi bi-square"></i>
        <span>{item.text}</span>
        </div>
    );
};

/* -------------------------------------------------------------------------- */
/*                               Canvas 主組件                                */
/* -------------------------------------------------------------------------- */
export const Canvas: React.FC = () => {

    const items = useCanvasStore((state) => state.items);       // 從 Zustand Store 提取 `items` 屬性

    const itemList = Object.values(items);      // 將 Record<string,StimulusItem> 轉成陣列,便於計算數量與繪製

    const { setNodeRef, isOver } = useDroppable({   // 宣告這個區域為 @dnd-kit 的 Droppable 放置目標
        id: 'canvas-droppable-zone',                // 與 App.tsx 判斷放下的 ID 保持一致
    });

    return (
        <div
        ref={setNodeRef}
        className="canvas-container w-100 h-100 position-relative overflow-hidden"
        style={{
            backgroundColor: isOver ? '#1e293b' : '#0f172a', // 當有物件懸停上方時變色
            transition: 'background-color 0.2s ease',
            backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)',  // 網格背景圖案 
            backgroundSize: '20px 20px',
        }}
        >

        {/* 空白提示 */}
        {itemList.length === 0 && (
            <div className="position-absolute top-50 start-50 translate-middle text-secondary text-center pointer-events-none">
            <i className="bi bi-hand-index-thumb fs-1 d-block mb-2"></i>
            <div>Drag elements here or click Toolbox to add</div>
            </div>
        )}

        {/* 渲染畫布上的所有物件 */}
        {itemList.map((item) => (
            <CanvasItemNode key={item.id} item={item} />
        ))}
        </div>
    );
};