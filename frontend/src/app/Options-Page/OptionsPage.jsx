import { useState, useEffect, useContext, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom';
import useFetch from '../../utils/fetch/useFetch'
import ServerMsgsWindow from './ServerMsgsWindow.jsx'
import '../../styles/Options-Page.css'
import { WebsocketContext } from '../../context/WebsocketContext.jsx'
import { useNavigate } from 'react-router-dom';

function OptionsPage({setSocketURL,serverMsgs, setServerMsgs,playerColor, setPlayerColor,playerList}) {
    
    const {
        playerName, setPlayerName,
        sendJsonMessage,
        lobbyInitialised,currentLobby
    } = useContext(WebsocketContext)
    
    const navigate = useNavigate();
    useEffect(() => {
        console.log(`nav useEffect activated: ${lobbyInitialised}`)
        
        if (lobbyInitialised) {
            navigate('/game');
        }
    }, [lobbyInitialised, navigate]);
            
    const [createLobbyName,setCreateLobbyName] = useState('')
    const [joinLobbyName,setJoinLobbyName] = useState('')

    const createLobbyURL = 'http://127.0.0.1:8000/lobbies'
    const createLobbyBody = {'name':createLobbyName}
    const [
        createLobMsg,
        createLobLoading,
        createLobError,
        createLobbyFetch
    ] = useFetch(createLobbyURL,"POST",createLobbyBody,setServerMsgs)
    
    
    const handleCreateLobby = (e) => {
        e.preventDefault()
        createLobbyFetch()
    }
    
    const handleJoinLobby = (e) => {
        e.preventDefault()
        setSocketURL(`ws://127.0.0.1:8000/ws/?lobby_name=${joinLobbyName}`)

        // Add logic to handle a lobby that's already initialised
    }
    
    const handleStart = () => {
        // if (playerList.length < 3) {
            //     setServerMsgs(prevMsgs => [...prevMsgs,'You need at least 3 players to play.'])
            //     return
            // }
            
            const initialiseBody = {
                'actionCategory':'game',
                'actionType':'initialise'
            }
            
            sendJsonMessage(initialiseBody)
            // navigate('/game');
            // console.log('nav from button')
    }

    const handleLeaveLobby = () => {
        if (currentLobby !== '[Join a Lobby]') {
            setSocketURL(null)
        }
    }

    const colorOptions = ['red','blue','yellow','white']

    return (
        <div className='game-background'>
            <div className='options-content'>
                <h1 id='game-options-title'>Game Options</h1>

                {/* SETUP OPTIONS */}
                <div className="panel-background setup-panel">
                <h2>Setup Options</h2>

                <div className="setup-row">
                    <span>Number of Players:</span>
                </div>
                <div className="setup-row">----</div>
                <div className="setup-row">----</div>
                </div>

                {/* CREATE LOBBY */}
                <div className="panel-background create-lobby-panel">
                <h3>Create Lobby</h3>
                <form className="create-lobby-form" onSubmit={handleCreateLobby}>
                    <label htmlFor="create-lobby-name">Lobby Name:</label>
                    <input type="text" id="create-lobby-name" value={createLobbyName} onChange={(e) => setCreateLobbyName(e.target.value)} maxLength='15' placeholder="Enter a lobby name" />
                    <button className="button opt-panel-button" type="submit" disabled={createLobLoading}>{createLobLoading ? 'Loading...' : 'Create Lobby'}</button>
                </form>

                </div>

                {/* JOIN LOBBY */}
                <div className="panel-background join-lobby-panel">
                <h3>Join Lobby</h3>

                    <label htmlFor="join-lobby-name">Lobby Name <span className='red-text'>*</span></label>
                    <input type="text" id="join-lobby-name" value={joinLobbyName} onChange={(e) => setJoinLobbyName(e.target.value)} maxLength='15' placeholder="Join a lobby" />

                    <label htmlFor="player-name">Player Name
                        <span className='note-text'><br/>Not required if reconnecting</span>
                    </label>
                    <input type="text" id="player-name" value={playerName} onChange={(e) => setPlayerName(e.target.value)} maxLength='15' placeholder="Enter a player name" required />

                    <label htmlFor="colors">Choose a Color
                        <span className='note-text'><br/>Not required if reconnecting</span>
                    </label>
                    <select id="colors" name="colors" value={playerColor} defaultValue="" onChange={(e) => setPlayerColor(e.target.value)} required>
                        <option value="" disabled>Select your player color</option>
                        {colorOptions.map((color) => 
                            <option value={color} disabled={playerList.some(player => player.color === color)}>
                                {color.charAt(0).toUpperCase() + color.slice(1)}
                            </option>
                        )}
                    </select>

                <button className="button opt-panel-button" type="button" onClick={handleJoinLobby}>Join Lobby</button>
                </div>

                {/* LOBBY STATUS PANEL */}
                <div className="panel-background lobby-panel">
                    <h3>Lobby: <span className='italics'>{currentLobby}</span></h3>
                    <div className="player-list">
                        {playerList.map((player,index) => 
                        <>
                            <p className="lobby-row" key={index}><span aria-hidden="true" style={{color: player.color}}>&#x25CF;</span> {player.name}</p>
                        </>
                        )}
                    </div>
                    <button className="button opt-panel-button leave-lobby-btn" type="button" onClick={handleLeaveLobby}>Leave Lobby</button>
                </div>

                {/* SERVER MESSAGE WINDOW */}
                <ServerMsgsWindow messages={serverMsgs}/>

                <Link className="button" to="/">Back</Link>
                <button className={playerList.length >= 1 ? "button" : "button link-disabled"} id='play-now' type="button" onClick={handleStart} disabled={playerList.length >= 1 ? false : true}>START GAME</button>
            </div>
        </div>
    )
}


export default OptionsPage