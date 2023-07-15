const express =require('express')
const router=express.Router()
const userinfo_handler=require('../router_handler/userinfo')
const expressJoi =require('@escook/express-joi')
const {update_userinfo_schema,update_password_scheam,updatae_avatar_schema}=require('../schema/user')



router.get('/userinfo',userinfo_handler.getUserInfo)

router.post('/userinfo',expressJoi(update_userinfo_schema),userinfo_handler.updateUserInfo)

router.post('/updatepwd',expressJoi(update_password_scheam),userinfo_handler.updatePassword)

router.post('/update/avatar',expressJoi(updatae_avatar_schema),userinfo_handler.updateAvatar)

module.exports=router