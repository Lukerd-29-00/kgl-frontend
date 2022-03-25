import React, { ChangeEvent, Ref } from "react";

declare module "react-drag-range"{
    export interface DragRangeProps{
        yAxis?: boolean,
        percent?: boolean,
        unit?: number,
        rate?: number,
        value?: number,
        onChange?: (value: number) => void,
        onDelta?: () => void,
        min?: number,
        max?: number,
        default?: number,
        decimals?: number,
        onDragStart?: () => void,
        onDragEnd?: () => void,
        onMouseUp?: () => void,
        onMouseDown?: () => void,
        onDoubleClick?: () => void,
        doubleClickTimeout?: number,
        disablePercentClamp?: boolean,
        disabelReset?: boolean,
        getTarget?: () => Ref
    }
    declare class DragRange extends React.Component<DragRangeProps>{
        constructor(props: DragRangeProps)
    }
    export default DragRange
}
