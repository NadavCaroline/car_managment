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