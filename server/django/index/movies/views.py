from users.models import User
from movies.models import Movie
from genres.models import Genre
from reviews.models import Review
from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response

class MovieHelper:
    @staticmethod
    def calculate_average_rating(reviews):
        return sum(review.rating for review in reviews) / len(reviews) if reviews else None

    @staticmethod
    def get_genres(movie):
        return [genre.genre for genre in movie.genres.all()]

    @staticmethod
    def get_detailed_reviews(reviews):
        detailed_reviews = []
        for review in reviews:
            user = User.objects.filter(user_id=review.user_id).first()
            detailed_reviews.append({
                "rr_id": review.rr_id,
                "user_id": user.user_id if user else None,
                "user": user.name if user else "Unknown User",
                "review": review.review,
                "rating": review.rating,
            })
        return detailed_reviews

    @staticmethod
    def build_movie_data(movie, reviews):
        user = User.objects.filter(user_id=movie.user_id).first()
        return {
            "movie_id": movie.movie_id,
            "title": movie.title,
            "img": movie.img,
            "desc": movie.desc,
            "release_yr": movie.release_yr,
            "director": movie.director,
            "length": movie.length,
            "producer": movie.producer,
            "rating": MovieHelper.calculate_average_rating(reviews),
            "genres": MovieHelper.get_genres(movie),
            "user": user.name if user else "Unknown User",
            "rr": MovieHelper.get_detailed_reviews(reviews),
        }


class MovieView(APIView):
    def get(self, request, id=None):
        if id:
            return self.get_movie_by_id(request, id)
        return self.get_all_movies(request)

    def get_movie_by_id(self, request, id):
        try:
            movie = get_object_or_404(Movie, pk=id)
            reviews = Review.objects.filter(movie_id=movie.movie_id)
            movie_data = MovieHelper.build_movie_data(movie, reviews)
            return Response(movie_data, status=200)
        except Exception as error:
            return Response({"error": str(error)}, status=500)

    def get_all_movies(self, request):
        try:
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
        except Exception as error:
            return Response({"error": str(error)}, status=500)

class MovieUserView(APIView):
    def get(self, request, user_id):
        try:
            movies = Movie.objects.filter(user_id=user_id)
            user = get_object_or_404(User, pk=user_id)
            movie_list = [
                MovieHelper.build_movie_data(movie, Review.objects.filter(movie_id=movie.movie_id))
                for movie in movies
            ]
            return Response(movie_list, status=200)
        except Exception as error:
            return Response({"error": str(error)}, status=500)
