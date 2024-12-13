---
title 项目模块
---
# 项目模块引言

主要收录网络上学习的项目，目前有：


- [小兔鲜](./myself/小兔鲜/inweb/all)

  Web端：Vue3 + element-plus + axios + pinia

  Uniapp端：Vue3 + uni-ui + uniapp + pinia

- [硅谷甄选](./myself/硅谷甄选/) 


  Vue3 + ts + element-plus + axios + pinia

- [尚医通](./myself/尚医通/)

  Vue3 + ts + element-plus + axios + pinia

- [react 后台](./myself/react后台/)

  React + React-redux + React-router-dom + redux + antd

- [知乎日报](./myself/知乎日报/react版/)

  React + React-redux + React-router-dom + redux + antd-mobile

- [优医问诊](./myself/优医问诊/)
  
  Vue3 + ts + vant + axios + pinia



<script setup>
import { useData } from 'vitepress'

const { page } = useData()
</script>

<pre>{{ page }}</pre>