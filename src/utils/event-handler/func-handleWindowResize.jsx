
function handleWindowResize(initWidth,initHeight,boardAreaRef,stageSize,setStageSize) {

    const containerWidth = boardAreaRef.current.offsetWidth;
    const containerHeight = boardAreaRef.current.offsetHeight;

    
    const widthScale = containerWidth / initWidth;
    const heightScale = containerHeight / initHeight;
    
    const newStageWidth = initWidth*widthScale;
    const newStageHeight = initHeight*heightScale;


    

    setStageSize({width: newStageWidth,height: newStageHeight,scaleX: widthScale,scaleY: heightScale})

};


export default handleWindowResize