import datetime
from django.db import models
from django.contrib.auth.models import User


class Departments(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=30)

    def __str__(self):
        return self.name


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True)
    realID = models.CharField(max_length=10, blank=True)
    jobTitle = models.CharField(max_length=50, blank=True)
    department = models.ForeignKey(Departments, on_delete=models.PROTECT,  null=True)
    roleLevel = models.SmallIntegerField(blank=True, default=0)

    @property
    def user_name(self):
        return self.user.first_name + ' ' + self.user.last_name
    
    @property
    def dep_name(self):
        return self.department.name
    
    def __str__(self):
        return self.user_name


class Cars(models.Model):
    id = models.BigAutoField(primary_key=True)
    licenseNum = models.CharField(max_length=20)
    make = models.CharField(max_length=20)
    model = models.CharField(max_length=20)
    color = models.CharField(max_length=20)
    year = models.CharField(max_length=20)
    department = models.ForeignKey(
        Departments, on_delete=models.PROTECT,  null=True)
    image = models.ImageField(null=True, blank=True,
                              default='/placeholder.png', upload_to='images/')

    @property
    def dep_name(self):
        return self.department.name



    def __str__(self):
        return self.model


class CarOrders(models.Model):
    id = models.BigAutoField(primary_key=True) 
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    car = models.ForeignKey(Cars, on_delete=models.CASCADE, null=True)
    orderDate = models.DateTimeField()
    fromDate = models.DateTimeField()
    toDate = models.DateTimeField()
    isAllDay = models.BooleanField()
    destination = models.CharField(max_length=50)

    @property
    def car_name(self):
        return self.car.make + ' ' + self.car.model

    @property
    def user_name(self):
        return self.user.first_name + ' ' + self.user.last_name

    @property
    def car_image(self):
        return self.car.image.url

    def __str__(self):
        # return str(self.orderDate)
        return self.user_name + " : " + self.car_name


class CarMaintenance(models.Model):
    id = models.BigAutoField(primary_key=True)
    car = models.ForeignKey(Cars, on_delete=models.CASCADE, null=True)
    maintenanceDate = models.DateField()
    maintenanceFile = models.FileField(
        upload_to='maintenance/', max_length=200, blank=True)
    testDate = models.DateField()
    testFile = models.FileField(
        upload_to='car_test/', max_length=200, blank=True)
    mekifFile = models.FileField(
        upload_to='mekif/', max_length=200, blank=True)
    hovaFile = models.FileField(upload_to='hova/', max_length=200, blank=True)
    kilometer = models.IntegerField()

    
    @property
    def car_name(self):
        return self.car.make + ' ' + self.car.model


    def __str__(self):
        return str(self.car.model) + " : " + str(self.maintenanceDate)


class MaintenanceTypes(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class Shifts(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    car = models.ForeignKey(Cars, on_delete=models.CASCADE, null=True)
    shiftDate = models.DateField()
    maintenanceType = models.ForeignKey(MaintenanceTypes, on_delete=models.CASCADE, null=True)

    @property
    def car_name(self):
        return self.car.make + ' ' + self.car.model

    @property
    def user_name(self):
        return self.user.first_name + ' ' + self.user.last_name
    
    @property
    def maintenance_name(self):
        return self.maintenanceType.name
    

    def __str__(self):
        return self.user_name + ': ' + self.car_name + ' ' + self.maintenance_name


class Logs(models.Model):
    id = models.BigAutoField(primary_key=True)
    logDate = models.DateTimeField(default=datetime.datetime.now())
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    car = models.ForeignKey(Cars, on_delete=models.CASCADE, null=True)
    action = models.CharField(max_length=50)

    @property
    def car_name(self):
        return self.car.make + ' ' + self.car.model

    @property
    def user_name(self):
        return self.user.first_name + ' ' + self.user.last_name
    

    def __str__(self):
        return str(self.logDate) + ' ' + self.user_name + ' ' + self.car_name


class Drivings(models.Model):
    id = models.BigAutoField(primary_key=True)
    order = models.ForeignKey(CarOrders, on_delete=models.CASCADE, null=True)
    startDate = models.DateField(default=datetime.date.today)
    endDate = models.DateField()
    fromTime = models.TimeField(auto_now=False)
    toTime = models.TimeField(auto_now=False)
    startKilometer = models.IntegerField()
    endKilometer = models.IntegerField()
    comments = models.CharField(max_length=200, blank=True)
    startImg1 = models.ImageField(
        null=True, blank=True, default='/placeholder.png')
    startImg2 = models.ImageField(
        null=True, blank=True, default='/placeholder.png')
    startImg3 = models.ImageField(
        null=True, blank=True, default='/placeholder.png')
    endImg1 = models.ImageField(
        null=True, blank=True, default='/placeholder.png')
    endImg2 = models.ImageField(
        null=True, blank=True, default='/placeholder.png')
    endImg3 = models.ImageField(
        null=True, blank=True, default='/placeholder.png')

    @property
    def car_name(self):
        return self.order.car.make + ' ' + self.order.car.model

    @property
    def user_name(self):
        return self.order.user.first_name + ' ' + self.order.user.last_name
    
    def __str__(self):
        return self.user_name + " - " + self.car_name


class Roles(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name
