from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import CustomerAdd
from django.contrib.auth.models import User
from .models import *

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'password']

    def create(self, validated_data):
        user = User(
            username=validated_data['email'],  # 👈 required if using username for login
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
        )
        user.set_password(validated_data['password'])  # ✅ Hash password here
        user.save()
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name"]

        
class CustomerAddSerializer(serializers.ModelSerializer):
    username = serializers.CharField(write_only=True) 
    user = serializers.CharField(source="user.username", read_only=True) 

    class Meta:
        model = CustomerAdd
        fields = [
            "id", "user", "username", 
            "customer_name", "customer_email", "customer_phone",
            "customer_address_1", "customer_address_2", "customer_town", "customer_postcode", "customer_county",
            "customer_name_ship", "customer_address_1_ship", "customer_address_2_ship",
            "customer_town_ship", "customer_postcode_ship", "customer_county_ship",
        ]

    def create(self, validated_data):
        
        username = validated_data.pop("username")

        
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            raise serializers.ValidationError({"username": "User not found."})

       
        validated_data["user"] = user
        return super().create(validated_data)
    

class CustomViewSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerAdd
        fields = ["id","customer_name", "customer_email", "customer_phone","customer_address_1","customer_name_ship", "customer_address_1_ship", "customer_postcode_ship"]

class UserSerializers(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','username']
class ProductsViewSerializers(serializers.ModelSerializer):
    user = UserSerializers()
    class Meta:
        model = Products
        fields = '__all__'
    
class ProductsAddSerializers(serializers.ModelSerializer):
    class Meta:
        model = Products
        fields = ['id','productname', 'qty','total_qty', 'price', 'discount', 'total']


class ProductsAddSerializers(serializers.ModelSerializer):
    class Meta:
        model = Products
        fields = ['id','productname', 'qty','total_qty', 'price', 'discount', 'total']
class InvoiceItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoiceItem
        fields = ['id', 'product', 'quantity', 'price', 'discount', 'total']
        

class InvoiceSerializer(serializers.ModelSerializer):
    items = InvoiceItemSerializer(many=True)
    class Meta:
        model = Invoice
        fields = ['id', 'customer', 'invoice_number', 'invoice_date', 'due_date', 'invoice_type', 'invoice_status', 'items']
        read_only_fields = ['invoice_number']
    
    def create(self, validated_data):
        items_data = validated_data.pop('items')
        invoice = Invoice.objects.create(**validated_data)

        for item_data in items_data:
            product = item_data['product']
            product.qty -= item_data['quantity']
            if product.qty < 0:
                product.qty += item_data['quantity']
                raise serializers.ValidationError("Not enough quantity in stock.")
            else:
                product.save()
            InvoiceItem.objects.create(invoice=invoice, **item_data)
        return invoice
    
class CustomerViewSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerAdd
        fields = "__all__"
class ProductViewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Products
        fields = ['id','productname']
class InvoiceItemViewSerializer(serializers.ModelSerializer):
    product = ProductViewSerializer()
    class Meta:
        model = InvoiceItem
        fields = ['id', 'product', 'quantity', 'price', 'discount', 'total']

class InvoiceViewSerializer(serializers.ModelSerializer):
    items = InvoiceItemViewSerializer(many=True)
    customer = CustomerViewSerializer() 
    class Meta:
        model = Invoice
        fields = ['id', 'customer', 'invoice_number', 'invoice_date', 'due_date', 'invoice_type', 'invoice_status', 'items']
        
        
class CustomerNameViewSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerAdd
        fields = ['id','customer_name']
class InvoiceNewSerializer(serializers.ModelSerializer):
    customer = CustomerNameViewSerializer()
    class Meta:
        model = Invoice
        fields = '__all__'

class PredictionSerializer(serializers.Serializer):
    month = serializers.IntegerField()
    temp = serializers.FloatField()
    humidity = serializers.FloatField()
    season = serializers.CharField()
