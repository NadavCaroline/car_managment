# Generated by Django 4.1.5 on 2023-03-02 13:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cars', '0053_rename_user_carorders_profile'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='carorders',
            name='car',
        ),
        migrations.RemoveField(
            model_name='profile',
            name='cars',
        ),
        migrations.AddField(
            model_name='carorders',
            name='cars_relation',
            field=models.ManyToManyField(to='cars.cars'),
        ),
    ]
