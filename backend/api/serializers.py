from rest_framework import serializers
from .models import Job, User
from .models import Company

class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = '__all__'
class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = "__all__"
class UserSerializer(serializers.ModelSerializer):
    saved_jobs = JobSerializer(many=True)

    class Meta:
        model = User
        fields = ["id", "name", "last_name", "email", "saved_jobs", "resume"]