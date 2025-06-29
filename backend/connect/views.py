from itertools import count
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .serializers import RegisterSerializer, UserSerializer,CustomerAddSerializer,CustomViewSerializer, ProductsViewSerializers, ProductsAddSerializers, InvoiceViewSerializer, InvoiceSerializer, InvoiceNewSerializer
from .models import CustomerAdd, Products
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from .serializers import *



class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()  # Get the user instance from the serializer
            user.set_password(serializer.validated_data["password"])  
            user.save()

            return Response({"message": "User registered successfully"}, status=201)
        return Response(serializer.errors, status=400)



class LoginView(APIView):
    def post(self, request):
        email = request.data.get("email") 
        password = request.data.get("password")

        try:
            user = User.objects.get(email=email)  
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=400)

        user = authenticate(request, username=user.email, password=password) 
        token, _ = Token.objects.get_or_create(user=user)
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "username": user.username,
                "token" : token.key
            })
        return Response({"error": "Invalid credentials"}, status=400)


class UserProfileView(APIView):
    def get(self,request,username):
        try:
            user = User.objects.get(username=username) 
            serializer = UserSerializer(user)
            return Response(serializer.data, status=200)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

class CustomerAddView(APIView):
    def post(self,request):
        serializer=CustomerAddSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save() 
            return Response({"message": "Customer added successfully"}, status=201)
        return Response(serializer.errors, status=400)
    
    def get(self,request,username=None):
        user = get_object_or_404(User, username=username)   
        customerdata = user.customers.all()
        if not customerdata.exists():  
            return Response({"error": "No customers found for this user"}, status=status.HTTP_404_NOT_FOUND)

        serializer = CustomViewSerializer(customerdata, many=True) 
        return Response(serializer.data, status=status.HTTP_200_OK)

class customerView(APIView):
    def get(self,request):
        obj = CustomerAdd.objects.all()
        serializer = CustomViewSerializer(obj, many=True)
        return Response({'data':serializer.data})
    def delete(self, request):
        customer_name = request.data.get("customer_name")
        print(f"Received DELETE request with customer_name: {customer_name}")
        customers = CustomerAdd.objects.filter(customer_name=customer_name)
        
        if not customers.exists():
            return Response({"error": "Customer not found"}, status=status.HTTP_200_OK)

        deleted_count, _ = customers.delete()
        print(f"Deleted {deleted_count} customers with name {customer_name}")

        return Response({"message": f"Deleted {deleted_count} customers with name {customer_name}","status":204}, status=status.HTTP_204_NO_CONTENT)


