'use strict'

var jwt = require("jwt-simple")
var moment = require("moment")
var secret = 'clave_secreta_IN6BM'

exports.ensureAuth = function (req, res, next){
    var params = req.body
    var comando = params.commands
    var split = comando.split(" ")
    var comandoAgregado = split[0];

    if(!req.headers.authorization && comandoAgregado != 'REGISTER' && comandoAgregado != 'LOGIN'){
        return res.status(403).send({message: 'La peticion no tiene la cabecera de autenticacion'})
    }

    if(req.headers.authorization){

    var token = req.headers.authorization.replace(/['"]+/g,'');

    try {
        var payload = jwt.decode(token, secret)

        if(payload.exp <= moment().unix()){
            return res.status(401).send({
                message: 'El token a expirado'
            })
        }

    } catch (ex) {
        return res.status(404).send({
            message: 'El token no es valido'
        })
    }
    }

    req.user = payload;
    next();
}