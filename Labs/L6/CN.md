# 实验 6：分离与统一

*注：中文版为阅读理解方便而编写，与原文有所不同，请**务必同时参考英文原文**。*

## 概述

> 团结合作，我们将不可阻挡。

这是最后的汇编语言实验了！越是简单越是困难，越是强大越是脆弱 —— 但无论如何，这都是最后的任务了，拿下这个最终的挑战，就能取得全局胜利。如果你对 LC-3 还抱有热情，或者至少你的 LC3Tools 还抱有热情，那么，请继续前进吧。这次的实验并不简单，但却比数数字要有趣得多：你将了解如何在仅有**一个处理单元**的 LC-3 上**运行两个程序**。请看下面的简介，这样我们能以最快乐（或者至少不那么痛苦）的方式解决这一切。

## 背景

LC-3 只有一条流水线（即一个处理核心）。如果两个程序需要运行，通常情况下必须先运行程序 A，等待它退出，然后再运行程序 B。如果想让两个程序同时运行，就需要一些额外的技术。

你可能已经知道**线程**这个概念。严格来说，一个线程需要在一个（逻辑）CPU 核心上运行。如果 LC-3 有更多的 CPU 就好了，但很可惜的是，实际情况并非如此。不可能在同一个物理时间段内同时执行两条指令，这导致**同时多线程（SMT）**将不可做到。

