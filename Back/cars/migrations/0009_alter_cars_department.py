# Generated by Django 4.1.5 on 2023-02-26 09:08

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('cars', '0008_alter_cars_department'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cars',
            name='department',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.PROTECT, to='cars.departments'),
        ),
    ]
