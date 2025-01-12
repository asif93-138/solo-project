from django.urls import path
from .views import GenreView

urlpatterns = [
    path('', GenreView.as_view(), name='genre'), 
]