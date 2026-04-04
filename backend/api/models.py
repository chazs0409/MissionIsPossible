from django.db import models

class Job(models.Model):
    title = models.CharField(max_length=255)
    company_name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    salary = models.CharField(max_length=100)
    requirements = models.TextField()
    about_company = models.TextField()
    job_type = models.CharField(max_length=50)
    benefit = models.CharField(max_length=255)
    description = models.TextField()
    job_url = models.URLField(max_length=1000, blank=True, null=True)

    def __str__(self):
        return self.title