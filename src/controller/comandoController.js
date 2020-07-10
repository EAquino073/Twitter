'use strict'
var loginContrller = require('../controller/loginController')
var twitterController = require('../controller/twitterController') 
var followController = require('../controller/followController')

function comandos(req, res){
    var body = req.body.commands
    var split = body.split(" ")
    var command = split[0]

    if(command == 'REGISTER'){
        loginContrller.Registrar(split[1], split[2], res)
    }else if(command == 'LOGIN'){
        loginContrller.login(split[1], split[2], split[3], res)
    }else if(command == 'ADD_TWEET'){
        split.splice(0,1)
        var cadena = split.toString()
        var texto = cadena.replace(/,/g,' ')
        twitterController.addTweet(texto, req, res)
    }else if(command == 'EDIT_TWEET'){
        var idTweet = split[1]
        split.splice(0,2)
        var cadena = split.toString()
        var texto = cadena.replace(/,/g,' ')
        twitterController.updateTweet(idTweet,texto, req, res)
    }else if(command == 'DELETE_TWEET'){
        twitterController.deleteTweet(split[1], req, res)
    }else if(command == 'VIEW_TWEETS'){
        twitterController.viewTweets(split[1], req, res)
    }else if(command == 'PROFILE'){
        twitterController.viewUser(split[1], req, res)
    }else if(command == 'FOLLOW'){
        followController.followUser(split[1], req, res)
    }else if(command == 'UNFOLLOW'){
        followController.unfollowUser(split[1], req, res)
    }else{
        return res.status(404).send({message: 'El comando esta mal escrito o no existe'})
    }
}
 module.exports = {
     comandos
 }