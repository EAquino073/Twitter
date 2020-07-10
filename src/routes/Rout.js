'use strict'

var express = require("express")
var Comando = require("../controller/comandoController")
var md_auth = require("../middlewares/authenticated")

var api = express.Router()
api.post('/Comandos',md_auth.ensureAuth, Comando.comandos)


module.exports = api;