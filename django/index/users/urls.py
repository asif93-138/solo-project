from django.urls import path
from users.views import Signup, Login

urlpatterns = [
    path('signup', Signup.as_view(), name='signup'),
    path('', Login.as_view(), name='login'),
]