# 终极实验 A：汇编器

## 命运所指

> 抉择就在眼前，结局早已注定。

从 1 和 0 构成的机器代码，到标签和指令的世界，经历中断等等波折，再到熟悉而又陌生的 C 语言，不断的讲述和练习，计算系统庞大的结构在你的脑海中不断延伸，由朦胧的概念逐渐形成了似真似幻的构想，再演化成尤为清晰的形象。一切看似都已经趋近完美，只要**在这里停下**，为这个系列画上句号，你就可以从实验中“安全下车”，故事也将抵达它的尾页。你 ——

<style>
    .btn {
        background-color: rgba(255, 180, 220, 0);
        width: 80%; 
        border: 2px solid; 
        border-color: rgb(255, 154, 187, 0.7); 
        border-radius: 5px;
        color: inherit; 
        text-align: center;
        padding-top: 0.25rem;
        padding-bottom: 0.25rem;
        font-weight: bold;
        font-size: 1rem;
        transition: 200ms;
        cursor: pointer;
    }

    .btn:hover {
        border-color: #fff0b3;
        box-shadow: 0px 0px 10px #fff0b3;
    }
</style>

<script>


function acceptThat() {
    document.querySelectorAll("button.btn").forEach(e=>e.parentNode.remove());
    document.getElementById("t-accept").style.display = "initial";
    sessionStorage.setItem("op.final", "accept")
}

function rejectThat() {
    document.querySelectorAll("button.btn").forEach(e=>e.parentNode.remove());
    document.getElementById("t-reject").style.display = "initial";
    sessionStorage.setItem("op.final", "reject")
}

window.acceptThat = acceptThat
window.rejectThat = rejectThat
window.finalOp = sessionStorage.getItem("op.final")

if(window.finalOp == "accept") acceptThat()
if(window.finalOp == "reject") rejectThat()
</script>

<div style="display: flex; justify-content: center; width: 100%; margin-top: 3rem;">
<button class="btn" onclick="acceptThat()">
接受这个命运
</button>
</div>

<div style="display: flex; justify-content: center; width: 100%; margin-top: 2rem; margin-bottom: 3rem;">
<button class="btn" onclick="rejectThat()">
不接受这个命运
</button>
</div>

<script>

</script>

<div style="display: none;" id="t-accept">

**接受这个命运。**

> 岁久人无千日好，春深花有几时红？

尾页已至，作家放下手中的笔，将结尾留给读者自作想象。在这里结束，倒也不失为一桩美谈。翻过封底，故事看似已然圆满，今后的事，你我都已知晓。

[退出至首页](/Labs/README)

</div>

<div style="display: none;" id="t-reject">

**不接受这个命运。**

> 莫嫌举世无知己，未有庸人不忌才。

描绘的画笔不曾停歇，构想的修辞流淌不竭，作家正将故事引上另一条路。有人欣喜，期待着尾页上的新章节；有人畏惧，担忧这临门一脚的变数。今后的事，我们尚不可知。

## 背景

每一行代码都诉说着你的构想，那些构想组成了新的篇章。只要按下“汇编”按钮，就能将构想即刻变成现实。但为什么呢？你将视线投向汇编代码的身后，名为**汇编器**的程序 —— LC3XT Loli，正在尽职尽责地将每一条指令翻译成机器能够理解的语言。在过去如此，在那个“到此为止”的分支也是如此。可是，你打破了既有的计划，开辟了一条新路线。在这个故事里，Loli 并不存在。为了编织这段新的故事，你必须**亲自讲述**，亲自将你的构想描绘为现实。

## 任务目标

设计、创建、测试并部署一个 LC-3 汇编器。

- 对于每一段语法合规的汇编代码，你的汇编器需要正确生成汇编代码。

- 对于存在错误的程序，不做任何要求。汇编器可以报告错误，也可以在缺少数据的情况下尝试完成汇编。

## 规范的 LC-3 语法

在本实验中，所使用的 LC-3 语法为规范语法，满足以下条件：

- 每行只能包含以下四种内容之一：
  
  - 空白符（空格、制表符、换行符等）
  
  - 单一的标签
  
  - 不带标签的指令
  
  - 带有一个标签的指令

- 指令不会分拆到多行中。

- 操作码和操作数的大小写**可能不定**。

- 操作数之间均以逗号 `,` 分隔，**可能不含空格**。

- `.BLKW` 将不会使用带有前缀的立即数。

- 标签可以包含**连续的任意多个非空白字符**。

- 分号可能出现在字符串内，此时**不将其视为注释**。

除语法的规范外，汇编程序也保证所使用到的资源符合 LC-3 机器的限制，包括寄存器编号和立即数范围。

## 快速开始

实现一个具备诊断功能的、宽容的汇编器是很困难的，即便是只解析规范的程序，要编写相应的程序也是不容易的。你可以选择从头开始，自行设计和构建程序，但这有些麻烦，特别是如果你还不知道如何进行软件工程中的常见操作，如单元测试等。幸运的是，你并不需要具备相关的知识（至少不是必须现在）就能完成这个项目，只需要使用我们提供的**快速开始模板（Quick Start Boilerplate）**。

?> 虽然模板常被称为**框架（Framework）**，但二者有本质上的区别。框架通常是作为单独的软件包发行的，你可以在自己的项目中使用框架来构建程序。相对应的，模板已经提供了部分代码，而你只需要进行一些补全工作。

我们针对一些语言，提供以下的模板，你可以从中任选一个来完成这个项目：

- Kotlin
  
  这个基于 Kotlin 和 JVM 的模板能让你以最舒适的方式完成这个汇编器，并享受到业界领先编程语言的性能与便利。

- TypeScript 和 JavaScript
  
  这个基于 Node.js 的模板是经由 Loli 的源代码裁剪而来的，以便于你了解 JavaScript 这样一门适用于各个领域的语言。

- Python
  
  这个基于 Python 的模板精简而灵活，并且不需要太多的配置就能开始使用。

- C 和 C++
  
  这个基于 C++ 的模板保留了该实验传统的风格，旨在向有挑战精神的读者展示经典的程序设计艺术。

?> 如果你不确定要使用哪个模板，推荐你使用 Kotlin，Kotlin 模板所需的代码量最少，调试起来最容易，并且我们已经为这门语言准备了配套的教学（请参见左侧的导航栏）。

这些模板的结构大致相似，但在细节上却又有差距，在选用你的模板后，请先阅读它的文档。

---

</div>
