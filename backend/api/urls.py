from django.urls import path
from .views import JobList
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import HealthCheckView
from .views import login_view
urlpatterns = [
    path('jobs/', JobList.as_view(), name='job-list'),
    path('health/', HealthCheckView.as_view(), name='health-check'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path("login/", login_view),
]