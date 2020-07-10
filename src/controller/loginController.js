'use strict'

var jwt = require("../services/jwt")
var bcrypt = require("bcrypt-nodejs")
var User = require("../models/login")

function Registrar(usuario, password, res){
    var user = new User()

    if(usuario && password){
        user.usuario = usuario;
        user.password = password;

        User.find({ $or: [
            {usuario: user.usuario}
        ]}).exec((err, usuarios)=>{
            if(err) return res.status(500).send({message: 'error en la peticion'})

            if(usuarios && usuarios.length >= 1){
                return res.status(500).send({message: 'el usuario ya existe'})
            }else{
                bcrypt.hash(password, null, null, (err, hash)=>{
                    user.password = hash;

                    user.save((err, usuarioGuardado)=>{
                        if(err) return res.status(500).send({message: 'Error al guardar el usuario'})

                        if(usuarioGuardado){
                            res.status(200).send({user: usuarioGuardado})
                        }else{
                            res.status(404).send({message: 'no se ha podido registrar el usuario'})
                        }
                    })
                })
            }
        })
    }else{
        res.status(200).send({message: 'complete los datos necesarios'})
    }
}

function login(usuario, password, body, res){

    User.findOne({usuario: usuario}, (err, user)=>{
        if(user){
            bcrypt.compare(password, user.password, (err, check)=>{
                if(check){
                    if(body){
                        return res.status(200).send({token: jwt.createToken(user)})
                    }else{
                        user.password = undefined;
                        return res.status(200).send({user})
                    }
                }else{
                    return res.status(404).send({message: 'El usuario no ha sido identificado'})
                }
            })
        }else{
            return res.status(404).send({message: 'el usuario no se ha podido logear'})
        }
    })
}

module.exports = {
    Registrar,
    login
}