# Kotlin 面向函数

在面向过程编程中，我们可以定义一个函数来表示**一系列特定的操作**，然后就可以通过提供参数来调用它们。现在，给你两点构想，大胆地假设一下，函数**只能就地调用吗**？能否把“处理某件事情的逻辑”本身封装起来，将它作为一种资源，在程序的各部分使用呢？不严格地说，这就是**函数式编程（Functional Programming）**。

?> 严格的函数式编程有许多限制和要求，以至于它在实际的项目中几乎得不到应用。当今具有函数式编程特征的一些语言（JavaScript、C++ 等），都是采取了函数式编程的优点，但并不强制执行它的大多数限制。

## 获得一缕思绪

下面向你介绍 Kotlin 中最有趣的东西。

我们已经知道，可以用块将一些语句打包起来：

```kotlin
{
    val b = 1
    println(b + 3)
}
```

当然一个块如果不与任何东西关联，那它不会得到执行，这可没什么意思。

---

下面我们将这个块赋给一个变量：

```kotlin
val action = {
    val b = 1
    println(b + 3)
}
```

这就创建了一个变量 `action`，读者肯定要问，它存储的是什么东西呢？它存储的是这个块中的**操作**。当我们用大括号 `{}` 将一些语句包裹起来时，我们就创建了一个 **Lambda 函数（Lambda Function）**。为与先前在过程式编程中提到的函数作区分，我们将那些函数称作**命名函数（Named Function）**。虽然名字有些奇特，不过 Lambda 函数其实也就是一个**不带名字的函数**而已，到目前为止，还没有什么特别的地方。请记住有关函数式编程的第一条特性：

**函数可以像基本类型如数字、字符串等一样，被简单地创建和赋值给变量。**

?> 这里的“函数”一词，指代的是函数式编程中的 Lambda 函数，而不是过程式编程中的命名函数。尽管在 Kotlin 中，二者常常同时出现，但函数式编程这一范式只涉及 Lambda 函数的定义和使用。

---

Lambda 函数同样可以拥有参数，只是声明的方法有所不同：

```kotlin
val action = { a: Int, b: Int ->
    println(a + b)    
}
```

参数和其类型的声明还是没什么区别，不过它们现在写在左括号 `{` 的后面（即 Lambda 函数的起始处），并在最后加上一个箭头 `->`。除此之外，参数的定义和使用，都与命名函数没有区别。

?> 虽然这里将参数与左括号写在同一行，但其实也可以分开，只要确保参数声明出现得比任何语句都靠前就可以了。

---

Lambda 函数也可以拥有返回值：

```kotlin
val action = { a: Int, b: Int ->
    val c = 3
    a + b + c   
}
```

注意我们并没有使用 `return` 表达式！这是因为，Lambda 函数有一些特殊的性质，`return` 在其中使用会引起混乱。Lambda 函数的返回值是其**最后一条语句的值**（和 `if-else` 一样）。此外，和赋值函数一样，不必显式指定返回值，Kotlin 会推断出来。

---

读者肯定要问，那如果我们想在“半路”就通过 `return` 中断函数的执行呢？既然没有 `return`，那这一点自然也……好吧，其实还是有办法做到的：

```kotlin
val action = label@ { a: Double, b: Double ->
    if (b == 0) return@label 0
    a / b
}
```

这里我们使用了**命名返回（Named Return）**。首先，我们通过标签 `label@` **标记**了我们创建的 Lambda 函数，由于 `val action =` 是定义而非 Lambda 函数本身的一部分，因此 `label@` 加在它们之后，也就是左括号 `{` 之前。然后，我们就可以使用 `return@label` 来指定“返回到 `label` 这里”。尽管付出了一些代价，但这么做允许我们在必要的时候提前打断函数的执行。

?> 标签的名称和变量一样可以自定义，但与标签不同，只要不引起冲突，标签可以在同一个命名空间中重复定义。

---

顺便说一句，`action` 就像任何普通变量一样，可以显式声明它的类型：

```kotlin
val action: (Int, Int) -> Int = { a, b ->
    val c = 3
    a + b + c   
}
```

这里我们使用了 `(参数列表) -> 返回值` 的形式为 `action` 指定了类型，这同时也就**指定了每个参数的类型和返回值的类型**，因此我们也同时删去了参数 `a` 和 `b` 的显式类型声明。这也是源自于 Kotlin 强大的类型推断能力 —— 既然参数的类型已经能通过 `action` 推知了，那就不需要再手动声明了。

