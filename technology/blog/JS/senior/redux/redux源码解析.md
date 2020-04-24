## redux 源码解析

### compose 源码解析

- 核心代码

```js
export default function compose(...funcs) {
  // 从右往左执行：执行当前的函数，然后把返回值传给上一个函数 或 上一次循环返回的函数
  return funcs.reduce((a, b) => (...args) => a(b(...args)));
}
```

- 完整代码

```js
export default function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg;
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  // 从右往左执行：执行当前的函数，然后把返回值传给上一个函数 或 上一次循环返回的函数
  return funcs.reduce((a, b) => (...args) => a(b(...args)));
}
```

### applyMiddleware 方法解析

- 核心代码

```js
export default function applyMiddleware(...middlewares) {
  // 内部调用createStore函数生成store后，通过middlewares对dispatch函数进行强化，最终返回强化后dispatch方法后的store
  return createStore => (...args) => {
    const store = createStore(...args);
    // middleware添加getState方法，生成新的middleware chain
    const chain = middlewares.map(middleware => middleware(store.getState));
    /**
     * 新的middleware中传入dispatch，生成一个接收action的函数，对dispatch的强化就是在这个函数中做的，最终的结果dispatch变成了函数：
     * action1 => {
     *  // dispatch Hancer1
     *  action2 => {
     *    // dispatch Hancer2
     *    dispatch(action2);
     *    // dispatch Hancer2
     *  }(action1);
     *  // dispatch Hancer1
     * };
     * 结合redux-thunk源码理解
     */
    dispatch = compose(...chain)(store.dispatch);
    return {
      ...store,
      dispatch
    };
  };
}
```

- 完整代码

```js
export default function applyMiddleware(...middlewares) {
  // 内部调用createStore函数生成store后，通过middlewares对dispatch函数进行强化，最终返回强化后dispatch方法后的store
  return createStore => (...args) => {
    const store = createStore(...args);
    let dispatch = () => {
      // 报错提示：不允许在构建中间件的时候使用dispatch，其他中间件不会应用这个dispatch
      throw new Error(
        `Dispatching while constructing your middleware is not allowed. ` +
          `Other middleware would not be applied to this dispatch.`
      );
    };

    const middlewareAPI = {
      getState: store.getState,
      dispatch: (...args) => dispatch(...args)
    };
    // middleware添加getState方法，生成middleware chain
    const chain = middlewares.map(middleware => middleware(middlewareAPI));
    /**
     * 新的middleware中传入dispatch，生成一个接收action的函数，对dispatch的强化就是在这个函数中做的，最终的结果dispatch变成了函数：
     * action1 => {
     *  // dispatch Hancer1
     *  action2 => {
     *    // dispatch Hancer2
     *    dispatch(action2);
     *    // dispatch Hancer2
     *  }(action1);
     *  // dispatch Hancer1
     * };
     * 结合redux-thunk源码理解
     */
    dispatch = compose(...chain)(store.dispatch);

    return {
      ...store,
      dispatch
    };
  };
}
```

## redux-thunk 源码解析

- 核心代码

```js
const thunk = ({ dispatch, getState }) => next => action => {
  // 正常的action creator的结果是一个对象，如果是一个函数时，说明就需要在这个函数中使用到dispatch，这时就给这个action函数中传入store中的dispatch, getState方法，异步完成之后再触发一次dispatch(Object)，去执行下面的next(action)
  if (typeof action === "function") {
    return action(dispatch, getState);
  }
  // action为对象时，进入下一个中间件或dispatch(action)
  return next(action);
};
```

- 完整代码

```js
// 又包了一层高阶函数，加了一个可扩展的参数
// extraArgument 用处是对dispatch后action函数中的参数做扩展，可以通过thunk上的withExtraArgument方法，
function createThunkMiddleware(extraArgument) {
  return ({ dispatch, getState }) => next => action => {
    // 正常的action creator的结果是一个对象，如果是一个函数时，说明就需要在这个函数中使用到dispatch，这时就给这个action函数中传入store中的dispatch, getState方法，异步完成之后再触发一次dispatch(Object)，去执行下面的next(action)
    if (typeof action === "function") {
      return action(dispatch, getState, extraArgument);
    }
    // action为对象时，进入下一个中间件或dispatch(action)
    return next(action);
  };
}
const thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;
```
