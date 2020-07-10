'use strict'

var mongoose = require("mongoose")
var Schema = mongoose.Schema

var LoginSchema = Schema({
    usuario: String,
    password: String,
    twitter:[{
        tweet: String
    }],
    follow:[{
        usuario: String
    }],
    followers:[{
        usuario: String
    }]

})

module.exports = mongoose.model('login', LoginSchema)