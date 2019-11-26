# [lerna - 包管理工具](https://juejin.im/post/5a989fb451882555731b88c2)

### 包管理现状

如果需要维护两个 package, 分别为 module-1 和 module-2, 且 module-2 需要依赖 module-1, 这时如果 module-1 有更新, 我们需要做一下事情:

- 修改 module-1 版本号, 发布
- 修改 module-2 中 module-1 的版本号, 发布

从这就可以看出, 仅仅两个就需要两步操作, 一旦多个包, 并且依赖关系更复杂的话, 可以想像发布的工作量有多大

### 什么是 lerna?

官网关于 lerna 的描述是这样的:

```
A tool for managing JavaScript projects with multiple packages.
```

这个介绍可以说是很清晰了, 引入 lerna 后, 上面的问题不仅可以解决, 更为开发人员提供了一种管理多 packages javascript 项目的方式.

### 为什么要用 lerna?

使用 lerna 的好处:

- 自动解决 packages 之间的依赖关系
- 通过 git 检测文件改动, 自动发布
- 根据 git 提交记录, 自动生成 CHANGELOG

### 使用 lerna 的基本工作流

见 [原文地址](https://juejin.im/post/5a989fb451882555731b88c2)
