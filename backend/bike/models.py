from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    ROLE_CHOICES = [
        ('owner', 'Bike Owner'),
        ('renter', 'Bike Renter'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='renter')
    phone = models.CharField(max_length=20, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.role}"

class Bike(models.Model):
    TYPE_CHOICES = [
        ('city', 'City'),
        ('mountain', 'Mountain'),
        ('road', 'Road'),
        ('electric', 'Electric'),
    ]
    
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_bikes')
    brand = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    type = models.CharField(max_length=50, choices=TYPE_CHOICES)
    price_per_hour = models.DecimalField(max_digits=6, decimal_places=2)
    is_available = models.BooleanField(default=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.brand} {self.model}"
    
class Rental(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    bike = models.ForeignKey(Bike, on_delete=models.CASCADE, related_name='rentals')
    renter = models.ForeignKey(User, on_delete=models.CASCADE, related_name='rentals')
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    actual_end_time = models.DateTimeField(null=True, blank=True)
    total_cost = models.DecimalField(max_digits=8, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.renter.username} - {self.bike.brand} {self.bike.model}"
    
    class Meta:
        ordering = ['-created_at']
