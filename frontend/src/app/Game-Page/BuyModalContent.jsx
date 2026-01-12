import { useContext } from "react"
import { useWebSocketContext } from '../../context/WebsocketContext'
import { GameContext } from "../../context/GameContext.jsx";
import PlayerInfo from "./PlayerInfo.jsx";
import '../../styles/options-modal.css'



function BuyModalContent({ setBuyModalIsVisible }) {
    
    const {players,setPlayers,turn} = useWebSocketContext();
    const {resIcons} = useContext(GameContext);
    const {resources,structures,devCards,vps} = players[turn];
    const {woodIcon,brickIcon,wheatIcon,sheepIcon,oreIcon} = resIcons;

    console.log(players)

    const resRequirements = {
        'Road': { 'brick': 1, 'wood': 1 },
        'Settlement': { 'brick': 1, 'wood': 1, 'wheat': 1, 'sheep': 1 },
        'City': { 'wheat': 2, 'ore': 3 },
        'DevelopmentCard': { 'ore': 1, 'wheat': 1, 'sheep': 1}
    }
    

    const resRequirementLabels = {
        'Road': `${brickIcon} ${resRequirements.Road.brick}, ${woodIcon}  ${resRequirements.Road.wood}`,
        'Settlement': `${brickIcon} ${resRequirements.Settlement.brick}, ${woodIcon} ${resRequirements.Settlement.wood}, ${wheatIcon} ${resRequirements.Settlement.wheat}, ${sheepIcon} ${resRequirements.Settlement.sheep}`,
        'City': `${wheatIcon} ${resRequirements.City.wheat}, ${oreIcon} ${resRequirements.City.ore}`,
        'DevelopmentCard': `${oreIcon} ${resRequirements.DevelopmentCard.ore}, ${wheatIcon} ${resRequirements.DevelopmentCard.wheat}, ${sheepIcon} ${resRequirements.DevelopmentCard.sheep}`
    };
    
    function hasEnoughResources(resRequirements, resources, structure) {
        for (const res in resRequirements[structure]) {
            if (resources[res] < resRequirements[structure][res]) {
                return false;
            }
        }
        return true;
        
    }

    const handleUseClick = (e, structure) => {
        setPlayers(prevPlayers => {
            const newResources = { ...prevPlayers[turn].resources };

            for (const res in resRequirements[structure]) {
                newResources[res] = newResources[res] - resRequirements[structure][res];
            }

            return {
                ...prevPlayers,
                [turn]: {
                    ...prevPlayers[turn],
                    resources: newResources
                }
            };
        });

        setBuyModalIsVisible(false);
    };

    return (

        <div className='options'>
            {Object.keys(resRequirementLabels).map((structure) => 
                    <div className='option-row'>
                        <p className='dev-card-label'>
                            <span className='bold'>{`${structure}: `}</span><br/>
                            <span>{`${resRequirementLabels[structure]}`}</span>
                        </p>
                        <button className='button' type="button" onClick={(e: ReactMouseEvent) => handleUseClick(e,structure)} disabled={!hasEnoughResources(resRequirements,resources,structure)}>Use</button>
                    </div>
            )}

            <PlayerInfo />

        </div>

)}

export default BuyModalContent;