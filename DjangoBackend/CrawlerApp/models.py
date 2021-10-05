from django.db import models

# Create your models here.


class Crawler(models.Model):
    crawlerId = models.AutoField(primary_key=True)
    name = models.CharField(max_length=200)
    start_url = models.CharField(max_length=500)
    task_id = models.CharField(max_length=500, default='New Crawler', editable=False)
    products_crawled = models.IntegerField(default=0)
    options = models.CharField(max_length=500)



