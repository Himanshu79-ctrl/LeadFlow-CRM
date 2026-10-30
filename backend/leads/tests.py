from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Lead

User = get_user_model()


class LeadAPITests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username="himanshu",
            email="himanshu@example.com",
            password="TestPassword123!",
        )

        self.other_user = User.objects.create_user(
            username="otheruser",
            email="other@example.com",
            password="TestPassword123!",
        )

        self.client.force_authenticate(user=self.user)

        self.leads_url = "/api/v1/leads/"

    def valid_lead_data(self):
        return {
            "name": "Test Client",
            "company": "Demo Company",
            "email": "TEST@EXAMPLE.COM",
            "phone": "9876543210",
            "budget": "5000",
            "stage": "New",
        }

    def test_authenticated_user_can_create_lead(self):
        response = self.client.post(
            self.leads_url,
            self.valid_lead_data(),
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Lead.objects.count(), 1)

        lead = Lead.objects.get()
        self.assertEqual(lead.created_by, self.user)
        self.assertEqual(lead.email, "test@example.com")

    def test_negative_budget_is_rejected(self):
        data = self.valid_lead_data()
        data["budget"] = "-5000"

        response = self.client.post(
            self.leads_url,
            data,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("budget", response.data)

    def test_lead_requires_email_or_phone(self):
        data = self.valid_lead_data()
        data["email"] = ""
        data["phone"] = ""

        response = self.client.post(
            self.leads_url,
            data,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("contact", response.data)

    def test_unauthenticated_user_cannot_access_leads(self):
        self.client.force_authenticate(user=None)

        response = self.client.get(self.leads_url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_user_cannot_access_another_users_lead(self):
        other_lead = Lead.objects.create(
            name="Private Client",
            company="Other Company",
            email="private@example.com",
            created_by=self.other_user,
        )

        response = self.client.get(
            f"{self.leads_url}{other_lead.id}"
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)