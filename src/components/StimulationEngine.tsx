import React, { useEffect, useRef } from 'react';
import { useCanvasStore } from '../stores/useCanvasStore';


export const StimulationEngine: React.FC = () => {

    const isRunning = useCanvasStore(                // 取得目前狀態 isRunning
        (state) => state.globalConfig.isRunning
    );

    const duration = useCanvasStore(
        (state) => state.globalConfig.duration       // 取得目前狀態duration
    );

    const startTimeRef = useRef<number | null>(null);        // 記錄刺激 開始時間


    useEffect(() => {

        if (!isRunning) return;

        startTimeRef.current = performance.now();
        let animationFrameId: number;

        const loop = (currentTime: number) => {

            const elapsedTime = currentTime - (startTimeRef.current ?? currentTime);

            if (duration > 0 && elapsedTime >= duration * 1000) {               // 超過設定時間就停止刺激
                useCanvasStore.getState().stopStimulation();
                return;
            }
            const {
                items,
                globalConfig,
                updateStimulationState,             //states: Record<string, StimulusState>
            } = useCanvasStore.getState();
                
            const nextStates: Record<string, {          // StimulusState
                isVisible: boolean;
                actualFrequency: number;
                brightness: number;
            }> = {};

            
            for (const id in items) {       // 逐個處理所有stimul

                const item = items[id];
                let brightness = 1;
                let actualFrequency = 0;

                if (item.type === 'stimulus' && item.frequency && item.frequency > 0) {                 // 計算 Stimulus 的亮度

                    actualFrequency = item.frequency;

                    if (globalConfig.waveformType === 'sine') {
                        const period = 1000 / item.frequency;                         // 計算完整週期 要幾多毫秒, 設 item.frequency=2，即每秒震2次
                        const phase = (elapsedTime % period) / period;                // 計算目前週期行到嘅%，介乎 0 至接近 1
                        brightness = (Math.sin(phase * 2 * Math.PI) + 1) / 2;         // 計算目前亮度，介乎 0 至 1

                    } else {
                        const halfPeriod = 500 / item.frequency;                    // 計算半個週期 亮+暗/頻率=半個週期
                        const phase = Math.floor(elapsedTime / halfPeriod) % 2;     // 計算過咗幾多個半週期
                        brightness = phase === 0 ? 1 : 0;                           // 決定亮定暗
                    }
                }
                nextStates[id] = {                  // 儲存每個box最新狀態
                    isVisible: brightness > 0.5,
                    actualFrequency,
                    brightness,
                };
            }
                updateStimulationState(nextStates);                 // 更新 Zustand 狀態
                animationFrameId = requestAnimationFrame(loop);     // 安排下一次畫面更新
        };

        animationFrameId = requestAnimationFrame(loop);

        return () => {
            cancelAnimationFrame(animationFrameId);     // 停止時清理動畫
        };
    }, [isRunning, duration]);

    return null;
};
