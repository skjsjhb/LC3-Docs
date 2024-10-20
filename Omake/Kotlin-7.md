# Kotlin 面向对象（下）

有了继承、重写和多态，我们终于可以以此为基础，开始向面向对象的真正核心进发。`open` 和 `override` 虽然强大，但使用起来也同样困难，而且其中还存在一些缺陷。在这一节，我们会由具体转向抽象，利用接口和抽象类，将我们的设计转换成更健壮而容易维护的形式。

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

## 钻石难题
