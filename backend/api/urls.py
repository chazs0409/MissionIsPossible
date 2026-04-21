from django.urls import path
from django.conf.urls.static import static
from config import settings
from .views import JobList, get_user_profile, save_job, upload_resume
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import HealthCheckView
from .views import login_view
from .views import companies_list
urlpatterns = [
    path('jobs/', JobList.as_view(), name='job-list'),
    path('health/', HealthCheckView.as_view(), name='health-check'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path("login/", login_view),
    path("companies/", companies_list),
    path("save-job/<int:job_id>/", save_job),
    path("profile/", get_user_profile),
    path("upload-resume/", upload_resume),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)