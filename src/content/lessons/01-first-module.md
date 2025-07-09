---
title: "Your First Erlang Module"
description: "Learn Erlang's basic syntax, modules, functions, and pattern matching by building utility functions for our chat server"
postNumber: 1
publishDate: 2024-01-02T00:00:00Z
tags: ["basics", "syntax", "modules", "pattern-matching"]
difficulty: "beginner"
estimatedReadingTime: 15
prerequisites: [0]
---

# Your First Erlang Module

Welcome back! Now that you have Erlang installed and your project set up, it's time to write your first Erlang code. In this post, we'll cover the fundamentals that make Erlang unique and start building components for our chat server.

## What Makes Erlang Special?

Before diving into syntax, understand these core principles:

1. **Everything is immutable** - Once created, values never change
2. **Pattern matching everywhere** - The heart of Erlang's expressiveness
3. **No side effects** - Functions return values, don't modify state
4. **Processes communicate by message passing** - No shared memory

These principles make Erlang perfect for building fault-tolerant, concurrent systems.

---

## Module Basics

In Erlang, all code lives in modules. Let's create our first module with utilities for our chat server:

**Create `src/chat_utils.erl`:**

```erlang
-module(chat_utils).
-export([format_message/2, current_timestamp/0]).

format_message(User, Message) ->
    Timestamp = current_timestamp(),
    io_lib:format("[~s] ~s: ~s", [Timestamp, User, Message]).

current_timestamp() ->
    {{Year, Month, Day}, {Hour, Min, Sec}} = calendar:local_time(),
    io_lib:format("~4..0w-~2..0w-~2..0w ~2..0w:~2..0w:~2..0w",
                  [Year, Month, Day, Hour, Min, Sec]).
```

### Breaking It Down

- **`-module(chat_utils).`** - Declares the module name (must match filename)
- **`-export([format_message/2, current_timestamp/0]).`** - Makes functions public
- **`format_message/2`** - Function with 2 arguments (arity matters!)
- **`current_timestamp/0`** - Function with no arguments

### Compile and Test

```bash
# In your project directory
rebar3 shell

# In the Erlang shell
1> c(chat_utils).
{ok,chat_utils}

2> chat_utils:format_message("Alice", "Hello everyone!").
"[2024-01-02 10:30:45] Alice: Hello everyone!"

3> chat_utils:current_timestamp().
"2024-01-02 10:30:45"
```

---

## Erlang's Core Data Types

Let's explore the data types we'll use throughout our chat server:

```erlang
-module(data_demo).
-export([demonstrate/0]).

demonstrate() ->
    % Numbers
    Integer = 42,
    Float = 3.14,
    
    % Atoms (constants that represent themselves)
    Status = ok,
    Action = join_room,
    
    % Strings (actually lists of characters)
    Username = "Alice",
    Message = "Hello World!",
    
    % Lists (can contain any types)
    Numbers = [1, 2, 3, 4, 5],
    Mixed = [1, hello, "world", 3.14],
    
    % Tuples (fixed-size containers)
    Result = {ok, "Success"},
    User = {user, "Alice", online},
    
    % Binary strings (efficient for large text)
    BinaryMsg = <<"Hello in binary">>,
    
    % Print everything
    io:format("Integer: ~p~n", [Integer]),
    io:format("Status: ~p~n", [Status]),
    io:format("Username: ~p~n", [Username]),
    io:format("Numbers: ~p~n", [Numbers]),
    io:format("User tuple: ~p~n", [User]),
    io:format("Binary: ~p~n", [BinaryMsg]).
```

**Key points:**
- **Atoms** are constants like `ok`, `error`, `join_room`
- **Strings** are lists of characters: `"Hello"` = `[72, 101, 108, 108, 111]`
- **Tuples** group related data: `{ok, Value}` or `{error, Reason}`
- **Binaries** are efficient for large text data

---

## Pattern Matching - Erlang's Superpower

Pattern matching is what makes Erlang code so elegant. Let's build a command parser for our chat server:

