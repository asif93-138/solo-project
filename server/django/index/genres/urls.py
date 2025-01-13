from django.urls import path
from genres.views import GenreView

urlpatterns = [
    path('', GenreView.as_view(), name='genre'), 
]