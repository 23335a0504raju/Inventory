from django.db import models
from django.contrib.auth.models import User
from datetime import datetime

class CustomerAdd(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="customers")
    customer_name = models.CharField(max_length=100)
    customer_email = models.EmailField(max_length=100)
    customer_phone = models.CharField(max_length=15)

   
    customer_address_1 = models.CharField(max_length=100)
    customer_address_2 = models.CharField(max_length=100, blank=True, null=True)
    customer_town = models.CharField(max_length=100)
    customer_postcode = models.CharField(max_length=20)
    customer_county = models.CharField(max_length=100)

   
    customer_name_ship = models.CharField(max_length=100)
    customer_address_1_ship = models.CharField(max_length=100)
    customer_address_2_ship = models.CharField(max_length=100, blank=True, null=True)
    customer_town_ship = models.CharField(max_length=100)
    customer_postcode_ship = models.CharField(max_length=20)
    customer_county_ship = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.customer_name} ({self.user.username})"
    
class Products(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    productname = models.CharField(max_length=50)
    total_qty = models.IntegerField(default=0)
    qty = models.IntegerField()
    price = models.FloatField()
    discount = models.FloatField()
    total = models.FloatField()

    def __str__(self):
        return f"{self.productname}" 

class Invoice(models.Model):
    INVOICE_TYPES = [
        ('invoice', 'Invoice'),
        ('receipt', 'Receipt'),
    ]
    
    INVOICE_STATUS = [
        ('open', 'Open'),
        ('paid', 'Paid'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    customer = models.ForeignKey(CustomerAdd, on_delete=models.CASCADE, related_name="invoices")
    invoice_number = models.CharField(max_length=20, unique=True, editable=False)
    invoice_date = models.DateTimeField(default=datetime.now)
    due_date = models.DateTimeField(default=datetime.now)
    
    invoice_type = models.CharField(max_length=10, choices=INVOICE_TYPES, default='invoice')
    invoice_status = models.CharField(max_length=10, choices=INVOICE_STATUS, default='open')

    
    def save(self, *args, **kwargs):
        if not self.invoice_number:
            today = datetime.today().strftime('%Y%m%d')  # Format: YYYYMMDD
            last_invoice = Invoice.objects.order_by('-id').first()
            next_number = (last_invoice.id + 1) if last_invoice else 1
            self.invoice_number = f"INV-{today}-{next_number:04d}"
        super().save(*args, **kwargs)
    def __str__(self):
        return f"Invoice {self.id} - {self.customer.customer_name}"

class InvoiceItem(models.Model):
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Products, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    price = models.FloatField()
    discount = models.FloatField()
    total = models.FloatField()

    def __str__(self):
        return f"{self.product.productname} ({self.quantity})"