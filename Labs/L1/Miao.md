# Lab 1: Unfold the Secret (Miao's Edition)

## Brief

> The magic of LC-3 grows.

Welcome to the **LABS** of ICS! As this is the first lab of the entire series, you might be wondering, "How do I complete theses labs?", or even, "What do these labs do?". Don't worry, there are no dumb questions —— the documents will tell you everything you need.

To not scare you out, I'll put it in the beginning: **This lab, lab 1, is really an easy cake.** And you know, Lab 1 is probably the easiest one of the entire series. At everywhere else, there will be assembly, bugs, and failures. You really won't want to get trapped by any, so get geared up, and take a look at this very first lab.

## Intro

Even the most complex project in the world was born from a simple idea. Suppose you're exchanging some message with your pal, while fearing that others might be able to access your super secret code, you've decided to encrypt it. The encryption works very well, but you also need to design a **decryption program** for your friend. There is no time to get your laptop or PC. The only tool that you have access to is the LC-3 machine. Therefore, you've arrived at the LC-3 laboratory, where we are now.

## Tasks

Create a program to **decrypt** the secret number:

- The secret number will be placed in the register `R0`.

- To decode the number, you need a **secret key**. Create your secret key as follows:
  
  1. Use your student ID, remove the letters. (`PB12345678` becomes `12345678`)
  
  2. Convert even digits to `0` and odd ones to `1`. (`12345678` becomes `10101010`)
  
  3. This is the **binary** form of your secret key. Convert it to decimal or hexadecimal. (`10101010` becomes `#170` or `xaa`)
  
  4. Remember it or write it down as we'll use it later.

- Performing a **bitwise XOR** operation on the number and your secret:
  
  ```
  Output = Secret ^ R0
  ```

- Put your output into register `R3`.

## Examples

Suppose your student ID is `PB12345678`, and the input is (in `R0`):

```
x00c2
```

The decrypted number will be (in `R3`):

```
x0068
```

Because:

```
x0068 = x00c2 ^ xaa
```

## Requirements

- The program should be created using **machine code** and coded in **text form**. (Not assembly!)
  
  - Instead of typing `AND R0, R0, x0`, use `0101000000100000`.
  
  - Make sure to add line breaks for each instruction.
  
  - It's sufficient to complete the program using Notepad, TextEdit or Vim, but you can pick any editor you like.
  
  - The final code of your program should look like below (content may differ):
    
    ```
    1010110000010000
    0011111101011100
    0111101011111101
    (And more...)
    ```

- The code is loaded at `x3000`.
  
  - That means the first instruction of your program will be placed at `x3000`, the second at `x3001`, and so on.
  
  - This is done automatically when loading the program. No manual operations needed.
  
  - This should not affect your code now, but it's important to know this for future labs.

- After you've completed your program, make sure to **add two extra lines**:
  
  - `0011000000000000` at the **beginning**.
    
    - This is a convention. It tells everyone that this program begins at `x3000`.
  
  - `1111000000100101` at the **end**.
    
    - This means `HALT` which stops the machine. Similar to `return 0;` in C.
  
  Or your code won't run correctly.

- Please follow academic ethics and morals. **Do not pirate code that does not belong to you.**

## How To

### Implement XOR Operation

LC-3 does not come with the `XOR` instruction, but you can emulate it easily:

```verilog
A^B = (A & ~B) | (~A & B)
```

I know you'll say "LC-3 doesn't have `OR` either!". That's right, and here's how we solve this:

```verilog
A|B = ~(~A & ~B)
```

Combine both and you'll get `XOR`.

### Set the Secret

Suppose your secret is `10101010` (`xaa` in hexadecimal), you may find it really tempting to write:

```
AND R2, R2, x0
ADD R2, R2, xaa
```

Well, this will not work, as `xaa` is too large to fit into `imm5` (used by `ADD`).

There are several ways to deal with it, but most of them require memory accessing. I know you'll yell out "Oh, no memory please!". And, yes, there **do exists** a solution using only the `ADD` instruction.

**First put 4 bits into the register, shift them left by 4 bits, then add the register by the last 4 bits.**

```
AND R2, R2, x0
ADD R2, R2, xa
ADD R2, R2, R2
ADD R2, R2, R2
ADD R2, R2, R2
ADD R2, R2, R2
ADD R2, R2, xa
```

`ADD` something by it self doubles it. After adding `R2` by itself for 4 times, we have `10100000` in `R2`. Then we add `xa` into `R2` to make it become `10101010`. Done!

In future labs you'll learn how to use `LD` to load values into registers.

### Test and Run

There are numbers of tools which runs LC-3 assembly, but few of them **runs LC-3 machine code**. However, I believe 99% of you have created your program in assembly before translating them to binaries. By testing the assembly code, we can verify that our algorithm works. The only thing left after which is to translate the instructions correctly.

