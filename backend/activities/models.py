from django.db import models
from leads.models import Lead


class Activity(models.Model):

    class ActivityType(models.TextChoices):
        CALL = "Call", "Call"
        EMAIL = "Email", "Email"
        MEETING = "Meeting", "Meeting"
        TASK = "Task", "Task"

    class Status(models.TextChoices):
        PENDING = "Pending", "Pending"
        COMPLETED = "Completed", "Completed"

    lead = models.ForeignKey(
        Lead,
        on_delete=models.CASCADE,
        related_name="activities",
    )

    title = models.CharField(max_length=200)

    activity_type = models.CharField(
        max_length=20,
        choices=ActivityType.choices,
        default=ActivityType.TASK,
    )

    due_at = models.DateTimeField()

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
    )

    completed_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.status}"