![](https://img.picui.cn/free/2024/11/14/6735933782561.png)

不过，即使我们不能**同时**执行两**条**指令，也不代表我们不能**并行**地执行两**组**指令，这就要提到另一项技术 —— 交叉多线程，也称**时间多线程（TMT）**。在这种技术中，指令共享（而非独占）CPU 的处理时间。这很适合 LC-3，因为即使只有一个 CPU，我们也可以执行 A 中的几条指令，然后切换到 B 执行几条指令，再切换回来……任何时刻都只有一条指令在执行，但整体上**看上去**两个程序是在同时运行的，不必等到其中一个结束再开始下一个。

![](https://img.picui.cn/free/2024/11/14/6735936864f77.png)

程序 A 和程序 B 要如何决定什么时候该切换呢？在本次实验中，我们使用 `TRAP x77` 中断来切换线程。也就是说，程序 A 先执行一些指令，然后它使用 `TRAP x77` 指令，表示“我已经执行了足够长的时间了，请切换到另一个程序”，程序 B 亦然。

## 任务目标

为 LC-3 上的两个程序 A 和 B 实现时间多线程。

- 程序 A 和 B 将在测试时提供。

- 当按下 `Q` 键时，终止程序并停机（即 `HALT`）。

- 当有程序使用 `TRAP x77` 请求切换任务时，需要响应该请求。

切换任务的程序冗长而复杂，所以这部分已经为你写好。

## 输入输出样例

如果用户程序的内容为：

程序 A：

```
LOOP ADD R0, R0, x1
ST R0, Somewhere
TRAP x77               ; 切换到程序 B
BR LOOP
```

程序 B：

```
LOOP LD R1, Somewhere
TRAP x77               ; 切换回程序 
BR LOOP
```

那么程序的执行流程将如下图所示：

```
    A        B  
    |
R0->x0001
<TRAPPED>
    |------->|
         R1->x0001
         <TRAPPED>
    |<-------|
R0->x0002
<TRAPPED>
    |------->|
         R1->x0002
         <TRAPPED>
    |<-------|
    |
   ...
```

## 详细要求

- 用户程序的入口点位于：
  
  - A：`x4090`
  
  - B：`x8090`

- 用户程序可能是任意的，会在测试时提供。

- 你的代码将从 `x800` 开始，并且在**管理模式**下运行。我们将通过一小段特殊设计的启动程序加载你的代码。

- 中断默认没有开启，需要手动开启键盘中断。

## 指南

### 程序架构

与先前的实验相比，实验 6 的复杂度更高了。下面是对于代码架构的简要说明：

- **启动程序**，位于 `x200`，LC-3 将从这里启动。这部分已经为你写好。

- **系统初始化程序**，位于 `x800`，你需要：
  
  - 启用键盘中断。
  
  - 为键盘中断设置处理程序。
  
  - 为 `TRAP x77` 设置处理函数。
  
  - 调用用户程序 A。

- **键盘中断程序**，位于 `x1000`，你需要：
  
  - 检测按下的按键。
  
  - 若按下的按键是 `Q`，则调用 `HALT`。

- **线程切换程序**，位于 `x1800`，你需要：
  
  - 调用我们提供的切换程序，切换到另一个线程。

- **切换函数**，位于 `x2000`，这部分已经为你写好。

- **用户程序**，分别位于 `x4090` 和 `x8090`，这部分会在测试时提供。

### 设定键盘中断

`KBSR[14]` 控制着键盘中断的开闭。将中断设置为 1 时，系统能收到来自键盘的中断。使用一次或运算就可以改变这一位。

你可能会想问，“`KBSR` 到底在哪里呢？”`KBSR` 是内存映射 I/O 系统的一部分，编址为 `xFE00`。尽管并非内存，它却使用与内存相同的方式寻址 —— 这意味着可以用任何访存指令访问它，例如 `STI` 可以写入 `KBSR`。

在**启用**中断后，还需要在**中断向量表**中**注册**处理函数，将中断号与处理程序的入口点对应起来。键盘中断使用编号 `x80`，也就是说，需要将处理程序的入口地址填在 `x180` 处（`x100` 是外部中断的起点）。这样，当键盘输入到来时，程序就能收到中断并转而执行指定的处理程序。

### 获取键码

`KBDR` 存储着最后一个被按下按键的键码，它位于 `xFE02`，可以利用 `LDI` 之类的指令访问它。另外，`KBDR` 在一次读取后，就会自动将自身和 `KBSR` 的相应位重置，这样很好，因为我们不需要手动处理这些麻烦的善后事项。

### 调用切换函数

由于切换函数实在是很难实现也很难调试，所以这部分我们已经为你写好了。要怎么使用呢？我们将这些代码填在了 `x2000` 的位置，所以你能用下面的代码来访问它：

```
LD R7, SwitchProgramAddr
JMP R7
SwitchProgramAddr .FILL x2000
```

这就是全部了吗？不，还不是。切换函数会保存当前的寄存器状态，并装载另一个程序的状态。也就是说，你的键盘中断处理程序和 `x77` 中断的处理程序都**不能修改除 `R7` 以外任何寄存器的值**。如果必须的话，可以临时借用，但要在使用完后（即执行 `JMP R7` 前）恢复原值。

### 处理 `x77` 中断

和键盘中断非常类似，只需要将中断处理程序的入口点填在 `x77` 处即可（`x0` 是内部中断的起点）。

### 调用用户程序

在启动代码的最后，你需要将控制权移交给用户。你已经知道，用户程序在 `x4090` 处启动，所以你会写出这样的代码：

```
LD R0, AddrA
JMP R0
AddrA .FILL x4090
```

哦不，你不能。这样的代码是不对的，或者至少，是不安全的。请别忘了我们的程序现在还是在**管理模式**下运行，简单地调用用户程序会导致诸如 `ST R1, x180` 这样的指令绕过必要的安全机制，破坏整个系统。

唯一能够离开管理模式的指令是 `RTI`，它执行以下工作：

- 从栈中弹出一个元素并赋值给 PC。

- 从栈中弹出一个元素并赋值给 PSR。

- 下一条指令将从 PC 更新后的位置获取，也就是隐式地跳转。

- 下一条指令的执行将根据 PSR 更新后的值赋予权限。

所以要做的事也就是准备好**想要**赋给 PC 和 PSR 的值，然后将它们入栈，然后调用 `RTI`，这就 OK 了！

下面是出入栈的样例代码：

```
; 将 R0 入栈
ADD R6, R6, x-1
STR R0, R6, x0

; 出栈并赋给 R0
LDR R0, R6, x0
ADD R6, R6, x1
```

### 测试和运行

中断和相关的机制在 LC3XT 上会发生相当有趣的事情，Sugar 虚拟机采用了一系列技术来在平台上模拟中断，但我们更想让你亲自体会到两个程序并行的情景（尽管不是强求），因此，除了使用 LC3XT，你也可以在 LC3Tools 中执行示例程序，并查看运行后的结果。

## 提示与技巧

- 再次重申：在两个中断处理程序中都**不要**修改除 `R7` 外寄存器的值，或者至少在修改后要记得恢复它们。~~有借有还，再借不难~~

- LC3Tools 在运行具有复杂中断的程序时可能会停止响应。如果你确信程序没有问题，但是控制台没有任何东西输出，那么尝试重启 LC3Tools 可能会解决问题。

## 代码模板

下面的模板包含了大多数我们已经实现的代码，你可以直接复制来使用。需要实现的地方都以 `; TODO` 加以标识。

用户程序 A 和 B 都已经提供给你，你可以修改它们来看不同的运行效果。默认的用户程序让 A 和 B 都能输出内容，而且 B 的速度大约是 A 的两倍。

另请注意，LC3Tools 的运行速度取决于你的电脑。如果程序运行太慢了，可以降低 `TIMER_LIMIT_A` 和 `TIMER_LIMIT_B` 的值。

```
; Entry point
.ORIG x200

; Loads system stack
LD R6, SystemStack

; Calls your code
LD R0, SetupAddr
JMP R0

SystemStack .FILL x2FFF
SetupAddr .FILL x0800

.END

; Setup program
.ORIG x0800

; ==============================
; TODO
; - Enable keyboard interrupt
; - Setup ISR for keyboard
; - Setup ISR for trap x77
; - Call user program A
; ==============================

; Some values defined for your convenience
KBSR .FILL xFE00
KBSRMask .FILL x4000
KBVecAddr .FILL x0180
KBISRAddr .FILL x1000
TrapVecAddr .FILL x0077
TrapISRAddr .FILL x1800

.END

; Keyboard ISR
.ORIG x1000

; ==============================
; TODO
; - Get the keycode
; - If Q is pressed, halt the machine
; ==============================

KBDR .FILL xFE02
.END

; Trap x77 ISR
.ORIG x1800

; ==============================
; TODO
; - Call switch program
; ==============================

SwitchProgramAddr .FILL x2000
.END

; Switch Program
.ORIG x2000
LD R7, CurrentProgram
BRp SwitchB2A
; A to B
LEA R7, PC_PSR_A
ST R7, PC_PSR_Save
LEA R7, PC_PSR_B
ST R7, PC_PSR_Load

AND R7, R7, x0
ADD R7, R7, x1
ST R7, CurrentProgram

LEA R7, RegA

BR SwitchEnd
SwitchB2A
; B to A
LEA R7, PC_PSR_B
ST R7, PC_PSR_Save
LEA R7, PC_PSR_A
ST R7, PC_PSR_Load

AND R7, R7, x0
ST R7, CurrentProgram

LEA R7, RegB

SwitchEnd

STR R0, R7, x0
STR R1, R7, x1
STR R2, R7, x2
STR R3, R7, x3
STR R4, R7, x4
STR R5, R7, x5

LD R2, PC_PSR_Save

; Pop PC
LDR R7, R6, x0
ADD R6, R6, x1
STR R7, R2, x0

; Pop PSR
LDR R7, R6, x0
ADD R6, R6, x1
STR R7, R2, x1

LD R2, PC_PSR_Load

; Push PSR
LDR R7, R2, x1
ADD R6, R6, x-1
STR R7, R6, x0

; Push PC
LDR R7, R2, x0
ADD R6, R6, x-1
STR R7, R6, x0

LD R7, CurrentProgram
BRz LoadB2A
LEA R7, RegB
BR LoadEnd
LoadB2A
LEA R7, RegA
LoadEnd

LDR R0, R7, x0
LDR R1, R7, x1
LDR R2, R7, x2
LDR R3, R7, x3
LDR R4, R7, x4
LDR R5, R7, x5

RTI

PC_PSR_Save .BLKW 1
PC_PSR_Load .BLKW 1

SaveR0 .BLKW 1
CurrentProgram .FILL x0

RegA .BLKW 8
RegB .BLKW 8

PC_PSR_A
.FILL x4090
.FILL x8002

PC_PSR_B
.FILL x8090
.FILL x8002
.END

; Program A
.ORIG x4090
LOOP_A
LEA R0, MSG_A
PUTS

LD R1, TIMER_LIMIT_A
LOOP_IA
ADD R1, R1, x-1
TRAP x77
BRp LOOP_IA

BR LOOP_A

TIMER_LIMIT_A .FILL x200
MSG_A .STRINGZ "Program A reporting.\n"
.END

; Program B
.ORIG x8090
LOOP_B
LEA R0, MSG_B
PUTS

LD R1, TIMER_LIMIT_B
LOOP_IB
ADD R1, R1, x-1
TRAP x77
BRp LOOP_IB

BR LOOP_B

TIMER_LIMIT_B .FILL x100
MSG_B .STRINGZ "Program B reporting.\n"
.END
```

## 思考题

请在本次的报告中回答下列问题：

1. 为什么不能在中断处理程序中改变寄存器的值？

2. 在运行程序时，你可能会发现，当快速地连按除 `Q` 以外的键时，程序可能会崩溃。试提出可能的原因。

3. 你应该已经注意到，相比我们的程序，代码切换的函数非常长（100 多行！）。事实上，在当今的计算机中，任务切换的实现也是必须经过精巧设计的。为什么即便付出这样的代价，现代操作系统仍然需要实现多任务？

# 
