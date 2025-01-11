from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from movies.models import User
from movies.serializers import UserSerializer

class SignupUserView(APIView):
    def post(self, request):
        permission_classes = [AllowAny]

        if request.method == 'POST':
            name = request.data.get('name')
            email = request.data.get('email')
            password = request.data.get('password')
            
            if len(password) < 8:
                return Response({"error": "Password must be at least 8 characters long."}, status=400)

            # Check if email already exists
            if User.objects.filter(email=email).exists():
                return Response({"error": "Email is already in use."}, status=400)

            # Create new user
            user = User.objects.create_user(name=name, email=email, password=password)

            # Serialize the user instance
            serializer = UserSerializer(user)

             # Return the serialized data as a response
            return Response(serializer.data, status=status.HTTP_201_CREATED)
