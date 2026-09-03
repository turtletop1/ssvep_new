import React from 'react';
import { DndContext, type DragEndEvent } from '@dnd-kit/core';
import { Sidebar } from './components/sidebar/Sidebar';
import { Canvas } from './components/canvas/Canvas';
import { useCanvasStore } from './stores/useCanvasStore';

export const App: React.FC = () => {

  const addItem = useCanvasStore((state) => state.addItem);   // 從 Zustand Store 提取所需 Actions
  const moveBox = useCanvasStore((state) => state.moveBox);


  const handleDragEnd = (event: DragEndEvent) => {   // 處理拖曳放開後的邏輯
    const { active, over, delta } = event;

    if (!over) return;    // 如果沒有拖放到任何可放置目標 (Droppable Zone) 上，則不做處理

    if (active.id === 'new-stimulus-item' && over.id === 'canvas-droppable-zone') { //情況1 從Sidebar拖進Canvas新增方塊
      const dropPosition = {                          // 根據拖曳位移量 (delta) 計算初始放置座標
        x: Math.max(20, 300 + delta.x),
        y: Math.max(20, 100 + delta.y),
      };

      addItem(                  // 呼叫 Store 新增方塊
        {
          type: 'stimulus',
          text: 'Stimulus',
          color: '#ffffff',
        },
        dropPosition
      );
      return;
    }

    const isCanvasItem = active.data.current?.isCanvasItem;   //情況2 在 Canvas 內部移動既有方塊的位置
    if (isCanvasItem) {
      const item = active.data.current?.item;
      if (item) {
        const newX = Math.max(0, item.position.x + delta.x);  // 計算放開後的新座標 = 原本座標 + 移動距離 (delta)
        const newY = Math.max(0, item.position.y + delta.y);

        moveBox(item.id, { x: newX, y: newY });   // 呼叫 moveBox 更新 Store 內的座標
      }
    }
  };

  return (
                        // 使用 DndContext 包裹整個應用程式，並傳入 handleDragEnd 處理函式
    <DndContext onDragEnd={handleDragEnd}>
      <div className="d-flex w-100 vh-100 overflow-hidden">
        <Sidebar />
        <main className="flex-grow-1 h-100">
          <Canvas />
        </main>
      </div>
    </DndContext>
  );
};

export default App;