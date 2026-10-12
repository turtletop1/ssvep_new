import { create } from 'zustand';

export type ItemType = 'stimulus' | 'text' | 'iframe';
export type WaveformType = 'square' | 'sine';


export interface StimulusItem {         //Stimulus ,text ,url box屬性設定
    id: string;
    type: ItemType;
    name: string;           // Box 名稱
    text: string;
    frequency?: number;
    position: { x: number; y: number };
    size: { width: number; height: number };
    color: string;
    imageUrl?: string;
    isRunning?: boolean;
    fontSize?: number;
    fontWeight?: string;
    url?: string;
}

export interface ViewConfig {       //Canvas顯示方式，如放大、縮小，移動畫布
    scale: number;
    panX: number;
    panY: number;
}

export interface DefaultStimulusProperties {        //儲存新Stimulus時使用嘅預設資料
    text: string;
    frequency: number;
    size: { width: number; height: number };
    color: string;
}

export interface GlobalConfig {     //管理整個系統嘅全域設定
    duration: number;
    backgroundColor: string;
    isRunning: boolean;
    snapToGrid: boolean;
    gridSize: number;
    waveformType: WaveformType;
    size: { width: number; height: number };
    showTimeDisplay: boolean;
    defaultStimulus: DefaultStimulusProperties;
}

export interface StimulusState {        //儲存每個Stimulus 目前可見狀態、實際頻率, 亮度
    isVisible: boolean;
    actualFrequency: number;
    brightness: number;
}

// ==================== Store Interface ====================

interface CanvasStore {                         // 透過 Zustand 集中管理所有狀態及操作方法
    items: Record<string, StimulusItem>;
    selectedItemId: string | null;
    globalConfig: GlobalConfig;
    viewConfig: ViewConfig;
    stimulationState: Record<string, StimulusState>;

    addItem: (
        item: Partial<Omit<StimulusItem, 'id'>>,
        position: { x: number; y: number },
        options?: { id?: string }
    ) => void;

    updateItem: (id: string, updates: Partial<StimulusItem>) => void;
    moveBox: (id: string, position: { x: number; y: number }) => void;
    removeItem: (id: string) => void;
    selectItem: (id: string | null) => void;

    updateGlobalConfig: (config: Partial<GlobalConfig>) => void;
    updateViewConfig: (config: Partial<ViewConfig>) => void;
    updateStimulationState: (
        states: Record<string, StimulusState>
    ) => void;

    startStimulation: () => void;
    stopStimulation: () => void;
    clearAll: () => void;
    resetView: () => void;
}

// ==================== Default Settings ====================

const defaultViewConfig: ViewConfig = {
    scale: 1,
    panX: 0,
    panY: 0,
};

const defaultGlobalConfig: GlobalConfig = {
    duration: -1,
    backgroundColor: '#000000',
    isRunning: false,
    snapToGrid: true,
    gridSize: 20,
    waveformType: 'square',
    size: { width: 1920, height: 1080 },
    showTimeDisplay: true,

    defaultStimulus: {
        text: 'Stimulus',
        frequency: 10,
        size: { width: 120, height: 120 },
        color: '#ffffff',
    },
};

// ==================== Zustand Store =========================================================

export const useCanvasStore = create<CanvasStore>((set) => ({

    items: {},
    selectedItemId: null,
    globalConfig: defaultGlobalConfig,
    viewConfig: defaultViewConfig,
    stimulationState: {},


    // 新增方塊
    addItem: (item, position, options) =>
        
        set((state) => {
            const customId = options?.id?.trim();
            const id = customId && !state.items[customId]?  customId : `item-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
            const defaults = state.globalConfig.defaultStimulus;
            const type = item.type || 'stimulus';
            const name = item.name || 'stimulus1';

            const newItem: StimulusItem = {
                id,
                type,
                name,
                position,
                text: item.text || defaults.text,
                size: item.size || defaults.size,
                color: item.color || defaults.color,
            };

            // 根據方塊類型設定額外資料
            switch (type) {
                case 'stimulus':
                    newItem.frequency = item.frequency || defaults.frequency;
                    break;

                case 'text':
                    newItem.text = item.text || 'Text';
                    newItem.fontSize = item.fontSize || 16;
                    newItem.fontWeight = item.fontWeight || 'normal';
                    break;

                case 'iframe':
                    newItem.text = item.text || 'iframe';
                    newItem.url = item.url ||'https://github.com/turtletop1/ssvep_new';
                    break;
            }

            return {
                items: {
                    ...state.items,     
                    [id]: newItem,
                },
            };
        }),

    // 修改方塊資料
    updateItem: (id, updates) =>
        set((state) => ({
            
            items: {
                ...state.items,

                [id]: {
                    ...state.items[id],
                    ...updates,
                },
            },
        })),

    // 移動方塊
    moveBox: (id, position) =>
        set((state) => ({
            items: {
                ...state.items,
                [id]: {
                    ...state.items[id],
                    position,
                },
            },
        })),

    // 刪除方塊及相關狀態
    removeItem: (id) =>
        set((state) => {
            const items = { ...state.items };
            const stimulationState = {
                ...state.stimulationState,
            };

            delete items[id];
            delete stimulationState[id];

            return {
                items,
                stimulationState,
                selectedItemId:
                    state.selectedItemId === id
                        ? null
                        : state.selectedItemId,
            };
        }),

    // 選擇方塊
    selectItem: (id) => set({ selectedItemId: id }),


    // 修改全域設定，並保留原有的 defaultStimulus 設定
    updateGlobalConfig: (config) =>
        set((state) => ({
            globalConfig: {
                ...state.globalConfig,
                ...config,

                defaultStimulus: {
                    ...state.globalConfig.defaultStimulus,
                    ...config.defaultStimulus,
                },
            },
        })),


    // 修改畫布視圖設定
    updateViewConfig: (config) =>
        set((state) => ({
            viewConfig: {
                ...state.viewConfig,
                ...config,
            },
        })),


    // 更新刺激狀態
    updateStimulationState: (states) =>
        set((state) => ({
            stimulationState: {
                ...state.stimulationState,
                ...states,
            },
        })),


    // 開始刺激
    startStimulation: () =>
        set((state) => ({
            globalConfig: {
                ...state.globalConfig,
                isRunning: true,
            },
        })),


    // 停止刺激
    stopStimulation: () =>
        set((state) => ({
            globalConfig: {
                ...state.globalConfig,
                isRunning: false,
            },
        })),

    // 清除所有方塊
    clearAll: () =>
        set((state) => ({
            items: {},
            selectedItemId: null,
            stimulationState: {},
            globalConfig: {
                ...state.globalConfig,
                isRunning: false,
            },
        })),

    // 重設畫布視圖
    resetView: () =>
        set({
            viewConfig: { ...defaultViewConfig },
        }),
}));

// 方便在瀏覽器 Console 檢查 Store
if (typeof window !== 'undefined') {
    (window as any).useCanvasStore = useCanvasStore;
}
