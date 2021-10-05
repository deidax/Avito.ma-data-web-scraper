from django.conf.urls import url
from CrawlerApp import views

urlpatterns = [
    url(r'^crawler$', views.crawlerApi),
    url(r'^crawler/([0-9]+)$', views.crawlerApi),
    url(r'^crawler_manager$', views.crawlerManagerApi),
    url(r'^crawler_manager/([0-9]+)$', views.crawlerManagerApi),
    url(r'^crawler_cancel_process$', views.cancelCrawlerProcessApi),
    url(r'^listjobs$', views.getScrapydListJobsApi),
    url(r'^crawler_details_manager$', views.crawlerDetailsManagerApi),
    url(r'^read_log$', views.readLogFileApi),
    url(r'^get_products_data$', views.getProductsData),
    url(r'^drop_products_data$', views.dropProductsData),
]