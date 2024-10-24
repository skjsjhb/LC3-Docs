# Kotlin 面向对象（下）

有了继承、重写和多态，我们终于可以以此为基础，开始向面向对象的真正核心进发。`open` 和 `override` 虽然强大，但使用起来也同样困难，而且其中还存在一些缺陷。在这一节，我们会由具体转向抽象，利用接口、抽象类和访问修饰符，将我们的设计转换成更健壮而容易维护的形式。

## 用构想补足缺陷

上一节中我们已经创建了这样的类：

```kotlin
open class Printer {
    open fun print(s: String) {}
}
```

这个方法其实并不真正做任何事情，但我们还是为它创建了方法体 `{}`，这并不是毫无开销的。此外，`Printer` 当中目前还只有一个方法，但当其中的方法多起来时，取决于设计，有些方法可能**必须**由派生类重写，有些**可以但不是必须**重写，而有些则**不能**重写。仅仅通过一个 `open` 修饰符，我们是无法进行这些区分的。

通过合理使用注释，并编写翔实的文档，我们确实可以一定程度上解决这一问题，但 Kotlin 作为一门健壮的语言，已经在**语言层面上**为我们提供了解法：

```kotlin
abstract class Printer {
    abstract fun print(s: String)
}
```

通过使用 `abstract`，我们可以将 `print` 方法标记为**抽象方法（Abstract Method）**。抽象方法算是一个**占位符**，它没有方法体，只需要定义参数和返回值。一个类如果包含抽象方法，那么它自身也需要被标记为 `abstract`，使得这个类成为**抽象类（Abstract Class）**。

?> 由于抽象方法必须被重写才有意义，因此 `abstract` 已经蕴含了 `open`，不需要再行标注。

抽象类具有如下特性：

- 可以拥有构造函数参数，但**无法被直接构造**（即不能以 `Printer()` 来创建其实例）。

- 当一个类继承一个抽象类时，以下两个条件必须满足其一：
  
  - 派生类**是抽象类**（以 `abstract` 修饰）。
  
  - 派生类**重写所有的抽象方法**。
  
  ?> 只有当类被完全“补全”的时候，才能脱离抽象类的范畴。

使用抽象类，我们可以将先前的杯子程序改写如下：

```kotlin
abstract class Cup {
    abstract fun getVolume(): Double
}

class CircleCup(
    val radius: Double,
    val height: Double
) : Cup() {
    override fun getVolume() = 3.1416 * radius * radius * height
}

class SquareCup(
    val length: Double,
    val width: Double,
    val height: Double
) : Cup() {
    override fun getVolume() = length * width * height
}
```

注意，即使基类是抽象类，在继承时也必须调用其构造函数。如果有参数，还需要提供。

这么做有一个好处，即如果我们尝试直接构造 `Cup()`，Kotlin 会报告错误。这可以确保我们不会构造出没有体积的杯子。这看上去似乎不算一个多大的改进，但是在更大的程序里，这个“没有体积”可能就会变成“没有输出”或者“没有保存文件”，这可是要命的。

## 假如类可以合成……

请看下面的例子：

```kotlin
fun readFile(f: ReadableFile) {
    // ...
}

fun writeFile(f: WritableFile) {
    // ...
}
```

这是很常见的一种程序设计方案，**方法不应要求超出其所需功能范围的参数**，有些文件是可读可写的，而有些是只读的（例如大多数网络上的文件），有些是只写的（如标准输出）。`readFile` 方法只需要一个功能至少与“可读文件”一样丰富的对象，就可以操作它来读取数据，`writeFile` 同样如此。这样，我们可以分别地维护 `ReadableFile` 和 `WritableFile`，而不会影响对方或者其它意料之外的部分。

现在的问题是，假设我们对硬盘上的文件创建一个类 `LocalFile`，它同时具备 `ReadableFile` 和 `WritableFile` 的功能，要怎么做？你或许已经试图写出这样的代码：

