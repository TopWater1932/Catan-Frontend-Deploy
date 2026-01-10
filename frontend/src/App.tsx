import { useState, useRef, useCallback } from 'react'
import './styles/index.css'
import Game from './app/Game-Page/Game.jsx'
import LandingPage from './app/Landing-Page/LandingPage.js'
import OptionsPage from './app/Options-Page/OptionsPage.js'
import Player from './classes/Player.jsx'
import { WebsocketContext } from './context/WebsocketContext.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import useWebSocket from 'react-use-websocket';

import {
  SocketURL,
  PlayerNameColor,
  PlayerState, PlayerStateData,
  Tile,
  Node,
  Path
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
  
  const [displayDice,setDisplayDice] = useState(false);
  const [moveRobber,setMoveRobber] = useState(false);
  const [stealCard,setStealCard] = useState(false);
  const [stealList,setStealList] = useState<string[]>([]);

  const [tiles,setTiles] = useState<Tile[]>([]);
  const [paths,setPaths] = useState<Path[]>([]);
  const [nodes,setNodes] = useState<Node[]>([]);

  const [socketURL,setSocketURL] = useState<SocketURL>(null)
  const [serverMsgs, setServerMsgs] = useState<string[]>(['Ready to create lobby'])
  const [lobbyInitialised,setLobbyInitialised] = useState(false)
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
          let tempTiles: Tile[] = []
          let tempPaths: Path[] = []
          let tempNodes: Node[] = []
          let tempPlayers: PlayerState = {}

          setTurn(jsObj.data.players[jsObj.data.current_turn].id)
          
          jsObj.data.board.tiles.forEach((tile: Tile) => {
            tempTiles.push(tile["py/state"])
          });
          
          jsObj.data.board.paths.forEach((path: Path) => {
            tempPaths.push(path["py/state"])
          });
          
          jsObj.data.board.nodes.forEach((node: Node) => {
            if (node) {
              tempNodes.push(node["py/state"])
            }
          });


          jsObj.data.players.forEach((player: PlayerStateData) => {
            tempPlayers[player.id] = new Player(
              player.id,
              player.name,
              player.color,
              player.id === turn? true:false,
              player.resource_cards,
              player.development_cards,
              player.buildings,
              player.victory_points,
              player.ports
            )
          });

          //   if (player.id === playerID) { 
          //     setPlayerID(player.id)
          //     debugger;
          //   }
          // });

          setPaths(tempPaths)
          setNodes(tempNodes)
          setTiles(tempTiles)
          setPlayers(tempPlayers)

          setLobbyInitialised(true)
          console.log(`Lobby initialised: ${lobbyInitialised}`)

        } else if (jsObj.actionType === 'player-state') {

          const updatedPlayers: PlayerState = {};
          jsObj.data.forEach((player: PlayerStateData) => {
            updatedPlayers[player.id] = new Player(
              player.id,
              player.name,
              player.color,
              player.id === turn? true:false,
              player.resource_cards,
              player.development_cards,
              player.buildings,
              player.victory_points,
              player.ports
            );
          });
          setPlayers(updatedPlayers);

        } else if (jsObj.actionType === 'tile-state') {
          const updatedTiles: Tile[] = [];
          jsObj.data.forEach((tile: Tile) => {
            updatedTiles.push(tile["py/state"])
          });

          setTiles(updatedTiles);

        } else if (jsObj.actionType === 'move-robber') {
          setMoveRobber(true)
        
        } else if (jsObj.actionType === 'steal-from') {
          setStealList(jsObj.data)
          setStealCard(true)
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
        setShouldReconnect(true)
        sendJsonMessage(joinLobbyBody)
      },

      onMessage: onMessageCallback,

      onClose: () => {
        setServerMsgs(prevMsgs => [...prevMsgs,'You have been disconnected.'])
        setPlayerList([])
        setCurrentLobby('[Join a Lobby]')
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
        sendJsonMessage,
        setLobbyInitialised, lobbyInitialised, currentLobby, setPlayerList, setCurrentLobby, setShouldReconnect,setSocketURL,
        displayDice, setDisplayDice,
        playerID, playerName,setPlayerName,
        moveRobber, setMoveRobber,
        stealCard, setStealCard, stealList,
        players, setPlayers,
        missions,
        turn, setTurn,
        tiles, setTiles,
        paths, setPaths,
        nodes, setNodes
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
          <Route path="/game" element={<Game />} />

        </Routes>
      </BrowserRouter>

    </WebsocketContext.Provider>
  );
}

export default App