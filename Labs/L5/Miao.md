# Lab 5: Mystic Light Quest (Miao's Edition)

## Brief

> Never gonna know if you never even try.

With even closer to the last lab, things are getting more complex while also complete. Stepping out from the world of music (or savings, if you know nothing about the story) and calculations (known as **processing**), we're now diving into **interactions**. Programs without input are boring. Programs without output are meaningless. Get ready for the next challange, move from memory to the **terminal**, and make a quest for the possibility of the little computer.

## Intro

For secrets. For treasures. For history. The attraction of discovery pushes the construction of our knowledge base. As what has been said, "Mystic things are always beside us". Here, in the world of 0's and 1's, you act as the leader of the LC-3 adventure squad, with the mission of **finding a buried pattern**: `1010`. Unlike stories, this is not a magic spell which destroys the world, nor the secret key to the super weapon. It's just a tiny, yet priceless, souvenir. For the braves, and for the mystic light. Your squad has already geared up, time to issue your commands.

## Tasks

Reads a string from the terminal (aka. keyboard), count how many times does the key pattern `1010` occurs.

- Characters may be reused. i.e. `10101010` contains 3 keys (`1010/1010` and `10/1010/10`).

- The input ends with the lowercased letter `y`.

- There are **no line breaks** at the end of input. (i.e. `Enter` is **NOT** pressed after the input)

- The input consists of only `0` and `1`.

- The string might be empty.

- The output should be printed to the terminal.

- The number of keys **may be greater than 10**. Print in decimal if so.

## Examples

?> User input are maked with brackets `[]`.

When the source string is `1100101011010`, here's what happens:

```
Enter the source: [1100101011010y]
Key count: 2
```

When the source string is `11111111`, here's what happens:

```
Enter the source: [11111111y]
Key count: 0
```

## Requirements

- In this lab, LC3XT sends input string via **input buffer**, which can only be retrieved via `GETC` or  `IN`. **Interrupts are not supported** (You can still use them via LC3Tools).

- The prompt `Enter the source: ` can be arbitrary. It's not considered part of the output.

- Apart from the count, **DO NOT include any digit in the output**. This is crucial for LC3XT to extract the number. You may include helpful messages without any digit.

## How To

### Read the Input

Read a character from the keyboard can be hard at the hardware level. The program must query for the keyboard registers or setup a interrupt handler, then wait for the letter to come... Luckily, LC-3 has already provided a system call `IN` to do so.

Much like `getc` in C, the system call `IN` (i.e. `TRAP x23`) reads a character from the keyboard and puts its ASCII code in `R0`. If there are no characters in the input buffer, it blocks and waits for one. 

```
IN ; R0 = getc()
```

### Pattern Recognition

A powerful tool called **deterministic finite automaton (DFA)** is the all-in-one solution to most recognition problems. It works as the following:

1. Determin the **states** of the already matched characters. A states defines what the system has already seen and what to seek next. Specifically for this problem, we have 4 states:
   
   - Initial - No characters matched
   
   - `1` - Matched `1`, expecting `0`
   
   - `10` - Matched `10`, expecting `1`
   
   - `101` - Matched `101`, expecting `0`

2. Find out how do the states **transfer** between each other. A state transfers to another (or itself) when it sees an input character. In thie lab, whenever an expected character is seen, the state **moves forward** (e.g. `10` sees `1` and moves to `101`), while for an unexpected character, the state **resets** (e.g. `10` sees `0` and moves to initial state).

3. Do something when the input is **accepted**. According to discussed above, the input is accepted when the current state is `101` and it sees `1`. We can increment the counter when this happens.

In practice, states are usually represented using different numbers. The input processor changes it according to the input and the transfer map above.

### Format the Output

Breaking a number to digits, e.g. number `10` to string `"10"`, is not an easy cake. This is usually done via the so-called **modulo** operation:

1. Divide the number by `10`, gets the quotient `Q` and the reminder `R`.

2. Prepend `R` to the existing digits.

3. If `Q` is not less than `10`, repeat step 1 and 2 for it.

To make it clear, we use Python code to describe the process:

```python
n = 0 # Some input number
s = ""
while (n >= 10) {
    r = n % 10
    s = str(r) + s
    n = n // 10
}
```

"Okay, but how should I divide a number by 10?" You may ask so. Dividing by 10 can be hard as it's not the same as 2. A fine approach is to **subtract** 10 from the number each time and **count how many times** does it take before it becomes less than 10. This is left to your as an exercise.

### Print to Terminal

Similar to `IN`, we can use `OUT` to print a character to the terminal. However, unlike the input, we have an easier approach to print a string: `PUTS`. The `PUTS` system call prints the string starting from address stored in `R0`, repeatedly moves forward until it sees a `0`.

Whether to use `OUT` or `PUTS` are upon to your implementation. Just don't forget to add a `0` as the terminator of the string when using `PUTS`.

## Tips and Tricks

- Mind the difference between number `1` and character `'1'` (whose ASCII code is `49`).

- The code of `y` is `121` and that of `0` is `48`.

- When running in LC3Tools, please note that a character is read immediately when it's pressed, without the need of pressing `Enter`.

## Report

The report is the same as... whatever, you know what the report should be like. Just keep in mind that if you're using LC3Tools, don't forget to capture the output at the terminal, rather than the memory.

## Submit

You already know what the submission should be like.

## The "True" Mystic Light Quest

(This embedded frame contains autoplay code. Click to play.)

<style>

    #player {
        width: 100%;
        aspect-ratio: 16 / 9;
    }

</style>

<iframe id="player" src="https://monster-siren.hypergryph.com/music/880310" referrerpolicy="no-referrer"/>
