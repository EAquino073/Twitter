'use strict'

var Login = require("../models/login")

function addTweet(tweet, req, res){
    var id = req.user.sub

    Login.findOneAndUpdate({_id:id}, {$push:{twitter: {tweet: tweet}}}, {new: true}, (err, tweet)=>{
        if(err) return res.status(500).send({message: 'Error en la peticion'})
        if(!tweet) return res.status(404).send({message: 'el tweet no se pudo completar'})

        return res.status(200).send({tweet})
    })
}

function updateTweet(idTweet,tweet, req, res){
    var id = req.user.sub

    Login.findOneAndUpdate({_id:id, "twitter._id":idTweet},{"twitter.$.tweet":tweet},{new:true},(err, tweetEditado)=>{
        if(err) return res.status(500).send({message: 'error en la peticion del tweet'})
        if(!tweetEditado) return res.status(404).send({message: 'no se ha podido actualizar el tweet o el tweet es de otro usuario'})

        return res.status(200).send({tweetEditado})
    })
}

function deleteTweet(idTweet, req, res){
    var id = req.user.sub

    Login.findOneAndUpdate({_id:id, "twitter._id":idTweet},{$pull:{twitter:{_id:idTweet}}},(err, tweetEliminado)=>{
        if(err) return res.status(500).send({message: 'error en la peticion del tweet'})
        if(!tweetEliminado) return res.status(404).send({message: 'no se ha podido eliminar el tweet o el tweet es de otro usuario'})

        return res.status(200).send({tweetEliminado})
    })
}

function viewTweets(user, req, res){

    Login.findOne({usuario:user},(err, view)=>{
        if(err) return res.status(500).send({message: 'Error al encontrar el usuario'})
        if(!view) return res.status(404).send({message: 'No se a podido encontrar los tweets'})
        
        if(view.twitter.length == 0){
            return res.status(404).send({message: 'El usuario no tiene ningun tweet'})
        }else if(view.twitter.length !=0){
            return res.status(200).send({tweets:view.twitter})
        }
    })
}

function viewUser(user, req, res){
    var id = req.user.sub

    Login.findOne({_id:id, usuario:user},(err, perfil)=>{
        if(err) return res.status(500).send({message: 'Error en la peticion del ususario'})
        if(!perfil) return res.status(404).send({message: 'No se ha podido encontrar el perfil o es de otro usuario'})

        return res.status(200).send({usuario:perfil.usuario, follow:perfil.follow.length, followers:perfil.followers.length, tweets:perfil.twitter.length})
    })
}

module.exports = {
    addTweet,
    updateTweet,
    deleteTweet,
    viewTweets,
    viewUser
}