
function handleWindowResize(initWidth,initHeight,boardAreaRef,stageSize,setStageSize) {

    const containerWidth = boardAreaRef.current.offsetWidth;
    const containerHeight = boardAreaRef.current.offsetHeight;

    
    const scale = Math.min(containerWidth / initWidth,containerHeight / initHeight);
    
    const newStageWidth = initWidth*scale;
    const newStageHeight = initHeight*scale;


    

    setStageSize({width: newStageWidth,height: newStageHeight,scaleX: scale,scaleY: scale})

};


export default handleWindowResize