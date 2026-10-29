from django.utils import timezone
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from leads.models import Lead
from activities.models import Activity


class DashboardSummaryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user

        # Sirf logged-in user ke leads
        leads = Lead.objects.filter(created_by=user)

        total_leads = leads.count()

        active_leads = leads.exclude(
            stage__in=[Lead.Stage.WON, Lead.Stage.LOST]
        ).count()

        won_leads = leads.filter(
            stage=Lead.Stage.WON
        ).count()

        lost_leads = leads.filter(
            stage=Lead.Stage.LOST
        ).count()

        # Sirf logged-in user ki activities
        activities = Activity.objects.filter(
            lead__created_by=user
        )

        pending_followups = activities.filter(
            status=Activity.Status.PENDING
        ).count()

        overdue_followups = activities.filter(
            status=Activity.Status.PENDING,
            due_at__lt=timezone.now()
        ).count()

        return Response({
            "success": True,
            "message": "Dashboard summary fetched successfully.",
            "data": {
                "total_leads": total_leads,
                "active_leads": active_leads,
                "won_leads": won_leads,
                "lost_leads": lost_leads,
                "pending_followups": pending_followups,
                "overdue_followups": overdue_followups,
            }
        })