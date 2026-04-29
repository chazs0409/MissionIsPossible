from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate
from django.core.mail import send_mail
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Job, User, Company, JobApplication, Resume
from .serializers import JobSerializer, CompanySerializer, UserSerializer, JobApplicationSerializer, ResumeSerializer


class JobList(generics.ListCreateAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [AllowAny]


class HealthCheckView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({'status': 'healthy', 'message': 'Django REST API is running!'}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    name = request.data.get("name")
    last_name = request.data.get("last_name")
    email = request.data.get("email")
    password = request.data.get("password")

    if User.objects.filter(email=email).exists():
        return Response({"error": "Email already exists"}, status=status.HTTP_400_BAD_REQUEST)

    User.objects.create(name=name, last_name=last_name, email=email, password=make_password(password))
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
            "name": user.name,
            "last_name": user.last_name,
            "role": user.role,
            "admin_id": user.admin_id,
        }
    })


@api_view(["GET", "POST"])
def companies_list(request):
    if request.method == "GET":
        companies = Company.objects.all()
        return Response(CompanySerializer(companies, many=True).data)
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
        try:
            send_mail(
                subject=f"Job Saved: {job.title}",
                message=(
                    f"Hi {user.name},\n\n"
                    f"You saved \"{job.title}\" at {job.company_name} ({job.location}).\n\n"
                    f"Log in to SquareOne to view your saved jobs and apply.\n\n"
                    f"— The SquareOne Team"
                ),
                from_email=None,
                recipient_list=[user.email],
                fail_silently=False,
            )
        except Exception:
            pass
        return Response({"message": "Job saved successfully"})
    except Job.DoesNotExist:
        return Response({"error": "Job not found"}, status=404)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def unsave_job(request, job_id):
    user = request.user
    try:
        job = Job.objects.get(id=job_id)
        user.saved_jobs.remove(job)
        return Response({"message": "Job removed from saved"})
    except Job.DoesNotExist:
        return Response({"error": "Job not found"}, status=404)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def apply_job(request, job_id):
    user = request.user
    resume_id = request.data.get("resume_id")
    try:
        job = Job.objects.get(id=job_id)
        resume = None
        if resume_id:
            try:
                resume = Resume.objects.get(id=resume_id, user=user)
            except Resume.DoesNotExist:
                pass
        application, created = JobApplication.objects.get_or_create(
            user=user,
            job=job,
            defaults={"resume": resume},
        )
        if created:
            try:
                send_mail(
                    subject=f"Application Tracked: {job.title}",
                    message=(
                        f"Hi {user.name},\n\n"
                        f"You marked \"{job.title}\" at {job.company_name} ({job.location}) as applied.\n\n"
                        f"We'll keep it in your Applied tab so you can track your progress.\n\n"
                        f"— The SquareOne Team"
                    ),
                    from_email=None,
                    recipient_list=[user.email],
                    fail_silently=False,
                )
            except Exception:
                pass
        return Response({"message": "Job marked as applied", "status": application.status})
    except Job.DoesNotExist:
        return Response({"error": "Job not found"}, status=404)


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def update_application_status(request, job_id):
    user = request.user
    new_status = request.data.get("status")
    valid = [s[0] for s in JobApplication.STATUS_CHOICES]
    if new_status not in valid:
        return Response({"error": f"Invalid status. Choose from: {valid}"}, status=400)
    try:
        application = JobApplication.objects.get(user=user, job_id=job_id)
        application.status = new_status
        application.save()
        return Response({"message": "Status updated", "status": application.status})
    except JobApplication.DoesNotExist:
        return Response({"error": "Application not found"}, status=404)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def upload_resume(request):
    """Legacy single-resume upload — kept for backwards compatibility."""
    user = request.user
    if "resume" not in request.FILES:
        return Response({"error": "No file uploaded"}, status=400)

    user.resume = request.FILES["resume"]
    user.save()
    try:
        send_mail(
            subject="Resume Uploaded Successfully",
            message=(
                f"Hi {user.name},\n\n"
                f"Your resume has been uploaded successfully to your SquareOne profile.\n\n"
                f"— The SquareOne Team"
            ),
            from_email=None,
            recipient_list=[user.email],
            fail_silently=False,
        )
    except Exception:
        pass
    return Response({"message": "Resume uploaded successfully"})


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def resume_list(request):
    user = request.user
    if request.method == "GET":
        resumes = Resume.objects.filter(user=user).order_by("-uploaded_at")
        return Response(ResumeSerializer(resumes, many=True).data)

    name = request.data.get("name", "").strip() or "Resume"
    file = request.FILES.get("file")
    if not file:
        return Response({"error": "No file uploaded"}, status=400)

    resume = Resume.objects.create(user=user, name=name, file=file)
    try:
        send_mail(
            subject=f"Resume Uploaded: {name}",
            message=(
                f"Hi {user.name},\n\n"
                f"Your resume \"{name}\" has been uploaded to SquareOne.\n\n"
                f"You can now select it when applying to jobs.\n\n"
                f"— The SquareOne Team"
            ),
            from_email=None,
            recipient_list=[user.email],
            fail_silently=False,
        )
    except Exception:
        pass
    return Response(ResumeSerializer(resume).data, status=201)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_resume(request, resume_id):
    try:
        resume = Resume.objects.get(id=resume_id, user=request.user)
        resume.file.delete(save=False)
        resume.delete()
        return Response({"message": "Resume deleted"})
    except Resume.DoesNotExist:
        return Response({"error": "Resume not found"}, status=404)
