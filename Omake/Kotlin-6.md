# Kotlin 面向对象（中）

将对象的行为与对象的数据合并在一起是一次大胆的尝试，并且效果的确不错。然而，那也只不过是面向对象的一部分能力。这种程序设计范式能在业界得到广泛的应用，还有更多的原因。

## 年代断层

书接上回，50 年后，你的公司掌握了制造方形杯子的技术，你将它加入你的统计程序：

```kotlin
class SquareCup {
    var length: Double = 0.0
    var width: Double = 0.0
    var height: Double = 0.0
    var color: String = "Unknown"

    fun getVolume() = width * length * height
}

class CircleCup {
    var radius: Double = 0.0
    var height: Double = 0.0
    var color: String = "Unknown"

    fun getVolume() = 3.1416 * radius * radius * height
}
```

我们很快就发现一个问题：`height` 和 `color` 在 `SquareCup` 和 `CircleCup` 中都有出现，我们**重复写了两行完全相同的代码**。如果方形杯子和圆形杯子有 99 个共同属性呢？或者更多？我相信你的手肯定会不自觉地伸向键盘上的某些按键……

!> **绝不要在编写代码时以任何理由复制代码。**你可以在有必要时移动代码，但绝不要复制。

要知道，代码重复（无论是复制粘贴还是手工编写）可是史山代码的源头，如果你在复制代码，那么先停下来思考一下，一定有更好的办法来解决问题。Kotlin 中解决这个问题的方法是什么呢？就是**类继承（Class Inheritance）**。

---

上面的程序可以使用类继承改写：

```kotlin
open class Cup {
    var height: Double = 0.0
    var color: String = "Unknown"
}

class SquareCup : Cup() {
    // var height: Double = 0.0 被复制过来
    // var color: String = "Unknown" 被复制过来
    var length: Double = 0.0
    var width: Double = 0.0

    fun getVolume() = width * length * height
}

class CircleCup : Cup() {
    // var height: Double = 0.0 被复制过来
    // var color: String = "Unknown" 被复制过来
    var radius: Double = 0.0

    fun getVolume() = 3.1416 * radius * radius * height
}
```

通过在类名后**加上冒号 `:` 和另一个类名再加上它的构造函数参数**（可真是长！），我们能从后者**“获取”其属性和方法**。在这个例子中，`SquareCup` 和 `CircleCup` 都继承自 `Cup`，也就是说，`Cup` 中的两个属性悉数被“复制”到 `SquareCup` 和 `CircleCup` 中。通过它们的 `getVolume` 函数可以看出这一点（我们可以直接使用 `height` 属性，而无需定义）。

在一对继承关系中，被继承的类（`Cup`）被称作**基类（Base Class）**，而继承基类的类被称作**派生类（Derived Class）**。

这里有几点需要注意：

- 基类的类名后有小括号 `()`，这其实是**调用基类的构造函数**，因此无论是否有参数，这对括号都不能省略。

- 基类需要以 `open` 修饰，加在 `class` 前，这是因为 Kotlin 默认禁止类被继承。
  
  > **到底怎么回事？**
  > 
  > 如果你还记得 `val` 和 `var` 的区别，那你应该也还没忘记那条程序设计准则：
  > 
  > **"Document it or forbid doing so."**
  > 
  > 类继承很强大，但也很复杂，稍后我们会看到，类继承允许我们改变同一方法的许多不同行为，而这些行为可能会间接影响基类的行为。**要设计一个可以被安全继承和使用的“完美”类是很困难的**，因此，我们不应当随随便便就允许什么类都能被继承。相反，我们应该一开始让所有的类都不可继承，然后再通过 `open` 允许一部分类被继承。这样，我们可以刚刚好让需要继承的类可以被继承，但绝不会超出这个范围。

---

当然，类继承除了可以继承属性，也可以继承方法：

```kotlin
open class Greeter {
    fun greet() {
        println("ciallo, world")
    }
}

class BetterGreeter : Greeter() {
    fun betterGreet() {
        println("ciallo～(∠・ω< )⌒☆, world")
    }
}

fun main() {
    val g = BetterGreeter()
    g.greet()
    g.betterGreet()
}
```

这里，`BetterGreeter` 类就从基类 `Greeter` 中继承了 `greet` 方法，因此我们可以直接（在实例化后）调用这个方法。

---

如果基类的构造函数需要参数，则要由派生类负责提供：

