cd 进入根目录

cd .ssh 进入 ssh 目录

ssh-keygen -t rsa -b 4096 生成 ssh 密钥  -t 指定协议为 rsa -b 指定生成的大小为 4096 回车

如果是第一次使用这个命令直接回车会在更目录生成 id——ras 的文件如果有这个文件需要生成信的文件名字

进入 cat ~/.ssh/id_rsa.pub 拿到公钥添加到仓库 settiong 的 ssh 配置上就可以克隆仓库了