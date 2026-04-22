from rest_framework import serializers
from .models import Job, User, Company, JobApplication


class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = '__all__'


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = "__all__"


class JobApplicationSerializer(serializers.ModelSerializer):
    job = JobSerializer(read_only=True)

    class Meta:
        model = JobApplication
        fields = ["id", "job", "status", "created_at"]


class UserSerializer(serializers.ModelSerializer):
    saved_jobs = JobSerializer(many=True)
    applications = JobApplicationSerializer(many=True)

    class Meta:
        model = User
        fields = ["id", "name", "last_name", "email", "saved_jobs", "applications", "resume"]
