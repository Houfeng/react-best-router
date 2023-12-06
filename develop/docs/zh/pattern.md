# 详解路径匹配

## 1. 具名参数

```zsh
# 定义有一个「由二层路径组成的 pattern」
# 第一层 foo 是确定值，第二层 :bar 是变量

👉 /foo/:bar

# 上述 pattern 需两层且以 /foo/... 开头才能匹配，以示例说明

✅ /foo/123
✅ /foo/abc 
❌ /foo
❌ /foo/123/abc
```

```zsh
# 定义有一个「由二层路径组成的 pattern」
# 第一层 :foo 是变量，第二层 bar 是确定值

👉 /:foo/bar

# 上述 pattern 需两层且以 .../bar 结尾才能匹配，以示例说明

✅ /abc/bar
✅ /123/bar
❌ /foo
❌ /foo/123
❌ /bar
```

如上边的两个示例，路由 pattern 总是完整匹配，变量部分可被任意合法的字符填充，同时，可在代码中
通过 navigator 的 params 拿到参数的具体值，如下

```tsx
function YourComponent(){
  const nav = useNavigator();
  return <span>{nav.params.bar}</span>
} 
```

## 2. 参数约束

```zsh
# 定义有一个「由二层路径组成的 pattern」
# 第一层 foo 是确定值，第二层 :bar 是变量，同时约束 :bar 为数字

👉 /foo/:bar(\d+)

# 两层以 /foo/... 开头且以数字结束才能匹配，以示例说明

✅ /foo/123
❌ /foo/abc 
❌ /foo
❌ /abc/123
```

参数约束写在变量名后的的小括号中，语法为「正则表达式」。

## 3. 参数修饰符

问号（?），可选参数修饰符（0 或 1 次）

```zsh
👉 /foo/:bar?

✅ /foo/123
✅ /foo/abc 
✅ /foo
❌ /foo/bar/123
❌ /abc/123
```

星号（*），0 或 n 次修饰符

```zsh
👉 /foo/:bar*

✅ /foo/123
✅ /foo/abc 
✅ /foo
✅ /foo/abc/123
❌ /abc/123
```

加号（+），1 或 n 次修饰符

```zsh
👉 /foo/:bar+

✅ /foo/123
✅ /foo/abc 
❌ /foo
✅ /foo/abc/123
❌ /abc/123
```

## 4. 匿名参数

可只声明参数约束，但不为参数命名，此时参数名将会以参数出现的次序为名（也就是 index）

```zsh
# 定义了一个「仅匹配数字」的匿名参数，因为只有一个参数,自动命名为 0
👉 /foo/(\d+)

✅ /foo/123
❌ /foo/abc 
❌ /foot/abc/123
❌ /bar
```

```zsh
# 定义了一个「匹配所有字符」的参数，因为只有一个参数,自动命名为 0
👉 /foo/(.*)

✅ /foo/123
✅ /foo/abc 
✅ /foot/abc/123
❌ /bar
```
