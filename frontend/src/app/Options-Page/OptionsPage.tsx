import { useState, useEffect, useContext, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom';
import useFetch from '../../utils/fetch/useFetch'
import ServerMsgsWindow from './ServerMsgsWindow'
import '../../styles/Options-Page.css'
import { useWebSocketContext } from '../../context/WebsocketContext'
import { useNavigate } from 'react-router-dom';

import {
    OptionsPageProps,
    ReactMouseEvent,
    ReactChangeEvent
} from '../../ts-contracts/interfaces'

const domain = 'catan-backend-deploy.onrender.com'
// const domain = '127.0.0.1:8000'

function OptionsPage({setSocketURL,serverMsgs, setServerMsgs,playerColor, setPlayerColor,playerList}: OptionsPageProps) {
    
    const {
        playerName, setPlayerName,
        sendJsonMessage,
        lobbyInitialised,currentLobby, setShouldReconnect,
    } = useWebSocketContext()

    const [canAddBot,setCanAddBot] = useState(false)
    const [canRemBot,setCanRemBot] = useState(false)
    
    const navigate = useNavigate();
    useEffect(() => {
        
        if (lobbyInitialised) {
            navigate('/game');
        }
    }, [lobbyInitialised, navigate]);

    useEffect(() => {
        const numberOfHumans = playerList.filter(player => player.isBot === false).length
        const numberOfBots = playerList.length - numberOfHumans

        if (playerList.length < 4 && numberOfHumans >=1) {
            setCanAddBot(true)
        } else {
            setCanAddBot(false)
        }

        if (numberOfBots > 0) {
            setCanRemBot(true)
        } else {
            setCanRemBot(false)
        }



    },[playerList])
            
    const [createLobbyName,setCreateLobbyName] = useState('')
    const [joinLobbyName,setJoinLobbyName] = useState('')

    const createLobbyURL = `https://${domain}/lobbies`
    const createLobbyBody = {'name':createLobbyName}
    const [createLobMsg,createLobLoading,createLobError,createLobbyFetch] = 
        useFetch({url:createLobbyURL,
        method:"POST",
        info:createLobbyBody,
        setServerMsgs:setServerMsgs})
    
    
    const handleCreateLobby = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        createLobbyFetch()
    }
    
    const handleJoinLobby = (e: ReactMouseEvent) => {
        e.preventDefault()
        setSocketURL(`wss://${domain}/ws/?lobby_name=${joinLobbyName}`)
    }
    
    const handleStart = () => {
        if (playerList.length < 3) {
                setServerMsgs(prevMsgs => [...prevMsgs,'You need at least 3 players to play.'])
                return
            }

            const initialiseBody = {
                'actionCategory':'game',
                'actionType':'initialise'
            }
            sendJsonMessage(initialiseBody)
    }

    const handleLeaveLobby = () => {
        if (currentLobby !== '[Join a Lobby]') {
            setShouldReconnect(false)
            setSocketURL(null)
        }
    }

    const handleAddBot = () => {
        if (canAddBot) {
            const addBotBody = {
                'actionCategory':'admin',
                'actionType':'add-bot'
            }
            sendJsonMessage(addBotBody)
        }
    }

    const handleRemoveBot = () => {
        if (canRemBot) {
            const addRemoveBody = {
                'actionCategory':'admin',
                'actionType':'remove-bot'
            }
            sendJsonMessage(addRemoveBody)
        }
    }

    const colorOptions = ['red','blue','orange','white']

    return (
        <div className='game-background'>
            <div className='options-content'>
                <h1 id='game-options-title'>Game Options</h1>

                {/* SETUP OPTIONS */}
                <div className="panel-background setup-panel">
                <h2>Bot Options (In Progress)</h2>
                <div className="setup-row">
                    <label htmlFor="add-bot">Add Bot: </label>
                    <button className="button" type="button" onClick={handleAddBot} disabled={!canAddBot}>{'Add'}</button>
                </div>
                <div className="setup-row">
                    <label htmlFor="add-bot">Remove Bot: </label>
                    <button className="button" type="button" onClick={handleRemoveBot} disabled={!canRemBot}>{'Remove'}</button>
                </div>
                </div>

                {/* CREATE LOBBY */}
                <div className="panel-background create-lobby-panel">
                <h3>Create Lobby</h3>
                <form className="create-lobby-form" onSubmit={handleCreateLobby}>
                    <label htmlFor="create-lobby-name">Lobby Name:</label>
                    <input type="text" id="create-lobby-name" value={createLobbyName} onChange={(event: ReactChangeEvent<HTMLInputElement>) => setCreateLobbyName(event.currentTarget.value)} maxLength={15} placeholder="Enter a lobby name" />
                    <button className="button opt-panel-button" type="submit" disabled={createLobLoading}>{createLobLoading ? 'Loading...' : 'Create Lobby'}</button>
                </form>

                </div>

                {/* JOIN LOBBY */}
                <div className="panel-background join-lobby-panel">
                <h3>Join Lobby</h3>

                    <label htmlFor="join-lobby-name">Lobby Name <span className='red-text'>*</span></label>
                    <input type="text" id="join-lobby-name" value={joinLobbyName} onChange={(event: ReactChangeEvent<HTMLInputElement>) => setJoinLobbyName(event.currentTarget.value)} maxLength={15} placeholder="Join a lobby" />

                    <label htmlFor="player-name">Player Name
                        <span className='note-text'><br/>Not required if reconnecting</span>
                    </label>
                    <input type="text" id="player-name" value={playerName}  onChange={(event: ReactChangeEvent<HTMLInputElement>) => setPlayerName(event.currentTarget.value)} maxLength={15} placeholder="Enter a player name" required />

                    <label htmlFor="colors">Choose a Color
                        <span className='note-text'><br/>Not required if reconnecting</span>
                    </label>
                    <select id="colors" name="colors" value={playerColor} defaultValue=""  onChange={(event: ReactChangeEvent<HTMLSelectElement>) => setPlayerColor(event.currentTarget.value)} required>
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
                <button className={playerList.length >= 3 ? "button" : "button link-disabled"} id='play-now' type="button" onClick={handleStart} disabled={playerList.length >= 3 ? false : true}>START GAME</button>
            </div>
        </div>
    )
}


export default OptionsPage