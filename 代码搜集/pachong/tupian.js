const cheerio = require('cheerio')
const http = require('http')
const iconv = require('iconv-lite')
const fs = require('fs')

const {
  writeFile
} = fs

const pg = 5

const url = 'http://tieba.baidu.com/p/5041560765?see_lz=1&pn=' + pg

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
      const html = iconv.decode(Buffer.concat(chunks), 'utf-8')
      // 使用cheerio初始化这个html文件，使里面的dom得以使用类似jquery的方式获取
      const $ = cheerio.load(html, { decodeEntities: false })
      // 遍历页面中所有存储 title 的 dom ，存入 titles 中，并打印出来
      $('.d_post_content.j_d_post_content.clearfix').each(function(i, e)  {
        const $e = $(e)
        titles.push({ title: $e.text() })
        console.log($(this).children('img'));
        // $(this).children('img').each(function(ii, ee) {
        //   const $ee = $(ee)
        //   downImg($ee.attr('src'), i, ii)
        // })
      })
      fs.writeFile(`tp${ pg }.txt`, JSON.stringify(titles), err => {
        if (err) throw err;
        console.log('The file has been saved!');
      });
    })
  })
}

function downImg(imgUrl, i, ii) {
  console.log(111, imgUrl)
  http.get(imgUrl, function(res) {
    var imgData = ''
    res.setEncoding('binary')
    res.on('data', function(chunk) {
      imgData += chunk
    })
    res.on('end', function() {
      fs.writeFile(`tp${ pg }-${ i }-${ ii }.jpg`, imgData, 'binary', function(err) {
        if (err) {
          console.log('down fail', err);
          return
        }
        console.log(`${ i }-${ ii }-down sucess`);
      })
    })
  })
}

getTitle()
