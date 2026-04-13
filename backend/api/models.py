from django.db import models

class Job(models.Model):

    EMPLOYMENT_TYPE_CHOICES = [
        ("full-time", "Full-time"),
        ("part-time", "Part-time"),
        ("internship", "Internship"),
    ]

    WORK_MODE_CHOICES = [
        ("onsite", "Onsite"),
        ("remote", "Remote"),
        ("hybrid", "Hybrid"),
        ("online", "Online"),
    ]

    title = models.CharField(max_length=255)
    company_name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    salary = models.CharField(max_length=100)
    requirements = models.TextField()
    about_company = models.TextField()

    # OLD FIELD (you can keep or remove later)
    job_type = models.CharField(max_length=50)

    # NEW FIELDS
    employment_type = models.CharField(
        max_length=20,
        choices=EMPLOYMENT_TYPE_CHOICES,
        default="full-time"
    )

    work_mode = models.CharField(
        max_length=20,
        choices=WORK_MODE_CHOICES,
        default="onsite"
    )

    benefit = models.CharField(max_length=255)
    description = models.TextField()
    job_url = models.URLField(max_length=1000, blank=True, null=True)

    def __str__(self):
        return self.title
