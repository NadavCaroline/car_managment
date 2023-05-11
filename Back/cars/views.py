from datetime import datetime
import pytz
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
from .helper import write_to_log,add_notification
from django.db.models import Count,Q



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
            profile.save()
            write_to_log('info', 'משתמש/ת נוצר/ה')
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
        users = User.objects.all()
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
        users = list(filter(lambda user: (user.profile.department.id ==user.profile.department.id ), users))
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)
    
@permission_classes([IsAuthenticated])
class UsersOfDepByShifts(APIView):
    def get(self, request):
        usermain = request.user
        users = User.objects.annotate(count_shifts=Count('user1'))
        users2 = User.objects.annotate(count_shifts=Count('user2'))
       
        for obj1 in users:
            obj2 = users2.get(pk=obj1.pk) # Match objects by primary key
            obj1.count_shifts += obj2.count_shifts # Add values from other queryset
            obj1.save() # Save updated object to database
        # userOrdered=users.order_by('count_shifts')
        usersAll = list(filter(lambda user: (user.profile.department.id ==usermain.profile.department.id ), users))
        sorted_users = sorted(usersAll, key=lambda u: u.count_shifts)  # sort the users by username

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
        cars = Cars.objects.all()
        serializer = CarsSerializer(cars, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CreateCarsSerializer(data=request.data)
        if serializer.is_valid():
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
                    "%Y-%m-%d %H:%M:%S"), "toDate": datetime.fromisoformat(str(order.toDate)).astimezone(pytz.timezone('Israel')).strftime("%Y-%m-%d %H:%M:%S"), "carID": order.car.id})
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
        print({"orderDetails": order_details})
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
            write_to_log('info', 'הזמנת רכב בוצעה',user=request.user, car=car_model)
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
        user = request.user
        shifts = Shifts.objects.all()
        if(user.profile.roleLevel.id==1):# filter by user if user is not admin
            shifts= Shifts.objects.filter(Q(user1=user.id) | Q(user2=user.id))
        shifts=shifts.order_by('-shiftDate')
 
        serializer = ShiftsSerializer(shifts, many=True)
        return Response(serializer.data)
    
    def put(self, request, id):
        try:
            my_model = Shifts.objects.get(id=int(id))
            my_model.isDone=request.data['isDone']
            model_dict = model_to_dict(my_model)
            serializer = CreateShiftsSerializer(my_model, data=model_dict)
            if serializer.is_valid():
                serializer.save()
            return Response(serializer.data)
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request):
        try:
            user1=request.data['user1']
            user2=request.data['user2']
            shiftDate=request.data['shiftDate']
            car=request.data['car']
            maintenanceType=request.data['maintenanceType']
            comments=request.data['comments']
            if ( user1  and (Shifts.objects.filter(Q(shiftDate=shiftDate,user1=user1)).exclude(car=car).exists() or
                Shifts.objects.filter(Q(shiftDate=shiftDate,user2=user1)).exclude(car=car).exists()) or
                user2  and (Shifts.objects.filter(Q(shiftDate=shiftDate,user1=user2)).exclude(car=car).exists() or
                Shifts.objects.filter(Q(shiftDate=shiftDate,user2=user2)).exclude(car=car).exists())):
                                     
                return Response("למשתמש כבר קיים תורנות בתאריך הנבחר",status=status.HTTP_208_ALREADY_REPORTED)
            serializer = CreateShiftsSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                userMain = request.user
                user1 = User.objects.get(id=int(user1))
                username1=user1.first_name+" "+user1.last_name  
                maintenanceType=MaintenanceTypes.objects.get(id=int(maintenanceType))
                subject=' תורנות '+maintenanceType.name
                shiftDate=datetime.fromisoformat(str(shiftDate)).strftime("%d/%m/%Y")
                emails=[]
                notification='הנך משובץ לתורנות בתאריך '+ shiftDate
                car=Cars.objects.get(id=int(car))
                carMsg=",רכב-"+car.nickName+"-"+car.licenseNum
                if  user2=='':  
                    username2=""
                    message = f"שלום <b>{username1 }</b>,<br><br>הנך משובצ/ת ל<b>{subject}</b><br> בתאריך: {shiftDate},{carMsg}<br><br><u>הערות:</u><br>{comments}"
                    emails=[userMain.email,user1.email]    
                    add_notification(user1,subject,notification+carMsg,'')
                else:
                    user2= User.objects.get(id=int(user2))
                    username2=   user2.first_name+" "+user2.last_name
                    message = f"שלום <b>{username1 } ו{ username2}</b>,<br><br>הנכם משובצים ל<b>{subject}</b><br> בתאריך:{shiftDate},{carMsg}<br><br><u>הערות:</u><br>{comments}"
                    emails=[userMain.email,user1.email,user2.email]
                    add_notification(user1,subject,notification+" ביחד עם "+ username2+carMsg,'')
                    add_notification(user2,subject,notification+" ביחד עם "+ username1+carMsg,'')
                html_message = '<div dir="rtl">{}</div>'.format(message)
                send_mail(subject, message, None, emails, fail_silently=False,html_message=html_message)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            # Handle the exception
            if "duplicate key" in str(e):
                # if "my_shift_pk"   in str(e):
                return Response( "תורנות כבר קיימת",status=status.HTTP_208_ALREADY_REPORTED)
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
        auto_end = request.data.get('endDate')
        my_model = Drivings.objects.get(id=id)
        serializer = CreateDrivingsSerializer(my_model, data=request.data)
        if serializer.is_valid():
            serializer.save()
            if auto_end:
                write_to_log('info', 'משתמש/ת סיים/ה נסיעה',
                             user=request.user, car=my_model.order.car)
            else:
                write_to_log('warning', 'משתמש/ת שכח/ה לסיים/ה נסיעה',
                             user=request.user, car=my_model.order.car)
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
        msg={"status":"success","deleted_id": deleted_id}
        return Response(msg)