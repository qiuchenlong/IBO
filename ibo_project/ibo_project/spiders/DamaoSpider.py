import os
import scrapy
from scrapy.selector import HtmlXPathSelector
import urllib.request, urllib.parse
import requests
import re
import execjs

from ..items import IboProjectItem

# 执行本地的js
def get_js():
    # f = open("D:/WorkSpace/MyWorkSpace/jsdemo/js/des_rsa.js",'r',encoding='UTF-8')
    f = open(os.path.abspath("") + "/js/tools.js", 'r', encoding='UTF-8')
    line = f.readline()
    htmlstr = ''
    while line:
        htmlstr = htmlstr + line
        line = f.readline()
    return htmlstr


def get_js2():
    # f = open("D:/WorkSpace/MyWorkSpace/jsdemo/js/des_rsa.js",'r',encoding='UTF-8')
    f = open(os.path.abspath("") + "/js/hls.js", 'r', encoding='UTF-8')
    line = f.readline()
    htmlstr = ''
    while line:
        htmlstr = htmlstr + line
        line = f.readline()
    return htmlstr


def get_js3():
    # f = open("D:/WorkSpace/MyWorkSpace/jsdemo/js/des_rsa.js",'r',encoding='UTF-8')
    f = open(os.path.abspath("") + "/js/md5.js", 'r', encoding='UTF-8')
    line = f.readline()
    htmlstr = ''
    while line:
        htmlstr = htmlstr + line
        line = f.readline()
    return htmlstr


def get_js4():
    # f = open("D:/WorkSpace/MyWorkSpace/jsdemo/js/des_rsa.js",'r',encoding='UTF-8')
    f = open(os.path.abspath("") + "/js/eval.js", 'r', encoding='UTF-8')
    line = f.readline()
    htmlstr = ''
    while line:
        htmlstr = htmlstr + line
        line = f.readline()
    return htmlstr



