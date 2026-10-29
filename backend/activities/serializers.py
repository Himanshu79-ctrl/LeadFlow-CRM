from django.utils import timezone
from rest_framework import serializers
from leads.models import Lead
from .models import Activity


class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = [
            "id",
            "lead",
            "title",
            "activity_type",
            "due_at",
            "status",
            "completed_at",
            "created_at",
        ]
        read_only_fields = ["id", "status", "completed_at", "created_at"]

    def validate_lead(self, value):
        request = self.context.get("request")

        if request and value.created_by_id != request.user.id:
            raise serializers.ValidationError(
                "You can only add activities to your own leads."
            )

        return value

    def validate_due_at(self, value):
        if value < timezone.now():
            raise serializers.ValidationError(
                "Due date must be in the future."
            )

        return value