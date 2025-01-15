from users.models import User
from movies.models import Movie
from genres.models import Genre
from reviews.models import Review
from movies.helpers import MovieHelper
from movies.decorators import handle_errors
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.db import transaction, IntegrityError
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import NotFound, ValidationError

class MovieView(APIView):
    @handle_errors
    def get(self, request, id=None):
        if id:
            return self.get_movie_by_id(request, id)
        return self.get_all_movies(request)

    @handle_errors
    def get_movie_by_id(self, request, id):
        with transaction.atomic():
            movie = get_object_or_404(Movie, pk=id)
            reviews = Review.objects.filter(movie_id=movie.movie_id)
            movie_data = MovieHelper.build_movie_data(movie, reviews)
            return Response(movie_data, status=200)

    @handle_errors
    def get_all_movies(self, request):
        with transaction.atomic():
            title = request.query_params.get("title", None)
            genre = request.query_params.get("genre", None)

            filters = Q()
            if title:
                filters &= Q(title__icontains=title)
            if genre:
                filters &= Q(genres__genre__iexact=genre)

            movies = Movie.objects.filter(filters).order_by("-movie_id")

            if not movies.exists():
                return Response({"message": "No movies found"}, status=200)

            movie_list = []
            for movie in movies:
                reviews = Review.objects.filter(movie_id=movie.movie_id)
                movie_data = MovieHelper.build_movie_data(movie, reviews)
                movie_list.append(movie_data)

            return Response(movie_list, status=200)

    @handle_errors
    def post(self, request):
        data = request.data
        required_fields = [
            "user_id", "title", "img", "desc", "release_yr",
            "director", "length", "producer", "genre"
        ]
        unpacked_data = {field: data.get(field) for field in required_fields}
        genres = unpacked_data.pop("genre", [])

        with transaction.atomic():
            movie = Movie.objects.create(**unpacked_data)
            if not movie.movie_id:
                raise ValidationError("Movie ID is null after creation")
            
            movie.genres.add(*[Genre.objects.get_or_create(genre=g)[0] for g in genres])
            return Response({"message": "Movie created successfully", "movie": movie.movie_id}, status=201)

    @handle_errors
    def put(self, request, id):
        with transaction.atomic():
            movie = get_object_or_404(Movie, pk=id)
            updated_data = request.data

            for field, value in updated_data.items():
                setattr(movie, field, value)

            movie.save()

            genres = updated_data.get("genre", [])
            if genres:
                genre_instances = [Genre.objects.get_or_create(genre=g)[0] for g in genres]
                movie.genres.set(genre_instances)

            return Response({"message": "Movie updated successfully", "movie": movie.movie_id}, status=200)

    @handle_errors
    def delete(self, request, id):
        with transaction.atomic():
            movie = Movie.objects.filter(movie_id=id)
            if not movie.exists():
                raise NotFound("Movie not found")

            Review.objects.filter(movie_id=id).delete()
            movie.first().genres.clear()
            movie.delete()

            return Response({"deleted": True}, status=200)


class MovieUserView(APIView):
    @handle_errors
    def get(self, request, user_id):
        with transaction.atomic():
            movies = Movie.objects.filter(user_id=user_id)
            user = get_object_or_404(User, pk=user_id)
            movie_list = [
                MovieHelper.build_movie_data(movie, Review.objects.filter(movie_id=movie.movie_id))
                for movie in movies
            ]
            return Response(movie_list, status=200)
