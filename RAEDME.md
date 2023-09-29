<img src="./后端学习笔记.assets/image-20230824163546737.png" alt="image-20230824163546737" style="zoom: 67%;" />

## 一、脚手架创建一个Koa2项目

## koa-generator

**1.koa-generator快速生成koa服务的脚手架工具**

> 1.1 全局安装脚手架工具

```bash
cnpm install -g koa-generator

# or

yarn global add koa-generator
```

> 1.2 进入到项目文件夹目录,执行生成命令

```bash
# koa2+项目名
koa2 manager-server
```

如果无法使用koa2命令，说明需要配置环境变量。

- 第一种情况：window用户

  - 首先找到koa2命令文件的安装目录。因为我是通过yarn包管理器全局安装的，所以可以在C:\Users\XXX\AppData\Local\Yarn\Data\global\node_modules\.bin中找到koa2命令文件。（用npm和cnpm安装的类推）


  - 然后复制C:\Users\XXX\AppData\Local\Yarn\Data\global\node_modules\.bin，打开控制面板-->系统和安全-->高级系统设置-->环境变量，在用户变量的Path中添加新变量，值就是C:\Users\XXX\AppData\Local\Yarn\Data\global\node_modules\.bin。


  - 最后重启电脑，再次执行 koa2+项目名 生成命令就可以成功生成文件啦


- 第二种情况：mac用户
  - mac用户可直接创建软连接，指向到/usr/local/bin中，比如:ln -s /Users/Jack/.config/yarn/global/node_modules/koa generator/bin/koa2 /usr/local/bin/koa2


> 1.3 安装依赖

```
npm install
# or
cnpm install
# or
yarn
```



> 1.4 启动服务

```
yarn start   # 启动项目
yarn dev  # 热启动更新 npm run dev
# or
node .bin/www
#默认的访问地址localhost:3000/
```

**2. koa-generator创建的koa2框架目录**

```
  | --koa-server
    | --app.js       #根入口
    | --package-lock.json
    | --package.json #项目依赖包文件
    | --bin
    |   | --www 	#运行启动文件
    | --public 		#公共资源
    |   | --images
    |   | --javascripts
    |   | --stylesheets
    |   | --style.css
    | --routes
    |   | --index.js #定义了localhost: 3000 / 之下的路由
    |   | --users.js #定义了localhost: 3000 / users / 之下的路由
    | --views		 #视图Pug是一款HTML模板引擎，专门为 Node.js 平台开发;
```

### Koa常见的中间件

- koa-static处理静态资源
- koa-router 处理路由
- koa-session 保存网络请求状态
- koa-bodyparser 处理请求体
- koa-compress 压缩响应数据
- koa-logger 输出服务日志
- koa-error 处理响应错误

### Koa  [Context/上下文](Context/上下文)

#### ctx.req

