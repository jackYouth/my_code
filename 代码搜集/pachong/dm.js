const cheerio = require('cheerio')
const http = require('http')
const iconv = require('iconv-lite')
const fs = require('fs')

const {
  writeFile
} = fs

const url1 = 'http://www.diaomie.com/tv-list-id-'
const url2 = '-pg-'
const url3 = '-order--by--year--letter--area--lang-.html'

let v = [7, 9, 10, 11, 8, 5, 17, 6]
let vi = 0
let i = 1
const titles = []

function getTitle(i, vi) {
  console.log('现在正在抓取第' + vi + '分类' + i + '页title')
  http.get(url1 + v[vi] + url2 + i + url3, function(res) {
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
      $('.show-list.fn-clear h5').each(function(i, e)  {
        const $e = $(e)
        titles.push({ title: $e.text() })
      })
      i++
      if (i <= 5) {
        getTitle(i, vi)
      } else {
        if (vi < 8) {
          titles.push('\n')
          vi++
          i = 1
          getTitle(i, vi)
        } else {
          console.log(titles)
          console.log('共' + i + '页title抓取完毕')
          fs.writeFile('dm.txt', JSON.stringify(titles), (err) => {
            if (err) throw err;
            console.log('The file has been saved!');
          });
        }
      }
    })
  })
}

getTitle(i, vi)
