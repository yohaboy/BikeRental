from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView ,TokenRefreshView


urlpatterns = [
    path('bikes/', view=views.BikeListView.as_view(), name='bikes'),
    path('rentals/', view=views.RentalListView.as_view(), name='rentals'),
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]