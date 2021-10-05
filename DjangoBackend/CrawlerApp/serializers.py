from rest_framework import serializers
from CrawlerApp.models import Crawler

class CrawlerSerializer(serializers.ModelSerializer):
    class Meta:
        model=Crawler
        fields=('crawlerId','name', 'start_url', 'task_id', 'products_crawled', 'options')