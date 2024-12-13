# 赋值运算符

使用 `=` 进行变量赋值

```js
let url = 'tydumpling.com';
```

## 算术运算符

包括以下几种算术运算符。

| 运算符 | 说明   |
| ------ | ------ |
| *      | 乘法   |
| /      | 除法   |
| +      | 加法   |
| -      | 减法   |
| %      | 取余数 |

```js
let a = 5,b = 3;
console.log(a * b); //15
console.log(a % b); //2
```

## 复合运算符

可以使用 `*=、/=、+=、-=、%=` 简写算术运算。即 `n*=2` 等同于 `n=n*2`。

```js
let n = 2;
n *= 2;
console.log(n);
```

对变量加减相应数值。

```js
let n = 2;
n += 3;
console.log(n); //0
n -= 5;
console.log(n); //5
```

`n+=3` 是 `n=n+3` 的简写形式

## 一元运算符

### 前置操作

前置操作会在表达式最先执行。

```js
let n = 1;
++n
console.log(n);
--n
console.log(n);
```

++n 就是 n=n+1 的简写形式。

使用后置操作符，`++n` 会在最先执行，所以 f 的结果是 33。

```js
let n = 2;
let f = 30 + ++n;
console.log(f);
```

### 后置操作

后置操作会在表达式最后执行。

```js
let n = 1;
n++
console.log(n);
```

使用后置操作符，`n++` 会在最后执行，所以 f 的结果是 32。

```js
let n = 2;
let f = 30 + n++;
console.log(f);
```

参与数学计算

```js
let a = 1;
b = a++ + 2;
console.log(b); //3
```

## 比较运算符

| 运算符 | 说明               |
| ------ | ------------------ |
| >      | 大于               |
| <      | 小于               |
| >=     | 大于或等于         |
| <=     | 小于等于           |
| ==     | 强制类型转换比较   |
| ===    | 不强制类型转换比较 |

下面来体验不同类型的比较结果

```js
let a = 1,b = 2,c = '1';

console.log(a < b); //true
console.log(a == b); //false
console.log(a == c); //true
console.log(a === c); //false
console.log(a == true); //true
console.log(a === true); //false
```

以下示例不允许年龄超过 90 岁

