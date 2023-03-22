from rest_framework import serializers
from .models import (Profile,
                     Cars,
                     CarMaintenance,
                     CarOrders,
                     Departments,
                     Drivings,
                     Logs,
                     MaintenanceTypes,
                     Shifts,
                     Roles)
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

################## TOKEN SERIALIZER ###############


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


#################  READ ONLY SERIALIZERS ##################

class ProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = Profile
        fields = ['id', 'user_name', 'realID', 'roleLevel',
                  'jobTitle', 'dep_name', 'department']


class CarsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cars
        fields = ['id', 'licenseNum', 'make', 'model',
                  'color', 'year', 'department', 'dep_name', 'image']


class CarOrdersSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarOrders
        fields = ['id', 'user_name', 'car_name', 'orderDate',
                  'fromDate', 'toDate', 'isAllDay', 'destination', 'car_image']


class LogsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Logs
        fields = ['id', 'user', 'user_name',
                  'car', 'car_name', 'logDate', 'action']


class DrivingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Drivings
        fields = ['id',  'user_name',  'car_name', 'startDate', 'endDate',
                  'startKilometer', 'endKilometer', 'comments', 'car_image',
                  'startImg1', 'startImg2', 'startImg3', 'endImg1', 'endImg2', 'endImg3']


class ShiftsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shifts
        fields = ['id', 'user', 'user_name', 'car', 'car_name',
                  'shiftDate', 'maintenanceType', 'maintenance_name']


class CarMaintenanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarMaintenance
        fields = ['id', 'car', 'car_name', 'maintenanceDate',
                  'maintenanceFile', 'testDate', 'testFile',
                  'mekifFile', 'hovaFile', 'kilometer']