Node 的 [request](https://nodejs.org/api/http.html#http_class_http_incomingmessage) 对象。

#### ctx.res

Node 的 [response](https://nodejs.org/api/http.html#http_class_http_serverresponse) 对象。

### [log4js](https://juejin.cn/post/7221445996135022653)二次封装

> log4js 输出服务日志  https://www.npmjs.com/package/log4js

​	 安装命令 `yarn add log4js -D`

```js
category: 指定默认的输出目标和日志级别。
appenders: 指定输出目标
level: 指定输出目标的日志级别

log4js.getlogger([category])
```

- **appender**  追加器

  指定日志 **输出目标**。
  其中，**type**属性指定输出目标的类型，包括：console、file、dateFile、smtp、slack等。

- **level**  日志的分级
  指定日志 **级别**。包括：trace、debug、info、warn、error和fatal

- **category**  日志的类型
  指定**输出目标和日志级别的对应关系**。也是一种日志分类，另一种日志分类的概念。
  其中，**default**属性： 指定默认的输出目标和日志级别。

### mongoDB

1. 下载Mongo数据库并安装   https://www.mongodb.com/try/download/communit
2. 配置windows环境变量
3. 配置MongoDB，即
4. bin/mongod.cfg配置文件

#### 启动mongod服务

- 以**管理员身份的 cmd 中运行**以下命令

```bash
mongod --config "C:\Program Files\MongoDB\Server\7.0\bin\mongod.cfg"
```

> 上述启动mongodb的方法操作不方便，每次启动否需要输入命令，因此我们需要建立一个永久性的服务，即在windows本地服务中注册mongodb服务，电脑启动时同时加载该服务项。不需要每次手动开启服务。

- 注册mongod服务

```bash
mongod --config "C:\Program Files\MongoDB\Server\7.0\bin\mongod.cfg" --serviceName "MongoDB" --install
```

`processManagement.windowsService.serviceName`作为 Windows 服务运行时的`mongos`服务名称。`mongod`将此名称与`net start <name>`和 `net stop <name>`操作一起使用。

> 使用`processManagement.windowsService.serviceName`必须与`--install`或`--remove`选项结合使用。

```bash
# 注册本地服务后
net start mongodb #开启MongoDB服务
net stop mongodb  #关闭MongoDB服务
```

#### 进入mongoDB环境

1. 下载并mongosh包，解压至mongodb安装路径中
2. 配置环境变量 
3. 控制台执行`mongosh`进入mongoDB环境

#### Mongo语法

- mongo 和sql映射关系

<img src="./后端学习笔记.assets/image-20230824144753577.png" alt="image-20230824144753577" style="zoom:75%;" />

- 数据库操作

<img src="./后端学习笔记.assets/image-20230824144919311.png" alt="image-20230824144919311" style="zoom:75%;" />

- 集合操作

```
				创建集合 				 db.createCollection()
				查看集合   		  		 show collections
				删除集合   				 db.collections.drop()
```

- 文档操作

<img src="./后端学习笔记.assets/image-20230824145102767.png" alt="image-20230824145102767" style="zoom:75%;" />

```
				更新单个文档   		  	db.collection.updateOne()
				更新多个文档  			db.collection.updateMany()
```

- 条件操作

<img src="./后端学习笔记.assets/image-20230824145202753.png" alt="image-20230824145202753" style="zoom:75%;" />

#### nodejs使用mongoDB

- 1. 连接数据库 db.js

```js
const mongoose = require('mongoose');

// 定义数据库连接的地址 及配置信息
mongoose.connect(mongodb://127.0.0.1:27017/manager, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 1000
});

const db = mongoose.connection;//

db.on('error', () => {
    console.log('***数据库连接失败***');
});

db.on('open', () => {
    console.log('***数据库连接成功***');
});
```

- 2. 创建表  userSchema.js

```js
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: String
});

export default mongoose.model('User', userSchema);
```

- 3. 操作表

```js  
require('db.js') ;//注意：操作表时必须导入db.js 连接数据库
//增删改查 
const UserModel = require('./userSchema.js');
const res = await UserModel.findOne({id:2})
```





### 分页结构封装

skipIndex:跳过该索引。mongoDB的第一个索引为1.

```js
module.exports = {
    pager({ pageNum = 1, pageSize = 10 }) {
        pageNum *= 1;
        pageSize *= 1;
        const skipIndex = (pageNum - 1) * pageSize;
        return {
            page: {
                pageNum,
                pageSize
            },
            skipIndex
        };
    },
    sucess(data = '', msg = '', code = CODE.SUCESS) {
        log4js.debug(data);
        return { code, data, msg };
    },
    fail(msg = '', code = CODE.BUSINESS_ERROR) {
        log4js.debug(msg);
        return { code, data, msg };
    }
};
```

### 解析request.body的数据

request.body

1. 使用中间件 `bodyparser` / `koa-body`  

   *注意：中间件必须在注册路由之前使用*

2. 使用 封装的parseRequestBody()函数

```js
function parseRequestBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', () => {
      // 根据请求头的 Content-Type 判断数据格式
      if (req.headers['content-type'] === 'application/json') {
        // 解析 JSON 格式数据
        try {
          resolve(JSON.parse(data));
        } catch (error) {
          reject(error);
        }
      } else if (req.headers['content-type'] === 'application/x-www-form-urlencoded') {
        // 解析 URL 编码格式数据
        const parsedData = {};
        const keyValuePairs = data.split('&');
        for (const pair of keyValuePairs) {
          const [key, value] = pair.split('=');
          parsedData[key] = decodeURIComponent(value);
        }
        resolve(parsedData);
      } else {
        reject(new Error('Unsupported content type'));
      }
    });
    req.on('error', (error) => {
      reject(error);
    });
  });
}
```

### JWT

#### 使用方式

1. /api?token=xxx
2. cookie写入token
3. storage写入token，请求拦截中在请求头添加: `Authorization: Bearer <token>`

#### koa-jwt中间件

基于jsonwebtoken的实现的。用于请求拦截中，通过密钥解析并验证token。

#### [koa+jwt实现token验证与刷新](https://segmentfault.com/a/1190000019338195)

## **项目遇到的细节**：

1. ### token 验证过滤 注册/登录接口

新用户注册 / 用户注册新的账号 时，要么没有token,要么有一个旧帐号的token。此时，token认证必然失败。因此需要在请求拦截中过滤掉 login接口，不进行token验证。
新用户或者老用户登录时，服务器会直接生成新的token 发送给客户端。

2. ### 查询数据返回指定的字段

```js
//1. 指定字段名
UserModel.findOne(requestDate, "userId userName userEmail state role deptId roleList")
//2. 字段名=1表示需要该字段， 字段名=0表示筛选掉该字段
UserModel.findOne(requestDate,{userId:1,_id:0})
//3.select('userId')函数进行筛选
UserModel.findOne(requestDate).select('userId')
```

3. ### 解决token为空，axios请求拦截问题

```js
const { token = "" } = storage.getItem('userInfo') || {};
```

路由守卫：判断即将进入的页面是否需要token。不需要：next()放行，展示页面； 需要：从本地获取token配置token到请求头中【请求拦截器】。

```js
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  // 目标路由不是登录页，并且还需要token验证，还没有token，那就直接给返回到登录页
  if (to.name !== 'Login'&& to.meta.authRequired && !token){
      next({ name: 'Login' })
  }else{
      // 目标路由是登录页-自然不需要token验证
      // 或目标路由不需要身份验证
      // 又或目标路由非登录页，需要token验证，但是有token
      // next放行
      next()
  }
})
```



### [Koa Cookie 的设置与获取](https://cloud.tencent.com/developer/article/1618525)

```js
const router = require('koa-router')()

router.get('/', async (ctx, next) => {
  ctx.cookies.set('mycookie', Math.random())
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

module.exports = router
```

```js
const router = require('koa-router')()

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json',
    cookie: ctx.cookies.get('mycookie')
  }
})

module.exports = router
```

### [koa session的设置](https://segmentfault.com/a/1190000016707043#item-4)

```js
// Koa 中使用 session
const Koa = require("koa");
const Router = require("koa-router");
const session = requier("koa-session");
const uuid = require("uuid/v1");

// 创建服务和路由
const app = new Koa();
const router = new Router();

// cookie 的签名
app.keys = ["panda"];

// 使用 koa-session 中间件
app.use(session({
    key: "shen",
    maxAge: 10 * 1000
}, app));

router.get('/', (ctx, next) => {

  let userId = ctx.cookies.get("sid");

  if (ctx.session[userId]) {
    ctx.session[userId].studyCount--;
  } else {
    userId = uuid();
    ctx.session[userId] = { studyCount: 30 };
    ctx.cookies.set('sid', userId);
  }

  ctx.body = `
  userID=${userId},
  the rest of studyCount:${ctx.session[userId].studyCount}
  `;

});

// 使用路由
app.use(router.routes());
app.listen(3000);
```

## mongoose

mongoose是一个使用**nodeJS**来**操作mongoDB数据库**的开源库。mongoose里面封装了连接数据库、创建collection和document CRUD的操作。

> mongoose官方文档 https://mongoosejs.com/docs/index.html

### 1. 安装

`npm install mongoose --save`

### 2.  连接数据库

```js
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/test',
            {useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection;
db.on('open', function() {
  // 数据库连接成功的回调函数
});

```

### 3. Schema 

Schema，与mongoDB中的**collection**相对应，并且定义了collection中每一个document的数据结构。

```js
import mongoose from 'mongoose';
const { Schema } = mongoose;

const blogSchema = new Schema({
    title:  String, // String is shorthand for {type: String}
    author: String,
    body:   String,
    comments: [{ body: String, date: Date }],
    date: { type: Date, default: Date.now },
    hidden: Boolean,
    meta: {
      votes: Number,
      favs:  Number
    }
});
```

### 4. Model

model, 与MongoDB中的document相对应。一个model的实例就是一个document。因此，mongoDB数据库中数据的增删改查在mongoose中都是利用`Model`来进行的。

```js
// 调用mongoose.model()方法，生成model实例=>document
const Blog = mongoose.model('Blog',blogSchema)
```

- 返回对象类型

```js
//有 await 返回数据类型为 Promise对象
const res = await User.updateMany(params, { state: 2 });

// 无 await 返回数据类型为 Query
const res2 = User.updateMany({ userId: { $in: userIds } }, { state: 2 });

```

### 硬删除与软删除

- 硬删除

Mdel.findOneAndeRemove()  、Model.deleteMany()

- 软删除

Model.updateMany()

### mongoose实现mongodb的自增字段

1. **需求**：

   实现任意指定字段作为自增字段， 类似于oracle的sequence

2. **实现思想**：

   新建一个Counter的Schema用来专门记录sequence的增长情况。之后每次保存新数据之前都要去查询Counter的sequence， 将查询的sequence使用$inc加1后返回赋值给要自增的字段， 最后保存数据。

3. ## 实例

```js
const CounterSchema = db.mongoose.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 }
});

const Counter = db.mongoose.model('counter', CounterSchema);


//使用
const doc = await Counter.findOneAndUpdate( { _id: 'userId' }, { $inc: { seq: 1 } }, { new: true, upsert: true})
```

### 常用语法

1. User.findOne() // 查询一条数据
2. User.find() // 查询所有符合条件的数据
3. User.find().skip().limit() // 专门用于数据分页
4. User.countDocuments({}) // 统计总数量
5. User.updateMany() // 更新用户信息
6. { userId: { $in: [100001,100002] } // 判断userId在[100001,100002]中间
7. { $or: [{ userName:‘jack’ }, { userEmail:‘jack@imooc.com’ }] } // 或 条件判断
8. { $inc: { sequence_value: 1 } // 更新值 +1

### 返回字段的四种方式

1. ‘userId userName userEmail state role deptId roleList’
2. { userId:1,_id:0 }
3. select(‘userId’)
4. select({ userId:1,_id:0 })

## 菜单管理接口

### 接口调用

菜单列表：/menu/list
菜单创建/编辑/删除：/menu/operate

### mongoose相关

1根据ID查找并更新
`Menu. findByIdAndUpdate(_id, params)`

2根据ID查找并删除
`Menu. findByIdAndRemove(_id)`

3.查找表中parentld包含[id]的数据，并批量删除
`Menu. deleteMany({ parentId: { $all: [_id] } })`

4： $all $in区别：
`$all`指的是表中某一列包含[id]的数据，例如：parentld:[1,3,5]包含[3]
`$in`指的是表中某一列在[id]这个数组中，例如：_id:3在[1,3,5]中

```js
// 递归拼接树形列表（形成父子关系）
function getTreeMenu(menuList, id, list) {
  for (let i = 0; i < menuList.length; i++) {
    const element = menuList[i];
      //mongodb自动生成的_id属性是Buffer类的，需要转换成字符串
    if (String(element.parentId.slice().pop()) === String(id)) {
      list.push(element._doc);//menuList是mongodb返回数据，包含它提供的其他字段。我们需要的字段在_doc属性中
    }
  }
  list.map((element) => {
    element.children = [];
    getTreeMenu(menuList, element._id, element.children);
    if (element.children.length == 0) {
      // 删除元素无children的children属性
      delete element.children;
      // 筛选出有children的二级菜单
    } else if (element.children.length > 0 && element.children[0].menuType == 2) {
      // 给二级菜单加action属性，用于快速区分按钮和菜单
      element.action = element.children;
    }
  });
  return list;
}

const treeList = getTreeMenu(menuList, null, []);

```

## 角色管理

### 接口调用:

角色列表: /roles/list
菜单列表: /menu/list
角色操作: /roles/operate
权限设置: /roles/update/permission
所有角色列表: /roles/allList

### 注意事项

1.分页参数{ ...this.queryForm,..this .pager,]
2.角色列表展示菜单权限，递归调用actionMap
3.角色编辑 nextTick
4.理解权限设置中 checkedKeys 和 halfcheckedKeys

## 原生Node.js

### 简单部署web服务器

#### 1. 开始搭建Http服务器

- require加载模块
- 监听端口号和网址, 端口号不能使用已经占用的端口比如（80），每个服务器相当于一个app，都需要端口，才能找到入口

```js
//创建HTTP服务器

//1. 加载http模块
var http = require('http');

//2. 创建http服务器
// 参数: 请求的回调, 当有人访问服务器的时候,就会自动调用回调函数
var server = http.createServer(function (request, response) {
    console.log('有人访问了服务器')

    //回调数据
    response.write('Hello, My Love')
    response.end()
})

//3. 绑定端口,启动服务
server.listen(3030,() => {
    console.log('服务器启动成功：http://localhost:3000')
})
```

- http.Server 类
  http.Server继承<net.Server>, net.Server继承<EventEmitter>
  http.Server 类身上有一些事件和方法，如`'request'`事件，`server.listen()`方法
- http.**createServer**

`http.createServer([options][, requestListener]))`可以接收一个回调函数，返回一个`http.Server`的实例对象。`requestListener`是一个自动添加到事件中的函数[`'request'`](https://nodejs.org/api/http.html#event-request)。

- requestListener回调函数的参数
  - request 对象：表示 HTTP 请求对象，里面**包含了客户端本次请求携带的信息**
  - response 对象：表示 HTTP 响应对象，用于**向客户端设置响应的信息**

```js
//监听服务端的"request"事件(客户端的请求事件)
//() => void:客户端发来的请求
//request:请求的所有信息
//response:响应的所有信息
server.on("request", (request, response) => {
    //响应客户端
    response.write('aaaaa')
    //断开服务
    response.end()
});
```

- emitter.on(eventName, listener)
  `emitter.on(eventName, listener)`接收一个事件名称和一个回调函数。而`server = http.Server`是继承<EventEmitter>类

#### 2. 开始运行服务器

- 打开终端，执行`node  app.js`。`app.js`为文件名

### [Request对象](https://juejin.cn/post/7195417649155670074)

HTTP 协议是**基于请求-响应模型的协议**，在 HTTP2 以前，必须是客户端发起请求，服务器接收请求，再将处理的结果响应给客户端。

客户端在向服务器发送 HTTP 请求时，需要指定一个具体的 URL 和 HTTP 方法。通常还会携带一些信息，这些信息可以放在 URL 中，或者放在 HTTP Header中，如果是向服务器提交数据，还可以放在 HTTP 报文实体中。

Request对象包含的信息：

#### Method / 请求方法

HTTP 方法常用的有 `Get`，`Head`，`Post`，`Put`，`Delete` 等等，可以直接使用 `request.method` 来获取。

URL /  请求的资源的URL   统一资源定位符（Uniform Resource Locator）

```js
const urlObj = url.parse(request.url)
console.log(urlObj)
```

![image-20230201174634299](./后端学习笔记.assets/149a6190829a491fbd13b51063a22397tplv-k3u1fbpfcp-zoom-in-crop-mark1512000.webp)

#### Query / 请求的资源路径和查询参数

#### Header /请求头信息

- host：此次请求到主机名。用于虚拟主机设置。
- connection：控制网络连接的断开。
- HTTP/1.1 默认为 `keep-alive`，表示长连接。
- cache-control：设置强缓存。
- accept：客户端可接收的内容的类型。
- accept-encoding：客户端可用的内容编码方式——通常是某种压缩算法。

```js
console.log(request.headers);
```

![image-20230201183255363](./后端学习笔记.assets/facfa869124d4ae09f4c159bf3c155d3tplv-k3u1fbpfcp-zoom-in-crop-mark1512000.webp)

像是 `sec-ch-ua`、`sec-ch-ua-mobile` 这种以 `sec-` 为前缀的请求头，表示禁止使用代码修改的 HTTP 消息头，用户代理保留全部对它们的控制权。比如我们熟悉的 **`User-Agent`**，通常后端会根据它来判断用户的系统和平台，但是它很容易就被修改进行伪装，因此是不安全的。通过 **`sec-ch-ua`** 就能安全的将用户代理信息传给服务器。

#### Body /请求体数据

HTTP 报文分为**请求报文**和**响应报文**。报文由这三部分构成：

- **起始行**：分为请求行，状态行。
- **首部**：描述请求相关的信息，也会描述实体数据的信息。
- **实体**：携带的数据。

**有的请求，比如文件上传，表单提交，要携带一些数据，这些数据就是放在报文的实体中传输的。**

HTTP 请求只管发送数据，而不管数据是何类型。所以会在请求头中通过 `Content-Type` 来告知服务器，此次请求所携带的数据是什么格式的。`request` 对象将接收到的实体中的数据，都放在 `requst.body` 中。根据这两点，就可以解析出客户端所传的数据。

```js
const http = require('http');
const url = require('url');
​
const server = http.createServer((request, response) => {
    const method = request.method;
    const { pathname } = url.parse(request.url);
​
    // 处理 Post /user/login
    if(method === 'POST' && pathname === '/user/login') {
​
        let arr = [];
        const contentType = request.headers['content-type']
        if (contentType === 'application/json') {
            // 监听 data 事件，读取实体数据
            request.on('data', (data) => {
                console.log(data)
                arr.push(data)
            })
​
            // 监听 end 事件，处理数据
            request.on('end', () => {
                console.log('传输完毕')
                let json = JSON.parse(Buffer.concat(arr).toString())
                console.log(json)
            })
            // 结束响应
            response.end('Hello, World');
        }
    }
});
​
server.listen(3000, () => {
    console.log('服务器启动成功：http://localhost:3000')
})
```

### [Responese对象](https://juejin.cn/post/7195770700106596412)

Request对象：
设置状态码，响应头和响应给客户端的内容。设置状态码，响应头和响应给客户端的内容。

#### 设置状态码

```js
//设置状态码    
response.statusCode = 404;
// Or
response.writeHead(404);

//设置状态码 信息/短语
response.statusMessage = 'Not Found!'
// Or
response.writeHead(404, 'Not Found!');
```

#### 设置响应头

使用 `response.setHeader` 或者 `response.writeHead` ：

```js
// 设置自定义的响应头
response.setHeader('username', 'Kunwu');
​
// 设置 Content-Type
response.setHeader('Content-Type', 'application/json')
​
// 或者
response.writeHead(200, {
    'Content-Type': 'application/json'
})
response.end(JSON.stringify({ username: 'Kunwu' }));
```

#### 设置响应内容

`response` 对象是一个可写流，当可写流不关闭时, 客户端发起请求，服务器没有结束响应，客户端将会一直处于等待状态。

> 一定要注意的是，每次请求，都一定要调用 `response.end` 来结束响应。

### cookie的设置和获取

- cookie的设置

```js
var http = require('http');
var fs = require('fs');

http.createServer(function(req, res) {
    res.setHeader('status', '200 OK');
    res.setHeader('Set-Cookie', 'isVisit=true;domain=.yourdomain.com;path=/;max-age=1000');
    res.write('Hello World');
    res.end();
}).listen(8888);

console.log('running localhost:8888')
```

- cookie的获取

在处理请求的回调函数中，可以通过 `req.headers.cookie` 获取请求头中的 `cookie` 字符串

### session的设置

- 1.服务器端设置

例子：一个新用户默认有 `30` 次学习机会，以后每次访问服务器学习次数减 `1`，如果 `studyCount` 值为 `0`，则提示学习次数用完，否则提示当前用户的 `ID` 和剩余学习次数，`session` 中存储的是每一个用户 `ID` 对应的剩余学习次数，这样就不会轻易的被修改学习剩余次数，因为服务器只认用户 `ID`，再通过 `ID` 去更改对应的剩余次数（当然忽略了别人冒充这个 `ID` 的情况，只能减，不能加），这样就不会因为篡改 `cookie` 而篡改用户存在 `session` 中的数据，除非连整个数据库都拖走。

```js
// 原生中使用 session
const http = require("http");
const { v1: uuid } = require('uuid'); // 生成随字符串
const querystring = require("querystring");

//正常 session 是存放在数据库中的，我们这里为了方便就用一个名为 session 的对象来代替
// 存放 session
const session = {};

// 创建服务
http.createServer((req, res) => {
    if (req.url === "/user") {
        // 取出 cookie 存储的用户 ID
        let userId = querystring.parse(req.headers["cookie"], "; ")["study"];

        if (userId) {
            if (session[userId].studyCount === 0) {
                res.end("studyCount = 0");//如果服务器端没有数据返回到客户端，就可以用 res.end终结响应处理流程 
            }
            session[userId].studyCount--;
        } else {
            // 生成 userId
            userId = uuid();

            // 将用户信息存入 session
            session[userId] = { studyCount: 30 };

            // 设置 cookie
            res.setHeader("Set-Cookie", [`study=${userId}`]);
        }

        // 响应信息
        res.end(`
            user ID : ${userId}，
            rest studyCount : ${session[userId].studyCount}
        `);
    } else {
        res.end("Not Found");
    }
}).listen(3000);
```

- 2.客户端设置

```js
let xhr = new XMLHttpRequest();
xhr.open("POST", "http://127.0.0.1:3000/user", true);
xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
xhr.withCredentials = true; // 跨域携带 cookie
//CORS请求默认不发送Cookie和HTTP认证信息。如果要把Cookie发到服务器，一方面要服务器同意，指定`Access-Control-Allow-Credentials`字段。
```

