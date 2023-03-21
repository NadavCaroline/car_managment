from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('cars.urls')),
]

urlpatterns += static(settings.TEST_MEDIA_URL, document_root=settings.TEST_MEDIA_ROOT)
urlpatterns += static(settings.HOVA_MEDIA_URL, document_root=settings.HOVA_MEDIA_ROOT)
urlpatterns += static(settings.MEKIF_MEDIA_URL, document_root=settings.MEKIF_MEDIA_ROOT)
urlpatterns += static(settings.MAINTENANCE_MEDIA_URL, document_root=settings.MAINTENANCE_MEDIA_ROOT)
# urlpatterns += static(settings.IMAGES_MEDIA_URL, document_root=settings.IMAGES_MEDIA_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
# urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
