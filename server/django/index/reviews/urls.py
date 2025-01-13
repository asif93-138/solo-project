from django.urls import path
from reviews.views import ReviewView

urlpatterns = [
    path('', ReviewView.as_view(), name='reviews'), 
    path('<int:id>', ReviewView.as_view(), name='review'),  
]