---

说了这么多有关 Lambda 函数的东西，看上去也和普通函数没什么区别呀，那我们为什么不直接使用命名函数呢？自然，Lambda 函数有一些很特殊的特性，这使得它比命名函数灵活得多，也成为了 Kotlin 函数式编程中的主角。

## 去伪存真

Lambda 函数可以像命名函数一样调用：

```kotlin
val action: (Int, Int) -> Int = { a, b ->
    val c = 3
    a + b + c   
}

fun main() {
    println(action(1, 2)) // 6
}
```

?> 虽然这里选择了在 `main` 当中定义 `action`，但其实也可以在函数以外定义 Lambda 函数和 `action` —— 它毕竟只是一个变量。

这是函数式编程的第二条特性：

**函数可以直接调用。**

这看上去是句废话，不过到目前为止我们其实还没有从逻辑上说明“Lambda 函数是可调用的”，这一特性补充这一点。

---

Lambda 函数可以用作**参数**，传递给其它函数（不论是 Lambda 函数还是命名函数）：

```kotlin
fun sayCiallo(printer: (String) -> Unit) {
    printer("ciallo, world")
}

fun main() {
    val printToConsole = { s: String ->
        println(s)
    }
    sayCiallo(printToConsole)
}
```

能做到这一点本身并不令人惊奇，因为 `printToConsole` 说到底只是一个变量而已，变量可以用作参数，这没什么问题。

真正令人惊奇的，是 `sayCiallo` 函数的实现。我们通过一个 `printer` 参数来代表一个**抽象的“输出”操作**。`sayCiallo` 函数不必知道字符串 `"ciallo, world"` 要输出到哪里（可能是文件、终端或网络等），**这可以在调用 `sayCiallo` 时再决定**，`sayCiallo` 本身只负责调用 `printer` 并输出想要的内容。

在 `main` 中，我们创建了 `printToConsole` 的 Lambda 函数，功能是将接收到的字符串用 `println` 输出到终端。随后，我们把 `printToConsole` 作为**实际的“输出”操作**传递给 `sayCiallo`，完成程序。这正是函数式编程的第三条特性：

**函数可以作为一系列操作的封装，由其它函数使用。**

> **到底怎么回事？**
> 
> 这种设计模式就是**策略模式（Strategy Pattern）**，程序的某些策略是可以实时进行选择的。在本例中，实时选择的策略是“输出到哪里”。策略模式赋予了程序极高的可维护性和可扩展性 —— 各种策略可以任意组合，并且无论是策略本身还是使用策略的函数，都只需要**负责自己该做的事**。
> 
> 在本例中，`sayCiallo` 不必在乎 `printer` 要如何输出给定的字符串，而 `printToConsole` 也不必在乎收到的字符串是什么，这两个功能就可以**分别地修改而互不影响对方**，这就是**可维护性（Maintainability）**。
> 
> 同时，将来如果我们想要增加一个输出到文件的功能，就只需要增加一个 `printToFile` 函数，并将其传给 `sayCiallo` 就可以了，我们可以在**只做最小限度改动的情况下为程序增添功能**，这就是**可扩展性（Extensibility）**。
> 
> 可维护性和可扩展性良好的程序，通常也具有更高的质量和更丰富的功能。

---

我们再来看另一个例子，这次我们来解释 `repeat` 函数的原理（还记得吗，`repeat` 只是一个普通函数）。

> **`repeat`**
> 
> ```kotlin
> inline fun repeat(times: Int, action: (Int) -> Unit)
> ```
> 
> 重复执行给定的 `action`，总共 `times` 次。
> 
> 当前执行的次数（从 `0` 开始）将作为参数传递给 `action`。
> 
> 如果 `times` 不大于 `0`，则不做任何操作。

`repeat` 和刚才的 `sayCiallo` 差不多，不过是多接受一个参数 `times`。我们可以像这样来重复输出一些内容：

```kotlin
fun main() {
    val sayCiallo = { index: Int -> // repeat 只规定了 Lambda 函数的参数类型，因此名称可以自选
        println("ciallo, world")
    }

    repeat(5, sayCiallo)
}
```

这也很自然，并不难理解。不过，读者肯定要问，这和我们先前见到的 `repeat` 的用法，可不太一样：

```kotlin
fun main() {
    repeat(5) {
        println("ciallo, world")
    }
}
```

