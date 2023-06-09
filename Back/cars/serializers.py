from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (Profile,
                     Cars,
                     CarMaintenance,
                     CarOrders,
                     Departments,
                     Drivings,
                     Logs,
                     MaintenanceTypes,
                     Shifts,
                     Roles,
                     Notification,FileTypes)
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

################## TOKEN SERIALIZER ###############

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims to the token
        token['first_name'] = user.first_name
        token['last_name'] = user.last_name

        return token
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['username'] = user.username
        # token['realID'] = user.realID
        token['email'] = user.email
        return token


################ POSTING (ADDING) SERIALIZERS ###############

class CreateCarsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cars
        fields = '__all__'


class CreateCarMaintenanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarMaintenance
        fields = '__all__'


class CreateCarOrdersSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarOrders
        fields = '__all__'


class CreateProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = Profile
        fields = '__all__'

    def create(self, validate_data):
        user = self.context['user']
        return Profile.objects.create(**validate_data, user=user)


class CreateDepartmentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Departments
        fields = '__all__'


class CreateRolesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Roles
        fields = '__all__'


class CreateDrivingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Drivings
        fields = '__all__'


class CreateLogsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Logs
        fields = '__all__'


class CreateMaintenanceTypesSerializer(serializers.ModelSerializer):
    class Meta:
        model = MaintenanceTypes
        fields = '__all__'


class CreateShiftsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shifts
        fields = '__all__'

class CreateNotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'
class CreateFileTypesSerializer(serializers.ModelSerializer):
    class Meta:
        model = FileTypes
        fields = '__all__'
#################  READ ONLY SERIALIZERS ##################

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = '__all__'
class CustomUserSerializer(serializers.ModelSerializer):
    count_shifts = serializers.IntegerField()

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'count_shifts')
        # ordering = ['count_shifts']
    def get_ordered(self):
        return User.objects.order_by('count_shifts')

class ProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = Profile
        fields = ['id','user', 'user_name', 'realID', 'roleLevel',
                  'jobTitle', 'dep_name', 'department','role_name']


class CarsSerializer(serializers.ModelSerializer):

    class Meta:
        model = Cars
        fields = ['id', 'licenseNum','nickName', 'make', 'model',
                  'color', 'year','garageName','garagePhone' ,'department','dep_name','isDisabled', 'image']

class CarOrdersSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarOrders
        fields = ['id', 'user_name', 'car_name', 'orderDate','ended', 'car',
                  'fromDate', 'toDate', 'isAllDay', 'destination', 'car_image']


class LogsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Logs
        fields = ['id', 'user', 'user_name',
                  'car', 'car_name', 'logDate', 'action', 'level']


class DrivingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Drivings
        fields = ['id', 'user', 'user_name', 'car', 'car_name', 'startDate', 'endDate',
                  'startKilometer', 'endKilometer', 'comments', 'car_image','order',
                  'startImg1', 'startImg2', 'startImg3', 'endImg1', 'endImg2', 'endImg3']


class ShiftsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shifts
        fields = ['id', 'user1','user_name1', 'user2','user_name2', 'car','car_name', 'shiftDate',
                   'maintenanceType', 'maintenance_name','maintenance_logo','comments','isDone']
        ordering = ['-shiftDate']

class CarMaintenanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarMaintenance
        fields = ['id', 'car', 'maintenanceDate', 'fileMaintenance',
                  'fileType', 'expirationDate', 'nextMaintenancekilometer',
                  'comments', 'car_name','car_file_type_name','car_fileFolderName']
class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id','recipient','title', 'message', 'created_at', 'is_read' ]
class FileTypesSerializer(serializers.ModelSerializer):
    class Meta:
        model = FileTypes
        fields = ['id','name','fileFolderName' ]
class MaintenanceTypesSerializer(serializers.ModelSerializer):
     class Meta:
        model = MaintenanceTypes
        fields = ['id','name','imgLogo' ]

class DepartmentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = FileTypes
        fields = ['id','name']
