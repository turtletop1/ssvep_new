import React from 'react';
import { DraggableSidebarItem } from './DraggableSidebarItem';

export interface StimulusBoxProps {
        id?: string;
        onClick?: () => void;
    }

    export const StimulusBox: React.FC<StimulusBoxProps> = ({
        id = 'new-stimulus-item',
        onClick,
    }) => {
    return (
        <DraggableSidebarItem id={id} data={{ type: 'stimulus' }} onClick={onClick}>
        <i className="bi bi-square me-1"></i> Stimulus Box
        </DraggableSidebarItem>
    );
};