
const router = require('express').Router()
const Person = require('../models/Person')

// Cretae - criação de dados
router.post('/', async (req, res) => {
    // req.body
    //try{
        const {statusApi, unimedName, cardNumber} = req.body
        let tam = statusApi.length;

        if(!statusApi || !unimedName || !cardNumber){
            res.status(422).json({error: 'todos os campos sao obrigatorios'})
        }else if(/^[0-9]+$/.test(statusApi) == false){
            res.status(422).json({error: 'o status precisa ser do tipo Number. Exemplo: 200'})
        }else if(tam != 3){
            res.status(422).json({error: 'informe um status válido. Exemplo: 200'})
        }else{
            const consultDB = await Person.find();

            var dataAtual = new Date();
            var dia = String(dataAtual.getDate()).padStart(2, '0');
            var mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
            var ano = dataAtual.getFullYear();
            var horas = dataAtual.getHours();
            var minutos = String(dataAtual.getMinutes()).padStart(2, '0');;
            let dateRegister = dia + '/' + mes + '/' + ano + " " + horas + ":" + minutos;

            const objStatus = {statusApi, unimedName, cardNumber, dateRegister}
            console.log(objStatus);

            if(consultDB.length == "0"){
                await Person.create(objStatus);
                res.status(200).json({
                    message: "primeiro registro"
                })
            }else{

                let registros = "Tudo certo, não há histórico de erros na API";
                for(let i=0; i < consultDB.length; i++){
                    if(consultDB[i].statusApi != 200){
                        registros = {
                            "ultimoIncidente": consultDB[i]
                        }
                    }
                }
                //instabilidade ocorrendo na API do cliente
                if(consultDB[consultDB.length - 1].statusApi != "200" && statusApi != "200"){
                    res.status(500).json({
                        error: "API ainda com instabilidade!",
                        registros
                    })
                }else if(consultDB[consultDB.length - 1].statusApi == "200" && statusApi == "200"){               
                    res.status(200).json({
                        "statusAtual": "API funcionando corretamente! Seguimos monitorando...",
                        registros
                    })
                }else{
                    let tipoStatus = "incidente resolvido";
                    const ultimoRegistro = await Person.find();

                    let ultimo = ultimoRegistro[ultimoRegistro.length - 1].statusApi
                    if(ultimo == "200"){
                        tipoStatus = "novo incidente";
                    }
                        
                    //create
                    try{
                        await Person.create(objStatus);
                        if(tipoStatus == "novo incidente"){
                            res.status(500).json({
                                "alerta": "incidente identificado, API do cliente retornou o status: " + statusApi,
                                "acao": "já notificamos a equipe de sustentação da Digitalbot",
                                "regitroDoIncidente": dateRegister,
                                "prioridade": "alta"
                            })
                        }else if(tipoStatus == "incidente resolvido"){
                            res.status(200).json({
                                "alerta": "incidente resolvido, API do cliente retornou o status: " + statusApi,
                                "acao": "já notificamos a equipe de sustentação da Digitalbot",
                                "regitroDoIncidente": dateRegister,
                                "prioridade": "null"
                            })
                        }
                    }catch(error){
                        res.status(500).json({error: "não foi possível cadastrar o status no Banco"})
                    }
                }
            }
        }
    /*}catch(e){
        res.status(500).json({error: "Estamos passando por instabilidade, por favor tente mais tarde!"})
    }*/
})

//Read - leitura de dados
router.get('/', async (req, res) => {
    try{
        const dados = await Person.find()
        let ultimoStatus = {
                status : dados[dados.length - 1].statusApi,
                dataRegister : dados[dados.length - 1].dateRegister
            }
        res.status(200).json({ultimoStatus,dados})
    }catch(error){
        res.status(500).json({error: "sem registros"})
    }
})

module.exports = router