from users.models import User
from users.serializers import UserSerializer
from index.utils import handle_errors
from rest_framework.response import Response
from rest_framework.views import APIView

class Signup(APIView):
    @handle_errors
    def post(self, request): 
        email = request.data.get('email')
        if User.objects.filter(email=email).exists():
            return Response({"error": "Email is already in use."}, status=400)

        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)

        
class Login(APIView):
    @handle_errors
    def post(self, request):
        email = request.data.get('email')
        user = User.objects.get(email=email)
        if user:
            serializer = UserSerializer(user)
            return Response(serializer.data, status=200)
        return Response({"error": "User not found."}, status=404)

