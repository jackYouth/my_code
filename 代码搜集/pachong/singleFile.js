const cheerio = require('cheerio')
const http = require('http')
const iconv = require('iconv-lite')
const fs = require('fs')
const axios = require('axios')

const {
  writeFile
} = fs

const url = 'http://tieba.baidu.com/p/5041560765?see_lz=1&traceid=#'

const titles = []

function getTitle() {
  http.get(url, function(res) {
    // chunks里面存储着网页的 html 内容，将它zhuan ma传给 cheerio.load 之后
    // 就可以得到一个实现了 jQuery 接口的变量，将它命名为 `$`
    // 剩下就都是 jQuery 的内容了
    const chunks = []
    res.on('data', function(chunk) {
      // 获取所有的html文件
      chunks.push(chunk)
    })
    res.on('end', function() {
      // 使用iconv解码获取到的html文件
      //由于咱们发现此网页的编码格式为gb2312，所以需要对其进行转码，否则乱码
      //依据：“<meta http-equiv="Content-Type" content="text/html; charset=gb2312">”
      const html = iconv.decode(Buffer.concat(chunks), 'UTF-8')
      // 使用cheerio初始化这个html文件，使里面的dom得以使用类似jquery的方式获取
      const $ = cheerio.load(html, { decodeEntities: false })
      // 遍历页面中所有存储 title 的 dom ，存入 titles 中，并打印出来
      $('cc .d_post_content.j_d_post_content.clearfix').each(function(i, e)  {
        const $e = $(e)
        const title = $e.text()
        $(this).children('img').each(function(ii, ee) {
          const $ee = $(ee)
          downImg($ee.attr('src'), i, ii)
        })
        titles.push({
          title: $e.text()
        })
      })

      console.log(titles)
      fs.writeFile('singleFile.txt', JSON.stringify(titles), (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
      });
    })
  })
}

function downImg(imgUrl, i, ii) {
  try {
    console.log('axios', axios)

    axios({
      method: 'get',
      url: imgUrl,
      responseType: 'stream'
    }).then(function(res){
      fs.writeFile(`${ i + ii }.png`, JSON.stringify(titles), (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
      });
      // res.data.pipe(fs.createWriteStream(`./images/${i}/${ ii }.jpg`))
      console.log(`这是第${ i }页，第${ ii }张图片`);
    })

  } catch(e) {
    console.log('err:', e);
  }
}

getTitle()
