## redux 主要的三个模块：store、reducer、action

- store <Object>：redux 中最重要的一个概念，通过 createStore 生成，主要有：

  - 三个外部方法
    - dispatch：分发 action
    - getState：获取 state
    - subscribe：订阅 state 的变化
  - 两个内部变量
    - state：全局唯一的 state，外部通过 getState()获取
    - listeners：接收 subscribe 传入的 listener，在 dispatch 结束（也是 reducer 函数执行完毕）时逐个调用

- reducer <Function>：用户传入的方法，而非定义在 redux 中的方法。会在 redux 中定义的 dispatch 方法里调用，接收当前的 state 和 dispatch 过来的 action，返回新的 state
- action <Object>：是 store 数据的唯一来源，通过 dispatch 传递给 reducer 中进行处理

## redux 中主要的五个 API：creatStore、combineReducers、compose、applyMiddleware、bindActionCreators

- creatStore：创建 store，有三个参数：reducer、initialState、enhancer
  - reducer <Function>
  - initialState <Object>：store 中初始数据，多用于同构应用中，接收服务端的 state 作为默认值
  - enhancer <Function>：是一个组合 store creator 的高阶函数，返回一个强化过的 store creator，如果要用多个 enhancer，可以使用 compose
- combineReducers：应用复杂时，为了方便管理，并不会新增 store，而是将 reducer 函数拆分成多个单独的函数，拆分后的每个函数负责管理独立的一部分 state。他接收一个由多个子 reducer 函数作为 value 的 object，返回一个合并后的最终 reducer 函数。combineReducers 返回的 state ，会将每个 reducer 返回的 state 按其传给 combineReducers 时对应的 key 进行命名
- compose：从右到左来组合传入的函数，先执行右侧的函数，然后返回值会作为参数提供给左侧的函数，通过 reduce 实现的。
- applyMiddleware：enhancer 的一种，组合多个 redux 中间件，形成一个 middleware chain，最终返回一个强化 dispatch 后的 store。middleware chain 是使用 map 函数给每个 middleware 加上 store 里的 state 后形成的新的 middleware 数组。新 middleware 数组通过 compose 进行组合，每次都返回一个接收 action 的函数给前一个函数，对 dispatch 的强化就是在这个函数中做的，最终的结果 dispatch 函数会变成：

```js
    action1 => {
        // dispatch Hancer1
        action2 => {
            // dispatch Hancer2
            dispatch(action2);
            // dispatch Hancer2
        }(action1);
        // dispatch Hancer1
    };
```

> 由此可见：middleware 之间互不影响，都是用来包装 dispatch 方法来达到想要的目的（比如 redux-logger）

- bindActionCreators：把一个 value 为不同 action creator 的对象，转成拥有同名 key 的对象，同时使用 dispatch 对每个 action creator 进行包装，以便可以调用他们。
  -  参数：actionCreators（一个 value 为 action creator 的对象 或 action creator）、dispatch（Store 实例上的方法）
  - 返回值：
    - 传入的是对象时，返回一个与原对象类似的对象，只不过这个对象的 value 是会直接 dispatch 原 action creator 返回结果的函数
    - 传入的是函数时，返回的也是一个函数
  - 使用场景：需要把 action creator 传给子组件，而且不希望把 dispatch、redux store 传给他时（即：不想让子组件察觉到 redux 的存在，）。

## 一个 logger 中间件

```js
function logger({ getState }) {
  return next => action => {
    console.log("will dispatch", action);

    // 调用 middleware 链中下一个 middleware 的 dispatch。
    let returnValue = next(action);

    console.log("state after dispatch", getState());

    // 一般会是 action 本身，除非
    // 后面的 middleware 修改了它。
    return returnValue;
  };
}
```

## 简易实现一个 creatStore

```js
const createStore = (reducer, initialState) => {
  // internal variables
  let state = initialState;
  const listeners = [];

  // api-subscribe
  const subscribe = listener => {
    listeners.push(listener);
  };
  // api-dispatch
  const dispatch = action => {
    state = reducer(state, action);
    listeners.forEach(listener => listener());
  };
  // api-getState
  const getState = () => state;
  const store = {
    subscribe,
    dispatch,
    getState
  };
  return store;
};
```
