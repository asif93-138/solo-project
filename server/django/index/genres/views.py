from genres.models import Genre
from genres.serializers import GenreSerializer
from index.utils import handle_errors
from rest_framework.views import APIView
from rest_framework.response import Response

class GenreView(APIView):
    @handle_errors
    def get(self, request):
        genres = Genre.objects.all()
        serializer = GenreSerializer(genres, many=True)
        return Response(serializer.data, status=200)

    @handle_errors
    def post(self, request):
        serializer = GenreSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)


