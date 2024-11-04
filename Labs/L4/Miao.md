# Lab 4: Saving for a Rainy Day  (Miao's Edition)

## Brief

> For the foreseeable future.

It's glad to see you escape from your English homework about palindromic strings! Like your imaginary English homework, our labs (assembly ones) have also come to its turning point. As the very middle lab of the entire series, endurance is the only key to success. I know you're getting tired of these labs and that's completely normal. Keep your breath. Don't let go. We're not only doing it for today, but for the future.

## Intro

Maybe you are familiar with the story below:

Sakiko was once the daughter of a wealthy family, but due to a family misfortune, her father became despondent and turned to alcohol. As a result, Sakiko had to start working to support the household. Each month, Sakiko earns some money, while her father spends some, more or less.

In order to not end up opening the wallet disappointed, Sakiko plans to calculate her savings, here's what she knows so far:

> - Sakiko now has $10 in her wallet.
> 
> - Sakiko earns $6 for the first month, and the income gets doubled after each.
> 
> - Sakiko's father spends $2 for the first month, and grows to 4 times as the previous month after each.
> 
> - If Sakiko's father spends more (or the same) money than Sakiko has earned for that month, Sakiko admonishes him and resets the spending to $2 for the next month.

Sakiko want's to know how much money she can have after some months.

If you like to describe the problem in a more formal way, here's the rewritten version:

> $ S_0 = 10 $
> 
> When $ n \ge 1 $: $ S_n = S_{n-1}  + E_{n-1} - T_{n-1} $
> 
> ---
> 
> $ E_0 = 6 $
> 
> When $ n \ge 1 $: $ E_n = E_{n-1} \times 2 $
> 
> ---
> 
> $ T_0 = 2 $
> 
> When $ T_{n-1} \ge E_{n-1} $: $ T_n = 2 $
> 
> Otherwise: $ T_n = T_{n-1} \times 4 $
> 
> ---
> 
> Evaluate $ S_n $ for a given $ n $.

## Tasks

Tell Sakiko how much money can she earn after `N` months.

- Using the top-down solution is **enforced**. i.e., Create functions to calculate $ S_n $, $ E_n $ and $ T_n $ using recursion.

- The input `N` locates at `x3100`.

- The output should be positioned at `x3200`.

- `N` is no more than `10`.

## Examples

Input (at `x3100`):

```
3
```

Output (at `x3200`):

```
10
```

## Requirements

- `R0` to `R7` has been cleared for you (in this lab only).

- `N` might be `0` but not negative.

## How To

### Call a Function

LC-3 is capable for calling a subroutine and return back:

```
JSR FOO
AND R0, R0, x0
ADD R0, R0, x5
JSR FOO
; R0 = 10 (xa)

HALT

FOO
ADD R0, R0, R0
RET
```

However, a recursive call like the following in C:

```c
int fib(int i) {
    if (i == 1 || i == 2) return 0;
    return fib(i - 1) + fib(i - 2);
}
```

Will **NOT** work in LC-3, as the value of registers can **change** when calling a subroutine, like what has happened in the example. Take `i` for example, when returning from the call to `fib(i - 1)`, the value of `i` may have already changed, and `fib(i - 2)` will not give you the answer you want.

To solve this problem, we need to **save and restore** the registers, by using the following pattern:

1. Before calling a function, the caller **pushes** each register into the stack.

2. The function is called and it returns.

3. After the function is called, the caller **pops** each register from the stack, reversed.

As during each call, the push operation and the pop one are paired, we can **ensure we're popping out the right value** which has been saved before calling.

---

Implementing a stack is also easy:

1. Pick an address as the cursor (usually `x6000`).

2. Pushing: place the value at the cursor, then **move the cursor left** (smaller).

3. Popping: read the value at the cursor, then **move the cursor right** (larger).

Suppose `R6` is the stack pointer, here's the code to push / pop `R0` into / from the stack:

```
; PUSH
STR R0, R6, x0
ADD R6, R6, x-1

; POP
ADD R6, R6, x1
LDR R0, R6, x0
```

And that's it! By saving and restoring the value of registers, variables inside a function will not get messed up, and we're able to create functions to calculate $ S_n $, $ E_n $ and $ T_n $.

## Boilerplate

Again, to speed up your process, get started by using the following code:

```
.ORIG x3000

LDI R0, INPUT

; ...

STACK .FILL x6000
INPUT .FILL x3100
RESULT .FILL x3200

.END
```

## Tips and Tricks

- Save and restore all registers, especially `R7`, or the program will not return to the correct instruction. After doing so, feel free to call the functions using `JSR`.

- Bear in mind that `STR` **requires 3 operands**.

- The `STACK` label (at which the value `x6000`) is provided as the **initial pointer** of the stack. The **current pointer** is usually stored in `R6`.

## Report

The report is the same as what you have done in Lab 1.

## Submit

Do the same as what you've done in Lab 2.
