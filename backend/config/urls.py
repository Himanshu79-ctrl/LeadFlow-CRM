from django.contrib import admin
from django.urls import path, include
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView


class HealthView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({
            "success": True,
            "message": "API is healthy.",
            "data": {"status": "ok"},
        })


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/health/", HealthView.as_view(), name="health"),
    path("api/v1/auth/", include("accounts.urls")),
    path("api/v1/leads/", include("leads.urls")),
    path("api/v1/activities/", include("activities.urls")),
    path("api/v1/dashboard/", include("dashboard.urls")),
]