# fis3-rosetta-plugin-package

Rosetta v1.0.2以上版本的smarty局刷项目配置固化

使用此插件后配置可以简化为：

```
fis.require('rosetta-plugin-package')(fis, true, {
    name: 'testname',
    deploy: fis.plugin('http-push', {
        receiver: 'http://ieva.baidu.com/receiver.php',
        to: '/home/work/orp/template/xxxxx' // 注意这个是指的是测试机器的路径，而非本地机器，实际开发需修改
    })
});
```


目前只放开模块名和调试发布路径的配置。

调试使用
```
  fis3 release debug
```

发布使用
```
  fis3 release production
```
