import { useEffect } from 'react'
import '../../styles/Game.css'
import { GameContext } from '../../context/GameContext'
import { useWebSocketContext } from '../../context/WebsocketContext'
import MainPlayerInfo from './MainPlayerInfo'
import CloseButton from './CloseBtn'
import LRLAIndicators from './LR-LA-indicator'
import PlayerInfo from './PlayerInfo'
import ActionButtons from './ActionButtons'
import Board from './Board'
import Dice from './Dice'
import Modal from './Modal'
import ReconnectModalContent from './ReconnectModalContent'
import { Link } from 'react-router'

import {
  GamePagePositions
} from '../../ts-contracts/interfaces'

interface GameArgs {
  shouldReconnect: boolean;
  connected: boolean;
}

function Game({shouldReconnect, connected}:GameArgs) {
  
  const { turn, players, missions, displayDice, setDisplayDice, playerID, lobbyInitialised } = useWebSocketContext();

  const pageLocations: string[] = ['west','north','east'];
  const positions: GamePagePositions = {};

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

          <Modal
            isVisible={shouldReconnect && !connected}
            setIsVisible={() => null}
            modalClassTypes='options-modal'
            content={
              <ReconnectModalContent />
            }
          />

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