import React from 'react';
import {
    StageSize,
    SetterFunction
} from '../../ts-contracts/interfaces';

// Define the type for the boardAreaRef, which is a React ref to a DOM element.
type BoardAreaRef = React.RefObject<HTMLDivElement>;

function handleWindowResize(
    initWidth: number,
    initHeight: number,
    boardAreaRef: BoardAreaRef,
    stageSize: StageSize, // Not used inside the function, but kept for type signature completeness if it were used.
    setStageSize: SetterFunction<StageSize>
): void {

    if (!boardAreaRef.current) {
        return; // Exit if the ref hasn't been attached yet
    }

    const containerWidth: number = boardAreaRef.current.offsetWidth;
    const containerHeight: number = boardAreaRef.current.offsetHeight;

    const scale: number = Math.min(containerWidth / initWidth, containerHeight / initHeight);

    const newStageWidth: number = initWidth * scale;
    const newStageHeight: number = initHeight * scale;

    setStageSize({ width: newStageWidth, height: newStageHeight, scaleX: scale, scaleY: scale });
}

export default handleWindowResize;