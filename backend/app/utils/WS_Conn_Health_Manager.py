import asyncio

class WS_Conn_Health_Manager:

    def __init__(self, websocket, ping_interval_sec=45, timeout_sec=90):
        self.websocket = websocket
        self.ping_interval_seconds = ping_interval_sec
        self.timeout_seconds = timeout_sec
        self.ping_task = None          # asyncio.Task
        self.timeout_task = None       # asyncio.Task
        self.active = True

    async def timeout(self):
        try:
            await asyncio.sleep(self.timeout_seconds)
            await self.end_heartbeat()

        except asyncio.CancelledError:
            pass

        except Exception:
            await self.end_heartbeat()
    
    async def ping(self):
        try:
            while self.active:
                await asyncio.sleep(self.ping_interval_seconds)

                await self.websocket.send_json({
                    'actionCategory': 'admin',
                    'actionType': 'ping'
                })

        except asyncio.CancelledError:
            pass

        except Exception:
            await self.end_heartbeat()

    async def reset_timeout(self):
        if self.timeout_task:
            self.timeout_task.cancel()
            await self.timeout_task

        self.timeout_task = asyncio.create_task(self.timeout())

    def start_heartbeat(self):
        self.ping_task = asyncio.create_task(self.ping())
        self.timeout_task = asyncio.create_task(self.timeout())
        return self

    async def end_heartbeat(self):
        if not self.active:
            return

        self.active = False

        if self.ping_task:
            self.ping_task.cancel()
            try:
                await self.ping_task
            except asyncio.CancelledError:
                pass
            
        if self.timeout_task:
            self.timeout_task.cancel()
            try:
                await self.timeout_task
            except asyncio.CancelledError:
                pass
        
        await self.websocket.close(code=1001)