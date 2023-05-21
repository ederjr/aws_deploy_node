const mongoose = require('mongoose')

const Person = mongoose.model('Person', {
    statusApi: Number,
    unimedName: String,
    cardNumber: String,
    dateRegister: String
})

module.exports = Person