```kotlin
class LocalFile : ReadableFile(), WritableFile() {
    // ...
}
```

可这在 Kotlin 中是行不通的，因为 Kotlin **禁止多重继承** —— 一个类只能有唯一的基类。

> **到底怎么回事？**
> 
> 在 C++ 或者类似的支持多重继承的语言中，我们可以构造出这样的继承关系（方便起见，这里我们还是用 Kotlin 的语法来表示）：
> 
> ```kotlin
> open class Super {
>     override fun foo() {
>         println("ciallo, world")
>     }
> }
> 
> open class A1 : Super() {
>     override fun foo() {
>         println("I'm A1.foo")
>     }
> }
> 
> open class A2 : Super() {
>     override fun foo() {
>         println("I'm A2.foo")
>     }
> }
> 
> class B : A1(), A2()
> 
> fun main() {
>     B().foo() // ?
> }
> ```
> 
> `A1` 和 `A2` 都从 `Super` 中继承 `foo` 方法，然后 `B` 又从 `A1` 和 `A2` 中各继承它们的 `foo` 方法。这就引发了一个问题：如果要调用 `B` 的 `foo` 方法，**实际被调用的到底是哪个方法？**
> 
> 这个问题，被称为**钻石难题（Diamond Problem）**，并非凭空而来，而是在以 C++ 为代表的一系列具备多重继承的语言中都真实存在的。为了修补这个漏洞，无数工程师付出了巨大的努力，通过虚继承、二叉树继承、元对象协议等一系列手段，以期能解决这个大麻烦。然而，这些方法有的治标不治本，有的则是在本就复杂的语言系统上拆东补西，弄得晦涩难懂，失去了面向对象简洁而高效的优点。

Kotlin 采取了一种折中的方案，它禁止多重类继承，但相对地，它允许多重**接口（Interface）**继承。接口和抽象类很相似，唯一的区别在于接口**没有状态**。定义一个接口的方法如下：

```kotlin
interface ReadableFile {
    val fd: Int
    fun read(): String
}
```

接口使用 `interface` 关键字定义，除此之外都和类相同。此外，接口还有如下的特点：

- 在接口中定义的方法，若没有方法体，则默认是抽象的，不需要单独添加 `abstract` 关键字。

- 接口可以有属性，但它们不能拥有初始值。

- 接口没有构造方法（因此也无法创建它的实例）。

- 接口可以扩展其它接口，但不能继承其它类。

- 即便不包含抽象方法，接口也是抽象的。

?> 读者应该能从这里体会到所谓“没有状态”的含义了 —— 由于没有属性，接口没有自己的“记忆”。

---

和抽象类很相似，接口不能直接通过其名称来构造实例（因为它“不完整”）。要使用接口，就必须“继承”它。对接口的继承被称为**实现（Implement）**。实现接口的类和抽象类中的要求很相似，必须满足以下两个条件之一：

- 实现类重写接口中的所有未实现方法。

- 实现类是抽象类。

直到有一个类实现了所有缺少的方法，它才算是“脱离了”抽象类和接口的范畴，可以正常创建其实例并使用。

利用接口，我们可以把杯子程序进一步修改：

```kotlin
interface Cup {
    fun getVolume(): Double
}

class CircleCup(
    val radius: Double,
    val height: Double
) : Cup {
    override fun getVolume() = 3.1416 * radius * radius * height
}

class SquareCup(
    val length: Double,
    val width: Double,
    val height: Double
) : Cup {
    override fun getVolume() = length * width * height
}
```

在大多数情况下，接口中都只会包含抽象方法。

