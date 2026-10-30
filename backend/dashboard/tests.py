
from datetime import timedelta

from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from leads.models import Lead
from activities.models import Activity

User = get_user_model()


class DashboardAPITests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username="himanshu",
            email="himanshu@example.com",
            password="StrongPass123!",
        )

        self.client.force_authenticate(user=self.user)

        self.dashboard_url = "/api/v1/dashboard/summary/"

        self.new_lead = Lead.objects.create(
            name="New Client",
            email="new@example.com",
            stage=Lead.Stage.NEW,
            created_by=self.user,
        )

        self.won_lead = Lead.objects.create(
            name="Won Client",
            email="won@example.com",
            stage=Lead.Stage.WON,
            created_by=self.user,
        )

        self.lost_lead = Lead.objects.create(
            name="Lost Client",
            email="lost@example.com",
            stage=Lead.Stage.LOST,
            created_by=self.user,
        )

    def test_dashboard_returns_correct_lead_counts(self):
        response = self.client.get(self.dashboard_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = response.data["data"]

        self.assertEqual(data["total_leads"], 3)
        self.assertEqual(data["active_leads"], 1)
        self.assertEqual(data["won_leads"], 1)
        self.assertEqual(data["lost_leads"], 1)

    def test_dashboard_returns_correct_followup_counts(self):
        now = timezone.now()

        # Pending aur overdue follow-up
        Activity.objects.create(
            lead=self.new_lead,
            title="Overdue call",
            activity_type=Activity.ActivityType.CALL,
            due_at=now - timedelta(days=1),
            status=Activity.Status.PENDING,
        )

        # Future pending follow-up
        Activity.objects.create(
            lead=self.new_lead,
            title="Upcoming meeting",
            activity_type=Activity.ActivityType.MEETING,
            due_at=now + timedelta(days=1),
            status=Activity.Status.PENDING,
        )

        
        Activity.objects.create(
            lead=self.new_lead,
            title="Completed task",
            activity_type=Activity.ActivityType.TASK,
            due_at=now - timedelta(days=2),
            status=Activity.Status.COMPLETED,
            completed_at=now - timedelta(days=1),
        )

        response = self.client.get(self.dashboard_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = response.data["data"]

        self.assertEqual(data["pending_followups"], 2)
        self.assertEqual(data["overdue_followups"], 1)

    def test_unauthenticated_user_cannot_access_dashboard(self):
        self.client.force_authenticate(user=None)

        response = self.client.get(self.dashboard_url)

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )
