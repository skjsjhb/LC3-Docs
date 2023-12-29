# OM-2 查阅 Javadoc

这篇 Omake 将介绍如何利用其它 Java 项目提供的 Javadoc 来查找需要的类或者方法。

## 什么是 Javadoc

Javadoc 是 JDK 内置的一个工具，它能够用来生成项目的**文档**，供其他开发者阅读。

Javadoc 描述如何使用软件提供的类和方法，对于我们做插件而言，我们就需要弄清楚 Paper 为我们提供了**哪些类和方法**。

你可以从下面的链接访问不同服务端的 Javadoc：

- Paper（1.20）： https://jd.papermc.io/paper/1.20/index.html

- Spigot（最新版本）： https://hub.spigotmc.org/javadocs/spigot/

- Spigot（中文翻译，最新版本）： https://bukkit.windit.net/javadoc/

!> 我们不建议阅读中文版本，尽管中文版本有翻译更容易阅读，但它可能不是最新的，可能有语义表达上的偏差，而且 Spigot 的文档不完全适用于我们使用的 Paper。<br/>除非你的英文**真的很差**，否则建议阅读 Paper 的官方英文文档。

## 如何找到需要的内容

首先，你在浏览器中**访问 Paper 的官方文档**：

![.](https://s2.loli.net/2023/12/29/26jILKJxD9kB8UA.png)

你会发现顶部有导航栏，其中包括“**Package（包）**”、“**Class（类）**”等类型。不过，通常我们不会使用这个功能，而是利用右上角的“**Search（搜索）**”功能来找需要的信息。

例如，假设我们现在想**在玩家身边生成苦力怕**，作为 Minecraft 老玩家，你应该知道“生成实体”的英文是“Spawn Entity”，于是，你在搜索栏中输入 `spawnentity`（不要有空格）。

?> Javadoc 的搜索功能比较基础，它只能查找类、常量和方法的**名称**。Java 的方法名和类名都没有空格，所以你的查找内容也不能包含空格。

在你输入的同时，Javadoc 就会开始搜索。输入 `spawnentity` 后，我们看到如下的搜索结果：

![.](https://s2.loli.net/2023/12/29/iJ62LpGXutk4dWm.png)

这里有四个结果，不过它们都指向了同一个方法 `spawnEntity`，仅仅是参数不同。此时，我们一般选择参数最少的方法。于是，我们点击第一个结果：

![.](https://s2.loli.net/2023/12/29/e5wdpV3tIlM8HzL.png)

我已经在其中为你标注出了各个部分的功能。Paper 的 Javadoc 写得很全面，它描述这个方法能做什么，每个参数是什么意思，返回什么东西。

在上面这个例子里，`spawnEntity` 接受两个参数：一个是 `Location` 类型，代表生成实体的位置；一个是 `EntityType` 类型，代表要生成什么实体。

既然我们想要生成苦力怕，而 `spawnEntity` 的第二个参数决定生成什么东西（描述中写着 The entity to spawn），我们自然要查阅 `EntityType` 的文档。你注意到 `EntityType` 是蓝色的，代表它是一个**链接**，所以你**单击**它：

![.](https://s2.loli.net/2023/12/29/uyUiX5YFJjTA1Pg.png)

你就可以在其中找到具体的类型定义。可以看出，`EntityType` 是一个枚举，它的继承关系、定义摘要、详细信息等都写在了这个页面里。

---

还有另一种办法来找到你需要的方法，就是**先找类后找方法**。

举个例子，如果我们想要破坏一个方块，我们当然可以直接搜索 `break`，但是这个词太普遍了，查找的结果，很可能不是我们想要的。事实也确实如此：

![.](https://s2.loli.net/2023/12/30/g6tRW8x3Ai5aFEO.png)

所以，我们应该先找到方块类，再找需要的方法。搜索 `block`：

![.](https://s2.loli.net/2023/12/30/pvjEyFbOQfSAdN5.png)

虽然这里有很多结果，不过我们要找的是**类型（Class）**，于是我们看向“**Classes and Interfaces（类和接口）**”，发现第一个就是我们需要的。进入 `Block` 类：

![.](https://s2.loli.net/2023/12/30/Hidh7LN462eKRsp.png)

方法列表标注在了类型当中，右边还有方法描述。我们很快就找到了我们需要的：`breakNaturally` 方法。

?> 如果一个类的方法很多，不需要盯着屏幕一行一行找，可以按下 `Ctrl+Shift+F` 组合键，让浏览器**在当前网页中搜索**。

---

好啦，现在你就知道如何使用 Javadoc 来查找需要的内容。我们的教程尽管内容比较复杂，涉及的方面也比较广，但不可能一一描述服务端的每一个细节。因此，熟练利用 Javadoc 查找内容是一个**必要的能力**。一开始使用可能感觉有些困难，读起来比较费劲，不过随着你对于 Java 和插件本身逐渐熟悉，很快 Javadoc 就会成为你最有力的工具之一。
