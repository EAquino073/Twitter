'use strict'

var Login = require("../models/login")

function followUser(user, req, res){
    var id = req.user.sub
    var usuarioNm = req.user.usuario

    Login.findById(id,(err, valido)=>{
        if(err) return res.status(500).send({message: 'Error en la peticion del usuario'})
        if(!valido) return res.status(404).send({message: 'Error en el usuario logeado'})
        if(valido){
            Login.findOne({usuario:{$in:user}},(err, usuariofw)=>{
                if(err) return res.status(500).send({message: 'Error en la peticion del usuario que desea seguir'})
                if(!usuariofw){return res.status(404).send({message: 'Error al encontrar el usuario'})
                }else if(usuariofw.usuario == usuarioNm){
                    return res.status(404).send({message: 'No se puede seguir a si mismo'})
                }else if(usuariofw.usuario != usuarioNm){
                    Login.findById(id,{follow:{$elemMatch:{usuario:user}}},(err, usuariosg)=>{
                        if(err) return res.status(500).send({message: 'error al seguir al usuario'})
                        if(usuariosg.follow.length == 0){
                            Login.findByIdAndUpdate(id,{$push:{follow:{usuario:user}}},{new:true},(err, addPerfil)=>{
                                if(err) return res.status(500).send({message: 'Error al seguir el usuario'})
                                if(addPerfil){
                                    Login.findOneAndUpdate({usuario:user},{$push:{followers:{usuario:usuarioNm}}},(err, follower)=>{
                                        console.log(follower)
                                        console.log(err)
                                    })
                                    return res.status(200).send({addPerfil})
                                }
                            })
                        }else{
                            return res.status(404).send({message: 'Ya esta siguiendo a este usuario'})
                        }
                    })
                }
            })
        }
    })    
}

function unfollowUser(user, req, res){
    var id = req.user.sub
    var usuarioNm = req.user.usuario

    Login.findOne({_id:id,},{follow:{$elemMatch:{usuario:user}}},(err, userUnf)=>{
        if(err) return res.status(500).send({message: 'Error en la pericion del Usuario'})
        if(!userUnf) return res.status(404).send({message: 'No se a podido dejar de seguir al usuario'})
        console.log(userUnf.follow.LE)
        if(userUnf.follow.length === 0){
            return res.status(500).send({message:'El usuario ya no esta siendo seguido por usted'})
            
        }else if(userUnf.follow.length != 0){
            Login.findOneAndUpdate({_id:id},{$pull:{follow:{usuario:user}}},{new:true},(err, userUfw)=>{
                if(err) return res.status(500).send({message: 'Error en la peticion del usuario'})
                if(!userUfw) return res.status(404).send({message: 'Error al encontrar al usuario'})
                if(userUfw){
                    Login.findOneAndUpdate({usuario:user},{$pull:{followers:{usuario:usuarioNm}}},(err, unfollow)=>{
                        console.log(unfollow)
                        console.log(err)
                    })
                    return res.status(200).send({userUnf})
                }
            })
        }
    })
}

module.exports = {
    followUser,
    unfollowUser
}