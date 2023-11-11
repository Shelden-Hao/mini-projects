// 导入 jsonwebtoken
const jwt = require('jsonwebtoken');

// 创建 token
const token = jwt.sign({
   username: 'zhangsan',
}, 'secret', { expiresIn: 60 
})

// 解析 token
jwt.verify(token, 'secret', (err, data) => {
   if(err) {
      console.log('token 解析失败')
      return
   } else {
      console.log(data)
   }
})