
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

    def validate(self, attrs):
        # Update mein existing values ko bhi consider karna hai.
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
