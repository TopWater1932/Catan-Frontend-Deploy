import { useState, useEffect } from 'react'
import { useWebSocketContext } from '../../context/WebsocketContext'
import {Layer,RegularPolygon,Line,Rect,Text} from 'react-konva'
// import ValidPlacementLayers from './ValidPlacements.tsx'
import initialiseNodeGrid from '../../utils/func-initialiseNodeGrid'
// import assignVertices from '../../utils/func-assignVertices'
// import generateVertexIDs from '../../utils/func-generateVertexIDs'
import generatePortCoords from '../../utils/func-generatePortCoords'
import calcValidPlacements from '../../utils/func-calcValidPlacements'
import Node from '../../classes/Node'
import Path from '../../classes/Path'

import {
  StructuresArgs,
  Coordinates
} from '../../ts-contracts/interfaces'

  // Port initialisation on backend data pending backend
  const ports = {
    'port-3-1A':{'reqNumIn':3,'reqTypeIn':'any','vert':['N02','N03'],'text':`?\n3 : 1`},
    'port-wh':{'reqNumIn':2,'reqTypeIn':'wh','vert':['N05','N06'],'text':`🌾\n2 : 1`},
    'port-or':{'reqNumIn':2,'reqTypeIn':'or','vert':['N18','N19'],'text':`🪨\n2 : 1`},
    'port-3-1B':{'reqNumIn':3,'reqTypeIn':'any','vert':['N210','N310'],'text':`?\n3 : 1`},
    'port-sh':{'reqNumIn':2,'reqTypeIn':'sh','vert':['N48','N49'],'text':`🐑\n2 : 1`},
    'port-3-1C':{'reqNumIn':3,'reqTypeIn':'any','vert':['N55','N56'],'text':`?\n3 : 1`},
    'port-3-1D':{'reqNumIn':3,'reqTypeIn':'any','vert':['N52','N53'],'text':`?\n3 : 1`},
    'port-br':{'reqNumIn':2,'reqTypeIn':'br','vert':['N31','N41'],'text':`🧱\n2 : 1`},
    'port-wo':{'reqNumIn':2,'reqTypeIn':'wo','vert':['N11','N21'],'text':`🪵\n2 : 1`}
  };

function Structures({tilesMasterArray,tileRadius}: StructuresArgs) {

  // Backend data
  const {
    sendJsonMessage,
    nodes,setNodes,
    paths,setPaths,
    players
  } = useWebSocketContext()
 


  // Node grid initialisation
  const nodeGrid = initialiseNodeGrid(tilesMasterArray,tileRadius);
  const nodeMasterArray: Node[] = nodes.map((nodeData,i) => {
    const node = new Node(
      nodeData['py/state'].id,
      nodeData['py/state'].occupiedBy,
      nodeData['py/state'].isBuildable,
      nodeData['py/state'].building,
      nodeData['py/state'].paths,
      nodeData['py/state'].port_type,
      nodeGrid[i].x,
      nodeGrid[i].y
    )

    return node
  })
  

  // Path grid initialisation
  const pathMasterArray: Path[] = paths.map((pathData) => {
    const pathCoordinates: Coordinates[] = []
    for (let nodeID of pathData.connectedNodes) {
      const foundNode = nodeMasterArray.find(node => node.idNode === nodeID)

      if (!foundNode) {
        throw new Error('Connected Node ID in Path Data does not exist in Node Data.')
      }

      pathCoordinates.push({x:foundNode.xCoord,y:foundNode.yCoord})
    }

    const path = new Path(
      pathData.id,
      pathData.owner,
      pathData.connectedNodes,
      pathCoordinates[0].x,
      pathCoordinates[0].y,
      pathCoordinates[1].x,
      pathCoordinates[1].y
    )
    return path
  })

  // const vertexID = generateVertexIDs(vertexGrid) // Example array retrieved from backend
  // const verticesMasterArray = assignVertices(vertexGrid,ports,vertexID)





  // Assign port coordinates
  generatePortCoords(ports,nodeMasterArray,tilesMasterArray);

  // const [structuresGrid, setStructuresGrid] = useState(nodeMasterArray);

  // // Calc valid spaces
  // useEffect(() => {
  //   calcValidPlacements(structuresGrid);
  // },[]);

  // const [validPlacementsArray,setValidPlacementsArray] = useState()
  


  return (
    <>

      <Layer id="ports" name="Ports">
        {Object.keys(ports).map(portID => 
          <Rect
            key={'Port'+portID}
            x={ports[portID].x-10}
            y={ports[portID].y-8}
            width={25}
            height={25}
            fill='rgba(255, 219, 179, 1)'
            stroke='black'
            strokeWidth={1}
            cornerRadius={3}
          />
        )}

        {Object.keys(ports).map(portID => 
          <Text
            key={'Port'+portID}
            x={ports[portID].x-6}
            y={ports[portID].y-5}
            align="center"
            verticalAlign="middle"
            text={ports[portID].text}
            fontFamily="Times New Roman"
            fontSize={10}
            fontStyle="bold"
            fill={'black'}
          />
        )}
      </Layer>
        
      <Layer id="structures" name="Structures">
        {pathMasterArray.filter(path => path.owner !== null).map(path => 
          <Line
          key={'Label'+path.idPath}
          points={[path.p1xCoord,path.p1yCoord,path.p2xCoord,path.p2yCoord]}
          stroke={players[path.owner!].color}
          strokeWidth={8}
          lineCap='round'
          />
        )}

        {nodeMasterArray.filter(node => node.occupiedBy !== null).map(node => 
          <RegularPolygon
            key={'Label'+node.idNode}
            x={node.xCoord}
            y={node.yCoord}
            sides={5}
            radius={tileRadius/5}
            fill={players[node.occupiedBy!].color}
            stroke={'black'}
            strokeWidth={1}
          />
        )}
      </Layer>

      <Layer id="validPlacement" name="ValidPlacement">
        {/* {validPlacementsArray.map(vert => 
          <Text
            key={'Nalid'+coord.id}
            x={coord.x}
            y={coord.y}
            align="center"
            verticalAlign="middle"
            text={coord.id}
            fontFamily="Times New Roman"
            fontSize={10}
            fontStyle="bold"
            fill={'black'}
          />
        )} */}
      </Layer>

    </>

  )
}

export default Structures