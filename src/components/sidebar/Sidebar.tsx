import React from 'react';
import { type ItemType, useCanvasStore } from '../../stores/useCanvasStore';
import { StimulusBox } from './StimulusBox';

interface SidebarProps {
    isRunning?: boolean;
    onToggleRun?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isRunning: propsIsRunning, onToggleRun }) => {
    const addItem = useCanvasStore((state) => state.addItem);
    const clearAll = useCanvasStore((state) => state.clearAll);
    const globalConfig = useCanvasStore((state) => state.globalConfig);
    const startStimulation = useCanvasStore((state) => state.startStimulation);
    const stopStimulation = useCanvasStore((state) => state.stopStimulation);

    const isRunning = propsIsRunning ?? globalConfig.isRunning;

    const handleAddStimulus = () => {
        addItem(
        {
            type: 'stimulus' as ItemType,
            text: 'Stimulus',
            color: '#ffffff',
        },
        { x: 150 + Math.random() * 50, y: 150 + Math.random() * 50 }
        );
    };

    const handleToggleRun = () => {
        if (onToggleRun) {
            onToggleRun();
        return;
        }

        if (isRunning) {
            stopStimulation();
        } else {
            startStimulation();
        }
    };

    return (
        <aside
        className="sidebar p-3 d-flex flex-column gap-3 bg-dark text-white"
        style={{ width: '260px', height: '100vh' }}
        >
        {/* 標題與語系圖案 */}
        <div className="d-flex justify-content-between align-items-center">
            <h5 className="fw-bold mb-0 text-white">Toolbox</h5>
            <button className="btn btn-sm btn-outline-secondary rounded-circle">
            <i className="bi bi-globe"></i>
            </button>
        </div>

        {/* 新增刺激方塊 / 清空按鈕 */}
        <div>
            <small className="text-secondary d-block mb-2">Drop elements here:</small>
            <div className="d-grid gap-2">
            <StimulusBox onClick={handleAddStimulus} />
            </div>
            <div className="d-flex gap-2 mt-2">
            <button className="btn btn-sm btn-outline-danger w-100" onClick={clearAll}>
                Clear
            </button>
            </div>
        </div>

        <hr className="border-secondary my-1" />

        {/* 刺激開關控制 */}
        <div>
            <h6 className="fw-bold text-white mb-2">Stimulation Control</h6>
            <button
            className={`btn ${isRunning ? 'btn-danger' : 'btn-primary'} w-100 fw-bold mb-2`}
            onClick={handleToggleRun}
            >
            <i className={`bi ${isRunning ? 'bi-stop-fill' : 'bi-play-fill'}`}></i>{' '}
            {isRunning ? 'Stop' : 'Start'}
            </button>
        </div>

        {/* 底部版本號 */}
        <div className="mt-auto pt-2 border-top border-secondary text-center small text-secondary">
            <div>Version 1</div>
        </div>
        </aside>
    );
};