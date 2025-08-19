from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView ,TokenRefreshView


urlpatterns = [
    path('bikes/', view=views.BikeListView.as_view(), name='bikes'),
    path('my_bikes/', views.MyBikeListView.as_view(), name='my-bikes'),
    path('bikes/<int:pk>/', view=views.BikeDetailView.as_view(), name='bike-detail'),
    path('rentals/', view=views.RentalListView.as_view(), name='rentals'),
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('users/<int:user_id>/', views.UserDetailView.as_view(), name='user-detail'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]