```kotlin
open class Greeter(val name: String) {
    fun greet() {
        println("ciallo, $name")
    }       
}         

class BetterGreeter(n: String) : Greeter(n) {
    fun betterGreet() {
        println("ciallo～(∠・ω< )⌒☆, $name")
    }
}

fun main() {
    val g = BetterGreeter("world")
    g.greet()
    g.betterGreet()
}
```

派生类可以选择自行提供基类所需的参数，也可以向使用者继续要求（列入自身的构造函数中），这要根据实际情况选择。获取参数后，通过调用基类的构造函数来传入它们。

?> 构造函数是不会被继承的。

本例中，我们在基类 `Greeter` 中用**属性参数** `val name: String` 简写了属性的定义和赋值，而在派生类中使用的却是**普通参数** `n: String`，因为 `name` 已经在 `Greeter` 中定义过了，没必要（也不能）再在 `BetterGreeter` 中进行简写定义，我们只需要定义一个普通参数，并将其传递给 `Greeter` 即可。如果写成下面这样，就明显多了：

```kotlin
open class Greeter(n: String) {
    val name: String = n

    // ...
}

class BetterGreeter(n: String) : Greeter(n) {
    // ...
}
```

但是这样就需要多写数行代码，显得不够简洁。

## 假想对冲

请看以下的例子：

```kotlin
open class Greeter {
    open fun greet() {
        println("hello, world")
    }
}

class CialloGreeter : Greeter() {
    override fun greet() {
        println("ciallo, world")
    }
}

fun main() {
    Greeter().greet()
    CialloGreeter().greet()
}
```

这里我们创建了两个类，`Greeter` 作为基类被 `CialloGreeter` 继承，`CialloGreeter` 于是由此从 `Greeter` 那里获得一个 `greet` 方法……但是先等一下，`CialloGreeter` 中**已经有 `greet` 方法**了！这会发生什么？你可以在 IDEA 中执行该程序，尝试看看结果，试着思考一下为什么。

（数分钟过去了）

欢迎回来！你应该已经发现，实际所执行的方法是 `CialloGreeter` 中定义的版本，可是，`CialloGreeter` 不是**应当继承 `Greeter` 中的 `greet` 方法**吗？`hello, world` 去哪里了呢？

在这里，我们通过在 `CialloGreeter` 中**定义同名的 `greet` 方法**，就可以**改变所继承到的方法的行为**，这被称为方法**重写（Override）**，请记住以下有关继承的两个作用：

- 派生类**继承基类的属性和方法**（青出于蓝……）

- 派生类**改变来自基类的属性和方法**（……而胜于蓝）

?> 重写只会改变**派生类中从基类继承来的方法**（`CialloGreeter.greet`），不会改变**基类中原本的方法**（`Greeter.greet`）。

重写的具体规则如下：

- 派生类 `D` 必须继承自基类 `B`。

- 被重写的方法在两个类中需要有相同的签名。

- 基类中的方法（被重写的）需要以 `open` 修饰，而派生类中的方法（主动重写的）需要以 `override` 修饰。需要 `open` 修饰的原因和类继承中差不多，因为 Kotlin 默认禁止方法重写。

- 主动重写的方法将完全替换掉继承来的方法。

?> 对于重写的另一个简单理解是，先在派生类中寻找 `greet` 的定义，如果没找到，再到基类中去寻找。这样理解就十分自然，然而，这种理解方式会对后续的多态等内容造成些影响。

---

当然，除了重写方法，我们也可以重写属性：

```kotlin
open class Greeter {
    open val name: String = ""
}

class NewGreeter : Greeter() {
    override val name: String = "Value"
}
```

被重写的属性需要在基类和派生类中拥有相同的类型，而且与方法一样需要正确地使用 `open` 和 `override` 修饰。简单对属性值的重写看上去没有什么用，不过，在高阶技巧中，我们会介绍 Getter 和 Setter，届时我们会看到如何使用属性值的重写来设计程序。

## 谋求共识

先前我们在函数式编程中已经见过下面这个例子：

```kotlin
import java.io.File

fun sayCiallo(printer: (String) -> Unit) {
    printer("ciallo, world")
}

fun main() {
    sayCiallo { s -> println(s) }
    sayCiallo { s -> File("a.txt").writeText(s) }
}
```

`sayCiallo` 函数无需关注 `printer` 的具体功能，由 `main` 在调用 `sayCiallo` 时为其选择合适的输出函数，这让程序变得很灵活。那么，我们自然希望面向对象也能有这样的灵活性。你已经在上一节的练习题中学到了如何将上面的程序改写为面向对象的版本，我们将“输出装置”作为对象，建立类来描述它，并将其实例传递给 `sayCiallo` 函数：

