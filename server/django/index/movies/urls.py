from django.urls import path
from movies.views import MovieView, MovieUserView

urlpatterns = [
    path('', MovieView.as_view(), name='movie'),
    path('<int:id>', MovieView.as_view(), name='movie'),
    path('user/<int:user_id>', MovieUserView.as_view(), name='movie'),  
]
