from django.urls import path
from django.conf.urls.static import static
from config import settings
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    JobList, HealthCheckView, login_view, companies_list,
    save_job, unsave_job, apply_job, update_application_status,
    get_user_profile, upload_resume, register,
)

urlpatterns = [
    path('jobs/', JobList.as_view(), name='job-list'),
    path('health/', HealthCheckView.as_view(), name='health-check'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path("register/", register),
    path("login/", login_view),
    path("companies/", companies_list),
    path("save-job/<int:job_id>/", save_job),
    path("unsave-job/<int:job_id>/", unsave_job),
    path("apply-job/<int:job_id>/", apply_job),
    path("application/<int:job_id>/status/", update_application_status),
    path("profile/", get_user_profile),
    path("upload-resume/", upload_resume),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
