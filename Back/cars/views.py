from datetime import datetime
import pytz
import numpy as np
import io
import jwt
from PIL import Image
from django.forms.models import model_to_dict
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.models import User
from .serializers import *
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from .helper import write_to_log, add_notification, handle_uploaded_file
from django.db.models import Count, Q, OuterRef, Max
from django.db.models.functions import Coalesce
from django.core.files.uploadedfile import SimpleUploadedFile
from django.core.files.uploadedfile import InMemoryUploadedFile
from rest_framework.authtoken.models import Token


@api_view(['GET'])
def index(r):
    return Response('index')


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
# class MyTokenObtainPairView(TokenObtainPairView):
#     serializer_class = MyTokenObtainPairSerializer


@api_view(['POST'])
def register(request):
    try:
        msg = ""
        if User.objects.filter(username=request.data['user']['username']).exists():
            msg = {"status": "error", "msg": "משתמש כבר קיים"}
        elif Profile.objects.filter(realID=request.data['profile']['realID']).exists():
            msg = {"status": "error", "msg": "תעודת זהות כבר קיימת במערכת"}
        elif User.objects.filter(email=request.data['user']['email']).exists():
            msg = {"status": "error", "msg": "מייל כבר קיים במערכת"}
        else:
            department = Departments.objects.get(
                id=request.data['profile']['department'])
            role = Roles.objects.get(id=request.data['profile']['roleLevel'])

            user = User.objects.create_user(
                first_name=request.data['user']['first_name'],
                last_name=request.data['user']['last_name'],
                username=request.data['user']['username'],
                email=request.data['user']['email'],
                password=request.data['user']['password'],
                is_superuser=True if role.id == 3 else False

            )
            user.is_active = True
            user.is_staff = True
            user.save()

            profile = Profile.objects.create(
                user=user,
                jobTitle=request.data['profile']['jobTitle'],
                roleLevel=role,
                department=department,
                realID=request.data['profile']['realID'],
            )
            new_user = request.data['user']['username']
            profile.save()
            write_to_log('info', f' משתמש/ת נוצר/ה - {new_user}')
            msg = {"status": "success", "msg": "משתמש/ת נוצר/ה בהצלחה"}
    except Exception as e:
        # Handle the exception
        msg = {"status": "error", "msg": str(e)}
        # error_message = str(e)
    return Response(msg)


