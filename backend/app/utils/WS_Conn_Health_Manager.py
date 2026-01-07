import asyncio

class WS_Conn_Health_Manager:
    ping_interval_seconds = 10

    def __init__(self, websocket, logger):
        self.websocket = websocket
        self.logger = logger
        self.active = True

    async def start(self):
        while self.active:
            try:
                await self.websocket.send_json({
                    'actionCategory': 'admin',
                    'actionType': 'ping'
                })
                self.logger.debug("Sent ping to client.")
            except Exception as e:
                self.logger.error(f"Failed to send ping: {e}")
                self.active = False
                break
            await asyncio.sleep(self.ping_interval_seconds)

    def stop(self):
        self.active = False