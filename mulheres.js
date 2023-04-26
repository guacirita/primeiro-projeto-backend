const express = require("express"); //iniciando o express
const router =  express.Router(); //configurando a primeira parte da rota
// const { v4: uuidv4 } = require('uuid'); não vamos mais precisar criar o id, o mongodb fará isso

const cors = require('cors') //usando opacote que permite usar essa api no front-end
const conectaBancoDeDados = require('./bancoDeDados'); //ligando ao arquivo banco de dados
conectaBancoDeDados(); // chamando a função que conecta o banco de dados

const Mulher = require('./mulherModel');

const app = express(); // iniciando o app
app.use(express.json());
app.use(cors());

const porta = 3333; // criando a porta

//GET [na modificação passa a ser assincrona e muda o conteúdo]
async function mostraMulheres(request, response) {
    try {
        const mulheresVindasDoBancoDeDados = await Mulher.find();

        response.json(mulheresVindasDoBancoDeDados);
    }catch(erro) {
        console.log(erro);
    }
}

// POST  vira async
async function criaMulher(request, response){
    const novaMulher = new Mulher({
        // id: uuidv4(), não vai mais precisar deste ID, será criado pelo banco de dados
        nome: request.body.nome,
        imagem: request.body.imagem,
        minibio: request.body.minibio,
        citacao: request.body.citacao //acrescentado
    })

    try {
        const mulherCriada = await novaMulher.save();
        response.status(201).json(mulherCriada);
    }catch(erro) {
        console.log(erro);
    }
}

//PATCH
function corrigeMulher(request, response) {
    async function encontraMulher(mulher) {
        //  modificada
        try {
            const mulherEncontrada = await Mulher.findById(request.params.id);
            if(request.body.nome) {
                mulherEncontrada.nome = request.body.nome
            }
        
            if(request.body.minibio) {
                mulherEncontrada.minibio = request.body.minibio
            }
        
            if(request.body.imagem) {
                mulherEncontrada.imagem = request.body.imagem
            }
        
            if(request.body.citacao) {
                mulherEncontrada.citacao = request.body.citacao
            }

            const mulherAtualizadaNoBancoDeDados = await mulherEncontrada.save();

            response.json(mulherAtualizadaNoBancoDeDados);
        }catch (erro) {
            console.log(erro);
        }
    }
}

//DELETE (async é para lidar com banco de dados, função externa)
async function deletaMulher(request, response) {
//agora usamos o mongoose, e não precisamos da funcão js

    try {
        await Mulher.findByIdAndDelete(request.params.id);
        response.json({mensagem: 'Mulher deletada com sucesso!'});
    } catch(erro) {
        console.log(erro);
    }

}

app.use(router.get('/mulheres', mostraMulheres)); // configurado rota GET /mulheres
app.use(router.post('/mulheres', criaMulher)); //configurado rota Post / nova mulher
app.use(router.patch('/mulheres/:id', corrigeMulher)); // configurado rota PATCH / mulheres/:id
app.use(router.delete('/mulheres/:id', deletaMulher)); // configurado rota DELETE /mulheres/:id
//PORTA
function mostraPorta() {
    console.log("Servidor criado e rodando na porta ", porta);
}

app.listen(porta, mostraPorta);  //ouvindo a porta