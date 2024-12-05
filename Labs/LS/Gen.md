# 终极实验 S：Re LC-3

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

function makeConfirm(c)  {
    const t = c ? "就在这里结束" : "面对新的挑战";
    return confirm(`选择不能重来，${t}，确定吗？`)
}

window.acceptThat = acceptThat
window.rejectThat = rejectThat
window.makeConfirm = makeConfirm
window.finalOp = sessionStorage.getItem("op.final")

if(window.finalOp == "accept") acceptThat()
if(window.finalOp == "reject") rejectThat()
</script>

<div style="display: flex; justify-content: center; width: 100%; margin-top: 3rem;">
<button class="btn" onclick="makeConfirm(true) && acceptThat()">
接受这个命运
</button>
</div>

<div style="display: flex; justify-content: center; width: 100%; margin-top: 2rem; margin-bottom: 3rem;">
<button class="btn" onclick="makeConfirm(false) && rejectThat()">
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

没有软件的硬件是没有用的，而没有硬件的软件更是毫无意义的。能将汇编代码转换为机器代码固然是一件好事，但那并不是故事的全部。指令创生出来可不只是用来汇编的，更重要的是**执行**。在过去，LC3XT Sugar 一直在评测习题中默默地分析和执行指令，并尽职尽责地报告所发现的每个问题，而现在，是时候由你来接手这项工作了。

## 报告与提交

或许是最后一次，或许还有一次，你将要用实验报告描述程序的功能。或许你会写得很长，或许你会觉得无话可说，总之作为漫长工作的一个收尾，请概括一下你的成果。不论你的时间是花在了配置环境、阅读代码、运行调试还是网络问题上，都请描述你的工作，这不仅是形式上的总结，也是对于你原创程序的亲笔签名。

终极实验 S 要求人工检查，我们将安排时间进行集中线下研讨，但如果错过了也没关系，你可以选择其它零散时间线上讨论。

---

</div>
