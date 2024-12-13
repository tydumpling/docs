# js深度克隆

有一个需求，需要写一个函数，调用该函数后实现深度克隆并返回一样的数据。下面来想该怎么实现。

```js
function deepClone(v) {}
```

## 原始值

原始值好解决，直接原样返回即可。

```js
function deepClone(v) {
    return v;
}
```

## 非原始值

### 数组

如果是一个数组，不能直接返回，此时返回的只是地址，修改原数组会影响克隆后的数组。

因此需要先判断一下当前的元素是否是数组，如果是，则克隆一个空数组，然后遍历原数组，将每个元素根据递归的思想，再进行一次深度克隆。最后返回克隆后的数组。

```js
function deepClone(v) {
    // 数组情况
    if (Array.isArray(v)) { // [!code ++]
        let arr = []; // [!code ++]
        for (let i = 0; i < v.length; i++) { // [!code ++]
            arr[i] = deepClone(v[i]); // [!code ++]
        } // [!code ++]
        return arr; // [!code ++]
    } // [!code ++]
    return v;
}
```

### 对象

和数组一样，如果是一个对象，不能直接返回，此时返回的只是地址，修改原对象会影响克隆后的对象。

因此需要先判断一下当前的元素是否是对象，如果是，则克隆一个空对象，然后遍历原对象，将每个元素根据递归的思想，再进行一次深度克隆。最后返回克隆后的对象。

```js
function deepClone(v) {
    // 数组情况
    if (Array.isArray(v)) {
        let arr = [];
        for (let i = 0; i < v.length; i++) {
            arr[i] = deepClone(v[i]);
        }
        return arr;
    }
    // 对象情况
    if (typeof v === "object" && v !== null) { // [!code ++]
        let obj = {}; // [!code ++]
        for (let key in v) { // [!code ++]
            obj[key] = deepClone(v[key]); // [!code ++]
        } // [!code ++]
        return obj; // [!code ++]
    } // [!code ++]
    return v;
}
```

### 函数

函数不能直接克隆，因为函数的执行需要上下文，而克隆后函数的上下文会丢失，导致函数无法执行。

因此需要判断一下当前的元素是否是函数，如果是，则直接返回原函数。

```js
function deepClone(v) {
    // 数组情况
    if (Array.isArray(v)) {
        let arr = [];
        for (let i = 0; i < v.length; i++) {
            arr[i] = deepClone(v[i]);
        }
        return arr;
    }
    // 对象情况
    if (typeof v === "object" && v !== null) {
        let obj = {};
        for (let key in v) {
            obj[key] = deepClone(v[key]);
        }
        return obj;
    }
    // 函数情况
    if (typeof v === "function") { // [!code ++]
        return v; // [!code ++]
    } // [!code ++]
    return v;
}
```