```erlang
-module(command_parser).
-export([parse_command/1, handle_result/1]).

% Parse different chat commands
parse_command(<<"/join ", Room/binary>>) when byte_size(Room) > 0 ->
    {join_room, Room};
parse_command(<<"/leave">>) ->
    leave_room;
parse_command(<<"/users">>) ->
    list_users;
parse_command(<<"/help">>) ->
    show_help;
parse_command(Message) when byte_size(Message) > 0 ->
    {chat_message, Message};
parse_command(_) ->
    invalid_command.

% Handle different result types
handle_result({ok, Value}) ->
    io:format("Success: ~p~n", [Value]);
handle_result({error, Reason}) ->
    io:format("Error: ~p~n", [Reason]);
handle_result({join_room, Room}) ->
    io:format("User wants to join room: ~s~n", [Room]);
handle_result(leave_room) ->
    io:format("User wants to leave current room~n");
handle_result(_) ->
    io:format("Unknown result~n").
```

**What's happening here:**
- **Binary pattern matching** extracts parts of binary strings
- **Guards** (`when`) add extra conditions
- **Different clauses** handle different input patterns
- **Underscore** (`_`) matches anything we don't care about

### Test the Parser

```bash
1> c(command_parser).
{ok,command_parser}

2> command_parser:parse_command(<<"/join general">>).
{join_room,<<"general">>}

3> command_parser:parse_command(<<"Hello everyone!">>).
{chat_message,<<"Hello everyone!">>}

4> command_parser:handle_result({ok, "Message sent"}).
Success: "Message sent"
ok
```

---

## Function Heads and Guards

Functions can have multiple clauses with different patterns and guards:

```erlang
-module(user_validator).
-export([validate_username/1, check_message_length/1]).

% Validate username with different patterns
validate_username(Name) when is_binary(Name), byte_size(Name) > 0, 
                             byte_size(Name) =< 20 ->
    case re:run(Name, "^[a-zA-Z0-9_]+$") of
        {match, _} -> {ok, Name};
        nomatch -> {error, invalid_characters}
    end;
validate_username(Name) when is_binary(Name), byte_size(Name) > 20 ->
    {error, too_long};
validate_username(Name) when is_binary(Name), byte_size(Name) =:= 0 ->
    {error, empty_username};
validate_username(_) ->
    {error, invalid_type}.

% Check message length
check_message_length(Msg) when is_binary(Msg), byte_size(Msg) > 0,
                               byte_size(Msg) =< 500 ->
    {ok, Msg};
check_message_length(Msg) when is_binary(Msg), byte_size(Msg) > 500 ->
    {error, message_too_long};
check_message_length(Msg) when is_binary(Msg), byte_size(Msg) =:= 0 ->
    {error, empty_message};
check_message_length(_) ->
    {error, invalid_type}.
```

**Guard functions you'll use:**
- `is_binary/1`, `is_atom/1`, `is_integer/1`, `is_list/1`
- `byte_size/1`, `length/1`
- `=/=` (not equal), `=:=` (exactly equal)

---

## Building Chat Server Utilities

Let's create a practical module for our chat server:

```erlang
-module(chat_server_utils).
-export([generate_user_id/0, validate_room_name/1, format_user_list/1]).

% Generate unique user ID
generate_user_id() ->
    {MegaSecs, Secs, MicroSecs} = erlang:timestamp(),
    UniqueInt = MegaSecs * 1000000000000 + Secs * 1000000 + MicroSecs,
    integer_to_binary(UniqueInt).

% Validate room name
validate_room_name(Name) when is_binary(Name), 
                              byte_size(Name) > 0, 
                              byte_size(Name) =< 50 ->
    case re:run(Name, "^[a-zA-Z0-9_-]+$") of
        {match, _} -> {ok, Name};
        nomatch -> {error, invalid_room_name}
    end;
validate_room_name(Name) when is_binary(Name), byte_size(Name) > 50 ->
    {error, room_name_too_long};
validate_room_name(Name) when is_binary(Name), byte_size(Name) =:= 0 ->
    {error, empty_room_name};
validate_room_name(_) ->
    {error, invalid_type}.

% Format list of users for display
format_user_list([]) ->
    <<"No users online">>;
format_user_list(Users) when is_list(Users) ->
    UserStrings = [format_user(User) || User <- Users],
    iolist_to_binary(["Users online: ", string:join(UserStrings, ", ")]).

% Helper function (not exported)
format_user({user, Name, Status}) ->
    binary_to_list(Name) ++ " (" ++ atom_to_list(Status) ++ ")";
format_user(Name) when is_binary(Name) ->
    binary_to_list(Name).
```

