# 一个前端开发折腾服务器系列_3_免费升级https实践
（本文参考网址：[https://cloud.tencent.com/document/product/400/4143](https://cloud.tencent.com/document/product/400/4143)）
### 流程介绍
+ 申请一个免费ssl证书
+ 安装ssl证书
### 申请一个免费ssl证书
  因为我买的是腾讯云服务器，刚好看到他有[免费的ssl证书](https://cloud.tencent.com/product/ssl)，所以就直接申请了，说是一个工作日，但是没想到周末申请，半小时左右就审批下来了，算是一个小惊喜吧。不是腾讯云的话，可以自己搜一下https免费证书，网上应该会有很多。
### 证书安装
  我用的是nginx服务器，他的流程大概是：
+ [下载证书到本地](https://console.cloud.tencent.com/ssl)
+ 获取证书
  看下刚下载下来的的文件夹里的Nginx目录下是不是有这两个文件：SSL证书文件 1_www.domain.com_bundle.crt 和私钥文件，2_www.domain.com.key。（注：www.domain.com是你当前申请ssl证书的域名）
+ 安装证书
  + 将这两个文件使用scp统一上传到服务器中nginx配置的文件夹下（如：scp 本地证书文件地址 root@服务器地址:nginx配置文件夹路径）
  + 更新nginx配置文件，在http模块下新建一个server块
    + vim /etc/nginx/nginx.conf
    ```
    server {
        listen 443; #SSL访问端口号为443
        server_name www.domain.com; #填写绑定证书的域名
        ssl on;     #启用SSL功能
        ssl_certificate 1_www.domain.com_bundle.crt;  #证书文件
        ssl_certificate_key 2_www.domain.com.key; #私钥文件
        ssl_session_timeout 5m;
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2; #按照这个协议配置  #使用的协议
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:HIGH:!aNULL:!MD5:!RC4:!DHE;#按照这个套件配置 #配置加密套件，写法遵循openssl标准
        ssl_prefer_server_ciphers on;
        location / {
            root   html; #站点目录
            index  index.html index.htm;
        }
    }
    ```
  > 注：nginx配置文件的路径每个人可能不同，需要根据实际情况自行寻找。我的服务器中，nginx配置文件夹路径是/etc/nginx/，配置文件是/etc/nginx/nginx.conf。关于nginx配置的问题，我第一篇文章中有简单写了一点[一个前端开发折腾服务器系列_1_nginx配置_1](./practice_1.md)

  + 其他服务器中证书的安装，可以参考我在页首分享的[本文参考网址](https://cloud.tencent.com/document/product/400/4143)