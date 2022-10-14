const express = require('express')
//import { engine } from "express-handlebars"
//const engine = require("express-handlebars")
//import Table from "./models/Table"
const Table = require("./models/Table")
const bodyParser = require('body-parser')
const Tabela = require('./models/Table')


//App
const app = express()

//Temple Engine
/*
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views' , 'src/views')
*/

//Body Parser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())



//Rotas

app.get("/", function(req,res){
    res.sendFile(__dirname+'/views/index.html')
})

app.get("/POST/pokemons", function(req,res){
    res.send(' <header><center><h1>CRIAR</h1></center></header><section><form method="POST" action="/POSTED"><center>tipo:<input type="text" autocomplete="off" name="tipo" id="tipo" required><br><br> treinador:<input type="text" autocomplete="off"  name="treinador" id="treinador" required><br><br><button type="submit">Criar</button> </center></form></section>')
})

app.get("/PUT/pokemons/:id" , function(req,res){

    var id = req.params.id

    Tabela.findByPk(id)
    .then(data =>{
        res.send('<header><center><h1>ALTERAR</h1></center></header><form action="/PUTED" method="POST" ><center><p>id:'+data["id"]+'</p><p id="treinador">Nome atual do treinador: '+data["treinador"]+'</p>Novo nome do treinador: <input type="text" autocomplete="off"  name="treinador" id="treinador" required><br><br><p hidden><input type=text value="'+data["id"]+'" name="id" id="id"></p><button type="submit">Alterar</button></center></form>')
    }).catch(err =>{
        res.status(500).send({
            message:
            err.message || "some error"
        })
    })
})

app.post("/PUT/pokemons/id" , function(req,res){

    var id = req.body.id

    Tabela.findByPk(id)
    .then(data =>{
        res.send('<header><center><h1>ALTERAR</h1></center></header><form action="/PUTED" method="POST" ><center><p>id:'+data["id"]+'</p><p id="treinador">Nome atual do treinador: '+data["treinador"]+'</p>Novo nome do treinador: <input type="text" autocomplete="off" name="treinador" id="treinador" required><br><br><p hidden><input type=text value="'+data["id"]+'" name="id" id="id"></p><button type="submit">Alterar</button></center></form>')
    }).catch(err =>{
        res.status(500).send({
            message:
            err.message || "some error"
        })
    })
})

app.get("/PUT/id" , function(req,res){
    res.sendFile(__dirname+'/views/idA.html')
})



app.get("/DELETE/pokemons/:id", function(req,res){

    Tabela.destroy({where: {'id': req.params.id}}).then(function(){
        res.send('<center><h1>Pokemon deletado com sucesso!!!</h1></center><center><p><a href="/"><button style="background: red; border-radius: 6px; padding: 15px; cursor: pointer; color: white; border: none; font-size: 16px;">VOLTAR PARA PAGINA INICIAL</button></a></p></center>')
    
       
    })
})

app.post("/DELETE/pokemons/id", function(req,res){

    Tabela.destroy({where: {'id': req.body.id}}).then(function(){
        res.send('<center><h1>Pokemon deletado com sucesso!!!</h1></center><center><p><a href="/"><button style="background: red; border-radius: 6px; padding: 15px; cursor: pointer; color: white; border: none; font-size: 16px;">VOLTAR PARA PAGINA INICIAL</button></a></p></center>')
    
       
    })
})

app.get("/DELETE/id" , function(req,res){
    res.sendFile(__dirname+"/views/idD.html")
})


app.get("/GET/pokemons/:id" , function(req,res){
    var id = req.params.id
    Tabela.findByPk(id)
    .then(data =>{
        res.send('<center><h1>Carregar</h1><hr>id: '+data["id"]+'<br>tipo: '+data["tipo"]+'<br>treinador: '+data["treinador"]+'<br>nivel: '+data["nivel"]+'<center><p><a href="/"><button style="background: red; border-radius: 6px; padding: 15px; cursor: pointer; color: white; border: none; font-size: 16px;">VOLTAR PARA PAGINA INICIAL</button></a></p></center></center><hr>')
    }).catch(err =>{
        res.status(500).send({
            message:
            err.message || "some error"
        })
    })
})

