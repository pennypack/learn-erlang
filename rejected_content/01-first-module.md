---
title: "Your First Erlang Module"
description: "Learn Erlang's basic syntax, data types, and create your first module with pattern matching"
postNumber: 1
publishDate: 2024-01-02T00:00:00Z
tags: ["basics", "syntax", "pattern-matching"]
difficulty: "beginner"
estimatedReadingTime: 15
prerequisites: [0]
---

Welcome back! Now that you have Erlang installed and your project set up, let's write some actual Erlang code. In this post, we'll cover the fundamentals that make Erlang unique.

## Erlang's Philosophy

Before diving into syntax, understand these core concepts:

1. **Everything is a process** - Not OS processes, but lightweight Erlang processes
2. **Processes share nothing** - Communication only through message passing
3. **Errors are isolated** - One process crashing doesn't affect others
4. **Pattern matching everywhere** - The heart of Erlang's expressiveness

## Your First Module

In Erlang, all code lives in modules. Let's create our first one:

```erlang
-module(greeting).
-export([hello/0, hello/1]).

hello() ->
    "Hello, World!".

hello(Name) ->
    "Hello, " ++ Name ++ "!".
```

Save this as `src/greeting.erl` in your project.

### Breaking It Down

- `-module(greeting).` - Declares the module name (must match filename)
- `-export([hello/0, hello/1]).` - Makes functions public (arity matters!)
- `hello() ->` - Function with no arguments
- `hello(Name) ->` - Function with one argument

### Compile and Run

```bash
# In your project directory
rebar3 shell

# In the Erlang shell
1> c(greeting).
{ok,greeting}

2> greeting:hello().
"Hello, World!"

3> greeting:hello("Alice").
"Hello, Alice!"
```

## Data Types

Erlang has several built-in data types. Let's explore them:

```erlang
-module(data_types).
-export([demonstrate/0]).

demonstrate() ->
    % Numbers
    Integer = 42,
    Float = 3.14,
    
    % Atoms (like symbols in Ruby or keywords in Elixir)
    Atom = hello,
    
    % Strings (list of characters)
    String = "Hello",
    
    % Lists
    List = [1, 2, 3],
    MixedList = [1, hello, "world", 3.14],
    
    % Tuples (fixed-size containers)
    Tuple = {ok, "Success"},
    Person = {person, "Alice", 30},
    
    % Print everything
    io:format("Integer: ~p~n", [Integer]),
    io:format("Atom: ~p~n", [Atom]),
    io:format("List: ~p~n", [List]),
    io:format("Tuple: ~p~n", [Person]).
```

## Pattern Matching

This is where Erlang shines. Pattern matching is used everywhere:

```erlang
-module(pattern_demo).
-export([describe_list/1, process_result/1]).

% Match on list structure
describe_list([]) ->
    "Empty list";
describe_list([_]) ->
    "Single element";
describe_list([_, _]) ->
    "Two elements";
describe_list([H|T]) ->
    io_lib:format("Head: ~p, Tail has ~p elements", [H, length(T)]).

% Match on tuples
process_result({ok, Value}) ->
    io:format("Success: ~p~n", [Value]);
process_result({error, Reason}) ->
    io:format("Failed: ~p~n", [Reason]);
process_result(_) ->
    io:format("Unknown result~n").
```

## Guards

Guards add extra conditions to pattern matching:

```erlang
-module(guards_demo).
-export([classify/1, safe_divide/2]).

classify(N) when is_integer(N), N > 0 ->
    positive_integer;
classify(N) when is_integer(N), N < 0 ->
    negative_integer;
classify(0) ->
    zero;
classify(N) when is_float(N) ->
    floating_point;
classify(_) ->
    not_a_number.

safe_divide(_, 0) ->
    {error, division_by_zero};
safe_divide(A, B) when is_number(A), is_number(B) ->
    {ok, A / B};
safe_divide(_, _) ->
    {error, invalid_arguments}.
```

## Practice Exercise

Create a module called `calculator` that:

1. Has functions for basic math operations
2. Uses pattern matching for different input types
3. Returns `{ok, Result}` or `{error, Reason}`

```erlang
-module(calculator).
-export([calculate/3]).

calculate(add, A, B) when is_number(A), is_number(B) ->
    {ok, A + B};
calculate(subtract, A, B) when is_number(A), is_number(B) ->
    {ok, A - B};
calculate(multiply, A, B) when is_number(A), is_number(B) ->
    {ok, A * B};
calculate(divide, _, 0) ->
    {error, division_by_zero};
calculate(divide, A, B) when is_number(A), is_number(B) ->
    {ok, A / B};
calculate(_, _, _) ->
    {error, invalid_operation}.
```

## Key Takeaways

1. **Modules** organize code - one module per file
2. **Pattern matching** is everywhere - function heads, case expressions, receive blocks
3. **Guards** add extra conditions to patterns
4. **Tuples** like `{ok, Value}` are used for return values
5. **Atoms** are constants that represent themselves

In the next post, we'll explore Erlang's famous concurrency model by creating our first processes!

## Challenges

1. Extend the calculator to handle lists of numbers
2. Create a `temperature` module that converts between Celsius, Fahrenheit, and Kelvin
3. Write a `list_utils` module with functions to find min, max, and average

Remember: Erlang is different from imperative languages. Embrace pattern matching and immutability!