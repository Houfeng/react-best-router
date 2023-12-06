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

## 5. 嵌套路由

通常父路由为「前缀匹配」时，才有「添加子路由」的意义，因为，如果父路由是严格匹配，虽然也能添加子路由，但是子路由并没有极会被匹配到。

下方是父子级嵌套路由的示例，这个示例比较简单，只有两层路径

```tsx
<Route pattern="/foo/:bar">
  ...
  {/* 也可在 children 中直接批定子路由 */}
  <Route pattern="/:child_bar">
  ...
   {/* 可直接通过 children 来指定渲染的目标组件 */}
   {/* Content 组件定义在 Content.tsx 中 */}
  <Content />  
</Route>
```

除了在 Route 的直接 children 中添加子路由，也可在**任意层级**的子组件中添加子路由

```tsx
// Content.tsx，也可在子组件中添加 Route
function Content() {
  return (
    <div>
    ...
     <Route pattern="/:child_bar">...</Route>
    ...
    </div>
  );
}
```

**怎么确定子路由的完整 pattern**？

> 由「父路由 pattern 最长的确切部分作为前缀」，加上「子路由自身的 pattern」， 最终组合成子路由的「完整 pattern」。

以上文示例中定义的 pattern 为示例

```zsh
👉 父路由，如果 pattern 为 /foo/:bar
    那么，最长的确切部分为 /foo/

👉 子路由，如果 pattern 为：/:child_bar
    那么，子路由的完整 pattern 为：/foo/:child_bar
```

一个有多个变量，更复杂一些的示例

```zsh
👉 父路由，如果 pattern 为 /foo/:bar/abc/(.*)
    那么，最长的确切部分为 /foo/:bar/abc/

👉 子路由，如果 pattern 为：/posts/:id
    那么，子路由的完整 pattern 为：/foo/:bar/abc/posts/:id
```
