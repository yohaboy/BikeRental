from .models import Bike, Rental
from rest_framework import serializers
from django.contrib.auth.models import User


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email'),
            password=validated_data['password'],
        )
        return user

class BikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bike
        fields = '__all__'
        read_only_fields = ['owner']

    def create(self, validated_data):
        request = self.context.get('request', None)
        if request and request.user.is_authenticated:
            validated_data['owner'] = request.user
        return super().create(validated_data)

class RentalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rental
        fields = "__all__"
        read_only_fields = ['user']

    def create(self, validated_data):
        request = self.context.get('request', None)
        if request and request.user.is_authenticated:
            validated_data['user'] = request.user
        return super().create(validated_data)
