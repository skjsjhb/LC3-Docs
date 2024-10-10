# Lab 3: Reversed Equality (Miao's Edition)

## Brief

> Great minds think alike.

Use assembly to build programs feels way better than machine code (hopefully!). Okay, okay, I know, deal with the numbers can be easy, but not that exciting. What about strings? Strings are awesome since it speaks louder than numbers, but can also be harder to handle. If you're already getting bored, pick up your keyboard, grab your mouse, and get ready to face —— the world of strings!

## Intro

Inspect these interesting expressions:

> - Borrow or rob?
> 
> - Was it a car or a cat I saw?
> 
> - Sir, I demand, I am a maid named Iris.

Regardless of the meaning of each, by analyzing **lexically**, we find that these expressions all **read the same starting from either side** (consider only letters, capitalized or not). Such patterns are regarded as **palindromic**.

"What's the point of knowing this?", you may ask. Well, if you doubt so, your English teacher has just brought you 10000 sentences as homework, and your task is to **determine whether they are palindromic**. Of course, you'll want to save some time for your precious weekend, so you've decided to complete the task, using the machine you've just used to escape from your maths proof.

## Tasks

Create a program to check whether a given string is palindromic.

- The length of the string (without the `0` terminator) will be placed at `x3100`.

- The string starts at `x3101`.
  
  - The first letter is at `x3101`, the second at `x3102`, etc..

- Your output should be placed at `x3200`:
  
  - If the string is palindromic, the output is number `1`, otherwise `0`.

- The string contains only letters (`A` to `Z` and `a` to `z`). The judgement of palindrome is **case insensitive** (i.e. `A` and `a` are considered the same).

- The string contains at most 99 letters.

- The string may be empty and should be considered as palindromic if so.

## Examples

Input:

- Length (`x3100`): 3

- String (starting from `x3101`):
  
  ```
  abc
  ```

Output (at `x3200`):

```
0
```

---

Input:

- Length (`x3100`): 27

- String (starting from `x3101`):
  
  ```
  siridemandiamamaidnamediris
  ```

Output (at `x3200`):

```
1
```

## Requirements

- `R0` to `R7` has been cleared for you (in this lab only).

- The string **doesn't always end with a zero**.

- All letters of the string needs be counted.

- Patterns of odd or even letters are both acceptable, e.g. both `aba` and `abba` are considered palindromic.

- The output value is limited to `0` and `1`.

## How To

### Iterate Over a String

Recall what you have done in C, to iterate (i.e. one-by-one) over a string, we basically do the following steps:

0. Set a pointer to the first character of the string:
   
   ```
    str
     |
   | a | b | c | d | e |
   ```

1. Dereference the pointer, get the character at the current position:
   
   ```
    str
     |
   | a | b | c | d | e |
   
   ...Get 'a'
   ```

2. Move the pointer forward:
   
   ```
        str
         |
   | a | b | c | d | e |
   ```

3. If the string hasn't reach its end, repeat from step 1.

Code in C:

```c
const char* str = "abc" // Your string
int length = 3 // Length of your string

for (int i = 0; i < length; i++) {
    char c = *str;
    // Do something with c
    str++;
}
```

?> You can also use a form like `str[i]` to access the character, but that's harder to implement in LC-3.

Things in LC-3 is also similar, except that we'll use a register as the "pointer", and `LDR` instruction to load data from the memory.

BTW, keep in mind that `LDR` takes 3 operands (destination register, base register, offset).

### Test Locally

It's true that you can fill the string (and its length) by manually editing the memory content in LC3Tools, from `x3100` to the end of the string. However, this can be quite cumbersome. We have a easier way to create input data for testing, by creating two sections for the program:

```
.ORIG x3000
; Main code...
.END

.ORIG x3100
.FILL x5
.STRINGZ "abcba"
.END
```

The two pairs of `.ORIG` and `.END` creates 2 program sections and tell LC-3 to load them to `x3000` and `x3100` respectively. In the above example, as `.FILL` simply "puts something here", it puts `x5` at `x3100` (the origin address defined by `.ORIG`). The following `.STRINGZ` places characters `a`, `b`, `c`, `b`, `a` one-by-one after it, from `x3101` to `x3105`.

At any time you want to change the test input, you can simply change the length (defined by `.FILL`) and the content (defined by `.STRINGZ`).

!> When testing on LC3XT, the test system will fill the input automatically. **Make sure to remove** the test code (the second section, `.ORIG x3100` to `.END`) before submitting it to LC3XT.

## Tips and Tricks

- If you've already invented your own code style in the last lab, make sure to follow it consistently. If not, it's recommended to adopt one.

- **Pay extra care** to the edge conditions (i.e. when to exit the loop).

- Do not forget to put your output into `x3200` (we won't mention this again).

## Boilerplate

For a quick start, you can use the following boilerplate to build your code. Simply **copy and paste** it into your editor and you're ready!

```
.ORIG x3000

LDI R0, LENGTH
LD  R1, STRING

; Insert your code

HALT

LENGTH .FILL x3100
STRING .FILL x3101
RESULT .FILL x3200

.END

; Test input data
; Make sure to delete it when submitting to LC3XT

.ORIG x3100

.FILL #5            ; Length
.STRINGZ "abcba"    ; Content

.END
```

Although it's really convenient to use the boilerplate, if you're feeling like a pro, feel free to choose your own code layout.

## Report

The report is the same as what you have done in Lab 1.

## Submit

Do the same as what you've done in Lab 2.
