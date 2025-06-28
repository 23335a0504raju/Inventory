from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .serializers import RegisterSerializer, UserSerializer, CustomerAddSerializer, CustomViewSerializer, ProductsViewSerializers, ProductsAddSerializers, InvoiceViewSerializer, InvoiceSerializer, InvoiceNewSerializer, PredictionSerializer
from .models import CustomerAdd, Products, Invoice, InvoiceItem
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Count
import logging
import joblib
import os
from django.conf import settings

logger = logging.getLogger(__name__)

# Initialize model as None at module level
model = None

def load_model():
    global model
    if model is None:
        try:
            model_path = os.path.join(settings.BASE_DIR, 'mlp_multi_model.pkl')
            model = joblib.load(model_path)
            logger.info("Model loaded successfully")
        except Exception as e:
            logger.error(f"Error loading model: {str(e)}")
            model = None

# Initialize model when module loads
load_model()

class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User registered successfully"}, status=201)
        return Response(serializer.errors, status=400)

class LoginView(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response({"message": "Email and password are required."}, status=400)

        user = User.objects.filter(email=email).first()
        if not user:
            return Response({"message": "User with this email does not exist."}, status=400)

        user_auth = authenticate(username=user.username, password=password)
        if not user_auth:
            return Response({"message": "Invalid email or password."}, status=400)

        token, _ = Token.objects.get_or_create(user=user_auth)
        refresh = RefreshToken.for_user(user_auth)

        return Response({
            "username": user_auth.username,
            "token": token.key,
            "access": str(refresh.access_token),
            "message": "Login successful"
        })

class UserProfileView(APIView):
    def get(self, request, username):
        try:
            user = User.objects.get(username=username) 
            serializer = UserSerializer(user)
            return Response(serializer.data, status=200)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

class CustomerAddView(APIView):
    def post(self, request):
        serializer = CustomerAddSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save() 
            return Response({"message": "Customer added successfully"}, status=201)
        return Response(serializer.errors, status=400)
    
    def get(self, request, username=None):
        user = get_object_or_404(User, username=username)   
        customerdata = user.customers.all()
        if not customerdata.exists():  
            return Response({"error": "No customers found for this user"}, status=404)

        serializer = CustomViewSerializer(customerdata, many=True) 
        return Response(serializer.data, status=200)

class CustomerView(APIView):
    def get(self, request):
        customers = CustomerAdd.objects.all()
        serializer = CustomViewSerializer(customers, many=True)
        return Response({'data': serializer.data})
    
    def delete(self, request):
        customer_name = request.data.get("customer_name")
        customers = CustomerAdd.objects.filter(customer_name=customer_name)
        
        if not customers.exists():
            return Response({"error": "Customer not found"}, status=404)

        deleted_count, _ = customers.delete()
        return Response({
            "message": f"Deleted {deleted_count} customers with name {customer_name}",
            "status": 204
        }, status=204)

class ProductView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]
    
    def get(self, request):
        products = Products.objects.all()
        serializer = ProductsViewSerializers(products, many=True)
        return Response({"data": serializer.data}, status=200)
    
    def post(self, request):
        serializer = ProductsAddSerializers(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response({
                'message': "Product added successfully",
                'data': serializer.validated_data
            }, status=200)
        return Response({"message": serializer.errors}, status=400)

    def delete(self, request):
        product_id = request.GET.get("product_id")
        product = Products.objects.filter(id=product_id)
        
        if not product.exists():
            return Response({"error": "Product not found"}, status=404)
        
        product.delete()
        return Response({"message": "Product deleted successfully"}, status=204)
    
    def patch(self, request):
        product_id = request.GET.get("id")
        product = get_object_or_404(Products, id=product_id)
        serializer = ProductsAddSerializers(product, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)

class InvoiceCreateView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]
    
    def post(self, request):
        serializer = InvoiceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    
    def get(self, request):
        invoices = Invoice.objects.all()
        serializer = InvoiceViewSerializer(invoices, many=True)
        return Response({"data": serializer.data}, status=200)

class InvoiceGetView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]
    
    def get(self, request, invoice_id):
        invoice = get_object_or_404(Invoice, id=invoice_id)
        serializer = InvoiceViewSerializer(invoice)
        return Response(serializer.data, status=200)

class AnalyticsView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]
    
    def get(self, request, metric):
        if metric == "total_revenue_per_product":
            return self.total_revenue_per_product()
        elif metric == "total_revenue":
            return self.total_revenue()
        elif metric == "total_users":
            return self.total_users()
        # Add other metrics as needed...
        else:
            return Response({"error": "Invalid metric"}, status=400)
    
    def total_revenue_per_product(self):
        data = (
            InvoiceItem.objects
            .values("product__productname")
            .annotate(total_revenue=Sum("total"))
            .order_by("-total_revenue")
        )
        return Response(list(data))
    
    def total_revenue(self):
        data = InvoiceItem.objects.aggregate(total_revenue=Sum("total"))
        return Response(data)
    
    def total_users(self):
        data = User.objects.aggregate(total_users=Count("username"))
        return Response(data)

class ModelPredictView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]
    
    def post(self, request):
        if model is None:
            load_model()
            if model is None:
                return Response(
                    {"error": "Prediction service is currently unavailable"}, 
                    status=503
                )

        serializer = PredictionSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        data = serializer.validated_data
        season = data['season'].lower()
        
        season_mapping = {
            'rainy': [1, 0, 0, 0],
            'spring': [0, 1, 0, 0],
            'summer': [0, 0, 1, 0],
            'winter': [0, 0, 0, 1]
        }
        
        if season not in season_mapping:
            return Response(
                {"error": f"Invalid season '{season}'"},
                status=400
            )
            
        features = [
            data['month'], 
            data['temp'], 
            data['humidity'],
            *season_mapping[season]
        ]
        
        try:
            prediction = model.predict([features])
            labels = [
                'Sneakers', 'Dresses', 'Sweaters', 'Sunglasses', 'T-Shirts', 'Scarf',
                'Light Jacket', 'Gloves', 'Umbrella', 'Raincoat', 'Jeans', 'Boots',
                'Heavy Jacket', 'Shorts', 'Sandals', 'Quick-Dry Clothes',
                'Thermal Wear', 'Waterproof Shoes'
            ]
            prediction_label = [
                labels[i] for i, val in enumerate(prediction[0]) if val == 1
            ]
            
            return Response({'prediction': prediction_label}, status=200)
            
        except Exception as e:
            logger.error(f"Prediction failed: {str(e)}")
            return Response(
                {"error": "An error occurred during prediction"}, 
                status=500
            )