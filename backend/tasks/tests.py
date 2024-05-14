from django.urls import reverse

from rest_framework import status
from rest_framework.test import APITestCase

from .models import Task
from .serializers import TaskSerializer
from django.contrib.auth import get_user_model

User = get_user_model()


class TaskViewSetTests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser', password='password123')
        response = self.client.post(
            "/login", data={'username': 'testuser', 'password': 'password123'}, format="json")
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Token {response.data['token']}")
        self.task_data = {'title': 'Test Task',
                          'description': 'This is a test task'}

    def test_list(self):
        """Test listing tasks with authentication returns user's tasks."""
        response = self.client.get(reverse('task-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)  # No tasks created yet

    def test_create_task(self):
        """Test creating a new task with valid data."""
        response = self.client.post(reverse('task-list'), self.task_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['title'], self.task_data['title'])
        self.assertEqual(response.data['created_by'], self.user.id)

    def test_retrieve_task(self):
        """Test retrieving details of an existing task."""
        task = Task.objects.create(created_by=self.user, **self.task_data)
        url = reverse('task-detail', kwargs={'pk': task.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], self.task_data['title'])

    def test_retrieve_task_not_found(self):
        """Test retrieving details of a non-existent task."""
        url = reverse(
            # Non-existent ID
            'task-detail', kwargs={'pk': 'e24c6f19-b823-4e13-a443-9b95f1ec0f2e'})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_task(self):
        """Test updating an existing task."""
        task = Task.objects.create(created_by=self.user, **self.task_data)
        print(task)
        url = reverse('task-detail', kwargs={'pk': task.pk})
        update_data = {'title': 'Updated Task Title'}
        response = self.client.put(url, update_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], update_data['title'])
