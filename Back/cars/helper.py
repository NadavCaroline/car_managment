from cars.serializers import CreateLogsSerializer
from rest_framework.response import Response

# helper function to write logs from every server call
def write_to_log(date, user, car, action):
    log_model = {
        'logDate': date,
        'user': user,
        'car': car,
        'action': action
    }
    serializer = CreateLogsSerializer(data=log_model)
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)