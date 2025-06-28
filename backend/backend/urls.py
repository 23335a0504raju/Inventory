from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse
from django.conf import settings
from django.conf.urls.static import static  # Make sure this import exists

def home(request):
    return HttpResponse("Inventory Management API is running", status=200)

urlpatterns = [
    path('', home),
    path("api/", include("connect.urls")),
    path("admin/", admin.site.urls),
]

# This should be OUTSIDE urlpatterns
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)