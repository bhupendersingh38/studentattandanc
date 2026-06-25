"""
Notifications API endpoints
"""
from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()


class Notification(BaseModel):
    id: Optional[str] = None
    user_id: str
    title: str
    message: str
    type: str
    read: bool = False


@router.get("/")
async def get_notifications():
    """Get all notifications"""
    return {
        "notifications": [
            {
                "id": "1",
                "user_id": "demo_user",
                "title": "Attendance Alert",
                "message": "Your attendance dropped below 75%",
                "type": "warning",
                "read": False
            }
        ]
    }


@router.post("/send")
async def send_notification(notification: Notification):
    """Send a notification"""
    return {
        "status": "success",
        "notification_id": "demo_notif_id"
    }


@router.put("/{notification_id}/read")
async def mark_as_read(notification_id: str):
    """Mark notification as read"""
    return {"status": "success"}
