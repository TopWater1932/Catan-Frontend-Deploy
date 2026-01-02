import { useContext } from 'react'
import '../../styles/Game.css'
import { GameContext } from '../../context/GameContext.jsx'
import { WebsocketContext } from '../../context/WebsocketContext.jsx'
import MainPlayerInfo from './MainPlayerInfo.jsx'
import CloseButton from './CloseBtn.jsx'
import LRLAIndicators from './LR-LA-indicator.jsx'
import PlayerInfo from './PlayerInfo.jsx'
import ActionButtons from './ActionButtons.jsx'
import Board from './Board.jsx'
import Dice from "./Dice.jsx"
import { Link } from 'react-router'


function Game() {
  
  const { players, missions, displayDice,lobbyInitialised } = useContext(WebsocketContext);

  console.log(`Lobby initialised status in Game.jsx: ${lobbyInitialised}`)

  if (!lobbyInitialised) {
    return (
      <div className='game-background'>
        <div className='app-content'>
          <p>Waiting for game to initialise. If you have not joined a lobby from the Options Page, click <Link to="/setup">here</Link> to go back.</p>
        </div>
      </div>
    );
  } else {
    return (
      <div className='game-background'>

        <div className='app-content'>

          <LRLAIndicators missions={missions}/>

          <GameContext.Provider
            value={{
              'resIcons':{
                'woodIcon':'🪵',
                'brickIcon':'🧱',
                'wheatIcon':'🌾' ,
                'sheepIcon':'🐑',
                'oreIcon':'🪨'
              }
            }}
          >

            
            {Object.keys(players).map((id) => 
                <MainPlayerInfo
                  key={`${id}-MainPlayerInfo`}
                  id={id}
                />
              )
            }
            
            <Board />

            {displayDice && <Dice />}
            
            <PlayerInfo />

            <ActionButtons />

          </GameContext.Provider>

          <CloseButton />
        </div>
      </div>
    );
  }

}

export default Game;