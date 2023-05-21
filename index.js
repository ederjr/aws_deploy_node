// config inicial

const express = require('express')
const mongoose = require('mongoose')
const app = express()



//forma de ler JSON / middlewares
app.use(
    express.urlencoded({
        extended: true,
    }),
)

app.use(express.json())

//rotas da API
const personRoutes = require('./routes/personRoutes')
app.use('/person', personRoutes)


//rota inicial / endpoint
app.get('/', (req, res) => {

    //mostrar requisição
    res.json({
        message: 'API funcionando!'
    })
})

//mongodb+srv://ederjunior:YxKj4Ra9pvDQ7YS0@apicluster.681srif.mongodb.net/bancodaapi?retryWrites=true&w=majority

//entregar um porta
//const DB_USER = 'ederjunior'
//const DB_PASSWORD = encodeURIComponent('YxKj4Ra9pvDQ7YS0')

mongoose
.connect(
    'mongodb+srv://ederjunior:YxKj4Ra9pvDQ7YS0@apicluster.681srif.mongodb.net/?retryWrites=true&w=majority'
)
.then(() => {
    console.log("Conectamos ao MongoDB")
    app.listen(3000)
})
.catch((err) => console.log(err))