app.post("/GET/pokemons/id" , function(req,res){
    var id = req.body.id
    Tabela.findByPk(id)
    .then(data =>{
        res.send('<center><h1>Carregar</h1><hr>id: '+data["id"]+'<br>tipo: '+data["tipo"]+'<br>treinador: '+data["treinador"]+'<br>nivel: '+data["nivel"]+'<center><p><a href="/"><button style="background: red; border-radius: 6px; padding: 15px; cursor: pointer; color: white; border: none; font-size: 16px;">VOLTAR PARA PAGINA INICIAL</button></a></p></center></center><hr>')
    }).catch(err =>{
        res.status(500).send({
            message:
            err.message || "some error"
        })
    })
})

app.get("/GET/id" , function(req,res){
    res.sendFile(__dirname+"/views/idC.html")
})

app.get("/GET/pokemons", function(req,res){
    Tabela.findAll()
    .then(
        data =>{
           var list = ''
           for(var i=0; i < data.length; i++)
           list+="id: "+data[i]["id"]+"<br>tipo: "+data[i]["tipo"]+"<br>treinador: "+data[i]["treinador"]+"<br>nivel: "+data[i]["nivel"]+"<hr>"

            res.send('<center><h1>Listar</h1><hr>'+list+'</center><center><p><a href="/"><button style="background: red; border-radius: 6px; padding: 15px; cursor: pointer; color: white; border: none; font-size: 16px;">VOLTAR PARA PAGINA INICIAL</button></a></p></center>');
        }
        
    )
    .catch(err =>{
        res.status(500).send({
            message:
            err.message || "some error"
        })
    })
  
})


app.post("/POSTED", function(req,res){
    var pkid = 0;

    if(req.body.tipo == "pikachu" || req.body.tipo == "mewtwo" || req.body.tipo == "charizard"){
       
        Tabela.create({
         tipo: req.body.tipo,
         treinador: req.body.treinador,
         nivel: 1
        }).then(function(){ 
            
                Tabela.findAll()
                .then(
            
                    
            
                    data =>{
                      
                       for(var i=0; i < data.length; i++){
                        pkid=data[i]["id"]
                       }
                       res.send('<center><h1>Pokemon criado com sucesso!!!</h1>id: '+pkid+'<br><br>tipo: '+req.body.tipo+'<br><br>treinador: '+req.body.treinador+'<br><br>nivel: 1<p><a href="/"><button style="background: red; border-radius: 6px; padding: 15px; cursor: pointer; color: white; border: none; font-size: 16px;">VOLTAR PARA PAGINA INICIAL</button></a></p></center>')
                    }
                    
                )
           
     }).catch(function(erro){
         res.send('Ocorreu um erro: '+erro+'<center><p><a href="/"><button style="background: red; border-radius: 6px; padding: 15px; cursor: pointer; color: white; border: none; font-size: 16px;">VOLTAR PARA PAGINA INICIAL</button></a></p></center>')
     })}
         else{
             var errou = new Error("Tipo de pokemon inválido!!!")
             res.send('<center><h1>Nao foi possivel criar o pokemon!!!</h1>'+errou+'<center><p><a href="/"><button style="background: red; border-radius: 6px; padding: 15px; cursor: pointer; color: white; border: none; font-size: 16px;">VOLTAR PARA PAGINA INICIAL</button></a></p></center></center>')
           
         }

   
    
})

app.post('/PUTED' , function(req,res){
    var id = req.body.id
    
    var nome = req.body.treinador
 

    Table.update({treinador : nome},{
        where:{
            id: id
        }
    })
    .then(() =>{
        
    res.send('<center><h1>Dados alterados com sucesso!!!</h1></center><center><p><a href="/"><button style="background: red; border-radius: 6px; padding: 15px; cursor: pointer; color: white; border: none; font-size: 16px;">VOLTAR PARA PAGINA INICIAL</button></a></p></center>')
    }).catch(function(erro){
        res.send('Ocorreu um erro: '+erro+'<center><p><a href="/"><button style="background: red; border-radius: 6px; padding: 15px; cursor: pointer; color: white; border: none; font-size: 16px;">VOLTAR PARA PAGINA INICIAL</button></a></p></center>')
    })})