For LC-3 assembly, **LC3Tools** is wonderful for testing locally. It assembles and runs your code, while also offering debug options. LC3Tools is super powerful and, if you're still new to it, make sure to consult your TAs to know how to use it! Here's also a link to get the latest release: https://github.com/chiragsakhuja/lc3tools/releases/latest

Want something even more awesome? We also have an alternative: **the online judging system**! We've put much effort in the development and have made it paying off! The system, called **LC3XT**, runs your code on our server and brings your result instantly! What's more, your submit records **will be documented and can be used as a proof that your code works**! We've already introduced the system before, but in case you've missed it, here's how to test Lab 1 on our OJ system:

1. Open the link in your browser: https://lc3xt.skjsjhb.moe/oj

2. Select "Lab 1" in the right column ("Judge Options").

3. Fill in your student ID below (will be used to generate test cases).

4. Select "Machine Code" (or assembly if you like) on the left column ("Code Editing").

5. Type your code in the code editor.

6. Click "Submit My Code".

7. That's all! If everything works, you'll see the judge results.

Congratulations if your code is **accepted**, but don't get downed even if it's **not accepted**. Make sure to check the **test cases** below and figure out where's the problem. You can press the "Go Back" button on your browser, edit your code, and submit again. Try as many times as you want —— the system is designed for **trials and errors**.

## Tips and Tricks

- As mentioned above, try to **use assembly first** to make life easier. Just **make sure to translate it to machine code** correctly.

- `AND` something with `0` clears it.

- Although not enforced, it's possible to complete the program with no more than 20 lines. If you're finding your program being super long, **consider using a better approach**.

- It's also possible to complete the program using only `AND`, `ADD` and `NOT` instructions, but if you're finding other instructions being handy, feel free to use them.

## Lab Report

Completed your program? Congratulations I must say, but that's only half way to success. To get a full mark (hopefully!), you'll need to compose a report summarizing your work. You might doubt the necessity of doing this. That's understandable and here're some reasons:

- Reports summarize your work and describe better than just a piece of code.

- Reports reveal potential pitfalls in your knowledge base.

- Reports can help to prove that your code comes from you.

- Reports account for considerable proportion of your grade. If non of the above is able to convince you, this one should be something that makes you think about.

Create your report as follows:

- **Make sure to explain your code** in your report. This is essential to show your thoughts and to not get misjudged when your code happens to be similar to others.

- Other contents that are recommended to include:
  
  - Name and date
  
  - The core algorithm
  
  - Critical code to implement the algorithm
  
  - Debug process (if any)
  
  - Run results
  
  - Traps and pitfalls you've found (if any)
  
  - Suggestions (if any)
  
  - **Data speaks louder than words.** If you are using LC3XT, I'd highly suggest **embedding the links to your test summary** (e.g. <https://lc3xt.skjsjhb.moe/r/A123456789>), this will make your report much more persuasive.

- It's recommended to use Markdown to compose your report. **Markdown fits very well for our labs, while also being super easy to use!** If you haven't picked it up already, make sure to check out these helpful links:
  
  - Learn markdown: https://learnxinyminutes.com/docs/markdown or https://www.runoob.com/markdown/md-tutorial.html
  
  - MarkText, a markdown editor app: https://www.marktext.cc
  
  - StackEdit, an online markdown editor: https://stackedit.io/app

- You are **free to choose any (yet readable) file format you like**. Popular choices include **PDF, Word Document, Markdown, LaTeX, Image**.
  
  - Plain text is not recommended as it's hard to read.
  
  - **DO NOT** write your report directly on BlackBoard! (Which is even harder to read)
  
  - Try not to push paper reports on me in class. (Although it's still valid)

- **DO NOT** use GPT or other LLMs to generate any part of your report. And also, like the code, **DO NOT** copy the report of others.
  
  - You lose precious chances of learning and reviewing, together with your points.
  - If you don't want to compose reports by any means, then just don't. It's way better than becoming a copycat.

The above content should also be helpful for future labs.

## Submission

Maybe the most benefit of using LC3XT lands here. Test summaries reflect your code and debug process, saving you the time of declaring them manually.

### Using LC3XT

If you're using LC3XT and you've already passed the test (got a result whose status is **Accepted**), you only need to:

1. Grab your report, make sure to embed **the link to the accepted test summary**. It's also recommended to embed your failed tries, if any.

2. Submit the report to BlackBoard and you're done!
   
   - You only need to submit your report. **No code required.** (Surprise!)
   
   - You can give the file any name you like. (Yes!)

### Not Using LC3XT

Using LC3XT really saves you a lot of work, but if you're not a fan of it, you can still submit the code manually. This will not affect your score by any means (I swear!).

1. Grab your report **and code**, make sure to embed **debug process and run results** (since you don't have LC3XT to report them for you).

2. Name the files so that we can distinguish between the report and the code. (e.g. **DO NOT** name the code `report.txt` which is really confusing)

3. Submit both files to BlackBoard and you're done!
   
   - You do not need to create any archives.
   
   - As long as it's clear, you can give the file any name you like.
