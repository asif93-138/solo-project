from genres.models import Genre
from genres.serializers import GenreSerializer
from rest_framework.views import APIView
from rest_framework.response import Response

class GenreView(APIView):
    def get(self, request):
        try:
            genres = Genre.objects.all()
            serializer = GenreSerializer(genres, many=True)
            return Response(serializer.data, status=200)
        except Exception as error:
            return Response({"error": str(error)}, status=500)

    def post(self, request):
        try:
            serializer = GenreSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=201)
        except Exception as error:
            return Response({"error": str(error)}, status=500)

