# react hooks

### useCallback

返回一个 memoized(记忆的)回调函数.<br />
把**内联回调函数**及依赖项数组作为参数传入 useCallback, 他将返回该回调函数的 memoized 版本, 该回调函数仅在某个依赖项改变时才会更新, 当你把这个函数传递给内部使用引用相等性去避免非必要渲染(如: shouldComponentUpdate)的子组件时, 他将非常有用.<br />
useCallback(fn, deps)相当于 useMemo(() => fn, deps)

> 依赖项数组并不会做为参数传递给回调函数. 虽然从概念上来说它表现为: 所有回调函数中引用的值都应该出现在依赖项数组中.

### [useImperativeHandle](https://zh-hans.reactjs.org/docs/hooks-reference.html?#useimperativehandle)

可以让你在使用 ref 时, 自定义暴露给父组件的实例值. 大多数情况下, 应当避免使用 ref 这样的命令式代码, 而是应该与 forwardRef 一起使用

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

在本例中, 渲染<FancyInput ref={fancyInputRef} />的副组件可以调用 fancyInputRef.current.focus().

### useReducer

```js
/****************** MainProvider.js begin ******************/

import React, { useEffect, useReducer, createContext } from "react";

// 创建context
export const MainContext = createContext({});

// 创建reducer
export const UPDATE_FOLDER_LIST = "UPDATE_FOLDER_LIST";

const reducer = (state, action) => {
  switch (action.type) {
    case UPDATE_FOLDER_LIST:
      return {
        ...state,
        folderList: action.folderList
      };
    default:
      return state;
  }
};

/**
 * 创建一个MainProvider组件, MainProvider包裹的所有组件都可以访问到value对应的属性
 */

const MainProvider = props => {
  const initialState = {
    folderList: []
  };
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <MainContext.Provider value={{ ...state, dispatch }}>
      {props.children}
    </MainContext.Provider>
  );
};
/****************** MainProvider.js end ******************/

/****************** MainProvider 包裹的子组件 begin ******************/
// 引入MainContext, 即可获取到 dispatch 方法和 state 数据
const { dispatch, folderList } = useContext(MainContext);
/****************** MainProvider 包裹的子组件 end ******************/
```
