"""
WebSocket connection manager
"""
from fastapi import WebSocket
from typing import List
import json


class ConnectionManager:
    """Manages WebSocket connections"""
    
    def __init__(self):
        self.active_connections: List[WebSocket] = []
    
    async def connect(self, websocket: WebSocket):
        """Accept and store new connection"""
        await websocket.accept()
        self.active_connections.append(websocket)
    
    def disconnect(self, websocket: WebSocket):
        """Remove connection"""
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
    
    async def send_personal_message(self, message: dict, websocket: WebSocket):
        """Send message to specific connection"""
        await websocket.send_json(message)
    
    async def broadcast(self, message: dict):
        """Send message to all connections"""
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except:
                # Remove dead connections
                self.disconnect(connection)
    
    async def broadcast_attendance_update(self, attendance_data: dict):
        """Broadcast attendance update to all connected clients"""
        message = {
            "type": "attendance_update",
            "data": attendance_data
        }
        await self.broadcast(message)
    
    async def broadcast_alert(self, alert_data: dict):
        """Broadcast alert to all connected clients"""
        message = {
            "type": "alert",
            "data": alert_data
        }
        await self.broadcast(message)
