function ServerMsgsWindow({messages}) {
    const displayArray = messages.slice(-5).reverse()
    

    return (
        <div className="server-messages">
            {displayArray.map((m) => 
                <p>{m}</p>
            )}
        </div>
    )
}


export default ServerMsgsWindow