class DamaoSpider(scrapy.Spider):
    name = "damao"
    allowed_domain = ["9zdm.com"]
    start_urls = [
        "http://www.9zdm.com/type/1/1.html",
    ]

    item = IboProjectItem()

    def __init__(self):
        print("初始化...")


    def parse(self, response):
        print("列表页地址", response.url)
        # current_url = response.url
        # body = response.body
        # unicode_body = response.body_as_unicode()
        # print("damao", unicode_body)
        hxs = HtmlXPathSelector(response)

        # 图片
        images = hxs.select('//div[@class="movie-item"]/a/img/@src').extract()
        # 标题
        titles = hxs.select('//div[@class="movie-item"]/div[@class="meta"]/div/a/@title').extract()
        # 详情链接
        links = hxs.select('//div[@class="movie-item"]/div[@class="meta"]/div/a/@href').extract()
        # 下一页地址
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
        # 播放详情链接
        link = hxs.select('//div[@class="online-button"]/a/@href').extract()
        playerUrl = "{0}{1}".format("http://www.9zdm.com", link[0])
        yield scrapy.Request(url=playerUrl, callback=self.playerDetailHandler)


    # 处理播放页面
    def playerDetailHandler(self, response):
        print("播放器地址", response.url)
        hxs = HtmlXPathSelector(response)
        # 电影名称
        movie_name = hxs.select('//h3[@class="movie-title"]/text()').extract()
        # self.item["name"] = movie_name[0] 由于爬虫是异步进行的，所以废弃在这里赋属性值

        # 播放器请求地址
        player_url = hxs.select('//div[@class="player"]/iframe/@src').extract()
        print("player_url", player_url)

        yield scrapy.Request(player_url[0], meta={'movie_name': movie_name[0]}, callback=self.parse2)


    def parse2(self, response):
        movie_name = response.meta['movie_name']

        hxs = HtmlXPathSelector(response)

        # 二次解析播放器地址
        player_url = hxs.select('//iframe/@src').extract()
        print("2 次 player_url", player_url)

        if len(player_url):
            if "youku/" in player_url[0]:
                yield scrapy.Request(player_url[0], meta={'movie_name': movie_name}, callback=self.parse3)

            # type : youku pptv mgtv
            if "guhuo/a2.php" in player_url[0] or \
                    ("guhuo/" in player_url[0] and "&type=youku" in player_url[0]) or \
                    ("guhuo/" in player_url[0] and "&type=pptv" in player_url[0]) or \
                    ("guhuo/" in player_url[0]) \
                    :
                yield scrapy.Request(player_url[0], meta={'movie_name': movie_name}, callback=self.parse_guhuo_play_url)

            # a1 优酷视频
            # a3 西瓜视频
            if "mp4/a1.php" in player_url[0] or \
                    "guhuo/a3.php" in player_url[0] or \
                    "mp4/a2.php" in player_url[0]:  # 优酷电影 | 腾讯视频
                yield scrapy.Request(player_url[0], meta={'movie_name': movie_name}, callback=self.parse_guhuo_play_url_a3)

            # 爱奇艺
            if "api.47ks.com/webcloud/" in player_url[
                0]:  # https://api.47ks.com/webcloud/?v=http://www.iqiyi.com/v_19rrc9xgk0.html
                # yield scrapy.Request(player_url[0], headers={'content-type': 'application/json',
                #                                              'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:22.0) Gecko/20100101 Firefox/22.0',
                #                                              'referer': 'http://api.tianxianle.com/jx/dapi.php?id=qKt1naKhqaajnnBtlZtpaWFi'},
                #                      method="GET",
                #                      callback=self.parse_aiqiyi_play_url)

                data = {}
                headers = {'content-type': 'application/json',
                           'cookie': 'FSKS_Sign=280E9D0AAC28952D7B3DFEBC56F3E394B2250AFCF3EECE28887B150C03DE9797F8FC30780EBBE936; UM_distinctid=1625673d44899b-08307cc4c0745b-336d7b05-13c680-1625673d449a62; CNZZDATA1260594368=245630151-1521864228-null%7C1522507823; FSKS_Token=a3JCa3kwdHk5UlVmVGI5UzM5NTFNbVVaX0tuX08zZ3hCak8zYjNQVWhGSnFybkFkakNLblEwUzR3RTNyVVdhbGhLRnM1c1BRNHc5WVBtdGtFbGlvVUlxUjE2SlpnSy9xSzFpb2wyeWI3RU0vUlpsNnpuN1plUkE; yd_srvbl=3411f6a3e1cab1311bcb7abd1a80b2fc',
                           "upgrade-insecure-requests": '1',
                           'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36',
                           'referer': 'http://api.tianxianle.com/jx/dapi.php?id=qKt1naKhqaajnnBtlZtpaWFi'}

                r = requests.get('https://api.47ks.com/webcloud/?v=http://www.iqiyi.com/v_19rrc9xgk0.html', data=data,
                                 headers=headers)
                self.parse_aiqiyi_play_url(movie_name, r)

                # k4 = md5(cache.toString() + vd.toString() + document.domain + md5('41d785ff9079cee021d2bb9d715f7582'));

                # print("p:", '''
                # "e1r=new Array();e1r[parseInt((decodeURIComponent("%33")).toString())]=(String.fromCharCode((decodeURIComponent("%35")).toString()*((parseInt((8).toString())+parseInt(0))).toString()+12)).toString();e1r[parseInt((decodeURIComponent("%32")).toString())]=((parseInt(-1)+parseInt((9).toString()))).toString();e1r[parseInt(("\u0030").toString())]=("\u0032").toString();e1r[parseInt((1).toString())]=(String.fromCharCode(("\u0035").toString()*(decodeURIComponent("%38")).toString()+11)).toString();e1r[parseInt((decodeURIComponent("%36")).toString())]=((parseInt(-2)+parseInt((decodeURIComponent("%35")).toString()))).toString();e1r[parseInt((String.fromCharCode(("\u0035").toString()*(8).toString()+13)).toString())]=((parseInt(("\u0033").toString())+parseInt((decodeURIComponent("%31")).toString()))).toString();e1r[parseInt(("\u0034").toString())]=(String.fromCharCode((decodeURIComponent("%35")).toString()*("\u0038").toString()+16)).toString();eval("ca"+"ch"+"e=e1r.join('')");eval(String.fromCharCode(("\u0031").toString()+(0).toString()+(decodeURIComponent("%37")).toString())+String.fromCharCode((5).toString()+((parseInt(-4)+parseInt((String.fromCharCode(((parseInt((decodeURIComponent("%34")).toString())+parseInt(((parseInt((7).toString())+parseInt(-6))).toString()))).toString()*(decodeURIComponent("%38")).toString()+14)).toString()))).toString())+String.fromCharCode(((parseInt(-4)+parseInt(10))).toString()+(decodeURIComponent("%31")).toString())+String.fromCharCode((1).toString()+("\u0030").toString()+(String.fromCharCode((String.fromCharCode((decodeURIComponent("%35")).toString()*(decodeURIComponent("%38")).toString()+13)).toString()*("\u0038").toString()+17)).toString())+String.fromCharCode(("\u0031").toString()+("\u0030").toString()+(0).toString())+String.fromCharCode((decodeURIComponent("%35")).toString()+("\u0033").toString())+String.fromCharCode((decodeURIComponent("%34")).toString()+(String.fromCharCode((decodeURIComponent("%35")).toString()*("\u0038").toString()+8)).toString())+String.fromCharCode((decodeURIComponent("%39")).toString()+("\u0039").toString())+String.fromCharCode(((parseInt(-8)+parseInt(17))).toString()+(String.fromCharCode((String.fromCharCode((String.fromCharCode((String.fromCharCode((5).toString()*(String.fromCharCode((String.fromCharCode((String.fromCharCode((5).toString()*(decodeURIComponent("%38")).toString()+13)).toString()*(String.fromCharCode((decodeURIComponent("%35")).toString()*(8).toString()+16)).toString()+13)).toString()*(String.fromCharCode(("\u0035").toString()*(decodeURIComponent("%38")).toString()+16)).toString()+16)).toString()+13)).toString()*(8).toString()+13)).toString()*("\u0038").toString()+13)).toString()*("\u0038").toString()+15)).toString())+String.fromCharCode((decodeURIComponent("%39")).toString()+((parseInt(-5)+parseInt(14))).toString())+String.fromCharCode(("\u0031").toString()+(0).toString()+(decodeURIComponent("%34")).toString())+String.fromCharCode(("\u0031").toString()+(decodeURIComponent("%30")).toString()+(decodeURIComponent("%31")).toString())+String.fromCharCode(("\u0034").toString()+(6).toString())+String.fromCharCode((decodeURIComponent("%31")).toString()+("\u0031").toString()+(decodeURIComponent("%36")).toString())+String.fromCharCode(((parseInt(("\u0033").toString())+parseInt(-2))).toString()+("\u0031").toString()+(decodeURIComponent("%31")).toString())+String.fromCharCode(("\u0038").toString()+(3).toString())+String.fromCharCode((decodeURIComponent("%31")).toString()+("\u0031").toString()+(decodeURIComponent("%36")).toString())+String.fromCharCode(((parseInt(0)+parseInt((1).toString()))).toString()+(decodeURIComponent("%31")).toString()+(4).toString())+String.fromCharCode((1).toString()+(0).toString()+((parseInt(-6)+parseInt(11))).toString())+String.fromCharCode(((parseInt(-2)+parseInt(("\u0033").toString()))).toString()+(1).toString()+("\u0030").toString())+String.fromCharCode(("\u0031").toString()+(0).toString()+(decodeURIComponent("%33")).toString())+String.fromCharCode(((parseInt(("\u0039").toString())+parseInt(-5))).toString()+(decodeURIComponent("%30")).toString())+String.fromCharCode((decodeURIComponent("%34")).toString()+((parseInt(-1)+parseInt((2).toString()))).toString())+String.fromCharCode(((parseInt(-2)+parseInt(((parseInt((2).toString())+parseInt((4).toString()))).toString()))).toString()+((parseInt(("\u0037").toString())+parseInt(-4))).toString())+String.fromCharCode(("\u0031").toString()+(1).toString()+(decodeURIComponent("%38")).toString())+String.fromCharCode(((parseInt(((parseInt(((parseInt(((parseInt(-9)+parseInt(12))).toString())+parseInt((decodeURIComponent("%33")).toString()))).toString())+parseInt(-2))).toString())+parseInt(-3))).toString()+((parseInt((3).toString())+parseInt(-3))).toString()+(decodeURIComponent("%30")).toString())+String.fromCharCode(("\u0034").toString()+(6).toString())+String.fromCharCode(((parseInt(((parseInt((2).toString())+parseInt(((parseInt(-4)+parseInt((5).toString()))).toString()))).toString())+parseInt(-2))).toString()+("\u0031").toString()+(decodeURIComponent("%36")).toString())+String.fromCharCode(((parseInt(("\u0033").toString())+parseInt(-2))).toString()+("\u0031").toString()+(decodeURIComponent("%31")).toString())+String.fromCharCode(("\u0038").toString()+(3).toString())+String.fromCharCode(((parseInt(((parseInt((2).toString())+parseInt(((parseInt(-4)+parseInt((5).toString()))).toString()))).toString())+parseInt(-2))).toString()+("\u0031").toString()+(decodeURIComponent("%36")).toString())+String.fromCharCode(((parseInt(0)+parseInt((1).toString()))).toString()+(decodeURIComponent("%31")).toString()+(4).toString())+String.fromCharCode((1).toString()+(0).toString()+((parseInt(-6)+parseInt(11))).toString())+String.fromCharCode(((parseInt(-2)+parseInt(("\u0033").toString()))).toString()+(1).toString()+("\u0030").toString())+String.fromCharCode(("\u0031").toString()+(0).toString()+(decodeURIComponent("%33")).toString())+String.fromCharCode(((parseInt(("\u0039").toString())+parseInt(-5))).toString()+(decodeURIComponent("%30")).toString())+String.fromCharCode((decodeURIComponent("%34")).toString()+((parseInt(-1)+parseInt((2).toString()))).toString())+String.fromCharCode(((parseInt(-2)+parseInt(((parseInt((2).toString())+parseInt((4).toString()))).toString()))).toString()+((parseInt(("\u0037").toString())+parseInt(-4))).toString())+String.fromCharCode(((parseInt(((parseInt(((parseInt(((parseInt(-9)+parseInt(12))).toString())+parseInt((decodeURIComponent("%33")).toString()))).toString())+parseInt(-2))).toString())+parseInt(-3))).toString()+((parseInt((3).toString())+parseInt(-3))).toString()+(decodeURIComponent("%30")).toString())+String.fromCharCode(((parseInt(("\u0033").toString())+parseInt(-2))).toString()+("\u0031").toString()+(decodeURIComponent("%31")).toString())+String.fromCharCode((decodeURIComponent("%39")).toString()+((parseInt(-5)+parseInt(14))).toString())+String.fromCharCode((1).toString()+("\u0031").toString()+("\u0037").toString())+String.fromCharCode(((parseInt(-5)+parseInt(("\u0036").toString()))).toString()+((parseInt(((parseInt((decodeURIComponent("%33")).toString())+parseInt((1).toString()))).toString())+parseInt(-4))).toString()+("\u0039").toString())+String.fromCharCode(("\u0031").toString()+(decodeURIComponent("%30")).toString()+(decodeURIComponent("%31")).toString())+String.fromCharCode((1).toString()+(1).toString()+(decodeURIComponent("%30")).toString())+String.fromCharCode(((parseInt(((parseInt((2).toString())+parseInt(((parseInt(-4)+parseInt((5).toString()))).toString()))).toString())+parseInt(-2))).toString()+("\u0031").toString()+(decodeURIComponent("%36")).toString())+String.fromCharCode(("\u0034").toString()+(6).toString())+String.fromCharCode((1).toString()+(0).toString()+((parseInt((decodeURIComponent("%39")).toString())+parseInt(-9))).toString())+String.fromCharCode(((parseInt(-9)+parseInt(10))).toString()+("\u0031").toString()+((parseInt((7).toString())+parseInt(-6))).toString())+String.fromCharCode((decodeURIComponent("%31")).toString()+(decodeURIComponent("%30")).toString()+(decodeURIComponent("%39")).toString())+String.fromCharCode((String.fromCharCode((decodeURIComponent("%35")).toString()*((parseInt(0)+parseInt((String.fromCharCode(((parseInt(-9)+parseInt(14))).toString()*("\u0038").toString()+16)).toString()))).toString()+17)).toString()+(7).toString())+String.fromCharCode((1).toString()+(0).toString()+((parseInt(-6)+parseInt(11))).toString())+String.fromCharCode(((parseInt(-2)+parseInt(("\u0033").toString()))).toString()+(1).toString()+("\u0030").toString())+"\x2b\x6d\x64\x35\x28\x27\x34\x31\x64\x37\x38\x35\x66\x66\x39\x30\x37\x39\x63\x65\x65\x30\x32\x31\x64\x32\x62\x62\x39\x64\x37\x31\x35\x66\x37\x35\x38\x32\x27\x29"+String.fromCharCode((decodeURIComponent("%34")).toString()+((parseInt(-1)+parseInt((2).toString()))).toString())+String.fromCharCode((decodeURIComponent("%35")).toString()+("\u0039").toString()));"
                # ''')
                #
                #
                # print('\u0030')
                # print('\x2b\x6d\x64\x35\x28\x27\x34\x31\x64\x37\x38\x35\x66\x66\x39\x30\x37\x39\x63\x65\x65\x30\x32\x31\x64\x32\x62\x62\x39\x64\x37\x31\x35\x66\x37\x35\x38\x32\x27\x29')

    # http://www.9zdm.com/show/41903.html
    def parse_aiqiyi_play_url(self, movie_name, response):
        self.item['name'] = movie_name

        c = response.text
        print(c)
        c = str(c).strip()
        c = c.replace("\n", "").replace('\r', '')

        ## begin get params
        cache_pa = r'(.*?)var cache = (\d*);'
        cache_maObj = re.match(cache_pa, c, re.M | re.I)
        cache_value = cache_maObj.group(2)

        get_pa = r'(.*?)<input type="hidden" id="get" value="(.*?)">'
        get_maObj = re.match(get_pa, c, re.M | re.I)
        get_value = get_maObj.group(2)
        print('get_value', get_value)

        tm_pa = r'(.*?)<input type="hidden" id="tm" value="(.*?)">'
        tm_maObj = re.match(tm_pa, c, re.M | re.I)
        tm_value = tm_maObj.group(2)
        print('tm_value', tm_value)

        k3_value = ''
        vd_value = ''
        eval_pattern = r'(.*)eval(.*?);'
        eval_matchObj = re.match(eval_pattern, c, re.M | re.I)
        if eval_matchObj:
            iStr = eval_matchObj.group(2)
            iStr = eval(iStr)
            print("eval", iStr)
            iArray = str(iStr).split(";")

            for i in range(len(iArray) - 1):
                key = iArray[i].split("=")[0]
                value = iArray[i].split("=")[1].replace("'", "")
                if key == "k3":
                    k3_value = value
                if key == "vd":
                    vd_value = value

        print("k3_value", k3_value)
        print("vd_value", vd_value)

        vd_end_value = ""
        vd_end_pattern = r'(.*)md5x\(vd \+ "(.*?)"\)'
        vd_end_matchObj = re.match(vd_end_pattern, c, re.M | re.I)
        if vd_end_matchObj:
            vd_end_value = vd_end_matchObj.group(2)

        print("vd_end_value", vd_end_value)

        ep_value = ""
        ep_url = ""
        ep_url_pattern = r'(.*)<script type="text/javascript" src="//kr.47ks.com(.*?)"></script>'
        ep_url_matchObj = re.match(ep_url_pattern, c, re.M | re.I)
        if ep_url_matchObj:
            ep_url_value = ep_url_matchObj.group(2)

        ep_url_value = "https://kr.47ks.com" + ep_url_value
        print("ep_url_value", ep_url_value)
        ep_result = requests.get(url=ep_url_value, headers={
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36',
            'cookie': 'FSKS_Sign=280E9D0AAC28952D7B3DFEBC56F3E394B2250AFCF3EECE28887B150C03DE9797F8FC30780EBBE936; UM_distinctid=1625673d44899b-08307cc4c0745b-336d7b05-13c680-1625673d449a62; CNZZDATA1260594368=245630151-1521864228-null%7C1522507823; FSKS_Token=a3JCa3kwdHk5UlVmVGI5UzM5NTFNbVVaX0tuX08zZ3hCak8zYjNQVWhGSnFybkFkakNLblEwUzR3RTNyVVdhbGhLRnM1c1BRNHc5WVBtdGtFbGlvVUlxUjE2SlpnSy9xSzFpb2wyeWI3RU0vUlpsNnpuN1plUkE; yd_srvbl=3411f6a3e1cab1311bcb7abd1a80b2fc',
            'referer': 'https://api.47ks.com/webcloud/?v=http://www.iqiyi.com/v_19rrc9xgk0.html'
        }).text
        print("ep_result", ep_result)
        ep_value = ep_result.split("=")[1].replace("\"", "").replace(";", "").strip()
        print("ep_value", ep_value)
        ## end get params

        pa = r'(.*)\$.post\((.*?)},'
        # , "type": (.*?), "siteuser": (.*?), "md5": (.*?), "hd": (.*?), "lg": (.*?), "iqiyicip": (.*?)}(.*?)
        # pa = pa.strip()

        maObj = re.match(pa, c, re.M | re.I)
        # print("--->", maObj)
        # if maObj:
        # print("matchObj", maObj.group(0))
        # print("matchObj", maObj.group(1))
        # print("matchObj", maObj.group(2))
        # print("matchObj", maObj.group(3))

        sStart = '"/config/webmain.php", {'
        sEnd = '},'
        iStart = c.find(sStart)
        iEnd = c.find(sEnd)

        c = c[iStart + len(sStart): iEnd + len(sEnd)]

        pa2 = r'(.*?):(.*?),'

        maObj2 = re.findall(pa2, c)

        json_date = dict()
        for m in maObj2:
            json_date[m[0].strip().replace('"', "")] = m[1].strip().replace('"', "").replace('}', '')

        # print(json_date)

        '''
        var ptiqy = 0;
        var errid = 0;
        var cache = 1523793251;
        var k3 = md5(cache);
        var k4 = md5(k3);
        var vd = md5(k3 + k4);
        '''

        # 数字签名
        jsstr = get_js3()
        ctx = execjs.compile(jsstr)
        k3 = ctx.call('md5', cache_value)
        k4 = ctx.call('md5', k3)
        vd = ctx.call('md5', k3 + k4)

        # k3_value = "b15197083da54548e639c30bacd5a228"
        # vd_value = "8e91f42109903ee6"
        # vd_end_value = "6cc7e4efc127d98ec0ab039ab642cc11"
        # get_value = "BB61034856DBDCB5C54E2594C9CB36CAA86AA28214C45DC7"
        # tm_value = "4572941396"
        # ep_value = "C6BC042FA7ABB46D8D4A83F2B125E9A120DBA8EB1E3FD1133C983337971CF5144B0F2BF97F4C99411F130247B8A7824D67535A88F6895B815092BD57C92C5CA70778BA82AB0B1A1DCE706945B3AA6BCD7CAD6DA949B94D21562D1146EC6B2DAFE85ACD44F5FDAB2848AF7078534377AA"

        k3 = k3_value
        vd = vd_value

        # k3 = "ce27b3614d49bc19bc438cf29996b88a"
        # vd = "140101e56ea38feb"

        # k3 = ctx.call('md5', "1524310204")
        # k4 = ctx.call('md5', k3) ## ctx.call('md5', 1524304287) # 7da4b   2116f
        # vd = ctx.call('md5', k3 + k4)

        # 'd5e54b16d36cfb71724fea670e190318'
        # "4e22b13e9424152f6829abcadb8c37f1"

        # js4str = get_js4()
        # ctx4 = execjs.compile(js4str)
        # ctx4.call('eval')
        # print("---->>>", ctx.call('eval'))

        # k3 = "8ce457521be4c45d706e7e50f5b427da"
        # vd = "f8eda7c8593ffb8f"

        # k4 = ctx.call('k4_func', md5('41d785ff9079cee021d2bb9d715f7582'))
        # vd = "c964be114a4f3372"
        cache_value = '2384843'
        # print("---->>>", ctx.call('md5', cache_value, vd))

        # cache = e1r.join('')
        # print("---->>>", ctx.call('md5', cache_value, vd))

        k4 = ctx.call('md5',
                      cache_value + vd + "api.47ks.com" + ctx.call('md5', "41d785ff9079cee021d2bb9d715f7582"))

        # k4 = md5(cache.toString() + vd.toString() + document.domain + md5('41d785ff9079cee021d2bb9d715f7582'));

        kk33 = ctx.call('get', k4)

        json_date["k"] = ctx.call('md5x', vd + vd_end_value)  # 正确的
        json_date["k2"] = ctx.call('md5', k3)  # 正确的
        json_date["k3"] = ctx.call('encodeURIComponent', kk33)

        # print("\x6b\x33\x3d\x27\x65\x37\x66\x31\x30\x36\x32\x31\x62\x63\x39\x31\x65\x38\x34\x61\x62\x32\x65\x32\x37\x65\x64\x39\x64\x65\x35\x33\x62\x65\x39\x33\x27\x3b\x76\x64\x3d\x27\x34\x61\x34\x38\x61\x31\x34\x35\x63\x37\x31\x32\x39\x38\x35\x31\x27\x3b")

        base_url = "https://api.47ks.com/config/webmain.php"
        headers = {
            'accept': 'application/json, text/javascript, */*; q=0.01',
            'content-type': 'application/x-www-form-urlencoded',
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36',
            'cookie': 'FSKS_Sign=280E9D0AAC28952D7B3DFEBC56F3E394B2250AFCF3EECE28887B150C03DE9797F8FC30780EBBE936; UM_distinctid=1625673d44899b-08307cc4c0745b-336d7b05-13c680-1625673d449a62; CNZZDATA1260594368=245630151-1521864228-null%7C1522507823; FSKS_Token=a3JCa3kwdHk5UlVmVGI5UzM5NTFNbVVaX0tuX08zZ3hCak8zYjNQVWhGSnFybkFkakNLblEwUzR3RTNyVVdhbGhLRnM1c1BRNHc5WVBtdGtFbGlvVUlxUjE2SlpnSy9xSzFpb2wyeWI3RU0vUlpsNnpuN1plUkE; yd_srvbl=3411f6a3e1cab1311bcb7abd1a80b2fc',
            'x-requested-with': 'XMLHttpRequest',
            # 'origin': 'https://api.47ks.com',
            'referer': 'https://api.47ks.com/webcloud/?v=http://www.iqiyi.com/v_19rrc9xgk0.html'
        }

        # text_data = "k=8e8063830469a2f308cd2f6265814198&k2=b2e746d9da513be8ac8c1e4bc350c7b6&k3=result%253AQlqJTYBYWI0qd9TsBEyCurqM4kMWJvEWU06%252FdN%252BIwzo%253D&ep=E2F03EAEFA9A92B51A8D87E8793B2F71759BC0FD931C5A4FD91F9651F217A9B5EBB6DD62D0A26B4DC26F413656EAC1CA32D28B4D0377148A289145018CCDBC9744DD28234E088FD86B38BA23E0699BB18283A9D206B602EDFF81B073FA8FFA27DE14A6537E8959ADB00CC7305A25D6D2&cip=27.152.77.1&cip_hex=1b984d01&csign=BB61034856DBDCB5C54E2594C9CB36CAA86AA28214C45DC7&tm=4572840551&v=http%3A%2F%2Fwww.iqiyi.com%2Fv_19rrc9xgk0.html&pt=auto&nip=null&from=http%3A%2F%2Fapi.tianxianle.com%2Fjx%2Fdapi.php%3Fid%3DqKt1naKhqaajnnBtlZtpaWFi&mode="

        json_date['nip'] = 'null'
        json_date['mode'] = ''

        k = json_date['k']
        k2 = json_date['k2']
        k3 = json_date['k3']
        ep = ep_value
        cip = json_date['cip']
        cip_hex = json_date['cip_hex']
        csign = get_value
        tm = tm_value
        v = json_date['v']
        pt = json_date['pt']
        nip = json_date['nip']
        sfrom = json_date['from']
        mode = json_date['mode']

        v = urllib.parse.quote(v).replace("/", "%2F")
        sfrom = urllib.parse.quote(sfrom).replace("/", "%2F")

        text_data = "k=%s&" \
                    "k2=%s&" \
                    "k3=%s&" \
                    "ep=%s&" \
                    "cip=%s&" \
                    "cip_hex=%s&" \
                    "csign=%s&" \
                    "tm=%s&" \
                    "v=%s&" \
                    "pt=%s&" \
                    "nip=%s&" \
                    "from=%s&" \
                    "mode=%s" % \
                    (k, k2, k3, ep, cip, cip_hex, csign, tm, v, pt, nip, sfrom, mode)

        print("text_data = ", text_data)

        result = requests.post(base_url, data=text_data, headers=headers).json()
        # print(eval(result))

        rtmp_video_url = result['url']
        print("1最终的视频地址", rtmp_video_url)

        self.item["url"] = rtmp_video_url
        yield self.item


    def parse3(self, response):
        self.item['name'] = response.meta['movie_name']

        hxs = HtmlXPathSelector(response)
        hd_md5 = hxs.select('//input[@id="hdMd5"]/@value').extract()

        c = response.text

        c = str(c).strip()
        c = c.replace("\n", "")

        pattern = r'(.*)eval(.*?);'
        matchObj = re.match(pattern, c, re.M | re.I)
        if matchObj:
            iStr = matchObj.group(2)
            iStr = eval(iStr)

            sMd5 = str(iStr)
            patt = r'(.*).val(.*?);'
            mObj = re.match(patt, sMd5, re.M | re.I)
            if mObj:
                hd_md5 = mObj.group(2)
                hd_md5 = eval(hd_md5)
                print("hd_md5", hd_md5)

        pa = r'(.*)\$.post\((.*?), '
        # , "type": (.*?), "siteuser": (.*?), "md5": (.*?), "hd": (.*?), "lg": (.*?), "iqiyicip": (.*?)}(.*?)
        # pa = pa.strip()

        maObj = re.match(pa, c, re.M | re.I)
        # print("--->", maObj)
        if maObj:
            # print("matchObj", maObj.group(0))
            # print("matchObj", maObj.group(1))
            print("matchObj", maObj.group(2))
            # print("matchObj", maObj.group(3))

        sStart = '"url.php", {'
        sEnd = 'iqiyicip},'
        iStart = c.find(sStart)
        iEnd = c.find(sEnd)

        c = c[iStart + len(sStart): iEnd + len(sEnd)]

        pa2 = r'(.*?):(.*?),'

        maObj2 = re.findall(pa2, c)

        json_date = dict()
        for m in maObj2:
            json_date[m[0].strip().replace('"', "")] = m[1].strip().replace('"', "").replace('}', '')

        base_url = "https://apis.tianxianle.com/youku/url.php"

        # 数字签名
        jsstr = get_js()
        ctx = execjs.compile(jsstr)
        hd_md5 = ctx.call('sign', hd_md5)

        json_date["md5"] = hd_md5

        result = requests.post(base_url, json_date).json()

        rtmp_video_url = result['url']

        print("4最终的视频地址", urllib.parse.unquote(rtmp_video_url))

        # item = IboProjectItem()
        self.item["url"] = urllib.parse.unquote(rtmp_video_url)

        yield self.item

        # print("hd_md5", hd_md5)

        # bit = '\x24\x28\x27\x23\x68\x64\x4d\x64\x35\x27\x29\x2e\x76\x61\x6c\x28\x27\x66\x39\x61\x38\x38\x61\x63\x63\x31\x35\x36\x35\x62\x63\x30\x64\x30\x63\x31\x65\x65\x33\x62\x34\x64\x64\x30\x66\x31\x62\x32\x62\x27\x29\x3b'
        #
        # print("--------")
        # print("bit", type(bit), bit, len(bit))
        # print(bytes(bit).decode("utf-8"))
        # print(bit.encode("utf-8"))

    def parse_guhuo_play_url(self, response):
        self.item['name'] = response.meta['movie_name']

        c = response.text

        # print(c)

        # c = str(c).strip()
        c = c.replace("\n", "").replace("\r", "")

        # print(c, len(c))

        pattern = r'(.*)var postData = {(.*?)};(.*)'
        matchObj = re.match(pattern, c, re.M | re.I)
        # print(matchObj)
        if matchObj:
            iStr = matchObj.group(2)

            iStr = iStr.replace("\t", "")

            pa = r'(.*?):(.*?),'

            maObj2 = re.findall(pa, iStr)

            json_date = dict()
            for m in maObj2:
                json_date[m[0].strip().replace('"', "")] = m[1].strip().replace('"', "").replace('}', '')

            # print(json_date)

            tk = json_date['tk']
            tk = tk[tk.find("(") + 1: tk.find(")")]

            # 数字签名
            jsstr = get_js2()
            ctx = execjs.compile(jsstr)
            tks = ctx.call('encodeURIComponent', tk)  # ''

            json_date[
                'tk'] = tks  # "UHNHb1lseXFZUUlSTThvcEd6am9hTnBjdTc0cWRNNURNc28yZ3QrRVNGdG03ei9kcG5LUnArRFV0cFZNV3UvcA%3D%3D"
            # json_date['timestamp'] = "1523784019"
            json_date['cip'] = "27.152.77.136"  # V
            # json_date['type'] = 'mgtv' #x
            # json_date['sign'] = "359e30eaf3c9477045e0dd7d34ee0ec8"
            # json_date['v'] = "https://www.mgtv.com/b/321502/644059.html" x

            base_url = "http://api.tianxianle.com/guhuo/video.v2.php"

            # json_date = {'tk': 'UHNHb1lseXFZUUlSTThvcEd6am9hTnBjdTc0cWRNNURNc28yZ3QrRVNGdGpBMUVRNUY0QzFQSTRUSktjdExDcA%3D%3D',
            #  'cip': 'returnCitySN.cip', 'timestamp': '1523784145', 'sign': '7b1a6b467f7d38a897246b344cfbdfec',
            #  'v': 'https://www.mgtv.com/b/321502/644059.html'}

            print(json_date)

            result = requests.post(url=base_url,
                                   data=json_date).json()

            print(result)

            rtmp_video_url = result['url']

            print("3最终的视频地址", rtmp_video_url)

            self.item["url"] = rtmp_video_url

            yield self.item

    # （西瓜视频）今日头条
    def parse_guhuo_play_url_a3(self, response):
        self.item['name'] = response.meta['movie_name']

        c = response.text
        c = c.replace("\n", "").replace("\r", "")
        pattern = r'(.*)var vid="(.*?)"(.*)'
        matchObj = re.match(pattern, c, re.M | re.I)
        print(matchObj)
        if matchObj:
            xiguo_video_url = matchObj.group(2)
            print("2最终的视频地址", xiguo_video_url)
            self.item["url"] = xiguo_video_url
            yield self.item

# print(1)
# jsstr = get_js()
# print(2)
# ctx = execjs.compile(jsstr)
# print(2)
# hd_md5 = ctx.call('sign', '1111')
# print(hd_md5)