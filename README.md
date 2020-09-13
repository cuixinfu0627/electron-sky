# electron-quick-start


** 正常操作网址：https://www.jianshu.com/p/a8a7820c8bfd **
** 特殊操作网址：https://www.jianshu.com/p/b60fe36cbe84 **

- `package.json` - Points to the app's main file and lists its details and dependencies.
- `main.js` - Starts the app and creates a browser window to render HTML. This is the app's **main process**.
- `index.html` - A web page to render. This is the app's **renderer process**.

## 使用方法：
```bash
cd electron-sky
# Install dependencies
npm install
# Run the app
npm start
# package the app
electron-packager . app --win --out presenterTool --arch=x64 --electron-version 10.1.1  --icon=favicon.ico --overwrite --ignore=node_modules
```

## 打包：

```bash
  还在这个目录里直接执行 electron-packager . app --win --out presenterTool --arch=x64 --electron-version 1.0.0 --overwrite --ignore=node_modules
  它的意思是
  electron-packager . 可执行文件的文件名 --win --out 打包成的文件夹名 --arch=x64位还是32位 --electron-version版本号 --overwrite --ignore=node_modules（网上很多写法是--version 1.0.0 在高版本中的electron中，这个好像不行啦，必须要--electron-version这样写）
  或者：
  electron-packager . app --win --out presenterTool --arch=x64 --electron-version 10.1.1 --icon=favicon.ico --overwrite --ignore=node_modules
```
