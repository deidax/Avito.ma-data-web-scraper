# -*- coding: utf-8 -*-

# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://doc.scrapy.org/en/latest/topics/item-pipeline.html

import pymongo
import pyfiglet

from scrapy.utils.project import get_project_settings
from scrapy.exceptions import DropItem
from .items import AvitoItem, AvitoCrawlerItem
import logging
from termcolor import colored
import os
# import yagmail
import datetime

class MongoDBPipeline(object):

    collection_name = 'products'
    avito_crawler_collection_name = 'avito_crawler'
    crawler_collection_name = 'CrawlerApp_crawler'
    items_processed_count = 0

    def __init__(self, mongo_uri, mongo_db):
        self.mongo_uri = mongo_uri
        self.mongo_db = mongo_db

    @classmethod
    def from_crawler(cls, crawler):
        return cls(
            mongo_uri=crawler.settings.get('MONGODB_URI'),
            mongo_db=crawler.settings.get('MONGODB_DB', 'avito')
        )

    def open_spider(self, spider):
        self.client = pymongo.MongoClient(self.mongo_uri)
        self.db = self.client[self.mongo_db]

    def close_spider(self, spider):
        crawler_collection = self.db[self.crawler_collection_name]
        if crawler_collection:
            _crawler_filter = {'task_id': os.environ['SCRAPY_JOB']}
            products_crawled = {'products_crawled': self.items_processed_count}
            crawler_collection.update(_crawler_filter, {'$set': products_crawled })

        finished_text = 'DONE '+str(self.items_processed_count)+' PRODUCTS INSERTED !'
        finished_text = pyfiglet.figlet_format(finished_text, font = "digital" )
        finished_text = colored(finished_text, 'green', attrs=['bold'])
        print('\n')
        print(finished_text)
        self.client.close()
        # # sending an email
        # contents = [
        #     finished_text
        # ]
        # yagmail.SMTP('cobratkhl@gmail.com').send('to@someone.com', 'subject', contents)

    def process_item(self, item, spider):
        if isinstance(item, AvitoItem):
            products_collection = self.db[self.collection_name]
            valid = True
            for data in item:
                if not data:
                    valid = False
                    raise DropItem("Missing {0}!".format(data))
            if valid:
                product = item.get('product_data_items')
                product_id = product.get('product_id')
                _filter = {}
                for key in ["product_id"]:
                    _filter[key] = eval(key)
                    
                if _filter:
                    try:
                        item_return = item
                        item = item.get('product_data_items')
                        query_result = products_collection.update(_filter, dict(item), upsert=True)
                        self.items_processed_count += 1
                        print(colored(" [MONGODB] OK!: "+str(query_result), 'yellow'))
                        if query_result['updatedExisting']:
                            return print(colored(item_return, 'yellow'))
                        return item_return
                    except pymongo.errors.PyMongoError as e:
                        print(colored(e, 'red'))
                        print(colored("[MONGODB]--> Product Error <--\n", 'red'))
                        print(colored(item_return, 'red'))
        if isinstance(item, AvitoCrawlerItem):
            avito_crawler_collection = self.db[self.avito_crawler_collection_name]
            valid = True
            item['products_inserted'] = self.items_processed_count
            for data in item:
                if not data:
                    valid = False
                    raise DropItem("Missing {0}!".format(data))
            if valid:
                # this is the filter for the avito_crawler_collection
                # only one document will be stored in this collection
                # this document will have some details about the process
                # ---> Like: number of products found and estimated time to scrap
                _av_filter = {'avito_crawler_id': 1} 
                try:
                    avito_crawler_collection.update(_av_filter, dict(item), upsert=True)
                    self.isCrawlerDetailsCreated = True
                    print(colored("[MONGODB]--> Storing Crawler Details <--\n", 'green'))
                except pymongo.errors.PyMongoError as e:
                        print(colored(e, 'red'))



                
