from django.shortcuts import render
from rest_framework import status
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth.models import User
from .models import Bike, Rental, UserProfile
from .serializers import BikeSerializer, RentalSerializer, RegisterSerializer, UserProfileSerializer


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile, created = UserProfile.objects.get_or_create(user=request.user)
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        profile, created = UserProfile.objects.get_or_create(user=request.user)
        serializer = UserProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, user_id):
        try:
            user = User.objects.get(pk=user_id)
            user_data = {
                "id": user.id,
                "username": user.username,
                "email": user.email,
            }
            return Response(user_data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)


class MyBikeListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        bikes = Bike.objects.filter(owner=request.user)
        serialized_bikes = BikeSerializer(bikes, many=True)
        return Response(serialized_bikes.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        # Check if user is an owner
        profile = UserProfile.objects.filter(user=request.user).first()
        if profile and profile.role != 'owner':
            return Response({"error": "Only bike owners can list bikes"}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = BikeSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(owner=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class BikeListView(APIView):
    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAuthenticated()]
        return [AllowAny()]

    def get(self, request):
        bikes = Bike.objects.filter(is_available=True) 
        bike_type = request.query_params.get('type')
        max_price = request.query_params.get('price')
        search_term = request.query_params.get('search', '')
        
        if search_term:
            bikes = bikes.filter(brand__icontains=search_term) | bikes.filter(model__icontains=search_term)
        if bike_type:
            bikes = bikes.filter(type=bike_type)
        if max_price:
            try:
                max_price = float(max_price)
                bikes = bikes.filter(price_per_hour__lte=max_price)
            except ValueError:
                return Response({"error": "Invalid price value"}, status=status.HTTP_400_BAD_REQUEST)

        serialized_bikes = BikeSerializer(bikes, many=True)
        return Response(serialized_bikes.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        profile = UserProfile.objects.filter(user=request.user).first()
        if profile and profile.role != 'owner':
            return Response({"error": "Only bike owners can list bikes"}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = BikeSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(owner=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class BikeDetailView(APIView):
    def get_permissions(self):
        if not self.request.method == 'GET':
            return [IsAuthenticated()]
        return [AllowAny()]

    def get(self, request, pk):
        try:
            bike = Bike.objects.get(pk=pk)
            serialized_bike = BikeSerializer(bike)
            return Response(serialized_bike.data, status=status.HTTP_200_OK)
        except Bike.DoesNotExist:
            return Response({"error": "Bike not found"}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk):
        try:
            bike = Bike.objects.get(pk=pk, owner=request.user)
            serializer = BikeSerializer(bike, data=request.data, partial=True, context={'request': request})
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Bike.DoesNotExist:
            return Response({"error": "Bike not found or you don't have permission"}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        try:
            bike = Bike.objects.get(pk=pk, owner=request.user)
            bike.delete()
            return Response({"message": "Bike deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Bike.DoesNotExist:
            return Response({"error": "Bike not found or you don't have permission"}, status=status.HTTP_404_NOT_FOUND)
    

class RentalListView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        rentals = Rental.objects.filter(renter=request.user)
        serialized_rentals = RentalSerializer(rentals, many=True)
        return Response(serialized_rentals.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = RentalSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            bike = serializer.validated_data['bike']
            if not bike.is_available:
                return Response({"error": "Bike is not available"}, status=status.HTTP_400_BAD_REQUEST)
            
            rental = serializer.save(renter=request.user, status='active')
            bike.is_available = False
            bike.save()
            return Response(RentalSerializer(rental).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RentalDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        try:
            rental = Rental.objects.get(pk=pk, renter=request.user)
            if rental.status == 'completed':
                return Response({"error": "Rental already completed"}, status=status.HTTP_400_BAD_REQUEST)
            
            rental.status = 'completed'
            rental.actual_end_time = request.data.get('actual_end_time')
            if request.data.get('total_cost'):
                rental.total_cost = request.data.get('total_cost')
            rental.save()
            
            bike = rental.bike
            bike.is_available = True
            bike.save()
            
            return Response(RentalSerializer(rental).data, status=status.HTTP_200_OK)
        except Rental.DoesNotExist:
            return Response({"error": "Rental not found"}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        try:
            rental = Rental.objects.get(pk=pk, renter=request.user)
            if rental.status == 'active':
                bike = rental.bike
                bike.is_available = True
                bike.save()
            rental.delete()
            return Response({"message": "Rental cancelled successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Rental.DoesNotExist:
            return Response({"error": "Rental not found"}, status=status.HTTP_404_NOT_FOUND)


class OwnerRentalsView(APIView):
    """View rentals for bikes owned by the current user"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        # Get all rentals for bikes owned by this user
        rentals = Rental.objects.filter(bike__owner=request.user)
        serialized_rentals = RentalSerializer(rentals, many=True)
        return Response(serialized_rentals.data, status=status.HTTP_200_OK)
