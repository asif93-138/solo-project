from reviews.models import Review
from reviews.serializers import ReviewSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

class ReviewView(APIView):
    def post(self, request):
        try:
            serializer = ReviewSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=201)
            return Response(serializer.errors, status=400)
        except Exception as error:
            return Response({"error": str(error)}, status=500)

    def put(self, request, id):
        try:
            review = get_object_or_404(Review, pk=id)
            serializer = ReviewSerializer(review, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=200)
            return Response(serializer.errors, status=400)
        except Exception as error:
             return Response({"error": str(error)}, status=500)

    def delete(self, request, id):
        try:
            review = get_object_or_404(Review, pk=id)
            review.delete()
            return Response({"deleted": True}, status=200)
        except Exception as error:
             return Response({"error": str(error)}, status=500)
