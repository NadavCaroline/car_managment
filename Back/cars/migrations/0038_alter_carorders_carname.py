# Generated by Django 4.1.5 on 2023-03-01 08:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cars', '0037_carorders_carname'),
    ]

    operations = [
        migrations.AlterField(
            model_name='carorders',
            name='carName',
            field=models.CharField(blank=True, max_length=50),
        ),
    ]
