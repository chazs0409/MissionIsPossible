from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import generics
from .models import Job
from .serializers import JobSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from django.contrib.auth.hashers import make_password
from .models import User
from rest_framework.permissions import AllowAny
# from django.contrib.auth import get_user_model
from django.shortcuts import redirect
from django.contrib.auth import authenticate

from rest_framework_simplejwt.tokens import RefreshToken
from api.models import User
from .models import Company
from .serializers import CompanySerializer

from rest_framework.permissions import IsAuthenticated



@api_view(['POST'])
def login_view(request):
    email = request.data.get("email")
    password = request.data.get("password")

    if not email or not password:
        return Response({"error": "Email and password are required"}, status=400)

    # Проверяем пользователя
    user = authenticate(request, email=email, password=password)

    if user is None:
        return Response({"error": "Invalid email or password"}, status=401)

    # Генерируем JWT токены
    refresh = RefreshToken.for_user(user)

    return Response({
        "message": "Login successful",
        "access": str(refresh.access_token),
        "refresh": str(refresh),
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "last_name": user.last_name,
            "role": user.role,
            "admin_id": user.admin_id,
        }
    })

def admin_required(view_func):
    def wrapper(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return redirect('/login/')
        if request.user.role != 'admin':
            return redirect('/no-access/')
        return view_func(request, *args, **kwargs)
    return wrapper
class JobList(generics.ListCreateAPIView):
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
@permission_classes([AllowAny])
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
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    email = request.data.get("email")
    password = request.data.get("password")

    user = authenticate(request, email=email, password=password)

    if user is None:
        return Response({"error": "Invalid email or password"}, status=401)

    refresh = RefreshToken.for_user(user)

    return Response({
        "message": "Login successful",
        "access": str(refresh.access_token),
        "refresh": str(refresh),
        "user": {
            "id": user.id,
            "email": user.email,
            "role": user.role,
        }
    })

@api_view(["GET", "POST"])
def companies_list(request):
    if request.method == "GET":
        companies = Company.objects.all()
        serializer = CompanySerializer(companies, many=True)
        return Response(serializer.data)

    if request.method == "POST":
        serializer = CompanySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def save_job(request, job_id):
    user = request.user
    try:
        job = Job.objects.get(id=job_id)
        user.saved_jobs.add(job)
        return Response({"message": "Job saved successfully"})
    except Job.DoesNotExist:
        return Response({"error": "Job not found"}, status=404)