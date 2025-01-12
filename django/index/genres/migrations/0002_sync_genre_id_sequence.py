from django.db import migrations
from django.db import connection

def sync_genre_id_sequence(apps, schema_editor):
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT setval('genre_genre_id_seq', (SELECT MAX(genre_id) + 1 FROM genre));
        """)

class Migration(migrations.Migration):

    dependencies = [
        ('genres', '0001_initial'),  
    ]

    operations = [
        migrations.RunPython(sync_genre_id_sequence), 
    ]
