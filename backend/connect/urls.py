from django.urls import path
from .views import RegisterView, LoginView, UserProfileView,CustomerAddView, customerView, ProductView, InvoiceCreateView, InvoiceGetView, AnalyticsView, InvoiceListView,InvoiceUpdateStatusView
from rest_framework_simplejwt.views import TokenRefreshView
from .views import ModelPredictView

urlpatterns = [
    path("customerview/<str:username>/",CustomerAddView.as_view(), name="customers"),
    path("customeradd/",CustomerAddView.as_view(),name="customadd"),
    path("userprofile/<str:username>/",UserProfileView.as_view(), name="profile"),
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path('customer/', customerView.as_view()),
    path('products-view/',ProductView.as_view()),
    path('create-invoice/', InvoiceCreateView.as_view()),
    path('invoice/<int:invoice_id>/', InvoiceGetView.as_view()),
    path("analytics/<str:metric>/", AnalyticsView.as_view(), name="analytics"),
    path('invoices/', InvoiceListView.as_view(), name='invoice-list'),
    path('invoice/<int:pk>/update-status/', InvoiceUpdateStatusView.as_view(), name='invoice-update-status'),
    path("predict/", ModelPredictView.as_view(), name="model-predict")
]