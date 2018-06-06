# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# https://doc.scrapy.org/en/latest/topics/items.html

import scrapy



class IboProjectItem(scrapy.Item):
    # define the fields for your item here like:

    # 视频名称
    name = scrapy.Field()
    # 视频地址
    url = scrapy.Field()
    # 视频类型
    type = scrapy.Field()







class MovieItem(scrapy.Item):
    name = scrapy.Field()