好，那下面向你演示如何将上面的程序转换成下面的程序。这个步骤会涉及 Kotlin 函数式编程的几个重要特性。

---

首先，让我们把 `sayCiallo` 变量去掉。我们知道 Lambda 函数本身可以赋值给变量，那么它当然也可以**不加以赋值而直接作为参数使用**：

```kotlin
fun main() {
    repeat(5, { index: Int ->
        println("ciallo, world")
    })
}
```

---

现在我们去掉参数类型 `Int`，因为 Kotlin 可以从 `repeat` 函数的参数类型中，推断出 Lambda 函数的类型 `(Int) -> Unit`，并由此推断出 `index` 的类型 `Int`。先前我们不能这样做，是因为在定义 `sayCiallo` 的时候，Kotlin 并不能自动根据 `sayCiallo` 的用途去推断它的类型，原因很简单，**变量的类型是由其定义而非用途决定的**，而 Lambda 函数的参数相反，如果没有显式声明类型，可以进行推断。

```kotlin
fun main() {
    repeat(5, { index ->
        println("ciallo, world")
    })
}
```

---

然后，我们删去参数 `index`，因为 Kotlin 规定 Lambda 函数**如果只需要使用前几个参数，则可以删去后面不需要的部分**。如果 Lambda 不需要使用所提供的任何参数，则应当将整个参数声明删去。

```kotlin
fun main() {
    repeat(5, {
        println("ciallo, world")
    })
}
```

---

最后，我们将 Lambda 函数移到 `repeat` 调用的小括号外：

```kotlin
fun main() {
    repeat(5) {
        println("ciallo, world")
    }
}
```

这是因为 Kotlin 为了不让括号套太多层，对 Lambda 函数特别做了规定：**如果函数的最后一个参数接受 Lambda 函数，则 Lambda 函数可将整个大括号 `{}` 挪到函数调用的小括号 `()` 外**。虽然这不是函数式编程的规定，但它确实让在 Kotlin 中定义和使用 Lambda 函数变得非常方便。

> **到底怎么回事？**
> 
> Kotlin 不遗余力地在优化 Lambda 函数上下功夫。我们把上面的程序合并到三行，以便做比较：
> 
> ```kotlin
> fun main() {
>     repeat(5) { println("ciallo, world") }
> }
> ```
> 
> 与上述程序同样功能的写法，在其它语言中要这么写（从形式上来说）：
> 
> ```javascript
> // JavaScript
> function main() {
>     repeat(5, () => println("ciallo, world"));
> }
> ```
> 
> ```python
> # Python
> def main:
>     repeat(5, lambda : println("ciallo, world"))
> ```
> 
> ```cpp
> // C++
> int main() {
>     repeat(5, []() -> void { println("ciallo, world"); });
> }
> ```
> 
> ```java
> // Java
> void main() {
>     repeat(5, () -> { println("ciallo, world"); });
> }
> ```
> 
> 如果 Lambda 表达式变得更复杂一些，再加上 `return`，那有些语言（比如 Python）的实现会更麻烦。

---

除了可以将 Lambda 函数传递给其它函数使用外，也可以返回一个 Lambda 函数以供使用，下面的例子会说明这一点：

```kotlin
fun createCounter(start: Int): () -> Int {
    var i = start
    return { i++ } // { i++ } 是一个 Lambda 函数，返回值类型为 Int
}

fun main() {
    val count = createCounter(1)
    println(count()) // 1
    println(count()) // 2
    println(count()) // 3
}
```

这里，`createCounter` 创建一个计数器，这个计数器利用 `start` 作为起始值，返回一个函数 `{ i++ }`，也就是将 `i` 自增并返回其原来的值。随后，我们在 `main` 中调用这个生成的函数，每次调用时，`count` 所对应的 `i` 都会增加 `1`，并返回结果。

于是，我们得到了函数式编程的最后一条特性：

**可以基于当前的上下文，创建并存储代表一系列操作的函数，以供日后使用。函数能记忆其创建时所使用的上下文。**

