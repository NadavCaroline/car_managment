# Generated by Django 4.1.5 on 2023-03-13 18:12

import datetime
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('cars', '0065_remove_carorders_fromtime_remove_carorders_totime_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='drivings',
            name='car',
        ),
        migrations.RemoveField(
            model_name='drivings',
            name='user',
        ),
        migrations.AddField(
            model_name='drivings',
            name='order',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='cars.carorders'),
        ),
        migrations.AlterField(
            model_name='logs',
            name='logDate',
            field=models.DateTimeField(default=datetime.datetime(2023, 3, 13, 20, 12, 14, 274971)),
        ),
    ]