> **到底怎么回事？**
> 
> 接口，顾名思义，是沟通不同类之间的一种**协议**：
> 
> - 调用者根据接口，能够确定所提供的功能。
> 
> - 提供者根据接口，能够确定要实现的功能。
> 
> 只要能满足接口的需求，使用哪个类来实现接口都能被接受。这样，调用方和提供方就可以分别地维护而互不影响对方，这极大幅地改善了程序的可维护性。
> 
> 回到问题上来，接口本身是一种协议，协议定义了使用双方要遵循的规则，但协议本身什么也不做 —— 如果不去实现协议，协议就只是一张纸。在大多数情况下，我们都会通过抽象方法定义**需要的功能**，而将具体的实现留给各个实现类去完成。
> 
> 基于此，一个类是可以同时实现多种协议的 —— 只要它同时具备那些功能。对接口所添加的那些限制，恰恰是一个类能实现多个接口的必要条件。从某种程度上来说，类继承还真是“越是强大，越是脆弱”（笑）。

通过使用接口，我们就可以完成刚才的文件程序（的框架）了：

```kotlin
interface ReadableFile {
    fun read(): String
}

interface WritableFile {
    fun write(s: String)
}

class File: ReadableFile, WritableFile {
    override fun read(): String {
        // ...
    }

    override fun write(s: String) {
        // ...
    }
}
```

这样 `File` 就**实现**了 `ReadableFile` 和 `WritableFile`。在任何需要它们的地方，都可以用 `File` 的实例来提供，这就在不失去可维护性，也不增加类的个数的前提下，解决了这个问题。

---

在接口中，属性的实现也和一般的类继承没有什么区别：

```kotlin
interface Counter {
    var count: Int
}

class MyCounter : Counter {
    override var count = 1
}

fun main() {
    val c: Counter = MyCounter()
    c.count++
}
```

通过使用 `override` 关键字，我们可以为接口中的属性提供实现。

---

最后一个值得关注的问题是：何时使用接口，而何时使用抽象类？可以按照以下的规则来区分：

- 抽象的部分需要能保存状态吗？如果是 —— 抽象类。

- 需要类似多重继承的功能吗（只使用一个类满足多个需求）？如果是 —— 接口。

- 需要属性值吗？如果是 —— 抽象类。

- 如果你还不能确定 —— 接口。

## 安全检查

在 C 中使用结构体时，有人常常无视警告，坚持访问不该访问的属性：

```c
struct Student {
    char id[11];

    // 不要改变这个值！
    // 不要改变这个值！
    // 不要改变这个值！
    double gpa;
};

void mySecretFunctionToAddGpa(struct Student *s) {
    // 但依然阻止不了……
    s->gpa = s->gpa + 99999.0;
}
```

还记得我们在第一节中就提到过的吗？许多的程序错误来自于**错误地改变了不该改变的值**。在面向对象中，这一点显得更加明显：有些属性和方法只应当在特定的情形下使用，否则就会造成错误。

为了解决这个问题，Kotlin 添加了**访问修饰符（Visibility Modifier）**。尽管本节的主题是面向对象，但访问修饰符除了能适用于方法和属性外，也可以应用于一般的（不在类中的）函数和全局变量。

访问限制符有四个等级：

- **`public` 公开**：指定的成员可在任何情况下访问。

- **`internal` 内部**：指定的成员只能在当前的模块中使用。
  
  ?> Kotlin 程序除直接运行外，也经常被用作库来使用。`internal` 确保指定的成员只能在其自身所在的程序中使用，而不能被外界访问。

- **`protected` 保护**：指定的成员只能由当前类及其派生类使用，对外不可见。
  
  ?> 这个修饰符只能用于类中的属性和方法。

- **`private` 私有**：指定的成员只能由当前的类（对于属性和方法）或文件（对于类本身、函数和全局变量）使用，对派生类和外部都不可见。

如果不加以任何修饰，默认的修饰符是 `public`。

---

修饰符的使用十分简单直白：

