
from scrapy import cmdline

# 列表页面
cmd_str = 'scrapy crawl damao --nolog'

# 播放页面
# cmd_str = 'scrapy crawl damao_detail --nolog'

cmdline.execute(cmd_str.split(' '))