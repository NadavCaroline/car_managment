# Generated by Django 4.1.5 on 2023-04-02 09:33

import datetime
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('cars', '0077_carorders_ended_alter_logs_logdate'),
    ]

    operations = [
        migrations.AlterField(
            model_name='logs',
            name='logDate',
            field=models.DateTimeField(default=datetime.datetime(2023, 4, 2, 12, 33, 6, 970945)),
        ),
        migrations.AlterField(
            model_name='profile',
            name='roleLevel',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, to='cars.roles'),
        ),
    ]
