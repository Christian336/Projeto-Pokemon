const express = require('express')
const engine = require("express-handlebars")
const bodyParser = require('body-parser')
const Tabela = require('./models/Table.js')



//App
const app = express()

//Temple Engine

app.engine('handlebars', engine.engine())
app.set('view engine', 'handlebars')
app.set('views' , 'src/views')


//Body Parser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())



//Rotas

app.get("/", function(req,res){
    res.render('index')
})

app.get("/POST/pokemons", function(req,res){
    res.render('criar')
})

app.get("/PUT/pokemons/:id" , function(req,res){

    var id = req.params.id

    Tabela.findByPk(id)
    .then(data =>{
        res.render('alterar2', {id:data["id"], treinador:data["treinador"]})
       
    }).catch(err =>{
        res.render('erro', {erro: err})
    })
})



app.post("/PUT/pokemons/id" , function(req,res){

    var id = req.body.id

    Tabela.findByPk(id)
    .then(data =>{
        res.render('alterar2', {id:data["id"], treinador:data["treinador"]})
       
    }).catch(err =>{
        res.render('erro', {erro: err})
    })
})

app.get("/PUT/pokemons" , function(req,res){
    res.render('alterar')
})



app.get("/DELETE/pokemons/:id", function(req,res){

    Tabela.destroy({where: {'id': req.params.id}}).then(function(){
        res.render('operacao')
        
    
       
    })
})

app.post("/DELETE/pokemons/id", function(req,res){

    Tabela.destroy({where: {'id': req.body.id}}).then(function(){
        res.render('operacao')
       
    }).catch(function(erro){
        res.render('erro', {erro:erro})
    })
})

app.get("/DELETE/pokemons" , function(req,res){
    res.render("deletar")
})


app.get("/GET/pokemons/:id" , function(req,res){
    var id = req.params.id

    Tabela.findByPk(id)
    .then(data =>{
        res.render('exibir_pokemon' , {pokemon : [{id: data["id"], tipo: data["tipo"], treinador: data["treinador"], nivel: data["nivel"]}]})
        
    }).catch(err =>{
        res.render('erro', {erro: err})
    })
})

app.post("/GET/pokemons/id" , function(req,res){
    var id = req.body.id
    Tabela.findByPk(id)
    .then(data =>{
        res.render('exibir_pokemon' , {pokemon : [{id: data["id"], tipo: data["tipo"], treinador: data["treinador"], nivel: data["nivel"]}]})
        
    }).catch(err =>{
        res.render('erro', {erro: err})
    })
})

app.get("/GET/pokemon" , function(req,res){
    res.render("carregar")
})

app.get("/GET/pokemons", function(req,res){
    Tabela.findAll()
    .then(
        data =>{
           var pokemon = []
          
           for(var i=0; i < data.length; i++){
            pokemon.push({
                id: data[i]["id"],
                tipo: data[i]["tipo"],
                treinador: data[i]["treinador"],
                nivel: data[i]["nivel"]
            })
    
}
           res.render('exibir_pokemon' , {pokemon:pokemon})
           
        }
        
    )
    .catch(err =>{
        res.render('erro', {erro: err})
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
                       res.render('exibir_pokemon' , {pokemon : [{id: pkid, tipo: req.body.tipo, treinador: req.body.treinador, nivel: 1}]})   
                    }   
                )
           
     }).catch(function(erro){
         res.render('erro', {erro: erro})
     })}
         else{
             var errou = new Error("Tipo de pokemon inválido!!!")
             res.render('erro', {erro: errou})
         }

   
    
})

app.post('/PUTED' , function(req,res){
    var id = req.body.id
    
    var nome = req.body.treinador

    Tabela.update({treinador : nome},{
        where:{
            id: id
        }
    })
    .then(() =>{
        res.render('operacao')
   
    }).catch(function(erro){
        res.render('erro', {erro: erro})
    })
}
 
)

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
            var erro = new Error("Foram passados um ou mais ids invalidos!")
            res.render('erro', {erro: erro})
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

        Tabela.update({nivel : Anivel},{
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
            Tabela.update({nivel : Bnivel},{
                where:{
                    id: BId
                }
            })
        }

    res.render('exibir_pokemon', {pokemon: [{status: "Vencedor", id: AId, tipo: Atipo, treinador: Atreinador, nivel: Anivel, evolution: "//Subiu de nível"},
    {status: "Perdedor", id: BId, tipo: Btipo, treinador: Btreinador, nivel: Bnivel, evolution: loserstatus}]})

    }else{
        Bnivel++
        Anivel--

        Tabela.update({nivel : Bnivel},{
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
            Tabela.update({nivel : Anivel},{
                where:{
                    id: AId
                }
            })
        }

    res.render('exibir_pokemon', {pokemon: [{status: "Vencedor", id: BId, tipo: Btipo, treinador: Btreinador, nivel: Bnivel, evolution: "//Subiu de nível"}, 
    {status: "Perdedor", id: AId, tipo: Atipo, treinador: Atreinador, nivel: Anivel, evolution: loserstatus}]})

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
            var erro = new Error("Foram passados um ou mais ids invalidos!")
            res.render('erro', {erro: erro})
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

        Tabela.update({nivel : Anivel},{
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
            Tabela.update({nivel : Bnivel},{
                where:{
                    id: BId
                }
            })
        }

        res.render('exibir_pokemon', {pokemon: [{status: "Vencedor", id: AId, tipo: Atipo, treinador: Atreinador, nivel: Anivel, evolution: "//Subiu de nível"},
        {status: "Perdedor", id: BId, tipo: Btipo, treinador: Btreinador, nivel: Bnivel, evolution: loserstatus}]})

    }else{
        Bnivel++
        Anivel--

        Tabela.update({nivel : Bnivel},{
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
            Tabela.update({nivel : Anivel},{
                where:{
                    id: AId
                }
            })
        }
    res.render('exibir_pokemon', {pokemon: [{status: "Vencedor", id: BId, tipo: Btipo, treinador: Btreinador, nivel: Bnivel, evolution: "//Subiu de nível"}, 
    {status: "Perdedor", id: AId, tipo: Atipo, treinador: Atreinador, nivel: Anivel, evolution: loserstatus}]})

    }
    }
})
    }
    
)

app.get("/POST/batalhar", function(req, res){
    res.render("batalhar")
})

//Servidor
const PORT = process.env.PORT || 8081
const HOST = '0.0.0.0';

app.listen(PORT, HOST);
console.log('Rodando no endereco http://localhost:8081')
