# Kotlin 面向对象（上）

过程式编程和函数式编程在规模不算太大的项目中表现得很好，一个的代码简单易读，另一个则是在可扩展性和可维护性上都更进一步。然而，对于规模更大一些的项目，或者那些牵涉很多数据交换的程序，只用这两种范式，就有些力不从心了。

造成这一困难的主要原因，是在这两种范式中，都是由函数主导着程序的架构。当项目中的函数还算少时，我们可以轻而易举地找出需要的函数来处理数据，但如果项目中有几千个函数呢（这并不算多）？或者更多？这时候**为数据选择处理方法**就成为了一件极为困难的事情。

有没有一种方法，我们可以**将数据本身和与它相关的处理方法“打包”在一起**，这样我们就不必再在浩如烟海的函数大海中寻找所需的函数了呢？这就是**面向对象**的程序设计。 

## 找不到对象

你一定在各种网站上都见到过这个经典的程序员笑话：

![.](https://imgos.cn/2024/08/10/66b70c80070ff.png)

当然，这里的“对象”可不是“婚姻的另一半”。“对象”一词的英文是 Object，在中文里，类似的意思其实是“东西”、“物件”。也就是说，“对象”实际上是一个很宽泛的概念 —— **任何东西都可以叫做“对象”**。数字是对象，一些文本是对象，一条狗是对象，一个杯子是对象，就连一个程序本身也可以是一个对象。这么说可能有些拗口，不过暂且就把“对象”当作是“东西”的意思吧。

---

即使是东西之间也有差距，为了描述不同对象所具有的相同或不同特征，在程序中我们会定义一些变量来描述对象。例如，假设你经营着一家杯子制造商，为了控制产品质量，你希望用程序记录下产品的尺寸信息。为此，你开始着手定义一些变量：

```kotlin
val radius = 3
val height = 5
val color = "White"
```

这里有个小问题，我们知道这些变量能够描述一个杯子，也就是说，**这些变量之间本应存在关联关系**，但从程序的角度上我们看不出来这一点。当程序中涉及的问题变多时，这些变量很快就会把事情弄得一团糟。

有什么办法可以解决这个问题呢？像这种“属于”某个东西的数据，被称作**属性（Property）**。例如，在常见的 RPG 游戏里，玩家的角色会具有生命值、攻击力、防御力~~、共鸣效率~~等所谓的“数值”，其实也就是一种属性。既然这些变量都属于某样东西，我们自然会想把它们“打包”起来，用术语说，也就是**封装（Encapsulation）**。虽然名字有点陌生，不过你其实已经在 C 中做过类似的事情了：

```c
struct Cup {
    double radius;
    double height;
    char color[16];
};
```

在 C 中，我们能够将一些变量封装到一个结构体中，以供稍后创建和使用。在 Kotlin 中，我们也可以做类似的事情：

```kotlin
class Cup {
    var radius: Double = 0.0
    var height: Double = 0.0
    var color: String = "Unknown"
}
```

我们用 `class` 取代了 `struct`，并把变量的定义改成了 Kotlin 的格式，就这么简单，我们就创建了一个**类（Class）**。

?> 你可以暂且把“类”认为是高级一些的结构体，不过二者之间有较大的差别，类具有很多结构体所不具备的功能，我们将在稍后介绍。

这里必须注意，Kotlin 作为一门很严格（也很健壮）的语言，它不允许存在未初始化的属性，因此**必须给这些属性赋初始值**。此外，这里我们通过冒号 `:` 显式地声明了类型，但与其它地方一样，Kotlin 能从初始值推断属性的类型，因此这个类型声明并不必要，只是出于代码可读性的考虑。

---

当有了类之后，我们并不能直接用它的名字对属性赋值：

```kotlin
fun main() {
    Cup.radius = 1.0 // 错误！
}
```

这是因为**类只是描述对象的蓝图**，你可以用蓝图描述房子，但你不可能住在一张蓝图里 —— 相反，必须先根据类的信息，创建一个对象，然后使用这个对象的信息。正确的代码如下：

```kotlin
fun main() {
    val cup = Cup()
    cup.radius = 1.0
}
```

我们通过在类名后加上一对小括号 `()` 来**创建一个 `Cup` 类的对象**，这个根据蓝图“盖房子”的过程被称作**实例化（Instantiation）**。请注意这里与 C 不同，在 C 中，编译器会自动在栈中分配 `struct` 的空间，但 Kotlin 中的对象存储在一块被称为堆的内存空间中，必须显式地通过类名来创建对象。

?> Kotlin 使用全自动内存管理，被创建的对象将在不再需要时由 Kotlin 自动清除。

这里，尽管我们使用 `val` 创建了 `cup`，但我们还是可以改变它的属性！这一点或许有些令人惊奇，不过 **`val` 的不可变性仅限于变量本身**。你不能把 `cup` 换成另一个杯子，但你可以对它进行磨削、涂色等，大致就是这样的意思。要详细解释这一点，我们将需要了解关于引用的知识，这属于高级技巧，将在后面的章节中介绍。

---

有了类这个蓝图，我们就可以批量“生产”对象了。只要你需要，你可以创建许多个杯子：

```kotlin
class Cup {
    var radius: Double = 0.0
    var height: Double = 0.0
    var color: String = "Unknown"
}

fun main() {
    val c1 = Cup()
    c1.radius = 2.0
    c1.height = 5.0
    c1.color = "Blue"

    val c2 = Cup()
    c2.radius = 4.0
    c2.height = 8.0
    c2.color = "White"
}
```

**每个对象都独立地拥有自己的属性**，这样我们就实现了将数据“打包”的目的：我们不再需要分别地创建变量去描述杯子，只需要定义一个用于描述杯子的类，再利用这个类来存储数据。即使将来我们想要为杯子增添一些属性，也**只需要修改 `Cup` 的定义**，而不需要跑到每个用到杯子的地方去增加一个变量。

顺便一提，`c1` 和 `c2` 的类型是 `Cup`，这是因为它们是由类 `Cup` 实例化而来的，而 Kotlin 可以直接将类名用作类型。（这一点虽然看上去很自然，但在逻辑上却并不是显而易见的）

---

能够存储属性固然很令人兴奋，可那并不是面向对象的全部（甚至都算不上冰山一角）。我们不能止步于此，尽管到目前为止的知识都还能用 C 勉强进行类比，但接下来我们将与熟悉的 C 挥手作别，唯有如此，我们才能超越 C 的局限性，去探索面向对象的真正威力。

## 你来助我！

让我们扩展上面的程序，计算杯子的容积：

```kotlin
class Cup {
    var radius: Double = 0.0
    var height: Double = 0.0
    var color: String = "Unknown"
}

fun volumeOf(cup: Cup) =
    3.1416 * cup.radius * cup.radius * cup.height

fun main() {
    val c1 = Cup()
    c1.radius = 2.0
    c1.height = 5.0
    c1.color = "Blue"

    println(volumeOf(c1)) // 62.832
}
```

这没什么特殊的，我们只不过是将变量 `c1` 传递给了 `volumeOf` 函数，后者利用体积公式计算出其体积，这一点你在 C 中也做过的。

> **你是职业选手吗？**
> 
> Kotlin 在传递**任何**对象时都视作**按引用传递**（包括基本类型），也就是“只送大脑”。如果不显式创建（通过构造方法或者立即数），则 Kotlin 不会复制任何对象。

但是，这里引出了一个与先前类似的问题，`volumeOf` 是用于计算杯子的体积的，它理应与 `Cup` 有所关联，但是在程序中我们却完全看不出这一点。我们能否**把 `volumeOf` 也合并到 `Cup` 类中**呢？答案是肯定的。

---

类定义中除了可以有变量（属性），也可以有函数。当函数定义在类中时，它被称为**方法（Method）**。现在，让我们把 `volumeOf` 合并到 `Cup` 中，并稍微改变一下它的名称：

```kotlin
class Cup {
    var radius: Double = 0.0
    var height: Double = 0.0
    var color: String = "Unknown"

    fun getVolume() =
        3.1416 * radius * radius * height
}

fun main() {
    val c1 = Cup()
    c1.radius = 2.0
    c1.height = 5.0
    c1.color = "Blue"    

    println(c1.getVolume()) // 62.832
}
```

我们在类 `Cup` 中定义了方法 `getVolume` 用以计算体积，并通过 `c1.getVolume()` 调用了这个方法。这个写法的含义就是“使用 `c1` 的属性，调用 `getVolume` 方法”。**方法必须依附在一个对象上调用**，这就像你在 RPG 游戏中要施放技能，技能总是依附在某个角色上，而不能凭空召唤出来。

现在来看 `getVolume` 的定义，我们居然可以直接使用 `Cup` 类的属性！当然我们先前也说了，`Cup` 只是一张蓝图，它并不持有这些属性，真正持有这些属性的是每个实例化得到的 `Cup` 对象。**方法中所使用的属性，来自其调用时所依附的对象。**现在我们用的是 `c1.getVolume()`，所以方法使用 `c1` 的属性计算体积；如果我们写 `c2.getVolume()`，方法就会使用 `c2` 的属性计算体积，以此类推。

更一般地，当我们写 `a.f()` 时，我们说这是**“在对象 `a` 上调用方法 `f`”**，也就是取 `a` 的属性，并以此为根据执行方法 `f`。

这么做有什么好处呢？

方法的定义让我们不再需要关心**“怎么做”**，而是**“做什么”**。我们不需要从茫茫的函数大海中挑选出 `volumeOf` 函数来计算体积，相反，我们让这些方法“跟着对象走”。**对象本身即包含了完成与其相关的操作的全部信息**，包括**数据**和**行为**。这让程序变得更容易维护。换句话说，我们让程序由“我来助你！”变成了“你来助我！”（笑）。

?> 当然，这并不是方法的最大好处。通过合理设计函数，我们还是有办法在不使用方法的情况下来让程序同样容易维护。方法真正“绝杀”掉过程式编程和函数式编程的一点，将在后面提到。

---

在我们继续探索有关方法的知识前，让我们先来看一段轻松的内容，这能解决对象创建中的一些痛点。

## 出厂设置

你是否也曾厌烦过这样初始化结构体：

```c
struct Student {
    int id;
    double gpa;
};

int main(void) {
    struct Student s1;
    s1.id = 1;
    s1.gpa = 8.0;

    struct Student s2;
    s1.id = 2;
    s1.gpa = 16.0;

    struct Student s3;
    s1.id = 3;
    s1.gpa = -32.0;

    // ...

    return 0;
}
```

没人喜欢这样给属性赋值，“如果有个函数能自动化地创建这些东西就好了！”，你这么想着，开始编写这样的函数，进行“出厂设置”：

```c
void createStudent(struct Student *s, int id, double gpa) {
    s -> id = id;
    s -> gpa = gpa;
}
```

好吧，但是这样我们就又多了一个本不必要的函数，并且还可能会忘记调用……真是令人头疼。在 Kotlin 中，我们不需要再这么做了，请看下面的代码：

```kotlin
class Student(aId: Int, aGpa: Double) {
    var id: Int = 0
    var gpa: Double = 0.0

    init {
        id = aId
        gpa = aGpa
    }
}

fun main() {
    val s1 = Student(1, 8.0)
    val s2 = Student(2, 16.0)
    val s3 = Student(3, -32.0)
}
```

我们通过在类名后加了一对小括号 `()`，要求**“如果想使用 `Student` 类，就请提供两个参数！”**。这两个参数要如何提供呢？就填在创建对象时，类名后的小括号 `()` 里，和函数调用非常相似。

一旦我们在定义类的时候“要求”了额外参数，我们就可以在 `init` 块中**使用它们来初始化对象**，初始化的方法也就是简单的赋值。读者可能会有疑问，创建对象时并没有“依附”在哪个对象上，那么这些属性来自哪里？事实上，这些属性来自**当前正在创建的对象**，也正是由此，我们才能实现“出厂设置”的效果。这就是对象的**构造（Construction）**。

定义这些用于初始化的参数，并使用它们初始化对象，这些工作叫做**构造函数（Constructor）**。事实上，在先前我们用 `Cup()` 创建对象时，其实也调用了构造函数，只是由于它没有参数，这一点并不明显。

?> `init` 的位置可以任意放置，也可以有多个，但对于每个块，必须确保其使用到的属性出现在该块之前。

当然，`init` 块说到底也只是包含了一堆语句，可以用它们来初始化对象，也可以做一些其它的事情（例如输出“创建了对象”这样的消息）。

---

像上面这样初始化，显得有些臃肿，Kotlin 是一门优雅的语言，因此，你可以想到，我们能够简化对象初始化的过程：

- 简单的属性赋值可以不使用 `init` 块，而**在定义时直接赋值**：
  
  ```kotlin
  class Student(aId: Int, aGpa: Double) {
      var id: Int = aId
      var gpa: Double = aGpa
  }
  ```
  
  由于 `init` 块中现在没有内容，我们可以将其删去。

- 如果属性**只在对象创建时赋值一次**，后续不需要再改变，则可以改用 `val`：
  
  ```kotlin
  class Student(aId: Int, aGpa: Double) {
      val id: Int = aId
      val gpa: Double
  
      init {
          gpa = aGpa
      }
  }
  ```
  
  无论是否使用 `init` 块都可以这么做，但是**“只能赋值一次”的规则不能被打破**，也就是说，如果在定义不可变属性 `id` 时为其赋了初始值，那么不能再通过 `init` 改变。

- 如果某个属性**只是简单“复制”参数**，那么可以**将这个属性挪到构造对象所需的参数中**，Kotlin 将**自动为其赋值**：
  
  ```kotlin
  class Student(val id: Int, val gpa: Double)
  ```
  
  由于将属性挪动后，类定义的大括号 `{}` 内已经没有内容，因此我们省略掉这个大括号 `{}`。
  
  ?> 注意 `id` 和 `gpa` 尽管定义在了参数的位置，但**它们仍然是属性**，你可以通过它们前缀的 `val` 或者 `var` 辨识这一点。
  
  构造 `Student` 时仍然要为其提供两个参数，根据上面的语法，这些属性会被自动初始化：
  
  ```kotlin
  fun main() {
      val s1 = Student(1, 8.0)
      println(s1.id) // 1
  }
  ```

很快你就会发现，Kotlin 的这些“小小特性”实在是太方便了，这也是它能取代 Java 成为 Android 开发的首选语言的众多原因之一。即使不是用于 Android 开发，Kotlin 在通用编程领域中也十分出色。

## 在结束之前

有关面向对象的内容可以写上好几本大厚书，即使长话短说也是说来话长。通过短短数千数万字阐明面向对象那是不切实际的，而即使把目光局限在 Kotlin 最基本的面向对象语法上，要在一节内讲述明白也是很困难的。面向对象分为**封装、抽象、继承、多态**四大要点，这一节仅仅介绍了抽象，并对封装略有提及。在接下来的小节中，我们会学习到继承和多态，并由此窥见面向对象的真正奥义和与其相匹配的力量。

## 练习题

1. 下列程序利用函数式编程，向不同名称的用户输出欢迎信息：
   
   ```kotlin
   fun createGreeter(name: String): () -> Unit {
       return {
           println("ciallo, $name!")
       }
   }
   
   fun main() {
       val greetMe = createGreeter("there")
       greetMe() // ciallo, there!
   
       val greetWorld = createGreeter("world")
       greetWorld() // ciallo, world!
   }
   ```
   
   试用面向对象的设计方法，实现同样的功能。要注意，这里所要描述的对象比较抽象，不像 `Cup` 和 `Student` 那么显而易见，这次要描述的是“欢迎程序”，即 `Greeter`。这个练习旨在熟悉如何**对一些抽象的功能应用面向对象的设计方法**。
   
   在实现完你的程序后，试着为你的程序添加向用户道谢的函数（`thanks, $name!`），并在主程序中调用它们，看看你的程序是否**易于扩展**。

2. 下面的程序写得有些过于臃肿了，而且有些部分不符合面向对象的设计思想：
   
   ```kotlin
   class Cup {
       var radius: Double = 0.0
       var height: Double = 0.0
       var color: String = "Unknown"
   
       fun getVolume() = 3.1416 * radius * radius * height
   }
   
   fun sellCup(cup: Cup) {
       println("Cup with volume ${cup.getVolume()} and color ${cup.color} was sold!")
   }
   
   fun main() {
       val c = Cup()
       c.radius = 2.0
       c.height = 5.0
       c.color = "White"
       sellCup(c) // Cup with volume 62.832 and color White was sold!
   }
   ```
   
   改进该程序，使其符合面向对象的设计方法，同时利用构造函数来简化对象的初始化。

> **解答**
> 
> 1. 使用面向对象范式的程序如下：
>    
>    ```kotlin
>    class Greeter(val name: String) {
>        fun greet() {
>            println("ciallo, $name!")
>        }
>    }
>    
>    fun main() {
>        val meGreeter = Greeter("there")
>        meGreeter.greet() // ciallo, there!
>    
>        val worldGreeter = Greeter("world")
>        worldGreeter.greet() // ciallo, world!
>    }
>    ```
>    
>    仔细阅读代码，分析 `name` 属性的定义和使用流程，以及“用户名”这一数据的传递过程，体会其中的设计思想。
>    
>    要扩展这个程序也非常容易：
>    
>    ```kotlin
>    class Greeter(val name: String) {
>        fun greet() {
>            println("ciallo, $name!")
>        }
>    
>        fun thank() {
>            println("thanks, $name!")
>        }
>    }
>    
>    fun main() {
>        val meGreeter = Greeter("there")
>        meGreeter.greet() // ciallo, there!
>        meGreeter.thank() // thanks, there!
>    
>        val worldGreeter = Greeter("world")
>        worldGreeter.greet() // ciallo, world!
>        worldGreeter.thank() // thanks, world!
>    }
>    ```
>    
>    在这一点上，面向对象的设计比函数式编程更灵活。
> 
> 2. 优化后的代码如下：
>    
>    ```kotlin
>    class Cup(
>        val radius: Double,
>        val height: Double,
>        val color: String
>    ) {
>        fun getVolume() = 3.1416 * radius * radius * height
>    
>        fun sell() {
>            println("Cup with volume ${getVolume()} and color $color was sold!")
>        }
>    }
>    
>    fun main() {
>        val c = Cup(2.0, 5.0, "White")
>        c.sell() // Cup with volume 62.832 and color White was sold!
>    }
>    ```
>    
>    程序这样设计，就比原先的写法要短，而且功能划分更清晰。将来，如果需要改变销售杯子的行为，只需要寻找 `Cup` 的定义，就能很容易修改 `sell` 函数。同时，即使将来杯子的销售因各种因素（如体积）发生改变，也不必修改多少代码就能实现。
