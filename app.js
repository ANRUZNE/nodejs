const express=require('express')
const cors=require('cors')
const userRouter=require('./router/user')
const userinfoRouter=require('./router/userinfo')
const joi=require('joi')

const app=express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:false}))
//一定要在路由之前，封装res.cc函数
app.use((req,res,next) => {
    res.cc=function(err,status=1){
        res.send({
            status,
            message:err instanceof Error?err.message:err,
        })
    }
    next()
})

//一定要在路由之前配置解析Token的中间件
const {expressjwt: expressJWT}=require('express-jwt')
const config=require('./config')
app.use(expressJWT({secret:config.jwtSecretKey,algorithms:['HS256']}).unless({path:[/^\/api\//]}))


app.use('/api',userRouter)
app.use('/my',userinfoRouter)

//定义错误级别的中间件
app.use((err,req,res,next) => {
    //验证失败导致的错误
    if(err instanceof joi.ValidationError) return res.cc(err)
    //身份认证失败后的错误
    if(err.name==='UnauthorizedError') return res.cc('身份认证失败！')
    //未知的错误
    res.cc(err)
})

app.listen(80,function(){
    console.log('api serve running at http://127.0.0.1');
})
