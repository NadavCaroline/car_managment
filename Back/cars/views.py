from datetime import datetime
import json
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.models import User
from .serializers import *


@api_view(['GET'])
def index(r):
    return Response('index')


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(['POST'])
def register(request):
    user = User.objects.create_user(
        first_name=request.data['first_name'],
        last_name=request.data['last_name'],
        username=request.data['first_name'] + request.data['last_name'],
        jobTitle=request.data['jobTitle'],
        roleLevel=request.data['roleLevel'],
        department=request.data['department'],
        email=request.data['email'],
        password=request.data['password'],
        is_superuser=0
    )
    user.is_active = True
    user.is_staff = True
    user.save()
    return Response("New User Created")


@permission_classes([IsAuthenticated])
class ProfileView(APIView):
    def get(self, request):
        user = request.user
        my_model = user.profile
        serializer = ProfileSerializer(my_model, many=False)
        return Response(serializer.data)

    def post(self, request):
        serializer = CreateProfileSerializer(
            data=request.data, context={'user': request.user})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # def put(self, request, id):
    #     my_model = User.objects.get(id=id)
    #     serializer = ProfileSerializer(my_model, data=request.data)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(serializer.data)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # def delete(self, request, id):
    #     my_model = User.objects.get(id=id)
    #     my_model.delete()
    #     return Response(status=status.HTTP_204_NO_CONTENT)


@permission_classes([IsAuthenticated])
class AllCarsView(APIView):
    def get(self, request):
        cars = Cars.objects.all()
        serializer = CarsSerializer(cars, many=True)
        return Response(serializer.data)


@permission_classes([IsAuthenticated])
class AvaliableOrdersView(APIView):
    def post(self, request):
        user = request.user
        date_object = {
            "fromDate": request.data["fromDate"], "toDate": request.data["toDate"]}
        fromDate = datetime.fromisoformat(date_object['fromDate'][:-1])
        toDate = datetime.fromisoformat(date_object['toDate'][:-1])
        all_orders = CarOrders.objects.all()
        available_cars = set()
        cars_black_list = set()  # Contains the cars that are taken on the specific date
        order_details = []
        for order in all_orders:
            # This row checks wether there is alreay and order on the dates the user entered.
            if (order.toDate.replace(tzinfo=None) <= toDate and order.toDate.replace(tzinfo=None) >= fromDate) or (order.fromDate.replace(tzinfo=None) <= toDate and order.fromDate.replace(tzinfo=None) >= fromDate):
                cars_black_list.add(order.car)
                order_details.append({"fromDate": datetime.fromisoformat(str(order.fromDate)).strftime(
                    "%Y-%m-%d %H:%M:%S"), "toDate": datetime.fromisoformat(str(order.toDate)).strftime("%Y-%m-%d %H:%M:%S"), "carID": order.car.id})
            else:
                available_cars.add(order.car)
        cars = available_cars.difference(cars_black_list)
        for car in Cars.objects.all():
            if car not in cars_black_list:
                cars.add(car)

        cars = list(filter(lambda car: (car.department.id ==
                    user.profile.department.id), cars))
        cars_black_list = list(filter(lambda car: (
            car.department.id == user.profile.department.id), cars_black_list))
        serializer = CarsSerializer(list(cars), many=True)
        black_list_serializer = CarsSerializer(
            list(cars_black_list), many=True)
        return Response({"available": serializer.data, "notAvilable": black_list_serializer.data, "orderDetails": order_details})


@permission_classes([IsAuthenticated])
class CarsView(APIView):
    def get(self, request):
        user = request.user
        cars = Cars.objects.all()
        # The next row filters the cars_model list to contain only the
        # cars matching the user's department id.
        cars = list(filter(lambda car: (car.department.id ==
                    user.profile.department.id), cars))
        serializer = CarsSerializer(cars, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CreateCarsSerializer(
            data=request.data, context={'department': request.department})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, id):
        my_model = Cars.objects.get(id=int(id))
        serializer = CreateCarsSerializer(my_model, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@permission_classes([IsAuthenticated])
class CarOrdersView(APIView):
    def get(self, request):
        user = request.user
        user_orders = user.carorders_set.all()
        serializer = CarOrdersSerializer(user_orders, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CreateCarOrdersSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@permission_classes([IsAuthenticated])
class CarMaintenanceView(APIView):
    def get(self, request):
        my_model = CarMaintenance.objects.all().values('car')
        serializer = CarMaintenanceSerializer(my_model, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CreateCarMaintenanceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@permission_classes([IsAuthenticated])
class MaintenanceTypesView(APIView):
    def get(self, request):
        my_model = MaintenanceTypes.objects.all()
        print(my_model)
        serializer = CreateMaintenanceTypesSerializer(my_model, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CreateMaintenanceTypesSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@permission_classes([IsAuthenticated])
class ShiftsView(APIView):
    def get(self, request):
        my_model = Shifts.objects.all()
        print(my_model)
        serializer = ShiftsSerializer(my_model, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CreateShiftsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@permission_classes([IsAuthenticated])
class LogsView(APIView):
    def get(self, request):
        my_model = Logs.objects.all()
        serializer = LogsSerializer(my_model, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CreateLogsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@permission_classes([IsAuthenticated])
class AllDrivingsView(APIView):
    def get(self, request):
        all_drives = Drivings.objects.all()
        serializer = DrivingsSerializer(all_drives, many=True)
        return Response(serializer.data)


@permission_classes([IsAuthenticated])
class DrivingsView(APIView):
    def get(self, request):
        user = request.user
        user_drives = user.drivings_set.all()
        serializer = DrivingsSerializer(user_drives, many=True)
        return Response(serializer.data)

    def post(self, request):
        # print(request.data)
        serializer = CreateDrivingsSerializer(data=request.data)
        # user = request.user
        # order = CarOrders.objects.get(id = request.data['order'])
        # print(user, order)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, id):
        my_model = Drivings.objects.get(id=id)
        serializer = CreateDrivingsSerializer(my_model, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RolesView(APIView):
    def get(self, request):
        my_model = Roles.objects.all()
        serializer = CreateRolesSerializer(my_model, many=True)
        return Response(serializer.data)


class DepartmentsView(APIView):
    def get(self, request):
        my_model = Departments.objects.all()
        serializer = CreateDepartmentsSerializer(my_model, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CreateDepartmentsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
