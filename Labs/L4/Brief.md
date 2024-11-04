# Lab 4: Saving for a Rainy Day  (Brief Edition)

## Tasks

Tell Sakiko how much money can she earn after `N` months.

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

- Problem must be solved **top-down**.

- Input: `x3100`. Output: `x3200`.

## Requirements

- `R0` to `R7` cleared.

- `N` might be `0` but not negative.
