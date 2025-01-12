# from rest_framework.permissions import AllowAny
# from rest_framework.response import Response
# from rest_framework.views import APIView
# from rest_framework import status
# from movies.models import User
# from movies.serializers import UserSerializer

# class Signup(APIView):
#     def post(self, request): 
#         name = request.data.get('name')
#         email = request.data.get('email')
#         password = request.data.get('password')
            
#         if User.objects.filter(email=email).exists():
#             return Response({"error": "Email is already in use."}, status=400)

#         try:
#             user = User.objects.create_user(name=name, email=email, password=password)
#             serializer = UserSerializer(user)
#             return Response(serializer.data, status=201)
#         except Exception as error:
#             return Response({"error": str(error)}, status=500)

        
# class Login(APIView):
#     def post(self, request):
#         # if request.method == 'POST':
#             email = request.data.get('email')

#             try:
#                 user = User.objects.get(email=email)
#                 if user:
#                     serializer = UserSerializer(user)
#                     return Response(serializer.data, status=200)
#                 return Response({"error": "User not found."}, status=404)
#             except User.DoesNotExist:
#                 return Response({"error": "Failed to fetch user."}, status=500)
