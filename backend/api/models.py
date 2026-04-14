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

    name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)

    saved_jobs = models.ManyToManyField(Job, blank=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name", "last_name"]

    def __str__(self):
        return self.email
