
from django.test import TestCase
from unittest.mock import patch
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth.models import User


class SignupViewTest(TestCase):

    def setUp(self):
        self.client = APIClient()

    def test_valid_signup(self):
        data = {
            "username": "test_user",
            "email": "test@example.com",
            "password": "strong_password123",
            "password2": "strong_password123",
        }
        response = self.client.post('/signup', data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('message', response.data)
        self.assertEqual(response.data['message'],
                         'User created successfully.')
        self.assertTrue(User.objects.filter(username="test_user").exists())

    def test_unique_username(self):
        # Create a user first
        User.objects.create_user(
            username="existing_user", email="existing@example.com", password="password")
        data = {
            "username": "existing_user",
            "email": "new_email@example.com",
            "password": "strong_password123",
            "password2": "strong_password123",
        }
        response = self.client.post('/signup', data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('username', response.data)

    def test_empty_fields(self):
        data = {}
        response = self.client.post('/signup', data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('username', response.data)
        self.assertIn('password', response.data)
        self.assertIn('password2', response.data)

    def test_invalid_email(self):
        data = {
            "username": "test_user",
            "email": "invalid_email",
            "password": "strong_password123",
            "password2": "strong_password123",
        }
        response = self.client.post('/signup', data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)


class LoginViewTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="test_user", password="testpassword",
        )

    def test_successful_login(self):
        data = {"username": "test_user", "password": "testpassword"}
        response = self.client.post("/login", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("token", response.data)

    def test_invalid_credentials(self):
        data = {"username": "wrong_user", "password": "wrongpassword"}
        response = self.client.post("/login", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_missing_fields(self):
        data = {"username": "test_user"}  # Missing password
        response = self.client.post("/login", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn("password", response.data["errors"])
