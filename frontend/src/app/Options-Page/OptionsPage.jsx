import { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom';
import useFetch from '../../utils/fetch/useFetch'
import ServerMsgsWindow from './ServerMsgsWindow.jsx'
import '../../styles/Options-Page.css'
import { WebsocketContext } from '../../context/WebsocketContext.jsx'

function OptionsPage({setSocketURL,serverMsgs, setServerMsgs,playerColor, setPlayerColor}) {

    const {playerName,setPlayerName} = useContext(WebsocketContext)

    const [createLobbyName,setCreateLobbyName] = useState('')
    const [joinLobbyName,setJoinLobbyName] = useState('')

    const createLobbyURL = 'http://127.0.0.1:8000/lobbies'
    const createLobbyBody = {'name':createLobbyName}
    const [createLobMsg, createLobLoading, createLobError, createLobbyFetch] = useFetch(createLobbyURL,"POST",createLobbyBody,setServerMsgs)


    const handleCreateLobby = (e) => {
        e.preventDefault()
        createLobbyFetch()
    }

    const handleJoinLobby = (e) => {
        e.preventDefault()
        setSocketURL(`ws://127.0.0.1:8000/ws/?lobby_name=${joinLobbyName}`)
    }


    const handleStart = () => {
        console.log('fj')
    }

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
                <form onSubmit={handleCreateLobby}>
                    <label htmlFor="create-lobby-name">Lobby Name:</label>
                    <input type="text" id="create-lobby-name" value={createLobbyName} onChange={(e) => setCreateLobbyName(e.target.value)} placeholder="Enter a lobby name" />
                    <button className="button opt-panel-button" type="submit" disabled={createLobLoading}>{createLobLoading ? 'Loading...' : 'Create Lobby'}</button>
                </form>

                </div>

                {/* JOIN LOBBY */}
                <div className="panel-background join-lobby-panel">
                <h3>Join Lobby</h3>

                    <label htmlFor="join-lobby-name">Lobby Name:</label>
                    <input type="text" id="join-lobby-name" value={joinLobbyName} onChange={(e) => setJoinLobbyName(e.target.value)} placeholder="Join a lobby" />

                    <label htmlFor="player-name">Player Name:</label>
                    <input type="text" id="player-name" value={playerName} onChange={(e) => setPlayerName(e.target.value)} placeholder="Enter a player name" required />

                    <label htmlFor="colors">Choose a color:</label>
                    <select id="colors" name="colors" value={playerColor} defaultValue="" onChange={(e) => setPlayerColor(e.target.value)} required>
                        <option value="" disabled>Select your player color</option>
                        <option value="red" >Red</option>
                        <option value="blue" >Blue</option>
                        <option value="yellow" >Yellow</option>
                        <option value="white" >White</option>
                    </select>

                <button className="button opt-panel-button" type="button" onClick={handleJoinLobby}>Join Lobby</button>
                </div>

                {/* LOBBY STATUS PANEL */}
                <div className="panel-background lobby-panel">
                <h3>Lobby: [Join a Lobby]</h3>
                <ul className="player-list">
                    <li>P1</li>
                    <li>P2</li>
                    <li>P3</li>
                    <li>P4</li>
                </ul>
                </div>

                {/* SERVER MESSAGE WINDOW */}
                <ServerMsgsWindow messages={serverMsgs}/>

                <Link className="button" to="/">Back</Link>
                <Link className="button" id='play-now' to="/game" onClick={handleStart}>PLAY NOW</Link>
            </div>
        </div>
    )
}


export default OptionsPage