```kotlin
import java.io.File

class ConsolePrinter {
    fun print(s: String) {
        println(s)
    }
}

class FilePrinter {
    fun print(s: String) {
        File("a.txt").writeText(s)
    }
}

fun sayCiallo(printer: /* ? */) {
    // printer("ciallo, world")
}

fun main() {
    sayCiallo(ConsolePrinter()) // ConsolePrinter() 创建一个对象，并就地使用
    sayCiallo(FilePrinter())
}
```

但是这里有一个问题：**如何为 `sayCiallo` 的参数选择类型？**如果选择 `ConsolePrinter`，则 `main` 中的第二个调用就无法进行，反之，如果选择 `FilePrinter`，则第一个调用同样无法进行。换而言之，`sayCiallo` 只期望接收的 `printer` 对象中有一个 `print` 方法（或者类似的名字），`ConsolePrinter` 和 `FilePrinter` 确实也有这样的功能，但我们**缺少一种方式来描述这样的共通性**！

---

一种解决方法是，创建一个中间类 `Printer`，让 `ConsolePrinter` 和 `FilePrinter` 都继承它，并重写 `print` 方法：

```kotlin
import java.io.File

open class Printer {
    open fun print(s: String) {}
}

class ConsolePrinter : Printer() {
    override fun print(s: String) {
        println(s)
    }
}

class FilePrinter : Printer() {
    override fun print(s: String) {
        File("a.txt").writeText(s)
    }
}

fun sayCiallo(printer: Printer) {
    printer.print("ciallo, world")
}

fun main() {
    sayCiallo(ConsolePrinter())
    sayCiallo(FilePrinter())
}
```

读者或许会有疑问，明明 `sayCiallo` 要求的是一个 `Printer`  类型的对象，为什么能将 `ConsolePrinter` 和 `FilePrinter` 的实例作为参数传入？请看下面的解释。

> **到底怎么回事？**
> 
> 彩色打印机可以进行黑白打印也可以进行彩色打印，而用户只需要黑白打印 ，请问这台彩色打印机能否满足用户的需求？当然可以！在 Kotlin 中，这规则也是一样的：**派生类的实例可以被作为基类的实例使用**。`FilePrinter` 继承自 `Printer`，所以 `FilePrinter` **是**一类特殊的 `Printer` —— 它就是 `Printer`，只不过比 `Printer` 多了一些细节。因此，在（几乎）所有用到 `Printer` 的实例地方，都可以用 `FilePrinter` 的实例替代：
> 
> ```kotlin
> val fp = FilePrinter()
> val p: Printer = fp // OK
> 
> fun f(p: Printer) { /* ... */ }
> f(fp) // OK
> ```

我们将 `ConsolePrinter` 的实例作为参数传入 `sayCiallo` 函数，后者调用其上的 `print` 方法 —— 且慢，这个 `print` 方法到底属于谁？是 `Printer`，还是 `ConsolePrinter`？

尽管从形式上来看，`printer` 的类型是 `Printer`，因此似乎会调用 `Printer` 中的 `print` 方法（内容为空），但我们**不能只看形式**。在 Kotlin 中，所调用的方法是依据对象的**实际类型**来决定的。被**叫做**丑小鸭并不改变它**是**天鹅的本质 —— 即使我们将 `ConsolePrinter` 的实例作为 `Printer` 来使用，它所使用的仍然是自己的 `print` 方法。因此，`sayCiallo(ConsolePrinter())` 将正确地调用到 `ConsolePrinter` 中的方法。这就是常说的**多态（Polymorphism）** ——  看似调用的是基类中的方法，但其行为可能会依据实际类型的变化而有所不同。

?> 要能通过多态调用到正确的方法，需要确保继承关系和方法重写的正确性，即正确地使用 `open` 和 `override`。调用形式类型为基类的对象的方法时，Kotlin 会在其实际类型中寻找相同的方法，并加以调用。

多态的存在让 `sayCiallo` 不再需要去关心所使用的具体类型 —— 只要所提供的参数**至少与 `Printer` 有一样的功能**（通常会更多），`sayCiallo` 就可以使用它。甚至，所提供的实例都不必与 `Printer` 有类似的行为，而是可以通过方法重写来完全自定义，这就赋予了程序更大的灵活性，乃至超越了函数式编程。

## 在结束之前