> **到底怎么回事？**
> 
> 读者可能会疑惑，明明每次调用 `count` 都没有提供参数，为什么返回的值却能有所变化呢？这是因为，在 `createCounter` 创建 Lambda 函数 `{ i++ }` 的时候，使用了变量 `i`。这个变量 `i` 会在这个 Lambda 函数被创建出来时和它“打包”在一起，**即使已经离开了 `createCounter` 的函数体，变量 `i` 仍然可以被这个 Lambda 函数使用**，并记录当前的计数。
> 
> 在每次调用 `createCounter` 时，Kotlin 都会分配一个单独的**上下文（Context）**，被返回的 Lambda 函数可以继续持有这个上下文，直到它自身的作用域结束。这也就是说，假如我们调用 `createCounter` 创建多个 Lambda 函数，那么每个 Lambda 函数都会拥有自己的 `i`：
> 
> ```kotlin
> fun createCounter(start: Int): () -> Int {
>     var i = start
>     return { i++ }
> }
> 
> fun main() {
>     val c1 = createCounter(1)
>     val c2 = createCounter(1)
> 
>     println(c1()) // 1
>     println(c1()) // 2
>     println(c2()) // 1
>     println(c2()) // 2
> }
> ```
> 
> 这并不会造成内存泄露，因为 Kotlin 的内存管理是**全自动**的。当 Lambda 函数离开其作用域而被销毁时，相应的上下文也会一并被抹掉。

## 在结束之前

函数式编程是一种比过程式编程要灵活得多的多的范式，而要理解这种范式也需要花费一些时间。相比过程式编程只是简单地“展开”一系列操作，函数式编程中的函数能够做更多的事情。**函数式编程的核心思想是可以将函数作为基本类型对待，包括创建、传递和组合等。**这能让程序变得更灵活，而且易于修改。

## 练习题

1. 下面的 Lambda 函数可以将给定的字符串写入名为 `a.txt` 的文件：
   
   ```kotlin
   val printToFile = { s: String -> File("a.txt").writeText(s) }
   ```
   
   仿照我们在本节中用 `printToConsole` 输出到终端那样，创建一个函数，并使用这个 Lambda 函数，向 `a.txt` 中输出你想要的内容。
   
   ?> 如果你打算在 IDEA 中尝试，请确保文件的开头有一行 `import java.io.File`，这条语句应当列在 `package` 下方（如果有）。另外，如果项目的根目录下已经有了 `a.txt`，请确保其中没有重要的内容。程序运行后，你可以在 IDEA 左侧的 Project 面板中找到 `a.txt`。
   
   当你的程序可以成功运行后，仿照我们在使用 `repeat` 时做的那样，删除 `printToFile` 变量，将 Lambda 函数直接传递给你的函数，以简化程序。

2. 尝试实现 `repeat` 函数（不要求 `inline`）。

> **解答**
> 
> 1. 一种实现如下：
>    
>    ```kotlin
>    import java.io.File
>    
>    fun sayCiallo(printer: (String) -> Unit) {
>        printer("ciallo, world")
>    }
>    
>    fun main() {
>        val printToFile = { s: String -> File("a.txt").writeText(s) }
>        sayCiallo(printToFile)
>    }
>    ```
>    
>    该程序可以简化为：
>    
>    ```kotlin
>    import java.io.File
>    
>    fun sayCiallo(printer: (String) -> Unit) {
>        printer("ciallo, world")
>    }
>    
>    fun main() {
>        sayCiallo() { s -> File("a.txt").writeText(s) }
>    }
>    ```
>    
>    注意 Lambda 的参数 `s` 的类型 `String` 可以由 `sayCiallo` 的参数 `printer` 的类型 `(String) -> Unit` 推断出来，因此可以省略。
>    
>    顺便一提，Kotlin 规定，如果函数的唯一参数接受一个 Lambda，则可以把函数调用的小括号 `()` 删除，直接跟上 Lambda 的函数体 `{}`：
>    
>    ```kotlin
>    import java.io.File
>    
>    fun sayCiallo(printer: (String) -> Unit) {
>        printer("ciallo, world")
>    }
>    
>    fun main() {
>        sayCiallo { s -> File("a.txt").writeText(s) }
>    }
>    ```
>    
>    这个程序其实还有进一步简化的空间，请尝试思考一下为什么：
>    
>    ```kotlin
>    import java.io.File
>    
>    fun sayCiallo(printer: (String) -> Unit) {
>        printer("ciallo, world")
>    }
>    
>    fun main() {
>        sayCiallo { File("a.txt").writeText(it) }
>    ```
> 
> 2. 一种实现方法如下：
>    
>    ```kotlin
>    fun repeat(times: Int, action: (Int) -> Unit) {
>        var i = 0
>        while (i < times) {
>            action(i)
>            i++
>        }
>    }
>    ```
