from users.models import User

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