@permission_classes([IsAuthenticated])
class AllProfilesView(APIView):
    def get(self, request):
        profiles = Profile.objects.all()
        serializer = ProfileSerializer(profiles, many=True)
        return Response(serializer.data)

    def patch(self, request, id):
        my_model = Profile.objects.get(id=int(id))
        serializer = CreateProfileSerializer(my_model, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@permission_classes([IsAuthenticated])
class AllUsersView(APIView):
    def get(self, request):
        user = request.user
        users_profile = Profile.objects.get(user = user)
        if users_profile.roleLevel.id == 2:
            users = User.objects.filter(profile__department_id=users_profile.department.id)
        else:
            users = User.objects.all()
        print(users)
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

    def patch(self, request, id):
        my_model = User.objects.get(id=int(id))
        serializer = UserSerializer(my_model, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            write_to_log('info', 'פרטי משתמש/ת עברו עריכה', user=request.user)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@permission_classes([IsAuthenticated])
class UsersOfDep(APIView):
    def get(self, request):
        user = request.user
        users = User.objects.all()
        users = list(filter(lambda user: (
            user.profile.department.id == user.profile.department.id), users))
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)


@permission_classes([IsAuthenticated])
class UsersOfDepByShifts(APIView):
    def get(self, request):
        usermain = request.user
        users = User.objects.annotate(count_shifts=Count('user1'))
        users2 = User.objects.annotate(count_shifts=Count('user2'))

        for obj1 in users:
            obj2 = users2.get(pk=obj1.pk)  # Match objects by primary key
            obj1.count_shifts += obj2.count_shifts  # Add values from other queryset
            obj1.save()  # Save updated object to database
        # userOrdered=users.order_by('count_shifts')
        usersAll = list(filter(lambda user: (
            user.profile.department.id == usermain.profile.department.id), users))
        # sort the users by username
        sorted_users = sorted(usersAll, key=lambda u: u.count_shifts)

        serializer = CustomUserSerializer(sorted_users, many=True)
        return Response(serializer.data)


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
        # get all Cars also car that are disabled
        user = request.user
        profile_model = user.profile
        print(profile_model)
        if profile_model.roleLevel.id == 2:
            cars = Cars.objects.filter(department = profile_model.department.id)
        else:
            cars = Cars.objects.all()
        serializer = CarsSerializer(cars, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CreateCarsSerializer(data=request.data)
        if serializer.is_valid():
            # Get the uploaded image from the request
            uploaded_image = request.FILES.get('image')

            # Define the new dimensions for the resized image
            new_height = 500
            new_width = 500

            # Use NumPy to resize the image
            image_array = np.array(Image.open(uploaded_image))
            resized_image = np.array(Image.fromarray(
                image_array).resize((new_width, new_height)))

            # Convert the resized image back to a JPEG image
            resized_image = Image.fromarray(resized_image).convert('RGB')

            # Save the resized image to a temporary file
            resized_image_file = io.BytesIO()
            resized_image.save(resized_image_file, format='JPEG')

            # Create a new SimpleUploadedFile object with a random filename
            resized_image_file = SimpleUploadedFile(
                f'car_image_{np.random.randint(1, 100000)}.jpg',
                resized_image_file.getvalue(),
                content_type='image/jpeg'
            )

            # Set the `image` field in the serializer data to the resized image
            serializer.validated_data['image'] = resized_image_file

            serializer.save()
            write_to_log('info', 'מכונית התווספה', user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, id):
        my_model = Cars.objects.get(id=int(id))
        serializer = CarsSerializer(my_model, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            write_to_log('warning', 'מכונית עברה עריכה',
                         user=request.user, car=my_model)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@permission_classes([IsAuthenticated])
class AvaliableOrdersView(APIView):
    def post(self, request):
        days_list = request.headers.get(
            'NotificationDaysExpiration').split(',')
        integer_list = list(map(int, days_list))
        max_days = max(integer_list)
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
                order_details.append({"car": order.car.id, "fromDate": datetime.fromisoformat(str(order.fromDate)).astimezone(pytz.timezone('Israel')).strftime(
                    "%Y-%m-%d %H:%M:%S"), "toDate": datetime.fromisoformat(str(order.toDate)).astimezone(pytz.timezone('Israel')).strftime("%Y-%m-%d %H:%M:%S"), 'isAllDay': order.isAllDay})
            else:
                available_cars.add(order.car)
        cars = available_cars.difference(cars_black_list)
        for car in Cars.objects.all():               
            if car not in cars_black_list:
                cars.add(car)
        # Checks if there's an upcoming maintenance to a car
        last_maintenance_records = CarMaintenance.objects.values('car').annotate(
            last_expiration_date=Max('expirationDate')).order_by()
        for record in last_maintenance_records:
            days_overdue = (
                record['last_expiration_date'] - datetime.now().date()).days
            car = Cars.objects.get(id=record['car'])
            if days_overdue < max_days:
                order_details.append(
                    {"car": car.id, 'maintenance': f'טיפול לרכב בעוד פחות מ{max_days} ימים'})
        cars = list(filter(lambda car: (car.department.id ==
                    user.profile.department.id and car.isDisabled == False), cars))
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
        # cars matching the user's department id and is not disabled
        cars = list(filter(lambda car: (car.department.id ==
                    user.profile.department.id and car.isDisabled == False), cars))
        serializer = CarsSerializer(cars, many=True)
        return Response(serializer.data)

    # def post(self, request):
    #     serializer = CreateCarsSerializer(
    #         data=request.data, context={'department': request.department})
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(serializer.data, status=status.HTTP_201_CREATED)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # def put(self, request, id):
    #     my_model = Cars.objects.get(id=int(id))
    #     serializer = CreateCarsSerializer(my_model, data=request.data)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(serializer.data)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@permission_classes([IsAuthenticated])
class CarOrdersView(APIView):
    def get(self, request):
        user = request.user
        user_orders = user.carorders_set.all()
        serializer = CarOrdersSerializer(user_orders, many=True)
        return Response(serializer.data)

    # Make an order
    def post(self, request):
        car_model = Cars.objects.get(id=request.data['car'])
        serializer = CreateCarOrdersSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            write_to_log('info', 'הזמנת רכב בוצעה',
                         user=request.user, car=car_model)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # End order - change the ended attribute to be True
    def put(self, request, id):
        my_model = CarOrders.objects.get(id=int(id))
        my_model.ended = True
        model_dict = model_to_dict(my_model)
        serializer = CreateCarOrdersSerializer(my_model, data=model_dict)
        if serializer.is_valid():
            serializer.save()
        return Response(serializer.data)


@permission_classes([IsAuthenticated])
class CarMaintenanceView(APIView):
    # def get(self, request,id):
    #     my_model = CarMaintenance.objects.filter(car=id).order_by('-expirationDate')
    #     serializer = CarMaintenanceSerializer(my_model, many=True)
    #     return Response(serializer.data)
    def get(self, request):
        my_model = CarMaintenance.objects.all().order_by('-expirationDate')
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
            # Added maintenance type
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@permission_classes([IsAuthenticated])
class ShiftsView(APIView):
    def get(self, request):
        user = request.user
        shifts = Shifts.objects.all()
        if (user.profile.roleLevel.id == 1):  # filter by user if user is not admin
            shifts = Shifts.objects.filter(Q(user1=user.id) | Q(user2=user.id))
        shifts = shifts.order_by('-shiftDate')

        serializer = ShiftsSerializer(shifts, many=True)
        return Response(serializer.data)

    def put(self, request, id):
        try:
            my_model = Shifts.objects.get(id=int(id))
            my_model.isDone = request.data['isDone']
            model_dict = model_to_dict(my_model)
            serializer = CreateShiftsSerializer(my_model, data=model_dict)
            if serializer.is_valid():
                serializer.save()
            return Response(serializer.data)
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request):
        try:
            user1 = request.data['user1']
            user2 = request.data['user2']
            if (user1 and (Shifts.objects.filter(Q(shiftDate=request.data['shiftDate'], user1=user1)).exclude(car=request.data['car']).exists() or
                           Shifts.objects.filter(Q(shiftDate=request.data['shiftDate'], user2=user1)).exclude(car=request.data['car']).exists()) or
                user2 and (Shifts.objects.filter(Q(shiftDate=request.data['shiftDate'], user1=user2)).exclude(car=request.data['car']).exists() or
                           Shifts.objects.filter(Q(shiftDate=request.data['shiftDate'], user2=user2)).exclude(car=request.data['car']).exists())):

                return Response("למשתמש כבר קיים תורנות בתאריך הנבחר", status=status.HTTP_208_ALREADY_REPORTED)
            serializer = CreateShiftsSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                userMain = request.user
                user1 = User.objects.get(id=int(request.data["user1"]))
                username1 = user1.first_name+" "+user1.last_name
                maintenanceType = MaintenanceTypes.objects.get(
                    id=int(request.data["maintenanceType"]))
                subject = ' תורנות '+maintenanceType.name
                shiftDate = datetime.fromisoformat(
                    str(request.data['shiftDate'])).strftime("%d/%m/%Y")
                emails = []
                if request.data["user2"] == '':
                    username2 = ""
                    message = f"שלום <b>{username1 }</b>,<br><br>הנך משובצ/ת לתורנות <b>{maintenanceType.name}</b><br> בתאריך: {shiftDate}<br><br><u>הערות:</u><br>{request.data['comments']}"
                    emails = [userMain.email, user1.email]
                else:
                    user2 = User.objects.get(id=int(request.data["user2"]))
                    username2 = user2.first_name+" "+user2.last_name
                    message = f"שלום <b>{username1 } ו{ username2}</b>,<br><br>הנכם משובצים לתורנות <b>{maintenanceType.name}</b><br> בתאריך:{shiftDate}<br><br><u>הערות:</u><br>{request.data['comments']}"
                    emails = [userMain.email, user1.email, user2.email]

                html_message = '<div dir="rtl">{}</div>'.format(message)
                send_mail(subject, message, None, emails,
                          fail_silently=False, html_message=html_message)
                # Created Shift
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            # Handle the exception
            if "duplicate key" in str(e):
                # if "my_shift_pk"   in str(e):
                return Response("תורנות כבר קיימת", status=status.HTTP_208_ALREADY_REPORTED)
            else:
                return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@permission_classes([IsAuthenticated])
class LogsView(APIView):
    def get(self, request):
        my_model = Logs.objects.all()
        serializer = LogsSerializer(my_model, many=True)
        return Response(serializer.data)

#     def post(self, request):
#         serializer = CreateLogsSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@permission_classes([IsAuthenticated])
class AllDrivingsView(APIView):
    def get(self, request):
        all_drives = Drivings.objects.all()
        serializer = DrivingsSerializer(all_drives, many=True)
        return Response(serializer.data)


# Responsible for the manual update of the drive's info
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateDrive(request, id):
    my_model = Drivings.objects.get(id=id)
    serializer = CreateDrivingsSerializer(my_model, data=request.data)
    if serializer.is_valid():
        serializer.save()
        write_to_log('warning', 'פרטי נסיעה עברו עריכה',
                     user=request.user, car=my_model.order.car)
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@permission_classes([IsAuthenticated])
class DrivingsView(APIView):
    def get(self, request):
        user = request.user
        user_drives = user.drivings_set.all()
        serializer = DrivingsSerializer(user_drives, many=True)
        return Response(serializer.data)

    def post(self, request):
        auto_start = request.POST.get('startDate')
        order_model = CarOrders.objects.get(id=request.POST.get('order'))
        serializer = CreateDrivingsSerializer(data=request.data)
        car_by_order = CarOrders.objects.get(id=request.data['order']).car
        last_order_by_car = ""
        latest_toDate = None
        for order in CarOrders.objects.filter(car=car_by_order, ended=True):
            if not latest_toDate or order.toDate > latest_toDate:
                latest_toDate = order.toDate
                last_order_by_car = order
        try:
            last_drive_kilo = Drivings.objects.get(
                order=last_order_by_car).endKilometer

            kilo_warning = False if str(last_drive_kilo) == str(
                request.data['startKilometer']) else True
            if kilo_warning:
                write_to_log('critical', "קילומטראז' התחלתי של נסיעה לא תואם",
                             user=request.user, car=order_model.car)
        except Exception as e:
            print(e)

        if serializer.is_valid():
            serializer.save()
            if auto_start:
                write_to_log('info', 'משתמש/ת התחיל/ה נסיעה',
                             user=request.user, car=order_model.car)
            else:
                write_to_log('warning', 'משתמש/ת שכח/ה להתחיל/לסיים נסיעה',
                             user=request.user, car=order_model.car)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, id):
        next_kilo = int(request.headers.get('KilometerVariable'))
        auto_end = request.data.get('endDate')
        my_model = Drivings.objects.get(id=id)
        car_by_drive = Cars.objects.get(
            id=Drivings.objects.get(id=request.data['id']).car)
        print(car_by_drive.nickName)
        dep_by_car = Departments.objects.get(name=Cars.objects.get(
            id=Drivings.objects.get(id=request.data['id']).car).department)
        manager = User.objects.get(username=Profile.objects.get(
            department=dep_by_car, roleLevel=2).user)
        try:
            kilo_diff = int(CarMaintenance.objects.filter(car=CarOrders.objects.get(id= Drivings.objects.get(
                id=request.data['id']).order.id).car).last().nextMaintenancekilometer) - int(request.data['endKilometer'])
            print("542")
            # Check if notification about maintenance needs to be sent by the kilometer.
            if kilo_diff < next_kilo:
                add_notification(
                    recipient=manager, title=f'טיפול לרכב {car_by_drive.nickName} מתקרב', message=f'טיפול לרכב {car_by_drive.nickName} בעוד {kilo_diff} קילומטר.')
        except Exception as e:
            print(e)
            print(manager.email)
            add_notification(
                recipient=manager, title=f'טיפול לרכב {car_by_drive.nickName} חסר', message=f'יש להכניס טיפול לרכב {car_by_drive.nickName}')
            write_to_log('critical', 'חסר טיפול לרכב', car=car_by_drive)
            send_mail('התראה על טיפול רכב חסר', f'יש להכניס טיפולי רכב לרכב {car_by_drive.nickName}',
                None, [manager.email], fail_silently=False)
        serializer = CreateDrivingsSerializer(my_model, data=request.data)
        if serializer.is_valid():
            serializer.save()

            if auto_end:
                write_to_log('info', 'משתמש/ת סיים/ה נסיעה',
                             user=request.user, car=car_by_drive)
            else:
                write_to_log('warning', 'משתמש/ת שכח/ה לסיים/ה נסיעה',
                             user=request.user, car=car_by_drive)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RolesView(APIView):
    def get(self, request):
        my_model = Roles.objects.all()
        serializer = CreateRolesSerializer(my_model, many=True)
        return Response(serializer.data)

@permission_classes([IsAuthenticated])
class DepartmentsView(APIView):
    def get(self, request):
        user = request.user
        profile= user.profile
        if profile.roleLevel.id == 2:
            my_model = Departments.objects.filter(id = profile.department.id)
        else:
            my_model = Departments.objects.all()
        serializer = CreateDepartmentsSerializer(my_model, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CreateDepartmentsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            write_to_log('warning', 'מחלקה חדשה נוספה למערכת',
                         user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ForgotView(APIView):
    def post(self, request):
        try:
            msg = ""
            email = request.data["email"]
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                user = None
                msg = {"status": "error", "msg": "מייל לא קיים במערכת"}
            if user:
                token = default_token_generator.make_token(user)
                reset_url = "http://localhost:3000/reset/" + \
                    urlsafe_base64_encode(force_bytes(user.pk))+"/"+token
                # reset_url = request.build_absolute_uri(reverse('password_reset_confirm', kwargs={'uidb64': urlsafe_base64_encode(force_bytes(user.pk)), 'token': token}))
                message = f"Hello {user.username},\n\nPlease click on the following link to reset your password:\n\n{reset_url}\n\nThanks,\nYour website team"
                send_mail('Password reset request', message,
                          None, [user.email], fail_silently=False)
                msg = {"status": "success",
                       "msg": "מייל נשלח בהצלחה עם קישור לאיפוס סיסמא"}
                write_to_log('info', 'נשלח קישור לאיפוס סיסמא', user=user)
        except Exception as e:
            # Handle the exception
            msg = {"status": "error", "msg": str(e)}
        return Response(msg)


class ResetView(APIView):
    def post(self, request, uidb64, token):
        msg = ""
        try:
            try:
                uid = urlsafe_base64_decode(uidb64).decode()
                user = User.objects.get(pk=uid)
            except (TypeError, ValueError, OverflowError, User.DoesNotExist):
                user = None
                msg = {"status": "error", "msg": "uid has an invalid value"}

            if user and default_token_generator.check_token(user, token):
                user.set_password(request.data["password"])
                user.save()
                msg = {"status": "success", "msg": "סיסמא חדשה עודכנה בהצלחה"}
            else:
                msg = {"status": "error", "msg": "The token is not valid"}
        except Exception as e:
            # Handle the exception
            msg = {"status": "error", "msg": str(e)}
        return Response(msg)


class NotificationView(APIView):
    def get(self, request):
        user = request.user
        my_model = Notification.objects.all().filter(recipient=user)
        serializer = CreateNotificationSerializer(my_model, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CreateNotificationSerializer(data=request.data, many=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, id):
        my_model = Notification.objects.get(id=int(id))
        my_model.is_read = True
        model_dict = model_to_dict(my_model)
        serializer = CreateNotificationSerializer(my_model, data=model_dict)
        if serializer.is_valid():
            serializer.save()
        return Response(serializer.data)

    def delete(self, request, id):
        my_model = Notification.objects.get(id=id)
        deleted_id = my_model.id
        my_model.delete()
        msg = {"status": "success", "deleted_id": deleted_id}
        return Response(msg)


@permission_classes([IsAuthenticated])
class FileTypesView(APIView):
    def get(self, request):
        my_model = FileTypes.objects.all()
        serializer = CreateFileTypesSerializer(my_model, many=True)
        return Response(serializer.data)


@api_view(['POST'])
def nextMainDate(request):
    next_noti_date = request.data
    next_noti_date.sort()
    last_maintenance_records = CarMaintenance.objects.values('car').annotate(
        last_expiration_date=Max('expirationDate')).order_by()

    for record in last_maintenance_records:
        expiration_date = record['last_expiration_date']
        car = record['car']
        car_name = Cars.objects.get(id=car).nickName
        car_lisenceNum = Cars.objects.get(id=car).licenseNum
        dep_by_car = Departments.objects.get(
            name=Cars.objects.get(id=car).department)
        manager = User.objects.get(username=Profile.objects.get(
            department=dep_by_car, roleLevel=2).user)
        days_overdue = (expiration_date - datetime.now().date()).days
        if days_overdue == 0:
            add_notification(
                recipient=manager, title=f'טיפול לרכב {car_lisenceNum} - {car_name}', message=f'טיפול לרכב {car_lisenceNum} - {car_name} הגיע.')
        elif days_overdue < 0:
            add_notification(
                recipient=manager, title=f'טיפול לרכב {car_lisenceNum} - {car_name}', message=f'טיפול לרכב {car_lisenceNum} - {car_name} לא בוצע.')
        for day in next_noti_date:
            if days_overdue == day:
                add_notification(recipient=manager, title=f'טיפול לרכב {car_lisenceNum} - {car_name} מתקרב',
                                 message=f'טיפול לרכב {car_lisenceNum} - {car_name} בעוד {day} ימים.')
    return Response('Next Maintenance Date Checked')
