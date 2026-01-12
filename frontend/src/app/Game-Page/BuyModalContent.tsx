import { useContext } from "react"
import { useWebSocketContext } from '../../context/WebsocketContext'
import { useGameContext } from "../../context/GameContext";
import PlayerInfo from "./PlayerInfo.js";
import '../../styles/options-modal.css'

import {
  SetterFunction,
  ResourcesMap,
  ResourceRequirements,
  ReactMouseEvent
} from '../../ts-contracts/interfaces'

const resRequirements: ResourceRequirements = {
    'Road': { 'brick': 1, 'wood': 1 },
    'Settlement': { 'brick': 1, 'wood': 1, 'wheat': 1, 'sheep': 1 },
    'City': { 'wheat': 2, 'ore': 3 },
    'DevelopmentCard': { 'ore': 1, 'wheat': 1, 'sheep': 1}
}

type BuildableItem = keyof typeof resRequirements;

interface BuyModalContentArgs {
    setBuyModalIsVisible: SetterFunction<boolean>;
}

function BuyModalContent({setBuyModalIsVisible}: BuyModalContentArgs) {
    
    const {players,setPlayers,turn} = useWebSocketContext();
    const {resIcons} = useGameContext();
    const {resources,structures,devCards,vps} = players[turn];
    const {woodIcon,brickIcon,wheatIcon,sheepIcon,oreIcon} = resIcons;


    const resRequirementLabels = {
        'Road': `${brickIcon} ${resRequirements.Road.brick}, ${woodIcon}  ${resRequirements.Road.wood}`,
        'Settlement': `${brickIcon} ${resRequirements.Settlement.brick}, ${woodIcon} ${resRequirements.Settlement.wood}, ${wheatIcon} ${resRequirements.Settlement.wheat}, ${sheepIcon} ${resRequirements.Settlement.sheep}`,
        'City': `${wheatIcon} ${resRequirements.City.wheat}, ${oreIcon} ${resRequirements.City.ore}`,
        'DevelopmentCard': `${oreIcon} ${resRequirements.DevelopmentCard.ore}, ${wheatIcon} ${resRequirements.DevelopmentCard.wheat}, ${sheepIcon} ${resRequirements.DevelopmentCard.sheep}`
    };
    
    function hasEnoughResources(structure: BuildableItem) {
        for (const res in resRequirements[structure]) {
            if (resources[res] < resRequirements[structure][res]) {
                return false;
            }
        }
        return true; 
    }

    const handleUseClick = (e, structure: BuildableItem) => {

        console.log(`${structure} Send json to backend for buying resource`)
        setBuyModalIsVisible(false);
    };

    return (

        <div className='options'>
            {(Object.keys(resRequirementLabels) as BuildableItem[]).map((structure) => 
                    <div className='option-row'>
                        <p className='dev-card-label'>
                            <span className='bold'>{`${structure}: `}</span><br/>
                            <span>{`${resRequirementLabels[structure]}`}</span>
                        </p>
                        <button
                            className='button'
                            type="button"
                            onClick={(e: ReactMouseEvent) => handleUseClick(e,structure)}
                            disabled={!hasEnoughResources(structure)}
                        >
                            Use
                        </button>
                    </div>
            )}

            <PlayerInfo />

        </div>

)}

export default BuyModalContent;