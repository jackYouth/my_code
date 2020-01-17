# git 常用命令

### git 流程图

git 中的 4 个地址概念：工作区、暂存区、本地仓库、远程仓库
git 中常用的就 6 个命令，但是进阶的话需要记住 60-100 个命令
常用的命令图谱：

<img src='../imgs/git.png'>

### 基础命令:

- git fetch/clone: 从远程仓库拉取/克隆代码到本地仓库
- git checkout: 本地仓库检出分支到工作区
- git pull: 将远程仓库所有分支代码拉到本地仓库代码
- git add: 将工作区代码加入暂存区, (.表示加入全部, 指定文件名则加入指定文件)
- git commit: 将暂存区文件提交到本地仓库
- git push: 将本地仓库代码推送到远程仓库
- git stash（进度保存）:

  - gsts（保存：git stash save 'message'）
  - gstl（进度列表：git stash list）
  - gstp <gstl 中的 stash_id> (插入进度，默认最新)
  - gstd <gstl 中的 stash_id>（移除进度，默认最新）

### 撤销命令：

- git checkout 恢复暂存区的文件到工作区，新增的文件不会被删除（后面加文件名就是恢复指定文件，加.就是恢复所有文件）
- git reset --hard 重置暂存区和工作区，新增的文件不会被删除（后面可以加 commit，来指定重置到某次提交点，不加--hard 就相当于 checkout，不会改变工作区的内容）
- git clean -ndf 查看将要删除的未跟踪文件（新增的文件），在 git clean -xdf 前使用（x: 忽略目录中新增的文件，d：目录，ｆ：文件）
- git clean -df 删除暂存区所有为跟踪文件(慎用，.gitignore 忽略的新增文件也会被删掉，比如 node_modules 中，一般是用来删除编译后的文件)
  > checkout 作用的是暂存区（add 后的文件），reset 作用的是暂存区和 workspace（没有 add 的改变）

### 删除命令

- git branch -d branchName 删除本地分支
- git push origin --delete branchName 删除远程分支

### git 用户管理

- 查看当前 git 提交时的用户名称、邮箱
  - git config user.name
  - git config user.email
- 修改当前 git 提交时的用户名称、邮箱
  - git config --global user.name '<name>'
  - git config --global user.email '<email>'

> git 简版命令配置神器: [oh my zsh!](https://github.com/robbyrussell/oh-my-zsh/blob/master/plugins/git/git.plugin.zsh)
  
### 删除命令:
- git branch -d <branchName>: 删除本地分支
- git push origin --delete <branchName>: 删除远程分支
