---
title: "System Setup and Your First Project"
description: "Get your Erlang development environment set up and create the project structure for our WebSocket chat server"
postNumber: 0
publishDate: 2024-01-01T00:00:00Z
tags: ["setup", "installation", "getting-started"]
difficulty: "beginner"
estimatedReadingTime: 10
---

# Learn Erlang Step-By-Step

## Lesson 0: System Setup and Your First Project

Welcome to **Learn Erlang Step-By-Step**! This tutorial series will take you from complete beginner to building a real-time WebSocket chat server using pure Erlang. No frameworks, no shortcuts - just the fundamentals that will make you understand how systems like Phoenix LiveView actually work under the hood.

### Why Learn Erlang Step-By-Step?

Most web developers jump straight into frameworks like Phoenix without understanding the incredible concurrent programming model that makes Erlang special. By building everything from scratch, you'll learn:

- **The Actor Model** - How lightweight processes communicate
- **Fault Tolerance** - The famous "let it crash" philosophy
- **Hot Code Reloading** - Updating systems without downtime
- **OTP Behaviors** - Battle-tested patterns for building robust systems
- **Raw Networking** - TCP sockets and protocol implementation

### What We'll Build

By the end of this series, you'll have created a complete WebSocket chat server that can handle thousands of concurrent users. Here's what makes it special:

- **Pure Erlang** - No external dependencies
- **Fault Tolerant** - Crashed processes automatically restart
- **Concurrent** - Each user gets their own lightweight process
- **Real-time** - WebSocket communication with live updates
- **Scalable** - Built using proven OTP patterns

### Prerequisites

- Basic programming experience (any language)
- Comfort with the command line
- Willingness to type code and make mistakes

You don't need to know functional programming or Erlang syntax - we'll learn by doing.

---

## Installing Erlang

Let's get your development environment set up. We'll install Erlang and the essential tools you need.

### macOS Installation

```bash
# Using Homebrew (recommended)
brew install erlang

# Verify installation
erl -version
```

### Ubuntu/Debian Installation

```bash
# Update package list
sudo apt-get update

# Install Erlang
sudo apt-get install erlang

# Verify installation
erl -version
```

### Windows Installation

