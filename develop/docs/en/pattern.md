# Explaining Path Matching

## 1. Named Parameters

```zsh
# Define a "pattern consisting of two layers of paths"
# The first layer, foo, is a fixed value, and the second layer, :bar, is a variable

👉 /foo/:bar

# The above pattern requires two layers and must start with /foo/... to match, as illustrated in the examples:

✅ /foo/123
✅ /foo/abc 
❌ /foo
❌ /foo/123/abc
```

```zsh
# Define a "pattern consisting of two layers of paths"
# The first layer, :foo, is a variable, and the second layer, bar, is a fixed value

👉 /:foo/bar

# The above pattern requires two layers and must end with .../bar to match, as illustrated in the examples:

✅ /abc/bar
✅ /123/bar
❌ /foo
❌ /foo/123
❌ /bar
```

In the above examples, route patterns always match completely. The variable part can be filled with any valid characters. Additionally, in the code, you can access the specific values of parameters through the navigator's params, as shown below:

```tsx
function YourComponent(){
  const nav = useNavigator();
  return <span>{nav.params.bar}</span>
} 
```

## 2. Parameter Constraints

```zsh
# Define a "pattern consisting of two layers of paths"
# The first layer, foo, is a fixed value, and the second layer, :bar, is a variable, with the constraint that :bar must be a number

👉 /foo/:bar(\d+)

# It can match only if two layers start with /foo/... and end with a number, as illustrated in the examples:

✅ /foo/123
❌ /foo/abc 
❌ /foo
❌ /abc/123
```

Parameter constraints are written in parentheses after the variable name, and the syntax is a "regular expression."

## 3. Parameter Modifiers

Question mark (?), optional parameter modifier (0 or 1 occurrence)

```zsh
👉 /foo/:bar?

✅ /foo/123
✅ /foo/abc 
✅ /foo
❌ /foo/bar/123
❌ /abc/123
```

Asterisk (*), 0 or n occurrences modifier

```zsh
👉 /foo/:bar*

✅ /foo/123
✅ /foo/abc 
✅ /foo
✅ /foo/abc/123
❌ /abc/123
```

Plus sign (+), 1 or n occurrences modifier

```zsh
👉 /foo/:bar+

✅ /foo/123
✅ /foo/abc 
❌ /foo
✅ /foo/abc/123
❌ /abc/123
```

## 4. Anonymous Parameters

You can declare parameter constraints without naming the parameters. In this case, the parameter names will be automatically assigned based on the order of appearance (index).

```zsh
# Define an anonymous parameter that "only matches numbers" because there is only one parameter, it is automatically named 0
👉 /foo/(\d+)

✅ /foo/123
❌ /foo/abc 
❌ /foot/abc/123
❌ /bar
```

```zsh
# Define a parameter that "matches all characters" because there is only one parameter, it is automatically named 0
👉 /foo/(.*)

✅ /foo/123
✅ /foo/abc 
✅ /foot/abc/123
❌ /bar
```
