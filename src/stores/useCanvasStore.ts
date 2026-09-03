import { create } from 'zustand';

export type ItemType = 'stimulus' | 'text' | 'iframe';

export interface StimulusItem {
    id: string;
    type: ItemType;
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

// 🟢 1. 加入 CanvasItem 型別定義（將 CanvasItem 指向 StimulusItem）
export type CanvasItem = StimulusItem;

export interface DefaultStimulusProperties {
    text: string;
    frequency: number;
    size: { width: number; height: number };
    color: string;
}

export interface GlobalConfig {
    duration: number;               // -1 表示無限時長
    backgroundColor: string;
    isRunning: boolean;
    snapToGrid: boolean;            // 是否啟用網格吸附
    gridSize: number;               // 網格大小
    showTimeDisplay: boolean;       // 是否顯示實驗時間
    defaultStimulus: DefaultStimulusProperties;     
}

interface CanvasStore {
    items: Record<string, StimulusItem>;
    globalConfig: GlobalConfig;

    // Actions
    moveBox: (id: string, position: { x: number; y: number }) => void;
    addItem: (
        item: Partial<Omit<StimulusItem, 'id'>>,
        position: { x: number; y: number },
        options?: { id?: string }
    ) => void;
    startStimulation: () => void;
    stopStimulation: () => void;
    clearAll: () => void;
}

export const useCanvasStore = create<CanvasStore>((set) => ({
    items: {
        'box-1': {
            id: 'box-1',
            type: 'stimulus',
            text: 'Stimulus 1',
            frequency: 10,
            position: { x: 100, y: 100 },
            size: { width: 120, height: 120 },
            color: '#4F46E5',
        },
        'box-2': {
            id: 'box-2',
            type: 'stimulus',
            text: 'Stimulus 2',
            frequency: 12,
            position: { x: 300, y: 150 },
            size: { width: 120, height: 120 },
            color: '#10B981',
        },
    },
    globalConfig: {
        duration: -1,
        backgroundColor: '#000000',
        isRunning: false,
        snapToGrid: true,
        gridSize: 20,
        showTimeDisplay: true,
        defaultStimulus: {
            text: 'Stimulus',
            frequency: 10,
            size: { width: 120, height: 120 },
            color: '#ffffff',
        },
    },

    moveBox: (id, position) =>
        set((state) => ({
            items: {
                ...state.items,
                [id]: { ...state.items[id], position },
            },
        })),

    addItem: (item, position, options) => {
        set((state) => {
            const customId = options?.id?.trim();
            const id =
                customId && !state.items[customId]
                    ? customId
                    : `item-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

            const defaultProps = state.globalConfig.defaultStimulus;
            const itemType = item.type || 'stimulus';

            const baseItem: StimulusItem = {
                id,
                position,
                type: itemType,
                text: item.text || defaultProps.text,
                size: item.size || defaultProps.size,
                color: item.color || defaultProps.color,
            };

            let finalItem = { ...baseItem };

            switch (itemType) {
                case 'stimulus':
                    finalItem.frequency = item.frequency || defaultProps.frequency;
                    break;
                case 'text':
                    finalItem.text = item.text || 'Text';
                    finalItem.fontSize = item.fontSize || 16;
                    finalItem.fontWeight = item.fontWeight || 'normal';
                    break;
                case 'iframe':
                    finalItem.text = item.text || 'iframe';
                    finalItem.url = item.url || 'https://example.com';
                    break;
            }

            return {
                items: {
                    ...state.items,
                    [id]: finalItem,
                },
            };
        });
    },

    // 🟢 2. 修正 clearAll（原本的清空邏輯裡面存取了未定義的 items、selectedItemId 等欄位）
    clearAll: () =>
        set((state) => ({
            items: {},
            globalConfig: {
                ...state.globalConfig,
                isRunning: false,
            },
        })),

    startStimulation: () =>
        set((state) => ({
            globalConfig: { ...state.globalConfig, isRunning: true },
        })),

    stopStimulation: () =>
        set((state) => ({
            globalConfig: { ...state.globalConfig, isRunning: false },
        })),
}));