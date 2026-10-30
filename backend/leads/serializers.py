from rest_framework import serializers
from .models import Lead


class LeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lead
        fields = [
            "id",
            "name",
            "company",
            "email",
            "phone",
            "service_interest",
            "source",
            "budget",
            "stage",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def validate_email(self, value):
        return value.strip().lower()

    def validate_budget(self, value):
        if value is not None and value < 0:
            raise serializers.ValidationError(
                "Budget cannot be negative."
            )
        return value

    def validate(self, attrs):
        name = attrs.get(
            "name",
            getattr(self.instance, "name", "")
        )
        email = attrs.get(
            "email",
            getattr(self.instance, "email", "")
        )
        phone = attrs.get(
            "phone",
            getattr(self.instance, "phone", "")
        )

        if not name or not name.strip():
            raise serializers.ValidationError({
                "name": "Lead name is required."
            })

        if not email and not phone:
            raise serializers.ValidationError({
                "contact": "Provide at least an email or phone number."
            })

        return attrs
