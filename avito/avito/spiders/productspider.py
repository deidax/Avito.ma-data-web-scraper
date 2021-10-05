import scrapy
from scrapy.spiders import CrawlSpider, Rule
from scrapy.linkextractors import LinkExtractor
import json
import itertools
import logging
import re
from ..items import AvitoItem, AvitoCrawlerItem
import time
import sys
from termcolor import colored
import pyfiglet
from scrapy.utils.project import get_project_settings
import datetime
import os

class ProductSpider(CrawlSpider):
    name = "productspider"

    allowed_domains = ['www.avito.ma']
    start_urls = []
    options = []
    avito_crawler = AvitoCrawlerItem()

    # rules = [
    #     Rule(LinkExtractor(restrict_xpaths='//div[contains(@class, "cslvkF")]/a'), callback='parse', follow=True),
    #     Rule(LinkExtractor(restrict_xpaths='//div[contains(@class, "listing")]/div/a'), callback='parse_products', follow=True)
    # ]
    rules = []

    link_counts = 0
    products_number = 0
    display_number_of_products = True
    is_multiple_pages = False
    
    def __init__(self, *args, **kwargs):
        self.start_urls = []
        self.start_urls.append(kwargs.get('url'))
        self.options = kwargs.get('options')
        self.rules = [
            Rule(LinkExtractor(restrict_xpaths='//div[contains(@class, "cslvkF")]/a'), callback='parse', follow=True),
            Rule(LinkExtractor(restrict_xpaths='//div[contains(@class, "listing")]/div/a'), callback='parse_products', follow=True),
        ]
        print('\n\n')
        scrapyTitle = pyfiglet.figlet_format("AvitoScraper", font='speed')
        print(colored(scrapyTitle, 'yellow'))
        print(colored('__Start URL --> ['+self.start_urls[0]+']\n', 'green'))
        print(colored('__Fields Selected --> ['+self.options+']\n', 'green'))

        self.options = self.options.split(',')

        super(ProductSpider, self).__init__(*args, **kwargs)

    
    def parse(self, response):
        products_number = self.calculate_products_to_scrape(response)
        self.display_total_products_flag(products_number)
        self.is_multiple_pages = True
        

        print(colored("****     FINDING PRODUCTS LINKS     ****", 'magenta'))
        product_listes = response.xpath("//div[contains(@class, 'listing')]/div")

        for product_item in product_listes:
            self.link_counts += 1
            product_link = product_item.xpath('.//a/@href').get()
            count_str = colored(" ["+str(self.link_counts)+"]  ", 'green')
            print(count_str+product_link)
            self.loading()

            yield response.follow(product_link, callback=self.parse_products)
        
    
    def parse_products(self, response):
        
        if self.is_multiple_pages == False:
            # products_number = self.calculate_products_to_scrape(response)
            self.display_total_products_flag(0)
            # yield self.avito_crawler
        
        yield self.avito_crawler

        print(colored("****     SCRAPING PRODUCT     ****", 'magenta'))
        # is_right_product_to_scrap = response.xpath('//*[@id="__next"]/div[2]/div[2]/div/div[1]/div[1]/div[3]/button').extract_first()
        self.loading()
        # if is_right_product_to_scrap:
        json_response = response.xpath('//script[@type="application/json"]//text()').extract_first()
        data = json.loads(json_response)
        product_general_data = data['props']['pageProps']['initialReduxState']['ad']['view']['adInfo']
        
        general_product_data_dict = {}
        product_params_murged_list = []
        product_params_murged_dict = {}

        print(colored('--->option --> ', 'red'))
        print(colored(self.options, 'red'))
        

        product_final_data = self.data_loader(self.options, product_general_data, general_product_data_dict, product_params_murged_list,product_params_murged_dict)

        product = AvitoItem()

        product['product_data_items'] = product_final_data
        
        yield product

    def remove_html_tags(self, text):
        """Remove html tags from a string"""
        import re
        clean = re.compile('<.*?>')
        return re.sub(clean, '', text)
    
    def get_total_number_of_products(self, text):
        # using List comprehension + isdigit() +split()
        # getting numbers from string 
        text = text.replace('(','')
        res = [int(i) for i in text.split() if i.isdigit()]
        if res is not None:
            return res[0]
        return None
    
    def calculate_products_to_scrape(self, response):
        number_of_products = response.xpath("//h1/text()").get()
        return self.get_total_number_of_products(number_of_products)

    def display_total_products_flag(self, products_number):
        if self.display_number_of_products and products_number is not None:
            # Save details about the crawler
            self.avito_crawler['number_of_products_found'] = products_number
            self.avito_crawler['task_id'] = os.environ['SCRAPY_JOB']
            prd_total_str = str(products_number)+' PRODUCTS FOUND'
            result = pyfiglet.figlet_format(prd_total_str, font = "digital" )
            result = colored(result, 'yellow')
            print(result)
            self.calculat_estimated_time_to_scrap(products_number)
            
            self.display_number_of_products = False
            

    def calculat_estimated_time_to_scrap(self, products_number):
        settings = get_project_settings()
        delay = (settings['DOWNLOAD_DELAY'] + 2) * products_number
        day = delay // (24 * 3600)
        delay = delay % (24 * 3600)
        hour = delay // 3600
        delay %= 3600
        minutes = delay // 60
        delay %= 60
        seconds = delay
        estimated_time = "%d:%d:%d:%d" % (day, hour, minutes, seconds)
        self.avito_crawler['avito_crawler_id'] = 1
        self.avito_crawler['estimated_time_to_finish'] = estimated_time
        now = datetime.datetime.now() + datetime.timedelta(hours=1)
        estimated_count_down_date = now + datetime.timedelta(days=day,hours=hour,minutes=minutes,seconds=seconds)
        estimated_count_down_date = estimated_count_down_date.strftime("%d %b, %Y %H:%M:%S")
        self.avito_crawler['estimatred_count_down_date'] = estimated_count_down_date
        estimated_time_str = "ESTIMATED TIME TO SCRAPE ~ " + estimated_time
        estimated_count_down_date_str = "ESTIMATED DATETIME TO FINISH ~ " + estimated_count_down_date
        print(colored('__['+estimated_time_str+']__','red'))
        print(colored('__['+estimated_count_down_date_str+']__','red'))

        print('\n')

    def loading(self):
        loading_str = colored('Loading', 'yellow')
        done_str = colored('DONE', 'green')
        sys.stdout.write('\r'+loading_str+'...')
        time.sleep(0.1)
        sys.stdout.write('\r'+done_str)
    
    # seller_data,price,description,subject,phone,city,number_of_product_images,extra_data
    def data_loader(self, options, product_general_data, general_product_data_dict, product_params_murged_list,product_params_murged_dict):
        general_product_data_dict['product_id'] = product_general_data['id']

        if 'subject' in options:
            general_product_data_dict['subject'] = product_general_data['subject']
        if 'price' in options:
            general_product_data_dict['price'] = product_general_data['price']['value']
        if 'seller_data' in options:
            general_product_data_dict['seller_name'] = product_general_data['seller']['name']
            general_product_data_dict['seller_type'] = product_general_data['seller']['type']
            general_product_data_dict['seller_address'] = product_general_data['seller']['address']
        if 'description' in options:
            general_product_data_dict['description'] = self.remove_html_tags(product_general_data['description'])
        if 'phone' in options:
            general_product_data_dict['seller_phone'] = product_general_data['phone']
            general_product_data_dict['is_seller_phone_verified'] = product_general_data['isPhoneVerified']
        if 'city' in options:
            general_product_data_dict['city'] = product_general_data['location']['city']['name']
        if 'number_of_product_images' in options:
            images = product_general_data['images']
            general_product_data_dict['number_of_images'] = len(images) if images else 0
        if 'extra_data' in options:
            product_params_data = product_general_data['params']
            for key, product_param in product_params_data.items():
                    if isinstance(product_param, list):
                        product_params_murged_list = itertools.chain(product_params_murged_list, product_param)

        general_product_data_dict['address'] = product_general_data['location']['address']
        general_product_data_dict['url'] = product_general_data['friendlyUrl']['url']
        update_date_split = product_general_data['listTime']['raw'].split('+')
        update_date = update_date_split[0].replace('T', ' ')
        general_product_data_dict['last_update_date'] = update_date
        general_product_data_dict['has_shipping'] = product_general_data['hasShipping']

        for i in product_params_murged_list:
            product_params_murged_dict.update( { i['key'] : i['value'] } )

        product_final_data = {**general_product_data_dict, **product_params_murged_dict}

        return product_final_data
        


        
