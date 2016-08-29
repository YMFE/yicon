# yicon

by implementers, for implementers

# 安装

首先安装项目依赖环境：

```bash
# phantomjs prebuild
sudo yum install gcc gcc-c++ make git openssl-devel freetype-devel fontconfig-devel
```

打开安装包，运行 `make install`。生成文件目录如下：

```
.
├── src
├── resource
│   ├── logo.png
│   └── login.js
└── config.json
```

在 config 文件需要配置的信息包括：

## cache 路径

cache 文件存放路径，其将生成如下路径：

```
.
├── origin        # 存放上传 svg 文件的源文件
└── download      # 存放待下载文件
    ├── font      # 存放待下载的字体
    ├── png       # 存放待下载的 png 
    └── svg       # 存放待下载的 svg

```

## 登录授权方式（待定）

## 数据库

数据库配置信息，包括

```js
model: {
  database: 'iconfont',    // 数据库名
  username: 'root',        // 数据库用户名
  password: '',            // 数据库密码
  dialect: 'mysql',        // 类型，保持默认 mysql
  port: '3306',            // 端口号，默认 3306
  host: '127.0.0.1',       // 数据库 host 地址
}
```

