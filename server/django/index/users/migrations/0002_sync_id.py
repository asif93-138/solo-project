from django.db import migrations
from django.db import connection

def sync_user_id_sequence(apps, schema_editor):
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT setval('users_user_id_seq', (SELECT MAX(user_id) + 1 FROM users));
        """)

class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'), 
    ]

    operations = [
        migrations.RunPython(sync_user_id_sequence),
    ]
