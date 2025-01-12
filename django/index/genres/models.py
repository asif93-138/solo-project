from django.db import models

class Genre(models.Model):
    genre_id = models.BigAutoField(primary_key=True)  
    genre = models.CharField(max_length=10, unique=True, null=False) 

    class Meta:
        managed = False
        db_table = 'genre' 
        
    def __str__(self):
        return self.genre 

