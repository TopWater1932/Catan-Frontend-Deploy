import { useContext, useEffect } from 'react'
import '../../styles/Game.css'
import { GameContext } from '../../context/GameContext'
import { useWebSocketContext } from '../../context/WebsocketContext'
import MainPlayerInfo from './MainPlayerInfo.jsx'
import CloseButton from './CloseBtn.jsx'
import LRLAIndicators from './LR-LA-indicator.jsx'
import PlayerInfo from './PlayerInfo.jsx'
import ActionButtons from './ActionButtons.jsx'
import Board from './Board.jsx'
import Dice from "./Dice.tsx"
import { Link } from 'react-router'


function Game() {
  
  const { turn, players, missions, displayDice, setDisplayDice, playerID, lobbyInitialised } = useWebSocketContext();

  const pageLocations = ['west','north','east'];
  const positions = {};

  Object.keys(players).forEach((id,i) => {
    id === playerID ? positions['south'] = id : positions[pageLocations[i]] = id;
  });

  useEffect(() => {
    if (playerID === turn) {
      setDisplayDice(true);
    }
  }, [playerID, turn]);

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

            
            {Object.keys(positions).map((pos) => 
                <MainPlayerInfo
                  key={`${positions[pos]}-MainPlayerInfo`}
                  id={positions[pos]}
                  position={pos}
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