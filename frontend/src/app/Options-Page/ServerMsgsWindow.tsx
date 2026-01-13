import { ServerMsgsWindowProps } from '../../ts-contracts/interfaces'

function ServerMsgsWindow({messages}: ServerMsgsWindowProps) {
    const displayArray = messages.slice(-4).reverse()
    

    return (
        <div className="server-messages">
            {displayArray.map((m: string) => 
                <p>{m}</p>
            )}
        </div>
    )
}


export default ServerMsgsWindow