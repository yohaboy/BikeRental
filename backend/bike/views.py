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
    
class RentalListView(APIView):
    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAuthenticated()]
        return [AllowAny()]
    
    def get(self, request):
        rentals = Rental.objects.all()
        serialized_rentals = RentalSerializer(rentals, many=True)
        return Response(serialized_rentals.data, status=status.HTTP_200_OK)


    def post(self, request):
        serializer = RentalSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
