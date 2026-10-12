//具體的刺激物方塊組件。它繼承並包裝了 DraggableSidebarItem，標示拖曳資料類型為 'stimulus'

import React from 'react';
import { DraggableSidebarItem } from './DraggableSidebarItem';


export interface StimulusBoxProps {
        id?: string;
        onClick?: () => void;
        style?: React.CSSProperties; 
    }

    export const StimulusBox: React.FC<StimulusBoxProps> = ({
        id = 'new-stimulus-item',
        onClick
    }) => {
    return (
        <DraggableSidebarItem id={id} data={{ type: 'stimulus' }} onClick={onClick}>
        <i className="bi bi-square me-1"></i> Stimulus Box
        </DraggableSidebarItem>
    );
};