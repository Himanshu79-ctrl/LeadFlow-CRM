from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Activity
from .serializers import ActivitySerializer


class ActivityListCreateView(generics.ListCreateAPIView):
    serializer_class = ActivitySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Activity.objects.filter(
            lead__created_by=self.request.user
        ).select_related("lead")

        lead_id = self.request.query_params.get("lead")
        activity_status = self.request.query_params.get("status")

        if lead_id:
            queryset = queryset.filter(lead_id=lead_id)

        if activity_status:
            queryset = queryset.filter(status=activity_status)

        return queryset.order_by("due_at")


class CompleteActivityView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        try:
            activity = Activity.objects.get(
                pk=pk,
                lead__created_by=request.user,
            )
        except Activity.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": "Activity not found.",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        if activity.status == Activity.Status.COMPLETED:
            return Response({
                "success": True,
                "message": "Activity is already completed.",
                "data": ActivitySerializer(
                    activity,
                    context={"request": request},
                ).data,
            })

        activity.status = Activity.Status.COMPLETED
        activity.completed_at = timezone.now()
        activity.save(update_fields=["status", "completed_at"])

        return Response({
            "success": True,
            "message": "Activity completed successfully.",
            "data": ActivitySerializer(
                activity,
                context={"request": request},
            ).data,
        })