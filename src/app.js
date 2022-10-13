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
    res.send( '<header><center><h1>BEM VINDO AO MEU PROJETO</h1></center></header><br><hr><br><section><center><h2>Autoria: Christian Soares Pereira dos Santos</h2></center></section>'
  )
})

app.get("/POST/pokemons", function(req,res){
    res.send(' <header><center><h1>CRIAR</h1></center></header><section><form method="POST" action="/POSTED"><center>tipo:<input type="text" name="tipo" id="tipo" required><br><br> treinador:<input type="text" name="treinador" id="treinador" required><br><br><button type="submit">Criar</button> </center></form></section>')
})

app.get("/PUT/pokemons/:id" , function(req,res){
    var id = req.params.id
    Tabela.findByPk(id)
    .then(data =>{
        res.send('<header><center><h1>ALTERAR</h1></center></header><form action="/PUTED" method="POST" ><center><p>id:'+data["id"]+'</p><p id="treinador">Nome atual do treinador: '+data["treinador"]+'</p>Novo nome do treinador: <input type="text" name="treinador" id="treinador" required><br><br><p hidden><input type=text value="'+data["id"]+'" name="id" id="id"></p><button type="submit">Alterar</button></center></form>')
    }).catch(err =>{
        res.status(500).send({
            message:
            err.message || "some error"
        })
    })
})



app.get("/DELETE/pokemons/:id", function(req,res){

    Tabela.destroy({where: {'id': req.params.id}}).then(function(){
        res.send("<center><h1>Pokemon deletado com sucesso!!!</h1></center>")
    
       
    })
})


app.get("/GET/pokemons/:id" , function(req,res){
    var id = req.params.id
    Tabela.findByPk(id)
    .then(data =>{
        res.send("<center><h1>Carregar</h1><hr>id: "+data["id"]+"<br>tipo: "+data["tipo"]+"<br>treinador: "+data["treinador"]+"<br>nivel: "+data["nivel"]+"</center><hr>")
    }).catch(err =>{
        res.status(500).send({
            message:
            err.message || "some error"
        })
    })
})

app.get("/GET/pokemons", function(req,res){
    Tabela.findAll()
    .then(
        data =>{
           var list = ''
           for(var i=0; i < data.length; i++)
           list+="id: "+data[i]["id"]+"<br>tipo: "+data[i]["tipo"]+"<br>treinador: "+data[i]["treinador"]+"<br>nivel: "+data[i]["nivel"]+"<hr>"

            res.send("<center><h1>Listar</h1><hr>"+list+"</center>");
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
                       res.send("<center><h1>Pokemon criado com sucesso!!!</h1>id: "+pkid+"<br><br>tipo: "+req.body.tipo+"<br><br>treinador: "+req.body.treinador+"<br><br>nivel: 1</center>")
                    }
                    
                )
           
     }).catch(function(erro){
         res.send("Ocorreu um erro: "+erro)
     })}
         else{
             var errou = new Error("Tipo de pokemon inválido!!!")
             res.send("<center><h1>Nao foi possivel criar o pokemon!!!</h1>"+errou+"</center>")
           
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
        
    res.send("<center><h1>Dados alterados com sucesso!!!</h1></center>")
    }).catch(function(erro){
        res.send("Ocorreu um erro: "+erro)
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
            res.send("Foram passados um ou mais ids invalidos!!!")
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

    res.send('<center><h1>Vencedor:</h1>'+pkA+'//Subiu de nivel<h1>Perdedor:</h1>'+pkB+loserstatus+'</center>')

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

    res.send('<center><h1>Vencedor:</h1>'+pkB+'//Subiu de nivel<h1>Perdedor:</h1>'+pkA+loserstatus+'</center>') 
    }

    }})
    }
    
)

//Servidor
const PORT = process.env.PORT || 8081
app.listen(PORT, function(){
    console.log("Servidor Rodando na url http://localhost:8081")
})
