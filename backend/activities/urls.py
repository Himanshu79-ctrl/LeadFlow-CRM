from django.urls import path
from .views import ActivityListCreateView, CompleteActivityView

urlpatterns = [
    path("", ActivityListCreateView.as_view(), name="activity-list-create"),
    path(
        "<int:pk>/complete",
        CompleteActivityView.as_view(),
        name="activity-complete",
    ),
]