1. Download the Windows installer from [erlang.org/downloads](https://erlang.org/downloads)
2. Run the installer with default settings
3. Open Command Prompt and verify:
   ```cmd
   erl -version
   ```

Alternatively, use Chocolatey:

```cmd
choco install erlang
```

### Installing Rebar3 (Build Tool)

Rebar3 is Erlang's standard build tool - like npm for Node.js or cargo for Rust.

**Unix/macOS:**

```bash
# Download rebar3
curl -L https://github.com/erlang/rebar3/releases/latest/download/rebar3 -o rebar3

# Make it executable
chmod +x rebar3

# Move to system path
sudo mv rebar3 /usr/local/bin/
```

**macOS with Homebrew:**

```bash
brew install rebar3
```

**Windows:**

```cmd
# With Chocolatey
choco install rebar3
```

**Verify Installation:**

```bash
rebar3 version
```

---

## Creating Your First Erlang Project

Now let's create the project structure for our chat server.

### 1. Initialize the Project

```bash
# Create project directory
mkdir erlang_chat
cd erlang_chat

# Create standard Erlang/OTP structure
mkdir src priv
```

### 2. Create Build Configuration

Create `rebar.config` in the project root:

```erlang
{erl_opts, [debug_info]}.

{deps, []}.

{shell, [
    {apps, [chat_server]}
]}.
```

**What this does:**

- `debug_info` - Includes debugging information in compiled files
- `deps` - External dependencies (empty for now)
- `shell` - Automatically loads our app when starting rebar3 shell

### 3. Create Application Specification

Create `src/chat_server.app.src`:

```erlang
{application, chat_server,
 [{description, "WebSocket Chat Server"},
  {vsn, "0.1.0"},
  {registered, []},
  {applications, [kernel, stdlib]},
  {mod, {chat_server_app, []}},
  {env, []}
 ]}.
```

**What this means:**

- `application` - Declares this as an OTP application
- `description` - Human-readable description
- `vsn` - Version string
- `applications` - Dependencies (kernel and stdlib are always required)
- `mod` - Entry point module when application starts
- `env` - Configuration variables

### 4. Create the Application Module

Create `src/chat_server_app.erl` with minimal code:

```erlang
-module(chat_server_app).
-behaviour(application).

-export([start/2, stop/1]).

start(_StartType, _StartArgs) ->
    {ok, spawn(fun() -> loop() end)}.

stop(_State) ->
    ok.

% Simple loop to keep the process alive
loop() ->
    receive
        stop -> ok
    end.
```

**What this does:**

- Implements the `application` behaviour
- `start/2` is called when the application starts
- Returns `{ok, Pid}` where Pid is a process that stays alive
- `stop/1` is called when the application stops

### 5. Project Structure Overview

Your project should now look like this:

```
erlang_chat/
├── rebar.config          # Build configuration
├── src/                  # Erlang source files (.erl)
│   ├── chat_server.app.src  # Application specification
│   └── chat_server_app.erl  # Application module
├── priv/                 # Static files (HTML, CSS, JS)
└── _build/               # Compiled files (created by rebar3)
```

---

## Testing Your Setup

Let's verify everything works by compiling the project:

```bash
# Compile the project
rebar3 compile
```

You should see output like:

```
===> Verifying dependencies...
===> Analyzing applications...
===> Compiling chat_server
```

### Start the Erlang Shell

```bash
# Start rebar3 shell with your project loaded
rebar3 shell
```

You'll see the Erlang shell prompt:

```
Erlang/OTP 26 [erts-14.0] [source] [64-bit] [smp:8:8] [ds:8:8:10] [async-threads:1]

Eshell V14.0  (abort with ^G)
1>
```

Your application will automatically start when you run `rebar3 shell`.

### Basic Shell Commands

Try these commands to get familiar:

```erlang
% Check what's loaded (you should see chat_server in the list)
1> application:which_applications().
[{chat_server,"WebSocket Chat Server","0.1.0"},
 {stdlib,"ERTS  CXC 138 10","5.0"},
 {kernel,"ERTS  CXC 138 10","9.0"}]

% Simple arithmetic
2> 2 + 3.
5

% Create a list
3> MyList = [1, 2, 3].
[1,2,3]

% Exit the shell
4> q().
```

---

## Understanding What You've Built

Even though you haven't written any Erlang code yet, you've created a proper OTP application structure. Here's what each piece does:

### **OTP Application**

Think of this as a "service" that can be started, stopped, and supervised. It's the deployment unit in Erlang.

### **Rebar3**

Your build tool that handles:

- Compiling Erlang code
- Managing dependencies
- Running tests
- Creating releases

### **Project Structure**

Follows Erlang conventions:

- `src/` - Source code
- `priv/` - Static assets
- `rebar.config` - Build settings

---

## What's Next?

In **Lesson 1**, we'll write your first Erlang module and understand:

- Basic syntax and data types
- Pattern matching (Erlang's superpower)
- Function definitions
- The module system

You'll write actual code and see how Erlang's unique features work.

### Quick Preview

Here's a tiny taste of what Erlang looks like:

```erlang
-module(hello).
-export([greet/1]).

greet(Name) when is_list(Name) ->
    "Hello, " ++ Name ++ "!";
greet(Name) when is_atom(Name) ->
    "Hello, " ++ atom_to_list(Name) ++ "!".
```

Notice the **pattern matching** and **guards** - this is what makes Erlang special for building robust systems.

---

## Troubleshooting

### Common Issues

**"erl: command not found"**

- Erlang isn't installed or not in your PATH
- Try reinstalling or check your system's PATH variable

**"rebar3: command not found"**

- Rebar3 isn't installed or not in PATH
- Make sure you moved it to `/usr/local/bin/` or equivalent

**Permission denied errors**

- Use `sudo` when moving files to system directories
- Or install to a user directory that's in your PATH

**Compilation errors**

- Make sure file extensions are correct (`.erl` for Erlang source)
- Check that `rebar.config` has proper Erlang syntax

### Getting Help

- **Erlang Documentation**: [erlang.org/doc](https://erlang.org/doc)
- **Rebar3 Guide**: [rebar3.org](https://rebar3.org)
- **Community**: [erlangforums.com](https://erlangforums.com)

---

Ready to write some Erlang? Let's move on to **Lesson 1: Your First Erlang Module**!

---

_This is part of the "Learn Erlang Step-By-Step" tutorial series. Each lesson builds on the previous ones, so make sure you complete the exercises before moving forward._
