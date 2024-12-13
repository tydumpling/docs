# HBuilder使用模拟器调试

## 下载安装模拟器

常见的安卓手机模拟器：

| 手机模拟器名称 | 对应端口号 |
| -------------- | ---------- |
| 夜神模拟器     | 62001      |
| 天天模拟器     | 6555       |
| 海马玩模拟器   | 26944      |
| 逍遥模拟器     | 21503      |
| 网易mumu模拟器 | 7555       |

以网易mumu 为例 ，下载地址：http://mumu.163.com/

下载后直接安装即可。

## 配置环境变量

1）复制adb.exe所在文件夹目录

找到[HBuilder](https://so.csdn.net/so/search?q=HBuilder&spm=1001.2101.3001.7020) X 的安装目录，查找adb.exe文件，复制adb.exe所在文件目录的路径，配置到环境变量的Path中。
[![pCHFaSP.png](https://s1.ax1x.com/2023/07/20/pCHFaSP.png)](https://imgse.com/i/pCHFaSP)
2）打开控制面板—系统和安全—系统—高级系统设置—环境变量，界面如下：
[![pCHF8dH.png](https://s1.ax1x.com/2023/07/20/pCHF8dH.png)](https://imgse.com/i/pCHF8dH)
3）点击系统变量的Path 点击编辑后 ，把之前复制的adb.exe路径拷贝进来，点击保存。
[![pCHFlLD.png](https://s1.ax1x.com/2023/07/20/pCHFlLD.png)](https://imgse.com/i/pCHFlLD)

## 安卓模拟器端口配置

点击Hbuilder的“运行”— 运行到手机或模拟器—Android模拟器端口设置。
[![pCHFMQK.png](https://s1.ax1x.com/2023/07/20/pCHFMQK.png)](https://imgse.com/i/pCHFMQK)

## 使用adb命令连接手机模拟器并测试

首先，打开mumu手机模拟器，在HBuilder x 中查看能否检测到设备。
如果 HBuilder x 未检测到 模拟器，需要使用adb命令进行连接。

运行cmd，执行以下命令行查看 adb 的版本（测试是否能使用）

```powershell
adb version
```

查看连接的设备

```powershell
adb devices
```

使用adb命令 让模拟器连接上电脑

```powershell
adb connect 127.0.0.1:7555
```

最后测试Hbuilder能否连接手机模拟器
[![pCHFnRx.png](https://s1.ax1x.com/2023/07/20/pCHFnRx.png)](https://imgse.com/i/pCHFnRx)

## ADB报错

https://ask.dcloud.net.cn/question/155184