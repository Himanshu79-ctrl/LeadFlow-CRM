from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

User = get_user_model()


class AuthenticationAPITests(APITestCase):

    def setUp(self):
        self.register_url = "/api/v1/auth/register"
        self.login_url = "/api/v1/auth/login"

        self.user_data = {
            "name": "Himanshu",
            "email": "himanshu@example.com",
            "password": "StrongPass123!",
            "confirm_password": "StrongPass123!",
        }

    def test_user_can_register(self):
        response = self.client.post(
            self.register_url,
            self.user_data,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(
            User.objects.filter(email="himanshu@example.com").exists()
        )
        self.assertNotIn("password", response.data["data"])

    def test_duplicate_email_is_rejected(self):
        self.client.post(
            self.register_url,
            self.user_data,
            format="json",
        )

        response = self.client.post(
            self.register_url,
            self.user_data,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_password_mismatch_is_rejected(self):
        data = self.user_data.copy()
        data["confirm_password"] = "DifferentPass123!"

        response = self.client.post(
            self.register_url,
            data,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_can_login(self):
        User.objects.create_user(
            username="himanshu@example.com",
            email="himanshu@example.com",
            password="StrongPass123!",
            first_name="Himanshu",
        )

        response = self.client.post(
            self.login_url,
            {
                "email": "himanshu@example.com",
                "password": "StrongPass123!",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data["data"])
        self.assertIn("refresh", response.data["data"])

    def test_wrong_password_is_rejected(self):
        User.objects.create_user(
            username="himanshu@example.com",
            email="himanshu@example.com",
            password="StrongPass123!",
        )

        response = self.client.post(
            self.login_url,
            {
                "email": "himanshu@example.com",
                "password": "WrongPassword123!",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
