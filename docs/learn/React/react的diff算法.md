# Diff算法

## 原理图

[![pCF9Ouq.png](https://s1.ax1x.com/2023/06/07/pCF9Ouq.png)](https://imgse.com/i/pCF9Ouq)

## key的作用

虚拟 DOM 中 `key` 的作用：

1. `key` 是虚拟 DOM 对象的标识，更新显示时 `key` 起着及其重要的作用。
2. 当状态的数据发生变化时，`react` 会根据 【新数据】 生成 【新的虚拟 DOM】，随后 `react` 进行 【新虚拟 DOM】的 `diff` 算法比较，比较规则如下：
   - 旧虚拟 DOM 中找到与新虚拟 DOM 相同的 `key` ：
     1. 若虚拟 DOM 中内容没变，直接使用之前的真实 DOM
     2. 若虚拟 DOM 中内容改变，则生成新的真实 DOM，随后再替换掉页面中之前的真实 DOM
   - 旧虚拟 DOM 中未找到与新虚拟 DOM 相同的 `key` ：根据数据创建新的真实 DOM，随后渲染到页面

## key为什么避免使用索引

1. 若对数据进行添加、逆序删除等破坏顺序操作：会产生没必要的真实 DOM 更新，效率低
2. 如果结构中包含输入类的 DOM：会产生错误的DOM更新

下面来看一个例子：有一个动态循环渲染数组的数据，点击按钮后在最开始添加一条新数据，此时页面会重新渲染了。分为两个 `key` ，一个索引，一个 `id` 。代码如下：

```jsx
  class Person extends React.Component{

		state = {
			persons:[
				{id:1,name:'小张',age:18},
				{id:2,name:'小李',age:19},
			]
		}

		add = ()=>{
			const {persons} = this.state
			const p = {id:persons.length+1,name:'小王',age:20}
			this.setState({persons:[p,...persons]})
		}

		render(){
			return (
				<div>
					<h2>展示人员信息</h2>
					<button onClick={this.add}>添加一个小王</button>
					<h3>使用index（索引值）作为key</h3>
					<ul>
						{
							this.state.persons.map((personObj,index)=>{
								return <li key={index}>{personObj.name}---{personObj.age}<input type="text"/></li>
							})
						}
					</ul>
					<hr/>
					<hr/>
					<h3>使用id（数据的唯一标识）作为key</h3>
					<ul>
						{
							this.state.persons.map((personObj)=>{
								return <li key={personObj.id}>{personObj.name}---{personObj.age}<input type="text"/></li>
							})
						}
					</ul>
				</div>
			)
		}
	}
```

点击新增按钮时，它们各自做了以下操作：

- index
  ```javascript
  初始数据：
  	{id:1,name:'小张',age:18},
  	{id:2,name:'小李',age:19},
  初始的虚拟DOM：
  	<li key=0>小张---18</li>
  	<li key=1>小李---19</li>
  
  更新后的数据：
    {id:3,name:'小王',age:20},
    {id:1,name:'小张',age:18},
    {id:2,name:'小李',age:19},
  更新数据后的虚拟DOM：
    <li key=0>小王---20</li>
    <li key=1>小张---18</li>
    <li key=2>小李---19</li>
  ```
  
  此时新旧虚拟DOM对比，`key` 索引为0的数据不一致，生成真实 DOM；  `key` 索引为1的数据不一致，生成真实 DOM；  `key` 索引为2没有该旧虚拟DOM，是新数据，生成真实 DOM。
  
  可以看到，虽然我们知道有两条数据是一致的，但是 `diff` 算法在对比时索引错乱导致他们对比都不相等，全部都要生成真实DOM，造成很多的性能浪费。
- id
  
  此时新旧虚拟DOM对比，`key` `id` 为3  没有该旧虚拟DOM，是新数据，生成真实 DOM；  `key`   `id` 为1对比后数据一致，不生成真实 DOM直接复用； `key` `id` 为2有该旧虚拟DOM，对比后数据一致，不生成真实 DOM 直接复用。
  
  这么看来，只需要生成一次真实 DOM，如果数据多则极大提高性能效率。

同样的，如果循环体 `li` 标签内存在输入框 `input` ，则输入框节点对比后无变化，因此会复用，此时索引作为 `key` 时会出现下面这种 `bug` ：

[![pCFZfDH.png](https://s1.ax1x.com/2023/06/07/pCFZfDH.png)](https://imgse.com/i/pCFZfDH)

> 注意
> 
> 如果不存在对数据进行逆序添加、逆序删除等破坏顺序操作，仅用于渲染展示，使用索引是没有问题的。
