# from django.db import models
  
# # Custom user manager for handling user creation
# class UserManager(models.Manager):
#     def create_user(self, email, name, password=None):
#         if not email:
#             raise ValueError("The Email field must be set")
#         user = self.model(email=email, name=name, password=password)
#         user.save(using=self._db)
#         return user

# # Custom user model
# class User(models.Model):
#     user_id = models.BigAutoField(primary_key=True)
#     name = models.CharField(max_length=50)  
#     email = models.EmailField(unique=True, max_length=50)  
#     password = models.CharField(max_length=50) 

#     objects = UserManager()

#     class Meta:
#         managed = False  # Don't let Django manage the database schema
#         db_table = 'users'

#     def __str__(self):
#         return self.email
    


    
    
