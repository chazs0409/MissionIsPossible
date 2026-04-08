from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework import generics
from .models import Job
from .serializers import JobSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import make_password
from .models import User
class JobList(generics.ListAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [AllowAny] 

class HealthCheckView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        return Response({
            'status': 'healthy',
            'message': 'Django REST API is running!'
        }, status=status.HTTP_200_OK)

@api_view(['POST'])
def register(request):
    name = request.data.get("name")
    last_name = request.data.get("last_name")
    email = request.data.get("email")
    password = request.data.get("password")

    if User.objects.filter(email=email).exists():
        return Response({"error": "Email already exists"}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create(
        name=name,
        last_name=last_name,
        email=email,
        password=make_password(password)
    )

    return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)