```kotlin
open class Greeter {
    protected fun greet() {
        println("hello, world")
    }

    private fun secretMethod() {
        println("You didn't see anything")
    }
}

class CialloGreeter : Greeter() {
    private fun sayCiallo() {
        println("ciallo, world")
    }

    fun publicGreet() {
        greet() // OK，因为 greet 是 protected
        secretMethod() // 错误，因为 secretMethod 是 private
    }
}

fun main() {
    val g = CialloGreeter()
    g.sayCiallo() // 错误，因为 sayCiallo 是 private
    g.greet() // 错误，因为 greet 是 protected
    g.publicGreet() // OK（如果不考虑方法内部的错误），因为 publicGreet 默认是 public
}
```

至于选用什么样的访问修饰符并没有强制的规则，但大量的实践都表明，减少公开成员的数目有助于提升程序的可维护性（因为必须保持功能不变的方法更少）。我们可以参考变量和重写方法那里使用的原则：先将所有元素都加上 `private`，然后，在某个元素需要被外部（或派生类）访问时，扩展它的访问修饰符。这样我们可以给所有的元素刚刚好的访问权限，但绝不会超出这个范围。

!> `main` 方法需要是 `public` 的，因为启动程序时会从外部调用它。

利用访问修饰符可以有效地辅助进行**封装（Encapsulate）**，封装就像给电脑加上外壳一样，用户通过键盘、触摸板和显示器与机器的内部元件进行交互，而无需关注具体细节。同时，限制用户对于内部细节的访问也使得机器整体更不容易损坏。在程序设计中，这一点也是相同的。

## 在结束之前

到这里为止，我们就算是（粗略地）带过了 Kotlin 面向对象的主要特性。有关面向对象的故事真是讲也讲不完，在这有限的篇幅里，即便是要点也是难以概括的，更别提细枝末节了。相比 Java，Kotlin 在类的使用上做了许多改进，使用起来更灵活的同时，也要求编程者对于继承等机制的原理有更深入的理解。总的来说，面向对象很强大，而与之相对的，使用起来也不那么简单。通过编程练习和应用，读者将能够有进一步的体会。

## 练习题

1. 请看以下的代码：
   
   ```kotlin
   interface Writable {
       fun write(s: String)
   }
   
   fun main() {
       val w: Writable
       // ...
   }
   ```
   
   以你喜欢的方式，实现 `Writable` 接口，并在 `main` 中利用它写入你喜欢的内容。你可以将接收的字符串打印到控制台，写入文件，赋值给某个属性或者只是单纯地丢弃掉（尽管这就不那么有趣了），等等。

2. 下面的程序没有使用访问修饰符，因此在封装上有所欠缺：
   
   ```kotlin
   class Cup(
       val height: Double,
       val radius: Double
   ) {
       fun getVolume() = 3.1416 * radius * radius * height
   }
   
   fun main() {
       println(Cup(2.0, 3.0).getVolume()) // 56.5488
   }
   ```
   
   为属性和类添加合适的访问修饰符，尽可能地减小访问范围，但不要引起错误。

> **解答**
> 
> 1. 一种实现方法如下：
>    
>    ```kotlin
>    interface Writable {
>        fun write(s: String)
>    }
>    
>    class Writer : Writable {
>        override fun write(s: String) {
>            println(s)
>        }
>    }
>    
>    fun main() {
>        val w: Writable = Writer()
>        w.write("ciallo, world") // ciallo, world
>    }
>    ```
>    
>    该程序选择将接收的字符打印到控制台。
> 
> 2. 程序可以这样改写：
>    
>    ```kotlin
>    private class Cup(
>        private val height: Double,
>        private val radius: Double
>    ) {
>        fun getVolume() = 3.1416 * radius * radius * height
>    }
>    
>    fun main() {
>        println(Cup(2.0, 3.0).getVolume())
>    }
>    ```
>    
>    读者可能会有疑问：为何不对 `getVolume` 加上 `internal` 修饰符？这是因为 `private` 对于 `Cup` 的修饰已经使得 `Cup` 类只能在当前文件中访问，而访问 `Cup` 是访问 `getVolume` 的前提，`internal` 不会使得 `getVolume` 的访问范围小于当前文件，所以没有必要添加。
