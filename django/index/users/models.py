from django.db import models
    
class User(models.Model):
    user_id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=50)  
    email = models.EmailField(unique=True, max_length=50)  
    password = models.CharField(max_length=50) 

    class Meta:
        db_table = 'users'
        managed = False

    def __str__(self):
        return f"User {self.user_id} has been registered"
    


    
    
