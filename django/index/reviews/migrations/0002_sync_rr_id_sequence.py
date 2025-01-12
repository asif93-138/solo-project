from django.db import migrations
from django.db import connection

def sync_rr_id_sequence(apps, schema_editor):
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT setval('ratings_reviews_rr_id_seq', (SELECT MAX(rr_id) + 1 FROM ratings_reviews));
        """)

class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'), 
    ]

    operations = [
        migrations.RunPython(sync_rr_id_sequence),
    ]
