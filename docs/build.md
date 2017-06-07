# YIcon Builder - init

如果希望在自己的服务器上搭建字体站，可以遵照如下的方式，一步一步进行部署即可。

## 环境要求

系统要求：

- Linux/Unix

环境要求：

- node 4.x+
- npm 3.x
- mysql 5.5+
- fontconfig lib

npm 应该升级到 3.x，升级方式为：

```
$ sudo npm install -g npm@3 --registry=https://registry.npm.taobao.org
```

应该提前配置好 mysql 的服务，创建一个用户及其登录密码（可参考[这篇文章](http://www.cyberciti.biz/faq/mysql-change-root-password/)），并在里面创建一个 `utf-8` 编码的数据库。数据库名字、用户名、密码应和下面配置项中的名字保持一致。

下载图标 png 图片依赖 fontconfig，安装方式：

CentOS
```
$ yum install fontconfig
```

Ubuntu
```
$ apt-get install fontconfig
```
OS
```
$ sudo brew install fontconfig
```
其他系统请自行 Google 解决。

## 初始安装

安装构建工具 [yicon builder](https://github.com/YMFE/yicon-builder)，运行命令：

```bash
$ npm install yicon-builder -g
```

安装完成之后，会在拥有一个 `yicon` 的命令。运行 `yicon init`，可以按照提示进行安装：

### 提示：输入安装路径

这个是项目的安装路径，安装时会生成如下的目录结构：

```
├── config.json
├── logs
└── src
```

### 提示：输入数据库配置项

这里是连接数据库的必备选项，包含以下内容：

1. 数据库域名，即数据库服务的域，如果配置在本地就填写默认 `127.0.0.1`；
2. 数据库用户名，即登录数据库的默认用户，默认为 `root`；
3. 数据库密码，必须按照上文所述，给数据库设定一个密码，默认为 `123456`；
4. 数据库端口号，默认 `3306`；
5. 数据库名称，必须在设置之前创建并指定一个特定的数据库，推荐为默认值 `iconfont`；

配置完成后将生成配置文件，并尝试连接数据库，如果连接期间存在问题，将无法自动导入数据表，安装程序会将创建数据表的 sql 文件置入安装路径中，需要稍后手动导入。

### 提示：选择登陆类型

由于本应用没有接入第三方登录，因此依赖内部系统的 cas、sso 或 ldap 等三种登录模式。应用只需要提供相关 url 即可。

选择 cas 或 sso 时，在生成的配置文件中，我们会看到如下配置：

```javascript
{
    "login": {
        "ssoType": "cas",
        "authUrl": "http://cas.example.com/cas/login?service={{service}}",
        "tokenUrl": "http://cas.example.com/serviceValidate?service={{service}}&ticket={{token}}",
        "serviceUrl": "http://app.iconfont.com",
        "adminList": []
    }
}
```
这里面的配置项含义如下：

- `ssoType`: 根据用户输入自动生成登录类型，会分别按照 cas 和 sso 的规则进行登录；
- `authUrl`: 指点击登录按钮时需要跳转的 url，通常是一个登录页面，用户在这个页面登录后，会给服务端返回一个 token；
- `tokenUrl`: 服务端在获取 token 之后，可以通过这个 url 来获取用户的详细信息；
- `serviceUrl`: 通常这两种服务都需要提供当前域名，这里可以配置 iconfont 字体站服务的域名；
- `adminList`: 字符串格式的数组，里面可以写入超管的用户名，用于配置超管，如 `['minghao.yu']`。

url 中的 `{{xxx}}` 格式表示占位符，其中 `{{service}}` 会被替换成 `serviceUrl`，`{{token}}` 会被替换成获取的 token。

选择 ldap 时，在生成的配置文件中，我们会看到如下配置：

```javascript
{
    "login": {
        "ssoType": "ldap",
        "server": "ldap://127.0.0.1:1389",
        "bindDn": "cn=root",
        "baseDn": "test",
        "bindPassword": "secret",
        "searchDn": "cn=root"
    }
}
```

### source 配置
该项配置只支持默认配置，且功能默认不开启，如需在图标项目中接入同步 source 功能，请手动修改 `config.json` 配置项，并自行提供上传服务，接口文档详见[source 接口](http://mytest.qunar.com/_docs/source.html)

```javascript
{
    "source": {
        "support": false,
        "infoUrl": "",
        "versionUrl": "",
        "sourceUrl": "",
        "cdn": ""
    }
}
```
这里面的配置项含义如下：

- `support`: 在图标项目中是否开启“同步 source”功能，默认为 false，不开启；
- `infoUrl`: 查询项目的 source 信息的 url，用于在配置上传路径时，检查配置的路径是否存在；
- `versionUrl`: 获取项目 source 上最高版本的 url，用于跟 yicon 平台上对应项目的版本进行对比，版本一致时，不允许上传，不一致时，上传并生成新的版本（基于 yicon 平台对应项目最高版本和 source 最高版本）；
- `sourceUrl`: yicon 平台将需要上传的字体文件通过 post 请求发送到该 url，通过该接口将接收到的字体文件上传到 source 服务；
- `cdn`: source（cdn）服务地址，用于字体文件同步到 source 成功后生成的引用地址。

**注：** 因为各个公司的 source 平台不一致，所以无法提供统一的上传服务，需要接入方根据自身 source 平台和接口文档自行实现上传服务

## 依赖安装

初始安装成功后，会提示需要进入到安装路径的 src 路径下执行 `npm install` 进行依赖安装，目前只提供淘宝源，如果有自己指定的源，可以选择 `3) other`，然后手动输入源（如输入 `http://registry.npm.xxx.org`）。

## 项目编译

安装依赖完成之后，会在 `/src` 目录下执行 `npm run build` 进行静态资源编译；如果编译出错，可以去项目路径中手动执行 `npm run build` 编译。

## 项目启动

依赖安装完成后，进入到安装路径的 src 路径下执行 `./start.sh` 进行项目启动，或者自行选择使用 pm2 等工具进行启动。

## init 命令行详情
通过 `ykit init -h` 可以查看该指令的参数

```
$ yicon init -h

  Options:
    -d, --default             # 默认配置
    -b, --branch <branch>     # 指定 yicon 初始化分支或 tag
    -h, --help                # output usage information
```

**Tips**

- 更换 Logo，请替换 `src/static/images/Yicon_logo.svg`。
