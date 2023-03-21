from django.contrib import admin
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


# Register your models here.
admin.site.register(Profile)
admin.site.register(Cars)
admin.site.register(CarMaintenance)
admin.site.register(CarOrders)
admin.site.register(Departments)
admin.site.register(Drivings)
admin.site.register(Logs)
admin.site.register(MaintenanceTypes)
admin.site.register(Shifts)
admin.site.register(Roles)