![image-20191030113342551](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAcEAAAA0CAYAAADyk4P2AAABRGlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8zAxSAHxEoMponJxQWOAQE+QCUMMBoVfLvGwAiiL+uCzPJk/6zYvtc7xb+96v3O54mLMNWjAK6U1OJkIP0HiNOSC4pKGBgYU4Bs5fKSAhC7A8gWKQI6CsieA2KnQ9gbQOwkCPsIWE1IkDOQfQPIFkjOSASawfgCyNZJQhJPR2JD7QUBHhdXHx+FUCMTQ3MPAs4lHZSkVpSAaOf8gsqizPSMEgVHYCilKnjmJevpKBgZGFoyMIDCHKL68w1wWDKKcSDECsQYGCxdGBiYFyPEkqQYGLYD3S/JiRBTWc7AwB/BwLCtoSCxKBHuAMZvLMVpxkYQNvd2BgbWaf//fw5nYGDXZGD4e/3//9/b////uwxo/i0GhgPfAH1oXsEjY7ajAAAAOGVYSWZNTQAqAAAACAABh2kABAAAAAEAAAAaAAAAAAACoAIABAAAAAEAAAHBoAMABAAAAAEAAAA0AAAAALuzkM8AABcKSURBVHgB7Z0DtCRJ04ZzZmdtc9a2vbO2Z20bZ23btnXWtm3btm3VH0/sRH7Z1VWNe/v+0zMdcU51ZaUq862qjIzIiOxemVBwcgQcAUfAEXAEOhCB3h3YZ++yI+AIOAKOgCOgCDgT9BfBEXAEHAFHoGMRcCbYsY/eO+4IOAKOgCPgTNDfAUfAEXAEHIGORcCZYMc+eu+4I+AIOAKOgDNBfwccAUfAEXAEOhYBZ4Id++i9446AI+AIOALOBP0dcARyCPz999/ht99+y8X6pSMwaCGAC/iff/4ZeJ+dyhHoU54UwjPPPFMr2dMcgbZHYLbZZmu6jZdeemnYYIMNwuKLLx7uvPPOpss3UmCJJZYIv/76a3j44YdLs//777+hX79+4cUXXwynn356WGeddUrz/n8mbLLJJuGvv/4Ku+22W5h++umrbn333XeHvfbaK/Tv3z/sscceVen1Is4+++ywzz77hMMPPzxsvPHG9bI3lP7444+HYYcdNsw000wN5U8zLbPMMuGTTz4Jt956axh//PHTpLYOM37PMcccYfnllw833nhjW7d1YDauJhOkYV0ZRAZmh/zejoAh0JVJHLPnI488UquYYYYZrKpun3/55Zfw2WefhfHGGy8MN9xwgUG5Ht18883hkUce0Wz77bdfWGONNUKfPtWf7EsvvRROPvnketU1lb7VVluFWWaZparM7bffHs477zyNP+KII/T8ww8/hJFHHjnm/e6778JTTz2lA3CMbCIAVl9++WWVNH7vvfeGU045paGamMgMM8wwmpf3YJ555tHwAw88oBOLhioZkAl8P/74Y5WqminX03k/+uijwIRkqqmm6tLzp18777xzmHvuucNBBx3U081t2/qrv6i2bao3zBHoeQQYaF999VW90dRTTx0YKJql4YcfPkw66aQVxU444QSVbpAmll56aU376aefwoMPPhjzTTfddGH00UfXa5jxvvvuq+EZZ5xRpcHrrrsurLbaajG/Bd57772A9NRKWm655aqYICribbbZRm8D04WhX3TRRSo1X3LJJaWS6vfffx9ef/318OyzzypTR1K87bbbwqyzztpUkz/99NMABs0S0t/mm28ezjrrrLDggguqVIR01BPE5AZG+/LLL4chhhgizD777HrAaGoRKkvweeihh8KTTz4Z+vbtq22df/75w6ijjlpYFE3CXXfdFcC3K/Tjjz9qeSZlnUzOBDv56XvfqxA4/vjjYxwDZ1doxBFHDAwwKZVt0cugbITkt+yyy+rlLbfcooxv9dVXD4ceemiYYoopwgEHHBBWWWWV0Lt3byuiZwbaRpgDEta6666rZXbffXeVACoqSi4WWGCB5CoE2r/FFluEd999N8CUt9xyS00fbbTR9Ey98803X5h44oljudNOO00ZDlJUnu6///7IBJEcd91115gF9S904YUXhueeey7GH3vsseGdd97Ra5jotttuqxOKVDqcbLLJND2VmAmfeeaZYcIJJ9SJyAorrKB1r7/++rHu7gZgSHvuuWc46aSTKqqiDxBt5d1K22UZ//nnn7DRRhsFJhIp0d+xxhpLJw6TTz55muThFiLQp4V1eVWOwCCNwGWXXRZgPhBMwNRpaadeeOEFVdVNOeWUYaKJJkqTYniEEUaI4XqBgw8+OGaxgQ6Ja++999b4Aw88MBDP2hhqyPPPP19VYLGQBJDIVlpppTSqMGwqrwkmmEDVX0MNNVRhvqJIVMQXX3yxDso33XRTHMyRGK1tMBWYW0owwGmnnVaXVVAvI5WxTpVKN/T33HPPTYtpGJUqhxFMxCTsp59+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)

```html
<input type="js" name="age" />
<span id="msg"></span>
<script>
  let span = document.querySelector("#msg");
  document
    .querySelector('[name="age"]')
    .addEventListener("keyup", function() {
      span.innerHTML = this.value >= 90 ? "年龄不能超过90岁" : "";
    });
</script>
```

## 逻辑运算符

### 逻辑与

使用 `&&` 符号表示逻辑与，指符号两端都为 true 时表达式结果为 true。

```js
let a = true,b = true;
if (a && b) {
    console.log('表达式成立');
}
```

### 逻辑或

使用 `||` 符号表示逻辑或，指符号左右两端有一方为 true，表达式即成立。

```js
let a = true,b = false;
if (a || b) {
    console.log('表达式成立');
}
```

### 逻辑非

使用 `!` 符号表示逻辑非，即原来是 true 转变为 false，反之亦然。

```js
let a = true,b = false;
if (a && !b) {
    console.log('表达式成立');
}
```

### 优先级

下列中因为 `&&` 的优先级高所以结果是 `true`。

```js
console.log(true || false && false);
```

可以使用 `()` 来提高优先级

```js
console.log((true || false) && false);
```

### 密码比对实例

![Untitled](https://doc.tydumpling.com/assets/img/Untitled-2408590.ed2e964d.gif)

```html
<input type="js" name="password" />
<input type="js" name="confirm_password" />
<br />
<span name="msg"></span>
<script>
  function queryByName(name) {
    return document.querySelector(`[name='${name}']`);
  }
  let inputs = document.querySelectorAll(
    "[name='password'],[name='confirm_password']"
  );

  [...inputs].map(item => {
    item.addEventListener("keyup", () => {
      let msg = "";
      if (
        queryByName("password").value !=
          queryByName("confirm_password").value ||
        queryByName("password").value.length < 5
      ) {
        msg = "两次密码不一致或密码长度错误";
      }
      queryByName("msg").innerHTML = msg;
    });
  });
```

### 短路运算

下例中 `a` 为真值，就已经知道结果了就不会再判断 `f` 的值了。

```js
let a = true,f = false;
console.log(a || f);
```

同理当 `f` 值为假时，就已经可以判断 `&&` 的结果了，就没有判断 `a`的必要了。

```js
let a = true,f = false;
console.log(f && a);
```

使用短路特性赋值

```js
let sex = prompt("你的性别是？") || "保密";
console.log(sex);
```

当 opt.url 没有值时，使用短路特性设置 url 的值

```js
let opt = {
    url: ''
};

function getUrl(opt) {
    opt.url = 'tydumpling.com';
}
opt.url || getUrl(opt);
console.log(opt.url);
```

### 实例操作

下面的例子在用户输入表单项并接收协议后才可提交

![1571972661635](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAegAAACzCAIAAADNDBjbAAAgAElEQVR4nO3df3QT15028K9bdblqHBgnDpF7IEFZnDIU9kUubpCA3SLibS2X7iIvNEjrdI0gDciQgh3aYiVnS2XSJTZpqQUELPy+cCTewCt5F2LRrWvxvgux0oW1aGEZAhwLElKpQOIhNUeTg8K8f/iXjGVbxg4w8HwO5wTN3LlzPcGPru7cucqQZZkAAEA5vnC3GwAAAMOD4AYAUBgENwCAwiC4AQAUBsENAKAwCG4AAIVBcAMAKAyCGwBAYVR3uwH3nH379t3tJgAow+LFi+92Ex5Qdy+4xUioKRCZaLXM4m67DumE3yNweXMNuglsFJuGf44AQ0IX5y66e0MlF7x2S5ltvTty2zWIwYoS67Lnrc6m6Ci2CwDgHjdoj/uEa9mGYPvw6ssp3lhrmZxGyRkW21xn2RG3693y6lnDOgcRESUi7qVW1ynil7vdpdrhHw8AoFSDBvcVofGgP5YYVn08vy7NotriJcaKwwH/7qBzlnF4Ix2JiHdpUVlDjIiEnUVZO1MWYpp5Dv+BSn3msKoGALjXDTnGzfQbW1t+widtibiMU8uOmX3tHnPfo0PrphreSFlJxLvW0Rjrt1mMMMax8y6bxd13R07RhuoBu+0dYdfzxRUNETbTbJ6epU5RIh495g+ckqRMjRapDQD3nTtyczIhnj7k9Z5JvVNs8gu3bFLxOatTB7d0yl1WUuE+IWoKqwP7ynUpc/m8u2iulzijY6NNM7KGAwDcg+7gzckJ9uYb8pCa1wwwYJ2IBV8vztMvc58i3Spfy4EBUlsMOUoqAlc544ba8mkja3Ai7JiekZFbERrWYNHIJfzWrAy1seb2b9sCwH1NIQ/gdAQden7+Or+QqS/3trZs1AZWWh2H+g2+dIRrFpur3pX4UrdnFZ+qIgAAxRtyqEQS9lVYTyZPtRYFQSIpVG2x+voeHTsZJcoZ7RYSEVGmsWy9VTjEV2yw6zUkNlV49ntD9cHQqx7PK8au8ZBYsGJRcc1RUbuozrfVjEESALhfDT3GLZ4IeE/03xwJ7Y+EUtSXMrilYberH83CWt/Crr9zBdXBw7xtSZn31SKDUNu4w5Z1rMr2gjNwnvgST+MOixYPhA4igQdmAZRtyKESpt94uu8odFvtPEaZFl+/AeuWlwccnZBGe5iYzbB5DvvKZ7HI3mWG/Kk6kyNwgTNuaAzutmgHm1oY8T4/NeuxvGX7+89xGYCKSAy5Xpg/9TG1Wp31VH6xo6HP4HPsqKvsu3lPPaZWq9VZuXlFK13BSz07Ra9ZnaEucl9NOkDyFz+coTa5xZ4aDlVZ9U9lPaxW50yd/4IrlFyYKPKGQZ2RZT3Y55yuv1VnZFn9CSIisb5I/aWcsiZR2FtRpMtRq7vr6TnBqao8dUbez8JCvTUvR63WV3XdDY6FXKuL8nKz1Gp1Vs5Uw+IK9/GeY9KoNhWx52o8nPWUvtixX0h+0x70WlFgaVbGw8XemOBdPX9qjlqtznpqrtX1rkiS4F1XlDcxS63OekpvrTk6aAsAHgBpdL1GoXcWlxJEYrDKYnUPVVssHCVK74EaLq94sdF/3B85I7ApZucWV2XBUAMkV4Oe/YIokWd/S+0ic1qTx1WR2sXWyASLbYOZoi2eX3mrno9mHWspn0JEJB4qM5pdkQkm+3p7nobawwHXtrKiprAnVGfOTuuHkI5WGM01EY3RvqEyL5sih91Wi1oznPc5xhglJGGn1dqhs2/yO7Pigtdh/1WZOaEVdpm4rhIkCq6y3ZG85Q7rRH0WEcX8y+ZZ3aLOtrK6Yoo6fqnVv8O1bF5QONBSPY+lVW0/YlOZweyKTDLb19q0LNqyz11lMYavBhtX8OlcK6ZilIh4VtpYfkXtQSeF3RVr3WUlFMkXwhMqqvc7KeKrWltVUZKlO1lrxERPeJANNsMjYOOIGbe0DaPHreIrj/Wr50ajLb0U66Liy0ODTj1pP+3baNN3rk/CNMaXfaf/PGj5pCNbNtvMC221x+IDlXjrrbe6m91aOY2ImH5Da0/p6BYjI6bf3CbLsnyjpXIaUbapLtJ7eHSHiSPif9LaeTrPQkbMVHcl6QRxnzmTWGFduyzLcnvdQo5UfGWo5wzx5jU8EbF51Z3XvW2znhFnOZDcxmhtASOu639B3GtmRDStvKWnjhstlVOINLbGzi2RWiMjlqkrTz7LKi1l6p3hpOsQ9Zg1xOZ0nXfoam9xo7VyBtEEi6/nh/1zs30ykcbW+Od0rpXcvEJDRPyanhPGfSUcEWlKfO3dh7S8zJNKW34kVQPgzur9TYE7btChEikuETGW6hmXYZHEdonYLOfpodsz8HRAIuqIhBrcVS8UTdVOLV7vDl2SiIikWPD14qkPZ6SitjbcUgWnX1Pn89fZZ6b9qGamqWyFrqe0RqfLUUmxD2JERKca/WeIK7RZJ/UW1yyyGjmKNAVunZye+sq0hI6INMVc3NseZnzerBv+pxzdQqu+pw4Vr81lJEajHUklphTbZnWXSLT4GyJsWpFRI8Z6kN6k56TjwWBsONX2OOULnCJNgdXU8yadaXTsb25uKM9TpX2tVFrTgp4TMu0kLRFnXNDbwdfmalkiGr0yCndNAJRrsIQQRZFICryQk/FC/53e4i95U9WXapg7Fo0miHK06cw4yck320qZoW8PXdhb4awPBI8IsZ5f2GydqZAfZF1B8WQgcGI0fr01Wm3yaTIZRyRSnIikc0IkwXie7/MmkMnzE8h/PhJJED9k/sYikQ5iE7V97qZOnqpllFbu92I5E5Pf8Ji6s03JQy65fG+JmCBcJemSw5DjuLUmVSRyiUiTdrXdpHMRIcF0uX1uMWhmdM35SfdaqTRZSf9K2JeIVFk52b0HMdWADQB4cAwWLdFYlIjj5xn6PjguRUJBQdToCvJy+h7dLgRDF1JVFIlEEpQzQZPO+q38kuq6Jbdu1GZLocOCOEFvLiwyFXLB1WVerti5q3KQnqnws7zAiWGm3zBJHRIRZbG+nXcVUzNGiXYxnckbkhQnokx1nypU7HbWqB3qXIwlVdshxYnYrHLPhv6j1eqc5GdW0+77Sx0iEakzU7c9/WuV4vgvpdsGgAfEIL+XkiBEJGYo9zb2fXK8c60So+NAumuVRE60igmWN33qbbeSFTibw46caRpGRImQcG/MZmOZHBG1S3379QkpLknEsriBGplIKt85DtURl5IDS2oXh+hRxkfa5cxkaiJS5egKjKO1smLX1ehI/SnnNq8VAKQy8Bh3QmgNizSBnzqs+4opiKFQWFJpdbqRPBPDaTtT+17CcrW8Soqc7DPjjToE4QKxybxWRUSMVEQk9cmrzoGjTpocDSPpg0gkOYhPCULSS7VKTSRRchWJWCQ6slEgDc9rSDrTGu47s04Sb3+mXcqrETvsdm3zh6+mc60AIF0DB/eZQOA8aeYab+NGWR9iwHdEoglG4whXDhkdYnhbWfHiMveoDH9PKzZNI7HJ7UkaIIrscQc7GP9dE09ExDSaHEpEIud6C4T3esI9J2cGQz6jM37P8Z5Non+XPznHOY2GEQnneyePS0c8gfMja7nKYF6gpav+6m1JSXo1UJafk2N2pz3FXYqdEYRT3fcdphWbppB4yOXuaZsUql27rGxDIMrSuVYAkK4BUzns9YQlzlJoGGE/N9bgCV4lzSLzSCsaFVd9jnWuQAcFyGjdl9487kGodBWbyv3mmrLCImGlNS87Hj3md20LSjPLq7tXSjEsMGm3udzry/gN1rysuHDIVR3SGjThlq7HSTXWNbaaw66aRUXiC2ZdthRpcvs7dCZNJNh9EjavyJjt9W8pc0yqLM5VR0/6arZG+VlMSPE4a/qYcX21rcnqftVYFCmzzNXS1dbADpf/kta+pTjdT0aJFmfhfJdo8V3xmFWdV8PuN7sqCuaHS0y8Otrqd3tPccbN5aZMIhr6WgFAmgYI7pjbuVOgyXZb4XC+EDIh3XpvKRGu3RIQVXz588P8qoQhXfI5X4hkDfxpoD2canG9bKN5Ad/SRMULR+d9hCuobmnSOja6/Rtsrg7iJukMq+p86209KxeyAqdvi1SxxVdmclE2b1hY7t491aP3t3SPdHOF1Y1e5tjk920s82TyhgV2z44831x/8EZPmy3ufVH2qsu1dH6VSqObZ63Y4+Y2av0npBE9vK4x1x0O6jY63Yeqy/aIlKnl9bbanQ77nNv/ClCusDbYxDs3ugO/cngkljPDWLnb6VjCp3mtACBdqeZSRz2LNERMvynlxOvkB3CijT+xmJdYLEssliVmnYaIGWuTnrA4vcXIEXGFtW2pKrpNN1rK0/lqNCIiZvEPu3o8VgCQDvym3EWpOmyJONPkaGbaalJ/hlUzLkejyWJERBo+KxJ4LSQRUSanmaS3rHP2PmGRCAcaWsVMvXOjbfS/FHKGs/XYENMBp776+U4HBAC4KzJkWU61XRSvctxI55MQSZFgiIzzRje3xfDBgKAa6gGcU4HASUk716yfMLza9+3bt3jx4pG1EOD+h9+Uu2igLutopDYRMa1x3mjU0wenW2DRDVlomslyT8xjAQAYZQr5BhwAAOiG4AYAUBgENwCAwiC4AQAUBsENAKAwWN0nhX379t3tJgAADGigedwAAHCPwlAJAIDCILgBABQGwQ0AoDAIbgAAhUFwAwAoDIIbAEBhENwAAAqD4AYAUBgENwCAwiC4AQAUBsENAKAwKRaZ2rlz551vBwAApCn16oBPPvlkfn7+HW4KAACkI8VQCVIbAOBehmVdAQAUBjcnAQAUBsENAKAwCG4AAIVBcAMAKAyCGwBAYRDcAAAKg+AGAFAYBDcAgMIguAEAFAbBDQCgMAhuAACFQXADACgMghsAQGEQ3AAACoPgBgBQGAQ3AIDCILgBABQGwQ0AoDD3SnCLJwL+g6FIYsACUoc07EoTktTnIElo8gePR8SBz9IjdtTr2ukPd6Ta1xETzgixlLsAAD5/90pwt+6yFS92BsWUO0X/0qeyJha5zg+rStG7OEudVeztqTMheNYWzy+oCKTxFnDa7yhbXR2MpdrXVJ7H59kbUre1j46w+3XvQO9G0imvw1JcdXT4b0gA8GBTpVPo5s2bkUjkww8/FMXB0kqlUmVnZ0+ZMmXs2LGj1LxOnGmpWbunpmZTwLbDxG67mqut4fPEZhh0maPYtsEIOysq1rXkCCy4y6whIiLxlN93qF1bajNmE2PR0EF/S8xlCZZru46QAquNNZeM9q3OrgMAAPpJK7jPnj179uxZlUr1+OOPjxkzZqBi169fj8VioijOnz//i1/84ojadd5ftaulvbevGuU4Cu11WDOD2t4mM6azOpfwXa9i/orVnuhch2eVLnWdJ8OtCcrJ1/Gpd48+fo3HFTZY663mCcHgBj0jomPusvUt1ilW4wJGk+2VJa75O6sdDTbPQo6IKCG0HA4FL2ntd+qtBQCUKK3g/vDDDxljM2fOHKjA5cuXx48fT0R//OMf29rarly5otGMrMcYCda+7ordOsgQ9r8RTn7NlRp6g7sj0nLQL3A2otTBHTocjCU4y1zDiBo2PBrLDl/knMHxmrVM31pXyHE6HU+B1hMRWsATMeO6cuOeMv9mt7CwnCeiDkG4QGxG3h37TAAASpRWcHd0dHzlK1+5efNmyr2nT5+uqqoqKSn59re/zXGcLMvpB7d4uKZij0AUjx4TKSG4Vy8LMdIuqq4srI3eqJWOVllfPW3c6rFP6T1EOuwoejWsX+dxLuDSOUWXhBA8JJCKC9fbrA0p9uet9pTPGvBoYduyikPRrhfRVomkli3Wov09+5lulcdZkGoUh+kq650tK6Pm6RwR0RQDz5E/HBaJ54hoktW+0Bnc63a/W149i+hUa1gibrpOm6IiAIAuaQV3IpGQZfnGjRv9d125cmXz5s2yLO/evbutrW358uWJROKzzz5L8/TSmYCnPth9ey4S2usOETNOr6ws5IiIzdBro46K0qmGI5W6rpZGXD+rCV4w2/XDSW0iOh9oPEOUEIVDXiHFbkYLJZrF6JS7YnNIpHj0WJQScd96q5Cppnyb5VwwcDCSfEDseCBwy+E0wPD7lPLGYE9B3jCdeY8FWySLiRERZyqxmVmWSUNEFDnWEk0wY/7U4f1oAPCASWtWyWeffZZI5dq1a7/85S+vX78uy7Isy2PGjOlM7YH65v1pVjTHZVmW5eZVGmKmuiuyLMeb13T3ODONFevN7Hi1c2/XTVHxYFX1ETKudZqzh/dzhna7QxLpXmmVk8T9Fo6YfnObLMc9ixgRUTTs2eN213sDpyRKxEL7ve56t+dI1LC5reeo9l0mRpzF312J18yIGEvzpqnWMI+nWDB4vOs1K3D6dpQbJxGRGDwclpjOoMd9SQAYTLrBnTK7vV7vhQsXbt68efPmzdzc3MWLFw83uIekWWi3L7Fb8xkRUUJwbfDEJtsrlw9zLEEMuPcIRCQcb02e4CecEkQVlzctqbaC2ugNWZbl5jVaYvrqc73R3KO9QyIVy+oehpYSRES35va7NcXfLSrq/lO8zt9zXl2BkadIIBCmW3QEgyGJJhmMk4f3wwHAg2bY87jr6+vfeecdImpqaur8CxE9+uijK1euHLVGXXDNV2d0eXh+1Z6qYl6dkZGR8aWpjuMSnamZ/3D33i89VXZ46PqEnU7PJWKZTAoFkqaKi61hgVR5ugEmofQRCwcOhSIdRETilahEOdxjXXskSSJiapIiJ4RYz5zsK63Bg4FAz5/j0XhPVTNNxgkkHAoIfW+9SqFgUCRtoUmf1vAVADy4hhcSnan9zjvvXLp0qampqXPjl7/8Zbvd/tBDD41ao7g886pyXW+uSdFTgjSB13L9hiNUWYaJg9clxc/UlG0MSZyxehPvWulpbBItizgiIqklFJLYNIMhjVEX8ZCj+AXB9pu22nlS9FKUVAZtz3hGQiIVix+2GxYHiw5E6goZEdECT7vsISJKBJblFHn6tNlgKtC46j3ud8ur5/T8RFJwvy9GWvuCOznpBQAUaRjB/d577/V0sXtSm4i+973vPfHEE6PVIPF8OJqtt2/SJ23yW3lXgMynd9lvY7pF5ICvRWT8T5z2knbhVZdvf0BcZOGI6ESw5SppS4xpTOuWWo60SpkGQz4RRQRBIk6r7Y77uBQnUmfNNebVe1sOh6lQP1hNRETM+LyVr6/x7Ag45pi77rFe9XsaYjS53Dr39h8wAoAHxDCGSr761a+WlpbesvHZZ5+dPXv2KDQkQZRorSl4Koc31hzp8xR4ZI/Lf1VjXWG9rUlybOpaj/tlh3u9njGjZaFWPOTxXSIiCvkDAmmNBWkMlEgtgcMxpjcZM4k6hNYzEpvOT+1+y+scKmE5BuM0FjkcTDVlpV+b5tisM1nsoLuzJUQU2eP2X2X6520YJwGAIQ0vJzozur6+vvPlV7/61eeee24kp5fOB/0NAd8Bf+DdGCVIOMPxBcX8JbdjffekaRJDe4MS07WHqh3HUtSQM6/MXjDoNAyV1rKpkoiImNFi5ne6XHsE2xrR1yDQpHJzGj1c6bDXd4kZ1hVpiKRQMNRB2pl5PaeU4pJELCtTa9DnSNuCwUuV/IQhq+RtS43OFwI1m0PWzXrWEajaEpSyzWXL79hDnQCgYMPu4PVk96jckAxvXWZ9I0JMo8lmMdFQfbKxfDKLbZuvfS3Yd+2lsP/1ftMwiIhIpypOHdxXI5Er/TbOsdvnusq2Ot0ceS4Q/7LVOHRuxzw7fTHOVLNIQ0ThQ4EIae0FveMhUodEKo5lMl2+jv0q2BKW7BOGrlSzpNy2KeDaWe5aGjQ2OD0XmO4Vh2WYcxwB4MGU1lCJSqW6fv16z8vZs2eXlpamvCH58ccf0zAmNZPO4qz1NrdFI55FHBHjOEZJk7vlk9X6TNIs8USTJl+37zZ3T76WZVlu3dA91tF5M7MjEtxbU2bOy5mY50ix8J7WusaqiXnL1npjzGh/YehxEulodc1BUbvIbs4m6gi4GyKkMZqSxrHbO+JEasaITc/jVaJwLJ3BEqJMo2OdiesIOUuMtk0haZLVuTad2S0AAOn1uMeOHfvxxx9Ho9FHHnmkc5GplOPanYtMdZZP8/RspsU+k4go0n9fIly1whHKNHs2WXp71AnBtTUgZhqsC28d8Y4dCQoSiXvL5u8lUjHtXIsp6g1cuLVWrrC8bIbbcZy0Kyptk9Jpod25hqSVRkYUa3D7LhD/si1piUJJ6hBJxWVxRBzPc5oIpbtMq6a02rG3peJwKKzSWjZXm4b5KCgAPLDSCu7c3NwTJ05cvHjx4sWLQxZ+4oknsrNH/plfCm2wOY9KbLLU2uDnF5l0GkZEwray6uOSdnn/zI349gZFIsrWmUtttqVW0xTymv39g5vOB1suEBG1nw9HEkZ+yAvAtOZN1UREHUHnRr+YqXcsTZ43IraLRCyLY0Qqs+cD8yBXVDrjdWyN27fYut9zuj5hEJEkthMhuQEgLWkF96OPPvqNb3zjk08++eSTTwarS6V65JFHHn744UGWfk0b06/2+Cb6/Q0e99rimrUcX1Bsnhn3vx6UJttrN/QfmtZaV5ULC43ly43arn2plg4XgxUlFQFRw08joclhXacLbjaml5dS+A2H+wzxa5zJK15RIhqLSpTNZXW+HPByikL9suK17jCZ+PU2m4YoEfEuLSpriHFT+KwLgn9lkVXlc5fwmAwIAEOT0/DZZ5+JonjlypXLQ7l69aokSenUeYuktUpuFY+01K3Sc12ZyPgltc0fxNOost2zkBEze9q7N1xprpzDETF+RWP7lWb7NEYqzrihpT3VwcmPvMuyHD9SqcskmmDxRfuWizdasonNq27rV0NPK8yZXYHOplhqj7XLsixfaXEWaoiIm1XefCXetsusVRGpOP3LjZ0P3AMADCKt4L4DUgf3n6OtgTrnciPPEak43SKbZY6GERHTGlfUNn8weJV9grs9XGuZwohIu6iu7YYsy3JcqDVNICJOt8LX1u+NoE9wn6szTyJSaW3+6K3lQuW8ijSljQO9k0R3mzkVETF+UW1ruyzL8bYDlaZJjIg0hc7uN4142z67jiMi4mZYao/0OwsAQJK7Hdw3TtetstlKLcZJRJzF92dZluXT3krbEpNxhrarl52p1ZdU1oU64yze9ptaW2d8Z/LmLa0D9727grvug9OelzvHTzjdck9bUpc2Hq41TeqOy3CfmnqCO37OY5nCiDj9hpbOEvFQta3UZl9lt6+ymaYwIs68O2WvXZbltup5jJjWtKmlXZbbj3nKF/CMiFQa48uNbX071/FwnW1G57AN0xbYa3+D+AaA1O52cMtx3xKOVIybpLNs7k7GI+V8tlY3z2RZ46w70Nr25/5Htbfutusn8fbAQIkp9/a4o6erCzjK1tl2pEr5SGP5PA2bUd7ct7PfE9zRQLk+m9Otae4905U6U8831DCNfpWvbZDxDcFTe6AzgqO+Ei0RaWbaao8M0Owb0eZNFp2GiA3+owHAAy1DluXPfyD98yFJ/VZT7UM46ApcyDEtN/NXw2HS6QZ6oDEhxq5yt3xjj3giEIwwXaFRy0i8EKFJ2j73MBOSJElSgrFMxtJ/hikW9B7JMS3ih7gd2hEJhiRDAW5UAkBqSg5uAIAH0rDX4wYAgLsLwQ0AoDAIbgAAhUFwAwAoDIIbAEBhENwAAAqD4AYAUBgENwCAwiC4AQAUBsENAKAwCG4AAIVBcAMAKAyCGwBAYRDcAAAKg+AGAFCYFN8CsHPnzjvfDgAASFPqr2958skn8/Pz73BTAAAgHSmGSpDaAAD3Mnx1GQCAwuDmJACAwiC4AQAUBsENAKAwCG4AAIVBcAMAKAyCGwBAYRDcAAAKg+AGAFAYBDcAgMIguAEAFAbBDQCgMClWB4xEIu+++64S1zDJyMiYNWuWVqu92w0BAPgcpQjuUChkNpvvfFNGhd/vR3ADwP0tRXDLsqzE7nYn5bYcACBNCG4AAIXBzUkAAIVJ/dVl6LcCANyzMFQCAKAwqXrcMpFy00+5LQcASE+qHjfJsmLzT7ktBwBIU+qbk3LaTtSXl2//XTz9AwbW/vt9r7+y48TI6rrDlw8A4M5LEdzDycn4xSN79hw+I3W9PPOrZx8fN4Cn1/2/wesaI/5ut8vhcF+4zczuducvIgDAnTT60wGftO35/X+/917ynz8cKJvOhjyQzS0rm0v/sb36Nx2j3igAgPvHCGeVyHKfA2SZiD00/omvjO9brJ1TdRXrfH3x8J6DwrX+1X067klGF3+z9VfvPXTLHjZu+oKSuY+n0SD0uAHgPne787g73mtqPHmNpP+8SJQ4tu9/M+6hpwu+PYaI3tvyrawtKY54PL83uC+8XfXKrj8NUPV7dRv/o//WJ1f+1T/OGd9/OwDAg+Z2e9x/aqpe8+oxqfPFnnUr9tBT9l/P/0dZpqdXNBx2fKNP4cTZmr8v9CRVO/f10x+93rNbuii8z+U+Pa5PW6SLwp8e559MHmFJpzeNHjcA3Pdud4z7KfuvP/zoo48+/F/FjH37l20fffTRsQ35jIjo008/+dPH1671+SN+mhiwpotvvbTwm/O+V/uH5I3XGl9a+M15hS//n4vSbTYQAOB+Ncpj3ER0cdf383alKPr4rP7dYensvpf+aa2Pin6x3T49ee9Y0y/qX3ux9JUfzDv9h+07flrwlfSagx43ADwARrhWSc9Nyc7/5q449MGKIUt3ks76qn74o7qTXNEvvLXWJ754yznHTP+n+ubJb5S+uLH07y/+/H9us/JDz0sBAHgQjNIj7zJRQrp87uTFTwYtNvbpfH4cEUnnfD/+wY88Z9hce/325eOaqjeeXLy+ODep5Dn3ixvP5b/0z95941eU/PCH/yBJ++tt6WQ3OtwAcL8b4SPvMhFJZ30/WuI+0vGsldv2xr8PNibNvvXGyT3WcURjHrhWhooAAARCSURBVHlsfPZfLd2++Z+/+ySTjp0NbGu8lm/a9Gx3MEtH6rf5/u8T+T8dM+YJy9a9kmz/rXRdkmlMGg1CcgPAfe52x7j/+Ntt231H3zl69IxE4/50Lce05ltmy9/++MfXLl9OjB3/KCM6+4tvFXif8fznhjm31k5Ej8z58Vtzul6OmVm6bI5nw2vbSmb/cBojIjq36xd7Lz65aKN5oizLNGZy6a5/LyXMKgEAIKIRrFVy7eIHbNqiH5c+w9jXX3RV/7i0IHeMLP9he3H+4jf+cKMr++X0np+f+L0frcg990b5G8c6ZPnGe1t/9MaRh4p+tHr+2LSO7uMOXz4AgDsv9c3JoX3F/NouM5HUeGJ9/fWerdfOnXl/DD89t7vW99/8B82bXX9nf7v597st41LWxqa/WP3D3xb/fOUqVjrW/y+/G2fe9po57ZkkAAAPlJFOB+w9goikY0ePS59OPPe+LOcSkUzjF25026Z3lR2XO3bgesd87SX3a2cLVv/8pwk2c92Bmu88dnvdZ3S6AeC+N+J53EnTAaV3Gn/78bix5N3W/P0aoywTsccmfz3v67eWTuXa7/f+fGvzZWKMSaf2/8v2vJqX/vp2HnBHcAPAfW+k63H3PoAjX9y7reETw7q6ymnNr5R7BSnNquLnfrt99YK/WVDeIM1+dX9r64HqhV8+/i/P/c3ffP+n3v/60zBaMoz3GwAABbvdMe5un35KpGJE9L7H8cvfjV9Y/9zXjcZXf/u9iu+WjFVJNO3a5evS+IdSzL+WoqfeCQYa/q3h0O/el8ZOW1ix86WlptyHiGhJ9YHZhXu2/HLrmxUL3vzZlDmmbxcaDbNnzsgdf+uSgQAAD6KM/r3UN9988zvf+c5QB15rWG5YdegaEcste+vQc8e//63XP/jOjkM1xnFERJffqf3ZJs+h//qg77RuNtt5+K1/mni54aW/f9n3vkQ07mum55577jmzMbf/Xcvr77/z9r/+6781BFrOXUvQOOPrh3YveWKoZr399ts/+MEPhioFAKBgKYJ7+/btaQQ3XXsvePjMp2Nzvvb1bzwxjujyf75z7X/Mzu3ziMynl8+f++DytWvXP+3aMGbi1/86dxzRp//9rzuOUN6z82ZPTj3NpO+Z3j/V+t/XJhfOnjh02bfffvvFF18cuhwAgGLd/lolY5+e93dP95Z+LN/w2K3H/cVjf/m1x/4yRdV/MfXvyqameyIaO/Fr35yI+44AAJ1G/6vLAADgczXC6YD3HOW2HAAgTQhuAACFwVAJAIDCjPCLFAAA4E7DUAkAgMKkCO6MjBSTu5UiIyPjbjcBAODzlSK4n3nmmV//+tc3b968860ZoS984QvPPPPM3W4FAMDnS8GdawCABxNmlQAAKAyCGwBAYRDcAAAKg+AGAFAYBDcAgMIguAEAFAbBDQCgMAhuAACFQXADACgMghsAQGH+P1OYy7kFAP7IAAAAAElFTkSuQmCC)

```html
<body>
<form action="https://www.tydumpling.com" id="form">
  用户名: <input type="js" name="username" />
  <hr />
  <input type="checkbox" name="copyright" /> 接收协议
  <hr />
  <input type="submit" />
</form>
</body>
<script>
function query(el) {
  return document.querySelector(el);
}
query("#form").addEventListener("submit", function(event) {
  let username = query('input[name="username"]').value;
  let copyright = query('input[name="copyright"]').checked;
  console.log(!!username);
  if (!username || copyright === false) {
    alert("请填写用户名并接受协议");
    event.preventDefault();
  }
});
</script>
```

# 流程控制

## 判断

### if

当条件为真时执行表达式代码块。

```js
let state = true;
if (true) {
    console.log('表达式成立');
}
```

如果只有一条代码块，可以不用写 `{}`

```js
let state = true;
if (true) console.log('表达式成立');
console.log('一直都显示的内容');
```

### if/else

下面是使用多条件判断密码强度的示例

![1](https://doc.tydumpling.com/assets/img/1.6c60f9e2.gif)

```html
<body>
  <input type="password" name="title" />
  <span></span>
</body>
<script>
  let input = document.querySelector("[name='title']");
  input.addEventListener("keyup", function() {
    let length = this.value.length;
    let msg;
    if (length > 10) {
      msg = "密码已经无敌了";
    } else if (length > 6) {
      msg = "密码安全性中级";
    } else {
      msg = "这密码，要完的节奏";
    }
    document.querySelector("span").innerHTML = msg;
  });
</script>
```

### 三元表达式

是针对 `if` 判断的简写形式。

```js
let n = true ? 1 : 2;
console.log(n); //1

let f = true ? (1 == true ? 'yes' : 'no') : 3;
console.log(f); // yes
```

下面是创建 DIV 元素的示例，使用三元表达式设置初始值

```js
function div(options = {}) {
  let div = document.createElement("div");
  div.style.width = options.width ? options.width : "100px";
  div.style.height = options.height ? options.height : "100px";
  div.style.backgroundColor = options.bgcolor ? options.bgcolor : "red";
  document.body.appendChild(div);
}
div();
```

### switch

可以将 `switch` 理解为 `if` 的另一种结构清晰的写法。

- 如果表达式等于 `case` 中的值，将执行此 `case` 代码段
- `break` 关键字会终止 `switch` 的执行
- 没有任何 `case`匹配时将执行`default` 代码块
- 如果`case`执行后缺少 break 则接着执行后面的语句

```js
let name = '视频';
switch (name) {
    case '产品':
        console.log('duyidao.com');
        break;
    case '视频':
        console.log('tydumpling.com'); // 执行此条
        break;
    default:
        console.log('dao.com')
}
```

case 合用示例

```js
let error = 'warning';
switch (error) {
  case 'notice':
  case 'warning':
      console.log('警告或提示信息');
      break;
  case 'error':
      console.log('错误信息');
}
```

在`switch` 与 `case` 都可以使用表达式

```js
function message(age) {
  switch (true) {
    case age < 15:
      console.log("儿童");
      break;
    case age < 25:
      console.log("青少年");
      break;
    case age < 40:
      console.log("青年");
      break;
    case age < 60:
      console.log("中年");
      break;
    case age < 100:
      console.log("老年");
      break;
    default:
      console.log("年龄输出错误");
  }
}
message(10);
```

下面例子缺少 break 后，会接着执行后面的 switch 代码。

```js
switch (1) {
  case 1:
    console.log(1);
  case 2:
    console.log(2);
  default:
    console.log("default");
}
```

结果输出 1， 2， default

## 循环

### while

循环执行语句，需要设置跳出循环的条件否则会陷入死循环状态。下面是循环输出表格的示例。

```js
let row = 5;
document.write(`<table border="1" width="100">`);
while (row-- != 0) {
  document.write(`<tr><td>${row}</td></tr>`);
}
document.write(`</table>`);
```

### do/while

后条件判断语句，无论条件是否为真都会先进行循环体。

下面通过循环输出三角形示例，要注意设置循环跳出的时机来避免死循环。

```js
*
**
***
****
*****

function hd(row = 5) {
  let start = 0;
  do {
    let n = 0;
    do {
      document.write("*");
    } while (++n <= start);
    document.write("<br/>");
  } while (++start <= row);
}
hd();
```

### for

可以在循环前初始化初始计算变量。下面是使用`for` 打印倒三角的示例

```js
**********
*********
********
*******
******
*****
****
***
**
*

for (let i = 10; i > 0; i--) {
    for (let n = 0; n < i; n++) {
        document.write('*');
    }
    document.write("<br/>");
}
```

下面是使用循环制作杨辉三角的案例

![image-20191005010514562.9bfa19b0](https://doc.tydumpling.com/assets/img/image-20191005010514562.9bfa19b0.9bfa19b0.png)

```js
    *
   ***
  *****
 *******
*********

for (let i = 1; i <= 5; i++) {
  for (let n = 5 - i; n > 0; n--) {
      document.write('^');
  }
  for (let m = i * 2 - 1; m > 0; m--) {
      document.write('*');
  }
  document.write("<br/>");
}
```

for 的三个参数可以都省略或取几个

```js
let i = 1;
for (; i < 10; ) {
  console.log(i++);
}
```

### break/continue

break 用于退出当前循环，continue 用于退出当前循环返回循环起始继续执行。

获取所有偶数，所有奇数使用 `continue` 跳过

```js
for (let i = 1; i <= 10; i++) {
  if (i % 2) continue;
  console.log(i);
}
```

获取三个奇数，超过时使用 `break`退出循环

```js
let count = 0,num = 3;
for (let i = 1; i <= 10; i++) {
  if (i % 2) {
    console.log(i);
    if (++count == num) break;
  }
}
```

### label

标签(label) 为程序定义位置，可以使用`continue/break`跳到该位置。

下面取`i+n` 大于 15 时退出循环

```js
tydumpling: for (let i = 1; i <= 10; i++) {
  duyidao: for (let n = 1; n <= 10; n++) {
    if (n % 2 != 0) {
      continue duyidao;
    }
    console.log(i, n);
    if (i + n > 15) {
      break tydumpling;
    }
  }
}
```

### for/in

用于遍历对象的所有属性，`for/in`主要用于遍历对象，不建议用来遍历数组。

遍历数组操作

```js
let hd = [
  { title: "第一章 走进JAVASCRIPT黑洞", lesson: 3 },
  { title: "ubuntu19.10 配置好用的编程工作站", lesson: 5 },
  { title: "媒体查询响应式布局", lesson: 8 }
];
document.write(`
  <table border="1" width="100%">
  <thead><tr><th>标题</th><th>课程数</th></thead>
`);
for (let key in hd) {
  document.write(`
  <tr>
  <td>${hd[key].title}</td>
  <td>${hd[key].lesson}</td>
  </tr>
  `);
}
document.write("</table>");
```

遍历对象操作

```js
let info = {
  name: "tydumpling",
  url: "tydumpling.com"
};
for (const key in info) {
  if (info.hasOwnProperty(key)) {
    console.log(info[key]);
  }
}
```

遍历 window 对象的所有属性

```js
for (name in window) {
  console.log(window[name]);
}
```

### for/of

用来遍历 Arrays（数组）, Strings（字符串）, Maps（映射）, Sets（集合）等可迭代的数据结构。

与 `for/in` 不同的是 `for/of` 每次循环取其中的值而不是索引。

> 后面在讲到`遍历器` 章节后大家会对 for/of 有更深的体会

```js
let arr = [1, 2, 3];
for (const iterator of arr) {
    console.log(iterator); // 1  2  3
}
```

遍历字符串

```js
let str = 'tydumpling';
for (const iterator of str) {
    console.log(iterator); // d a o d a o
}
```

使用迭代特性遍历数组（后面章节会介绍迭代器）

```js
const hd = ["duyidao", "tydumpling"];

for (const [key, value] of hd.entries()) {
  console.log(key, value); //这样就可以遍历了
}
```

使用`for/of` 也可以用来遍历 DOM 元素

```js
<body>
  <ul>
    <li></li>
    <li></li>
  </ul>
</body>
<script>
  let lis = document.querySelectorAll("li");
  for (const li of lis) {
    li.addEventListener("click", function() {
      this.style.backgroundColor = "red";
    });
  }
</script>
```