class ProductView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]
    def get(self, request):
        objs = Products.objects.all()
        serializer = ProductsViewSerializers(objs, many=True)
        return Response({"data":serializer.data},status=status.HTTP_200_OK)
    
    def post(self, request):
        serializer = ProductsAddSerializers(data = request.data)
        if serializer.is_valid():
            serializer.save(user = request.user)
            return Response({'message':"product add successfully", "data" : serializer.validated_data}, status = status.HTTP_200_OK)
        return Response({"message":serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        product_id = request.GET.get("product_id")
        print(f"Received DELETE request with product_id: {product_id}")
        product = Products.objects.filter(id=product_id)
        print(product)
        
        if not product.exists():
            return Response({"error": "Product not found"}, status=status.HTTP_200_OK)
        product.delete()
        return Response({"message": "Product deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    
    def patch(self, request):
        product_id = request.GET.get("id")
        product = get_object_or_404(Products, id=product_id)
        serializer = ProductsAddSerializers(product, data=request.data, partial = True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class InvoiceCreateView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]
    def post(self, request):
        serializer = InvoiceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def get(self, request):
        objs = Invoice.objects.all()
        serializer = InvoiceViewSerializer(objs, many=True)
        return Response({"data":serializer.data}, status=status.HTTP_200_OK)

class InvoiceGetView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]
    
    def get(self, request, invoice_id):
        invoice = get_object_or_404(Invoice, id=invoice_id)
        serializer = InvoiceViewSerializer(invoice)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
from django.http import JsonResponse
from django.db.models.functions import TruncMonth
from django.db.models import Sum, Count,  F, ExpressionWrapper, FloatField
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import InvoiceItem, Invoice, Products

class AnalyticsView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]
    
    def get(self, request, metric):
        if metric == "total_revenue_per_product":
            return self.total_revenue_per_product()
        elif metric == "quantity_sold_per_product":
            return self.quantity_sold_per_product()
        elif metric == "discount_vs_sales":
            return self.discount_vs_sales()
        elif metric == "monthly_revenue_trends":
            return self.monthly_revenue_trends()
        elif metric == "remaining_stock_per_product":
            return self.remaining_stock_per_product()
        elif metric == "customer_purchases_distribution":
            return self.customer_purchases_distribution()
        elif metric == "top_selling_products":
            return self.top_selling_products()
        elif metric == "average_order_value":
            return self.average_order_value()
        elif metric == "sales_by_category":
            return self.sales_by_category()
        elif metric == "revenue_by_customer":
            return self.revenue_by_customer()
        elif metric == "product_sales_trend":
            return self.product_sales_trend()
        elif metric == "customer_retention":
            return self.customer_retention()
        elif metric == "profit_margin_analysis":
            return self.profit_margin_analysis()
        elif metric == "big_spenders":
            return self.big_spenders()
        elif metric == "total_revenue":
            return self.total_revenue()
        elif metric == "total_users":
            return self.total_users()
        else:
            return Response({"error": "Invalid metric"}, status=400)
    
    def total_revenue_per_product(self):
        data = (
            InvoiceItem.objects
            .values("product__productname")
            .annotate(total_revenue=Sum("total"))
            .order_by("-total_revenue")
        )
        return JsonResponse(list(data), safe=False)
    
    def total_revenue(self):
        data = (
            InvoiceItem.objects.aggregate(total_revenue=Sum("total"))
        )
        print(data)
        return JsonResponse(data,safe=False)
    
    def total_users(self):
        data = (User.objects.aggregate(total_users=Count("username")))
        return JsonResponse(data, safe=False)
    
    def quantity_sold_per_product(self):
        data = (
            InvoiceItem.objects
            .values("product__productname")
            .annotate(total_quantity=Sum("quantity"))
            .order_by("-total_quantity")
        )
        return JsonResponse(list(data), safe=False)
    
    def discount_vs_sales(self):
        data = (
            InvoiceItem.objects
            .values("discount", "total")
            .order_by("discount")
        )
        return JsonResponse(list(data), safe=False)
    
    def monthly_revenue_trends(self):
        data = (
            InvoiceItem.objects
            .values(month=TruncMonth("invoice__invoice_date"))
            .annotate(total_revenue=Sum("total"))
            .order_by("month")
        )
        return JsonResponse(list(data), safe=False)
    
    def remaining_stock_per_product(self):
        data = (
            Products.objects
            .annotate(sold_quantity=Sum("invoiceitem__quantity"))
            .values("productname", "qty")
        )
        for item in data:
            item["remaining_stock"] = item["qty"]
        return JsonResponse(list(data), safe=False)
    
    def customer_purchases_distribution(self):
        data = (
            Invoice.objects
            .values("customer__customer_name")
            .annotate(invoice_count=Count("id"))
            .order_by("-invoice_count")
        )
        return JsonResponse(list(data), safe=False)
    
    def top_selling_products(self):
        data = (
            InvoiceItem.objects
            .values("product__productname")
            .annotate(total_quantity=Sum("quantity"))
            .order_by("-total_quantity")
        )
        return JsonResponse(list(data), safe=False)
    def average_order_value(self):
        data = (
            Invoice.objects
            .annotate(order_value=Sum("items__total"))
            .values("order_value")
            .annotate(count=Count("id"))
            .order_by("order_value")
        )
        return JsonResponse(list(data), safe=False)
    def sales_by_category(self):
        data = (
            InvoiceItem.objects
            .values("product__category__name")  
            .annotate(total_revenue=Sum("total"))
            .order_by("-total_revenue")
        )
        return JsonResponse(list(data), safe=False)
    def revenue_by_customer(self):
        data = (
            Invoice.objects
            .values("customer__customer_name")
            .annotate(total_revenue=Sum("items__total"))
            .order_by("-total_revenue")
        )
        return JsonResponse(list(data), safe=False)

    def product_sales_trend(self):
        data = (
            InvoiceItem.objects
            .annotate(month=TruncMonth("invoice__invoice_date"))
            .values("month", "product__productname")
            .annotate(total_quantity=Sum("quantity"))
            .order_by("month", "product__productname") 
        )
        formatted_data = [
            {
                "month": item["month"].strftime("%Y-%m"),
                "product_name": item["product__productname"], 
                "total_quantity": item["total_quantity"],
            }
            for item in data
        ]

        return Response(formatted_data)

    def customer_retention(self):
        data = (
            Invoice.objects
            .values("customer__customer_name")
            .annotate(order_count=Count("id"))
            .order_by("-order_count")
        )
        return JsonResponse(list(data), safe=False)

    def profit_margin_analysis(self):
        data = (
            Products.objects
            .annotate(profit=ExpressionWrapper(
                (F("price") - F("total") / F("total_qty")) * F("total_qty"),
                output_field=FloatField()
            ))
            .values("productname", "profit")
            .order_by("-profit")
        )
        return JsonResponse(list(data), safe=False)

    def big_spenders(self):
        data = (
            Invoice.objects
            .values("customer__customer_name")
            .annotate(total_spent=Sum("items__total"))
            .order_by("-total_spent")
        )
        return JsonResponse(list(data), safe=False)

from rest_framework import status, generics
class InvoiceListView(generics.ListAPIView):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceNewSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

class InvoiceUpdateStatusView(generics.UpdateAPIView):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceNewSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def patch(self, request, *args, **kwargs):
        invoice = self.get_object()
        new_status = request.data.get("invoice_status")

        if new_status not in ["open", "paid"]:
            return Response({"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)

        invoice.invoice_status = new_status
        invoice.save()
        return Response({"message": "Invoice status updated successfully"}, status=status.HTTP_200_OK)



import joblib
import numpy as np
model = joblib.load('mlp_multi_model.pkl')
from .serializers import PredictionSerializer


class ModelPredictView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]
    def post(self, request):
        print("Data", request.data)
        serializer = PredictionSerializer(data=request.data)
        labels = ['Sneakers', 'Dresses', 'Sweaters', 'Sunglasses', 'T-Shirts', 'Scarf',
                'Light Jacket', 'Gloves', 'Umbrella', 'Raincoat', 'Jeans', 'Boots',
                'Heavy Jacket', 'Shorts', 'Sandals', 'Quick-Dry Clothes',
                'Thermal Wear', 'Waterproof Shoes']
        if serializer.is_valid():
            print("Serialized Data - ", serializer.validated_data)
            data = serializer.validated_data
            season = data['season']
            rainy, spring, summer, winter = 0,0,0,0
            if season == 'rainy':
                rainy = 1
            if season == 'spring':
                spring = 1
            if season =='summer':
                summer = 1
            if season == 'winter':
                winter = 1
                
            features = [data['month'], data['temp'], data['humidity'],
                        rainy, spring, summer, winter]    
            prediction = model.predict([features])    
            prediction_list = list(prediction[0])  
            prediction_label = [labels[i] for i, val in enumerate(prediction_list) if val == 1]
            return Response({'prediction': prediction_label}, status=status.HTTP_200_OK)
        return Response({"message": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)