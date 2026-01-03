from django.contrib import admin
from .models import Bike, Rental, UserProfile

admin.site.register(Bike)
admin.site.register(Rental)
admin.site.register(UserProfile)