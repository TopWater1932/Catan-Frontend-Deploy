import { useState , useLayoutEffect, useRef} from 'react'
import Structures from './structures.jsx'
import './styles/board.css'
import {Stage,Layer,RegularPolygon,Circle,Wedge,Text, Shape} from 'react-konva'
import handleWindowResize from './utils/event-handler/func-handleWindowResize.jsx'
import initialiseTileGrid from './utils/func-initialiseTileGrid.jsx'


function Board() {

  // Board canvas initialisation
  const initWidth = 1090;
  const initHeight = 670;
  const radius = (initHeight/2)+40;
  const [stageSize,setStageSize] = useState({width: initWidth,height: initHeight,scaleX: 1,scaleY: 1});
  const boardAreaRef = useRef(null);
  
  useLayoutEffect(() => {
    const handleFunc = () => handleWindowResize(initWidth,initHeight,boardAreaRef,stageSize,setStageSize)

    handleFunc();
    window.addEventListener("resize",handleFunc)

    return () => window.removeEventListener("resize",handleFunc)
  },[])


  // Tiles initialisation
  const boardHexSize = 3;
  const tileRadius = 69;
  const tileGridX = 306;
  const tileGridY = 127;
  const tileGrid = initialiseTileGrid(tileGridX,tileGridY,tileRadius,boardHexSize);
  const [robberTile,setRobberTile] = useState('J')

  const resourceColors = {
    'or':'rgba(78, 78, 78, 1)',
    'wo':'rgba(97, 36, 0, 1)',
    'sh':'rgba(34, 202, 0, 1)',
    'br':'rgba(206, 99, 0, 1)',
    'wh':'rgba(255, 230, 0, 1)',
    'de': 'rgba(218, 188, 89, 1)'
  };

  const tileID = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S']; // Example array retrieved from backend
  const tileNumberArray = [10,2,9,12,6,4,10,9,11,0,3,8,8,3,4,5,5,6,11]; // Example array retrieved from backend
  const tileResourceArray = ['or','sh','wo','wh','br','sh','br','wh','wo','de','wo','or','wo','or','wh','sh','br','wh','sh']; // Example array retrieved from backend
  
  const tilesMasterArray = tileGrid.map((coord,i) => ({
    id: tileID[i],
    ...coord,
    resource: tileResourceArray[i],
    number: tileNumberArray[i]
  }));
  
  // Create object to hold tile info
  const tilesMasterObj = {};
  for (const tile of tilesMasterArray) {
    tilesMasterObj[tile.id] = {...tile}
  };
  

  return (
    <div id="board-area" ref={boardAreaRef}>

      <Stage width={stageSize.width} height={stageSize.height} scaleX={stageSize.scaleX} scaleY={stageSize.scaleY}>

        <Layer id="base" name="Base">
          <RegularPolygon
            key="base"
            x={initWidth/2}
            y={initHeight/2}
            sides={6}
            radius={radius}
            rotation={90}
            fillRadialGradientEndRadius={radius}
            fillRadialGradientColorStops={[0.7,'rgba(176, 210, 255, 1)',1,'rgba(70, 150, 255, 1)']}
            stroke='black'
            strokeWidth={1}
          />
        </Layer>

        <Layer id="tiles" name="Tiles">
          {tilesMasterArray.map(coord => 
            <RegularPolygon
              key={'Tile'+coord.id}
              x={coord.x}
              y={coord.y}
              sides={6}
              radius={tileRadius}
              fill={resourceColors[coord.resource]}
              stroke='rgb(255, 239, 147)'
              strokeWidth={5}
            />
          )}

          {tilesMasterArray.filter(tile => tile.resource!=='de').map(coord => 
            <Circle
              key={'Circle'+coord.id}
              x={coord.x}
              y={coord.y}
              radius={18}
              fill={'rgb(255, 239, 147)'}
              stroke='black'
              strokeWidth={1}
            />
          )}

          {tilesMasterArray.filter(tile => tile.resource!=='de').map(coord => 
            <Text
              key={'Number'+coord.id}
              x={coord.x-18}
              y={coord.y-12}
              width={18*2}
              align="center"
              verticalAlign="middle"
              text={coord.number}
              fontFamily="Times New Roman"
              fontSize={25}
              fontStyle="bold"
              fill={(coord.number===6 || coord.number===8)? 'rgba(221, 71, 33, 1)': 'black'}
            />
          )}

          <Wedge
            key='robber'
            x={tilesMasterObj[robberTile].x}
            y={tilesMasterObj[robberTile].y}
            radius={40}
            angle={60}
            fill="grey"
            stroke="black"
            strokeWidth={1}
            rotation={60}
          />

        </Layer>

        <Structures
          tilesMasterArray={tilesMasterArray}
          tileRadius={tileRadius}
        />



      </Stage>
    </div>
  )
}

export default Board