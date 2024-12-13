### nvm

```
切换node版本 
nvm use 10 切换为10.xx
```

```
install：安装依赖包。
uninstall：卸载依赖包。
update：更新依赖包到最新版本。
init：在当前目录下创建 package.json 文件。
publish：将模块发布到 npm 上。
run：运行定义在 package.json 中的脚本命令。
test：运行测试脚本。
start：启动应用程序。
stop：停止应用程序。
restart：重启应用程序。
link：将当前目录作为全局模块链接到本地 npm 仓库。
unlink：取消全局链接。
adduser：添加一个用户到 npm 上。
owner：添加或删除一个包的所有者。
whoami：显示当前登录用户的信息。
view：查看包的详细信息。
search：在 npm 仓库中搜索包。
config：配置 npm。
```

```
npm install：默认情况下，它会安装 package.json 中指定的依赖项。
npm install <package>：安装特定的包。
npm install <package>@<version>：安装特定版本的包。
npm install <package> --save 或 npm install <package> -S：将包安装为项目的依赖项，并将其添加到 package.json 文件中的 dependencies 中。
npm install <package> --save-dev 或 npm install <package> -D：将包安装为项目的开发依赖项，并将其添加到 package.json 文件中的 devDependencies 中。
npm install <package> --global 或 npm install <package> -g：全局安装包，使其可以在系统上的任何地方访问。
npm install <package> --no-save：安装包，但不将其添加到 package.json 文件中。
npm install <git-host>:<git-user>/<repo-name>：安装 Git 存储库中的包。
npm install <tarball-url>：从 tarball URL 安装包。
npm install <folder>：从本地文件夹安装包。
以上一些常见的 npm install 命令后缀，实际上还有很多其他的后缀和参数，可以通过 npm help install 命令获取完整的文档。
```

```
npm：Node Package Manager，是 Node.js 的包管理器。它能够帮助开发者管理和发布自己的 Node.js 模块，也可以用于管理项目依赖包。
nvm：Node Version Manager，是 Node.js 版本管理器。它可以让你在同一台机器上安装多个 Node.js 版本，并快速切换使用不同版本的 Node.js。
cnpm：淘宝 NPM 的镜像，可以提供更快的下载速度，由于 npm 在国内下载速度慢，因此很多人都选择使用 cnpm。
pnpm：一种新型的包管理器，与 npm 类似，但使用了一些不同的方法来减少重复的模块，提高安装速度，减少硬盘空间的占用。
npx：可以让你在不安装模块的情况下执行 Node.js 脚本，它会在本地缓存中寻找并执行模块，避免了全局安装模块的麻烦。
```

