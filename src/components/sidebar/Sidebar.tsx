import React from 'react';
import { useCanvasStore ,  type WaveformType} from '../../stores/useCanvasStore';
import { StimulusBox } from './StimulusBox';

interface SidebarProps {
    isRunning?: boolean;
    onToggleRun?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
    isRunning: propsIsRunning,
    onToggleRun,

}) => {
    const {
        items,
        selectedItemId,
        globalConfig,
        addItem,
        updateItem,
        updateGlobalConfig,
        clearAll,
        startStimulation,
        stopStimulation,
    } = useCanvasStore((state) => state);     // 取得 Store 資料 + method

    const waveformType = useCanvasStore(
        (state) => state.globalConfig.waveformType
    );

    // 目前是否正在運行
    const isRunning = propsIsRunning ?? globalConfig.isRunning;

    // 取得目前選取的方塊
    const selectedItem = selectedItemId ? items[selectedItemId] : null;

    // 限制頻率喺 1 至 60 Hz
    const sanitizeFrequency = (value: number) => Number.isNaN(value) ? 1 : Math.max(1, Math.min(60, value));

    // 更新預設頻率
    const DefaultFrequencyChange = (f: number) => {
        updateGlobalConfig({
            defaultStimulus: {
                ...globalConfig.defaultStimulus,
                frequency: sanitizeFrequency(f),
            },
        });
    };

    // 更新已選取方塊頻率
    const SelectedFrequencyChange = (f: number ) => {
        if (!selectedItemId) return;
        updateItem(selectedItemId, {
            frequency: sanitizeFrequency(f),
        });
    };

    const SelectedNameChange = (n: string ) => {
        if (!selectedItemId) return;
        updateItem(selectedItemId, {
            name: n,
        });
    };

    const ColorChange = (c: string ) => {
        if (!selectedItemId) return;
        updateItem(selectedItemId, {
            color: c,
        });
    };

    const SizeChange = (s: {width: number; height: number } ) => {
        if (!selectedItemId) return;
        updateItem(selectedItemId, {
            size: s,
        });
    };



    // 新增 Stimulus 方塊
    const handleAddStimulus = () => {
        addItem(
            {
                type: 'stimulus',
                text: 'Stimulus',
                color: '#ffffff',
            },
            {
                x: 150 + Math.random() * 50,
                y: 150 + Math.random() * 50,
            }
        );
    };

    // 開始或停止刺激
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



    // 共用stim控制介面
    const renderControl = (
        f: number,
        n:string,
        s:{ width: number; height: number },
        c:string,
        onFrequencyChange: (value: number) => void,
        onNameChange: (value: string) => void,
        onSizeChange: (value: { width: number; height: number }) => void,
        onColorChange: (value: string) => void,
    ) => (

        <div>
          <div className="d-flex align-items-center gap-2">
            <input
                type="range"
                className="form-range"
                min="1"
                max="60"
                step="0.5"
                value={f}
                onChange={(e) => onFrequencyChange(Number(e.target.value))}
            />
            <input
                type="number"
                className="form-control form-control-sm bg-dark text-white border-secondary text-center"
                style={{ width: '65px' }}
                min="1"
                max="60"
                step="0.5"
                value={f}
                onChange={(e) => onFrequencyChange(Number(e.target.value))}
            />
          </div>
          <div className="d-flex align-items-center gap-2 p-2">
            <label className="form-label small text-secondary mb-1">Name:</label>
            <input
                type="text"
                value={n}
                onChange={(e) => onNameChange(e.target.value)}
                className="form-control form-control-sm w-100"
            />
          </div>
          <div className="d-flex align-items-center gap-2 p-2">
              <label className="form-label small text-secondary mb-1">
                  Height:
              </label>

              <input
                  type="number"
                  value={s.height}
                  onChange={(e) =>
                      onSizeChange({
                          ...s,
                          height: Number(e.target.value),
                      })
                  }
                  className="form-control form-control-sm w-100"
              />
          </div>

          <div className="d-flex align-items-center gap-2 p-2">
              <label className="form-label small text-secondary mb-1">
                  Width:
              </label>

              <input
                  type="number"
                  value={s.width}
                  onChange={(e) =>
                      onSizeChange({
                          ...s,
                          width: Number(e.target.value),
                      })
                  }
                  className="form-control form-control-sm w-100"
              />
          </div>

          <div className="d-flex align-items-center gap-2 p-2">
              <label className="form-label small text-secondary mb-1">
                  Color:
              </label>
            <input
              type="color"
              value={c}
              onChange={(e) => onColorChange(e.target.value)}
              className="form-control form-control-sm w-100"
            />
          </div>

        </div>
    );


// fre控制介面
    const renderFControl = (
        f: number,
        onFrequencyChange: (value: number) => void,
    ) => (
        
          <div className="d-flex align-items-center gap-2">
            <input
                type="range"
                className="form-range"
                min="1"
                max="60"
                step="0.5"
                value={f}
                onChange={(e) => onFrequencyChange(Number(e.target.value))}
            />
            <input
                type="number"
                className="form-control form-control-sm bg-dark text-white border-secondary text-center"
                style={{ width: '65px' }}
                min="1"
                max="60"
                step="0.5"
                value={f}
                onChange={(e) => onFrequencyChange(Number(e.target.value))}
            />
          </div>
    );
    


    // 顯示stim設定
    const renderSettings = () => {

        if (selectedItem) {
              const f = selectedItem.frequency ?? 10;
              const n = selectedItem.name ?? "";
              const s = selectedItem.size ?? {width: 10,height: 10};
              const c = selectedItem.color ?? "";

              return (
                  <div className="p-3 rounded bg-secondary bg-opacity-25 border border-info border-opacity-50">
                      <div className="text-info fw-bold mb-2 small">
                          Selected ID:
                          <span className="text-white bg-dark px-2 py-1 rounded fs-6 ms-2">
                              {selectedItem.id}
                          </span>
                      </div>

                      <label className="form-label small text-secondary mb-1">
                          Name:
                          <span className="text-white fw-bold ms-1">
                              {n} 
                          </span>
                      </label>
                      
                      <label className="form-label small text-secondary mb-1">
                          Frequency:
                          <span className="text-white fw-bold ms-1">
                              {f} Hz
                          </span>
                      </label>

                      {renderControl(f,n,s,c,SelectedFrequencyChange,SelectedNameChange,SizeChange,ColorChange)}
                  </div>
              );
        }

        const f = globalConfig.defaultStimulus.frequency;
        return (
            <div className="p-3 rounded bg-secondary bg-opacity-10 border border-secondary">
                <div className="text-secondary fw-bold mb-2 small">
                    Default Stimulus Config
                </div>

                <label className="form-label small text-secondary mb-1">
                    Default Frequency:
                    <span className="text-white fw-bold ms-1">
                        {f} Hz
                    </span>
                </label>

                {renderFControl(f,DefaultFrequencyChange)}
            </div>
        );
    };



    return (
        <aside
            className="sidebar p-3 d-flex flex-column gap-3 bg-dark text-white overflow-auto"
            style={{ width: '280px', height: '100vh' }}
        >
            {/* 標題 */}
            <div className="d-flex justify-content-between align-items-center">
                <h5 className="fw-bold mb-0 text-white">Toolbox</h5>

                <button
                    className="btn btn-sm btn-outline-secondary rounded-circle"
                    title="Language / Settings"
                    type="button"
                >
                    <i className="bi bi-globe"></i>
                </button>
            </div>

            {/* 新增及清空方塊 */}
            <div>
                <small className="text-secondary d-block mb-2">
                    Drag elements here:
                </small>

                <div className="d-grid gap-2">
                    <StimulusBox onClick={handleAddStimulus} />
                </div>

                <div className="d-flex gap-2 mt-2">
                    <button
                        className="btn btn-sm btn-outline-danger w-100"
                        onClick={clearAll}
                        disabled={isRunning}
                        type="button"
                    >
                        Clear Canvas
                    </button>
                </div>
            </div>

            <hr className="border-secondary my-1" />

            {/* 頻率設定 */}
            <fieldset disabled={isRunning}>
                {renderSettings()}
            </fieldset>

            <hr className="border-secondary my-1" />

            <label>Waveform</label>

            <select
                value={waveformType}
                onChange={(e) =>
                    updateGlobalConfig({
                        waveformType: e.target.value as WaveformType
                    })
                }
            >
                <option value="square">Square Wave 方波</option>
                <option value="sine">Sine Wave 正弦波</option>
            </select>


            
            <hr className="border-secondary my-1" />

            {/* 刺激控制 */}
            <div>
                <h6 className="fw-bold text-white mb-2">
                    Stimulation Control
                </h6>

                <button
                    className={`btn ${isRunning ? 'btn-danger' : 'btn-primary'} w-100 fw-bold mb-2`}
                    onClick={handleToggleRun}
                    type="button"
                >
                    <i
                        className={`bi ${isRunning ? 'bi-stop-fill' : 'bi-play-fill'}`}
                    ></i>{' '}
                    {isRunning? 'Stop Stimulation': 'Start Stimulation'}
                </button>
            </div>
        </aside>
    );
};
