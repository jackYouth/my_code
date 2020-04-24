## [项目存放地址：gitlab](http://git.dev.sh.ctripcorp.com/groups/carosd)
## [需求池：tower](https://tower.im/projects/4b85d5ddf4b24ac59202577e3e27548b/)
## [静态资源发布：ares](http://app.ares.fx.ctripcorp.com/portal#/)
## [文档存放：conf](http://conf.ctripcorp.com/)

## gitlab
### gitlab配置ssh：
  + git bash中输入：ssh-keygen -t rsa -C "your_email@example.com"，ctrip的邮箱
  + 进入到存放ssh的文件夹，我的是 D:\Users\suyd\.ssh
  + 找到id_rsa.pub文件，使用记事本打开，将内容复制下来，这就是ssh key
  + 进入gitlab，点击小人头，点击右上角的铅笔图标，tab栏选择ssh keys，将先前复制的内容放入key+ 的输入框中

### gitlab下载项目：
  + gitlab中进入指定项目
  + 选择http模式，获取对应的下载链接
  + git bash中git clone 下载链接，将项目克隆下来


## ares
### ares使用流程：
  + 浏览器中查看线上包：
    + 浏览器中输入ares/，进入包管理平台，获取想要同步的包名称
  + 进入ares模式：
    + 终端中运行ares
  + 下载项目：
    + package download进入下载
    + 输入搜索要下载的包支持模糊搜索
    + 选择要下载的包
    + 输入存放路径（建好文件夹之后，将目录名粘贴进入终端中）
  + 删除项目：
    + package remove
  + 编译：
    + build命令，每次代码更改过之后，或更新版本号之后，都需要编译
  + 发布：
    + package commit，（注意：当当前版本是已发布状态时，不能进行该操作，需要更新一下版本号才行）
  + 更新版本号：
    + package upgrade

  + service start
  + service access
  + service resource access
  + 文件改变后重新编译，则会造成文件名的hash值发生改变，所以要用（上面三个中的一个）命令，来+ 打开文件

  + 登录账号：
    + log in
  + 进入项目所在文件夹
    + open .

### ares发布流程：
  + 三个站点：
    + online对应ctrip（主站），offline一般我们不用，english（国际站，我们用的）
  + 三个环境：
    + fat，uat，pro
    + fat对应的链接的域名中有fws

    + uat对应的链接的域名中有uat
    + pro环境中则没有这段域名
  + 强缓存问题：
    + 一些cdn文件（地址中包含*的文件），即使你通过ares发布了新版本之后，内容也是不会更新的，+ 需要通过 http://request.ctripcorp.com/ ，网站完成cdn缓存清理，才能生效

### ares回退版本：
  + 当前版本点击禁用之后，就会自动使用上一个版本


### ares版本管理：
  + 版本号命名：
    + 版本格式：主版本号.次版本号.修订号
    + 主版本号：当你做了不兼容的API修改，
    + 次版本号：当你做了向下兼容的API修改，
    + 修订号：当你做了向下兼容的问题修正
    + 新建资源的默认起始版本号是1.0.0
  + 版本号状态：
    + 资源包的每个版本都有三个状态：
     + created：
      + ‘预登记’，主要就是提前登记一下版本号，避免大家在包的命名和版本定义中发生冲突。表示已有用户创建该版本，但尚未提交源文件。
    + snapshot：
      + ‘开发板’，表示该版本已提交源代码，但尚未发布或仅发布到FAT环境，此时开发者仍可修改内容，并重新提交这一版本
    + release：
      + ‘发布版’，表示该版本已提交UAT或正式发布，此后开发者虽可在一定条件下禁用这一版本，但无法在修改其内容
  + 版本表示法：<BR>
    对于静态资源的消费者而言，除了直接引用固定版本号外，也可以使用语义化版本的一部分（版本范围语法）来表示想要引用的版本范围。所以有以下几种版本号表示方法：
    + 固定版本号，如1.1.0
    + 最新版本号，用*表示
    + 固定主版本号，以版本号前缀^表示，如^1.1.0
    + 固定次版本号，以版本号前缀~表示，如~1.1.0

## conf
常用：
+ 用车业务
  + 海外租车
+ 国际网站























————————————————————————————————end
