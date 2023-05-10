from cars.serializers import CreateLogsSerializer,CreateNotificationSerializer
from datetime import datetime

import pytz
from .models import Logs
# helper function to write logs from every server call
def write_to_log(level, action, user=None, car=None):
    """
    This function writes to the log table in the database.
    the levels are info, warning, critical.
    The user and the car gets a defualt value
    for the edge case of the registeration with no user or car.
    """
    new_log = Logs(level=level,logDate=datetime.now(pytz.timezone('Asia/Jerusalem')) ,action=action,user=user,car=car)
    new_log.save()

# helper function to write notification from every server call
def add_notification(recipient, title, message, created_at):
    notification_model = {
        'recipient': recipient,
        'title': title,
        'message': message,
        'created_at': created_at,
        'is_read':'0'
    }
    serializer = CreateNotificationSerializer(data=notification_model)
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)