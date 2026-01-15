import { useState, useRef, useCallback } from 'react'
import './styles/index.css'
import Game from './app/Game-Page/Game.jsx'
import LandingPage from './app/Landing-Page/LandingPage'
import OptionsPage from './app/Options-Page/OptionsPage'
import Player from './classes/Player'
import { WebsocketContext } from './context/WebsocketContext.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import useWebSocket from 'react-use-websocket';

import {
  SocketURL,
  PlayerNameColor,
  PlayerState, PlayerStateData,
  TileData,
  NodeData, NodeDataArray,
  PathData, RawPaths,
  LegalMoveLocations
} from './ts-contracts/interfaces'

function App() {
  
  const [playerName,setPlayerName] = useState('')
  const [playerID,setPlayerID] = useState('')
  const [playerColor,setPlayerColor] = useState('')

  const [turn,setTurn] = useState('');
  const [longestRoad,setLongestRoad] = useState('Unclaimed');
  const [largestArmy,setLargestArmy] = useState('Unclaimed');
  const missions = {longestRoad,setLongestRoad,largestArmy,setLargestArmy};

  const [players,setPlayers] = useState<PlayerState>({});
  const [playerList, setPlayerList] = useState<PlayerNameColor[]>([])
  
  const [myTurn,setMyTurn] = useState(false);
  const [displayDice,setDisplayDice] = useState(false);
  const [setupPhase,setSetupPhase] = useState(true);
  const [moveRobber,setMoveRobber] = useState(false);
  const [stealCard,setStealCard] = useState(false);
  const [stealList,setStealList] = useState<string[]>([]);
  const [pickSettlement,setPickSettlement] = useState(true)
  const [pickRoad,setPickRoad] = useState(false)
  const [pickCity,setPickCity] = useState(false)

  const [tiles,setTiles] = useState<TileData[]>([]);
  const [paths,setPaths] = useState<PathData[]>([]);
  const [nodes,setNodes] = useState<NodeData[]>([]);

  const [legalNodes, setLegalNodes] = useState({})
  const [legalPaths, setLegalPaths] = useState({})

  const [socketURL,setSocketURL] = useState<SocketURL | null>(null)
  const [serverMsgs, setServerMsgs] = useState<string[]>(['Ready to create lobby'])
  const [lobbyInitialised,setLobbyInitialised] = useState(false)
  const [connected, setConnected] = useState(false)
  const [shouldReconnect,setShouldReconnect] = useState(true)
  const [currentLobby,setCurrentLobby] = useState<string>('[Join a Lobby]')
  
  const onMessageCallback = (messageEvent: MessageEvent) => {

    const jsObj = JSON.parse(messageEvent.data)
    console.log(jsObj)
    
    // Admin related messages
    if (jsObj.actionCategory === 'admin') {
      if (jsObj.actionType === 'message') {
        setServerMsgs(prevMsgs => [...prevMsgs,jsObj.msg])
      }
      if (jsObj.actionType === 'connected') {
        window.localStorage.setItem('player_id',jsObj.player_id)
        setPlayerID(jsObj.player_id)
        setPlayerList(jsObj.playerList)
        setCurrentLobby(jsObj.lobbyName)

        if (jsObj.gameInit === true) {
          const initialiseBody = {
            'actionCategory':'game',
            'actionType':'initialise'
          }
        
          sendJsonMessage(initialiseBody)
        }
      }
      if (jsObj.actionType === 'player-joined') {
        setServerMsgs(prevMsgs => [...prevMsgs,jsObj.msg])
        setPlayerList(jsObj.data)

      } else if (jsObj.actionType === 'ping') {
        // Respond to server ping to keep connection alive
        sendJsonMessage({
          'actionCategory':'admin',
          'actionType':'pong'
        })

      } else if (jsObj.actionType === 'disconnected') {
        setServerMsgs(prevMsgs => [...prevMsgs,jsObj.msg])
        setPlayerList(jsObj.data)
      }


    // Game related messages
    } else if (jsObj.actionCategory === 'game') {
        if (jsObj.actionType === 'initialised') {
          let tempTiles: TileData[] = []
          let tempPaths: PathData[] = []
          let tempNodes: NodeData[] = []
          let tempPlayers: PlayerState = {}
          let tempLegalSettle: LegalMoveLocations = {}
          let tempLegalRoad: LegalMoveLocations = {}
          
          const playerArray = jsObj.data.players
          const currTurnIndex = jsObj.data.current_turn
          const firstTurnID = playerArray[currTurnIndex]['py/state'].id
          setTurn(firstTurnID)
          
          jsObj.data.board.tiles.forEach((tile: TileData) => {
            tempTiles.push(tile["py/state"])
          });
          
          jsObj.data.board.paths.forEach((path: RawPaths) => {
            tempPaths.push(path["py/state"])
          });
          
          jsObj.data.players.forEach((player: PlayerStateData) => {
            const playerData = player['py/state']
            tempPlayers[playerData.id] = new Player(
              playerData.id,
              playerData.name,
              playerData.color,
              playerData.id === turn? true:false,
              playerData.resource_cards,
              playerData.development_cards,
              playerData.buildings,
              playerData.victory_points,
              playerData.ports,
              playerData.isBot
            )

            tempLegalSettle[playerData.id] = []
            tempLegalRoad[playerData.id] = []
          });
          
          
          jsObj.data.board.nodes.forEach((row: NodeDataArray) => {
            for (let item of row) {
              if (!item) {
                continue
              } else {
                tempNodes.push(item)
                tempLegalSettle[firstTurnID].push(item['py/state'].id)
              }
            }
          });

          setPaths(tempPaths)
          setNodes(tempNodes)
          setTiles(tempTiles)
          setPlayers(tempPlayers)
          setLegalNodes(tempLegalSettle)
          setLegalPaths(tempLegalRoad)

          setLobbyInitialised(true)

        } else if (jsObj.actionType === 'player-state') {

          const updatedPlayers: PlayerState = {};
          jsObj.data.forEach((player: PlayerStateData) => {
            const playerData = player['py/state']
            updatedPlayers[playerData.id] = new Player(
              playerData.id,
              playerData.name,
              playerData.color,
              playerData.id === turn? true:false,
              playerData.resource_cards,
              playerData.development_cards,
              playerData.buildings,
              playerData.victory_points,
              playerData.ports,
              playerData.isBot
            );
          });
          setPlayers(updatedPlayers);

        } else if (jsObj.actionType === 'tile-state') {
          const updatedTiles: TileData[] = tiles.map((tile) => {
            if (tile.id === jsObj.data["py/state"].id) {
              return jsObj.data["py/state"]
            } else {
              return {...tile}
            }
          });

          setTiles(updatedTiles);

        } else if (jsObj.actionType === 'move-robber') {
          setMoveRobber(true)
        
        } else if (jsObj.actionType === 'steal-from') {
          setStealList(jsObj.data)
          setStealCard(true)

        } else if ((jsObj.actionType === 'turn-state')) {
          const playerArray = jsObj.data.players
          const currTurnIndex = jsObj.data.current_turn
          setTurn(playerArray[currTurnIndex]['py/state'].id)

          if (playerArray[currTurnIndex]['py/state'].id === playerID) {
            setMyTurn(true)
            if (setupPhase) {
              sendJsonMessage({
                actionCategory: 'game',
                actionType: 'legal-nodes'
              })
            } else if (!setupPhase) {
              setDisplayDice(true)
            }
          } else {
            setMyTurn(false)
          }

        } else if (jsObj.actionType === 'node-state') {
          const updatedNodes: NodeData[] = nodes.map((node) => {
            if (node["py/state"].id === jsObj.data["py/state"].id) {
              return jsObj.data
            } else {
              return {...node}
            }
          });
          setNodes(updatedNodes);

        } else if (jsObj.actionType === 'path-state') {
          const updatedPaths: PathData[] = paths.map((path) => {
            if (path.id === jsObj.data["py/state"].id) {
              return jsObj.data["py/state"]
            } else {
              return {...path}
            }
          });
          setPaths(updatedPaths);

        } else if (jsObj.actionType === 'legal-nodes') {
          setLegalNodes({
            ...legalNodes,
            [playerID]:jsObj.data
          })
          setPickSettlement(true)

        } else if (jsObj.actionType === 'legal-paths') {
          setLegalPaths({...legalPaths,[turn]:jsObj.data})
          setPickRoad(true)

        } else if (jsObj.actionType === 'setup-complete') {
          setSetupPhase(false)
          // Update turn state. Begin requesting inputs for regular gameplay.
          console.log('setup phase finished')

        }
    }
  }
  
  const cachedID = window.localStorage.getItem('player_id')

  const joinLobbyBody = {
    'actionCategory':'admin',
    'actionType':'join',
    'name':playerName,
    'color':playerColor,
    'player_id':cachedID
  }

  const {sendJsonMessage, readyState} = useWebSocket(socketURL,
    {
      onOpen: () => {
        setConnected(true)
        setShouldReconnect(true)
        sendJsonMessage(joinLobbyBody)
      },

      onMessage: onMessageCallback,

      onClose: (event) => {
        setConnected(false)
        setServerMsgs(prevMsgs => [...prevMsgs,'You have been disconnected.'])
        setPlayerList([])
        setCurrentLobby('[Join a Lobby]')
        if (event.code === 1000) {
          setSocketURL(null)
          setShouldReconnect(false)
        }
      },

      shouldReconnect: (closeEvent: CloseEvent) => {
        return shouldReconnect;
      },
      reconnectAttempts: 9,
      reconnectInterval: (attemptNumber) =>
        Math.min(Math.pow(2, attemptNumber) * 1000, 10000)
    }
  )

  return (
    <WebsocketContext.Provider
      value={{
        sendJsonMessage, setShouldReconnect, setSocketURL,
        lobbyInitialised, setLobbyInitialised, currentLobby, setCurrentLobby, setPlayerList,
        playerID, playerColor, playerName,setPlayerName,
        myTurn, setMyTurn,
        displayDice,setDisplayDice,
        setupPhase, setSetupPhase,
        moveRobber, setMoveRobber,
        stealCard, setStealCard, stealList,
        pickSettlement,setPickSettlement,pickRoad,setPickRoad,pickCity,setPickCity,
        players, setPlayers,
        turn, setTurn,
        tiles, setTiles,
        paths, setPaths,
        nodes, setNodes,
        legalNodes, setLegalNodes,
        legalPaths, setLegalPaths,
        missions
      }}
    >
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<LandingPage />} />
          <Route path="/setup" element={<OptionsPage
            setSocketURL={setSocketURL}
            serverMsgs={serverMsgs}
            setServerMsgs={setServerMsgs}
            playerColor={playerColor}
            setPlayerColor={setPlayerColor}
            playerList={playerList}
          />} />
          <Route path="/game" element={<Game
            shouldReconnect={shouldReconnect}
            connected={connected}
          />} />

        </Routes>
      </BrowserRouter>

    </WebsocketContext.Provider>
  );
}

export default App