app.get('/POST/batalhar/:pokemonAId/:pokemonBId' , function(req,res){
    var AId = req.params.pokemonAId
    var Atipo
    var Atreinador
    var Anivel
    var BId = req.params.pokemonBId
    var Btipo
    var Btreinador
    var Bnivel
  
 
    Tabela.findAll().then(dados =>{
        for(var i=0; i < dados.length; i++){
            if(dados[i]["id"] == AId){
                Atipo = dados[i]["tipo"]
                Atreinador = dados[i]["treinador"]
                Anivel = dados[i]["nivel"]
            }
            else if(dados[i]["id"] == BId){
                Btipo = dados[i]["tipo"]
                Btreinador = dados[i]["treinador"]
                Bnivel = dados[i]["nivel"]
            }


        }

        if(Anivel == null || Bnivel == null){
            res.send('<center>Foram passados um ou mais ids invalidos!!!</center><center><p><a href="/"><button style="background: red; border-radius: 6px; padding: 15px; cursor: pointer; color: white; border: none; font-size: 16px;">VOLTAR PARA PAGINA INICIAL</button></a></p></center>')
       }

       else{
    var sum = Anivel+Bnivel
    
    let sorteio = Math.floor(Math.random() * sum)+1
    
    var winner;
    
    if(sorteio <= Anivel){
      winner = 'A'
    }else{
      winner = 'B'
    }

    if(winner == 'A'){
        Anivel++
        Bnivel--

        Table.update({nivel : Anivel},{
            where:{
                id: AId
            }
        })

        var loserstatus

        if(Bnivel == 0){
            loserstatus = '//Morreu e foi deletado da tabela'
            Tabela.destroy({where: {id: BId}})
        }else{
            loserstatus = '//Desceu de nivel'
            Table.update({nivel : Bnivel},{
                where:{
                    id: BId
                }
            })
        }

        var pkA = '<p>id: '+AId+'</p>tipo: '+Atipo+'</p>treinador: '+Atreinador+'</p>nivel: '+Anivel
    var pkB = '<p>id: '+BId+'</p>tipo: '+Btipo+'</p>treinador: '+Btreinador+'</p>nivel: '+Bnivel

    res.send('<center><h1>Vencedor:</h1>'+pkA+'//Subiu de nivel<h1>Perdedor:</h1>'+pkB+loserstatus+'</center><center><p><a href="/"><button style="background: red; border-radius: 6px; padding: 15px; cursor: pointer; color: white; border: none; font-size: 16px;">VOLTAR PARA PAGINA INICIAL</button></a></p></center>')

    }else{
        Bnivel++
        Anivel--

        Table.update({nivel : Bnivel},{
            where:{
                id: BId
            }
        })

        var loserstatus

        if(Anivel == 0){
            loserstatus = '//Morreu e foi deletado da tabela'
            Tabela.destroy({where: {id: AId}})
        }else{
            loserstatus = '//Desceu de nivel'
            Table.update({nivel : Anivel},{
                where:{
                    id: AId
                }
            })
        }

        var pkA = '<p>id: '+AId+'</p>tipo: '+Atipo+'</p>treinador: '+Atreinador+'</p>nivel: '+Anivel
    var pkB = '<p>id: '+BId+'</p>tipo: '+Btipo+'</p>treinador: '+Btreinador+'</p>nivel: '+Bnivel

    res.send('<center><h1>Vencedor:</h1>'+pkB+'//Subiu de nivel<h1>Perdedor:</h1>'+pkA+loserstatus+'</center><center><p><a href="/"><button style="background: red; border-radius: 6px; padding: 15px; cursor: pointer; color: white; border: none; font-size: 16px;">VOLTAR PARA PAGINA INICIAL</button></a></p></center>') 
    }

    }})
    }
    
)

