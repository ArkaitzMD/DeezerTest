# Generated by Django 5.1.4 on 2024-12-18 17:35

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0003_alter_artist_id_alter_artist_name_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='song',
            old_name='artist_id',
            new_name='artist',
        ),
    ]
