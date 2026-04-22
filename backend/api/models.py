import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser


class Job(models.Model):
    title = models.CharField(max_length=255)
    company_name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    salary = models.CharField(max_length=100)
    requirements = models.TextField()
    about_company = models.TextField()
    job_type = models.CharField(max_length=50)
    employment_type = models.CharField(
        max_length=20,
        choices=[
            ("full-time", "Full-time"),
            ("part-time", "Part-time"),
            ("internship", "Internship"),
        ],
        default="full-time"
    )
    work_mode = models.CharField(
        max_length=20,
        choices=[
            ("onsite", "Onsite"),
            ("remote", "Remote"),
            ("hybrid", "Hybrid"),
            ("online", "Online"),
        ],
        default="onsite"
    )
    benefit = models.CharField(max_length=255)
    description = models.TextField()
    job_url = models.URLField(max_length=1000, blank=True, null=True)

    def __str__(self):
        return self.title


class User(AbstractUser):
    username = None
    email = models.EmailField(unique=True)
    admin_id = models.CharField(max_length=50, unique=True, null=True, blank=True)
    resume = models.FileField(upload_to="resumes/", blank=True, null=True)
    role = models.CharField(
        max_length=10,
        choices=[('user', 'User'), ('admin', 'Admin')],
        default='user'
    )
    name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    saved_jobs = models.ManyToManyField(Job, blank=True, related_name="saved_by")

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name", "last_name"]

    def save(self, *args, **kwargs):
        if self.role == 'admin' and not self.admin_id:
            self.admin_id = str(uuid.uuid4())
        super().save(*args, **kwargs)

    def __str__(self):
        return self.email


class JobApplication(models.Model):
    STATUS_CHOICES = [
        ('applied', 'Applied'),
        ('interviewing', 'Interviewing'),
        ('offer', 'Offer'),
        ('rejected', 'Rejected'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='applications')
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='applied')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'job')

    def __str__(self):
        return f"{self.user.email} - {self.job.title} ({self.status})"


class Company(models.Model):
    id = models.BigIntegerField(primary_key=True)
    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    website = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name
