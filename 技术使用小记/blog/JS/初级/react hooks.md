# react hooks

### useCallback
返回一个memoized(记忆的)回调函数.<br />
把**内联回调函数**及依赖项数组作为参数传入useCallback, 他将返回该回调函数的memoized版本, 该回调函数仅在某个依赖项改变时才会更新, 当你把这个函数传递给内部使用引用相等性去避免非必要渲染(如: shouldComponentUpdate)的子组件时, 他将非常有用.<br />
useCallback(fn, deps)相当于useMemo(() => fn, deps)
> 依赖项数组并不会做为参数传递给回调函数. 虽然从概念上来说它表现为: 所有回调函数中引用的值都应该出现在依赖项数组中.

### [useImperativeHandle](https://zh-hans.reactjs.org/docs/hooks-reference.html?#useimperativehandle)
可以让你在使用ref时, 自定义暴露给父组件的实例值. 大多数情况下, 应当避免使用ref这样的命令式代码, 而是应该与forwardRef一起使用
```js
function FancyInput(props, ref) {
  const inputRef = useRef();
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    }
  }));
  return <input ref={inputRef} ... />;
}
FancyInput = forwardRef(FancyInput);
```
在本例中, 渲染<FancyInput ref={fancyInputRef} />的副组件可以调用fancyInputRef.current.focus().
