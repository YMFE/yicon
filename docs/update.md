# YIcon Builder - update

## 升级准备

+ 在进行升级前请先 **备份数据**，这是最重要的一点。
+ 检查数据表结构是否正确，升级到 1.1.0 版本时，必须在 icons 表中添加 `description` 字段，projects 表添加 `source` 字段
  - `description` 字段

    ```sql
      ALTER TABLE icons ADD description varchar(5000) default NULL;
    ```
  - `source` 字段

    ```sql
      ALTER TABLE projects ADD source varchar(255) default Null;
    ```

## 项目更新

在项目目录（一般是在第一层 src 目录下）下运行

```
$ yicon update
```
### 提示：输入当前版本号

默认读取 package.json 文件中的 version 字段，但因为 v1.0.2 及之前的版本，package.json 中的 version 和实际版本不匹配，所以需要手动输入下正确版本

### 升级预处理

yicon 构建工具自动进行预处理：
+ 将本地代码进行打包压缩，存储到 `/backups` 目录下，方便代码回滚
+ 根据输入的版本号，进行本地代码，GitHub 上对应版本号的代码和最新的版本的代码进行 diff，提示用户本地代码与最新版本的代码间是否存在冲突，如果存在冲突，直接进行提示，针对不冲突、可以直接替换的文件，直接提示

### 提示：是否对上述文件进行替换

无论在预处理过程中，是否存在冲突，都可以针对可以直接替换的文件，进行直接替换

## 安装依赖

与部署类似，在升级过程中，可能安装或卸载了部分模块，所以需要重新进行 install

## 项目编译

与部署类似，安装依赖完成之后，会在 `/src` 目录下执行 `npm run build` 进行静态资源编译；如果编译出错，可以去项目路径中手动执行 `npm run build` 编译。

## 最后

如果在升级预处理过程中，没有冲突的文件，同时在上述过程中的所有操作都成功完成，则可以执行 `./start.sh` 进行项目启动，或者自行选择使用 pm2 等工具进行启动；如果存在冲突，则需要先手动修改冲突的文件并检查无误后，再进行项目启动。
