import { useState, useEffect } from 'react'
import {Layer,RegularPolygon,Line,Circle,Rect,Text} from 'react-konva'
import ValidPlacementLayers from './ValidPlacements.jsx'
import initialiseVertexGrid from '../../utils/func-initialiseVertexGrid.tsx'
import assignVertices from '../../utils/func-assignVertices.tsx'
import generateVertexIDs from '../../utils/func-generateVertexIDs.tsx'
import generatePortCoords from '../../utils/func-generatePortCoords.tsx'
import calcValidPlacements from '../../utils/func-calcValidPlacements.tsx'


function Structures({tilesMasterArray,tileRadius}) {
 
  // Initialise ports
  const ports = {
    'port-3-1A':{'reqNumIn':3,'reqTypeIn':'any','vert':['V0','V1'],'text':`?\n3 : 1`},
    'port-wh':{'reqNumIn':2,'reqTypeIn':'wh','vert':['V3','V4'],'text':`🌾\n2 : 1`},
    'port-or':{'reqNumIn':2,'reqTypeIn':'or','vert':['V14','V15'],'text':`🪨\n2 : 1`},
    'port-3-1B':{'reqNumIn':3,'reqTypeIn':'any','vert':['V26','V37'],'text':`?\n3 : 1`},
    'port-sh':{'reqNumIn':2,'reqTypeIn':'sh','vert':['V46','V45'],'text':`🐑\n2 : 1`},
    'port-3-1C':{'reqNumIn':3,'reqTypeIn':'any','vert':['V50','V51'],'text':`?\n3 : 1`},
    'port-3-1D':{'reqNumIn':3,'reqTypeIn':'any','vert':['V47','V48'],'text':`?\n3 : 1`},
    'port-br':{'reqNumIn':2,'reqTypeIn':'br','vert':['V28','V38'],'text':`🧱\n2 : 1`},
    'port-wo':{'reqNumIn':2,'reqTypeIn':'wo','vert':['V7','V17'],'text':`🪵\n2 : 1`}
  };

  // Vertex grid initialisation
  const vertexGrid = initialiseVertexGrid(tilesMasterArray,tileRadius);
  const vertexID = generateVertexIDs(vertexGrid) // Example array retrieved from backend
  const verticesMasterArray = assignVertices(vertexGrid,ports,vertexID)

  // Assign port coordinates
  generatePortCoords(ports,verticesMasterArray,tilesMasterArray);


  // Initialise structures grid object
  // const initStrucsObj = {};
  // for (const vert of verticesMasterArray) {
  //   initStrucsObj[vert.id] = {...vert}
  // };

  const [structuresGrid, setStructuresGrid] = useState(verticesMasterArray);

  // Calc valid spaces
  useEffect(() => {
    calcValidPlacements(structuresGrid);
  },[]);

  const [validPlacementsArray,setValidPlacementsArray] = useState()
  


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

      <Layer id="validPlacement" name="ValidPlacement">
        {/* {validPlacementsArray.map(vert => 
          <Text
            key={'Valid'+coord.id}
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

      <Layer id="structures" name="Structures">
        {/* {verticesMasterArray.map(coord => 
          <Text
            key={'Label'+coord.id}
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