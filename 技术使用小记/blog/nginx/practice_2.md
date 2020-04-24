# 一个前端开发折腾服务器系列_2_git部署服务器实践
[参考文章：http://www.cnblogs.com/shaohuixia/p/5503521.html]（http://www.cnblogs.com/shaohuixia/p/5503521.html）
### 服务端准备工作
+ 确保安装git
+ 新建一个用于代码部署的无特权用户，降低服务器被攻击的风险
  + useradd -m git
  + passwd git  #设置该用户的用户名，可以不使用密码
+ 新建一个目录作为部署代码的根目录
  + mkdir /home/user/git_repository
+ 进入项目根目录，初始化为git仓库
  + cd /home/user/git_repository
  + git init
+ 为这个git设置所有者，以便在本地可以使用这个所有者登陆并上传代码到服务器
  + cd ..   (退回到git仓库的父级目录)
  + sudo chown -R git:git git_repository   (这里两个git对应的都是用户名，git_repository对应的是git仓库)
+ 让仓库接受代码提交
  + git config receive.denyCurrentBranch ignore
  + 【可选】git config core.worktree ~/www
  + 【可选】git config --bool receive.denyNonFastForwards false #禁止强制推送
<br>
至此，一个空的git仓库就建好，地址为：ssh://git@www.sydtop.cn/home/user/git_repository

### 本地仓库准备工作

+ 本地创建并初始化一个git仓库
  + mkdir testing
  + cd testing
  + git init
+ 本地仓库随便添加一个文件，使得仓库做出一些改变，并进行提交
  + vim index.md #输入任意文本后，保存并退出
  + git add *
  + git commit -m '注释'
+ 将本地仓库关联到服务器中的远程仓库
  + git remote add brilliant ssh://git@www.sydtop.cn/home/user/git_repository
  (格式：git remote add 主机名 远程仓库地址)
+ 将代码提交到远程服务器
  + git push 主机名 master

### 回到服务器端
+ 更新服务器端git仓库状态并检出文件
  + cd /home/user/git_repository
  + git update-server-info
  + git checkout -f 或是 git checkout branch_name #要 push的远程分枝名
+ 检查是不是文件更新进来了
  + ls
+ 设置服务器端更新钩子 (暂未实现)
  + cd .git/hooks
  + 新建post-receive
    + vim post-receive
  + 将如下内容复制到文件中 <br>
    #!/bin/sh
    unset GIT_DIR
    cd ..
    git checkout -f
+ 后续本地代码如果push过来后，应该就不要使用第一步，进行代码的手动检出操作