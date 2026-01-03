import { useState, useRef, useCallback } from 'react'
import './styles/index.css'
import Game from './app/Game-Page/Game.jsx'
import LandingPage from './app/Landing-Page/LandingPage.jsx'
import OptionsPage from './app/Options-Page/OptionsPage.jsx'
import Player from './classes/Player.jsx'
import { WebsocketContext } from './context/WebsocketContext.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import useWebSocket from 'react-use-websocket';

function App() {
  
  const [playerName,setPlayerName] = useState('')

  const [turn,setTurn] = useState('p0');
  const [longestRoad,setLongestRoad] = useState('Unclaimed');
  const [largestArmy,setLargestArmy] = useState('Unclaimed');
  const missions = {longestRoad,setLongestRoad,largestArmy,setLargestArmy};

  const [players,setPlayers] = useState({});
  const [playerColor,setPlayerColor] = useState('')
  const [playerList, setPlayerList] = useState([])
  
  const [displayDice,setDisplayDice] = useState(true)

  const [tiles,setTiles] = useState([]);
  const [paths,setPaths] = useState([]);
  const [nodes,setNodes] = useState([]);

  const [socketURL,setSocketURL] = useState(null)
  const [serverMsgs, setServerMsgs] = useState(['Ready to create lobby'])
  const [lobbyInitialised,setLobbyInitialised] = useState(false)
  
  const onMessageCallback = (messageEvent) => {

    const jsObj = JSON.parse(messageEvent.data)
    console.log(jsObj)
    
    // Admin related messages
    if (jsObj.actionCategory === 'admin') {
      if (jsObj.actionType === 'message') {
        setServerMsgs(prevMsgs => [...prevMsgs,jsObj.msg])
      }
      if (jsObj.actionType === 'connected') {
        setPlayerList(jsObj.playerList)
      }
      if (jsObj.actionType === 'join') {
        setServerMsgs(prevMsgs => [...prevMsgs,jsObj.msg])
        setPlayerList(jsObj.data)
      }
      if (jsObj.actionType === 'disconnected') {
        setServerMsgs(prevMsgs => [...prevMsgs,jsObj.msg])
      }


    // Game related messages
    } else if (jsObj.actionCategory === 'game') {
        if (jsObj.actionType === 'initialised') {
          let tempTiles = []
          let tempPaths = []
          let tempNodes = []
          let tempPlayers = {}

          setTurn(jsObj.data.players[jsObj.data.current_turn].id)
          
          jsObj.data.board.tiles.forEach(tile => {
            tempTiles.push(tile["py/state"])
          });
          
          jsObj.data.board.paths.forEach(path => {
            tempPaths.push(path["py/state"])
          });
          
          jsObj.data.board.nodes.forEach(node => {
            if (node) {
              tempNodes.push(node["py/state"])
            }
          });

          jsObj.data.players.forEach(player => {
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
            );
          });

          setPaths(tempPaths)
          setNodes(tempNodes)
          setTiles(tempTiles)
          setPlayers(tempPlayers)
          
          
          setLobbyInitialised(true)

        } else if (jsObj.actionType === 'player-state') {

          const updatedPlayers = {};
          jsObj.data.forEach(player => {
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

        } else if (jsObj.actionType === 'move-robbber') {
          console.log('Robber moved')
        }
    }
  }
  
  const joinLobbyBody = {
    'actionCategory':'admin',
    'actionType':'join',
    'name':playerName,
    'color':playerColor
  }

  const {sendJsonMessage,readyState} = useWebSocket(socketURL,
    {
      onOpen: () => {
        sendJsonMessage(joinLobbyBody)
      },

      onMessage: onMessageCallback
    }
  )

  return (
    <WebsocketContext.Provider
      value={{
        sendJsonMessage,
        lobbyInitialised,
        displayDice, setDisplayDice,
        playerName,setPlayerName,
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
            lobbyInitialised={lobbyInitialised}
          />} />
          <Route path="/game" element={<Game />} />

        </Routes>
      </BrowserRouter>

    </WebsocketContext.Provider>
  );
}

export default App