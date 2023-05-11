from cars.serializers import CreateLogsSerializer,CreateNotificationSerializer
from datetime import datetime
from rest_framework.response import Response


import pytz
from .models import Logs,Notification
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
    new_notification = Notification(recipient=recipient,title=title,message=message,created_at=datetime.now(pytz.timezone('Asia/Jerusalem')) ,is_read='0')
    new_notification.save()
   