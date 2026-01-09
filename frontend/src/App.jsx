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
  const [playerID,setPlayerID] = useState('')

  const [turn,setTurn] = useState('p0');
  const [longestRoad,setLongestRoad] = useState('Unclaimed');
  const [largestArmy,setLargestArmy] = useState('Unclaimed');
  const missions = {longestRoad,setLongestRoad,largestArmy,setLargestArmy};

  const [players,setPlayers] = useState({});
  const [playerColor,setPlayerColor] = useState('')
  const [playerList, setPlayerList] = useState([])
  
  const [displayDice,setDisplayDice] = useState(false);
  const [moveRobber,setMoveRobber] = useState(false);
  const [stealCard,setStealCard] = useState(false);
  const [stealList,setStealList] = useState([]);

  const [tiles,setTiles] = useState([]);
  const [paths,setPaths] = useState([]);
  const [nodes,setNodes] = useState([]);

  const [socketURL,setSocketURL] = useState(null)
  const [serverMsgs, setServerMsgs] = useState(['Ready to create lobby'])
  const [lobbyInitialised,setLobbyInitialised] = useState(false)
  const [currentLobby,setCurrentLobby] = useState('[Join a Lobby]')
  
  const onMessageCallback = (messageEvent) => {

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

        } else if (jsObj.actionType === 'tile-state') {
          const updatedTiles = [];
          jsObj.data.forEach(tile => {
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
        sendJsonMessage(joinLobbyBody)
      },

      onMessage: onMessageCallback,

      onClose: () => {
        setSocketURL(null)
        setServerMsgs(prevMsgs => [...prevMsgs,'You have been disconnected.'])
        setPlayerList([])
        setCurrentLobby('[Join a Lobby]')
      }
    }
  )

  return (
    <WebsocketContext.Provider
      value={{
        sendJsonMessage,
        lobbyInitialised, currentLobby,
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