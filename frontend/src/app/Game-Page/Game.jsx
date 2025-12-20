import { useContext } from 'react'
import '../../styles/Game.css'
import { GameContext } from '../../context/GameContext.jsx'
import { WebsocketContext } from '../../context/WebsocketContext.jsx'
import Player from '../../classes/Player.jsx'
import MainPlayerInfo from './MainPlayerInfo.jsx'
import CloseButton from './CloseBtn.jsx'
import LRLAIndicators from './LR-LA-indicator.jsx'
import PlayerInfo from './PlayerInfo.jsx'
import ActionButtons from './ActionButtons.jsx'
import Board from './Board.jsx'


function Game() {
  
  const { players, missions } = useContext(WebsocketContext);


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
          
          <PlayerInfo />

          <ActionButtons />

        </GameContext.Provider>

        <CloseButton />
      </div>
    </div>
  );
}

export default Game;