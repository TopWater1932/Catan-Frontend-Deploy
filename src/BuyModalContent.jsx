import { useContext } from "react"
import { GlobalContext } from "./GlobalContext.jsx";
import PlayerInfo from "./player-info.jsx";
import './styles/options-modal.css'



function BuyModalContent({ setBuyModalIsVisible }) {
    
    const {turnState, resourcesState, structuresState, resIcons} = useContext(GlobalContext)
    const [turn] = turnState;
    const [resources,setResources] = resourcesState;
    const {woodIcon,brickIcon,wheatIcon,sheepIcon,oreIcon} = resIcons;


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
    
    function hasEnoughResources(resRequirements, playerResources, structure) {
        for (const res in resRequirements[structure]) {
            if (playerResources[res] < resRequirements[structure][res]) {
                return false;
            }
        }
        return true;
        
    }

    const handleUseClick = (e,structure) => {
        
        let updatedResourceQuantity;

        for (const res in resRequirements[structure]) {
            
            updatedResourceQuantity = resources[turn][res] - resRequirements[structure][res];

            setResources(prevResources => ({
                ...prevResources,
                [turn]: {...prevResources[turn],
                    [res]: updatedResourceQuantity}
            }));
        };

        setBuyModalIsVisible(false);
    }

    return (

        <div className='options'>
            {Object.keys(resRequirementLabels).map((structure) => 
                    <div className='option-row'>
                        <p className='dev-card-label'>
                            <span className='bold'>{`${structure}: `}</span><br/>
                            <span>{`${resRequirementLabels[structure]}`}</span>
                        </p>
                        <button className='button' type="button" onClick={(e) => handleUseClick(e,structure)} disabled={!hasEnoughResources(resRequirements,resources[turn],structure)}>Use</button>
                    </div>
            )}

            <PlayerInfo />

        </div>

)}

export default BuyModalContent;