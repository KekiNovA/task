from rest_framework import viewsets
from .models import Task
from .serializers import TaskSerializer
from rest_framework.response import Response
import rest_framework.status as status
from rest_framework.permissions import IsAuthenticated


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.select_related(
        'created_by')
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            return self.queryset.filter(created_by=user).order_by('-created_at')
        return Task.objects.none()

    def list(self, request):
        return super().list(request)

    def retrieve(self, request, *args, **kwargs):
        pk = self.kwargs.get('pk')
        try:
            instance = Task.objects.get(id=pk)
            serializer = self.get_serializer(instance)
            return Response(serializer.data)
        except Task.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def update(self, request, *args, **kwargs):
        partial = True
        instance = self.get_object()
        serializer = self.get_serializer(
            instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def create(self, request):
        data = request.data.copy()
        data['created_by'] = request.user.id
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)  # Validate data
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
