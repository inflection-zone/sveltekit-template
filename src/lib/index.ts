// Reexport your entry components here
export { draggable } from './utils/drag-and-drop';
export { dropzone } from './utils/drag-and-drop';

export interface Card {
    id: number;
    content: string;
}

export enum ViewType {
    LIST = 'list',
    GRID = 'grid'
}

// Types
export type Button = {
    id: number;
    name: string;
    icon: string;
};

export type DroppedItem = Button & {
    dropTime: string;
    uniqueId: string;
};

