from django.db import migrations
from django.db import connection

def sync_movie_id_sequence(apps, schema_editor):
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT setval('movies_movie_id_seq', (SELECT MAX(movie_id) + 1 FROM movies));
        """)

class Migration(migrations.Migration):

    dependencies = [
        ('movies', '0001_initial'), 
    ]

    operations = [
        migrations.RunPython(sync_movie_id_sequence),
    ]


