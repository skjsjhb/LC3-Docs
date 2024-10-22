# Lab 2: Checked by LC-3 (Miao's Edition)

## Brief

> Someone got the reason but never really find the rhyme.

Got your Lab 1? No? Got **by** it instead? Well, words are there, "may our past be past". Composing program using only a notepad looks awesome, but is way far from being practical for real-world requirements. This lab, Lab 2, will introduce **assembly** to you. Revive yourself if you were downed in the last lab, reload your editor, charge up your laptop, and dive into the second lab.

## Intro

You might have already seen this meme before:

![](https://img.picui.cn/free/2024/10/10/67075167aa482.png)

**"This is checked by C++."** Indeed, computer scientists focus more on practices. The Goldbach's conjecture is hard to solve, but has been proved to be right within numbers smaller than $ 4 \times 10^{18} $. For practical usages, this is already enough. (Personal opinion)

We **can** use LC-3 to verify the Goldbach's conjecture (in some ways, at least), but this can be super hard for the tiny machine. Therefore, we have an easier question here:

> **The Collatz Conjecture**
> 
> 1. Choose an arbitrary number.
> 
> 2. Change your number as below:
>    
>    - If it's odd, times it by 3, then add it by 1. That is:
>      
>      $ a_{n+1} = 3a_n + 1 $
>    
>    - If it's even, divide it by 2. That is:
>      
>      $ a_{n+1} = \frac{a_n}{2} $
> 
> 3. After some steps, it will become 1.

Seems easy? Prove it! Okay, easy, easy, we're not in a maths class. We are going to verify it using LC-3 today.

## Tasks

For a given number, verify the Collatz conjecture for it. Count how many steps it takes to become 1.

- The input number will be placed at the memory address `x3100`.

- The output number should be placed at the memory address `x3101`.

## Examples

Suppose the input number is `6` (in `x3100`), your output should be:

```
8
```

Since:

```
6 -> 3 -> 10 -> 5 -> 16 -> 8 -> 4 -> 2 -> 1
```

It takes 8 steps, **excluding** the initial number 6, but **including** the ending number 1.

## Requirements

- Create the program using **LC-3 assembly**.
  
  - Something like `LDI R0, INPUT`.
  
  - It's recommended to **format your code** according to the "Code Style" section. Good format not only saves you from messed up code, but also rules out risks of potential bugs and pitfalls.

- Your program will be loaded at `x3000`.
  
  - This will be the same for Lab 3 to Lab 5, we won't mention this again.

- Make sure to **terminate your program** using `HALT`, just like how you use `return 0;` in your C programs.
  
  - LC3XT will throw an RE (and refuse to accept) if you don't do this. LC3Tools will also complain for exceptions.

- The input number is **guaranteed to be smaller than 100** (exclusive), and greater than 2 (inclusive).

- Make sure that your code comes from you.

## How To

### Divide Something by 2

It's easy to times something by 2, by adding something to itself:

```
ADD R0, R0, R0
```

But what about **dividing**? LC-3 does not come with `DIV` or `SHR`, and is not really trivial to implement. Actually, we have 2 solutions for this problem, one being brute, while another one being faster but harder to code.

#### The Brute Way: Trial and Error

The easier way is to **try each number**. You set a register to 0, times it by 2, check if it equals to your number. No? Add it by 1, try again. Still no? Repeat this, until you find out the correct answer.

How fast is this? Since a register can hold a signed number at most 32767, you'll need to check **16383 numbers** under the worst case (or 8192 times on average), which is not really bad. However, 8192 tries for a single division seems not that... **gentle**. Can we do this better?

Maybe.

#### The Gentle Way: Bit by Bit

Dividing something by 2 means **shifting the number right** for 1 bit. We can **test each bit** of the original number, and use the information to **build a new number**. Here's how to do this:

1. Use 2 registers: `R0 = 1`, `R1 = 2`. We'll use `R1` to test the number, and use `R0` to save the number before doubled.

2. `AND` the original number with `R1`. This **extracts** the bit corresponding to `R1`, just like what you've done in HW1.

3. Use `BRz` to **test the result**:
   
   - If it's not zero, it means the corresponding bit is `1`. Since you want to shift it right, you add `R0` (`R1` shifted right by 1 bit) to your result.
   
   - If it's zero, it means the corresponding bit is `0`. You skip this bit.

4. Shift `R0` and `R1` left for 1 bit. (Thus `R0` is still `R1` shifted right by 1 bit)

5. Repeat this, until you've tested all bits.

> For example, suppose you have `01001000` and you want to divide it by 2:
> 
> 1. Set `R0 = 00000001, R1 = 00000010`.
> 
> 2. `01001000 AND 00000010 (R1)` is `0`, skipped, times `R1` and `R0` by 2. (`R0 = 00000010, R1 = 00000100`)
> 
> 3. `01001000 AND 00000100 (R1)` is `0`, skipped, times `R1` and `R0` by 2. (`R0 = 00000100, R1 = 00001000`)
> 
> 4. `01001000 AND 00001000 (R1)` is `1`, you add `00000100 (R0)` to the result, then times `R1` and `R0` by 2.
> 
> ...Continue these steps and you'll get `00100100` eventually, which is `01001000` divided by 2.

The second method is much faster as we only need to test 15 times, that's **more than 500 times faster**! Such differences may not be noticable in LC3Tools, but if you run it for many times and benchmark it, analytics will eventually pay off for your effort.

### Far Load and Far Set

You can use `LDI` and `STI` to access memory that's not labelled, by declaring its **address**:

```
LDI R0, INPUT       ; Load the value in x3100 to R0
STI R0, OUTPUT      ; Save the value in R0 to x3101

; More...

INPUT  .FILL x3100
OUTPUT .FILL x3101
```

But be careful of a pitfall: **do not execute data as instructions**. `x3100` is perfectly valid as an address, but not quite so as an instruction (it's `ST R0, <SomeAddress>` if you're curious). I know you'll say "I will never execute the data!", and surely I believe in you, but things can go out of control **without being realized**. For example, consider the code below:

```
LDI R0, INPUT
INPUT .FILL x3100
; More...
```

LC-3 **picks instructions one by one**, it picks and executes `LDI`, then it **moves next**, without realizing `x3100` is **not really supposed to be executed** —— it doesn't care, since that's how Von Neumann architecture works. You know `x3100` is an address because you are in **assembly**, while in the point of view of LC-3, it only sees `x3100`. It interprets it as `JMP R0` and everything starts to mess.

To wipe out any chance that PC moves to the data addresses, we have two choices:

1. Branches over them:
   
   ```
   BR   SKIP_DATA
   
   INPUT  .FILL x3100
   OUTPUT .FILL x3101
   
   SKIP_DATA
   ; More...
   ```

2. Place them after `HALT` to make them unreachable:
   
   ```
   ; More...
   HALT
   
   INPUT  .FILL x3100
   OUTPUT .FILL x3101
   ```

You can choose either way you like, but I'll suggest the second one since it won't "pollute" the style of your critical code.

### Declare an LC-3 Program

A valid LC-3 program should be **wrapped within** an `.ORIG` pseudo instruction and an `.END` one. Like this:

```
.ORIG x3000
; ...Instructions
.END
```

The number after `.ORIG` tells LC-3 assembler **where to load your code**. As I've already said that your code starts at `x3000`, you write `.ORIG x3000` directive here.

`.END` marks the end of your program. Note that `.END` by itself **does not do anything**. It's just a mark in the source and will be removed once assembled.

### Clear Registers

All registers are randomized when LC-3 starts up. Considering this, it's better to clear a register before using it. Take `R0` for example:

```
AND R0, R0, x0 
```

If your program behaves weirdly, please consider register clearance as a possible cause.

## Tips and Tricks

- If you find the gentle way of divison is too hard, feel free to use the brute way.

- `BRnzp` can be shortened to `BR`.

- Never forget to **write the output** (store to memory in this case). It's easy to forget this after you've completed the core algorithm and being relaxed.

- Although not enforced, it's **possible** to complete the program with **no more than 40 lines of code**, using the bit-test approach for division.

- Do not execute data. If your program is behaving suspiciously, check this first. (LC3XT should also warn you when testing, but we can't rely on that)

## Code Style

This is a recommended code style for LC-3 which looks quite clean and tidy. We do not enfore any specific code style in your code, but if you follow this code style (even only part of it), you can make your code more readable, easier to write, and being more solid.

1. Put one instruction in one line:
   
   ```
   ADD R0, R0, x0 AND R0, R0, xa BRn GOTO  ; ❌ Narr!
   
   ADD R0, R0, x0                          ; ✅ Good!
   AND R0, R0, xa                          ; ✅ Good!
   BRn GOTO                                ; ✅ Good!
   ```
   
   Reason: separate instructions to lines make the program structure clearer.

2. Capitalize instruction names and register names.
   
   ```
   and r0, r0    ; ❌ Narr!
   AND R0, R0    ; ✅ Good!
   ```
   
   Reason: capitalized characters are of the same height, making the code less messy.

3. Align parameters of instructions:
   
   ```
   LD R0, LABEL      ; ❌ Narr!
   LDR R0, R6, x1    ; ❌ Narr!
   
   LD  R0, LABEL     ; ✅ Good!
   LDR R0, R6, x1    ; ✅ Good!
   ```
   
   Reason: aligned tokens looks tidy and is easier for editing.

4. Leave spaces after commas `,`:
   
   ```
   AND R1,R2,R3      ; ❌ Narr!
   AND R1, R2, R3    ; ✅ Good!
   ```
   
   Reason: spaces make the tokens less compact and more eligible.

5. Prefix numbers with `#` (decimal) and lowercased `x` (hexadecimal):
   
   ```
   ADD R0, R0, 1    ; ❌ Narr!
   ADD R0, R0, X1   ; ❌ Narr!
   
   ADD R0, R0, #1   ; ✅ Good!
   ADD R0, R0, x1   ; ✅ Good!
   ```
   
   Reason: smaller prefixes stress the number literals, making them clearer among the tokens.

6. Use meaningful comments and labels:
   
   ```
   ; We're no strangers to LC-3       ; ❌ Narr!
   LEA R0, NeverGonnaGiveYouUp        ; ❌ Narr!
   
   ; This loads the entry address     ; ✅ Good!
   LEA R0, ProgramAddr                ; ✅ Good!
   ```
   
   Reason: comments and labels with resonable name makes you understand what they do.

7. Place labels on the left or the top of your instructions, but make sure to align them:
   
   ```
   LABEL AND R0, R0, x0    ; ❌ Narr!
   ADD R0, R0, xf          ; ❌ Narr!
   
   LABEL AND R0, R0, x0    ; ✅ Good!
         ADD R0, R0, xf    ; ✅ Good!
   
   LABEL                   
   AND R0, R0, x0          ; ✅ Good!
   ADD R0, R0, xf          ; ✅ Good!
   ```
   
   Reason: aligned or roof labels make it easier to identify them, without losing tidiness.

8. Add blank lines when appropriate:
   
   ```
   LABEL               ; ❌ Narr!
   ADD R1, R0, R0      ; ❌ Narr!
   LABEL2              ; ❌ Narr!
   ADD R0, R1, R0      ; ❌ Narr!
   
   LABEL               ; ✅ Good!
   ADD R1, R0, R0      ; ✅ Good!
                       ; ✅ Good!
   LABEL2              ; ✅ Good!
   ADD R0, R1, R0      ; ✅ Good!
   ```
   
   Reason: proper blanks marks different part of the program.

Keep in mind that the above items are **references**, not even suggestions. **The best code style is the one that fits you**, and we hope you can develop your own code style on top of this. It benefits a lot!

## Report

Complete your report as you've done in Lab 1. We have no questions today.

## Submission

The submission is the same as Lab 1, except that we want you to submit using **assembly** this time. (Select "LC-3 Assembly" as the language in LC3XT, or submit your assembly file if using LC3Tools)
