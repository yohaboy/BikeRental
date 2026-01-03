from .models import Bike, Rental, UserProfile
from rest_framework import serializers
from django.contrib.auth.models import User


class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = UserProfile
        fields = ['id', 'username', 'email', 'role', 'phone', 'created_at']
        read_only_fields = ['id', 'created_at']


class RegisterSerializer(serializers.ModelSerializer):
    role = serializers.ChoiceField(choices=['owner', 'renter'], required=False, write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'role']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        role = validated_data.pop('role', 'renter')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email'),
            password=validated_data['password'],
        )
        # Create user profile with role
        UserProfile.objects.create(user=user, role=role)
        return user


class BikeSerializer(serializers.ModelSerializer):
    owner_username = serializers.CharField(source='owner.username', read_only=True)
    
    class Meta:
        model = Bike
        fields = '__all__'
        read_only_fields = ['owner', 'created_at', 'updated_at']

    def create(self, validated_data):
        request = self.context.get('request', None)
        if request and request.user.is_authenticated:
            validated_data['owner'] = request.user
        return super().create(validated_data)


class RentalSerializer(serializers.ModelSerializer):
    bike_details = BikeSerializer(source='bike', read_only=True)
    renter_username = serializers.CharField(source='renter.username', read_only=True)
    
    class Meta:
        model = Rental
        fields = '__all__'
        read_only_fields = ['renter', 'created_at', 'updated_at', 'actual_end_time']

    def create(self, validated_data):
        request = self.context.get('request', None)
        if request and request.user.is_authenticated:
            validated_data['renter'] = request.user
        return super().create(validated_data)
