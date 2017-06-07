## 查询项目的 source 信息
**GET** `/upload/project/:project/user/:user`

```json
{
    "ret": true,
    "data": "success"
}
```

## 查询对应项目在 source 中的最高版本
**GET** `/upload/version/project/:project/branch/:branch/path/:path`

```json
{
    "ret": true,
    "data": {
        "version": "1.0.0"
    }
}
```

## 上传图标到 source
**POST** `/upload/project`
+ req:

  ```json
  {
      "username": "changquan.fang",
      "project": "demo",
      "path": "fonts/",
      "branch": "master",
      "version": "0.1.11"
  }
  ```
+ res:

  ```json
  {
      "ret": true,
      "data": {
          "sourceUrl": "xxx/xxx/fonts/"
      }
  }
  sourceUrl 表述上传 source 后生成的路径信息
  ```