---

## Exercises - Type and Test!

**Exercise 1: Basic Functions**

Create a module called `message_utils.erl` with these functions:

```erlang
-module(message_utils).
-export([count_words/1, truncate_message/2, is_command/1]).

% Count words in a message
count_words(Message) when is_binary(Message) ->
    Words = binary:split(Message, <<" ">>, [global]),
    CleanWords = [W || W <- Words, byte_size(W) > 0],
    length(CleanWords);
count_words(_) ->
    0.

% Truncate message to max length
truncate_message(Message, MaxLen) when is_binary(Message), 
                                       is_integer(MaxLen), 
                                       MaxLen > 0 ->
    if 
        byte_size(Message) =< MaxLen -> Message;
        true -> 
            <<Truncated:MaxLen/binary, _/binary>> = Message,
            <<Truncated/binary, "...">>
    end;
truncate_message(Message, _) when is_binary(Message) ->
    Message;
truncate_message(_, _) ->
    <<"">>.

% Check if message is a command
is_command(<<"/", _/binary>>) ->
    true;
is_command(_) ->
    false.
```

**Exercise 2: Pattern Matching Practice**

Extend the command parser to handle more commands:

```erlang
% Add these to command_parser.erl
parse_command(<<"/nick ", NewName/binary>>) when byte_size(NewName) > 0 ->
    {change_nickname, NewName};
parse_command(<<"/msg ", Rest/binary>>) ->
    case binary:split(Rest, <<" ">>, []) of
        [User, Message] when byte_size(User) > 0, byte_size(Message) > 0 ->
            {private_message, User, Message};
        _ ->
            invalid_command
    end;
parse_command(<<"/rooms">>) ->
    list_rooms.
```

**Exercise 3: Challenge**

Create a `chat_history.erl` module that stores and retrieves chat messages:

```erlang
-module(chat_history).
-export([add_message/3, get_recent_messages/2, get_user_messages/2]).

% Add message to history (returns new history)
add_message(User, Message, History) when is_list(History) ->
    Timestamp = calendar:local_time(),
    NewMessage = {message, User, Message, Timestamp},
    [NewMessage | History].

% Get N most recent messages
get_recent_messages(History, N) when is_list(History), is_integer(N), N > 0 ->
    lists:sublist(History, N).

% Get all messages from a specific user
get_user_messages(History, User) when is_list(History) ->
    [Msg || Msg = {message, MsgUser, _, _} <- History, MsgUser =:= User].
```

---

## Key Takeaways

1. **Modules** organize code - one module per file, name must match
2. **Export** makes functions public - `function_name/arity`
3. **Pattern matching** is used everywhere - function heads, case expressions
4. **Guards** add extra conditions with `when`
5. **Tuples** like `{ok, Value}` and `{error, Reason}` are standard return patterns
6. **Binary strings** (`<<"text">>`) are efficient for text processing
7. **Atoms** are constants that represent themselves

---

## What's Next?

In **Lesson 2**, we'll dive deeper into pattern matching and explore:

- Advanced list and tuple patterns
- Case expressions and if statements
- Variable binding rules
- Building a message parsing system for our chat server

The foundation you've built here will make everything else much easier to understand!

---

## Test Your Understanding

Before moving on, make sure you can:

1. Create a module with exported functions
2. Use pattern matching in function heads
3. Write guards with `when`
4. Handle different data types (atoms, binaries, tuples, lists)
5. Return `{ok, Value}` or `{error, Reason}` patterns

If any of these feel unclear, review the examples and try the exercises again. Pattern matching is crucial for everything we'll build next!

---

_This is part of the "Learn Erlang Step-By-Step" tutorial series. Each post builds on the previous ones, so make sure you complete the exercises before moving forward._