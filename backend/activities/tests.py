from datetime import timedelta

from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from leads.models import Lead
from .models import Activity

User = get_user_model()


class ActivityAPITests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username="himanshu",
            email="himanshu@example.com",
            password="StrongPass123!",
        )

        self.other_user = User.objects.create_user(
            username="otheruser",
            email="other@example.com",
            password="StrongPass123!",
        )

        self.client.force_authenticate(user=self.user)

        self.lead = Lead.objects.create(
            name="Test Client",
            email="client@example.com",
            created_by=self.user,
        )

        self.activities_url = "/api/v1/activities/"

    def test_user_can_create_followup(self):
        data = {
            "lead": self.lead.id,
            "title": "Call the client",
            "activity_type": "Call",
            "due_at": (timezone.now() + timedelta(days=1)).isoformat(),
        }

        response = self.client.post(
            self.activities_url,
            data,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Activity.objects.count(), 1)

    def test_user_can_list_followups(self):
        Activity.objects.create(
            lead=self.lead,
            title="Send proposal",
            activity_type="Email",
            due_at=timezone.now() + timedelta(days=1),
        )

        response = self.client.get(self.activities_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_user_cannot_add_followup_to_another_users_lead(self):
        other_lead = Lead.objects.create(
            name="Private Client",
            email="private@example.com",
            created_by=self.other_user,
        )

        data = {
            "lead": other_lead.id,
            "title": "Unauthorized follow-up",
            "activity_type": "Call",
            "due_at": (timezone.now() + timedelta(days=1)).isoformat(),
        }

        response = self.client.post(
            self.activities_url,
            data,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Activity.objects.count(), 0)

    def test_user_can_complete_followup(self):
        activity = Activity.objects.create(
            lead=self.lead,
            title="Call the client",
            activity_type="Call",
            due_at=timezone.now() + timedelta(days=1),
        )

        response = self.client.patch(
            f"{self.activities_url}{activity.id}/complete",
            {},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        activity.refresh_from_db()
        self.assertEqual(activity.status, Activity.Status.COMPLETED)
        self.assertIsNotNone(activity.completed_at)

    def test_user_cannot_complete_another_users_followup(self):
        other_lead = Lead.objects.create(
            name="Private Client",
            email="private@example.com",
            created_by=self.other_user,
        )

        activity = Activity.objects.create(
            lead=other_lead,
            title="Private follow-up",
            activity_type="Call",
            due_at=timezone.now() + timedelta(days=1),
        )

        response = self.client.patch(
            f"{self.activities_url}{activity.id}/complete",
            {},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
