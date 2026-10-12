import React from 'react';
import {DndContext,PointerSensor,useSensor,useSensors,type DragEndEvent,} from '@dnd-kit/core';

import { Sidebar } from './components/sidebar/Sidebar';
import { Canvas } from './components/canvas/Canvas';
import { StimulationEngine } from './components/StimulationEngine';
import { useCanvasStore } from './stores/useCanvasStore';


export const App: React.FC = () => {
  
  const addItem = useCanvasStore((state) => state.addItem); // 取得新增方塊和移動方塊的方法
  const moveBox = useCanvasStore((state) => state.moveBox);

  const sensors = useSensors(         // 設定拖曳功能：移動至少 8px 先開始拖曳
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {  // 拖曳結束時執行

    const { active, over, delta } = event;

    if (!over) return;  // 如果冇放到任何目標位置，就唔處理

    
    if (active.id === 'new-stimulus-item' && over.id === 'canvas-droppable-zone') {  // 情況一：由 Sidebar 新增 Stimulus 方塊
      addItem(
        {
          type: 'stimulus',
          text: 'Stimulus',
          color: '#ffffff',
        },
        {
          x: Math.max(20, 300 + delta.x),
          y: Math.max(20, 100 + delta.y),
        }
      );

      return;
    }

    if (active.data.current?.isCanvasItem) {    // 情況2：移動 Canvas 入面已有嘅方塊
      const item = active.data.current.item;

      if (!item) return;

      moveBox(item.id, {
        x: Math.max(0, item.position.x + delta.x),
        y: Math.max(0, item.position.y + delta.y),
      });
    }
  };


  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="d-flex w-100 vh-100 overflow-hidden">
        <StimulationEngine />
        <Sidebar />

        <main className="flex-grow-1 h-100 w-100">
          <Canvas />
        </main>
      </div>
    </DndContext>
  );
};

export default App;
