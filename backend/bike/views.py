from django.shortcuts import render
from rest_framework import status
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny ,IsAuthenticated
from django.contrib.auth.models import User
from .models import Bike, Rental
from .serializers import BikeSerializer, RentalSerializer ,RegisterSerializer


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer


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


class BikeListView(APIView):
    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAuthenticated()]
        return [AllowAny()]

    def get(self, request):
        bikes = Bike.objects.all()
        serialized_bikes = BikeSerializer(bikes, many=True)
        return Response(serialized_bikes.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        serializer = BikeSerializer(data=request.data , context={'request': request})
        if serializer.is_valid():
            serializer.save()
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
            bike = Bike.objects.get(pk=pk)
            serializer = BikeSerializer(bike, data=request.data, context={'request': request})
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Bike.DoesNotExist:
            return Response({"error": "Bike not found"}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        try:
            bike = Bike.objects.get(pk=pk)
            bike.delete()
            return Response({"message": "Bike deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Bike.DoesNotExist:
            return Response({"error": "Bike not found"}, status=status.HTTP_404_NOT_FOUND)
    
class RentalListView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        rentals = Rental.objects.filter(user=request.user)
        serialized_rentals = RentalSerializer(rentals, many=True)
        return Response(serialized_rentals.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = RentalSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
