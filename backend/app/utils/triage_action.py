from fastapi import WebSocketException


# Potential function to abstract some detail away from main.py in future.
# Not used for now.
async def admin_action(data,lobby,name):
    
    if data['actionType'] == 'join':
        name = data['name']
        await lobby.broadcast(f'{name} has joined the game.')

    else:
        raise WebSocketException(code=1008,reason="Undefined action for the admin action category.")