from django.db import models

class Review(models.Model):
    rr_id = models.BigAutoField(primary_key=True)  
    movie_id = models.IntegerField()  
    user_id = models.IntegerField()  
    rating = models.FloatField()  
    review = models.TextField(blank=True, null=True)

    class Meta:
        managed = False  
        db_table = 'ratings_reviews'  

    def __str__(self):
        return f"Review by User {self.user_id} for Movie {self.movie_id}"
