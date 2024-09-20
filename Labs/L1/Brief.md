# Lab 1: Unfold the Secret (Brief Edition)

## Tasks

Create a program to **decrypt** a secret number:

- The number will be placed in the register `R0`.

- To decode the number, **create a secret key** by replacing odd digits in your student ID with `1` and even ones with `0`.

- Performing a **bitwise XOR** operation on the number and your secret.

- Put your output into register `R3`.

## Requirements

- Use machine code to complete the program.

- Code starts at `x3000`.

- Make sure to add `0011000000000000` at the beginning and `1111000000100101` at the end.

- Do not be a copycat.

## Submission

- LC3XT users: report with link to the judge result, **1 file only**.

- Not using LC3XT: report and the code, **2 files required**.
