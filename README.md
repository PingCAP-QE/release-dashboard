# Release Dashboard

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `yarn build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

### basic category below
```
├── README.md
├── package.json                # 依赖配置文件
├── yarn.lock                   # 包管理器，有比配置在package.json中的依赖列表更多的信息，Yarn需要准确存储每个安装的依赖是哪个版本。
├── .gitignore
├── [floder_name]               # 根目录下可以建立其他文件夹，但不会被用在生产环境中
└── public/                     # 只有 public 下的文件才能被 public/index.html 使用
    ├── favicon.ico             # 浏览器网页tab上的图案
    ├── index.html              # public/index.html 页面模板
    ├── manifest.json           # 是渐进式Web应用将自身添加至桌面的功能依赖文件，也可以对图标、名称等信息进行配置。
└── src                         # 只有 src 下的文件才会被 Webpack 处理
    ├── index.css
    ├── index.js                # JavaScript 打包入口文件
    ├── routes.js               # Url路由,与index.js配合可进行页面跳转 (yarn add react-router-dom, import Route)
    ├── logo.svg                # react的logo，在create-react-app时展示在前端的
    ├── reportWebVitals.js      # 提供前端性能指标，可通过浏览器插件直接获取指标数据
    └── layout/                 # 工程的通用页面布局Layout,方便快速引用
    └── pages/                  # 工程的页面js文件,在routes.js中被快速引用,快速跳转页面
    └── components/             # 工程的通用js组件,在pages/中被使用 (yarn add axios, for remote procedure call)
    └── config.js               # 工程的配置文件, 格式参考: config_example.js 进行配置即可
```