app.post('/POST/batalhar/pokemonAId/pokemonBId' , function(req,res){
    var AId = req.body.pokemonAId
    var Atipo
    var Atreinador
    var Anivel
    var BId = req.body.pokemonBId
    var Btipo
    var Btreinador
    var Bnivel
  
 
    Tabela.findAll().then(dados =>{
        for(var i=0; i < dados.length; i++){
            if(dados[i]["id"] == AId){
                Atipo = dados[i]["tipo"]
                Atreinador = dados[i]["treinador"]
                Anivel = dados[i]["nivel"]
            }
            else if(dados[i]["id"] == BId){
                Btipo = dados[i]["tipo"]
                Btreinador = dados[i]["treinador"]
                Bnivel = dados[i]["nivel"]
            }


        }

        if(Anivel == null || Bnivel == null){
            res.send('<center>Foram passados um ou mais ids invalidos!!!</center><center><p><a href="/"><button style="background: red; border-radius: 6px; padding: 15px; cursor: pointer; color: white; border: none; font-size: 16px;">VOLTAR PARA PAGINA INICIAL</button></a></p></center>')
       }

       else{
    var sum = Anivel+Bnivel
    
    let sorteio = Math.floor(Math.random() * sum)+1
    
    var winner;
    
    if(sorteio <= Anivel){
      winner = 'A'
    }else{
      winner = 'B'
    }

    if(winner == 'A'){
        Anivel++
        Bnivel--

        Table.update({nivel : Anivel},{
            where:{
                id: AId
            }
        })

        var loserstatus

        if(Bnivel == 0){
            loserstatus = '//Morreu e foi deletado da tabela'
            Tabela.destroy({where: {id: BId}})
        }else{
            loserstatus = '//Desceu de nivel'
            Table.update({nivel : Bnivel},{
                where:{
                    id: BId
                }
            })
        }

        var pkA = '<p>id: '+AId+'</p>tipo: '+Atipo+'</p>treinador: '+Atreinador+'</p>nivel: '+Anivel
    var pkB = '<p>id: '+BId+'</p>tipo: '+Btipo+'</p>treinador: '+Btreinador+'</p>nivel: '+Bnivel

    res.send('<center><h1>Vencedor:</h1>'+pkA+'//Subiu de nivel<h1>Perdedor:</h1>'+pkB+loserstatus+'</center><center><p><a href="/"><button style="background: red; border-radius: 6px; padding: 15px; cursor: pointer; color: white; border: none; font-size: 16px;">VOLTAR PARA PAGINA INICIAL</button></a></p></center>')

    }else{
        Bnivel++
        Anivel--

        Table.update({nivel : Bnivel},{
            where:{
                id: BId
            }
        })

        var loserstatus

        if(Anivel == 0){
            loserstatus = '//Morreu e foi deletado da tabela'
            Tabela.destroy({where: {id: AId}})
        }else{
            loserstatus = '//Desceu de nivel'
            Table.update({nivel : Anivel},{
                where:{
                    id: AId
                }
            })
        }

        var pkA = '<p>id: '+AId+'</p>tipo: '+Atipo+'</p>treinador: '+Atreinador+'</p>nivel: '+Anivel
    var pkB = '<p>id: '+BId+'</p>tipo: '+Btipo+'</p>treinador: '+Btreinador+'</p>nivel: '+Bnivel

    res.send('<center><h1>Vencedor:</h1>'+pkB+'//Subiu de nivel<h1>Perdedor:</h1>'+pkA+loserstatus+'</center><center><p><a href="/"><button style="background: red; border-radius: 6px; padding: 15px; cursor: pointer; color: white; border: none; font-size: 16px;">VOLTAR PARA PAGINA INICIAL</button></a></p></center>') 
    }

    }})
    }
    
)

app.get("/POST/pokemonAId/pokemonBId", function(req, res){
    res.sendFile(__dirname+"/views/idB.html")
})



//Servidor
const PORT = process.env.PORT || 8081
app.listen(PORT, function(){
    console.log("Servidor Rodando na url http://localhost:8081")
})
