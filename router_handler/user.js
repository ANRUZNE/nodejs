//导入数据库操作模块
const db=require('../db/index')
//导入bcryptjs这个包
const bcrypt =require('bcryptjs')
//导入生成token的包
const jwt=require('jsonwebtoken')
const config=require('../config')

//注册的处理函数
exports.regUser=(req,res) => {
    const userinfo =req.body
    // if(!userinfo.username||!userinfo.password){
    //     return res.send({status:1,message:'用户名或密码不合法'})
    // }
    //定义SQL语句，查询用户名是否被调用
    const sqlStr='select username from ev_users where username=?'
    db.query(sqlStr,userinfo.username,(err,results) => {
        if(err){
            //return res.send({status:1,message:err.message})
            return res.cc(err)
        }
        if(results.length>0){
            //return res.send({status:1,message:'用户名已经被占用'})
            return res.cc('用户名已经被占用')
        }
        //调用bcrypt.hashSync()对密码进行加密
        userinfo.password=bcrypt.hashSync(userinfo.password,10)
        
        //定义插入新用户的sql语句
        const sql='insert into ev_users set ?'
        db.query(sql,{username:userinfo.username,password:userinfo.password},(err,results) => {
            //if(err) return res.send({status:1,message:err.message})
            if(err) return res.cc(err)
            //if(results.affectedRows!==1) return res.send({status:1,message:'注册用户失败，请稍后再试'})
            if(results.affectedRows!==1) return res.cc('注册用户失败，请稍后再试')
            //res.send({status:0,message:'注册成功'})
            res.send('注册成功',0)
        })
    })
    
}


//登陆的处理函数
exports.login=(req,res) => {
    const userinfo=req.body
    const sql='select * from ev_users where username = ?'
    db.query(sql,userinfo.username,(err,results) => {
        if(err) return res.cc(err)
        if(results.length!==1) return res.cc("登录失败")
        //console.log(results)
        //判断密码
        // bcrypt.compare(userinfo.password,results[0].password,(err,results) => {
        //     if(!results) return res.cc('登录失败')
            
        //     if(results) return res.send('login OK1')
        // })
        const compareResult =bcrypt.compareSync(userinfo.password,results[0].password)
        if(!compareResult){
            return res.cc('登录失败')
        }

        //在服务器端生成Token的字符串
        const user={...results[0],password:'',user_pic:''}
        const tokenStr=jwt.sign(user,config.jwtSecretKey,{expiresIn:config.expiresIn})
        
        res.send({
            status:0,
            message:'登录成功！',
            token:'Bearer '+tokenStr
        })
    })
    
    
    
}