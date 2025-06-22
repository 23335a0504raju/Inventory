from django.contrib import admin
from .models import *

from .models import Products

admin.site.register(Products)
admin.site.register(CustomerAdd)
admin.site.register(Invoice)
admin.site.register(InvoiceItem)