# -*- coding: utf-8 -*-

# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://doc.scrapy.org/en/latest/topics/item-pipeline.html


class IboProjectPipeline(object):
    def process_item(self, item, spider):
        # return item
        print('---', item)
        with open("damao.txt", 'a') as fp:
            fp.write(item['type'] + " : " +
                     item['name'] + " : " +
                     item['url'] +
                     '\n')


class MoviePipeline(object):
    def process_item(self, item, spider):
        with open("my_meiju.txt", 'a') as fp:
            fp.write(item['name'] + '\n')
