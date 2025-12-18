import './styles/Options-Page.css'

function OptionsPage() {



    const handleStart = () => {
        console.log('test')
    }

    return (
        <div className='game-background'>
            <div className='options-content'>
                <h1 id='game-options-title'>Game Options</h1>

                {/* SETUP OPTIONS (Columns 1–2) */}
                <div className="panel-background setup-panel">
                <h2>Setup Options</h2>

                <div className="setup-row">
                    <span>Number of Players:</span>
                    <span>----</span>
                </div>
                <div className="setup-row">----</div>
                <div className="setup-row">----</div>
                </div>

                {/* CREATE LOBBY (Column 3–4, top) */}
                <div className="panel-background create-lobby-panel">
                <h3>Create Lobby</h3>
                <label>Lobby Name:</label>
                <input type="text" />
                <button className="button">Create Lobby</button>
                </div>

                {/* JOIN LOBBY (Column 3–4, middle) */}
                <div className="panel-background join-lobby-panel">
                <h3>Join Lobby</h3>

                <label>Lobby Name:</label>
                <input type="text" />

                <label>Player Name:</label>
                <input type="text" />

                <label>Choose a color:</label>
                <select>
                    <option>Dropdown Menu</option>
                </select>

                <button className="button">Join Lobby</button>
                </div>

                {/* LOBBY STATUS PANEL */}
                <div className="panel-background lobby-panel">
                <h3>Lobby: [insert lobby name]</h3>

                <ul className="player-list">
                    <li>P1</li>
                    <li>P2</li>
                    <li>P3</li>
                    <li>P4</li>
                </ul>
                </div>

                {/* SERVER MESSAGE WINDOW (Column 3–4, bottom middle) */}
                <div className="server-messages">
                Ready to create lobby
                </div>

                <a className="button" href="http://localhost:5173/">Back</a>
                <button className="button" id='play-now' type="button" onClick={handleStart}>PLAY NOW</button>
            </div>
        </div>
    )
}

export default OptionsPage