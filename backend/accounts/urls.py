from django.urls import path
from .views import RegisterView, LoginView, MeView, LogoutView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView


urlpatterns = [
    path("register", RegisterView.as_view(), name="register"),
    path("login", LoginView.as_view(), name="login"),
    path("me", MeView.as_view(), name="me"),
    path("logout", LogoutView.as_view(), name="logout"),
]