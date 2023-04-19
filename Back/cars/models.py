import datetime
from django.db import models
from django.contrib.auth.models import User


class Departments(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=30)

    def __str__(self):
        return self.name
    
class Roles(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True)
    realID = models.CharField(max_length=10, blank=True)
    jobTitle = models.CharField(max_length=50, blank=True)
    department = models.ForeignKey(Departments, on_delete=models.PROTECT,  null=True)
    roleLevel = models.ForeignKey(Roles, on_delete=models.PROTECT,  null=True)

    @property
    def user_name(self):
        return self.user.first_name + ' ' + self.user.last_name
    
    @property
    def dep_name(self):
        return self.department.name
    
    @property
    def role_name(self):
        return self.roleLevel.name
    
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
    ended = models.BooleanField()

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
    
class MaintenanceTypes(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=50)
    numofdays=models.IntegerField( default=365)

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

class CarMaintenance(models.Model):
    id = models.BigAutoField(primary_key=True)
    car = models.ForeignKey(Cars, on_delete=models.CASCADE, null=True)
    maintenanceDate = models.DateField()
    file1 = models.FileField(upload_to='maintenance/', max_length=200, blank=True)
    file2 = models.FileField(upload_to='maintenance/', max_length=200, blank=True)
    shift = models.ForeignKey(Shifts, on_delete=models.CASCADE, null=True)
    maintenanceType = models.ForeignKey(MaintenanceTypes, on_delete=models.CASCADE, null=True)
    kilometer = models.IntegerField()
    # maintenanceFile = models.FileField(upload_to='maintenance/', max_length=200, blank=True)
    # testFile = models.FileField(upload_to='car_test/', max_length=200, blank=True)
    # mekifFile = models.FileField( upload_to='mekif/', max_length=200, blank=True)
    # hovaFile = models.FileField(upload_to='hova/', max_length=200, blank=True)

    @property
    def car_name(self):
        return self.car.make + ' ' + self.car.model
    @property
    def nextmainenancedate(self):
        return self.maintenanceDate.date() + datetime.timedelta(days=self.maintenanceType.numofdays)   


    def __str__(self):
        return str(self.car.model) + " : " + str(self.maintenanceDate)



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
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    order = models.ForeignKey(CarOrders, on_delete=models.CASCADE, null=True)
    startDate = models.DateTimeField(null=True)
    endDate = models.DateTimeField(null=True)
    startKilometer = models.IntegerField(null=True)
    endKilometer = models.IntegerField(null=True)
    comments = models.CharField(max_length=200, blank=True)
    startImg1 = models.ImageField( upload_to='images/',
        null=True, blank=True)
    startImg2 = models.ImageField(upload_to='images/',
        null=True, blank=True)
    startImg3 = models.ImageField(upload_to='images/',
        null=True, blank=True)
    endImg1 = models.ImageField(upload_to='images/',
        null=True, blank=True)
    endImg2 = models.ImageField(upload_to='images/',
        null=True, blank=True)
    endImg3 = models.ImageField(upload_to='images/',
        null=True, blank=True)

    @property
    def car_name(self):
        return self.order.car.make + ' ' + self.order.car.model

    @property
    def car_image(self):
        return self.order.car.image.url

    @property
    def user_name(self):
        return self.user.first_name + ' ' + self.user.last_name
    
    @property
    def destination(self):
        return self.order.destination
    
    def __str__(self):
        return self.user_name + " - " + self.car_name


