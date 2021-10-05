# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# https://doc.scrapy.org/en/latest/topics/items.html

import scrapy
from scrapy.loader import ItemLoader
# from itemloaders.processors import MapCompose, TakeFirst
# from w3lib.html import remove_tags

def UpperCase(value):
    return value.upper()

class AvitoItem(scrapy.Item):
    # define the fields for your item here like:
    product_data_items = scrapy.Field()

class AvitoCrawlerItem(scrapy.Item):
    avito_crawler_id = scrapy.Field()
    number_of_products_found = scrapy.Field()
    estimated_time_to_finish = scrapy.Field()
    estimatred_count_down_date = scrapy.Field()
    task_id = scrapy.Field()
    products_inserted = scrapy.Field()
    
