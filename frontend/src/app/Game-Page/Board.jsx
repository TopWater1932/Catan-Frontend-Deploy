import { useState , useLayoutEffect, useRef, useContext, useEffect } from 'react'
import Structures from './Structures.jsx'
import '../../styles/board.css'
import {Stage,Layer,RegularPolygon,Circle,Wedge,Text, Shape} from 'react-konva'
import handleWindowResize from '../../utils/event-handler/func-handleWindowResize.tsx'
import initialiseTileGrid from '../../utils/func-initialiseTileGrid.tsx'
import { useWebSocketContext } from '../../context/WebsocketContext'
import Tile from '../../classes/Tile.tsx'


function Board() {

  // Board canvas initialisation
  const initWidth = 1090;
  const initHeight = 670;
  const radius = (initHeight/2)+40;
  const [stageSize,setStageSize] = useState({width: initWidth,height: initHeight,scaleX: 1,scaleY: 1});
  const boardAreaRef = useRef(null);

  const {
    sendJsonMessage,
    tiles, setTiles,
    paths, setPaths,
    nodes, setNodes,
    moveRobber, setMoveRobber
  } = useWebSocketContext()
  
  useLayoutEffect(() => {
    const handleFunc = () => handleWindowResize(initWidth,initHeight,boardAreaRef,stageSize,setStageSize)

    handleFunc();
    window.addEventListener("resize",handleFunc)

    return () => window.removeEventListener("resize",handleFunc)
  },[])


  const resourceColors = {
    'ORE':'rgba(78, 78, 78, 1)',
    'LUMBER':'rgba(97, 36, 0, 1)',
    'WOOL':'rgba(34, 202, 0, 1)',
    'BRICK':'rgba(206, 99, 0, 1)',
    'GRAIN':'rgba(255, 230, 0, 1)',
    null: 'rgba(218, 188, 89, 1)'
  };
  
  
  // Tiles initialisation
  const boardHexSize = 3;
  const tileRadius = 69;
  const tileGridX = 306;
  const tileGridY = 127;
  const tileGrid = initialiseTileGrid(tileGridX,tileGridY,tileRadius,boardHexSize);
  const [robberTile,setRobberTile] = useState('T9'); // Initial robber tile ID


  const tilesMasterArray = tileGrid.map((coord,i) => {
    const tile = new Tile(
      tiles[i].id,
      tiles[i].resource,
      tiles[i].number_token,
      tiles[i].has_robber,
      coord.x,
      coord.y
    )

    return tile
  });

  // Set robber tile
  useEffect(() => {
    const robberTileObj = tiles.find(tile => tile.has_robber);
    if (robberTileObj) {
      setRobberTile(robberTileObj.id);
    }
  },[tiles]);

  const handlePlaceRobber = (selectedTile) => {
    sendJsonMessage({
      'actionCategory': 'game',
      'actionType': 'move-robber',
      'data': selectedTile
    });
    
    setMoveRobber(false);
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
          {tilesMasterArray.map(tile => 
            <RegularPolygon
              key={'Tile'+tile.id}
              x={tile.x}
              y={tile.y}
              sides={6}
              radius={tileRadius}
              fill={resourceColors[tile.resource]}
              stroke='rgb(255, 239, 147)'
              strokeWidth={5}
            />
          )}

          {tilesMasterArray.filter(tile => tile.resource!==null).map(tile => 
            <Circle
              key={'Circle'+tile.id}
              x={tile.x}
              y={tile.y}
              radius={18}
              fill={'rgb(255, 239, 147)'}
              stroke='black'
              strokeWidth={1}
            />
          )}

          {tilesMasterArray.filter(tile => tile.resource!=='de').map(tile => 
            <Text
              key={'Number'+tile.id}
              x={tile.x-18}
              y={tile.y-12}
              width={18*2}
              align="center"
              verticalAlign="middle"
              text={tile.number}
              fontFamily="Times New Roman"
              fontSize={25}
              fontStyle="bold"
              fill={(tile.number===6 || tile.number===8)? 'rgba(221, 71, 33, 1)': 'black'}
            />
          )}

          <Wedge
            key='robber'
            x={tilesMasterArray.find(tile => tile.id === robberTile).x}
            y={tilesMasterArray.find(tile => tile.id === robberTile).y}
            radius={40}
            angle={60}
            fill="grey"
            stroke="black"
            strokeWidth={1}
            rotation={60}
          />

          {moveRobber &&
            tilesMasterArray.filter(tile => tile.id !== robberTile).map(tile => 
            <Circle
              key={'LegalRobPlacement'+tile.id}
              x={tile.x}
              y={tile.y}
              radius={18}
              stroke='red'
              strokeWidth={4}
              onClick={() => handlePlaceRobber(tile.id)}
              onMouseEnter={(e: KonvaMouseEvent) => {
                e.target.getStage().container().style.cursor = 'pointer';
              }}
              onMouseLeave={(e: KonvaMouseEvent) => {
                e.target.getStage().container().style.cursor = 'default';
              }}
            />
          )}

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