这一节不算长，但难度可不小。继承、重写、多态构成了面向对象程序设计的另外一半核心。继承允许我们从一个类中获取已有的信息，重写允许派生类改变所获取来的资源，而多态又允许将派生类的不同行为用基类加以概括，同时不丢失它们本身的特性。这是很多新的概念，你可能需要在这里花一点时间了。

## 练习题

1. 以下是我们先前使用的杯子程序：
   
   ```kotlin
   class CircleCup(
       val radius: Double,
       val height: Double
   ) {
       fun getVolume() = 3.1416 * radius * radius * height
   }
   
   class SquareCup(
       val length: Double,
       val width: Double,
       val height: Double
   ) {
       fun getVolume() = length * width * height
   }
   
   fun main() {
       println(CircleCup(2.0, 5.0).getVolume()) // 62.832
       println(SquareCup(3.0, 4.0, 5.0).getVolume()) // 60.0
   }
   ```
   
   每次都要手动写 `getVolume` 很麻烦。尝试设计一个函数，利用杯子对象本身为参数，输出其体积。使用多态和继承来让 `CircleCup` 和 `SquareCup` 都能被接受，但同时能正确调用到它们各自的 `getVolume` 方法。

2. 先前我们用**策略模式**让 `sayCiallo` 可以输出到不同的目标，现在我们扩展这个程序，让**输出的位置**和**输出的内容**都可以在运行时选择：
   
   ```kotlin
   open class Greeter {
       open fun getGreeting() = ""
   }
   
   open class Printer {
       open fun print(s: String) {}
   }
   
   fun greet(greeter: Greeter, printer: Printer) {
       printer.print(greeter.getGreeting())
   }
   ```
   
   两个基类已经为你写好，尝试创建 `CialloGreeter` 和 `HelloGreeter` 提供不同的输出内容，再创建 `ConsolePrinter` 和 `FilePrinter` 提供输出到终端和文件的两种不同方式。然后，在 `main` 中组合它们（总共 4 种情况）。

> **解答**
> 
> 1. 改写后的程序如下：
>    
>    ```kotlin
>    open class Cup {
>        open fun getVolume() = 0.0
>    }
>    
>    class CircleCup(
>        val radius: Double,
>        val height: Double
>    ) : Cup() {
>        override fun getVolume() = 3.1416 * radius * radius * height
>    }
>    
>    class SquareCup(
>        val length: Double,
>        val width: Double,
>        val height: Double
>    ) : Cup() {
>        override fun getVolume() = length * width * height
>    }
>    
>    fun printVolume(c: Cup) {
>        println(c.getVolume())
>    }
>    
>    fun main() {
>        printVolume(CircleCup(2.0, 5.0)) // 62.832
>        printVolume(SquareCup(3.0, 4.0, 5.0)) // 60.0
>    }
>    ```
>    
>    多态的作用在这里体现：尽管 `printVolume` 只使用了 `Cup` 类，但两个杯子却可以正确地使用各自的 `getVolume` 方法来计算体积。
> 
> 2. 完整的程序如下：
>    
>    ```kotlin
>    import java.io.File
>    
>    open class Greeter {
>        open fun getGreeting() = ""
>    }
>    
>    open class Printer {
>        open fun print(s: String) {}
>    }
>    
>    class CialloGreeter : Greeter() {
>        override fun getGreeting() = "ciallo, world"
>    }
>    
>    class HelloGreeter : Greeter() {
>        override fun getGreeting() = "hello, world"
>    }
>    
>    class ConsolePrinter : Printer() {
>        override fun print(s: String) {
>            println(s)
>        }
>    }
>    
>    class FilePrinter : Printer() {
>        override fun print(s: String) {
>            File("a.txt").writeText(s)
>        }
>    }
>    
>    fun greet(greeter: Greeter, printer: Printer) {
>        printer.print(greeter.getGreeting())
>    }
>    
>    fun main() {
>        val cg = CialloGreeter()
>        val hg = HelloGreeter()
>        val cp = ConsolePrinter()
>        val fp = FilePrinter()
>    
>        greet(cg, cp)
>        greet(cg, fp)
>        greet(hg, cp)
>        greet(hg, fp)
>    }
>    ```
>    
>    由于写文件是覆盖式的，因此最终 `a.txt` 中的内容只有 `hello, world`。将 `writeText` 函数改为 `appendText`，即可观察到 `ciallo, world` 和 `hello, world` 两行输出。分析这个程序，体会 `greet` 这一个函数是如何达成 4 种不同行为的。如果将来有更多不同的 `Greeter` 和 `Printer`，这个程序容易扩展吗？如果是函数式编程和过程式编程，结果又如何？相信你已经有一个答案了。
