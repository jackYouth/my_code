
const PENDING = 'pending',
    RESOLVED = 'resolved',
    REJECTED = 'rejected';
export default class MyPromise {
    constructor(fn) {
        const that = this;
        that.state = PENDING;
        that.value = null;
        that.resolvedCallbacks = [];
        that.rejectedCallbacks = [];
        try {
            fn(that.resolve, that.reject);
        } catch (e) {
            that.reject(e);
        }
    }
    resolve = value => {
        const that = this;
        // 使用异步将resolve、reject方法放到执行队列最后，保证函数执行顺序
        setTimeout(() => {
            if (that.state === PENDING) {
                that.state = RESOLVED;
                that.value = value;
                that.resolvedCallbacks.forEach(resolveFn =>
                    resolveFn(that.value)
                );
            }
        });
    };
    reject = value => {
        const that = this;
        setTimeout(() => {
            if (that.state === PENDING) {
                that.state = REJECTED;
                that.value = value;
                that.rejectedCallbacks.forEach(rejectFn =>
                    rejectFn(that.value)
                );
            }
        });
    };
    then(onFulfiled, onRejected) {
        const that = this;
        onFulfiled = typeof onFulfiled === 'function' ? onFulfiled : v => v;
        onRejected =
            typeof onRejected === 'function'
                ? onRejected
                : function(r) {
                      throw r;
                  };
        if (that.state === PENDING) {
            this.resolvedCallbacks.push(onFulfiled);
            this.rejectedCallbacks.push(onRejected);
        }
        if (that.state === RESOLVED) {
            onFulfiled(that.value);
        }
        if (that.state === REJECTED) {
            onRejected(that.value);
        }
    }
}
new MyPromise(resolve => {
    setTimeout(() => {
        resolve('resovle success');
    }, 1000);
}).then(re => console.log(666666, re));
