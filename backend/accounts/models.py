from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    email = models.EmailField(
        unique=True,
    )

    def save(self, *args, **kwargs):
        if self.email:
            self.email = self.email.strip().lower()
            self.username = self.email

        super().save(*args, **kwargs)

    def __str__(self):
        return self.email