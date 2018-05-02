import os
import scrapy
from scrapy.selector import HtmlXPathSelector
import urllib.request

class DamaoSpider(scrapy.Spider):
    name = "damao"
    allowed_domain = ["9zdm.com"]
    start_urls = [
        "http://www.9zdm.com/type/1/1.html",
    ]

    def parse(self, response):
        print("列表页地址", response.url)
        # current_url = response.url
        # body = response.body
        # unicode_body = response.body_as_unicode()
        # print("damao", unicode_body)
        hxs = HtmlXPathSelector(response)

        images = hxs.select('//div[@class="movie-item"]/a/img/@src').extract()
        titles = hxs.select('//div[@class="movie-item"]/div[@class="meta"]/div/a/@title').extract()
        links = hxs.select('//div[@class="movie-item"]/div[@class="meta"]/div/a/@href').extract()
        next_page = hxs.select('//div[@style="background:#FFF;padding-left:15px;"]/a/@href').extract()

        # print("next_page=" , next_page[len(next_page) - 2])


        for i in range(len(titles)):
            # print(titles[i] + " - " +links[i], "\n")


            showUrl = "{0}{1}".format("http://www.9zdm.com", links[i])
            yield scrapy.Request(url=showUrl, callback=self.showDetailHandler)


            src = images[i]
            if src:
                ab_src = src # "http://www.9zdm.com" +
                file_name = "%s_%s_%s.jpg" % ("damao", i, titles[i])
                dir = os.path.abspath('.')
                work_path = os.path.join(dir, "ibo_project/downloads/")

                # # 这个方法下载文件,并且file_name为文件
                # try:
                #     urllib.request.urlretrieve(ab_src, work_path + file_name)
                # except:
                #     pass

        url_next_page = "http://www.9zdm.com" + next_page[len(next_page) - 2]
        print("下一页地址：" + url_next_page)

        # yield scrapy.Request(url=url_next_page, callback=self.parse)



    # 处理详情页面
    def showDetailHandler(self, response):
        print("详情页地址", response.url)
        hxs = HtmlXPathSelector(response)
        link = hxs.select('//div[@class="online-button"]/a/@href').extract()
        playerUrl = "{0}{1}".format("http://www.9zdm.com", link[0])
        yield scrapy.Request(url=playerUrl, callback=self.playerDetailHandler)


    def playerDetailHandler(self, response):
        print("播放器地址", response.url)
