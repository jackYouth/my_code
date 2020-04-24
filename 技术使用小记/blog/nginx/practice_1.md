# 一个前端开发折腾服务器系列_1_nginx配置默认首页的实践 -- 附nginx一些基本操作
### linux命令
#### 基础：linux中路径都可以分成两种，第一种第一个字母是/表示绝对路径，相对于根目录。第二种第一个字母不是/，相对于当前目录

+ 进入文件夹 - cd命令
    + cd .. 表示返回上一层
    + cd 目录 进入指定目录
+ 查看当前文件夹中的所有文件 -ls命令
    ls
+ 查看文件 - cat命令
    cat 文件路径 查看指定文件路径下的文件
+ 编辑文件 - vim命令
    vim 文件路径 查看并编辑指定路径下的文件
    + 进入编辑模式
        + i 进入编辑当前文件的模式
    + 退出编辑模式
        + esc 推出编辑当前文件的模式
    + 删除当前行
        + dd 非编辑模式下，删除光标所在行
    + 退出当前文件
        + :wq 退出并保存当前文件
        + :q 当文件未改动时，可退出当前文件
        + :q! 强制退出当前文件
+ 复制文件
+ 移动文件
+ 重命名文件/文件夹 - mv命令
    mv 文件1 文件2； 将文件1移动至文件2，文件中内容全部移动的同时，文件名由文件1的名称变成文件2的名称。有重命名的效果
+ 创建文件夹 - mkdir命令
    mkdir 文件夹名
+ 新建文件 - vim命令
    vim 文件名 ，i进入编辑模式，编辑后esc退出编辑模式，:wq保存并退出该文件
+ 删除文件/文件夹 - rm命令
    rm 目录 表示删除对应目录下文件夹/文件
+ 查找当前文件夹下的以my开头的文件
    find . -name 'my*' -ls



# nginx配置
    nginx配置的文件默认存放在 /etc/nginx 下，其中nginx.conf表示对nginx的配置，nginx.conf.default是对nginx.conf配置的备份，.sample结尾的也是备份的作用。

### nginx.conf文件
    分成四块内容：全局块、events块、http块、server块，服务器中虚拟主机的配置是在server块中。每一个server块对应一个虚拟主机，一个http块可以包含多个server块，这些server块的配置相互是对立互不影响的，当http中配置和server中配置冲突时，以server块为准。server块的配置一般都放在conf.d文件夹中，在http块中通过include /etc/nginx/conf.d/*.conf;来引入nginx.conf的配置。解析详见[http://blog.51cto.com/zengestudy/1769705](http://blog.51cto.com/zengestudy/1769705)

### conf.d文件夹
    conf.d中放的是对server块的定义，一般一个文件对应一个server块，同样，一个server块会对应一个虚拟主机。server中字段解析：

+ listen 监听端口
+ server_name 域名，可以设置多个域名，通过空格分割
+ root 当前域名访问时对应的服务器中文件路径
+ error_page 配置错误页面
+ location 网页访问路径
    + root 系统文件路径配置
    + alias 系统文件路径配置（常用）
    + index 配置默认读取的文件
    > root和alias的区别：root是用来设置根目录的，而alias是用来重置当前文件的目录。
    ```
        我们正常都会配置一个全局的root /; 这时当我们请求http://www.sydtop.cn/blog这个路径时，在服务器中，就会在root字段对应的系统文件路径再加上blog这个路径下寻找文件。
        如果配置了:
            location /blog {
                alias /site/public
            }
        意思是：将当前寻找文件的路径重置为在/site/public路径下去寻找文件。
        如果配置了：
            location /blog {
                root /site/public
            }
        意思就是：将原先配置的根目录路径/替换成/site/public，然后再拼接上/blog去寻找文件
    ```
### server文件示例：
```
server {
    listen       80;
    #listen       [::]:80 default_server;
    server_name  _;
    root /;

    location /blog {
        alias  /site/;
    }

    error_page 404 /404.html;
        location = /40x.html {
    }

    error_page 500 502 503 504 /50x.html;
        location = /50x.html {
    }
}
```
server块配置解析，详见[nginx.conf配置解析]('https://blog.csdn.net/rth362147773/article/details/78837971')和
[http、server、location字段解析](https://blog.csdn.net/chenweijiSun/article/details/70823482)

### 改变nginx默认首页
    修改nginx配置文件中的default.conf中的配置：
    vim /etc/nginx/conf.d/default.conf，将root改成你想要作为根目录的服务器中的文件夹路径

### 将本机文件上传至服务器
上传：scp 本机文件地址 服务器的用户名@服务器地址:服务器文件地址

下载：scp 服务器文件地址 服务器的用户名@服务器地址:本机文件地址

示例：scp /Users/jackyouth/Downloads/index/js/lanrenzhijia.js root@111.231.217.88:/index/js

注：服务器地址后必须有:符号用来区分ip和服务器中路径。该操作是在本地终端中完成的，上传时需要对应用户名的密码

### 重启nginx
    service nginx restart

### 参考
+ [nginx服务器安装及配置文件详解](https://segmentfault.com/a/1190000002797601)
+ [nginx 中配置多个location](https://blog.csdn.net/ZHangFFYY/article/details/78494637)