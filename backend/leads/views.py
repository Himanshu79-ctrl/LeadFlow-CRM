
from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied
from .models import Lead
from .serializers import LeadSerializer


class LeadListCreateView(generics.ListCreateAPIView):
    serializer_class = LeadSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Lead.objects.filter(
            created_by=self.request.user
        )

        search = self.request.query_params.get("search")
        stage = self.request.query_params.get("stage")

        if search:
            from django.db.models import Q

            queryset = queryset.filter(
                Q(name__icontains=search)
                | Q(company__icontains=search)
            )

        if stage:
            queryset = queryset.filter(stage=stage)

        return queryset.order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class LeadDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = LeadSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Lead.objects.filter(
            created_by=self.request.user
        )
