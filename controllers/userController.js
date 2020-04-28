const express = require('express')
const User = require('../models/userModel')
const factory = require('./handlerFactory')

exports.getAllUsers = factory.getAll(User)

exports.getUser = factory.getOne(User)

exports.deleteUser = factory.disactiveOne(User)

exports.updateUser = factory.updateOne(User)
