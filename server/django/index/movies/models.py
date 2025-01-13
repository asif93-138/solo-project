from django.db import models
from genres.models import Genre

class Movie(models.Model):
    movie_id = models.BigAutoField(primary_key=True)  
    user_id = models.IntegerField()  
    title = models.CharField(max_length=50, unique=True)  
    img = models.TextField(blank=True, null=True) 
    desc = models.TextField(blank=True, null=True)  
    release_yr = models.PositiveSmallIntegerField() 
    director = models.CharField(max_length=50, blank=True, null=True)  
    length = models.PositiveSmallIntegerField(blank=True, null=True)  
    producer = models.CharField(max_length=50, blank=True, null=True) 

    genres = models.ManyToManyField(
        Genre,
        related_name="movies",
        db_table="movie_genre"  
    )

    class Meta:
        db_table = "movies"  
        managed = False 

    def __str__(self):
        return f"Movie {self.title} added"
    
