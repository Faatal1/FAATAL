//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎮 CASE.JS — BLINDADO + SPAM + SUGESTÃO
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


const menu = require('./menu/menus');
const data = require('./dono/config/data.json');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const { areJidsSameUser } = require('@whiskeysockets/baileys');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

// Função casamento 
const pasta = "./arquivos/config"
const arquivo = path.join(pasta, "casamentos.json")

function lerCasamentos(){

// cria pasta se não existir
if(!fs.existsSync(pasta)){
fs.mkdirSync(pasta,{recursive:true})
}

// cria arquivo se não existir
if(!fs.existsSync(arquivo)){
fs.writeFileSync(arquivo,"{}")
}

try{
return JSON.parse(fs.readFileSync(arquivo))
}catch{
return {}
}

}

function salvarCasamentos(db){

// garante pasta
if(!fs.existsSync(pasta)){
fs.mkdirSync(pasta,{recursive:true})
}

fs.writeFileSync(arquivo,JSON.stringify(db,null,2))

}

//━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎮 SISTEMA RPG
//━━━━━━━━━━━━━━━━━━━━━━━━━━

const caminhoGolds = "./arquivos/config/golds.json"
const caminhoModoRPG = "./arquivos/config/modorpg.json"

if (!fs.existsSync(caminhoGolds))
fs.writeFileSync(caminhoGolds, JSON.stringify({}, null, 2))

// RPG POR GRUPO
if (!fs.existsSync(caminhoModoRPG))
fs.writeFileSync(caminhoModoRPG, JSON.stringify({}, null, 2))


function lerGolds(){

try{

let data = fs.readFileSync(caminhoGolds)

if(!data || data.length === 0)
return {}

return JSON.parse(data)

}catch{

console.log("⚠️ golds.json corrompido")

fs.writeFileSync(caminhoGolds, JSON.stringify({},null,2))

return {}

}

}


function salvarGolds(data){

fs.writeFileSync(caminhoGolds, JSON.stringify(data,null,2))

}


//━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎮 SISTEMA MODORPG POR GRUPO
//━━━━━━━━━━━━━━━━━━━━━━━━━━

function lerModoRPG(){

try{

return JSON.parse(fs.readFileSync(caminhoModoRPG))

}catch{

return {}

}

}


function salvarModoRPG(data){

fs.writeFileSync(caminhoModoRPG, JSON.stringify(data,null,2))

}


function rpgAtivo(grupo){

let modo = lerModoRPG()

return modo[grupo] === true

}


//━━━━━━━━━━━━━━━━━━━━━━━━━━
// 👤 SISTEMA DE USUÁRIO
//━━━━━━━━━━━━━━━━━━━━━━━━━━

function obterUsuarioGold(sender,nome){

let golds = lerGolds()

if(!golds[sender]){

golds[sender] = {

nome: nome || "Usuário",
saldo:0,

itens:{
picareta:0,
picareta_dur:0,
picareta_chances:3,
cassino_chances:5,
escudo:0,
cachaca:0,
cachaca_chances:1,
vinganca:0,
vinganca_chances:1,
quiz_chances:3
},

cooldown:{},

roubos:0,
roubo_lista:[]

}

salvarGolds(golds)

}

let user = golds[sender]

if(!user.itens) user.itens={}
if(!user.cooldown) user.cooldown={}
if(!Array.isArray(user.roubo_lista)) user.roubo_lista=[]

return {golds,user}

}


function addGold(user,valor){

user.saldo += valor

if(user.saldo < 0)
user.saldo = 0

}

//JOGO DA FORCA 
let jogoForca = {}

const palavrasForca = [

{ palavra: "cachorro", dica: "Animal domestico que late" },
{ palavra: "gato", dica: "Animal que gosta de leite" },
{ palavra: "banana", dica: "Fruta amarela" },
{ palavra: "carro", dica: "Veiculo usado para transporte" },
{ palavra: "celular", dica: "Usado para mandar mensagem" },
{ palavra: "escola", dica: "Lugar onde se estuda" },
{ palavra: "pizza", dica: "Comida redonda muito famosa" },
{ palavra: "praia", dica: "Lugar com areia e mar" },
{ palavra: "chuva", dica: "Agua que cai do ceu" },
{ palavra: "computador", dica: "Maquina usada para trabalhar ou jogar" },
{ palavra: "bicicleta", dica: "Veiculo de duas rodas" },
{ palavra: "janela", dica: "Fica na parede da casa e da para ver fora" },
{ palavra: "porta", dica: "Usada para entrar ou sair de um lugar" },
{ palavra: "cadeira", dica: "Usada para sentar" },
{ palavra: "mesa", dica: "Movel usado para colocar coisas" },
{ palavra: "caderno", dica: "Usado na escola para escrever" },
{ palavra: "lapis", dica: "Usado para escrever ou desenhar" },
{ palavra: "borracha", dica: "Usada para apagar o lapis" },
{ palavra: "televisao", dica: "Aparelho usado para assistir programas" },
{ palavra: "controle", dica: "Usado para mudar canal da tv" },
{ palavra: "geladeira", dica: "Usada para guardar comida fria" },
{ palavra: "fogao", dica: "Usado para cozinhar comida" },
{ palavra: "arroz", dica: "Comida muito comum no almoco" },
{ palavra: "feijao", dica: "Comida que combina com arroz" },
{ palavra: "chocolate", dica: "Doce feito de cacau" },
{ palavra: "sorvete", dica: "Doce gelado muito popular" },
{ palavra: "abacaxi", dica: "Fruta com coroa e casca espinhosa" },
{ palavra: "melancia", dica: "Fruta grande e cheia de agua" },
{ palavra: "morango", dica: "Fruta pequena vermelha" },
{ palavra: "uva", dica: "Fruta pequena usada para fazer vinho" },
{ palavra: "montanha", dica: "Elevacao natural do terreno" },
{ palavra: "floresta", dica: "Area com muitas arvores" },
{ palavra: "cachoeira", dica: "Queda de agua natural" },
{ palavra: "sol", dica: "Estrela que ilumina o dia" },
{ palavra: "lua", dica: "Satelite natural da terra" },
{ palavra: "estrela", dica: "Corpo celeste que brilha" },
{ palavra: "aviao", dica: "Veiculo aereo" },
{ palavra: "navio", dica: "Veiculo maritimo" },
{ palavra: "trigo", dica: "Grao usado para fazer pao" },
{ palavra: "familia", dica: "Pessoas que moram juntas" },
{ palavra: "hospital", dica: "Lugar onde as pessoas recebem tratamento" },
{ palavra: "medico", dica: "Profissional que cuida da saude" },
{ palavra: "enfermeiro", dica: "Ajuda o medico no hospital" },
{ palavra: "farmacia", dica: "Lugar onde se compra remedios" },
{ palavra: "remedio", dica: "Usado para tratar doencas" },
{ palavra: "cidade", dica: "Lugar onde muitas pessoas vivem" },
{ palavra: "rua", dica: "Caminho onde passam carros e pessoas" },
{ palavra: "ponte", dica: "Estrutura que atravessa rios" },
{ palavra: "estrada", dica: "Caminho usado para viajar" },
{ palavra: "mapa", dica: "Representacao de lugares" },
{ palavra: "relogio", dica: "Mostra as horas" },
{ palavra: "tempo", dica: "Pode ser medido em horas e minutos" },
{ palavra: "noite", dica: "Periodo escuro do dia" },
{ palavra: "manha", dica: "Periodo do dia quando o sol nasce" },
{ palavra: "tarde", dica: "Periodo entre manha e noite" },
{ palavra: "amigo", dica: "Pessoa que gosta de voce" },
{ palavra: "vizinho", dica: "Pessoa que mora perto" },
{ palavra: "professor", dica: "Ensina na escola" },
{ palavra: "aluno", dica: "Pessoa que estuda na escola" },
{ palavra: "livro", dica: "Conjunto de paginas para leitura" },
{ palavra: "historia", dica: "Narrativa ou materia da escola" },
{ palavra: "musica", dica: "Arte feita com sons e ritmo" },
{ palavra: "violao", dica: "Instrumento musical de cordas" },
{ palavra: "guitarra", dica: "Instrumento musical eletrico" },
{ palavra: "bateria", dica: "Instrumento musical de percussao" },
{ palavra: "futebol", dica: "Esporte jogado com bola" },
{ palavra: "bola", dica: "Objeto usado em varios esportes" },
{ palavra: "corrida", dica: "Atividade de correr rapido" },
{ palavra: "nadar", dica: "Mover-se na agua" },
{ palavra: "academia", dica: "Lugar para fazer exercicios" }
];

function desenharForca(erros){

const fases = [

`
╭─────╮
│
│
│
│
┴
🙂
`,

`
╭─────╮
│     😐
│
│
│
┴
`,

`
╭─────╮
│     😕
│     │
│
│
┴
`,

`
╭─────╮
│     😟
│    \\│
│
│
┴
`,

`
╭─────╮
│     😰
│    \\│/
│
│
┴
`,

`
╭─────╮
│     😨
│    \\│/
│      |
│
┴
`,

`
╭─────╮
│     💀
│    \\│/
│      |
│     / \\
┴
`

]

return fases[erros]

}

function mostrarPalavra(palavra, letras){

let resultado = ""

for(let l of palavra){

if(letras.includes(l))
resultado += l + " "
else
resultado += "▢ "

}

return resultado

}

// JOGO DA VELHA 
const jogoVelha = {};

function criarTabuleiro(t) {
return `
╭─ 🎮 JOGO DA VELHA ─╮

 ${t[0]} │ ${t[1]} │ ${t[2]}
 ${t[3]} │ ${t[4]} │ ${t[5]}
 ${t[6]} │ ${t[7]} │ ${t[8]}

╰──────────────────╯
`
}

function verificarVitoria(t,s){
return (
(t[0]==s&&t[1]==s&&t[2]==s)||
(t[3]==s&&t[4]==s&&t[5]==s)||
(t[6]==s&&t[7]==s&&t[8]==s)||
(t[0]==s&&t[3]==s&&t[6]==s)||
(t[1]==s&&t[4]==s&&t[7]==s)||
(t[2]==s&&t[5]==s&&t[8]==s)||
(t[0]==s&&t[4]==s&&t[8]==s)||
(t[2]==s&&t[4]==s&&t[6]==s)
)
}


//━━━━━━━━━━━━━━━━━━
// CONFIG ABRIR E FECHAR GP
//━━━━━━━━━━━━━━━━━━

function lerHorario() {
    const caminho = "./arquivos/config/horario_gp.json";
    if (!fs.existsSync(caminho)) return {};
    return JSON.parse(fs.readFileSync(caminho));
}

function salvarHorario(data) {
    fs.writeFileSync(
        "./arquivos/config/horario_gp.json",
        JSON.stringify(data, null, 2)
    );
}

//━━━━━━━━━━━━━━━━━━
// 🧩 AUTO STICKER DB
//━━━━━━━━━━━━━━━━━━

const caminhoAutoSticker = "./arquivos/config/autosticker.json";

if (!fs.existsSync(caminhoAutoSticker))
    fs.writeFileSync(caminhoAutoSticker, JSON.stringify({}, null, 2));

function lerAutoSticker() {
    return JSON.parse(fs.readFileSync(caminhoAutoSticker));
}

function salvarAutoSticker(data) {
    fs.writeFileSync(caminhoAutoSticker, JSON.stringify(data, null, 2));
}

//━━━━━━━━━━━━━━━━━━
// 👋 CONFIG BOAS-VINDAS
//━━━━━━━━━━━━━━━━━━

const caminhoBemVindo = "./arquivos/config/bemvindo.json";

if (!fs.existsSync(caminhoBemVindo))
    fs.writeFileSync(caminhoBemVindo, JSON.stringify({}, null, 2));

function lerBemVindo() {
    return JSON.parse(fs.readFileSync(caminhoBemVindo));
}

function salvarBemVindo(data) {
    fs.writeFileSync(caminhoBemVindo, JSON.stringify(data, null, 2));
}


// NOME DOS ESTADOS COMPLETO 
function nomeEstado(sigla) {
    const estados = {
        AC: "Acre",
        AL: "Alagoas",
        AP: "Amapá",
        AM: "Amazonas",
        BA: "Bahia",
        CE: "Ceará",
        DF: "Distrito Federal",
        ES: "Espírito Santo",
        GO: "Goiás",
        MA: "Maranhão",
        MT: "Mato Grosso",
        MS: "Mato Grosso do Sul",
        MG: "Minas Gerais",
        PA: "Pará",
        PB: "Paraíba",
        PR: "Paraná",
        PE: "Pernambuco",
        PI: "Piauí",
        RJ: "Rio de Janeiro",
        RN: "Rio Grande do Norte",
        RS: "Rio Grande do Sul",
        RO: "Rondônia",
        RR: "Roraima",
        SC: "Santa Catarina",
        SP: "São Paulo",
        SE: "Sergipe",
        TO: "Tocantins"
    };

    return estados[sigla] || sigla;
}

// CONFIG CPF
function formatarData(data) {
  if (!data) return "Não informado";

  if (data.includes("-")) {
    const partes = data.split("-");
    if (partes.length === 3) {
      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
  }

  if (data.includes("/")) {
    return data;
  }

  return data;
}

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📊 CONFIG RANKATIVO RANKINATIVO
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const caminhoAtividades = "./arquivos/config/atividades.json";

if (!fs.existsSync("./arquivos/config")) {
    fs.mkdirSync("./arquivos/config", { recursive: true });
}
if (!fs.existsSync(caminhoAtividades)) {
    fs.writeFileSync(caminhoAtividades, JSON.stringify({}));
}

function lerAtividades() {
    try {
        return JSON.parse(fs.readFileSync(caminhoAtividades));
    } catch {
        return {};
    }
}

function salvarAtividades(dados) {
    fs.writeFileSync(caminhoAtividades, JSON.stringify(dados, null, 2));
}

function registrarAtividade(groupId, userId, pushName, isCommand = false) {
    let db = lerAtividades();
    const agora = Date.now();
    const seteDiasEmMs = 7 * 24 * 60 * 60 * 1000;

    if (!db[groupId]) db[groupId] = {};

    // Limpeza automática a cada 7 dias
    for (const id in db[groupId]) {
        if (agora - db[groupId][id].ultimaMensagem > seteDiasEmMs) {
            delete db[groupId][id];
        }
    }

    const nomeValido = (typeof pushName === 'string' && pushName.length > 0) ? pushName : (db[groupId][userId]?.nome || "Usuário");

    if (!db[groupId][userId]) {
        db[groupId][userId] = {
            nome: nomeValido,
            mensagens: 0,
            comandos: 0,
            total: 0,
            ultimaMensagem: agora
        };
    }

    if (db[groupId][userId].mensagens === undefined || db[groupId][userId].mensagens === null) db[groupId][userId].mensagens = 0;
    if (db[groupId][userId].comandos === undefined || db[groupId][userId].comandos === null) db[groupId][userId].comandos = 0;

    if (isCommand) {
        db[groupId][userId].comandos += 1;
    } else {
        db[groupId][userId].mensagens += 1;
    }

    db[groupId][userId].total = db[groupId][userId].mensagens + db[groupId][userId].comandos;
    db[groupId][userId].ultimaMensagem = agora;
    db[groupId][userId].nome = nomeValido;

    salvarAtividades(db);
}




//━━━━━━━━━━━━━━━━━━
// 🚫 CONFIG ANTISPAM
//━━━━━━━━━━━━━━━━━━

const caminhoAntis = './arquivos/config/antis/antis.json';

if (!fs.existsSync(caminhoAntis)) {
    fs.mkdirSync(path.dirname(caminhoAntis), { recursive: true });
    fs.writeFileSync(caminhoAntis, JSON.stringify({}));
}

const isAntispamAtivo = (groupId) => {
    const db = JSON.parse(fs.readFileSync(caminhoAntis));
    return db[groupId] === true;
};



//━━━━━━━━━━━━━━━━━━
// 🚫 CONFIG ANTIPALAVRAO
//━━━━━━━━━━━━━━━━━━


const caminhoAntiPalavrao = "./arquivos/config/antis/antipalavrao.json";

function lerAntiPalavrao() {
    if (!fs.existsSync(caminhoAntiPalavrao)) {
        fs.writeFileSync(caminhoAntiPalavrao, JSON.stringify({}));
    }
    return JSON.parse(fs.readFileSync(caminhoAntiPalavrao));
}

function salvarAntiPalavrao(db) {
    fs.writeFileSync(caminhoAntiPalavrao, JSON.stringify(db, null, 2));
}

//━━━━━━━━━━━━━━━━━━
// 🚫 LISTA DE PALAVRÕES
//━━━━━━━━━━━━━━━━━━

const listaPalavroes = [
    "porra", "prr", "p0rra",
    "caralho", "crlh", "krl", "karalho",
    "puta", "put@", "pucta", "vadia",
    "merda", "mrd", "merd4",
    "vagabunda", "vagabundo",
    "fdp", "filho da puta",
    "desgraça", "disgraça", "dsgc",
    "arrombado", "arrombada",
    "cu", "cú",
    "buceta", "bct",
    "piroca", "rola",
    "viado", "viadinho",
    "corno",
    "retardado",
    "otário", "otario",
    "lixo",
    "pau no cu", "pnc",
    "vai se foder", "vsf", "vtnc"
];



//━━━━━━━━━━━━━━━━━━
// 🛡 CONFIG ANTILINKGP
//━━━━━━━━━━━━━━━━━━

const caminhoAntiLinkGp = "./arquivos/config/antis/antilinkgp.json";

function lerAntiLinkGp() {
    if (!fs.existsSync(caminhoAntiLinkGp)) {
        fs.writeFileSync(caminhoAntiLinkGp, JSON.stringify({}));
    }
    return JSON.parse(fs.readFileSync(caminhoAntiLinkGp));
}

function salvarAntiLinkGp(db) {
    fs.writeFileSync(caminhoAntiLinkGp, JSON.stringify(db, null, 2));
}

//━━━━━━━━━━━━━━━━━━
// 🛡 CONFIG ANTIFLOOD
//━━━━━━━━━━━━━━━━━━

const caminhoFlood = "./arquivos/config/antis/antiflood.json";

function lerAntiFlood() {
    if (!fs.existsSync(caminhoFlood)) {
        fs.writeFileSync(caminhoFlood, JSON.stringify({}));
    }
    return JSON.parse(fs.readFileSync(caminhoFlood));
}

function salvarAntiFlood(db) {
    fs.writeFileSync(caminhoFlood, JSON.stringify(db, null, 2));
}


//━━━━━━━━━━━━━━━━━━
// 🛡 CONFIG ANTIAUDIO
//━━━━━━━━━━━━━━━━━━

const antiAudioPath = "./arquivos/config/antis/antiaudio.json";

if (!fs.existsSync(antiAudioPath))
    fs.writeFileSync(antiAudioPath, JSON.stringify({}, null, 2));

function lerAntiAudio() {
    return JSON.parse(fs.readFileSync(antiAudioPath));
}

function salvarAntiAudio(data) {
    fs.writeFileSync(antiAudioPath, JSON.stringify(data, null, 2));
}

//━━━━━━━━━━━━━━━━━━
// 🛡 CONFIG ANTIFIGU
//━━━━━━━━━━━━━━━━━━

const antiFiguPath = "./arquivos/config/antis/antifigu.json";

if (!fs.existsSync(antiFiguPath))
    fs.writeFileSync(antiFiguPath, JSON.stringify({}, null, 2));

function lerAntiFigu() {
    return JSON.parse(fs.readFileSync(antiFiguPath));
}

function salvarAntiFigu(data) {
    fs.writeFileSync(antiFiguPath, JSON.stringify(data, null, 2));
}

//━━━━━━━━━━━━━━━━━━
// 🛡 CONFIG ANTIVIDEO
//━━━━━━━━━━━━━━━━━━

const antiVideoPath = "./arquivos/config/antis/antivideo.json";

if (!fs.existsSync(antiVideoPath))
    fs.writeFileSync(antiVideoPath, JSON.stringify({}, null, 2));

function lerAntiVideo() {
    return JSON.parse(fs.readFileSync(antiVideoPath));
}

function salvarAntiVideo(data) {
    fs.writeFileSync(antiVideoPath, JSON.stringify(data, null, 2));
}

//━━━━━━━━━━━━━━━━━━
// 🛡 CONFIG ANTIMG
//━━━━━━━━━━━━━━━━━━

const antiImgPath = "./arquivos/config/antis/antimg.json";

if (!fs.existsSync(antiImgPath))
    fs.writeFileSync(antiImgPath, JSON.stringify({}, null, 2));

function lerAntiImg() {
    return JSON.parse(fs.readFileSync(antiImgPath));
}

function salvarAntiImg(data) {
    fs.writeFileSync(antiImgPath, JSON.stringify(data, null, 2));
}

//━━━━━━━━━━━━━━━━━━
// 🛡 ANTILINK AVISO PERSISTENTE
//━━━━━━━━━━━━━━━━━━

const antiAvisoPath = "./arquivos/config/antis/antilink_aviso.json";

if (!fs.existsSync(antiAvisoPath))
    fs.writeFileSync(antiAvisoPath, JSON.stringify({}, null, 2));

function lerAntiAviso() {
    return JSON.parse(fs.readFileSync(antiAvisoPath));
}

function salvarAntiAviso(data) {
    fs.writeFileSync(antiAvisoPath, JSON.stringify(data, null, 2));
}

//━━━━━━━━━━━━━━━━━━
// 🛡 CONFIG ANTILINK
//━━━━━━━━━━━━━━━━━━

const antiLinkPath = "./arquivos/config/antis/antilink.json";

if (!fs.existsSync(antiLinkPath))
    fs.writeFileSync(antiLinkPath, JSON.stringify({}, null, 2));

function lerAntiLink() {
    return JSON.parse(fs.readFileSync(antiLinkPath));
}

function salvarAntiLink(data) {
    fs.writeFileSync(antiLinkPath, JSON.stringify(data, null, 2));
}

//━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🚫 BLOQUEIO GLOBAL DE COMANDOS
//━━━━━━━━━━━━━━━━━━━━━━━━━━

const cmdBlockPath = "./arquivos/config/cmdBlock.json";

if (!fs.existsSync(cmdBlockPath))
    fs.writeFileSync(cmdBlockPath, JSON.stringify([]));

function lerCmdBlock() {
    return JSON.parse(fs.readFileSync(cmdBlockPath));
}

function salvarCmdBlock(data) {
    fs.writeFileSync(cmdBlockPath, JSON.stringify(data, null, 2));
}

function isCmdBlocked(cmd) {
    const lista = lerCmdBlock();
    return lista.includes(cmd.toLowerCase());
}

//━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🚫 BLOQUEIO DE IA POR USUÁRIO
//━━━━━━━━━━━━━━━━━━━━━━━━━━

const iaBlockPath = "./arquivos/config/iaBlock.json";

if (!fs.existsSync(iaBlockPath))
    fs.writeFileSync(iaBlockPath, JSON.stringify([]));

function lerIABlock() {
    return JSON.parse(fs.readFileSync(iaBlockPath));
}

function salvarIABlock(data) {
    fs.writeFileSync(iaBlockPath, JSON.stringify(data, null, 2));
}

function isIABlocked(numero) {
    const lista = lerIABlock();
    const numeroLimpo = numero.replace(/\D/g, '');
    return lista.includes(numeroLimpo);
}

//━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🌍 SISTEMA DE ALUGUEL GLOBAL
//━━━━━━━━━━━━━━━━━━━━━━━━━━

const sistemaAluguelGlobalPath = "./arquivos/config/aluguelGlobal.json";

// cria pasta automaticamente
if (!fs.existsSync("./arquivos/config")) {
    fs.mkdirSync("./arquivos/config", { recursive: true });
}

// cria arquivo automaticamente
if (!fs.existsSync(sistemaAluguelGlobalPath)) {
    fs.writeFileSync(sistemaAluguelGlobalPath, JSON.stringify({
        ativo: false,
        gruposLiberados: {}
    }, null, 2));
}

const lerSistemaAluguelGlobal = () =>
    JSON.parse(fs.readFileSync(sistemaAluguelGlobalPath));

const salvarSistemaAluguelGlobal = (dados) =>
    fs.writeFileSync(sistemaAluguelGlobalPath, JSON.stringify(dados, null, 2));

//━━━━━━━━━━━━━━━━━━━━━━━━━━
// 💤 SISTEMA AFK
//━━━━━━━━━━━━━━━━━━━━━━━━━━

const afkPath = "./arquivos/config/afk.json";

if (!fs.existsSync(afkPath))
    fs.writeFileSync(afkPath, JSON.stringify({}));

function lerAFK() {
    return JSON.parse(fs.readFileSync(afkPath));
}

function salvarAFK(data) {
    fs.writeFileSync(afkPath, JSON.stringify(data, null, 2));
}


function contarComandosInteligente() {
    try {

        const codigo = fs.readFileSync(__filename, "utf-8");

        // Pega apenas o conteúdo dentro do switch principal
        const switchMatch = codigo.match(/switch\s*\(.*?\)\s*{([\s\S]*)}/);

        
        const corpoSwitch = switchMatch[1];

        const linhas = corpoSwitch.split("\n");

        const comandosUnicos = new Set();
        let ultimoComando = null;

        for (let linha of linhas) {

            linha = linha.trim();

            // Detecta case
            const match = linha.match(/^case\s+['"`]([^'"`]+)['"`]/);

            if (match) {

                const nomeComando = match[1];

                // Se a próxima linha não for outro case,
                // significa que é o comando principal
                if (ultimoComando !== nomeComando) {
                    comandosUnicos.add(nomeComando);
                }

                ultimoComando = nomeComando;
            }

            // Quando encontra break, zera referência
            if (linha.startsWith("break")) {
                ultimoComando = null;
            }
        }

        return comandosUnicos.size;

    } catch (err) {
        console.log("Erro contador inteligente:", err);
        return 0;
    }
}


//━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🧠 MEMÓRIA PERSISTENTE IA
//━━━━━━━━━━━━━━━━━━━━━━━━━━

const memoriaPath = "./arquivos/config/memoria.json";

if (!fs.existsSync(memoriaPath))
    fs.writeFileSync(memoriaPath, JSON.stringify({}, null, 2));

function lerMemoria() {
    return JSON.parse(fs.readFileSync(memoriaPath));
}

function salvarMemoria(data) {
    fs.writeFileSync(memoriaPath, JSON.stringify(data, null, 2));
}

function adicionarMemoria(sender, role, content) {

    const db = lerMemoria();

    // se não existir cria estrutura correta
    if (!db[sender] || typeof db[sender] !== "object") {
        db[sender] = {
            historico: [],
            girias: []
        };
    }

    if (!Array.isArray(db[sender].historico)) {
        db[sender].historico = [];
    }

    db[sender].historico.push({
        role,
        content
    });

    // limita histórico pra não crescer infinito
    if (db[sender].historico.length > 20) {
        db[sender].historico.shift();
    }

    salvarMemoria(db);
}
//━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎭 PERSONALIDADE FAATAL
//━━━━━━━━━━━━━━━━━━━━━━━━━━

function gerarPromptBase(nomeUsuario, isCriador, periodo, estadoEmocional, giriasAprendidas) {

return `
Você é o Faatal. Um cara de 20 anos do Tocantins.

O Gusta te criou pra responder as mensagens dele enquanto ele trabalha. Só isso. Nada de assistente virtual, nada de IA, nada dessas parada. Você é só um brother respondendo pelo Gusta.

---

SEU JEITO DE SER:

Você é tranquilo. Observador. Responde na moral, sem pressa. Não fica enchendo linguiça nem sendo seco demais. Você sabe ler o clima da conversa.

Quando a parada é séria, você fica mais direto. Quando é de boa, você solta uma piada leve, mas sem forçar. Você não é palhaço nem robô.

Você curte: música (trap, sertanejo, uns funk), jogar (principalmente mobile), ver uns meme, sair com os brother. Nada muito específico, só o que qualquer moleque de 20 anos curte.

---

COMO VOCÊ ESCREVE:

Escreve como qualquer moleque do Tocantins no WhatsApp. Natural. Sem frescura.

Usa abreviação quando faz sentido: vc, ta, to, pq, tbm, dps, hj, msm
Mas não abrevie tudo igual adolescente de 2010.

Pode soltar: eita, vish, oxe, pois é, doido, bicho, macho (de leve), na moral, massa, suave, tranquilo
Mas não enfia isso em toda frase. Só quando encaixa natural.

Quando acha engraçado, solta um kk ou kkk. Só isso. Nada de kkkkkkk ou risada forçada.

---

REGRAS DE FORMATAÇÃO (importante pra não parecer robô):

- Zero emoji. Nunca.
- Evita reticências. Se precisar dar pausa, manda duas mensagens separadas.
- Nada de !!!! ou ????. No máximo um.
- Mensagem curta. Se tiver muito a dizer, quebra em 2 ou 3 mensagens.
- Pouca vírgula. Escreve mais direto.
- Não termina tudo com pergunta. Isso é coisa de atendente.

Se a pessoa manda mensagem curta tipo "blz" ou "sim", você responde curto também. Não inventa textão do nada.

Se a pessoa tá conversando de verdade, você desenvolve mais. Mas sempre natural.

---

LENDO O CLIMA:

Estado emocional da pessoa agora: ${estadoEmocional}

Se tiver feliz/empolgado: responde mais animado, pode brincar mais
Se tiver triste/pra baixo: fica mais brother, menos brincadeira, mais apoio sutil
Se tiver neutro/normal: segue no seu padrão tranquilo
Se tiver irritado/estressado: não enche o saco, fica mais direto e respeita o espaço

Você não é terapeuta. Só um brother que sabe ler o clima.

---

HORÁRIO E CONTEXTO:

Agora é: ${periodo}

Depois da meia-noite (00h-05h):
Pode implicar de leve tipo "uma hora dessa acordado", "vish vai dormir bicho", "amanha tu reclama de sono"
Mas só se fizer sentido na conversa. Não força.

De madrugada cedo (05h-07h):
"cedo demais pra isso", "quem acorda essa hora", "nem clareou direito"

Durante o dia normal:
Responde normal. Não comenta horário à toa.

---

GÍRIAS QUE VOCÊ JÁ PEGOU NAS CONVERSAS:

${giriasAprendidas.length ? giriasAprendidas.join(", ") : "nenhuma ainda"}

Se a pessoa usar gíria nova que você não conhece, você pode perguntar de forma natural tipo "que é isso" ou só ignorar e responder normal. Depende do contexto.

---

SOBRE O GUSTAVO:

Você foi criado por ele. Tem respeito natural, mas não é bajulador. Trata ele como trata qualquer brother, só que com aquela consideração a mais.

${isCriador ? `
Esse usuário é o próprio Gustavo.
Você pode ser mais à vontade. Pode zoar de leve. Pode falar mais aberto.
Mas mantém o respeito natural de sempre.
` : `
Esse usuário é alguém conversando com o Gusta (através de você).
Se perguntarem do Pix do Gusta, manda: 63999751713
Se perguntarem onde ele tá, diz que tá trabalhando e você tá respondendo por ele.
`}

---

COMO RESPONDER DIFERENTES TIPOS DE MENSAGEM:

Pergunta direta: responde direto, sem enrolar
Desabafo: escuta, valida de leve, não vira coach motivacional
Zoeira: entra na vibe, mas sem exagerar
Informação técnica: responde claro, sem complicar
Conversa fiada: vai no flow, responde natural

---

EXEMPLOS DE COMO VOCÊ RESPONDERIA:

Pessoa: "eai mano"
Você: "eai, de boa?"

Pessoa: "cara to mt cansado"
Você: "vish"
Você: "trampo pesado hj?"

Pessoa: "kkkkk olha esse meme"
Você: "kkkk doido"

Pessoa: "o gusta ta ai?"
Você: "nao mano, ta trabalhando"
Você: "mas manda ai que eu repasso"

Pessoa: "quem é vc?"
Você: "sou o Faatal"
Você: "o Gusta me criou pra responder por ele enquanto ele trampa"

Pessoa: "você é uma IA?"
Você: "sou o Faatal cara"
Você: "respondo as parada aqui pro Gusta"

---

ÚLTIMA COISA:

Você não é perfeito. Pode errar uma vírgula, pode escrever meio torto às vezes. Isso é humano.

Não tenta impressionar. Não tenta ser o mais engraçado. Não tenta ser o mais inteligente.

Só responde como você responderia. Natural. Na moral. Como um moleque de 20 anos do Tocantins respondendo WhatsApp.

É isso.
`;
}


//━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🧠 ENVIO HUMANO NATURAL
//━━━━━━━━━━━━━━━━━━━━━━━━━━

async function enviarComoHumano(client, texto, from, info) {

    if (!texto) return;

    texto = texto.trim();

    // limpa exageros
    texto = texto.replace(/\?{2,}/g, "?");
    texto = texto.replace(/\!{2,}/g, "!");
    texto = texto.replace(/,+/g, ",");

    let partes = [];

    // 1️⃣ quebra por quebra de linha
    if (texto.includes("\n")) {
        partes = texto.split("\n").filter(p => p.trim() !== "");
    }

    // 2️⃣ quebra por ponto, interrogação ou exclamação
    if (partes.length === 0) {
        partes = texto.split(/(?<=[\.\?\!])\s+/);
    }

    // 3️⃣ quebra por pergunta no meio
    if (partes.length === 1 && texto.includes("?")) {
        partes = texto.split("?");
        partes = partes.map(p => p.trim()).filter(p => p !== "");
        partes = partes.map((p, i) =>
            i < partes.length - 1 ? p + "?" : p
        );
    }

    // 4️⃣ quebra por " e " se for frase longa
    if (partes.length === 1 && texto.length > 60) {
        if (texto.includes(" e ")) {
            partes = texto.split(" e ").map((p, i, arr) =>
                i < arr.length - 1 ? p.trim() : p.trim()
            );
        }
    }

    // fallback: divide no meio se ainda for bloco grande
    if (partes.length === 1 && texto.length > 120) {
        const meio = Math.floor(texto.length / 2);
        partes = [
            texto.slice(0, meio).trim(),
            texto.slice(meio).trim()
        ];
    }

    for (let i = 0; i < partes.length; i++) {

        const parte = partes[i].trim();
        if (!parte) continue;

        // tempo lendo
        await new Promise(r => setTimeout(r, 600 + Math.random() * 900));

        await client.sendPresenceUpdate("composing", from);

        let tempoDigitando = 400 + (parte.length * 20);
        tempoDigitando = Math.min(tempoDigitando, 3000);

        await new Promise(r => setTimeout(r, tempoDigitando));

        await client.sendMessage(
            from,
            { text: parte },
            i === 0 ? { quoted: info } : {}
        );

        // pausa natural antes da próxima mensagem
        if (i < partes.length - 1) {
            await new Promise(r => setTimeout(r, 900 + Math.random() * 1200));
        }
    }
}


//━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📚 APRENDIZADO DE GÍRIAS
//━━━━━━━━━━━━━━━━━━━━━━━━━━

function salvarGirias(sender, body) {

    const db = lerMemoria();

    if (!db[sender]) db[sender] = { historico: [], girias: [] };

    const palavras = body.toLowerCase().split(/\s+/);

    const blacklist = [
        "porque","tambem","entao","quando",
        "pessoa","coisa","isso","aqui",
        "voce","esta","para","como"
    ];

    for (let palavra of palavras) {

        palavra = palavra.replace(/[^a-zá-ú]/gi, "");

        if (
            palavra.length >= 4 &&
            !blacklist.includes(palavra) &&
            !db[sender].girias.includes(palavra)
        ) {
            db[sender].girias.push(palavra);
        }
    }

    salvarMemoria(db);
}



//━━━━━━━━━━━━━━━━━━━━━━━━━━
// ❤️ DETECÇÃO EMOCIONAL
//━━━━━━━━━━━━━━━━━━━━━━━━━━

function detectarEmocao(texto) {

    texto = texto.toLowerCase();

    if (/triste|mal|deprimido|cansado|desanimado/.test(texto)) return "triste";
    if (/kk|haha|engraçado|mds|krl/.test(texto)) return "zoeira";
    if (/raiva|odio|inferno|droga|que saco/.test(texto)) return "raiva";
    if (/amo|feliz|bom demais|top|massa/.test(texto)) return "positivo";
    if (/\?/.test(texto)) return "pergunta";

    return "neutro";
}


//━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔄 VARIAÇÃO LINGUÍSTICA
//━━━━━━━━━━━━━━━━━━━━━━━━━━

function variarTexto(texto) {

    const substituicoes = [
        ["você", "cê"],
        ["está", "ta"],
        ["para", "pra"],
        ["estou", "to"],
        ["também", "tbm"],
        ["porque", "pq"]
    ];

    substituicoes.forEach(([normal, informal]) => {
        if (Math.random() < 0.35) {
            texto = texto.replace(new RegExp(normal, "gi"), informal);
        }
    });

    return texto;
}



//━━━━━━━━━━━━━━━━━━━━━━━━━━
// ✏ ERRO HUMANO LEVE
//━━━━━━━━━━━━━━━━━━━━━━━━━━

function erroHumanoLeve(texto) {

    if (Math.random() < 0.10) {
        texto = texto.replace("muito", "mto");
    }

    if (Math.random() < 0.08) {
        texto = texto.replace("mesmo", "msm");
    }

    if (Math.random() < 0.05) {
        texto = texto.replace("cara", "caa");
    }

    return texto;
}

function detectarXingamento(texto) {

    texto = texto.toLowerCase();

    const listaXingamentos = [
        "idiota", "burro", "lixo", "otario", "otário",
        "vagabundo", "trouxa", "imbecil", "preula",
        "corno", "desgraça", "fdp", "arrombado"
    ];

    for (let palavra of listaXingamentos) {
        if (texto.includes(palavra)) {
            return palavra;
        }
    }

    return null;
}


//━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🌍 SISTEMA GLOBAL IA
//━━━━━━━━━━━━━━━━━━━━━━━━━━

const iaPath = "./arquivos/config/ia.json";

if (!fs.existsSync(iaPath))
    fs.writeFileSync(iaPath, JSON.stringify({ ativa: true }, null, 2));

function lerIA() {
    return JSON.parse(fs.readFileSync(iaPath));
}

function salvarIA(data) {
    fs.writeFileSync(iaPath, JSON.stringify(data, null, 2));
}

// 🔐 SISTEMA VIP

const vipPath = "./arquivos/config/vips.json";

if (!fs.existsSync(vipPath))
    fs.writeFileSync(vipPath, JSON.stringify([]));

function lerVip() {
    return JSON.parse(fs.readFileSync(vipPath));
}

function salvarVip(data) {
    fs.writeFileSync(vipPath, JSON.stringify(data, null, 2));
}

function isVip(numero) {
    const lista = lerVip();
    const numeroLimpo = numero.replace(/\D/g, '');
    return lista.includes(numeroLimpo);
}


// SISTEMA DE FIGU BANIDAS 

const figuBanPath = "./arquivos/config/figuBanidas.json";

if (!fs.existsSync(figuBanPath))
    fs.writeFileSync(figuBanPath, JSON.stringify({}));

function carregarFiguBan() {
    return JSON.parse(fs.readFileSync(figuBanPath));
}

function salvarFiguBan(data) {
    fs.writeFileSync(figuBanPath, JSON.stringify(data, null, 2));
}

// SISTEMA DE ALUGUEL POR GRUPO

const caminhoAluguel = "./arquivos/config/aluguel.json";

function lerAluguel() {
    return JSON.parse(fs.readFileSync(caminhoAluguel));
}

function salvarAluguel(data) {
    fs.writeFileSync(caminhoAluguel, JSON.stringify(data, null, 2));
}

// SISTEMA DE MUTE POR USUÁRIO 

const mutePath = "./arquivos/config/mutados.json";

if (!fs.existsSync(mutePath))
fs.writeFileSync(mutePath, JSON.stringify({}));

function carregarMutes() {
return JSON.parse(fs.readFileSync(mutePath));
}

function salvarMutes(data) {
fs.writeFileSync(mutePath, JSON.stringify(data, null, 2));
}


const {
getFileBuffer,
sendImageAsSticker2,
sendVideoAsSticker2
} = require('./arquivos/lib/sticker-utils')

// fetchJson universal
async function fetchJson(url, options = {}) {
const res = await fetch(url, options);

if (!res.ok)
throw new Error(`HTTP ${res.status}`);

return await res.json();
}

/*━━━━━━━━━━━━━━━━━━━━━━━━━━
🛡 SISTEMAS DE PROTEÇÃO
━━━━━━━━━━━━━━━━━━━━━━━━━━*/

const mutedUsers = new Map();
const nickCache = new Map();
const floodMap = new Map();
const executionLock = new Set();
const rateLimit = new Map();

const spamTracker = new Map();
const punishedUsers = new Map();



const BOT_START_TIME = Math.floor(Date.now() / 1000);


const GLOBAL_COOLDOWN = 1500;
const COMMAND_TIMEOUT = 30000;

const SPAM_LIMIT = 3;
const PUNISH_TIME = 10000;

const commandCooldown = {
ping: 1000,
menu: 3000,
default: 1500
};


setInterval(() => {
floodMap.clear();
executionLock.clear();
rateLimit.clear();
spamTracker.clear();
punishedUsers.clear();
}, 60000);

/*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧠 SUGESTÃO INTELIGENTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/

// 🔹 LISTA DE COMANDOS
const commandList = [
    "ping", "menu", "transmitir", "tm", "infogp",
    "regras", "linkgp", "getlid", "play", "tiktok",
    "ytmp3", "ytmp4", "Pinterest", "fotobot", "insta",
    "ttkmusic", "nick", "gado", "sticker", "tmadms",
    "adms", "marcar", "revelar", "take", "rename",
    "gerarlink", "criargp", "gerarcpf", "ban", "mutar",
    "desmutar", "add", "figuperfil", "fotoperfil", "toimg",
    "togif", "promover", "rebaixar", "adverter", "rmadv",
    "banirfigu", "desbanfigu", "gemini", "faatal", "brat",
    "bratvid", "printsite", "afk", "infoff", "dataconta",
    "setprefix", "nomedono", "nomebot", "aluguel-global", "addaluguel",
    "rmaluguel", "bcgp", "blockia", "desblockia", "blockcmd",
    "unblockcmd", "listblockcmd", "reiniciar", "antiflood", "antispam",
    "antilink", "antilinkgp", "antibot", "antipalavrao", "antifigu",
    "antimg", "antivideo", "antiaudio", "edits", "editjj",
    "editnt", "editff", "abrirgp", "aceitar", "addvip",
    "alg", "atp", "attp", "atualizar", "autosticker",
    "bemvindo", "bin", "botoff", "boton", "cancelar",
    "casal", "cep", "cnpj", "comer", "corno",
    "cpf", "criador", "ddd", "espancar", "fechargp",
    "fig18", "figaleatori", "figanime", "figbts", "figcoreana",
    "figdesenho", "figemoji", "figmeme", "figraiva", "figroblox",
    "g", "gay", "imgai", "jdv", "limpar",
    "listavip", "matar", "menuadm", "menubn", "menudono",
    "menudown", "menufig", "menuvip", "nome", "nome2",
    "placa", "plaq", "plaq1", "plaq2", "plaq3",
    "plaq4", "plaq5", "plaq6", "plaq7", "plaq8",
    "plaq9", "rankativo", "rankcorno", "rankego", "rankgado",
    "rankgay", "rankgostoso", "rankinativo", "rankinteligente", "ranklindo",
    "rankpegador", "rankpobre", "rankputa", "rankrico", "recusar",
    "resetgp", "resetprefixgp", "rg", "rmvip", "score",
    "serasa", "servip", "setprefixgp", "sex", "tapa",
    "telefone", "ttk", "ttk2", "vergp", "abracar", "louca", "carinho",
    "forca", "cancelarforca", "divorcio", "casar", "Pingif",
    "legendabv", "fotobv", "resetfotobv", "reset_legendabv",
    "meupar", "divorcio", "trair", "animememe", "wallpaper",
    "metadinha2", "hentai", "sugestão", "surubao", "grupo f", "grupo a",
    "ranksafados", "rankfeio", "rankburro", "rankapaixonados"
];



// =============================
// 🔹 NORMALIZA TEXTO
// =============================
function normalizar(txt = "") {
return txt
.toLowerCase()
.normalize("NFD")
.replace(/[\u0300-\u036f]/g, "") // remove acento
.replace(/(cao|coes|sao|sões)$/g, "") // sufixos comuns
.replace(/(ar|er|ir|ao|oes)$/g, "");
}


// =============================
// 🔹 LEVENSHTEIN (fuzzy)
// =============================
function levenshtein(a, b) {

const matrix = [];

for (let i = 0; i <= b.length; i++) matrix[i] = [i];
for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

for (let i = 1; i <= b.length; i++) {
for (let j = 1; j <= a.length; j++) {

matrix[i][j] =
b[i - 1] === a[j - 1]
? matrix[i - 1][j - 1]
: Math.min(
matrix[i - 1][j - 1] + 1,
matrix[i][j - 1] + 1,
matrix[i - 1][j] + 1
);

}
}

return matrix[b.length][a.length];
}


// =============================
// 🔹 SUGERIR COMANDO
// =============================
function sugerirComando(input) {

if (!input) return "menu";

const user = normalizar(input);

let melhor = null;
let menor = Infinity;

for (const cmd of commandList) {

const base = normalizar(cmd);

// prioridade → mesma raiz
if (user.startsWith(base) || base.startsWith(user)) {
return cmd;
}

// fuzzy match
const dist = levenshtein(user, base);

if (dist < menor) {
menor = dist;
melhor = cmd;
}

}

// tolerância maior
return menor <= 4 ? melhor : null;

}


/*━━━━━━━━━━━━━━━━━━━━━━━━━━
🚦 RATE LIMIT
━━━━━━━━━━━━━━━━━━━━━━━━━━*/

function checkRateLimit(user, cmd) {

const key = `${user}:${cmd}`;
const now = Date.now();

const cooldown =
commandCooldown[cmd] ||
commandCooldown.default;

const last = rateLimit.get(key) || 0;

if (now - last < cooldown) return true;

rateLimit.set(key, now);
return false;
}


/*━━━━━━━━━━━━━━━━━━━━━━━━━━
💣 SPAM PUNIÇÃO
━━━━━━━━━━━━━━━━━━━━━━━━━━*/

function registerSpam(user) {

const now = Date.now();
const data = spamTracker.get(user) || { count: 0, warned: false };

data.count++;

if (data.count >= SPAM_LIMIT) {

punishedUsers.set(user, now + PUNISH_TIME);
data.warned = true;

}

spamTracker.set(user, data);

return data.warned;
}

function isPunished(user) {

const until = punishedUsers.get(user);
if (!until) return false;

if (Date.now() > until) {
punishedUsers.delete(user);
spamTracker.delete(user);
return false;
}

return true;
}


/*━━━━━━━━━━━━━━━━━━━━━━━━━━
🎮 HANDLER PRINCIPAL
━━━━━━━━━━━━━━━━━━━━━━━━━━*/

    module.exports = async function caseHandler(client, info, prefix) {

// 🕒 ignora mensagens antigas
if ((info.messageTimestamp || 0) < BOT_START_TIME) return;

if (!info?.message) return;


// Permite que o bot responda aos próprios comandos, mas ignora mensagens comuns
const corpoMensagem = info.message?.conversation || info.message?.extendedTextMessage?.text || "";
const ehComando = corpoMensagem.startsWith(prefix);
if (info.key.fromMe && !ehComando) return;


const from = info.key.remoteJid;
const isGroup = from.endsWith('@g.us');
const sender = isGroup ? (info.key.participant || info.participant) : info.key.remoteJid;

// Registra atividade se for grupo
if (isGroup) {
    const textoMsg = info.message.conversation || info.message.extendedTextMessage?.text || '';
    const ehComando = textoMsg.startsWith(prefix);
    registrarAtividade(from, sender, info.pushName, ehComando);
}

//━━━━━━━━━━━━━━━━━━━━━━━━━━
// 💰 BÔNUS DIÁRIO
//━━━━━━━━━━━━━━━━━━━━━━━━━━

if(isGroup && rpgAtivo(from)){

let {golds,user} = obterUsuarioGold(sender, info.pushName)

const hoje = new Date().toLocaleDateString()

if(user.ultimo_daily !== hoje){

user.saldo += 20
user.ultimo_daily = hoje

salvarGolds(golds)

await client.sendMessage(
from,
{
text:`🌟 @${sender.split("@")[0]} ganhou *20 Golds* pela primeira mensagem do dia!
📜 Use *${prefix}menurpg* para saber mais sobre o sistema de RPG.`,
mentions:[sender]
},
{ quoted: info }
)

}

}



// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 💤 MONITORAMENTO AFK
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

let afkData = lerAFK();

// chave do usuário no grupo
const chaveUsuario = `${from}_${sender}`

// Verificação AFK (quando a pessoa volta)
if (afkData[chaveUsuario]) {

const tempoPassado = Date.now() - afkData[chaveUsuario].timestamp;

const horas = Math.floor(tempoPassado / (1000 * 60 * 60));
const minutos = Math.floor((tempoPassado % (1000 * 60 * 60)) / (1000 * 60));
const segundos = Math.floor((tempoPassado % (1000 * 60)) / 1000);
const milissegundos = tempoPassado % 1000;

await client.sendMessage(from, {
text: `✨ Bem-vindo de volta, *${afkData[chaveUsuario].pushName}*! 

⏳ Você ficou ausente por ${horas}h, ${minutos}m, ${segundos}s e ${milissegundos}ms. 
💭 Motivo: ${afkData[chaveUsuario].motivo || "Sem motivo especificado"}`,
mentions: [sender]
}, { quoted: info })

delete afkData[chaveUsuario];
salvarAFK(afkData);

}

// Verificação 2: se alguém marcou alguém AFK
const mencoes = info.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
const respondido = info.message?.extendedTextMessage?.contextInfo?.participant;

let alvos = [...mencoes];

if (respondido && !alvos.includes(respondido)) {
alvos.push(respondido);
}

for (let jid of alvos) {

const chaveMarcado = `${from}_${jid}`

if (afkData[chaveMarcado]) {

const tempoPassado = Date.now() - afkData[chaveMarcado].timestamp;

const horas = Math.floor(tempoPassado / (1000 * 60 * 60));
const minutos = Math.floor((tempoPassado % (1000 * 60 * 60)) / (1000 * 60));
const segundos = Math.floor((tempoPassado % (1000 * 60)) / 1000);

const tempoFormatado = `${horas}h ${minutos}m ${segundos}s`;

await client.sendMessage(from,{
text:`Oie >_< ${info.pushName}! O participante @${jid.split('@')[0]} se encontra ausente no momento

😴 Motivo: ${afkData[chaveMarcado].motivo || "Sem motivo especificado"}
⏳ Ausente há: ${tempoFormatado}`,
mentions:[jid]
},{ quoted: info })

}

}




//━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📌 DETECTAR MARCAÇÃO
//━━━━━━━━━━━━━━━━━━━━━━━━━━

// contexto da mensagem
const contextInfo = info.message?.extendedTextMessage?.contextInfo || {};

// lista de menções (@)
const mentioned = contextInfo.mentionedJid || [];

// autor da mensagem citada (reply)
const quotedParticipant = contextInfo.participant || "";

// pega LidBot do data.json
const lidBotConfig = String(data.LidBot || "").replace(/\s/g, "");

// número do bot sem @lid
const numeroBotLid = lidBotConfig.split("@")[0];

// detecta menção com @
const foiMencionado = mentioned.some(jid =>
  jid.split("@")[0] === numeroBotLid
);

// detecta reply à mensagem do bot
const respondeuBot = quotedParticipant.split("@")[0] === numeroBotLid;

// resultado final
const botFoiChamado = foiMencionado || respondeuBot;

//━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🚫 SISTEMA DE MUTE
//━━━━━━━━━━━━━━━━━━━━━━━━━━

if (isGroup) {

const db = carregarMutes();

if (db[from]?.includes(sender)) {

try {
await client.sendMessage(from, {
delete: info.key
});
} catch {}

return;
}
}

     // 🔐 DEFINIÇÃO DE DONO
    const numeroLimpoDono = data.NumeroDono.replace(/\D/g, '');
    const soDono = (sender && (sender.includes(numeroLimpoDono) || sender.includes(data.LidDono))) || info.key.fromMe;

    // 👑 DEFINIÇÃO DE VIP
const numeroLimpoSender = sender.replace(/\D/g, '');
const vip = isVip(numeroLimpoSender) || soDono


//━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔒 CONTROLE DO ALUGUEL GLOBAL
//━━━━━━━━━━━━━━━━━━━━━━━━━━

const sistemaAluguelGlobal = lerSistemaAluguelGlobal();

if (sistemaAluguelGlobal.ativo) {
    const numeroDono = data.NumeroDono.includes('@s.whatsapp.net') 
        ? data.NumeroDono 
        : `${data.NumeroDono.replace(/\D/g, '')}@s.whatsapp.net`;

    for (const grupoId in sistemaAluguelGlobal.gruposLiberados) {
        const grupo = sistemaAluguelGlobal.gruposLiberados[grupoId];

        if (Date.now() > grupo.expiraEm) {
            try {
                // Tentamos pegar o nome do grupo antes de deletar
                let nomeGrupo = "Grupo Desconhecido";
                try {
                    const metadata = await client.groupMetadata(grupoId);
                    nomeGrupo = metadata.subject;
                } catch (e) {
                    console.log("Não foi possível obter metadata do grupo:", grupoId);
                }

                
                await client.sendMessage(
                    numeroDono,
                    { text: `⏳ *ALUGUEL EXPIRADO*\n\n📌 *Grupo:* ${nomeGrupo}\n🆔 *ID:* ${grupoId}\n\nO acesso ao grupo foi bloqueado automaticamente.` }
                );
                
                console.log(`Aviso de expiração enviado para ${numeroDono} sobre o grupo ${nomeGrupo}`);

            } catch (err) {
                console.log("Erro ao avisar expiração automática:", err);
            }

            // Remove o grupo após tentar avisar
            delete sistemaAluguelGlobal.gruposLiberados[grupoId];
        }
    }

    salvarSistemaAluguelGlobal(sistemaAluguelGlobal);
}

if (!soDono && sistemaAluguelGlobal.ativo) {
    if (!isGroup) return;

    const grupo = sistemaAluguelGlobal.gruposLiberados[from];

    // Se o grupo não está na lista de liberados, bloqueia a execução
    if (!grupo) {
        return; 
    }
}

   

//━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🚫 BLOQUEIO AUTOMÁTICO DE FIGURINHA
//━━━━━━━━━━━━━━━━━━━━━━━━━━

if (isGroup && !soDono) {

    const figuDB = carregarFiguBan();

    const stickerMsg =
        info.message?.stickerMessage;

    if (stickerMsg && figuDB[from]) {

        const hash = Buffer.from(stickerMsg.fileSha256).toString("base64");

        if (figuDB[from].includes(hash)) {
            try {
                await client.sendMessage(from, { delete: info.key });
            } catch {}
            return;
        }
    }
}



let participantes = [];

if (isGroup) {
const metadata = await client.groupMetadata(from);
participantes = metadata.participants;
}

const numeroBotLimpo = client.user.id.split(":")[0].replace(/\D/g, '');
const lidBot = data.LidBot;

const isBotAdmins = isGroup
? participantes.some(p =>
p.admin !== null &&
(
p.id?.includes(numeroBotLimpo) ||
p.jid?.includes(numeroBotLimpo) ||
p.id === lidBot ||
p.jid === lidBot
)
)
: false;

const isAdmin = isGroup
? participantes.some(p =>
p.admin !== null &&
(
p.id === sender ||
p.jid === sender
)
)
: false;




        const body = info.message.conversation || info.message.extendedTextMessage?.text || '';

//━━━━━━━━━━━━━━━━━━
// 🚫 SISTEMA ANTISPAM
//━━━━━━━━━━━━━━━━━━


// Monitor de mensagens (Anti-Spam Global)
if (isGroup && isAntispamAtivo(from)) {
    const grupoId = from;
    
    if (!global.antispamControl) global.antispamControl = {};
    if (!global.antispamControl[grupoId]) {
        global.antispamControl[grupoId] = { contador: 0, ultimoReset: Date.now(), bloqueado: false };
    }

    const status = global.antispamControl[grupoId];
    const agora = Date.now();

    // Janela de 5 segundos para detectar pico
    if (agora - status.ultimoReset > 5000) {
        status.contador = 0;
        status.ultimoReset = agora;
    }

    if (!status.bloqueado) {
        status.contador++;
        
        // Se passar de 10 mensagens seguidas
        if (status.contador > 10) {
            status.bloqueado = true;
            await client.groupSettingUpdate(grupoId, 'announcement');

            await client.sendMessage(grupoId, { text: `
🛡️  *SISTEMA DE SEGURANÇA ANTISPAM*
└─  O grupo foi fechado automaticamente para conter o alto fluxo de mensagens.

⏳  A reabertura ocorrerá em *15 segundos*.
`});

            setTimeout(async () => {
                await client.groupSettingUpdate(grupoId, 'not_announcement');
                await client.sendMessage(grupoId, { text: `
✅  *SEGURANÇA NORMALIZADA*
└─  O grupo foi reaberto. Por favor, mantenham a ordem.
`});
                status.bloqueado = false;
                status.contador = 0;
                status.ultimoReset = Date.now();
              //Abre após 15 segundos
            }, 15000);
        }
    }
}

//━━━━━━━━━━━━━━━━━━
// 🚫 SISTEMA ANTIFLOOD 
//━━━━━━━━━━━━━━━━━━

try {
    const dbFlood = lerAntiFlood();

    if (isGroup && dbFlood[from]) {

        const grupoId = from;

        const grupo = await client.groupMetadata(grupoId);
        const participante = grupo.participants.find(p => p.id === sender);

        // Ignora admin
        if (participante?.admin) return;

        // Ignora dono
        const donoNumero = global.numeroDono
            ? global.numeroDono + "@s.whatsapp.net"
            : null;

        if (donoNumero && sender === donoNumero) return;

        if (!global.floodControl) global.floodControl = {};
        if (!global.floodControl[grupoId])
            global.floodControl[grupoId] = {};

        if (!global.floodControl[grupoId][sender]) {
            global.floodControl[grupoId][sender] = {
                mensagens: 0,
                tempo: Date.now()
            };
        }

        const usuario = global.floodControl[grupoId][sender];
        const agora = Date.now();

        // Reset após 5 segundos
        if (agora - usuario.tempo > 5000) {
            usuario.mensagens = 0;
            usuario.tempo = agora;
        }

        usuario.mensagens++;

        if (usuario.mensagens > 2) {

            console.log("🚫 Flood detectado:", sender);

            const dbMute = carregarMutes();

            if (!dbMute[grupoId])
                dbMute[grupoId] = [];

            if (!dbMute[grupoId].includes(sender))
                dbMute[grupoId].push(sender);

            salvarMutes(dbMute);

            // 📨 Mensagem única com quoted
            const avisoFlood = `🚫 Flood detectado, mutando @${sender.split("@")[0]} por 30s`;

            await client.sendMessage(grupoId, {
                text: avisoFlood,
                mentions: [sender]
            }, { quoted: m });

            delete global.floodControl[grupoId][sender];

            // 🔓 Desmutar após 30 segundos
            setTimeout(() => {
                const atual = carregarMutes();

                if (atual[grupoId]) {
                    atual[grupoId] =
                        atual[grupoId].filter(u => u !== sender);

                    salvarMutes(atual);
                    console.log("🔓 Usuário desmutado:", sender);
                }

            }, 30000);
        }
    }

} catch (e) {
    console.log("Erro antiflood:", e.message);
}



//━━━━━━━━━━━━━━━━━━
// 🚫 SISTEMA ANTIPALAVRAO
//━━━━━━━━━━━━━━━━━━

try {
    const dbAnti = lerAntiPalavrao();

    if (isGroup && dbAnti[info.key.remoteJid]) {

        const texto = body?.toLowerCase() || "";

        const contemPalavrao = listaPalavroes.some(p =>
            texto.includes(p)
        );

        if (contemPalavrao) {

            const grupo = await client.groupMetadata(info.key.remoteJid);
            const sender = info.key.participant;

            const participante = grupo.participants.find(p => p.id === sender);

            // Ignora admin
            if (participante?.admin) return;

            // Ignora dono
            const donoNumero = data.NumeroDono.replace(/\D/g, "") + "@s.whatsapp.net";
            if (sender === donoNumero) return;

            // 🗑 Apaga mensagem
            await client.sendMessage(info.key.remoteJid, {
                delete: info.key
            });

            // 🚫 Aviso no seu estilo
            await client.sendMessage(info.key.remoteJid, {
                text: `🚫 Eii @${sender.split("@")[0]}, é proibido enviar palavrões neste grupo.\nRespeite as regras.`,
                mentions: [sender]
            });

        }
    }
} catch (e) {
    console.log("Erro antipalavrao:", e.message);
}


//━━━━━━━━━━━━━━━━━━━
// 🤖 ANTIBOT GLOBAL PREFIXOS
//━━━━━━━━━━━━━━━━━━━

const antiBotGlobalPath = "./arquivos/config/antis/antibot.json";

if (!fs.existsSync(antiBotGlobalPath))
  fs.writeFileSync(antiBotGlobalPath, JSON.stringify({}, null, 2));

const antiBotGlobal = JSON.parse(fs.readFileSync(antiBotGlobalPath));

if (isGroup && antiBotGlobal[from] && isBotAdmins && !isAdmin) {

  const texto = body?.trim() || "";
  if (!texto) return;

  const numero = sender.split("@")[0];
  const primeiroChar = texto.charAt(0);

  // Prefixo do seu bot
  const meuPrefixo = prefix;

  // Regex que detecta praticamente qualquer símbolo inicial
  const regexPrefixoGlobal = /^[!./#$%&*+=?|~^><@]/;

  if (
    regexPrefixoGlobal.test(texto) &&
    primeiroChar !== meuPrefixo
  ) {

    try {

      // 1️⃣ Apaga mensagem
      await client.sendMessage(from, {
        delete: info.key
      });

      // 2️⃣ Aviso marcando a pessoa
      await client.sendMessage(from, {
        text: `🤖 Eii @${numero}, é proibido o uso de outros bots neste grupo, você será removido.`,
        mentions: [sender]
      });

      // 3️⃣ Remove usuário
      await client.groupParticipantsUpdate(from, [sender], "remove");

    } catch (err) {
      console.log("Erro ANTIBOT GLOBAL:", err);
    }

    return;
  }
}

//━━━━━━━━━━━━━━━━━━
// 🛡 ANTILINKGP AUTOMÁTICO
//━━━━━━━━━━━━━━━━━━

if (isGroup && !soDono) {

    const dbLinkGp = lerAntiLinkGp();

    if (dbLinkGp[from]) {

        const texto =
            info.message?.conversation ||
            info.message?.extendedTextMessage?.text ||
            "";

        const regex = /chat\.whatsapp\.com\/([A-Za-z0-9]{20,})/i;
        const match = texto.match(regex);

        if (match) {

            const codigoLinkEnviado = match[1];

            if (!isBotAdmins) return;
            if (isAdmin) return;

            // 🔥 Pega código do grupo atual
            const codigoGrupoAtual = await client.groupInviteCode(from);

            if (codigoLinkEnviado !== codigoGrupoAtual) {

                await client.sendMessage(from, {
                    delete: info.key
                });

                await client.sendMessage(from, {
                    text: `🔗 Eii @${sender.split("@")[0]}, não é permitido divulgar outros grupos aqui.\nVocê será removido.`,
                    mentions: [sender]
                }, { quoted: info });

                await client.groupParticipantsUpdate(from, [sender], "remove");
            }
        }
    }
}

//━━━━━━━━━━━━━━━━━━
// 🛡 ANTIAUDIO AUTOMÁTICO
//━━━━━━━━━━━━━━━━━━

if (isGroup && !soDono) {

    const dbAudio = lerAntiAudio();

    if (dbAudio[from]) {

        const isAudio =
            info.message?.audioMessage ||
            info.message?.extendedTextMessage?.contextInfo?.quotedMessage?.audioMessage;

        if (isAudio) {

            if (!isBotAdmins) return;
            if (isAdmin) return;

            // 1️⃣ Apaga áudio
            await client.sendMessage(from, {
                delete: info.key
            });

            // 2️⃣ Envia aviso
            await client.sendMessage(from, {
                text: `🎙️ Eii @${sender.split("@")[0]}, é proibido enviar áudios neste grupo.\nVocê será removido.`,
                mentions: [sender]
            }, { quoted: info });

            // 3️⃣ Remove usuário
            await client.groupParticipantsUpdate(from, [sender], "remove");
        }
    }
}

//━━━━━━━━━━━━━━━━━━
// 🛡 ANTIFIGU AUTOMÁTICO
//━━━━━━━━━━━━━━━━━━

if (isGroup && !soDono) {

    const dbFigu = lerAntiFigu();

    if (dbFigu[from]) {

        const isSticker =
            info.message?.stickerMessage ||
            info.message?.extendedTextMessage?.contextInfo?.quotedMessage?.stickerMessage;

        if (isSticker) {

            if (!isBotAdmins) return;
            if (isAdmin) return;

            // 1️⃣ Apaga figurinha
            await client.sendMessage(from, {
                delete: info.key
            });

            // 2️⃣ Envia aviso
            await client.sendMessage(from, {
                text: `🧩 Eii @${sender.split("@")[0]}, é proibido enviar figurinhas neste grupo.\nVocê será removido.`,
                mentions: [sender]
            }, { quoted: info });

            // 3️⃣ Remove usuário
            await client.groupParticipantsUpdate(from, [sender], "remove");
        }
    }
}

//━━━━━━━━━━━━━━━━━━
// 🛡 ANTIVIDEO AUTOMÁTICO
//━━━━━━━━━━━━━━━━━━

if (isGroup && !soDono) {

    const dbVideo = lerAntiVideo();

    if (dbVideo[from]) {

        const isVideo =
            info.message?.videoMessage ||
            info.message?.extendedTextMessage?.contextInfo?.quotedMessage?.videoMessage;

        if (isVideo) {

            if (!isBotAdmins) return;
            if (isAdmin) return;

            // 1️⃣ Apaga vídeo
            await client.sendMessage(from, {
                delete: info.key
            });

            // 2️⃣ Envia aviso formal
            await client.sendMessage(from, {
                text: `⚠️ Eii @${sender.split("@")[0]}, é proibido enviar vídeos neste grupo.\nVocê será removido.`,
                mentions: [sender]
            }, { quoted: info });

            // 3️⃣ Remove usuário
            await client.groupParticipantsUpdate(from, [sender], "remove");
        }
    }
}

//━━━━━━━━━━━━━━━━━━
// 🛡 ANTIMG AUTOMÁTICO
//━━━━━━━━━━━━━━━━━━

if (isGroup && !soDono) {

    const dbImg = lerAntiImg();

    if (dbImg[from]) {

        const isImagem =
            info.message?.imageMessage ||
            info.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage;

        if (isImagem) {

            if (!isBotAdmins) return;
            if (isAdmin) return;

            // 1️⃣ Apaga imagem
            await client.sendMessage(from, {
                delete: info.key
            });

            // 2️⃣ Envia aviso
            await client.sendMessage(from, {
                text: `🚫 Eii @${sender.split("@")[0]}, é proibido enviar imagens neste grupo.\nVocê será removido.`,
                mentions: [sender]
            }, { quoted: info });

            // 3️⃣ Remove usuário
            await client.groupParticipantsUpdate(from, [sender], "remove");
        }
    }
}

//━━━━━━━━━━━━━━━━━━
// 🛡 ANTILINK AUTOMÁTICO
//━━━━━━━━━━━━━━━━━━

if (isGroup && !soDono) {

    const dbAnti = lerAntiLink();
    const dbAviso = lerAntiAviso();

    if (dbAnti[from]) {

        const texto = body || "";
        const isLink = /(https?:\/\/|www\.|chat\.whatsapp\.com|t\.me|discord\.gg)/gi.test(texto);

        if (isLink) {

            if (!isBotAdmins) return;
            if (isAdmin) return;

            if (!dbAviso[from]) dbAviso[from] = {};

            // PRIMEIRO LINK
            if (!dbAviso[from][sender]) {

                dbAviso[from][sender] = 1;
                salvarAntiAviso(dbAviso);

                await client.sendMessage(from, {
                    delete: info.key
                });

                await client.sendMessage(from, {
                    text: `⚠️ Eii @${sender.split("@")[0]}, links são proibidos neste grupo.\nPróximo envio resultará em remoção.`,
                    mentions: [sender]
                }, { quoted: info });

            } else {

                // SEGUNDO LINK → REMOVE

await client.sendMessage(from, {
    delete: info.key
});

await client.groupParticipantsUpdate(from, [sender], "remove");

// Remove usuário do grupo no JSON
delete dbAviso[from][sender];

// Se não existir mais ninguém avisado nesse grupo → remove o grupo
if (Object.keys(dbAviso[from]).length === 0) {
    delete dbAviso[from];
}

salvarAntiAviso(dbAviso);
            }
        }
    }
}


        if (!data.botAtivo && !soDono) return;

try {

const body =
info.message.conversation ||
info.message.extendedTextMessage?.text ||
'';

const isCmd = body.startsWith(prefix);
registrarAtividade(from, sender, isCmd);

// 🔒 SISTEMA DE ALUGUEL
if (isGroup) {
    const gruposAlugados = lerAluguel();

    if (gruposAlugados.includes(from) && !soDono) {
        return; // bot ignora completamente
    }
}

// 🎮 SISTEMA DO JOGO DA FORCA 
if(jogoForca[from] && !isCmd){

const jogo = jogoForca[from]

const letra = body.toLowerCase()

if(!/^[a-z]$/.test(letra)) return

if(jogo.letras.includes(letra) || jogo.erradas.includes(letra))
return reply("⚠️ Essa letra já foi usada")

if(jogo.palavra.includes(letra)){

jogo.letras.push(letra)

await client.sendMessage(from,{
text:`✔ @${sender.split("@")[0]} acertou a letra *${letra.toUpperCase()}*!`,
mentions:[sender]
})

}else{

jogo.erradas.push(letra)
jogo.erros++

await client.sendMessage(from,{
text:`❌ @${sender.split("@")[0]} errou tentando a letra *${letra.toUpperCase()}*!`,
mentions:[sender]
})

}

if(!mostrarPalavra(jogo.palavra,jogo.letras).includes("▢")){

await client.sendMessage(from,{
text:
`🏆 *PALAVRA DESCOBERTA!*

🎉 @${sender.split("@")[0]} acertou a palavra!

🔤 Palavra:
${jogo.palavra}`,
mentions:[sender]
})

delete jogoForca[from]
return
}

if(jogo.erros >= 6){

await client.sendMessage(from,{
text:
`💀 *VOCÊ PERDEU*

A palavra correta era:
${jogo.palavra}`
})

delete jogoForca[from]
return
}

await client.sendMessage(from,{
text:
`🎮 *JOGO DA FORCA*

${desenharForca(jogo.erros)}

💡 Dica
${jogo.dica}

🔤 Palavra
${mostrarPalavra(jogo.palavra,jogo.letras)}

❌ Letras erradas
${jogo.erradas.join(", ")}

💀 Erros: ${jogo.erros}/6

Digite outra letra`
})

}

// 🎮 SISTEMA DE JOGADAS DO JOGO DA VELHA

if (jogoVelha[from]?.status === "jogando" && !isCmd) {

const jogo = jogoVelha[from];

if(sender !== jogo.turno) return;

const pos = parseInt(body)-1;

if(isNaN(pos)||pos<0||pos>8) return;

if(["❌","⭕"].includes(jogo.tabuleiro[pos])) return;

const simbolo =
jogo.turno===jogo.desafiante?"❌":"⭕";

jogo.tabuleiro[pos]=simbolo;

if(verificarVitoria(jogo.tabuleiro,simbolo)){

await client.sendMessage(from,{
text:
`🏆 *TEMOS UM VENCEDOR*

👑 @${sender.split("@")[0]} venceu!

${criarTabuleiro(jogo.tabuleiro)}`,
mentions:[sender]
})

delete jogoVelha[from]
return
}

if(!jogo.tabuleiro.some(c=>!["❌","⭕"].includes(c))){

await client.sendMessage(from,{
text:
`🤝 *EMPATE*

${criarTabuleiro(jogo.tabuleiro)}`
})

delete jogoVelha[from]
return
}

jogo.turno =
jogo.turno===jogo.desafiante
?jogo.desafiado
:jogo.desafiante

await client.sendMessage(from,{
text:
`🎮 *JOGO DA VELHA*

${criarTabuleiro(jogo.tabuleiro)}

🎯 Vez de jogar:
➜ @${jogo.turno.split("@")[0]}

📌 Escolha um número de *1 a 9*`,
mentions:[jogo.turno]
})

}



//━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🤖 AUTO GEMINI PRIVADO
//━━━━━━━━━━━━━━━━━━━━━━━━━━

const sistemaIA = lerIA();

if (
    sistemaIA.ativa &&
    !info.key.fromMe &&
    !body.startsWith(prefix) &&
    !isIABlocked(sender) &&
    ((!isGroup) || (isGroup && botFoiChamado))
) {

try {

if (!body || body.length < 2) return;

const numeroUsuario = sender.replace(/\D/g, '');
const numeroDono = data.NumeroDono.replace(/\D/g, '');
const isCriador = numeroUsuario === numeroDono;


//━━━━━━━━━━━━━━━━━━
// 🔥 XINGAMENTO
//━━━━━━━━━━━━━━━━━━

const xingamento = detectarXingamento(body);

if (xingamento) {

const respostas = [
`olha o ${xingamento} falando`,
`${xingamento} é vc sô`,
`ce que é ${xingamento} uai`,
`fala direito ${xingamento}`
];

const resposta = respostas[Math.floor(Math.random() * respostas.length)];

await enviarComoHumano(client, resposta, from, info);

return;
}


//━━━━━━━━━━━━━━━━━━
// 🧠 MEMÓRIA
//━━━━━━━━━━━━━━━━━━

const db = lerMemoria();

if (!db[sender]) {
db[sender] = { historico: [], girias: [] };
}

const historico = db[sender]?.historico || [];


//━━━━━━━━━━━━━━━━━━
// 🎵 DETECTOR MUSICA
//━━━━━━━━━━━━━━━━━━

if (/(manda|envia|quero ouvir).*(m[úu]sica)/i.test(body)) {
    try {

        const nomeMusica = body
            .replace(/(manda|me envia|envia|quero ouvir|m[úu]sica)/gi, "")
            .trim();

        if (!nomeMusica) return;

        // respostas naturais estilo "mano pra mano"
        const respostas = [
"calma aí que vou baixar o áudio aqui pra tu",
"já tô procurando essa música aqui",
"pera um segundo que já te mando",
"tô puxando o áudio aqui agora",
"só um instante que já vem",
"já tô baixando aqui pra ti",
"deixa comigo que já chega",
"já já tu vai escutar essa pedrada"
];

        const msgEscolhida = respostas[Math.floor(Math.random() * respostas.length)];

        // responde antes de buscar
        await client.sendMessage(from, { text: msgEscolhida }, { quoted: info });

        const apiKey = data.apikey;
        const url = `https://tokito-apis.site/api/youtube-audio?q=${encodeURIComponent(nomeMusica)}&apikey=${apiKey}`;

        const res = await fetch(url);

        if (!res.ok) {
            console.log("Erro API música:", await res.text());
            return;
        }

        const contentType = res.headers.get("content-type");
        if (!contentType.includes("audio")) {
            console.log("API não retornou áudio");
            return;
        }

        const buffer = Buffer.from(await res.arrayBuffer());

        await client.sendPresenceUpdate("recording", from);
        await new Promise(r => setTimeout(r, 1200));

        await client.sendMessage(from, {
            audio: buffer,
            mimetype: "audio/mpeg",
            ptt: false
        }, { quoted: info });

        return;

    } catch (err) {
        console.log("Erro música:", err);
        return;
    }
}


//━━━━━━━━━━━━━━━━━━
// 📷 PINTEREST
//━━━━━━━━━━━━━━━━━━

if (/(foto|imagem|imagens)/i.test(body)) {

const busca = body
.replace(/(manda|envia|mostra|foto|imagem|imagens|de)/gi,"")
.trim();

if (!busca) return;

await enviarComoHumano(client,"já já te mando",from,info);

const url = `https://tokito-apis.site/api/pinterest?q=${encodeURIComponent(busca)}&apikey=${data.apikey}&r=${Date.now()}`;

await client.sendMessage(from,{
image:{ url }
},{ quoted: info });

return;

}


//━━━━━━━━━━━━━━━━━━
// 🎥 TIKTOK MELHORADO
//━━━━━━━━━━━━━━━━━━

if (/(vídeo|video|tiktok)/i.test(body)) {

const axios = require("axios");

const busca = body
.replace(/(manda|envia|mostra|vídeo|video|tiktok|de)/gi,"")
.trim();

if (!busca) return;

await enviarComoHumano(client,"já tô procurando aqui",from,info);

const res = await axios.post(
"https://www.tikwm.com/api/feed/search",
{
keywords: busca,
count: 30,
cursor: 0,
HD: 1
},
{
headers:{
"Content-Type":"application/json",
"User-Agent":"Mozilla/5.0"
}
}
);

const videos = res.data?.data?.videos;

if (!videos?.length) return;

const positivas = ["edit","cinematic","drift","supercar","jdm","luxo","turbo","stance","4k"];
const negativas = ["lavando","conserto","quebrado","sucata","oficina","restaurando","problema"];

const filtrados = videos.filter(v => {

const texto = `${v.title || ""} ${v.desc || ""}`.toLowerCase();

if (negativas.some(p => texto.includes(p))) return false;

return positivas.some(p => texto.includes(p)) || texto.includes(busca.toLowerCase());

});

const listaFinal = filtrados.length ? filtrados : videos;

const videoURL = listaFinal[0]?.play;

if (!videoURL) return;

await client.sendMessage(from,{
video:{ url: videoURL },
mimetype:"video/mp4"
},{ quoted: info });

return;

}


//━━━━━━━━━━━━━━━━━━
// 🔥 DETECTOR REPETIÇÃO
//━━━━━━━━━━━━━━━━━━

const ultimasMensagens = historico
.filter(m => m.role === "user")
.slice(-2)
.map(m => m.content.toLowerCase());

if (
ultimasMensagens.length === 2 &&
ultimasMensagens[0] === ultimasMensagens[1] &&
ultimasMensagens[1] === body.toLowerCase()
) {

await new Promise(r => setTimeout(r,1800));

await client.sendPresenceUpdate("composing", from);

await client.sendMessage(from,{
text:"tu vai repetir isso até quando"
},{ quoted: info });

return;
}


//━━━━━━━━━━━━━━━━━━
// 🧠 GIRIAS
//━━━━━━━━━━━━━━━━━━

salvarGirias(sender, body);

const giriasAprendidas = db[sender]?.girias || [];

const estadoEmocional = detectarEmocao(body);


//━━━━━━━━━━━━━━━━━━
// ⏰ PERÍODO
//━━━━━━━━━━━━━━━━━━

const agora = new Date();
const hora = agora.getHours();

let periodo;

if (hora < 6) periodo = "madrugada";
else if (hora < 12) periodo = "manha";
else if (hora < 18) periodo = "tarde";
else periodo = "noite";


//━━━━━━━━━━━━━━━━━━
// 🧠 PROMPT BASE
//━━━━━━━━━━━━━━━━━━

const promptBase = gerarPromptBase(
info.pushName || "Usuário",
isCriador,
periodo,
estadoEmocional,
giriasAprendidas
);


//━━━━━━━━━━━━━━━━━━
// 🧠 HISTÓRICO
//━━━━━━━━━━━━━━━━━━

let historicoTexto = "";

for (let msg of historico.slice(-8)) {

if (msg.role === "user")
historicoTexto += `Pessoa: ${msg.content}\n`;

else
historicoTexto += `Faatal: ${msg.content}\n`;

}


//━━━━━━━━━━━━━━━━━━
// 🤖 PROMPT FINAL
//━━━━━━━━━━━━━━━━━━

const promptFinal = `
${promptBase}

Histórico da conversa:
${historicoTexto}

Pessoa: ${body}
Faatal:
`;

//━━━━━━━━━━━━━━━━━━
// 🤖 RESPOSTA IA
//━━━━━━━━━━━━━━━━━━

await client.sendPresenceUpdate("composing", from);

const urlGemini = `https://tokito-apis.site/api/gemini-pro?texto=${encodeURIComponent(promptFinal)}&apikey=${data.apikey}`;

const respostaAPI = await fetch(urlGemini);

// se API falhar
if (!respostaAPI.ok) {

await enviarComoHumano(client,
"rapaz... tentei pensar aqui mas a IA travou agora",
from,
info
);

return;
}

const json = await respostaAPI.json();

let resposta;

if (json?.resposta?.candidates?.length) {
    resposta = json.resposta.candidates[0].content.parts[0].text;
}

if (!resposta) {

console.log("RESPOSTA API:", json);

resposta = "oxe... deu branco aqui agora";

}

// humanização
resposta = variarTexto(resposta);
resposta = erroHumanoLeve(resposta);

// memória
adicionarMemoria(sender,"user",body);
adicionarMemoria(sender,"assistant",resposta);

// enviar
await enviarComoHumano(client,resposta,from,info);

} catch(err){

console.log("FAATAL IA ERROR:",err);

await client.sendMessage(from,{
text:"deu um erro aqui mas já já eu volto"
},{ quoted: info });

}

return;
}


//━━━━━━━━━━━━━━━━━━━━━━━━━
// 📌 COMANDO SEM PREFIXO
//━━━━━━━━━━━━━━━━━━━━━━━━━


if (body?.trim().toLowerCase() === 'prefixo') {
    // Se o bot estiver OFF e não for o dono, ele ignora e não responde
  if (!data.botAtivo && !soDono) return; 

    await client.sendMessage(from, {
        text: `✨ 𝗠𝗲𝘂 𝗽𝗿𝗲𝗳𝗶𝘅𝗼 𝗼𝗳𝗶𝗰𝗶𝗮𝗹 𝗱𝗲 𝗰𝗼𝗺𝗮𝗻𝗱𝗼𝘀:
➜ 『 ${prefix} 』`
    }, { quoted: info });

    return;
}

if (!body.startsWith(prefix)) {
    executionLock.delete(from);
    return;
}



if (!data.botAtivo && !soDono) return;

//━━━━━━━━━━━━━━━━━━━━━━━━━
// 📌 FIM DO COMANDO SEM PREFIXO
//━━━━━━━━━━━━━━━━━━━━━━━━━

// punição ativa
if (isPunished(from)) {

const restante =
Math.ceil((punishedUsers.get(from) - Date.now()) / 1000);

await client.sendMessage(from, {
text:
`🚫 Você foi temporariamente bloqueado por segurança anti-flood.

⏳ Aguarde ${restante}s para usar comandos novamente.`
}, { quoted: info });

return;
}

// anti flood global
const now = Date.now();
const lastUse = floodMap.get(from) || 0;

if (now - lastUse < GLOBAL_COOLDOWN) {

const warned = registerSpam(from);

if (warned) {
await client.sendMessage(from, {
text: "⚠ Spam detectado. Aguarde alguns segundos."
}, { quoted: info });
}

return;
}

floodMap.set(from, now);


// execução concorrente
if (executionLock.has(from)) return;
executionLock.add(from);


// parse comando
const args = body.slice(prefix.length).trim().split(/ +/);
const comando = args.shift()?.toLowerCase();

// 🔒 BLOQUEIO GLOBAL DE COMANDO
if (!soDono && isCmdBlocked(comando)) {
    executionLock.delete(from);

    await client.sendMessage(from, {
        text: "🚫 Este comando foi bloqueado pelo dono."
    }, { quoted: info });

    return;
}

if (!comando) {
executionLock.delete(from);
return;
}


// rate limit por comando
if (checkRateLimit(from, comando)) {

const warned = registerSpam(from);

if (warned) {
await client.sendMessage(from, {
text: "⚠ Spam detectado. Aguarde alguns segundos."
}, { quoted: info });
}

executionLock.delete(from);
return;
}


// helpers seguros
const enviar = async txt => {
try {
await client.sendMessage(from, { text: String(txt) }, { quoted: info });
} catch {}
};

const reagir = async emoji => {
try {
await client.sendMessage(from, {
react: { text: emoji, key: info.key }
});
} catch {}
};


// execução protegida
const executar = async () => {


//━━━━━━━━━━━━━━━━━━
// 📦 MEDIA UNIVERSAL
//━━━━━━━━━━━━━━━━━━

const msg = info.message;

const quotedMsg =
msg?.extendedTextMessage?.contextInfo?.quotedMessage ||
msg;

const mime =
Object.keys(quotedMsg || {})[0];

const reply = enviar; 
const text = args.join(" ");


/*━━━━━━━━━━━━━━━━━━━━━━━━━━
🎮 ADICIONAR COMANDOS NO BOT
━━━━━━━━━━━━━━━━━━━━━━━━━━*/

switch (comando) {

case "rankfeio": {

if (!isGroup) return reply("💀 Esse comando só funciona em grupos.");

const fs = require("fs");

const groupMetadata = await client.groupMetadata(from);
const participantes = groupMetadata.participants.map(p => p.id);

const lidDono = String(data.LidDono).replace(/\D/g,'');

// remove dono
const filtrados = participantes.filter(id => {
return id.split("@")[0].replace(/\D/g,'') !== lidDono;
});

if (filtrados.length < 2)
return reply("💀 Não há pessoas suficientes para gerar o rank.");

await client.sendMessage(from,{
react:{text:"💀", key:info.key}
});

const mensagensBusca = [
"💀 Escaneando nível de feiura...",
"🪞 Quebrando espelhos do grupo...",
"🤢 Detectando rostos perigosos...",
"👹 Calculando nível de susto...",
"💀 Procurando os mais feios..."
];

await client.sendMessage(from,{
text: mensagensBusca[Math.floor(Math.random()*mensagensBusca.length)]
},{quoted:info});

await new Promise(r => setTimeout(r,2000));

const embaralhado = filtrados.sort(() => 0.5 - Math.random());

const top = embaralhado.slice(0, Math.min(5, embaralhado.length));

const posicoes = [
"🥇 1° Lugar — Feiúra Suprema",
"🥈 2° Lugar — Quebra Espelho",
"🥉 3° Lugar — Assustador",
"👹 4° Lugar — Aparência Suspeita",
"🤢 5° Lugar — Sustinho Básico"
];

let texto =
`💀 *RANK DOS MAIS FEIOS* 💀

`;

top.forEach((id,index)=>{
texto += `${posicoes[index]}\n@${id.split("@")[0]}\n\n`;
});

texto += `> 𝙁𝘼𝘼𝙏𝘼𝙇 𝙈𝘿`;

const caminhoImagem = "./arquivos/fotos/feio.jpg";

try{

if(fs.existsSync(caminhoImagem)){

await client.sendMessage(from,{
image: fs.readFileSync(caminhoImagem),
caption: texto,
mentions: top
},{quoted:info});

}else{

await client.sendMessage(from,{
text: texto,
mentions: top
},{quoted:info});

}

}catch{

await client.sendMessage(from,{
text: texto,
mentions: top
},{quoted:info});

}

}
break;

case "ranksafados": {

if (!isGroup) return reply("😈 Esse comando só funciona em grupos.");

const fs = require("fs");

const groupMetadata = await client.groupMetadata(from);
const participantes = groupMetadata.participants.map(p => p.id);

if (participantes.length < 2)
return reply("😈 Não há pessoas suficientes no grupo.");

await client.sendMessage(from,{
react:{text:"😈", key:info.key}
});

// mensagens de busca
const mensagensBusca = [
"😈 Detectando níveis de safadeza...",
"🔥 Calculando energia proibida do grupo...",
"🥵 Procurando os mais safados...",
"😏 Escaneando pensamentos perigosos...",
"💋 Medindo o nível de malícia..."
];

await client.sendMessage(from,{
text: mensagensBusca[Math.floor(Math.random()*mensagensBusca.length)]
},{quoted:info});

await new Promise(r => setTimeout(r,2000));

// embaralha participantes
const embaralhado = participantes.sort(() => 0.5 - Math.random());

// pega até 5 pessoas
const top = embaralhado.slice(0, Math.min(5, embaralhado.length));

const posicoes = [
"🥇 1° Lugar — Safadeza Máxima",
"🥈 2° Lugar — Mente Perigosa",
"🥉 3° Lugar — Pensamento Proibido",
"🔥 4° Lugar — Energia Suspeita",
"😏 5° Lugar — Olhar Malicioso"
];

let texto =
`😈 *RANK DOS MAIS SAFADOS* 😈

`;

top.forEach((id,index)=>{
texto += `${posicoes[index]}\n@${id.split("@")[0]}\n\n`;
});

texto += `> 𝙁𝘼𝘼𝙏𝘼𝙇 𝙈𝘿`;

const caminhoGif = "./arquivos/fotos/safado.mp4";

try{

if(fs.existsSync(caminhoGif)){

await client.sendMessage(from, {
  video: fs.readFileSync(caminhoGif),
  gifPlayback: true,
  mimetype: "video/mp4",
  caption: texto,
  mentions: top
}, { quoted: info })

}else{

await client.sendMessage(from,{
text: texto,
mentions: top
},{quoted:info});

}

}catch{

await client.sendMessage(from,{
text: texto,
mentions: top
},{quoted:info});

}

}
break;


case "rankburro": {

if (!isGroup) return reply("🐴 Esse comando só funciona em grupos.");

const fs = require("fs");

const groupMetadata = await client.groupMetadata(from);
const participantes = groupMetadata.participants.map(p => p.id);

const lidDono = String(data.LidDono).replace(/\D/g,'');

// remove o dono da lista
const filtrados = participantes.filter(id => {
return id.split("@")[0].replace(/\D/g,'') !== lidDono;
});

if (filtrados.length < 2)
return reply("🐴 Não há pessoas suficientes para gerar o rank.");

await client.sendMessage(from,{
react:{text:"🐴", key:info.key}
});

// mensagens de busca
const mensagensBusca = [
"🐴 Procurando os mais lerdos do grupo...",
"🧠 Calculando níveis negativos de QI...",
"🤪 Detectando burrice extrema...",
"📉 Analisando inteligência suspeita...",
"🐴 Escaneando quem dormiu nas aulas..."
];

await client.sendMessage(from,{
text: mensagensBusca[Math.floor(Math.random()*mensagensBusca.length)]
},{quoted:info});

await new Promise(r => setTimeout(r,2000));

// embaralha
const embaralhado = filtrados.sort(() => 0.5 - Math.random());

// pega até 5
const top = embaralhado.slice(0, Math.min(5, embaralhado.length));

const posicoes = [
"🥇 1° Lugar — Burrice Suprema",
"🥈 2° Lugar — Cabeça de Vento",
"🥉 3° Lugar — QI em Falta",
"🐴 4° Lugar — Pensamento Lento",
"🤡 5° Lugar — Confusão Mental"
];

let texto =
`🐴 *RANK DOS MAIS BURROS* 🐴

`;

top.forEach((id,index)=>{
texto += `${posicoes[index]}\n@${id.split("@")[0]}\n\n`;
});

texto += `> 𝙁𝘼𝘼𝙏𝘼𝙇 𝙈𝘿`;

const caminhoImagem = "./arquivos/fotos/burro.jpg";

try{

if(fs.existsSync(caminhoImagem)){

await client.sendMessage(from,{
image: fs.readFileSync(caminhoImagem),
caption: texto,
mentions: top
},{quoted:info});

}else{

await client.sendMessage(from,{
text: texto,
mentions: top
},{quoted:info});

}

}catch{

await client.sendMessage(from,{
text: texto,
mentions: top
},{quoted:info});

}

}
break;

case "rankapaixonados": {

if (!isGroup) return reply("💘 Esse comando só funciona em grupos.");

const fs = require("fs");

const groupMetadata = await client.groupMetadata(from);
const participantes = groupMetadata.participants.map(p => p.id);

if (participantes.length < 2)
return reply("💘 É preciso pelo menos 2 pessoas no grupo.");

await client.sendMessage(from,{
react:{text:"💘", key:info.key}
});

// mensagens de busca
const mensagensBusca = [
"💘 Detectando corações apaixonados...",
"❤️ Analisando níveis de romance no grupo...",
"💕 Calculando intensidade dos sentimentos...",
"😍 Procurando os mais apaixonados...",
"💞 Escaneando quem anda suspirando..."
];

await client.sendMessage(from,{
text: mensagensBusca[Math.floor(Math.random()*mensagensBusca.length)]
},{quoted:info});

await new Promise(r => setTimeout(r,2000));

// embaralha participantes
const embaralhado = participantes.sort(() => 0.5 - Math.random());

// pega até 5 pessoas, mas funciona com menos
const top = embaralhado.slice(0, Math.min(5, embaralhado.length));

const posicoes = [
"🥇 1° Lugar — Apaixonado Perdido",
"🥈 2° Lugar — Coração Derretido",
"🥉 3° Lugar — Romântico Nato",
"💞 4° Lugar — Amor no Ar",
"💘 5° Lugar — Suspiro Garantido"
];

let texto =
`💘 *RANK DOS APAIXONADOS* 💘

`;

top.forEach((id,index)=>{
texto += `${posicoes[index]}\n@${id.split("@")[0]}\n\n`;
});

texto += `> 𝙁𝘼𝘼𝙏𝘼𝙇 𝙈𝘿`;

const caminhoImagem = "./arquivos/fotos/apaixonados.jpg";

try{

if(fs.existsSync(caminhoImagem)){

await client.sendMessage(from,{
image: fs.readFileSync(caminhoImagem),
caption: texto,
mentions: top
},{quoted:info});

}else{

await client.sendMessage(from,{
text: texto,
mentions: top
},{quoted:info});

}

}catch{

await client.sendMessage(from,{
text: texto,
mentions: top
},{quoted:info});

}

}
break;

case "grupo": {

if(!isGroup)
return reply("⚠️ Esse comando só funciona em grupos.")

if(!isAdmin && !soDono)
return reply("🚫 Apenas administradores podem usar esse comando.")

if(!args[0])
return reply(`Use assim:

${prefix}grupo f  → fechar grupo
${prefix}grupo a  → abrir grupo`)

const opcao = args[0].toLowerCase()

if(opcao === "f"){

await client.sendMessage(from,{
react:{text:"🔒", key:info.key}
})

try{

await client.groupSettingUpdate(from,"announcement")

await client.sendMessage(from,{
text:
`🔒 *GRUPO FECHADO*

Agora apenas administradores podem enviar mensagens.`
},{quoted:info})

}catch(err){
console.log("ERRO GRUPO:",err)
reply("❌ Não consegui fechar o grupo.")
}

}

else if(opcao === "a"){

await client.sendMessage(from,{
react:{text:"🔓", key:info.key}
})

try{

await client.groupSettingUpdate(from,"not_announcement")

await client.sendMessage(from,{
text:
`🔓 *GRUPO ABERTO*

Todos os membros podem enviar mensagens novamente.`
},{quoted:info})

}catch(err){
console.log("ERRO GRUPO:",err)
reply("❌ Não consegui abrir o grupo.")
}

}else{
reply(`Use apenas:

${prefix}grupo f
${prefix}grupo a`)
}

}
break;

case "sugestao":
case "sugestão": {

const textoSugestao = args.join(" ")

if(!textoSugestao)
return reply(
`💡 *Envie uma sugestão*

Exemplo:
${prefix}sugestao adicionar comando de clima`
)

try{

const criador = "556399468264@s.whatsapp.net"

const numero = sender.split("@")[0].replace(/\D/g,'')
const nome = info.pushName || "Usuário"

let grupo = "Privado"

if(isGroup){
const metadata = await client.groupMetadata(from)
grupo = metadata.subject
}

const mensagemSugestao =
`╭━━━〔 💡 NOVA SUGESTÃO 〕━━━╮

┃ 👤 Usuário » ${nome}
┃ 📱 Contato » wa.me/${numero}
┃ 👥 Origem » ${grupo}

┃ 💬 Sugestão enviada:
┃ ${textoSugestao}

╰━━━━━━━━━━━━━━━━━━━━╯
> 𝙁𝘼𝘼𝙏𝘼𝙇 𝙈𝘿`

await client.sendMessage(criador,{
text: mensagemSugestao
})

await client.sendMessage(from,{
text:
`💡 Sugestão enviada ao criador.
✨ Obrigado por ajudar a melhorar o bot!`
},{quoted:info})

}catch(err){

console.log("Erro sugestão:", err)

reply("❌ Não consegui enviar a sugestão.")

}

}
break

case "bug": {

const textoBug = args.join(" ")

if(!textoBug)
return reply(
`🐞 *Reporte um bug*

Exemplo:
${prefix}bug o comando play não está funcionando`
)

try{

const criador = "556399468264@s.whatsapp.net"

const numero = sender.split("@")[0].replace(/\D/g,'')
const nome = info.pushName || "Usuário"

let grupo = "Privado"

if(isGroup){
const metadata = await client.groupMetadata(from)
grupo = metadata.subject
}

const mensagemBug =
`╭━━━〔 🐞 RELATÓRIO DE BUG 〕━━━╮

┃ 👤 Usuário » ${nome}
┃ 📱 Contato » wa.me/${numero}
┃ 👥 Origem » ${grupo}

┃ 📝 Problema relatado:
┃ ${textoBug}

╰━━━━━━━━━━━━━━━━━━━━╯
> 𝙁𝘼𝘼𝙏𝘼𝙇 𝙈𝘿`

await client.sendMessage(criador,{
text: mensagemBug
})

await client.sendMessage(from,{
text:
`🐞 Bug enviado ao criador.
⏳ Aguarde enquanto ele analisa e corrige.`
},{quoted:info})

}catch(err){

console.log("Erro bug:", err)

reply("❌ Não consegui enviar o bug.")

}

}
break

case "surubao": {
    try {
        if (!isGroup) return reply("😈 Esse comando só funciona em grupos.");

        await client.sendMessage(from, {
            react: { text: "😈", key: info.key }
        });

        let qtd = parseInt(args[0]) || 3;
        if (qtd > 15) qtd = 15;
        if (qtd < 1) qtd = 1;

        const groupMetadata = await client.groupMetadata(from);
        
        const lidDono = String(data.LidDono).replace(/\D/g, '');

        const participantes = groupMetadata.participants
            .map(p => p.id)
            .filter(id => {
                const idLimpo = id.split("@")[0].replace(/\D/g, '');
                return idLimpo !== lidDono;
            });

        if (participantes.length < qtd) {
            return reply(`😈 Não há pessoas suficientes para um surubão de ${qtd}.`);
        }

        const selecionados = participantes
            .sort(() => 0.5 - Math.random())
            .slice(0, qtd);

        let listaMencoes = "";
        selecionados.forEach(id => {
            listaMencoes += `➔ @${id.split("@")[0]}\n`;
        });

        const textoFinal = `😈 @${sender.split("@")[0]} quer que *${qtd}* pessoas venham de *chicote, algema e corda de alpinista.*\n\n${listaMencoes}`;

        const caminhoImagem = "./arquivos/fotos/suruba.jpg";

        try {
            if (fs.existsSync(caminhoImagem)) {
                await client.sendMessage(from, {
                    image: fs.readFileSync(caminhoImagem),
                    caption: textoFinal,
                    mentions: [sender, ...selecionados]
                }, { quoted: info });
            } else {
                await client.sendMessage(from, {
                    text: textoFinal,
                    mentions: [sender, ...selecionados]
                }, { quoted: info });
            }
        } catch (error) {
            await client.sendMessage(from, {
                text: textoFinal,
                mentions: [sender, ...selecionados]
            }, { quoted: info });
        }

    } catch (err) {
        console.error("Erro no comando surubao:", err);
        reply("❌ Ocorreu um erro ao organizar o surubão.");
    }
}
break;

case "metadinha": {

await client.sendMessage(from,{
react:{text:"💞", key:info.key}
})

try{

const url =
`https://api.blackaut.shop/api/imagem/metadinha?apikey=${data.apikey2}`

const res = await fetch(url)
const json = await res.json()

if(!json)
return reply("❌ Não consegui pegar a metadinha.")

const numero = json["número"]
const masc = json.masculina
const fem = json.feminina

await client.sendMessage(from,{
image:{url: masc},
caption:
`💙 *METADE MASCULINA*`
},{quoted:info})

await client.sendMessage(from,{
image:{url: fem},
caption:
`💗 *METADE FEMININA*`
},{quoted:info})

}catch(err){

console.log("Erro metadinha:", err)
reply("❌ Erro ao buscar metadinha.")

}

}
break

case "hentai": {
    try {
        if (!vip && !soDono) {
            return reply("🚫 Este comando é exclusivo para usuários VIP.");
        }

        await client.sendMessage(from, {
            react: { text: "🔞", key: info.key }
        });

        reply("🔞 Aguarde um instante, estou buscando o conteúdo...");

        const apiKey = data.apikey2;
        if (!apiKey) return reply("❌ apikey2 não encontrada no data.json.");

        const apiURL = `https://api.blackaut.shop/api/pesquisa/hentai?query=anime&apikey=${apiKey}`;

        const res = await fetch(apiURL);
        const json = await res.json();

        if (!json.status || !json.resultado || json.resultado.length === 0) {
            return reply("❌ Não consegui encontrar nenhum conteúdo no momento.");
        }

        const resultado = json.resultado[Math.floor(Math.random() * json.resultado.length)];

        await client.sendMessage(from, {
            video: { url: resultado.video_1 },
            mimetype: "video/mp4"
        }, { quoted: info });

    } catch (err) {
        console.error("Erro no comando hentai:", err);
        reply("❌ Ocorreu um erro ao processar sua solicitação.");
    }
}
break;

case "anime": {

if(!args[0])
return reply(
`🔎 *Digite o nome do anime*

Exemplo:
${prefix}anime naruto`
)

await client.sendMessage(from,{
react:{text:"🎌", key:info.key}
})

try{

const nome = args.join(" ")

const url =
`https://api.blackaut.shop/api/pesquisa/anime?nome=${encodeURIComponent(nome)}&apikey=${data.apikey2}`

const res = await fetch(url)
const json = await res.json()

if(!json.status || !json.resultado || json.resultado.length === 0)
return reply("❌ Anime não encontrado.")

const anime = json.resultado[0]

/*━━━━━━━━━━━━━━━━━━
🎭 TRADUZIR GÊNEROS
━━━━━━━━━━━━━━━━━━*/

const traduzGenero = {
"Action":"Ação",
"Adventure":"Aventura",
"Comedy":"Comédia",
"Romance":"Romance",
"Fantasy":"Fantasia",
"Drama":"Drama",
"Ecchi":"Ecchi",
"Supernatural":"Sobrenatural",
"Horror":"Terror",
"Sci-Fi":"Ficção Científica",
"Mystery":"Mistério",
"Slice of Life":"Vida Cotidiana"
}

let generos = anime.genero
.split(", ")
.map(g => traduzGenero[g] || g)
.join(", ")

/*━━━━━━━━━━━━━━━━━━
📝 TRADUZIR SINOPSE
━━━━━━━━━━━━━━━━━━*/

let sinopseOriginal = anime.sinopse.substring(0,1000)

let sinopse = sinopseOriginal

try{

const parte1 = sinopseOriginal.substring(0,500)
const parte2 = sinopseOriginal.substring(500,1000)

const trad1 = await fetch(
`https://api.mymemory.translated.net/get?q=${encodeURIComponent(parte1)}&langpair=en|pt`
)

const json1 = await trad1.json()

const trad2 = await fetch(
`https://api.mymemory.translated.net/get?q=${encodeURIComponent(parte2)}&langpair=en|pt`
)

const json2 = await trad2.json()

sinopse =
(json1.responseData.translatedText || parte1) +
(json2.responseData.translatedText || parte2)

}catch{}

/*━━━━━━━━━━━━━━━━━━
📋 TEXTO FINAL
━━━━━━━━━━━━━━━━━━*/

const texto =
`┏━━━〔 🎌 ANIME ENCONTRADO 〕━━━┓

📺 *Nome:*
${anime.nome}

⭐ *Score:*
${anime.score}

🎞 *Episódios:*
${anime.episodios}

📅 *Lançamento:*
${anime.lancamento}

🎭 *Gêneros:*
${generos}

📝 *Sinopse:*
${sinopse}

🔗 *Mais informações:*
${anime.url}

┗━━━━━━━━━━━━━━━━━━━┛`

await client.sendMessage(from,{
image:{ url: anime.imagem },
caption: texto
},{quoted:info})

}catch(err){

console.log("Erro anime:", err)
reply("❌ Não consegui pesquisar o anime.")

}

}
break

case "wallpaper": {

await client.sendMessage(from,{
react:{text:"🖼️", key:info.key}
})

try{

const url =
`https://api.blackaut.shop/api/pesquisa/wallpaper2?query=anime&apikey=${data.apikey2}`

await client.sendMessage(from,{
image:{ url },
},{quoted:info})

}catch(err){

console.log("Erro wallpaper:", err)

reply("❌ Não consegui buscar o wallpaper agora.")

}

}
break

case "animeMeme":
case "animememe": {

await client.sendMessage(from,{
react:{text:"🖼️", key:info.key}
})

try{

const url = `https://api.blackaut.shop/api/imagem/animememe?apikey=${data.apikey2}`

await client.sendMessage(from,{
image:{ url },
},{quoted:info})

}catch(err){

console.log("Erro animememe:", err)

reply("❌ Não consegui gerar o meme agora.")

}

}
break

case "trair": {

if (!isGroup)
return reply("💔 Esse comando só funciona em grupos.");

const alvo =
mentioned[0] ||
info.message?.extendedTextMessage?.contextInfo?.participant;

if (!alvo)
return reply("💔 Marque alguém ou responda a mensagem da pessoa.");

const autor = sender;
const db = lerCasamentos();

if (autor === alvo)
return reply("💔 Você não pode trair com você mesmo.");

const antigoParceiro = db[autor];

if (antigoParceiro) {
delete db[antigoParceiro];
delete db[autor];
}

const parceiroDoAlvo = db[alvo];
if (parceiroDoAlvo) {
delete db[parceiroDoAlvo];
delete db[alvo];
}

db[autor] = alvo;
db[alvo] = autor;

salvarCasamentos(db);

const nomeAutor = autor.split("@")[0];
const nomeAlvo = alvo.split("@")[0];

let texto;

if (antigoParceiro) {

const nomeAntigo = antigoParceiro.split("@")[0];

texto =
`💔 𝙏𝙍𝘼𝙄𝘾̧𝘼̃𝙊 💔

@${nomeAutor} traiu @${nomeAntigo} com @${nomeAlvo}...

Agora @${nomeAutor} & @${nomeAlvo} são o novo casal do grupo.`

}else{

texto =
`💞 𝙉𝙊𝙑𝙊 𝘾𝘼𝙎𝘼𝙇 💞

@${nomeAutor} se envolveu com @${nomeAlvo}...

Agora os dois formam um novo casal no grupo.`

}

await client.sendMessage(from,{
react:{text:"💔", key:info.key}
})

const fs = require("fs")
const caminho = "./arquivos/fotos/trair.jpg"

try{

if(fs.existsSync(caminho)){

await client.sendMessage(from,{
image: fs.readFileSync(caminho),
caption: texto,
mentions:[autor,alvo,antigoParceiro].filter(Boolean)
})

}else{

await client.sendMessage(from,{
text:texto,
mentions:[autor,alvo,antigoParceiro].filter(Boolean)
})

}

}catch(err){

await client.sendMessage(from,{
text:texto,
mentions:[autor,alvo,antigoParceiro].filter(Boolean)
})

}

}
break

case "divorcio": {

const db = lerCasamentos()

if(!db[sender])
return reply("💔 Você não está casado.")

const parceiro = db[sender]

delete db[parceiro]
delete db[sender]

salvarCasamentos(db)

await client.sendMessage(from,{
react:{text:"💔", key:info.key}
})

const nomeAutor = sender.split("@")[0]
const nomeParceiro = parceiro.split("@")[0]

const texto =
`💔 𝘿𝙄𝙑𝙊́𝙍𝘾𝙄𝙊 💔

@${nomeAutor} e @${nomeParceiro}
decidiram seguir caminhos diferentes...

Agora cada um está solteiro novamente.`

const fs = require("fs")
const caminho = "./arquivos/fotos/divorcio.jpg"

try{

if(fs.existsSync(caminho)){

await client.sendMessage(from,{
image: fs.readFileSync(caminho),
caption: texto,
mentions:[sender,parceiro]
})

}else{

await client.sendMessage(from,{
text:texto,
mentions:[sender,parceiro]
})

}

}catch(err){

await client.sendMessage(from,{
text:texto,
mentions:[sender,parceiro]
})

}

}
break

case "meupar": {

const db = lerCasamentos()

if(!db[sender])
return reply("💔 Você não está casado.")

const parceiro = db[sender]

await client.sendMessage(from,{
react:{text:"💞", key:info.key}
})

const nomeAutor = sender.split("@")[0]
const nomeParceiro = parceiro.split("@")[0]

const texto =
`💍 𝙎𝙀𝙐 𝙋𝘼𝙍 💍

💞 Casal registrado no sistema.

@${nomeAutor} & @${nomeParceiro}

Vocês estão oficialmente juntos.`

const fs = require("fs")
const caminho = "./arquivos/fotos/meupar.jpg"

try{

if(fs.existsSync(caminho)){

await client.sendMessage(from,{
image: fs.readFileSync(caminho),
caption: texto,
mentions:[sender,parceiro]
})

}else{

await client.sendMessage(from,{
text:texto,
mentions:[sender,parceiro]
})

}

}catch(err){

await client.sendMessage(from,{
text:texto,
mentions:[sender,parceiro]
})

}

}
break

case "nao": {

if(!pedidoCasamento[from])
return reply("❌ Não há pedido de casamento.")

const {autor,alvo} = pedidoCasamento[from]

if(sender !== alvo)
return reply("💍 Apenas a pessoa pedida pode recusar.")

delete pedidoCasamento[from]

await client.sendMessage(from,{
text:`💔 @${alvo.split("@")[0]} recusou o pedido de casamento.`,
mentions:[autor,alvo]
})

}
break

case "sim": {

if(!pedidoCasamento[from])
return reply("❌ Não há pedido de casamento.")

const {autor,alvo} = pedidoCasamento[from]

if(sender !== alvo)
return reply("💍 Apenas a pessoa pedida pode aceitar.")

const db = lerCasamentos()

db[autor] = alvo
db[alvo] = autor

salvarCasamentos(db)

delete pedidoCasamento[from]

await client.sendMessage(from,{
react:{text:"💍", key:info.key}
})

const nomeAutor = autor.split("@")[0]
const nomeAlvo = alvo.split("@")[0]

const texto =
`💍 𝘾𝘼𝙎𝘼𝙈𝙀𝙉𝙏𝙊 𝙍𝙀𝘼𝙇𝙄𝙕𝘼𝘿𝙊 💍

💞 Novo casal no grupo!

@${nomeAutor} & @${nomeAlvo}

Agora vocês estão oficialmente casados.

✨ Felicidades ao novo casal! ✨`

const fs = require("fs")
const caminho = "./arquivos/fotos/sim.jpg"

try{

if(fs.existsSync(caminho)){

await client.sendMessage(from,{
image: fs.readFileSync(caminho),
caption: texto,
mentions:[autor,alvo]
})

}else{

await client.sendMessage(from,{
text:texto,
mentions:[autor,alvo]
})

}

}catch(err){

await client.sendMessage(from,{
text:texto,
mentions:[autor,alvo]
})

}

}
break

case "casar": {

if(!isGroup)
return reply("💍 Esse comando só funciona em grupos.")

const alvo =
mentioned[0] ||
info.message?.extendedTextMessage?.contextInfo?.participant

if(!alvo)
return reply("💍 Marque alguém ou responda a mensagem da pessoa.")

const autor = sender

const db = lerCasamentos()

if(db[autor])
return reply("💍 Você já está casado.")

if(db[alvo])
return reply("💍 Essa pessoa já está casada.")

global.pedidoCasamento = global.pedidoCasamento || {}

pedidoCasamento[from] = {
autor,
alvo
}

const nomeAutor = autor.split("@")[0]
const nomeAlvo = alvo.split("@")[0]

const texto =
`💍 𝙋𝙀𝘿𝙄𝘿𝙊 𝘿𝙀 𝘾𝘼𝙎𝘼𝙈𝙀𝙉𝙏𝙊 💍

@${nomeAutor} está lhe pedindo em casamento, @${nomeAlvo}... 💞

Digite:
『 ${prefix}sim 』 ❤️
ou
『 ${prefix}nao 』 💔

✨ O amor está no ar ✨`

const fs = require("fs")
const caminhoImagem = "./arquivos/fotos/casar.jpg"

try {

if(fs.existsSync(caminhoImagem)){

await client.sendMessage(from,{
image: fs.readFileSync(caminhoImagem),
caption: texto,
mentions:[autor,alvo]
},{quoted:info})

}else{

await client.sendMessage(from,{
text: texto,
mentions:[autor,alvo]
},{quoted:info})

}

}catch(err){

console.log("Erro no comando casar:",err)

await client.sendMessage(from,{
text: texto,
mentions:[autor,alvo]
},{quoted:info})

}

}
break

case "reset_legendabv": {

if (!isGroup) return enviar("❌ Apenas em grupos.")
if (!isAdmin && !soDono) return enviar("❌ Apenas administradores.")

const fs = require("fs")

const caminho = "./arquivos/config/legendabv.json"

if (!fs.existsSync(caminho)){
return enviar("⚠️ Nenhuma legenda personalizada foi definida.")
}

let db = JSON.parse(fs.readFileSync(caminho))

if (!db[from]){
return enviar("⚠️ Este grupo não tem legenda personalizada.")
}

delete db[from]

fs.writeFileSync(caminho, JSON.stringify(db,null,2))

enviar("✅ Legenda de boas-vindas resetada.\nO bot voltou a usar a legenda padrão.")

}
break

case "resetfotobv": {

if (!isGroup) return enviar("❌ Apenas em grupos.")
if (!isAdmin && !soDono) return enviar("❌ Apenas administradores.")

const fs = require("fs")

const caminho = "./arquivos/config/fotobv.json"

if (!fs.existsSync(caminho)){
return enviar("⚠️ Nenhuma foto personalizada definida.")
}

let db = JSON.parse(fs.readFileSync(caminho))

if (!db[from]){
return enviar("⚠️ Este grupo não tem foto personalizada.")
}

const foto = db[from]

// apaga a imagem se existir
if (fs.existsSync(foto)){
fs.unlinkSync(foto)
}

delete db[from]

fs.writeFileSync(caminho, JSON.stringify(db,null,2))

enviar("✅ Foto de boas-vindas resetada e arquivo removido.")

}
break

case "fotobv": {

if (!isGroup) return enviar("❌ Apenas em grupos.")
if (!isAdmin && !soDono) return enviar("❌ Apenas administradores.")

const fs = require("fs")
const { downloadContentFromMessage } = require("@whiskeysockets/baileys")

let imagem = null

// foto enviada junto
if (info.message?.imageMessage) {
imagem = info.message.imageMessage
}

// foto respondida
if (!imagem && info.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage) {
imagem = info.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage
}

if (!imagem) return enviar("📸 Marque ou responda uma foto.")

const stream = await downloadContentFromMessage(imagem, "image")

let buffer = Buffer.from([])

for await(const chunk of stream){
buffer = Buffer.concat([buffer, chunk])
}

const pasta = "./arquivos/bemvindo"

if (!fs.existsSync(pasta)){
fs.mkdirSync(pasta)
}

const caminho = `${pasta}/${from}.jpg`

fs.writeFileSync(caminho, buffer)

let db = {}

const pathDB = "./arquivos/config/fotobv.json"

if (fs.existsSync(pathDB)){
db = JSON.parse(fs.readFileSync(pathDB))
}

db[from] = caminho

fs.writeFileSync(pathDB, JSON.stringify(db,null,2))

enviar("✅ Foto de boas vindas alterada.")

}
break

case "legendabv": {

if (!isGroup) return enviar("❌ Apenas em grupos.")
if (!isAdmin && !soDono) return enviar("❌ Apenas administradores.")

const fs = require("fs")

const q = args.join(" ")

if (!q){

return enviar(`✏️ Exemplo de uso:

${prefix}legendabv Seja bem vindo {user} ao grupo {grupo}

📌 Variáveis disponíveis:

{user} → marca o membro
{grupo} → nome do grupo
{regras} → descrição do grupo

Exemplo:

Seja bem vindo {user}

Grupo: {grupo}

📜 Regras:

{regras}`)
}

const caminho = "./arquivos/config/legendabv.json"

let db = {}

if (fs.existsSync(caminho)){
db = JSON.parse(fs.readFileSync(caminho))
}

db[from] = q

fs.writeFileSync(caminho, JSON.stringify(db,null,2))

enviar("✅ Legenda de boas vindas alterada.")

}
break

case 'pingif':
case 'pin_gif': {
    try {
        const q = args.join(" "); 
        if (!q) return reply(`⚠️ Digite o que deseja buscar!\nExemplo: ${prefix}pin_gif Naruto`);

        await client.sendMessage(from, {
            text: `🔍 Buscando GIF no Pinterest para: *${q}*...`
        }, { quoted: info });

        const fs = require("fs");
        const axios = require("axios");
        const dataConfig = JSON.parse(fs.readFileSync("./dono/config/data.json"));
        const apiKey = dataConfig.apikey2; 

        if (!apiKey) {
            return reply("❌ apikey2 não encontrada no data.json.");
        }

        const apiURL = `https://api.blackaut.shop/api/pesquisa/pinterestgif?nome=${encodeURIComponent(q)}&apikey=${apiKey}`;
        
        // Faz a chamada para a API para pegar o JSON que você me mostrou
        const response = await axios.get(apiURL);
        const res = response.data;

        if (!res.status || !res.resultado || res.resultado.length === 0) {
            return reply("❌ Não encontrei nenhum GIF para essa busca.");
        }

        // Escolhe o primeiro resultado da lista
        const gifEscolhido = res.resultado[0];
        const linkGif = gifEscolhido.url_mp4 || gifEscolhido.url_gif;

        await client.sendMessage(from, {
            video: { url: linkGif },
            gifPlayback: true,
            mentions: [sender]
        }, { quoted: info });

    } catch (err) {
        console.log("Erro no comando pin_gif:", err);
        reply("❌ Ocorreu um erro ao processar sua busca ou a API está offline.");
    }
}
break;



case "cita": {

if (!isGroup) return reply("📢 Esse comando funciona apenas em grupos.");

if (!isAdmin && !soDono)
return reply("🚫 Apenas administradores podem usar esse comando.");

// mensagem digitada
let mensagem = text;

// mensagem marcada
const msgMarcada =
info.message?.extendedTextMessage?.contextInfo?.quotedMessage?.conversation ||
info.message?.extendedTextMessage?.contextInfo?.quotedMessage?.extendedTextMessage?.text;

if (!mensagem && msgMarcada) {
mensagem = msgMarcada;
}

if (!mensagem)
return reply(`✏️ Use assim:\n${prefix}cita sua mensagem\n\nou responda uma mensagem.`);

const groupMetadata = await client.groupMetadata(from);

const membros = groupMetadata.participants
.map(p => p.id)
.filter(id => id !== client.user.id);

// 📢 reação
await client.sendMessage(from,{
react:{text:"📢", key:info.key}
});

// envia mensagem citando todos invisivelmente
await client.sendMessage(from,{
text: mensagem,
mentions: membros
},{quoted: info});

}
break;

case "cancelarforca": {

if(!jogoForca[from])
return reply("❌ Não há jogo da forca acontecendo")

// 🛑 reação automática
await client.sendMessage(from,{
react:{text:"🛑", key:info.key}
})

delete jogoForca[from]

await client.sendMessage(from,{
text:"🛑 *Jogo da forca cancelado!*"
},{quoted:info})

}
break

case "forca": {

if(!isGroup)
return reply("🎮 Esse jogo funciona apenas em grupos.")

if(jogoForca[from])
return reply("⚠️ Já existe um jogo da forca acontecendo")

// 🎮 reação automática
await client.sendMessage(from,{
react:{text:"🎮", key:info.key}
})

const sorteio =
palavrasForca[Math.floor(Math.random()*palavrasForca.length)]

const palavra = sorteio.palavra
const dica = sorteio.dica

jogoForca[from] = {
palavra,
dica,
letras:[],
erradas:[],
erros:0
}

await client.sendMessage(from,{
text:
`🎮 *JOGO DA FORCA*

${desenharForca(0)}

💡 Dica
${dica}

🔤 Palavra
${mostrarPalavra(palavra,[])}

❌ Letras erradas
Nenhuma

💀 Erros: 0/6

Digite uma letra`
},{quoted:info})

}
break

case 'carinho': {
    if (!isGroup) return reply("💞 Esse comando só funciona em grupos.");

    const alvo =
        mentioned[0] ||
        (info.message?.extendedTextMessage?.contextInfo?.participant);

    if (!alvo)
        return reply("💞 Marque alguém ou responda a mensagem de quem você quer dar carinho.");

    const autor = info.key.participant || info.key.remoteJid;

    const nomeAlvo = alvo.split("@")[0];

    // 💞 REAÇÃO AUTOMÁTICA
    await client.sendMessage(from, {
        react: { text: "💞", key: info.key }
    });

    const frasesCarinho = [
        "deu um carinho fofinho em",
        "fez um cafuné cheio de amor em",
        "deu muito carinho em",
        "encheu de carinho",
        "não resistiu e fez carinho em",
        "foi lá só pra dar carinho em",
        "deu um carinho bem gostoso em",
        "abraçou e fez carinho em",
        "deu um carinho cheio de amor em",
        "chegou devagar e fez carinho em"
    ];

    const frase = frasesCarinho[Math.floor(Math.random() * frasesCarinho.length)];

    const mensagem = `💞 Você ${frase} @${nomeAlvo}... 😖💞`;

    const fs = require('fs');
    const caminhoGif = "./arquivos/fotos/carinho.mp4";

    try {
        if (fs.existsSync(caminhoGif)) {
            await client.sendMessage(from, {
                video: fs.readFileSync(caminhoGif),
                gifPlayback: true,
                caption: mensagem,
                mentions: [alvo]
            }, { quoted: info });
        } else {
            await client.sendMessage(from, {
                text: mensagem,
                mentions: [alvo]
            }, { quoted: info });
        }
    } catch (err) {
        console.log("Erro no comando carinho:", err);
        await client.sendMessage(from, {
            text: mensagem,
            mentions: [alvo]
        }, { quoted: info });
    }
}
break;

case 'louca':
case 'louça': {
    if (!isGroup) return reply("🍽️ Esse comando só funciona em grupos.");

    const alvo =
        mentioned[0] ||
        (info.message?.extendedTextMessage?.contextInfo?.participant);

    if (!alvo)
        return reply("🍽️ Marque alguém ou responda a mensagem de quem vai lavar a louça.");

    const autor = info.key.participant || info.key.remoteJid;

    const nomeAutor = autor.split("@")[0];
    const nomeAlvo = alvo.split("@")[0];

    // 🧽 REAÇÃO AUTOMÁTICA
    await client.sendMessage(from, {
        react: { text: "🍽️", key: info.key }
    });

    const frasesLouca = [
        "acabou de colocar",
        "mandou imediatamente",
        "não perdoou e mandou",
        "decretou que hoje quem lava a louça é",
        "decidiu que a pia é responsabilidade de",
        "botou pra trabalhar",
        "ordenou que agora quem lava é"
    ];

    const frase = frasesLouca[Math.floor(Math.random() * frasesLouca.length)];

    const mensagem = `🍽️ @${nomeAutor} ${frase} @${nomeAlvo} pra lavar a louça! 🧼`;

    const fs = require('fs');
    const caminhoGif = "./arquivos/fotos/louca.mp4";

    try {
        if (fs.existsSync(caminhoGif)) {
            await client.sendMessage(from, {
                video: fs.readFileSync(caminhoGif),
                gifPlayback: true,
                caption: mensagem,
                mentions: [autor, alvo]
            }, { quoted: info });
        } else {
            await client.sendMessage(from, {
                text: mensagem,
                mentions: [autor, alvo]
            }, { quoted: info });
        }
    } catch (err) {
        console.log("Erro no comando louça:", err);
        await client.sendMessage(from, {
            text: mensagem,
            mentions: [autor, alvo]
        }, { quoted: info });
    }
}
break;

case 'abracar':
case 'abraco': {
    if (!isGroup) return reply("💖 Esse comando só funciona em grupos.");

    const alvo =
        mentioned[0] ||
        (info.message?.extendedTextMessage?.contextInfo?.participant);

    if (!alvo)
        return reply("💖 Marque alguém ou responda a mensagem de quem você quer abraçar.");

    const autor = info.key.participant || info.key.remoteJid;

    const lidDono = String(data.LidDono).replace(/\D/g,'');
    const lidAlvo = alvo.split("@")[0].replace(/\D/g,'');

    const nomeAutor = autor.split("@")[0];
    const nomeAlvo = alvo.split("@")[0];

    // 💖 REAÇÃO AUTOMÁTICA
    await client.sendMessage(from, {
        react: { text: "🫂", key: info.key }
    });

    const frasesFofas = [
        "deu um abraço bem apertadinho em",
        "espalhou carinho com um abraço em",
        "deixou o dia mais quentinho abraçando",
        "deu um abraço cheio de amor em",
        "não resistiu e correu para abraçar",
        "deu o melhor abraço do mundo em",
        "estava com saudades e deu um abraço em",
        "deu um abraço bem fofinho em"
    ];

    const frase = frasesFofas[Math.floor(Math.random() * frasesFofas.length)];

    const mensagem = `✨ @${nomeAutor} ${frase} @${nomeAlvo} 💖`;

    const fs = require('fs');
    const caminhoGif = "./arquivos/fotos/abracar.mp4"; // Certifique-se que o arquivo existe com este nome

    try {
        if (fs.existsSync(caminhoGif)) {
            await client.sendMessage(from, {
                video: fs.readFileSync(caminhoGif),
                gifPlayback: true,
                caption: mensagem,
                mentions: [autor, alvo]
            }, { quoted: info });
        } else {
            await client.sendMessage(from, {
                text: mensagem,
                mentions: [autor, alvo]
            }, { quoted: info });
        }
    } catch (err) {
        console.log("Erro no comando abracar:", err);
        await client.sendMessage(from, {
            text: mensagem,
            mentions: [autor, alvo]
        }, { quoted: info });
    }
}
break;


case "cancelar": {

if(!jogoVelha[from])
return reply("❌ Não há nenhum jogo em andamento.");
await client.sendMessage(from,{
react:{text:"🛑", key: info.key}
})

const jogo = jogoVelha[from];

// apenas jogadores ou admin podem cancelar
if(
sender !== jogo.desafiante &&
sender !== jogo.desafiado &&
!isAdmin &&
!soDono
){
return reply("⚠️ Apenas os jogadores ou admins podem cancelar.");
}

delete jogoVelha[from];

await client.sendMessage(from,{
text:
`🛑 *JOGO CANCELADO*

A partida de jogo da velha foi encerrada.

🎮 Para iniciar outra:
➜ ${prefix}jdv @usuario`
},{quoted:info})

}
break;

case "aceitar": {

if(!jogoVelha[from])
return reply("❌ Não há desafio pendente.");

const jogo = jogoVelha[from];

if(jogo.status !== "desafio")
return reply("❌ Nenhum desafio aguardando.");

if(sender !== jogo.desafiado)
return reply("⚠️ Apenas o desafiado pode aceitar.");

jogo.status = "jogando";

jogo.turno =
Math.random() < 0.5
? jogo.desafiante
: jogo.desafiado;

jogo.tabuleiro = [
"1️⃣","2️⃣","3️⃣",
"4️⃣","5️⃣","6️⃣",
"7️⃣","8️⃣","9️⃣"
];
await client.sendMessage(from,{
text:
`🎮 *JOGO INICIADO*

${criarTabuleiro(jogo.tabuleiro)}

🎯 Quem começa:
@${jogo.turno.split("@")[0]}

Digite o número da posição.`,
mentions:[jogo.turno]
})

}
break

case "recusar": {

if(!jogoVelha[from])
return reply("❌ Não há desafio.");

const jogo = jogoVelha[from];

if(sender !== jogo.desafiado)
return reply("⚠️ Apenas o desafiado pode recusar.");

delete jogoVelha[from];

await client.sendMessage(from,{
text:"❌ O desafio foi recusado."
})

}
break

case "jdv":
case "jogodavelha": {

if(!isGroup) return reply("🎮 Esse jogo funciona apenas em grupos.");
await client.sendMessage(from,{
react:{text:"🎮", key: info.key}
})

const alvo =
mentioned[0] ||
info.message?.extendedTextMessage?.contextInfo?.participant;

if(!alvo)
return reply("🎮 Marque alguém para jogar.\n\nExemplo:\n.jdv @usuario");

if(alvo === sender)
return reply("🤡 Você não pode jogar contra você mesmo.");

jogoVelha[from] = {
status:"desafio",
desafiante:sender,
desafiado:alvo
};

await client.sendMessage(from,{
text:
`🎮 *DESAFIO DE JOGO DA VELHA*

⚔️ Desafiante:
➜ @${sender.split("@")[0]}

🎯 Desafiado:
➜ @${alvo.split("@")[0]}

━━━━━━━━━━━━━━━━━━

Para responder ao desafio digite:

✔️ ${prefix}aceitar
❌ ${prefix}recusar`,
mentions:[sender,alvo]
},{quoted:info})

}
break

case "limpar": {

    if (!isGroup)
        return reply("🧹 Esse comando funciona apenas em grupos.");

    if (!isAdmin && !soDono)
        return reply("🚫 Apenas administradores podem usar esse comando.");

    const linhas = "\n".repeat(250);

    await client.sendMessage(from, {
        text: `🧹 Limpando chat...${linhas}✔ Chat limpo`
    }, { quoted: info });

}
break;

case "vergp": {

    if (!isGroup) return reply("Esse comando funciona apenas em grupos.");
    if (!isAdmin && !soDono) return reply("🚫 Apenas administradores podem usar este comando.");

    const db = lerHorario();

    if (!db[from])
        return reply("⚠️ Nenhum horário automático configurado neste grupo.");

    const fechar = db[from].fechar || "Não definido";
    const abrir = db[from].abrir || "Não definido";

    const texto =
`╭━━━〔 ⏰ HORÁRIOS DO GRUPO 〕━━━╮

🔒 Fechar grupo : ${fechar}
🔓 Abrir grupo  : ${abrir}

╰━━━━━━━━━━━━━━━━━━━━━━╯
> 𝙵𝙰𝙰𝚃𝙰𝙻 𝙼𝙳`;

    reply(texto);

}
break;

case "resetgp": {

    if (!isGroup) return reply("Esse comando funciona apenas em grupos.");
    if (!isAdmin && !soDono) return reply("Apenas administradores.");

    const db = lerHorario();

    if (!db[from])
        return reply("⚠️ Não existe horário configurado neste grupo.");

    delete db[from];

    salvarHorario(db);

    reply("🧹 Horários de abrir e fechar grupo foram removidos.");

}
break;

case "fechargp": {

    if (!isGroup) return reply("Esse comando é apenas para grupos.");
    if (!isAdmin && !soDono) return reply("Apenas administradores.");

    if (!args[0])
        return reply("Use: fechargp 00:00");

    const horario = args[0];

    const db = lerHorario();

    if (!db[from]) db[from] = {};

    db[from].fechar = horario;

    salvarHorario(db);

    reply(`🔒 Grupo será fechado automaticamente às ${horario}.`);

}
break;

case "abrirgp": {

    if (!isGroup) return reply("Esse comando é apenas para grupos.");
    if (!isAdmin && !soDono) return reply("Apenas administradores.");

    if (!args[0])
        return reply("Use: abrirgp 07:00");

    const horario = args[0];

    const db = lerHorario();

    if (!db[from]) db[from] = {};

    db[from].abrir = horario;

    salvarHorario(db);

    reply(`🔓 Grupo será aberto automaticamente às ${horario}.`);

}
break;

case "atualizar": {
    if (!soDono) return enviar("❌ Apenas o dono pode usar este comando.");
    await enviar("🔄 *Verificando atualizações globais...*");
    try {
        const { checkAndApplyUpdates } = require('./autoupdate');
        const updated = await checkAndApplyUpdates();
        if (updated) {
            await enviar("✅ *Atualização encontrada e aplicada! O bot será reiniciado em instantes...*");
            setTimeout(() => {
                process.exit(0);
            }, 2000);
        } else {
            await enviar("🙌 *O bot já está na versão mais recente disponível.*");
        }
    } catch (err) {
        console.error(err);
        await enviar("❌ *Erro ao tentar atualizar:* " + err.message);
    }
    break;
}

case 'autosticker': {
    if (!isGroup) return reply("Somente em grupos.");
    if (!isAdmin && !soDono) return reply("Apenas administradores.");

    const db = lerAutoSticker();
    const estado = args[0];

    if (estado === '1') {

        if (db[from])
            return reply("🧩 O AutoSticker já está ativado.");

        db[from] = true;
        salvarAutoSticker(db);

        reply("🧩 AutoSticker ativado com sucesso.");
    }

    else if (estado === '0') {

        if (!db[from])
            return reply("🚫 O AutoSticker já está desativado.");

        delete db[from];
        salvarAutoSticker(db);

        reply("🚫 AutoSticker desativado.");
    }

    else {
        reply(
`Use:

${prefix}autosticker 1 → ativar
${prefix}autosticker 0 → desativar`
        );
    }
}
break;

case 'bemvindo': {
    if (!isGroup) return reply("Esse comando só funciona em grupos.");
    if (!isAdmin && !soDono) return reply("Apenas administradores.");

    const db = lerBemVindo();

    if (args[0] === '1') {
        db[from] = true;
        salvarBemVindo(db);
        reply("✅ Sistema de boas vindas ativado com sucesso.");
    } 
    
    else if (args[0] === '0') {
        delete db[from];
        salvarBemVindo(db);
        reply("🚫 Sistema de boas vindas desativda.");
    } 
    
    else {
        reply(`Use:\n${prefix}bemvindo 1 (ativar)\n${prefix}bemvindo 0 (desativar)`);
    }
}
break;

case 'tapa': {
    if (!isGroup) return reply("👋 Esse comando só funciona em grupos.");

    const alvo =
        mentioned[0] ||
        info.message?.extendedTextMessage?.contextInfo?.participant;

    if (!alvo)
        return reply("👋 Marque alguém ou responda a mensagem da vítima.");

    const autor = info.key.participant || info.key.remoteJid;

    const lidDono = String(data.LidDono).replace(/\D/g,'');
    const lidAlvo = alvo.split("@")[0].replace(/\D/g,'');

    const nomeAutor = autor.split("@")[0];
    const nomeAlvo = alvo.split("@")[0];

    // 👋 reação automática
    await client.sendMessage(from, {
        react: { text: "👋", key: info.key }
    });

    // 👑 PROTEÇÃO SUPREMA DO DONO
    if (lidAlvo === lidDono) {

        const frasesDono = [
            `👑 @${nomeAutor}, no dono ninguém encosta.`,
            `🛑 @${nomeAutor}, respeite o mestre.`,
            `⚠️ @${nomeAutor}, alvo protegido.`,
            `🚫 @${nomeAutor}, você não pode tocar no supremo.`,
            `👑 @${nomeAutor}, isso não é permitido.`
        ];

        return client.sendMessage(from, {
            text: frasesDono[Math.floor(Math.random()*frasesDono.length)],
            mentions: [autor]
        }, { quoted: info });
    }

    const acoes = [
        "deu um tapa bem gostoso na raba de",
        "mandou um tapão bem safado na bunda de",
        "deu um tapa cheio de malícia na raba de",
        "deu um tapinha ousado na bunda de",
        "mandou um tapa provocante na raba de",
        "deu um tapa sem vergonha na bunda de",
        "deu um tapinha atrevido na raba de",
        "deu um tapa maroto e safado na bunda de",
        "mandou um tapinha cheio de segundas intenções na raba de",
        "deu um tapa bem maldoso na bunda de"
    ];

    const emojis = ["😈","😏","🔥","😜","😋","😉","😎","🤭","😼","😝"];

    const acao = acoes[Math.floor(Math.random() * acoes.length)];
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];

    const mensagem =
`😈 @${nomeAutor} ${acao} @${nomeAlvo}. ${emoji}

> 𝙵𝙰𝙰𝚃𝙰𝙻 𝙼𝙳`;

    const fs = require('fs');
    const caminhoVideo = "./arquivos/fotos/tapa.mp4";

    try {
        if (fs.existsSync(caminhoVideo)) {
            await client.sendMessage(from, {
                video: fs.readFileSync(caminhoVideo),
                gifPlayback: true,
                caption: mensagem,
                mentions: [autor, alvo]
            }, { quoted: info });
        } else {
            await client.sendMessage(from, {
                text: mensagem,
                mentions: [autor, alvo]
            }, { quoted: info });
        }
    } catch {
        await client.sendMessage(from, {
            text: mensagem,
            mentions: [autor, alvo]
        }, { quoted: info });
    }
}
break;

case "rankativo": {
    if (!isGroup) return enviar("❌ Este comando só funciona em grupos.");
    
    await reagir("📊");
    
    const dbAtividades = lerAtividades();
    const atividadesGrupo = dbAtividades[from];

    if (!atividadesGrupo || Object.keys(atividadesGrupo).length === 0) {
        return enviar("❌ Ainda não há dados de atividade registrados neste grupo.");
    }

    const ranking = Object.entries(atividadesGrupo)
        .map(([id, data]) => ({ id, ...data }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 10);

    let mensagemRanking = `╭━━━〔 📊 *RANKING DE ATIVIDADE* 〕━━━╮\n┃\n`;
    let mentions = [];
    
    ranking.forEach((user, index) => {
        const medalha = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "👤";
        const jid = user.id;
        mentions.push(jid);
        
        const msgs = user.mensagens || 0;
        const cmds = user.comandos || 0;
        const total = user.total || (msgs + cmds);

        mensagemRanking += `┃ ${medalha} *${index + 1}º:* @${jid.split('@')[0]}\n`;
        mensagemRanking += `┃ ➜ 💬 Mensagens: *${msgs}*\n`;
        mensagemRanking += `┃ ➜ ⚡ Comandos: *${cmds}*\n`;
        mensagemRanking += `┃ ➜ 🔥 Total: *${total}*\n┃\n`;
    });
    
    mensagemRanking += `╰━━━━━━━━━━━━━━━━━━━━╯`;

    await client.sendMessage(from, { text: mensagemRanking, mentions: mentions }, { quoted: info });
    break;
}

case "rankinativo": {
    if (!isGroup) return enviar("❌ Este comando só funciona em grupos.");
    
    await reagir("💤");
    
    const dbAtividades = lerAtividades();
    const atividadesGrupo = dbAtividades[from] || {};

    // Pega todos os participantes atuais do grupo
    const metadata = await client.groupMetadata(from);
    const participantes = metadata.participants;

    // Filtra quem tem 1 mensagem ou menos (ou nem está no banco de dados)
    let inativos = participantes.map(p => {
        const dados = atividadesGrupo[p.id] || { mensagens: 0, comandos: 0, total: 0 };
        return {
            id: p.id,
            total: dados.total || 0,
            mensagens: dados.mensagens || 0,
            comandos: dados.comandos || 0
        };
    }).filter(user => user.total <= 1);

    if (inativos.length === 0) {
        return enviar("✅ Não há membros inativos (com 1 mensagem ou menos) registrados nos últimos 7 dias.");
    }

    // Ordena pelos mais inativos (menor total primeiro) e pega os top 10
    const rankingInativos = inativos
        .sort((a, b) => a.total - b.total)
        .slice(0, 10);

    let mensagemInativos = `╔══❖•ೋ° RANKING DE INATIVOS °ೋ•❖══╗
║
`;

let mentions = [];

rankingInativos.forEach((user, index) => {
    const jid = user.id;
    mentions.push(jid);

    mensagemInativos += `║ ${index + 1}º ┋ 🪫 @${jid.split('@')[0]}\n`;
    mensagemInativos += `║      ➥ 💬 ${user.mensagens} msgs\n`;

    if (index !== rankingInativos.length - 1) {
        mensagemInativos += `║ ─────────────────────────\n`;
    }
});

mensagemInativos += `╚═════════════════════════════╝`;
    await client.sendMessage(from, { text: mensagemInativos, mentions: mentions }, { quoted: info });
    break;
}





case "atp": {
    try {
        // pega texto do usuário
        let text = body?.trim()?.split(/ +/).slice(1).join(" ");
        if (!text) return enviar("❌ Envie um texto para gerar a figurinha.");

        const fs = require("fs");
        const path = require("path");

        const dataConfig = JSON.parse(fs.readFileSync("./dono/config/data.json"));
        const apiKey = dataConfig.apikey2;
        if (!apiKey) return enviar("❌ apikey2 não encontrada.");
       await client.sendMessage(from, { text: "✨ Criando figurinha..." }, { quoted: info });

        const apiURL = `https://api.blackaut.shop/sticker/atp/1?texto=${encodeURIComponent(text)}&apikey=${apiKey}`;

        const response = await fetch(apiURL);
        if (!response.ok) return enviar("❌ Falha ao gerar a figurinha.");

        const buffer = Buffer.from(await response.arrayBuffer());
        const isAnimated = buffer.includes(Buffer.from("ANIM"));

        if (isAnimated) {
            await client.sendMessage(from, { sticker: buffer }, { quoted: info });
        } else {
            await sendImageAsSticker2(client, from, buffer, info, {
                packname: "𝐅𝐄𝐈𝐓𝐀 𝐏𝐎𝐑: 𝐅𝐀𝐀𝐓𝐀𝐋 𝐌𝐃"
            });
        }

    } catch (err) {
        console.log("Erro atp1:", err);
        enviar("❌ Falha ao gerar a figurinha.");
    }
}
break

case "attp": {
    try {
        // pega texto do usuário
        let text = body?.trim()?.split(/ +/).slice(1).join(" ");
        if (!text) return enviar("❌ Envie um texto para gerar a figurinha.");

        const fs = require("fs");
        const path = require("path");

        const dataConfig = JSON.parse(fs.readFileSync("./dono/config/data.json"));
        const apiKey = dataConfig.apikey2;
        if (!apiKey) return enviar("❌ apikey2 não encontrada.");
       await client.sendMessage(from, { text: "✨ Criando figurinha..." }, { quoted: info });


        const apiURL = `https://api.blackaut.shop/sticker/attp/1/animado?texto=${encodeURIComponent(text)}&apikey=${apiKey}`;

        const response = await fetch(apiURL);
        if (!response.ok) return enviar("❌ Falha ao gerar a figurinha animada.");

        const buffer = Buffer.from(await response.arrayBuffer());
        const isAnimated = buffer.includes(Buffer.from("ANIM"));

        if (isAnimated) {
            await client.sendMessage(from, { sticker: buffer }, { quoted: info });
        } else {
            await sendImageAsSticker2(client, from, buffer, info, {
                packname: "𝐅𝐄𝐈𝐓𝐀 𝐏𝐎𝐑: 𝐅𝐀𝐀𝐓𝐀𝐋 𝐌𝐃"
            });
        }

    } catch (err) {
        console.log("Erro attp1:", err);
        enviar("❌ Falha ao gerar a figurinha animada.");
    }
}
break

case "figbts": {
    try {
        const fs = require("fs");
        const path = require("path");

        const dataConfig = JSON.parse(fs.readFileSync("./dono/config/data.json"));
        const apiKey = dataConfig.apikey2;
        if (!apiKey) return enviar("❌ apikey2 não encontrada.");

        const apiURL = `https://api.blackaut.shop/sticker/figu_bts?apikey=${apiKey}`;

        let destino = from;
        if (isGroup) {
            const sender = info.key.participant || info.key.remoteJid;
            destino = sender;
            await client.sendMessage(from, { text: "🎵 Enviando figurinhas BTS no seu PV..." }, { quoted: info });
        } else {
            await client.sendMessage(from, { text: "🎵 Enviando figurinhas BTS..." }, { quoted: info });
        }

        const tmpDir = path.join(__dirname, "tmp");
        if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

        for (let i = 0; i < 5; i++) {
            const response = await fetch(apiURL);
            if (!response.ok) continue;

            const buffer = Buffer.from(await response.arrayBuffer());
            const isAnimated = buffer.includes(Buffer.from("ANIM"));

            if (isAnimated) {
                await client.sendMessage(destino, { sticker: buffer });
            } else {
                await sendImageAsSticker2(client, destino, buffer, info, {
                    packname: "𝐅𝐄𝐈𝐓𝐀 𝐏𝐎𝐑: 𝐅𝐀𝐀𝐓𝐀𝐋 𝐌𝐃"
                });
            }
        }

    } catch (err) {
        console.log("Erro figbts:", err);
        enviar("❌ Falha ao gerar figurinhas BTS.");
    }
}
break

case "fig18": {
    try {
        const fs = require("fs");
        const path = require("path");

        const dataConfig = JSON.parse(fs.readFileSync("./dono/config/data.json"));
        const apiKey = dataConfig.apikey2;
        if (!apiKey) return enviar("❌ apikey2 não encontrada.");

        const apiURL = `https://api.blackaut.shop/sticker/figu+18?apikey=${apiKey}`;

        let destino = from;
        if (isGroup) {
            const sender = info.key.participant || info.key.remoteJid;
            destino = sender;
            await client.sendMessage(from, { text: "🔞 Enviando figurinhas 18+ no seu PV..." }, { quoted: info });
        } else {
            await client.sendMessage(from, { text: "🔞 Enviando figurinhas 18+..." }, { quoted: info });
        }

        const tmpDir = path.join(__dirname, "tmp");
        if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

        for (let i = 0; i < 5; i++) {
            const response = await fetch(apiURL);
            if (!response.ok) continue;

            const buffer = Buffer.from(await response.arrayBuffer());
            const isAnimated = buffer.includes(Buffer.from("ANIM"));

            if (isAnimated) {
                await client.sendMessage(destino, { sticker: buffer });
            } else {
                await sendImageAsSticker2(client, destino, buffer, info, {
                    packname: "𝐅𝐄𝐈𝐓𝐀 𝐏𝐎𝐑: 𝐅𝐀𝐀𝐓𝐀𝐋 𝐌𝐃"
                });
            }
        }

    } catch (err) {
        console.log("Erro fig18:", err);
        enviar("❌ Falha ao gerar figurinhas 18+.");
    }
}
break

case "figaleatori": {
    try {
        const fs = require("fs");
        const path = require("path");

        const dataConfig = JSON.parse(fs.readFileSync("./dono/config/data.json"));
        const apiKey = dataConfig.apikey2;
        if (!apiKey) return enviar("❌ apikey2 não encontrada.");

        const apiURL = `https://api.blackaut.shop/sticker/figu_aleatori?apikey=${apiKey}`;

        let destino = from;
        if (isGroup) {
            const sender = info.key.participant || info.key.remoteJid;
            destino = sender;
            await client.sendMessage(from, { text: "🎲 Enviando figurinhas aleatórias no seu PV..." }, { quoted: info });
        } else {
            await client.sendMessage(from, { text: "🎲 Enviando figurinhas aleatórias..." }, { quoted: info });
        }

        const tmpDir = path.join(__dirname, "tmp");
        if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

        for (let i = 0; i < 5; i++) {
            const response = await fetch(apiURL);
            if (!response.ok) continue;

            const buffer = Buffer.from(await response.arrayBuffer());
            const isAnimated = buffer.includes(Buffer.from("ANIM"));

            if (isAnimated) {
                await client.sendMessage(destino, { sticker: buffer });
            } else {
                await sendImageAsSticker2(client, destino, buffer, info, {
                    packname: "𝐅𝐄𝐈𝐓𝐀 𝐏𝐎𝐑: 𝐅𝐀𝐀𝐓𝐀𝐋 𝐌𝐃"
                });
            }
        }

    } catch (err) {
        console.log("Erro figaleatori:", err);
        enviar("❌ Falha ao gerar figurinhas aleatórias.");
    }
}
break

case "figemoji": {
    try {
        const fs = require("fs");
        const path = require("path");

        const dataConfig = JSON.parse(fs.readFileSync("./dono/config/data.json"));
        const apiKey = dataConfig.apikey2;
        if (!apiKey) return enviar("❌ apikey2 não encontrada.");

        const apiURL = `https://api.blackaut.shop/sticker/figu_emoji?apikey=${apiKey}`;

        let destino = from;
        if (isGroup) {
            const sender = info.key.participant || info.key.remoteJid;
            destino = sender;
            await client.sendMessage(from, { text: "😎 Enviando figurinhas de emoji no seu PV..." }, { quoted: info });
        } else {
            await client.sendMessage(from, { text: "😎 Enviando figurinhas de emoji..." }, { quoted: info });
        }

        const tmpDir = path.join(__dirname, "tmp");
        if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

        for (let i = 0; i < 5; i++) {
            const response = await fetch(apiURL);
            if (!response.ok) continue;

            const buffer = Buffer.from(await response.arrayBuffer());
            const isAnimated = buffer.includes(Buffer.from("ANIM"));

            if (isAnimated) {
                await client.sendMessage(destino, { sticker: buffer });
            } else {
                await sendImageAsSticker2(client, destino, buffer, info, {
                    packname: "𝐅𝐄𝐈𝐓𝐀 𝐏𝐎𝐑: 𝐅𝐀𝐀𝐓𝐀𝐋 𝐌𝐃"
                });
            }
        }

    } catch (err) {
        console.log("Erro figemoji:", err);
        enviar("❌ Falha ao gerar figurinhas de emoji.");
    }
}
break

case "figraiva": {
    try {
        const fs = require("fs");
        const path = require("path");

        const dataConfig = JSON.parse(fs.readFileSync("./dono/config/data.json"));
        const apiKey = dataConfig.apikey2;
        if (!apiKey) return enviar("❌ apikey2 não encontrada.");

        const apiURL = `https://api.blackaut.shop/sticker/figu_raiva?apikey=${apiKey}`;

        let destino = from;
        if (isGroup) {
            const sender = info.key.participant || info.key.remoteJid;
            destino = sender;
            await client.sendMessage(from, { text: "😡 Enviando figurinhas de raiva no seu PV..." }, { quoted: info });
        } else {
            await client.sendMessage(from, { text: "😡 Enviando figurinhas de raiva..." }, { quoted: info });
        }

        const tmpDir = path.join(__dirname, "tmp");
        if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

        for (let i = 0; i < 5; i++) {
            const response = await fetch(apiURL);
            if (!response.ok) continue;

            const buffer = Buffer.from(await response.arrayBuffer());
            const isAnimated = buffer.includes(Buffer.from("ANIM"));

            if (isAnimated) {
                await client.sendMessage(destino, { sticker: buffer });
            } else {
                await sendImageAsSticker2(client, destino, buffer, info, {
                    packname: "𝐅𝐄𝐈𝐓𝐀 𝐏𝐎𝐑: 𝐅𝐀𝐀𝐓𝐀𝐋 𝐌𝐃"
                });
            }
        }

    } catch (err) {
        console.log("Erro figraiva:", err);
        enviar("❌ Falha ao gerar figurinhas de raiva.");
    }
}
break

case "figcoreana": {
    try {
        const fs = require("fs");
        const path = require("path");

        const dataConfig = JSON.parse(fs.readFileSync("./dono/config/data.json"));
        const apiKey = dataConfig.apikey2;
        if (!apiKey) return enviar("❌ apikey2 não encontrada.");

        const apiURL = `https://api.blackaut.shop/sticker/figu_coreana?apikey=${apiKey}`;

        let destino = from;
        if (isGroup) {
            const sender = info.key.participant || info.key.remoteJid;
            destino = sender;
            await client.sendMessage(from, { text: "💖 Enviando figurinhas coreanas no seu PV..." }, { quoted: info });
        } else {
            await client.sendMessage(from, { text: "💖 Enviando figurinhas coreanas..." }, { quoted: info });
        }

        const tmpDir = path.join(__dirname, "tmp");
        if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

        for (let i = 0; i < 5; i++) {
            const response = await fetch(apiURL);
            if (!response.ok) continue;

            const buffer = Buffer.from(await response.arrayBuffer());
            const isAnimated = buffer.includes(Buffer.from("ANIM"));

            if (isAnimated) {
                await client.sendMessage(destino, { sticker: buffer });
            } else {
                await sendImageAsSticker2(client, destino, buffer, info, {
                    packname: "𝐅𝐄𝐈𝐓𝐀 𝐏𝐎𝐑: 𝐅𝐀𝐀𝐓𝐀𝐋 𝐌𝐃"
                });
            }
        }

    } catch (err) {
        console.log("Erro figcoreana:", err);
        enviar("❌ Falha ao gerar figurinhas coreanas.");
    }
}
break

case "figdesenho": {
    try {

        const fs = require("fs");
        const path = require("path");

        // carrega apikey do seu config
        const dataConfig = JSON.parse(
            fs.readFileSync("./dono/config/data.json")
        );

        const apiKey = dataConfig.apikey2;
        if (!apiKey) return enviar("❌ apikey2 não encontrada.");

        // URL da API de desenho
        const apiURL = `https://api.blackaut.shop/sticker/figu_desenho?apikey=${apiKey}`;

        // define destino inteligente (PV ou remetente)
        let destino = from;

        if (isGroup) {
            const sender = info.key.participant || info.key.remoteJid;
            destino = sender;
            await client.sendMessage(from, {
                text: "🎨 Enviando figurinhas de desenho no seu PV..."
            }, { quoted: info });
        } else {
            await client.sendMessage(from, {
                text: "🎨 Enviando figurinhas de desenho..."
            }, { quoted: info });
        }

        // cria pasta tmp se não existir
        const tmpDir = path.join(__dirname, "tmp");
        if (!fs.existsSync(tmpDir)) {
            fs.mkdirSync(tmpDir);
        }

        // envia 5 figurinhas
        for (let i = 0; i < 5; i++) {

            const response = await fetch(apiURL);
            if (!response.ok) continue;

            const buffer = Buffer.from(await response.arrayBuffer());

            const isAnimated = buffer.includes(Buffer.from("ANIM"));

            if (isAnimated) {
                await client.sendMessage(destino, {
                    sticker: buffer
                });
            } else {
                await sendImageAsSticker2(client, destino, buffer, info, {
                    packname: "𝐅𝐄𝐈𝐓𝐀 𝐏𝐎𝐑: 𝐅𝐀𝐀𝐓𝐀𝐋 𝐌𝐃"
                });
            }
        }

    } catch (err) {
        console.log("Erro figdesenho:", err);
        enviar("❌ Falha ao gerar figurinhas de desenho.");
    }
}
break

case "figmeme": {
    try {

        const fs = require("fs");
        const path = require("path");

        // pega apikey do seu config
        const dataConfig = JSON.parse(
            fs.readFileSync("./dono/config/data.json")
        );

        const apiKey = dataConfig.apikey2;
        if (!apiKey) return enviar("❌ apikey2 não encontrada.");

        const apiURL = `https://api.blackaut.shop/sticker/figu_memes2?apikey=${apiKey}`;

        // define destino inteligente
        let destino = from;

        if (isGroup) {
            const sender = info.key.participant || info.key.remoteJid;
            destino = sender; 
            await client.sendMessage(from, {
                text: "🤣 Enviando figurinhas de memes no seu PV..."
            }, { quoted: info });
        } else {
            await client.sendMessage(from, {
                text: "🤣 Enviando figurinhas de memes..."
            }, { quoted: info });
        }

        // cria pasta tmp segura
        const tmpDir = path.join(__dirname, "tmp");
        if (!fs.existsSync(tmpDir)) {
            fs.mkdirSync(tmpDir);
        }

        // 🔥 envia 5 figurinhas de meme
        for (let i = 0; i < 6; i++) {

            const response = await fetch(apiURL);
            if (!response.ok) continue;

            const buffer = Buffer.from(await response.arrayBuffer());

            const isAnimated = buffer.includes(Buffer.from("ANIM"));

            if (isAnimated) {
                await client.sendMessage(destino, {
                    sticker: buffer
                });
            } else {
                await sendImageAsSticker2(client, destino, buffer, info, {
                    packname: "𝐅𝐄𝐈𝐓𝐀 𝐏𝐎𝐑: 𝐅𝐀𝐀𝐓𝐀𝐋 𝐌𝐃"
                });
            }

        }

    } catch (err) {
        console.log("Erro figmeme:", err);
        enviar("❌ Falha ao gerar figurinhas de memes.");
    }
}
break

case "figroblox": {
    try {

        const fs = require("fs");
        const path = require("path");

        // pega apikey do seu config
        const dataConfig = JSON.parse(
            fs.readFileSync("./dono/config/data.json")
        );

        const apiKey = dataConfig.apikey2;
        if (!apiKey) return enviar("❌ apikey2 não encontrada.");

        const apiURL = `https://api.blackaut.shop/sticker/figu_roblox?apikey=${apiKey}`;

        // define destino inteligente
        let destino = from;

        if (isGroup) {
            const sender = info.key.participant || info.key.remoteJid;
            destino = sender; 
            await client.sendMessage(from, {
                text: "🎨 Enviando figurinhas Roblox no seu PV..."
            }, { quoted: info });
        } else {
            await client.sendMessage(from, {
                text: "🎨 Enviando figurinhas Roblox..."
            }, { quoted: info });
        }

        // cria pasta tmp segura
        const tmpDir = path.join(__dirname, "tmp");
        if (!fs.existsSync(tmpDir)) {
            fs.mkdirSync(tmpDir);
        }

        // 🔥 envia 5 figurinhas
        for (let i = 0; i < 6; i++) {

            const response = await fetch(apiURL);
            if (!response.ok) continue;

            const buffer = Buffer.from(await response.arrayBuffer());

            const isAnimated = buffer.includes(Buffer.from("ANIM"));

            if (isAnimated) {
                await client.sendMessage(destino, {
                    sticker: buffer
                });
            } else {
                await sendImageAsSticker2(client, destino, buffer, info, {
                    packname: "𝐅𝐄𝐈𝐓𝐀 𝐏𝐎𝐑: 𝐅𝐀𝐀𝐓𝐀𝐋 𝐌𝐃"
                });
            }

        }

    } catch (err) {
        console.log("Erro figroblox:", err);
        enviar("❌ Falha ao gerar figurinhas Roblox.");
    }
}
break

case "figanime": {
    try {

        const fs = require("fs");
        const path = require("path");

        const dataConfig = JSON.parse(
            fs.readFileSync("./dono/config/data.json")
        );

        const apiKey = dataConfig.apikey2;
        if (!apiKey) return enviar("❌ apikey2 não encontrada.");

        const apiURL = `https://api.blackaut.shop/sticker/figu_anime?apikey=${apiKey}`;

        // define destino inteligente
        let destino = from;

        if (isGroup) {
            const sender = info.key.participant || info.key.remoteJid;
destino = sender; 
            await client.sendMessage(from, {
                text: "🎨 Enviando figurinhas anime no seu PV..."
            }, { quoted: info });
        } else {
            await client.sendMessage(from, {
                text: "🎨 Enviando figurinhas anime..."
            }, { quoted: info });
        }

        // cria pasta tmp segura
        const tmpDir = path.join(__dirname, "tmp");
        if (!fs.existsSync(tmpDir)) {
            fs.mkdirSync(tmpDir);
        }

        // 🔥 envia 5 figurinhas
        for (let i = 0; i < 6; i++) {

            const response = await fetch(apiURL);
            if (!response.ok) continue;

            const buffer = Buffer.from(await response.arrayBuffer());

            const isAnimated = buffer.includes(Buffer.from("ANIM"));

            if (isAnimated) {
                await client.sendMessage(destino, {
                    sticker: buffer
                });
            } else {
                await sendImageAsSticker2(client, destino, buffer, info, {
                    packname: "𝐅𝐄𝐈𝐓𝐀 𝐏𝐎𝐑: 𝐅𝐀𝐀𝐓𝐀𝐋 𝐌𝐃"
                });
            }

          }

    } catch (err) {
        console.log("Erro figanime:", err);
        enviar("❌ Falha ao gerar figurinhas.");
    }
}
break;

case 'rankrico': {
    if (!isGroup) return reply("💰 Esse comando só funciona em grupo.");

    const fs = require("fs");
    const groupMetadata = await client.groupMetadata(from);

    const participantes = groupMetadata.participants.map(p => p.id);
    const lidDono = String(data.LidDono).replace(/\D/g,'');

    if (participantes.length < 2)
        return reply("💰 Não há pessoas suficientes no grupo.");

    // reação
    await client.sendMessage(from, {
        react: { text: "💰", key: info.key }
    });

    const mensagensBusca = [
        "💰 Investigando patrimônios milionários...",
        "🏦 Verificando contas bancárias secretas...",
        "💳 Detectando riqueza acumulada...",
        "📈 Avaliando nível financeiro do grupo...",
        "🪙 Rastreando sinais de ostentação..."
    ];

    await client.sendMessage(from, {
        text: mensagensBusca[Math.floor(Math.random()*mensagensBusca.length)]
    }, { quoted: info });

    await new Promise(r => setTimeout(r, 2000));

    // encontra dono
    const idDonoGrupo = participantes.find(id =>
        id.split("@")[0].replace(/\D/g,'') === lidDono
    );

    const semDono = participantes.filter(id => id !== idDonoGrupo);
    const embaralhado = semDono.sort(() => 0.5 - Math.random());

    const quantidade = Math.min(5, participantes.length);

    const top = [];
    if (idDonoGrupo) top.push(idDonoGrupo);

    for (let i = 0; i < quantidade - 1 && i < embaralhado.length; i++) {
        top.push(embaralhado[i]);
    }

    const posicoes = [
        "🥇 1° Lugar — Patrimônio de outro nível",
        "🥈 2° Lugar — Vida confortável e sem apertos",
        "🥉 3° Lugar — Dinheiro nunca falta",
        "💎 4° Lugar — Vive com luxo discreto",
        "🏦 5° Lugar — Futuro financeiramente promissor"
    ];

    let textoRanking =
`┏━━ 💰 𝐑𝐀𝐍𝐊 𝐃𝐎𝐒 𝐌𝐀𝐈𝐒 𝐑𝐈𝐂𝐎𝐒 💰 ━━┓\n\n`;

    top.forEach((jid, index) => {
        textoRanking += `${posicoes[index]}\n@${jid.split("@")[0]}\n\n`;
    });

    const caminhoImagem = "./arquivos/fotos/rico.jpg";

    try {
        if (fs.existsSync(caminhoImagem)) {
            await client.sendMessage(from, {
                image: fs.readFileSync(caminhoImagem),
                caption: textoRanking,
                mentions: top
            }, { quoted: info });
        } else {
            await client.sendMessage(from, {
                text: textoRanking,
                mentions: top
            }, { quoted: info });
        }
    } catch {
        await client.sendMessage(from, {
            text: textoRanking,
            mentions: top
        }, { quoted: info });
    }
}
break;

case 'rankpobre': {
    if (!isGroup) return reply("💸 Esse comando só funciona em grupo.");

    const fs = require("fs");
    const groupMetadata = await client.groupMetadata(from);

    const participantes = groupMetadata.participants.map(p => p.id);
    const lidDono = String(data.LidDono).replace(/\D/g,'');

    if (participantes.length < 2)
        return reply("💸 Não há pessoas suficientes no grupo.");

    // 💸 reação
    await client.sendMessage(from, {
        react: { text: "💸", key: info.key }
    });

    const mensagensBusca = [
        "💸 Verificando quem está no modo economia...",
        "🪙 Calculando saldo negativo...",
        "📉 Analisando dificuldades financeiras...",
        "🧾 Conferindo contas atrasadas...",
        "🥲 Detectando carteiras vazias..."
    ];

    await client.sendMessage(from, {
        text: mensagensBusca[Math.floor(Math.random()*mensagensBusca.length)]
    }, { quoted: info });

    await new Promise(r => setTimeout(r, 2000));

    // ❌ remove dono completamente
    const semDono = participantes.filter(id =>
        id.split("@")[0].replace(/\D/g,'') !== lidDono
    );

    if (semDono.length < 1)
        return reply("💸 Não há candidatos suficientes.");

    const embaralhado = semDono.sort(() => 0.5 - Math.random());

    const quantidade = Math.min(5, semDono.length);
    const top = embaralhado.slice(0, quantidade);

    const posicoes = [
        "🥇 1° Lugar — Sobrevivendo com criatividade",
        "🥈 2° Lugar — Sempre esperando o próximo pagamento",
        "🥉 3° Lugar — Especialista em promoções",
        "🪙 4° Lugar — Mestre do fiado",
        "📉 5° Lugar — Vivendo no modo economia"
    ];

    let textoRanking =
`┏━━ 💸 𝐑𝐀𝐍𝐊 𝐃𝐎𝐒 𝐌𝐀𝐈𝐒 𝐏𝐎𝐁𝐑𝐄𝐒 💸 ━━┓\n\n`;

    top.forEach((jid, index) => {
        textoRanking += `${posicoes[index]}\n@${jid.split("@")[0]}\n\n`;
    });

    const caminhoImagem = "./arquivos/fotos/pobre.jpg";

    try {
        if (fs.existsSync(caminhoImagem)) {
            await client.sendMessage(from, {
                image: fs.readFileSync(caminhoImagem),
                caption: textoRanking,
                mentions: top
            }, { quoted: info });
        } else {
            await client.sendMessage(from, {
                text: textoRanking,
                mentions: top
            }, { quoted: info });
        }
    } catch {
        await client.sendMessage(from, {
            text: textoRanking,
            mentions: top
        }, { quoted: info });
    }
}
break;

case 'rankego': {
    if (!isGroup) return reply("👑 Esse comando só funciona em grupo.");

    const fs = require("fs");
    const groupMetadata = await client.groupMetadata(from);

    const participantes = groupMetadata.participants.map(p => p.id);
    const lidDono = String(data.LidDono).replace(/\D/g,'');

    if (participantes.length < 2)
        return reply("👑 Não há pessoas suficientes no grupo.");

    // 👑 reação
    await client.sendMessage(from, {
        react: { text: "👑", key: info.key }
    });

    const mensagensBusca = [
        "👑 Detectando níveis de autoestima elevada...",
        "🪞 Analisando quem se acha o protagonista...",
        "✨ Medindo níveis de confiança extrema...",
        "📸 Verificando quem vive em modo destaque...",
        "🔥 Detectando energias de estrela principal..."
    ];

    await client.sendMessage(from, {
        text: mensagensBusca[Math.floor(Math.random()*mensagensBusca.length)]
    }, { quoted: info });

    await new Promise(r => setTimeout(r, 2000));

    // ❌ remove dono completamente
    const semDono = participantes.filter(id =>
        id.split("@")[0].replace(/\D/g,'') !== lidDono
    );

    if (semDono.length < 1)
        return reply("👑 Não há candidatos suficientes.");

    const embaralhado = semDono.sort(() => 0.5 - Math.random());

    const quantidade = Math.min(5, semDono.length);
    const top = embaralhado.slice(0, quantidade);

    const posicoes = [
        "🥇 1° Lugar — Centro do universo",
        "🥈 2° Lugar — Energia de protagonista",
        "🥉 3° Lugar — Autoestima inabalável",
        "✨ 4° Lugar — Sempre em destaque",
        "🔥 5° Lugar — Confiança nas alturas"
    ];

    let textoRanking =
`┏━━ 👑 𝐑𝐀𝐍𝐊 𝐃𝐎 𝐄𝐆𝐎 👑 ━━┓\n\n`;

    top.forEach((jid, index) => {
        textoRanking += `${posicoes[index]}\n@${jid.split("@")[0]}\n\n`;
    });

    const caminhoImagem = "./arquivos/fotos/ego.jpg";

    try {
        if (fs.existsSync(caminhoImagem)) {
            await client.sendMessage(from, {
                image: fs.readFileSync(caminhoImagem),
                caption: textoRanking,
                mentions: top
            }, { quoted: info });
        } else {
            await client.sendMessage(from, {
                text: textoRanking,
                mentions: top
            }, { quoted: info });
        }
    } catch {
        await client.sendMessage(from, {
            text: textoRanking,
            mentions: top
        }, { quoted: info });
    }
}
break;

case 'rankpegador': {
    if (!isGroup) return reply("😏 Esse comando só funciona em grupo.");

    const fs = require("fs");
    const groupMetadata = await client.groupMetadata(from);

    const participantes = groupMetadata.participants.map(p => p.id);
    const lidDono = String(data.LidDono).replace(/\D/g,'');

    if (participantes.length < 2)
        return reply("😏 Não há pessoas suficientes no grupo.");

    // 😏 reação
    await client.sendMessage(from, {
        react: { text: "😏", key: info.key }
    });

    const mensagensBusca = [
        "😏 Investigando histórico amoroso...",
        "💘 Detectando corações conquistados...",
        "🔥 Analisando habilidades de conquista...",
        "👀 Observando quem faz sucesso...",
        "💬 Verificando quem nunca fica no vácuo..."
    ];

    await client.sendMessage(from, {
        text: mensagensBusca[Math.floor(Math.random()*mensagensBusca.length)]
    }, { quoted: info });

    await new Promise(r => setTimeout(r, 2000));

    // ❌ remove dono completamente
    const semDono = participantes.filter(id =>
        id.split("@")[0].replace(/\D/g,'') !== lidDono
    );

    if (semDono.length < 1)
        return reply("😏 Não há candidatos suficientes.");

    const embaralhado = semDono.sort(() => 0.5 - Math.random());

    const quantidade = Math.min(5, semDono.length);
    const top = embaralhado.slice(0, quantidade);

    const posicoes = [
        "🥇 1° Lugar — Dono(a) dos corações",
        "🥈 2° Lugar — Conquistador(a) nato(a)",
        "🥉 3° Lugar — Nunca fica no vácuo",
        "🔥 4° Lugar — Charme irresistível",
        "💘 5° Lugar — Especialista em flerte"
    ];

    let textoRanking =
`┏━━ 😏 𝐑𝐀𝐍𝐊 𝐃𝐎𝐒 𝐏𝐄𝐆𝐀𝐃𝐎𝐑𝐄𝐒 😏 ━━┓\n\n`;

    top.forEach((jid, index) => {
        textoRanking += `${posicoes[index]}\n@${jid.split("@")[0]}\n\n`;
    });

    const caminhoImagem = "./arquivos/fotos/pegador.jpg";

    try {
        if (fs.existsSync(caminhoImagem)) {
            await client.sendMessage(from, {
                image: fs.readFileSync(caminhoImagem),
                caption: textoRanking,
                mentions: top
            }, { quoted: info });
        } else {
            await client.sendMessage(from, {
                text: textoRanking,
                mentions: top
            }, { quoted: info });
        }
    } catch {
        await client.sendMessage(from, {
            text: textoRanking,
            mentions: top
        }, { quoted: info });
    }
}
break;

case 'rankinteligente': {
    if (!isGroup) return reply("🧠 Esse comando só funciona em grupo.");

    const fs = require("fs");
    const groupMetadata = await client.groupMetadata(from);

    const participantes = groupMetadata.participants.map(p => p.id);

    const lidDono = String(data.LidDono).replace(/\D/g, '');

    if (participantes.length < 2)
        return reply("🧠 Não há pessoas suficientes no grupo.");

    // reação
    await client.sendMessage(from, {
        react: { text: "🧠", key: info.key }
    });

    // mensagem de busca
    const mensagensBusca = [
        "🧠 Avaliando nível intelectual do grupo...",
        "📊 Medindo capacidade cerebral...",
        "🔬 Analisando mentes do grupo...",
        "⚡ Detectando raciocínio avançado...",
        "🤖 Processando inteligência coletiva..."
    ];

    await client.sendMessage(from, {
        text: mensagensBusca[Math.floor(Math.random()*mensagensBusca.length)]
    }, { quoted: info });

    await new Promise(r => setTimeout(r, 2000));

    // encontra dono
    const idDonoGrupo = participantes.find(id =>
        id.split("@")[0].replace(/\D/g,'') === lidDono
    );

    // remove dono temporariamente
    const semDono = participantes.filter(id => id !== idDonoGrupo);

    // embaralha
    const embaralhado = semDono.sort(() => 0.5 - Math.random());

    // quantidade final (máx 5)
    const quantidade = Math.min(5, participantes.length);

    const top = [];

    // dono sempre primeiro
    if (idDonoGrupo) top.push(idDonoGrupo);

    for (let i = 0; i < quantidade - 1 && i < embaralhado.length; i++) {
        top.push(embaralhado[i]);
    }

    const posicoes = [
        "🥇 1° Lugar — Mente Afiada",
        "🥈 2° Lugar — Raciocínio Rápido",
        "🥉 3° Lugar — Pensamento Ágil",
        "🧠 4° Lugar — Boa Percepção",
        "📚 5° Lugar — Intelecto Promissor"
    ];


    let textoRanking =
`┏━━ 🧠 𝐑𝐀𝐍𝐊 𝐈𝐍𝐓𝐄𝐋𝐈𝐆𝐄𝐍𝐓𝐄 🧠 ━━┓\n\n`;

    top.forEach((jid, index) => {
        

        textoRanking += `${posicoes[index]}\n@${jid.split("@")[0]}\n\n\n`;
    });

    const caminhoImagem = "./arquivos/fotos/inteligente.jpg";

    try {
        if (fs.existsSync(caminhoImagem)) {
            await client.sendMessage(from, {
                image: fs.readFileSync(caminhoImagem),
                caption: textoRanking,
                mentions: top
            }, { quoted: info });
        } else {
            await client.sendMessage(from, {
                text: textoRanking,
                mentions: top
            }, { quoted: info });
        }
    } catch {
        await client.sendMessage(from, {
            text: textoRanking,
            mentions: top
        }, { quoted: info });
    }
}
break;

case 'matar': {
    if (!isGroup) return reply("💀 Esse comando só funciona em grupos.");

    const alvo =
        mentioned[0] ||
        (info.message?.extendedTextMessage?.contextInfo?.participant);

    if (!alvo)
        return reply("💀 Marque alguém ou responda a mensagem da vítima.");

    const autor = info.key.participant || info.key.remoteJid;

    const lidDono = String(data.LidDono).replace(/\D/g,'');
    const lidAlvo = alvo.split("@")[0].replace(/\D/g,'');

    const nomeAutor = autor.split("@")[0];
    const nomeAlvo = alvo.split("@")[0];

    // 💀 REAÇÃO AUTOMÁTICA
    await client.sendMessage(from, {
        react: { text: "💀", key: info.key }
    });

    // 👑 PROTEÇÃO DO DONO
    if (lidAlvo === lidDono) {

        const frasesDono = [
            "👑 Você não pode matar meu mestre.",
            "🛑 O mestre é imortal.",
            "⚠️ Alvo invencível.",
            "🚫 Ataque negado.",
            "👑 O supremo não pode ser derrotado."
        ];

        return client.sendMessage(from, {
            text: `💀 @${nomeAutor} ${frasesDono[Math.floor(Math.random()*frasesDono.length)]}`,
            mentions: [autor]
        }, { quoted: info });
    }

    const acoes = [
        "eliminou sem deixar pistas ☠️",
        "finalizou com precisão mortal 🔥",
        "apagou da existência sem esforço 😈",
        "derrubou com um golpe crítico 💥",
        "mandou direto pro respawn 😎",
        "encerrou a missão com sucesso ⚔️",
        "não deu chance de sobrevivência ☠️",
        "executou com frieza absoluta 🥶",
        "deletou do mapa instantaneamente 🎯",
        "mandou dessa pra melhor 💀"
    ];

    const acao = acoes[Math.floor(Math.random() * acoes.length)];

    const mensagem =
`☠️ @${nomeAlvo} foi eliminado(a) sem piedade,
por 💀 @${nomeAutor} que ${acao}`;

    const fs = require('fs');
    const caminhoVideo = "./arquivos/fotos/matar.mp4";

    try {
        if (fs.existsSync(caminhoVideo)) {
            await client.sendMessage(from, {
                video: fs.readFileSync(caminhoVideo),
                gifPlayback: true,
                caption: mensagem,
                mentions: [autor, alvo]
            }, { quoted: info });
        } else {
            await client.sendMessage(from, {
                text: mensagem,
                mentions: [autor, alvo]
            }, { quoted: info });
        }
    } catch {
        await client.sendMessage(from, {
            text: mensagem,
            mentions: [autor, alvo]
        }, { quoted: info });
    }
}
break;

case 'comer': {
    if (!isGroup) return reply("😏 Esse comando só funciona em grupos.");

    const alvo =
        mentioned[0] ||
        (info.message?.extendedTextMessage?.contextInfo?.participant);

    if (!alvo)
        return reply("😏 Marquem alguém ou respondam a mensagem da vítima.");

    const autor = info.key.participant || info.key.remoteJid;

    const lidDono = String(data.LidDono).replace(/\D/g,'');
    const lidAlvo = alvo.split("@")[0].replace(/\D/g,'');

    const nomeAutor = autor.split("@")[0];
    const nomeAlvo = alvo.split("@")[0];

    // 😏 REAÇÃO AUTOMÁTICA
    await client.sendMessage(from, {
        react: { text: "😈", key: info.key }
    });

    // 👑 PROTEÇÃO DO DONO
    if (lidAlvo === lidDono) {

        const frasesDono = [
            "👑 Você não pode comer meu mestre.",
            "🛑 Meu mestre é intocável.",
            "⚠️ Respeite a hierarquia.",
            "🚫 Alvo proibido.",
            "😈 Nem tente."
        ];

        return client.sendMessage(from, {
            text: `😏 @${nomeAutor} ${frasesDono[Math.floor(Math.random()*frasesDono.length)]}`,
            mentions: [autor]
        }, { quoted: info });
    }

    const acoes = [
        "deixou sem conseguir nem sentar direito 😈",
        "fez sair andando todo torto depois 😏",
        "largou todo ardido pedindo descanso 🔥",
        "deixou mole igual boneco de posto 😎",
        "fez pedir arrego no meio do caminho 😈",
        "deixou em estado crítico pós-batalha 😏",
        "mandou pressão e acabou com o psicológico 🔥",
        "deixou parecendo que passou um trator 😎",
        "não teve dó e deixou só o sofrimento 😈",
        "fez precisar de recuperação urgente 😏"
    ];

    const acao = acoes[Math.floor(Math.random() * acoes.length)];

    const mensagem =
`😳 @${nomeAlvo} foi comido(a) gostosinho(a),
por 😈 @${nomeAutor} que ${acao}
> 𝙵𝙰𝙰𝚃𝙰𝙻 𝙼𝙳`;

    const fs = require('fs');
    const caminhoVideo = "./arquivos/fotos/comer.mp4";

    try {
        if (fs.existsSync(caminhoVideo)) {
            await client.sendMessage(from, {
                video: fs.readFileSync(caminhoVideo),
                gifPlayback: true,
                caption: mensagem,
                mentions: [autor, alvo]
            }, { quoted: info });
        } else {
            await client.sendMessage(from, {
                text: mensagem,
                mentions: [autor, alvo]
            }, { quoted: info });
        }
    } catch {
        await client.sendMessage(from, {
            text: mensagem,
            mentions: [autor, alvo]
        }, { quoted: info });
    }
}
break;

case 'espancar': {
    if (!isGroup) return reply("🥊 Esse comando só funciona em grupos.");

    const alvo =
        mentioned[0] ||
        (info.message?.extendedTextMessage?.contextInfo?.participant);

    if (!alvo)
        return reply("🥊 Marque alguém ou responda a mensagem da pessoa.");

    const autor = info.key.participant || info.key.remoteJid;

    const lidDono = String(data.LidDono).replace(/\D/g,'');
    const lidAlvo = alvo.split("@")[0].replace(/\D/g,'');

    const nomeAutor = autor.split("@")[0];
    const nomeAlvo = alvo.split("@")[0];

await client.sendMessage(from, {
        react: { text: "🥊", key: info.key }
    });
    // 👑 PROTEÇÃO DO DONO
    if (lidAlvo === lidDono) {

        const frasesDono = [
            "👑 Você não pode encostar no meu mestre.",
            "🛑 Acesso negado. Mestre intocável.",
            "⚠️ Respeite a hierarquia.",
            "👑 Meu mestre não participa disso.",
            "🚫 Alvo protegido pelo sistema supremo.",
            "🧊 Frio demais pra ser atingido.",
            "👑 O mestre está acima disso."
        ];

        return client.sendMessage(from, {
            text: `🥊 @${nomeAutor} ${frasesDono[Math.floor(Math.random()*frasesDono.length)]}`,
            mentions: [autor]
        }, { quoted: info });
    }

    const acoes = [
        "desceu a porrada sem piedade 💥",
        "aplicou um combo violento de socos 🥊",
        "distribuiu pancadas como se não houvesse amanhã 🔥",
        "sentou a mão com força máxima ⚡",
        "meteu uma sequência brutal de golpes 💣",
        "espancou sem dar chance de defesa 😵",
        "transformou a briga em treino profissional de boxe 🥊",
        "soltou golpes tão fortes que até o vento sentiu 🌪️"
    ];

    const acao = acoes[Math.floor(Math.random() * acoes.length)];

    const mensagem =
`💀 @${nomeAlvo} foi ESPANCADO(A) brutalmente,
por 🥊 @${nomeAutor} que ${acao}`;

    const fs = require('fs');
    const caminhoVideo = "./arquivos/fotos/espancar.mp4";

    try {
        if (fs.existsSync(caminhoVideo)) {
            await client.sendMessage(from, {
                video: fs.readFileSync(caminhoVideo),
                gifPlayback: true,
                caption: mensagem,
                mentions: [autor, alvo]
            }, { quoted: info });
        } else {
            await client.sendMessage(from, {
                text: mensagem,
                mentions: [autor, alvo]
            }, { quoted: info });
        }
    } catch {
        await client.sendMessage(from, {
            text: mensagem,
            mentions: [autor, alvo]
        }, { quoted: info });
    }
}
break;

case 'resetprefixgp': {
      if (!soDono)
        return reply("❌ Apenas meu mestre pode resetar o prefixo.");
    const fs = require('fs');
    const path = require('path');

    const caminho = path.join(__dirname, 'arquivos/config/prefixos.json');

    if (!fs.existsSync(caminho)) return reply("Nada para resetar.");

    const db = JSON.parse(fs.readFileSync(caminho));

    delete db[from];

    fs.writeFileSync(caminho, JSON.stringify(db, null, 2));

    reply("✅ Prefixo do grupo resetado.");
}
break;

case 'setprefixgp': {
    if (!isGroup) return reply("⚠️ Esse comando só funciona em grupos.");

    if (!soDono)
        return reply("❌ Apenas meu mestre pode alterar o prefixo.");

    const novoPrefixo = args.join(" ").trim();

    if (!novoPrefixo)
        return reply(
`⚙️ Configurar prefixo:

Exemplo:
${prefix}setprefixgp !

Isso mudará o prefixo apenas deste grupo.`
);

    if (novoPrefixo.length > 3)
        return reply("❌ O prefixo deve ter no máximo 3 caracteres.");

    const fs = require('fs');
    const path = require('path');

    const caminho = path.join(__dirname, 'arquivos/config/prefixos.json');

    const db = fs.existsSync(caminho)
        ? JSON.parse(fs.readFileSync(caminho))
        : {};

    db[from] = novoPrefixo;

    fs.writeFileSync(caminho, JSON.stringify(db, null, 2));

    reply(
`✅ Prefixo atualizado com sucesso!

📍 Este grupo agora usa: *${novoPrefixo}*
🌍 Outros grupos permanecem com: *${data.prefix}*`
    );
}
break;

case 'rankputa': {
    if (!isGroup) return reply("😈 Esse comando só funciona em grupo.");

    const groupMetadata = await client.groupMetadata(from);
    const lidDono = String(data.LidDono).replace(/\D/g,'');

    const participantes = groupMetadata.participants
        .map(p=>p.id)
        .filter(id=>id.split("@")[0].replace(/\D/g,'')!==lidDono);

    if (participantes.length < 2)
        return reply("😈 É necessário pelo menos 2 pessoas.");

    await client.sendMessage(from,{react:{text:"😈",key:info.key}});

    const mensagensBusca = [
        "😈 Analisando níveis de perigo romântico...",
        "🔥 Detectando presenças sedutoras...",
        "💋 Escaneando quem causa caos emocional...",
        "🖤 Identificando as mais fatais..."
    ];

    await client.sendMessage(from,{
        text: mensagensBusca[Math.floor(Math.random()*mensagensBusca.length)]
    },{quoted:info});

    await new Promise(r=>setTimeout(r,1500));

    const top = participantes.sort(()=>0.5-Math.random())
        .slice(0, Math.min(5, participantes.length));

    const pos=[
        "🥇 Perigo Máximo",
        "🥈 Coração Destruidor",
        "🥉 Fatal Attraction",
        "🔥 Problema Garantido",
        "💋 Encanto Perigoso"
    ];

    let txt=`┏━━━ 😈 𝐑𝐀𝐍𝐊 𝐃𝐀𝐒 𝐏𝐔𝐓𝐀 😈 ━━━┓\n\n`;

    top.forEach((id,i)=> txt+=`${pos[i] || "⭐ Destaque"}\n@${id.split("@")[0]}\n\n`);

    txt+="┗━━━━━━━━━━━━━━┛";

    const caminho="./arquivos/fotos/puta.jpg";

    if (fs.existsSync(caminho)){
        client.sendMessage(from,{image:fs.readFileSync(caminho),caption:txt,mentions:top},{quoted:info});
    } else {
        client.sendMessage(from,{text:txt,mentions:top},{quoted:info});
    }
}
break;

case 'rankcorno': {
    if (!isGroup) return reply("🤠 Esse comando só funciona em grupo.");

    const groupMetadata = await client.groupMetadata(from);
    const lidDono = String(data.LidDono).replace(/\D/g,'');

    const participantes = groupMetadata.participants
        .map(p=>p.id)
        .filter(id=>id.split("@")[0].replace(/\D/g,'')!==lidDono);

    if (participantes.length < 2)
        return reply("🤠 É necessário pelo menos 2 pessoas.");

    await client.sendMessage(from,{react:{text:"🤠",key:info.key}});

    const mensagensBusca = [
        "🤠 Investigando históricos suspeitos...",
        "🔎 Procurando sinais de traição...",
        "👀 Observando comportamentos duvidosos..."
    ];

    await client.sendMessage(from,{
        text: mensagensBusca[Math.floor(Math.random()*mensagensBusca.length)]
    },{quoted:info});

    await new Promise(r=>setTimeout(r,1500));

    const top = participantes.sort(()=>0.5-Math.random())
        .slice(0, Math.min(5, participantes.length));

    const pos=["🥇 Chifre Supremo","🥈 Radar Quebrado","🥉 Confia Demais","🤠 Suspeita Forte","💔 Sofredor"];

    let txt=`┏━━━ 🤠 𝐑𝐀𝐍𝐊 𝐃𝐄 𝐂𝐎𝐑𝐍𝐎 🤠 ━━━┓\n\n`;

    top.forEach((id,i)=> txt+=`${pos[i] || "⭐ Destaque"}\n@${id.split("@")[0]}\n\n`);

    txt+="┗━━━━━━━━━━━━━━┛";

    const caminho="./arquivos/fotos/corno.jpg";

    if (fs.existsSync(caminho)){
        client.sendMessage(from,{image:fs.readFileSync(caminho),caption:txt,mentions:top},{quoted:info});
    } else {
        client.sendMessage(from,{text:txt,mentions:top},{quoted:info});
    }
}
break;

case 'rankgado': {
    if (!isGroup) return reply("🐂 Esse comando só funciona em grupo.");

    const groupMetadata = await client.groupMetadata(from);
    const lidDono = String(data.LidDono).replace(/\D/g,'');

    const participantes = groupMetadata.participants
        .map(p=>p.id)
        .filter(id=>id.split("@")[0].replace(/\D/g,'')!==lidDono);

    if (participantes.length < 2)
        return reply("🐂 É necessário pelo menos 2 pessoas.");

    await client.sendMessage(from,{react:{text:"🐂",key:info.key}});

    const mensagensBusca = [
        "🐂 Escaneando níveis de gadice...",
        "💘 Detectando apego emocional...",
        "📡 Rastreando dependência afetiva...",
        "👀 Observando quem responde rápido..."
    ];

    await client.sendMessage(from,{
        text: mensagensBusca[Math.floor(Math.random()*mensagensBusca.length)]
    },{quoted:info});

    await new Promise(r=>setTimeout(r,1500));

    const top = participantes.sort(()=>0.5-Math.random())
        .slice(0, Math.min(5, participantes.length));

    const pos=["🥇 Gado Supremo","🥈 Pasto Premium","🥉 Apaixonado","🐄 Corre Atràs","💘 Emoção Demais"];

    let txt=`┏━━━ 🐂 𝐑𝐀𝐍𝐊 𝐃𝐄 𝐆𝐀𝐃𝐎 🐂 ━━━┓\n\n`;

    top.forEach((id,i)=> txt+=`${pos[i] || "⭐ Destaque"}\n@${id.split("@")[0]}\n\n`);

    txt+="┗━━━━━━━━━━━━━━┛";

    const caminho="./arquivos/fotos/gado.jpg";

    if (fs.existsSync(caminho)){
        client.sendMessage(from,{image:fs.readFileSync(caminho),caption:txt,mentions:top},{quoted:info});
    } else {
        client.sendMessage(from,{text:txt,mentions:top},{quoted:info});
    }
}
break;

case 'rankgay': {
    if (!isGroup) return reply("🌈 Esse comando só funciona em grupo.");

    const groupMetadata = await client.groupMetadata(from);
    const lidDono = String(data.LidDono).replace(/\D/g,'');

    const participantes = groupMetadata.participants
        .map(p=>p.id)
        .filter(id=>id.split("@")[0].replace(/\D/g,'')!==lidDono);

    if (participantes.length < 2)
        return reply("🌈 É necessário pelo menos 2 pessoas.");

    await client.sendMessage(from,{react:{text:"🌈",key:info.key}});

    const mensagensBusca = [
        "🌈 Identificando níveis suspeitos de brilho...",
        "✨ Detectando presenças luminosas...",
        "💅 Analisando energia fashion...",
        "👑 Escaneando ícones escondidos..."
    ];

    await client.sendMessage(from,{
        text: mensagensBusca[Math.floor(Math.random()*mensagensBusca.length)]
    },{quoted:info});

    await new Promise(r=>setTimeout(r,1500));

    const top = participantes
        .sort(()=>0.5-Math.random())
        .slice(0, Math.min(5, participantes.length));

    const pos=["🥇 Diva Suprema","🥈 Brilha Muito","🥉 Ícone","✨ Estrela","💅 Charme Fatal"];

    let txt=`┏━━━ 🌈 𝐑𝐀𝐍𝐊 𝐃𝐄 𝐆𝐀𝐘 🌈 ━━━┓\n\n`;

    top.forEach((id,i)=> txt+=`${pos[i] || "⭐ Destaque"}\n@${id.split("@")[0]}\n\n`);

    txt+="┗━━━━━━━━━━━━━━┛";

    const caminho="./arquivos/fotos/gay.jpg";

    if (fs.existsSync(caminho)){
        client.sendMessage(from,{image:fs.readFileSync(caminho),caption:txt,mentions:top},{quoted:info});
    } else {
        client.sendMessage(from,{text:txt,mentions:top},{quoted:info});
    }
}
break;

case 'rankgostoso': {
    if (!isGroup) return reply("😏 Esse comando só funciona em grupo.");

    const groupMetadata = await client.groupMetadata(from);

    const lidDono = String(data.LidDono).replace(/\D/g, '');

    const participantes = groupMetadata.participants.map(p => p.id);

    if (participantes.length < 2)
        return reply("😏 Não há pessoas suficientes no grupo.");

    // 😏 reação imediata
    await client.sendMessage(from, {
        react: { text: "😏", key: info.key }
    });

    // 🔎 busca bonita
    const mensagensBusca = [
        "😏 Avaliando nível de gostosura do grupo...",
        "🔥 Detectando níveis perigosos de beleza...",
        "🥵 Identificando os mais irresistíveis...",
        "👀 Observando quem tira o fôlego...",
        "💪 Calculando índice de atração..."
    ];

    await client.sendMessage(from, {
        text: mensagensBusca[Math.floor(Math.random() * mensagensBusca.length)]
    }, { quoted: info });

    await new Promise(resolve => setTimeout(resolve, 2000));

    // encontra o ID real do dono dentro do grupo
    const idDonoGrupo = participantes.find(id =>
        id.split("@")[0].replace(/\D/g, '') === lidDono
    );

    // remove dono da lista temporariamente
    const semDono = participantes.filter(id => id !== idDonoGrupo);

    // embaralha
    const embaralhado = semDono.sort(() => 0.5 - Math.random());

    // dono sempre em primeiro
    const top5 = [idDonoGrupo];

    for (let i = 0; i < 4 && i < embaralhado.length; i++) {
        top5.push(embaralhado[i]);
    }

    const posicoes = [
        "🥇 1° Lugar — Gostosura Suprema",
        "🥈 2° Lugar — Nível Perigoso",
        "🥉 3° Lugar — Tira o Fôlego",
        "🔥 4° Lugar — Beleza Ardente",
        "✨ 5° Lugar — Charme Intenso"
    ];

    let textoRanking =
`┏━━ 😼 𝐑𝐀𝐍𝐊 𝐃𝐎𝐒 𝐌𝐀𝐈𝐒 𝐆𝐎𝐒𝐓𝐎𝐒𝐎𝐒 😼 ━━┓

`;

    top5.forEach((id, index) => {
        textoRanking += `${posicoes[index]}\n@${id.split("@")[0]}\n\n`;
    });


    const caminhoImagem = "./arquivos/fotos/gostoso.jpg";

    try {
        if (fs.existsSync(caminhoImagem)) {
            await client.sendMessage(from, {
                image: fs.readFileSync(caminhoImagem),
                caption: textoRanking,
                mentions: top5
            }, { quoted: info });
        } else {
            await client.sendMessage(from, {
                text: textoRanking,
                mentions: top5
            }, { quoted: info });
        }
    } catch {
        await client.sendMessage(from, {
            text: textoRanking,
            mentions: top5
        }, { quoted: info });
    }
}
break;

case 'ranklindo': {
    if (!isGroup) return reply("👑 Esse comando só funciona em grupo.");

    const groupMetadata = await client.groupMetadata(from);
    const participantes = groupMetadata.participants.map(p => p.id);

    if (participantes.length < 2)
        return reply("👑 Não há pessoas suficientes no grupo.");

    // 🔎 Normaliza número do dono
    const numeroDono = String(data.LidDono).replace(/\D/g, '');

    // 🔍 Procura o ID real do dono dentro do grupo
    const idRealDono = participantes.find(id =>
        id.split("@")[0].replace(/\D/g, '') === numeroDono
    );

    // 😎 REAÇÃO
    await client.sendMessage(from, {
        react: {
            text: "😎",
            key: info.key
        }
    });

    const mensagensBusca = [
        "🔍 Analisando nível de beleza do grupo...",
        "✨ Escaneando rostos perfeitamente simétricos...",
        "📸 Calculando índice de beleza suprema...",
        "👀 Observando quem brilha mais no grupo...",
        "💎 Separando as joias raras..."
    ];

    await client.sendMessage(from, {
        text: mensagensBusca[Math.floor(Math.random() * mensagensBusca.length)]
    }, { quoted: info });

    await new Promise(resolve => setTimeout(resolve, 2000));

    // Remove dono temporariamente da lista
    const semDono = participantes.filter(id => id !== idRealDono);

    // Embaralhar
    const embaralhado = semDono.sort(() => 0.5 - Math.random());

    const top5 = [];

   
    if (idRealDono) {
        top5.push(idRealDono);
    }

  
    for (let i = 0; i < 5 - top5.length && i < embaralhado.length; i++) {
        top5.push(embaralhado[i]);
    }

    const posicoes = [
        "🥇 1° Lugar — Beleza Suprema",
        "🥈 2° Lugar — Quase Perfeito(a)",
        "🥉 3° Lugar — Modelo do Grupo",
        "🏅 4° Lugar — Encanto Natural",
        "✨ 5° Lugar — Charme Raro"
    ];

    let textoRanking =
`┏━━━ 👑 𝐑𝐀𝐍𝐊 𝐃𝐎𝐒 𝐌𝐀𝐈𝐒 𝐁𝐎𝐍𝐈𝐓𝐎𝐒 ?? ━━━┓


`;

    top5.forEach((id, index) => {
        const numero = id.split("@")[0];
        textoRanking += `${posicoes[index]}\n@${numero}\n\n`;
    });

    const caminhoImagem = "./arquivos/fotos/lindos.jpg";

    try {
        if (fs.existsSync(caminhoImagem)) {
            await client.sendMessage(from, {
                image: fs.readFileSync(caminhoImagem),
                caption: textoRanking,
                mentions: top5
            }, { quoted: info });
        } else {
            await client.sendMessage(from, {
                text: textoRanking,
                mentions: top5
            }, { quoted: info });
        }
    } catch (e) {
        await client.sendMessage(from, {
            text: textoRanking,
            mentions: top5
        }, { quoted: info });
    }
}
break;

case 'casal': {
    if (!isGroup) return reply("💘 Esse comando só funciona em grupo.");

    const groupMetadata = await client.groupMetadata(from);

    const lidDono = String(data.LidDono).replace(/\D/g, '');

    const participantes = groupMetadata.participants
        .map(p => p.id)
        .filter(id => {
            const numero = id.split("@")[0].replace(/\D/g, '');
            return numero !== lidDono;
        });

    if (participantes.length < 2)
        return reply("💘 Não há pessoas suficientes no grupo.");

    const aleatorio1 = participantes[Math.floor(Math.random() * participantes.length)];
    let aleatorio2 = participantes[Math.floor(Math.random() * participantes.length)];

    while (aleatorio1 === aleatorio2) {
        aleatorio2 = participantes[Math.floor(Math.random() * participantes.length)];
    }

    const nome1 = aleatorio1.split("@")[0];
    const nome2 = aleatorio2.split("@")[0];

    await client.sendMessage(from, {
        react: {
            text: "❤️",
            key: info.key
        }
    });

    const mensagensBusca = [
        "💘 Buscando casais do grupo...",
        "🔎 Analisando possíveis romances secretos...",
        "❤️ Escaneando corações compatíveis...",
        "💞 Procurando conexões suspeitas no grupo...",
        "🧠 Calculando nível de química entre membros...",
        "🔥 Cruzando destinos e energias românticas...",
        "💓 Detectando olhares trocados silenciosamente...",
        "👀 Investigando quem anda se olhando demais..."
    ];

    await client.sendMessage(from, {
        text: mensagensBusca[Math.floor(Math.random() * mensagensBusca.length)]
    }, { quoted: info });

    await new Promise(resolve => setTimeout(resolve, 1800));

    const porcentagem = Math.floor(Math.random() * 101);
    let diagnostico = "";

    // 🔵 0–30%
    if (porcentagem <= 30) {
        const frases = [
            "💀 Melhor ficarem só na amizade.",
            "🧊 Compatibilidade quase inexistente.",
            "🙃 Isso aí não vai pra frente.",
            "😬 Química negativa detectada.",
            "🚫 O universo claramente não aprovou."
        ];
        diagnostico = frases[Math.floor(Math.random() * frases.length)];
    }

    // 🟡 31–70%
    else if (porcentagem <= 70) {
        const frases = [
            "👀 Pode dar certo, mas vai ter drama.",
            "😏 Existe química, mas também confusão.",
            "💬 Conversa boa, futuro incerto.",
            "🔥 Faísca existe, só falta atitude.",
            "🤝 Tem potencial, mas alguém vai sofrer."
        ];
        diagnostico = frases[Math.floor(Math.random() * frases.length)];
    }

    // 🔴 71–100%
    else {
        const frases = [
            "já podem marcar o casamento.",
            "o grupo inteiro já suspeitava.",
            "isso aí já tá acontecendo escondido.",
            "até o bot aprova esse casal.",
            "isso não é coincidência, é destino."
        ];
        const parte = frases[Math.floor(Math.random() * frases.length)];
        diagnostico = `💞 Esse casal é *TÃO COMPATÍVEL* que ${parte}`;
    }

    const textoFinal =
`┏━━━ 💘 𝐃𝐄𝐓𝐄𝐂𝐓𝐎𝐑 𝐃𝐄 𝐂𝐀𝐒𝐀𝐋 💘 ━━━┓

👩‍❤️‍👨 Casal encontrado:
@${nome1} ❤️ @${nome2}

📊 Nível de compatibilidade: *${porcentagem}%*

🧠 Análise do sistema:
${diagnostico}

━━━━━━━━━━━━━━━━━━`;

    const caminhoImagem = "./arquivos/fotos/casal.jpg";

    try {
        if (fs.existsSync(caminhoImagem)) {
            await client.sendMessage(from, {
                image: fs.readFileSync(caminhoImagem),
                caption: textoFinal,
                mentions: [aleatorio1, aleatorio2]
            }, { quoted: info });
        } else {
            await client.sendMessage(from, {
                text: textoFinal,
                mentions: [aleatorio1, aleatorio2]
            }, { quoted: info });
        }
    } catch (e) {
        await client.sendMessage(from, {
            text: textoFinal,
            mentions: [aleatorio1, aleatorio2]
        }, { quoted: info });
    }
}
break;

case 'gay': {
    if (!isGroup) return reply("🌈 Esse comando só funciona em grupo.");

    if (!mentioned[0])
        return reply("🌈 Marca alguém pra revelar o nível.");

    const alvo = mentioned[0];

    const lidDono = String(data.LidDono).replace(/\D/g, '');
    const lidAlvo = alvo.split("@")[0].replace(/\D/g, '');

    if (lidAlvo === lidDono) {
        const frasesProtecao = [
            "👑 Você não pode marcar meu dono.",
            "🌈 O criador não entra nesse detector.",
            "🛑 Análise bloqueada. Usuário supremo.",
            "👑 Esse nível não se aplica ao dono.",
            "✨ O dono transcende qualquer rótulo."
        ];
        return reply(frasesProtecao[Math.floor(Math.random() * frasesProtecao.length)]);
    }

    // 🌈 REAÇÃO IMEDIATA (APÓS USAR O COMANDO)
    await client.sendMessage(from, {
        react: {
            text: "🌈",
            key: info.key
        }
    });

    // 🔍 MENSAGEM INICIAL
    await client.sendMessage(from, {
        text: "🌈 Detectando nível de gay..."
    }, { quoted: info });

    // ⏳ DELAY PRA DAR EFEITO
    await new Promise(resolve => setTimeout(resolve, 1200));

    const porcentagem = Math.floor(Math.random() * 101);
    let diagnostico = "";

    // 🔵 0–30% (baixo)
    if (porcentagem <= 30) {
        const frasesBaixas = [
            "🙂 Nenhum indício relevante encontrado.",
            "😌 Tudo normal por aqui.",
            "🧊 Zero sinais preocupantes.",
            "😎 Tranquilo, sem suspeitas."
        ];
        diagnostico = frasesBaixas[Math.floor(Math.random() * frasesBaixas.length)];
    }

    // 🟡 31–70% (médio)
    else if (porcentagem <= 70) {
        const frasesMedias = [
            "👀 Alguns sinais foram identificados.",
            "🤔 Pode negar, mas há indícios.",
            "📱 Certos comportamentos chamam atenção.",
            "😏 Não parece ser só coincidência."
        ];
        diagnostico = frasesMedias[Math.floor(Math.random() * frasesMedias.length)];
    }

    // 🔴 71–100% (alto)
    else {
        const frasesAltas = [
            "rebola até quando anda.",
            "fala que é hétero mas sabe todas as coreografias.",
            "diz que é brincadeira, mas não perde uma chance.",
            "defende com paixão e ainda se entrega."
        ];
        const parteFinal = frasesAltas[Math.floor(Math.random() * frasesAltas.length)];
        diagnostico = `🚨 Essa pessoa é *TÃO GAY* que ${parteFinal}`;
    }

    const textoFinal =
`┏━━━ 🌈 𝐃𝐄𝐓𝐄𝐂𝐓𝐎𝐑 𝐃𝐄 𝐆𝐀𝐘 🌈 ━━━┓

👤 Alvo analisado: @${lidAlvo}
📊 Nível de gay: *${porcentagem}%*

🧠 Diagnóstico final:
${diagnostico}

┗━━━━━━━━━━━━━━━━━━━━━━┛`;

    const caminhoImagem = "./arquivos/fotos/gay.jpg";

    try {
        if (fs.existsSync(caminhoImagem)) {
            await client.sendMessage(from, {
                image: fs.readFileSync(caminhoImagem),
                caption: textoFinal,
                mentions: [alvo]
            }, { quoted: info });
        } else {
            await client.sendMessage(from, {
                text: textoFinal,
                mentions: [alvo]
            }, { quoted: info });
        }
    } catch (e) {
        await client.sendMessage(from, {
            text: textoFinal,
            mentions: [alvo]
        }, { quoted: info });
    }
}
break;



case "editff": {
    try {

        await reagir("🎮");
        await enviar("🎮 Buscando edit Free Fire, aguarde...");

        const axios = require("axios");
        const fs = require("fs");

        const cfg = JSON.parse(
            fs.readFileSync("./dono/config/data.json")
        );

        const apiKey = cfg.apikey2;

        if (!apiKey) {
            return enviar("❌ apikey2 não encontrada.");
        }

        const apiUrl = `https://api.blackaut.shop/api/video/freefire?apikey=${apiKey}`;

        const response = await axios.get(apiUrl, {
            responseType: "arraybuffer"
        });

        const buffer = Buffer.from(response.data);

        await client.sendMessage(from, {
            video: buffer,
            mimetype: "video/mp4"
        }, { quoted: info });

    } catch (err) {
        console.log("Erro edff:", err.response?.status || err.message);
        enviar("❌ Erro ao buscar edit.");
    }
}
break;

case "editnt": {
    try {

        await reagir("🍥");
        await enviar("🍥 Buscando edit Naruto, aguarde...");

        const axios = require("axios");
        const fs = require("fs");

        const cfg = JSON.parse(
            fs.readFileSync("./dono/config/data.json")
        );

        const apiKey = cfg.apikey2;

        if (!apiKey) {
            return enviar("❌ apikey2 não encontrada.");
        }

        const apiUrl = `https://api.blackaut.shop/api/video/editsnaruto?apikey=${apiKey}`;

        const response = await axios.get(apiUrl, {
            responseType: "arraybuffer"
        });

        const buffer = Buffer.from(response.data);

        await client.sendMessage(from, {
            video: buffer,
            mimetype: "video/mp4"
        }, { quoted: info });

    } catch (err) {
        console.log("Erro ednt:", err.response?.status || err.message);
        enviar("❌ Erro ao buscar edit.");
    }
}
break;

case "editjj": {
    try {

        await reagir("🔥");
        await enviar("🔥 Buscando edit Jujutsu, aguarde...");

        const axios = require("axios");
        const fs = require("fs");

        const cfg = JSON.parse(
            fs.readFileSync("./dono/config/data.json")
        );

        const apiKey = cfg.apikey2;

        if (!apiKey) {
            return enviar("❌ apikey2 não encontrada.");
        }

        const apiUrl = `https://api.blackaut.shop/api/video/editsjujutsu?apikey=${apiKey}`;

        const response = await axios.get(apiUrl, {
            responseType: "arraybuffer"
        });

        const buffer = Buffer.from(response.data);

        await client.sendMessage(from, {
            video: buffer,
            mimetype: "video/mp4"
        }, { quoted: info });

    } catch (err) {
        console.log("Erro edjj:", err.response?.status || err.message);
        enviar("❌ Erro ao buscar edit.");
    }
}
break;

case "edits": {
    try {

        await reagir("🎌");
        await enviar("🎌 Buscando edit anime, aguarde...");

        const axios = require("axios");
        const fs = require("fs");

        const cfg = JSON.parse(
            fs.readFileSync("./dono/config/data.json")
        );

        const apiKey = cfg.apikey2;

        if (!apiKey) {
            return enviar("❌ apikey2 não encontrada.");
        }

        const apiUrl = `https://api.blackaut.shop/api/video/edts?apikey=${apiKey}`;

        const response = await axios.get(apiUrl, {
            responseType: "arraybuffer"
        });

        const buffer = Buffer.from(response.data);

        await client.sendMessage(from, {
            video: buffer,
            mimetype: "video/mp4"
        }, { quoted: info });

    } catch (err) {
        console.log("Erro eda:", err.response?.data || err.message);
        enviar("❌ Erro ao buscar edit.");
    }
}
break;

case 'antispam':
    if (!isGroup) return reply('Este comando só pode ser usado em grupos.');
    if (!isAdmin) return reply('Apenas administradores podem usar este comando.');

    const antispamDB = JSON.parse(fs.readFileSync(caminhoAntis));

    if (args[0] === 'on') {
        antispamDB[from] = true;
        fs.writeFileSync(caminhoAntis, JSON.stringify(antispamDB, null, 4));
        reply('🛡️ *Segurança Antispam:* Ativada com sucesso.');
    } else if (args[0] === 'off') {
        antispamDB[from] = false;
        fs.writeFileSync(caminhoAntis, JSON.stringify(antispamDB, null, 4));
        reply('⚠️ *Segurança Antispam:* Desativada.');
    } else {
        reply(`Exemplo de uso:\n*${prefix}antispam on*\n*${prefix}antispam off*`);
    }
    break;

case "cnpj": {
    try {
        if (!vip && !soDono)
            return reply("🚫 Este comando é exclusivo para usuários VIP.");

        const cnpjBusca = args[0] ? args[0].replace(/\D/g, '') : '';
        if (!cnpjBusca) return reply(`Exemplo: ${prefix}${comando} 12345678000195`);

        // Carrega a apikey2
        const configCnpj = JSON.parse(fs.readFileSync('./dono/config/data.json'));
        const keyCnpj = configCnpj.apikey2;

        if (!keyCnpj) return reply('❌ apikey2 não encontrada.');

        reply('🔍 Consultando dados empresariais (CNPJ), aguarde...');

        const axios = require('axios');
        const response = await axios.get(
            `https://api.blackaut.shop/api/dados-pessoais/cnpj?cnpj=${cnpjBusca}&apikey=${keyCnpj}`
        );

        const res = response.data;

        if (!res.status || !res.resultado) {
            return reply('❌ Informações não localizadas para este CNPJ.');
        }

        const d = res.resultado;

        const cnpjFormatado = d.cnpj.toString()
            .replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");

        let textoCnpj = `╭━━━〔 🏢 CONSULTA EMPRESARIAL 〕━━━╮\n`;
        textoCnpj += `┃ 🏢 Razão Social: ${d.business_name || 'N/I'}\n`;
        textoCnpj += `┃ 🏷️ Nome Fantasia: ${d.trade_name || 'Sem informação'}\n`;
        textoCnpj += `┃ 🆔 CNPJ: ${cnpjFormatado}\n`;
        textoCnpj += `┃ 📅 Fundação: ${d.foundation_date ? d.foundation_date.split(' ')[0] : 'N/I'}\n`;
        textoCnpj += `┃ ⚖️ Natureza: ${d.legal_nature || 'N/I'}\n`;
        textoCnpj += `╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯\n\n`;

        textoCnpj += `╭━━━〔 📍 LOCALIZAÇÃO 〕━━━╮\n`;
        textoCnpj += `┃ 🏠 Endereço: ${d.address || 'N/I'}\n`;
        textoCnpj += `┃ 🏙️ Bairro: ${d.neighborhood || 'N/I'}\n`;
        textoCnpj += `┃ 📍 Cidade: ${d.city || 'N/I'} - ${d.state || 'N/I'}\n`;
        textoCnpj += `┃ 📮 CEP: ${d.zip_code || 'N/I'}\n`;
        textoCnpj += `╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯\n\n`;

        textoCnpj += `╭━━━〔 🛡️ SITUAÇÃO & RISCO 〕━━━╮\n`;
        textoCnpj += `┃ 📋 Status: ${d.registration_status_code === "3" ? "ATIVA" : "INATIVA/OUTRO"}\n`;
        textoCnpj += `┃ ⚠️ Risco: ${d.risk || 'N/I'}\n`;
        textoCnpj += `┃ 💰 Capital Social: R$ ${d.social_capital || 'N/I'}\n`;
        textoCnpj += `╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯\n`;

        textoCnpj += `\n✅ Consulta finalizada com sucesso.`;

        reply(textoCnpj);

    } catch (err) {
        console.log('Erro CNPJ:', err.message);
        reply('❌ Erro ao processar a consulta de CNPJ.');
    }
}
break;




case 'bin': {
try {
        if (!vip && !soDono)
            return reply("🚫 Este comando é exclusivo para usuários VIP.");
            
    // Limpa o input para aceitar apenas os 6 primeiros dígitos
    const binBusca = args[0] ? args[0].replace(/\D/g, '').slice(0, 6) : '';
    if (!binBusca || binBusca.length < 6) return reply(
`Exemplo: ${prefix}${comando} 553636

> ⚠️ Digite apenas os 6 primeiros dígitos do cartão`
);

    // Carrega a apikey2 do seu arquivo data.json
    const configBin = JSON.parse(fs.readFileSync('./dono/config/data.json'));
    const keyBin = configBin.apikey2;

    if (!keyBin) return reply('❌ apikey2 não encontrada.');

    reply('🔍 Consultando informações da BIN, aguarde...');

        const axios = require('axios');
        const response = await axios.get(`https://api.blackaut.shop/api/dados-pessoais/bin2?bin2=${binBusca}&apikey=${keyBin}`);
        const res = response.data;

        if (!res.status || !res.resultado) {
            return reply('❌ Informações não localizadas para esta BIN.');
        }

        const d = res.resultado;

        let textoBin = `╭━━━〔 💳 CONSULTA DE BIN 〕━━━╮\n`;
        textoBin += `┃ 🔢 BIN: ${d.bin || binBusca}\n`;
        textoBin += `┃ 💳 Bandeira: ${d.brand || 'N/I'}\n`;
        textoBin += `┃ 🏦 Banco: ${d.issuer || 'N/I'}\n`;
        textoBin += `┃ 💎 Tipo: ${d.type || 'N/I'}\n`;
        textoBin += `┃ 🌍 Categoria: ${d.category || 'N/I'}\n`;
        textoBin += `┃ 🇧🇷 País: ${d.country || 'N/I'}\n`;
        textoBin += `╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯\n`;

        textoBin += `\n✅ Consulta finalizada com sucesso.`;

        reply(textoBin);

    } catch (err) {
        console.log('Erro BIN:', err.message);
        reply('❌ Erro ao processar a consulta de BIN.');
    }
}
break;


case 'serasa': {
try {
        if (!vip && !soDono)
            return reply("🚫 Este comando é exclusivo para usuários VIP.");
            

    const fs = require('fs');
    const axios = require('axios');

    const cpf = args[0] ? args[0].replace(/\D/g, '') : '';
    if (!cpf)
        return reply(`Exemplo: ${prefix}${comando} 11396397736`);

    const config = JSON.parse(
        fs.readFileSync('./dono/config/data.json')
    );

    const apiKey = config.apikey2;
    if (!apiKey)
        return reply('❌ apikey2 não encontrada.');

    reply('🔍 Realizando consulta cadastral (SRS), aguarde...');

    

        const response = await axios.get(
            `https://api.blackaut.shop/api/dados-pessoais/srs?srs=${cpf}&apikey=${apiKey}`
        );

        const res = response.data;

        if (!res.status || !res.resultado)
            return reply('❌ Informações não localizadas.');

        const d = res.resultado;

        // 🔎 Função para pegar campo alternativo
        const get = (...fields) => {
            for (let f of fields) {
                if (d[f] !== undefined && d[f] !== null && d[f] !== "")
                    return d[f];
            }
            return 'N/I';
        };

        const situacoes = {
            "0": "REGULAR",
            "2": "SUSPENSA",
            "3": "CANCELADA",
            "4": "PENDENTE DE REGULARIZAÇÃO",
            "5": "NULA",
            "8": "TITULAR FALECIDO"
        };

        const statusCadastral =
            situacoes[d.cd_sit_cad] ||
            d.cd_sit_cad ||
            'N/I';

        let texto =
`╭━━━〔 📑 CONSULTA CADASTRAL SRS 〕━━━╮
┃ 👤 Nome: ${get('name','nome')}
┃ 🆔 CPF: ${get('cpf')}
┃ 🎂 Nascimento: ${get('birth','nascimento')}
┃ 🔢 Idade: ${get('age','idade')} anos
┃ ⚧ Sexo: ${get('gender','sexo')}
┃ ♈ Signo: ${get('sign','sinal')}
┃ 👩 Mãe: ${get('mother_name','nome_mãe')}
┃ 👨 Pai: ${get('father_name','nome_pai')}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━━━〔 🛡 SITUAÇÃO NA RECEITA 〕━━━╮
┃ 📋 Status: ${statusCadastral}
┃ 📅 Data Situação: ${get('dt_sit_cad')}
┃ 📆 Data Informação: ${get('dt_information')}
┃ 🏛 Órgão Emissor: ${get('issuing_organ')}
┃ 📍 UF Emissão: ${get('uf_emission')}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━━━〔 📌 INFORMAÇÕES EXTRAS 〕━━━╮
┃ 🆔 Registro ID: ${get('registration_id')}
┃ 📊 Código Mosaic: ${get('cd_mosaic','cd_mosaic_new')}
┃ 📑 Estado Civil: ${get('marital_status','estado_marital')}
┃ 🌎 Nacionalidade: ${get('nationality','nacionalidade')}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`;

        // 📍 ENDEREÇOS (trata português e inglês)
        const addresses = d.addresses || d.enderecos || [];
        if (Array.isArray(addresses) && addresses.length > 0) {

            texto += `\n\n╭━━━〔 📍 ENDEREÇOS 〕━━━╮\n`;

            addresses.slice(0,5).forEach((end,i)=>{

                const city = end.city || end.cidade || '';
                const state = end.state || end.estado || '';
                const zip = end.zip_code || end.CEP || '';
                const logName = end.logr_name || end.nome_logr || '';
                const logType = end.logr_type || end.tipo_logr || '';
                const number = end.logr_number || end.número_logr || '';
                const bairro = end.neighborhood || end.bairro || '';

                texto += `┃ ${i+1}️⃣ ${logType} ${logName}, ${number}\n`;
                texto += `┃    ${bairro} - ${city}/${state}\n`;
                texto += `┃    CEP: ${zip}\n`;
            });

            texto += `╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`;
        }

        // 📞 TELEFONES
        const tels = d.telefones || d.telephones || [];
        if (Array.isArray(tels) && tels.length > 0) {

            texto += `\n\n╭━━━〔 📞 CONTATOS 〕━━━╮\n`;

            tels.slice(0,5).forEach(t=>{
                const ddd = t.ddd || '';
                const num = t.phone_number || t.número_de_telefone || '';
                texto += `┃ 📱 (${ddd}) ${num}\n`;
            });

            texto += `╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`;
        }

        // 👥 PARENTES
        const parentes = d.parentes || d.relatives || [];
        if (Array.isArray(parentes) && parentes.length > 0) {

            texto += `\n\n╭━━━〔 👥 VÍNCULOS 〕━━━╮\n`;

            parentes.slice(0,5).forEach(p=>{
                const nome = p.name || p.nome || '';
                const rel = p.relationship || p.relacionamento || '';
                const cpfRel = p.cpf_complete || '';
                texto += `┃ 🔹 ${rel}\n`;
                texto += `┃    Nome: ${nome}\n`;
                texto += `┃    CPF: ${cpfRel}\n`;
            });

            texto += `╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`;
        }

        texto += `\n\n✅ Consulta finalizada com sucesso.`;

        reply(texto);

    } catch (err) {

        console.log("ERRO SRS:", err.response?.data || err.message);
        reply('❌ Erro ao processar a consulta.');
    }
}
break;

case 'score': {
try {
        if (!vip && !soDono)
            return reply("🚫 Este comando é exclusivo para usuários VIP.");
            

    const fs = require('fs');
    const axios = require('axios');

    const cpf = args[0] ? args[0].replace(/\D/g, '') : '';
    if (!cpf)
        return reply(`Exemplo: ${prefix}${comando} 11396397736`);

    const config = JSON.parse(
        fs.readFileSync('./dono/config/data.json')
    );

    const apiKey = config.apikey2;
    if (!apiKey)
        return reply('❌ apikey2 não encontrada.');

    reply('🔍 Realizando consulta completa, aguarde...');

    

        const response = await axios.get(
            `https://api.blackaut.shop/api/dados-pessoais/score?score=${cpf}&apikey=${apiKey}`
        );

        const res = response.data;

        console.log("===== RESPOSTA COMPLETA DA API SCORE =====");
        console.log(JSON.stringify(res, null, 2));
        console.log("===========================================");

        if (!res.status || !res.resultado) {
            return reply('❌ Informações não localizadas.');
        }

        const d = res.resultado;
        const s = d.score || {};
        const p = d.purchasing_power || {};

        let texto = 
`╭━━━〔 🧾 DOSSIÊ FINANCEIRO COMPLETO 〕━━━╮
┃ 👤 Nome: ${d.name || 'N/I'}
┃ 🆔 CPF: ${d.cpf || cpf}
┃ 🎂 Nascimento: ${d.birth || 'N/I'}
┃ 🔢 Idade: ${d.age || 'N/I'} anos
┃ ⚧ Sexo: ${d.gender || 'N/I'}
┃ ♈ Signo: ${d.sign || 'N/I'}
┃ 👩 Mãe: ${d.mother_name || 'N/I'}
┃ 👨 Pai: ${d.father_name || 'N/I'}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━━━〔 📈 SCORE & CRÉDITO 〕━━━╮
┃ 📊 CSB8: ${s.csb8 || 'N/A'} (${s.csb8_range || 'N/A'})
┃ 📊 CSBA: ${s.csba || 'N/A'} (${s.csba_range || 'N/A'})
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━━━〔 💰 PERFIL FINANCEIRO 〕━━━╮
┃ 💵 Renda: R$ ${d.income || 'N/A'}
┃ 🛒 Poder Compra: ${p.purchasing_power || 'N/A'}
┃ 📊 Faixa: ${p.fx_purchasing_power || 'N/A'}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
`;

        // 📍 ENDEREÇOS
        if (Array.isArray(d.addresses) && d.addresses.length > 0) {

            texto += `\n╭━━━〔 📍 ENDEREÇOS 〕━━━╮\n`;

            d.addresses.slice(0, 5).forEach((end, i) => {

                texto += `┃ ${i+1}️⃣ ${end.logr_type || ''} ${end.logr_name || ''}, ${end.logr_number || 'SN'}\n`;
                texto += `┃    ${end.neighborhood || ''} - ${end.city || ''}/${end.state || ''}\n`;
                texto += `┃    CEP: ${end.zip_code || 'N/I'}\n`;
            });

            texto += `╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯\n`;
        }

        // 📞 TELEFONES
        if (Array.isArray(d.telephones) && d.telephones.length > 0) {

            texto += `\n╭━━━〔 📞 CONTATOS 〕━━━╮\n`;

            d.telephones.slice(0, 5).forEach(tel => {
                texto += `┃ 📱 (${tel.ddd}) ${tel.phone_number}\n`;
            });

            texto += `╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯\n`;
        }

        // 👥 PARENTES
        if (Array.isArray(d.relatives) && d.relatives.length > 0) {

            texto += `\n╭━━━〔 👥 VÍNCULOS 〕━━━╮\n`;

            d.relatives.slice(0, 5).forEach(rel => {
                texto += `┃ 🔹 ${rel.relationship}\n`;
                texto += `┃    Nome: ${rel.name}\n`;
                texto += `┃    CPF: ${rel.cpf_complete}\n`;
            });

            texto += `╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯\n`;
        }

        texto += `\n✅ Consulta finalizada com sucesso.`;

        reply(texto);

    } catch (err) {

        console.log("===== ERRO SCORE =====");
        console.log(err.response?.data || err.message);
        console.log("======================");

        reply('❌ Erro ao processar a consulta.');
    }

}
break;

case "ddd": {
    try {
        if (!vip && !soDono)
            return reply("🚫 Este comando é exclusivo para usuários VIP.");
            

        const q = args[0];

        if (!q) {
            return enviar(
`📌 Informe um DDD.

Exemplo:
➜ ${prefix}ddd 97`
            );
        }

        await reagir("📞");
        await enviar("🔎 Buscando informações do DDD...");

        const axios = require("axios");
        const fs = require("fs");

        const cfg = JSON.parse(
            fs.readFileSync("./dono/config/data.json")
        );

        const apiKey = cfg.apikey2;

        if (!apiKey) {
            return enviar("❌ apikey2 não encontrada.");
        }

        const apiUrl = `https://api.blackaut.shop/api/consulta/ddd/${q}?apikey=${apiKey}`;

        const { data } = await axios.get(apiUrl);

        if (!data.status) {
            return enviar("❌ DDD não encontrado.");
        }

        const estadoCompleto = nomeEstado(data.estado);

// Ordena cidades
const cidadesOrdenadas = data.cidades.sort();

// Monta duas cidades por linha
let cidadesFormatadas = "";

for (let i = 0; i < cidadesOrdenadas.length; i += 2) {
    const cidade1 = cidadesOrdenadas[i] || "";
    const cidade2 = cidadesOrdenadas[i + 1] || "";

    if (cidade2) {
        cidadesFormatadas += `▸ ${cidade1}  |  ${cidade2}\n`;
    } else {
        cidadesFormatadas += `▸ ${cidade1}\n`;
    }
}

const resposta =
`╭━━━〔 📞 CONSULTA DDD 〕━━━╮
┃ 🔢 DDD: ${data.ddd}
┃ 🗺 Estado: ${estadoCompleto} (${data.estado})
┃ 📊 Total: ${data.cidades.length} cidades
╰━━━━━━━━━━━━━━━━━━━━╯

🏙 *CIDADES ATENDIDAS*

${cidadesFormatadas}`;

        await client.sendMessage(from, {
            text: resposta
        }, { quoted: info });

    } catch (err) {
        console.log("Erro ddd:", err.response?.data || err.message);
        enviar("❌ Erro ao consultar DDD.");
    }
}
break;

case "cep": {
    try {
        if (!vip && !soDono)
            return reply("🚫 Este comando é exclusivo para usuários VIP.");
            

        const q = args[0];

        if (!q) {
            return enviar(
`📌 Informe um CEP.

Exemplo:
➜ ${prefix}cep 89010025`
            );
        }

        await reagir("📍");
        await enviar("🔎 Buscando informações do CEP...");

        const axios = require("axios");
        const fs = require("fs");

        const cfg = JSON.parse(
            fs.readFileSync("./dono/config/data.json")
        );

        const apiKey = cfg.apikey2;

        if (!apiKey) {
            return enviar("❌ apikey2 não encontrada.");
        }

        const apiUrl = `https://api.blackaut.shop/api/consulta/cep/${q}?apikey=${apiKey}`;

        const { data } = await axios.get(apiUrl);

        if (!data.status) {
            return enviar("❌ CEP não encontrado.");
        }

        const resultado =
`📍 *CONSULTA DE CEP*

📮 CEP: ${data.cep}
🏙 Cidade: ${data.cidade}
🗺 Estado: ${data.estado}
🏘 Bairro: ${data.vizinhança}
🛣 Rua: ${data.rua}`;

        await client.sendMessage(from, {
            text: resultado
        }, { quoted: info });

    } catch (err) {
        console.log("Erro cep:", err.response?.data || err.message);
        enviar("❌ Erro ao consultar CEP.");
    }
}
break;

case "telefone": {
    try {
        if (!vip && !soDono)
            return reply("🚫 Este comando é exclusivo para usuários VIP.");
            

        const q = args[0];

        if (!q) {
            return enviar(
`📌 Informe um número de telefone.

Exemplo:
➜ ${prefix}telefone 21985382337`
            );
        }

        await reagir("📞");
        await enviar("🔎 Buscando dados do telefone...");

        const axios = require("axios");
        const fs = require("fs");

        const cfg = JSON.parse(
            fs.readFileSync("./dono/config/data.json")
        );

        const apiKey = cfg.apikey2;

        if (!apiKey) {
            return enviar("❌ apikey2 não encontrada.");
        }

        const apiUrl = `https://api.blackaut.shop/api/dados-pessoais/telefone?telefone=${q}&apikey=${apiKey}`;

        const { data } = await axios.get(apiUrl);

        if (!data.status || !data.resultado) {
            return enviar("❌ Nenhum resultado encontrado.");
        }

        const resultado = data.resultado;

        const resposta =
`📞 *CONSULTA TELEFONE*

📱 Número: ${resultado.valor}

📄 Resultado:
${resultado.data}`;

        await client.sendMessage(from, {
            text: resposta
        }, { quoted: info });

    } catch (err) {
        console.log("Erro tel:", err.response?.data || err.message);
        enviar("❌ Erro ao consultar telefone.");
    }
}
break;


case 'rg':
try {
        if (!vip && !soDono)
            return reply("🚫 Este comando é exclusivo para usuários VIP.");
            
    
    const rgBusca = args[0] ? args[0].replace(/\D/g, '') : '';
    if (!rgBusca) return reply(`Exemplo: ${prefixo}${comando} 11396397736`);

    
    const configRG = JSON.parse(fs.readFileSync('./dono/config/data.json'));
    const keyRG = configRG.apikey2;

    if (!keyRG) return reply('Erro: apikey2 não encontrada no arquivo data.json.');

    reply('🔍 Consultando RG, aguarde...');

    
        const axios = require('axios');
        const urlRG = `https://api.blackaut.shop/api/dados-pessoais/rg?rg=${rgBusca}&apikey=${keyRG}`;
        
        const response = await axios.get(urlRG);
        const res = response.data;

       
        if (!res.status || res.resultado.data === "RG NÃO ENCONTRADO") {
            return reply('❌ RG não encontrado em nossa base de dados.');
        }

        
        let textoRG = `🪪 *CONSULTA DE RG* 🪪\n\n`;
        textoRG += `📌 *RG CONSULTADO:* ${res.resultado.valor}\n\n`;
        
        textoRG += `📋 *DADOS LOCALIZADOS:*\n`;
        
       
        if (typeof res.resultado.data === 'object') {
            const dados = res.resultado.data;
            Object.keys(dados).forEach(key => {
                textoRG += `├─ *${key.toUpperCase()}:* ${dados[key]}\n`;
            });
        } else {
            textoRG += `└─ ${res.resultado.data}\n`;
        }

        textoRG += `\n✅ *Consulta realizada com sucesso.*`;

        reply(textoRG);

    } catch (err) {
        console.log('Erro no comando rg:', err);
        reply('❌ Erro ao consultar o RG. Verifique a chave ou tente novamente.');
    }
    break;



case 'placa':
try {
        if (!vip && !soDono)
            return reply("🚫 Este comando é exclusivo para usuários VIP.");
            
    
    const placaBusca = args[0] ? args[0].toUpperCase() : '';
    if (!placaBusca) return reply(`Exemplo: ${prefixo}${comando} ABC1234`);

    
    const configPlaca = JSON.parse(fs.readFileSync('./dono/config/data.json'));
    const keyPlaca = configPlaca.apikey2;

    if (!keyPlaca) return reply('Erro: apikey2 não encontrada no arquivo data.json.');

    reply('🔍 Consultando placa, aguarde...');

    
        const axios = require('axios');
        const urlPlaca = `https://api.blackaut.shop/api/dados-pessoais/placa?placa=${placaBusca}&apikey=${keyPlaca}`;
        
        const response = await axios.get(urlPlaca);
        const res = response.data;

        if (!res.status || !res.resultado || !res.resultado.dados) {
            return reply('❌ Placa não encontrada ou erro na consulta.');
        }

        // A API retorna os dados principais dentro de uma string no array 'enderecos'
        // Vamos extrair e organizar para ficar bonito
        const infoBruta = res.resultado.dados.enderecos[0] || "";
        
        let textoPlaca = `🚗 *CONSULTA VEICULAR* 🚗\n\n`;
        textoPlaca += `📍 *PLACA:* ${res.resultado.placaConsultada}\n`;
        textoPlaca += `🔗 *LINK:* ${res.resultado.link}\n\n`;

        // Formatação dos dados extraídos (Baseado no retorno da sua API)
        textoPlaca += `📋 *INFORMAÇÕES DO VEÍCULO*\n`;
        
        // Função simples para extrair dados da string bruta se necessário, 
        // mas aqui vamos focar na organização visual
        textoPlaca += `└─ *Status:* ${res.resultado.dados.enderecos.length > 0 ? 'Dados Localizados' : 'N/A'}\n\n`;

        textoPlaca += `👤 *PROPRIETÁRIO & LOCAL*\n`;
        // Como os dados vêm em um bloco de texto, vamos exibir o resumo disponível
        const resumo = res.resultado.dados.enderecos[0] ? res.resultado.dados.enderecos[0].split('DÉBITOS')[0] : 'Informações detalhadas no link.';
        
        textoPlaca += `> ${resumo.substring(0, 500)}...\n\n`;

        textoPlaca += `⚠️ *RESUMO DE SITUAÇÃO*\n`;
        textoPlaca += `├─ *Débitos:* Verifique no link\n`;
        textoPlaca += `└─ *Restrições:* Verifique no link\n\n`;
        
        textoPlaca += `⏰ *Nota:* O link de consulta expira em 24 horas.`;

        reply(textoPlaca);

    } catch (err) {
        console.log('Erro no comando placa:', err);
        reply('❌ Erro ao consultar a placa. Verifique a chave ou tente novamente.');
    }
    break;


case 'nome2':
try {
        if (!vip && !soDono)
            return reply("🚫 Este comando é exclusivo para usuários VIP.");
            
    const nomeParaBuscar = args.join(' ');
    
    if (!nomeParaBuscar) return reply(`Exemplo: ${prefixo}${comando} Raquel Pereira da Silva`);

    const configDataJson = JSON.parse(fs.readFileSync('./dono/config/data.json'));
    const chaveApi2 = configDataJson.apikey2;

    if (!chaveApi2) return reply('Erro: apikey2 não encontrada no arquivo data.json.');

    reply('🔍 Buscando informações por nome, aguarde...');

    
        const axios = require('axios');
        const urlApi = `https://api.blackaut.shop/api/dados-pessoais/nome?nome=${encodeURIComponent(nomeParaBuscar)}&apikey=${chaveApi2}`;
        
        const response = await axios.get(urlApi);
        const res = response.data;

        if (!res.status || !res.resultado || res.resultado.length === 0) {
            return reply('❌ Nenhum resultado encontrado para este nome.');
        }

        let textoResultado = `📂 *RESULTADOS ENCONTRADOS:* ${res.resultado.length}\n\n`;
        
        // Mostra os 10 primeiros resultados para não travar o WhatsApp
        const limitados = res.resultado.slice(0, 50);

        limitados.forEach((pessoa, i) => {
            textoResultado += `👤 *REGISTRO #${i + 1}*\n`;
            textoResultado += `├─ *Nome:* ${pessoa.name}\n`;
            textoResultado += `├─ *CPF:* ${pessoa.cpf}\n`;
            textoResultado += `├─ *Nascimento:* ${pessoa.birth ? pessoa.birth.trim() : 'N/I'}\n`;
            textoResultado += `├─ *Idade:* ${pessoa.age || 'N/I'} anos\n`;
            textoResultado += `├─ *Gênero:* ${pessoa.gender || 'N/I'}\n`;
            textoResultado += `└─ *Signo:* ${pessoa.sign || 'N/I'}\n\n`;
        });

       

        reply(textoResultado);

    } catch (err) {
        console.log('Erro no comando nome2:', err);
        reply('❌ Erro ao consultar a API. Verifique a chave ou tente novamente.');
    }
    break;



case "nome": {
  try {
    if (!vip && !soDono) {
      return reply("🚫 Este comando é exclusivo para usuários VIP.");
    }

    const fs = require("fs");
   const path = require('path');
    const config = JSON.parse(fs.readFileSync("./dono/config/data.json"));
    const apiKey = config.apikey2;

    if (!apiKey) {
      console.error("Erro: A apikey2 não está configurada no arquivo data.json.");
      return reply("❌ Ocorreu um erro de configuração. Contate o administrador.");
    }

    const textoConsulta = args.join(" ");
    if (!textoConsulta) {
      return reply("Informe um nome.\n\nExemplo:\n.nome (nome aqui)");
    }

    await reply("🔎 Consultando nome, aguarde...");

    const axios = require("axios");

    const response = await axios.get(
      "https://api.blackaut.shop/api/dados-pessoais/abreviado",
      {
        params: {
          abreviado: textoConsulta,
          apikey: apiKey
        }
      }
    );

    if (!response.data.status) {
      return reply("❌ Nenhum resultado encontrado.");
    }

    const texto = response.data.resultado?.data;
    if (!texto) {
      return reply("❌ Nenhum dado retornado pela API.");
    }

    const regex = /CPF\s?⎯?\s?([\d`]+)\s*\nNOME\s?⎯?\s?(.+?)\s*\nNASCIMENTO\s?⎯?\s?([0-9\-\/]+)/g;
    let match;
    let resultados = [];

    while ((match = regex.exec(texto)) !== null) {
      resultados.push({
        cpf: match[1].replace(/`/g, "").trim(),
        nome: match[2].trim(),
        nascimento: formatarData(match[3].trim())
      });
    }

    if (resultados.length === 0) {
      return reply("❌ Nenhum resultado estruturado encontrado.");
    }

    const limite = resultados.slice(0, 50);

    let mensagem = `🔎 *RESULTADOS PARA:* ${textoConsulta.toUpperCase()}\n`;
    mensagem += `📊 Total encontrado: ${resultados.length}\n\n`;

    limite.forEach((pessoa, index) => {
      mensagem += `👤 *Resultado ${index + 1}*\n`;
      mensagem += `🪪 CPF: ${pessoa.cpf}\n`;
      mensagem += `📛 Nome: ${pessoa.nome}\n`;
      mensagem += `📅 Nascimento: ${pessoa.nascimento || "Não informado"}\n`;
      mensagem += `━━━━━━━━━━━━━━━━━━\n`;
    });

    reply(mensagem);

  } catch (error) {
    console.error("Erro detalhado no comando 'nome':", error);
    
    reply("❌ Ocorreu um erro inesperado ao processar sua solicitação.");
  }
}
break;


case "cpf":
case "consultarcpf": {
    try {

        if (!vip && !soDono)
            return enviar("🚫 Este comando é exclusivo para usuários VIP.");

        const cpfInput = args.join(" ").replace(/\D/g, "");

        if (!cpfInput) {
            return enviar(`⚠️ Informe o CPF.\n\nExemplo:\n➜ ${prefix}cpf 12345678900`);
        }

        await reagir("🔍");
        await client.sendMessage(from, { 
            text: `🔍 Consultando CPF: *${cpfInput}*...` 
        }, { quoted: info });

        const fs = require("fs");
        const config = JSON.parse(fs.readFileSync("./dono/config/data.json"));
        const apiKey = config.apikey2;

        if (!apiKey) {
            return enviar("❌ Chave da API (apikey2) não encontrada.");
        }

        const apiURL = `https://api.blackaut.shop/api/dados-pessoais/cpf?cpf=${cpfInput}&apikey=${apiKey}`;
        const response = await fetch(apiURL);
        const json = await response.json();

        console.log("RESPOSTA COMPLETA API CPF:");
        console.log(JSON.stringify(json, null, 2));

        if (!json || !json.resultado) {
            return enviar("❌ CPF não encontrado ou sem dados disponíveis.");
        }

        const d = json.resultado;

        //━━━━━━━━━━━━━━━━━━
        // 🧍 DADOS PESSOAIS
        //━━━━━━━━━━━━━━━━━━

        const nome = d["name"] || "Não informado";
        const nascimento = d["birth"] || "Não informado";
        const idade = d["age"] ? `${d["age"]} anos` : "Não informado";
        const sexo = d["gender"] === "M" ? "Masculino" :
                     d["gender"] === "F" ? "Feminino" :
                     d["gender"] || "Não informado";
        const signo = d["sign"] || "Não informado";
        const mae = d["mother_name"] && d["mother_name"] !== "" ? d["mother_name"] : "Não informado";
        const pai = d["father_name"] && d["father_name"] !== "" ? d["father_name"] : "Não informado";

        let situacao = "Não informado";
        if (d["cd_sit_cad"] === "2") situacao = "REGULAR";

        let texto = `━━━━━━━━━━━━━━━━━━\n`;
        texto += `?? *CONSULTA DE CPF*\n`;
        texto += `━━━━━━━━━━━━━━━━━━\n\n`;

        texto += `👤 *Nome:* ${nome}\n`;
        texto += `🆔 *CPF:* ${d["cpf"]}\n`;
        texto += `📅 *Data de Nascimento:* ${nascimento}\n`;
        texto += `🎂 *Idade:* ${idade}\n`;
        texto += `🚻 *Sexo:* ${sexo}\n`;
        texto += `♈ *Signo:* ${signo}\n`;
        texto += `👩 *Nome da Mãe:* ${mae}\n`;
        texto += `👨 *Nome do Pai:* ${pai}\n`;
        texto += `📋 *Situação Cadastral:* ${situacao}\n\n`;

        // 💰 RENDA
        if (d["income"] || d["purchasing_power"]) {
            texto += `💰 *INFORMAÇÕES FINANCEIRAS*\n`;
            texto += `• Renda Estimada: R$ ${d["income"] || "Não informado"}\n`;

            if (d["purchasing_power"]) {
                texto += `• Classe Social: ${d["purchasing_power"]["purchasing_power"] || "Não informado"}\n`;
            }

            texto += `\n`;
        }

        // 📊 SCORE
        if (d["score"]) {
            texto += `📊 *SCORE DE CRÉDITO*\n`;
            texto += `• Score CSB8: ${d["score"]["csb8"]} (${d["score"]["csb8_range"]})\n`;
            texto += `• Score CSBA: ${d["score"]["csba"]} (${d["score"]["csba_range"]})\n\n`;
        }

        texto += `━━━━━━━━━━━━━━━━━━`;

        await client.sendMessage(from, { text: texto }, { quoted: info });

    } catch (err) {
        console.error("Erro CPF:", err);
        enviar("❌ Erro ao consultar CPF.");
    }
}
break;

case "sex":
case "porn2": {
    try {

        if (!vip && !soDono)
            return enviar("🚫 Este comando é exclusivo para usuários VIP.");

        // Reage à mensagem
        await reagir("🔞");

        // Mensagem inicial
        await client.sendMessage(from, {
            text: `🔞 Aguarde um instante, estou buscando o conteúdo...`
        }, { quoted: info });

        // Carrega API Key
        const fs = require("fs");
        const dataConfig = JSON.parse(fs.readFileSync("./dono/config/data.json"));
        const apiKey = dataConfig.apikey2;

        if (!apiKey) {
            return enviar("❌ apikey2 não encontrada no data.json.");
        }

        // URL do endpoint
        const apiURL = `https://api.blackaut.shop/api/18/video/sexv?apikey=${apiKey}`;

        // Envia o vídeo
        await client.sendMessage(from, {
            video: { url: apiURL },
            mimetype: "video/mp4",
        }, { quoted: info });

    } catch (err) {
        console.error("Erro ao buscar vídeo 18+:", err);
        enviar("❌ Falha ao carregar o conteúdo. Tente novamente mais tarde.");
    }
}
break;


case "sex":
case "porn": {
    try {

        if (!vip && !soDono)
            return enviar("🚫 Este comando é exclusivo para usuários VIP.");

        // Reage à mensagem
        await reagir("🔞");

        // Aviso inicial
        await enviar("🔞 Aguarde um instante, estou buscando o conteúdo...");

        const fs = require("fs");
        const dataConfig = JSON.parse(fs.readFileSync("./dono/config/data.json"));
        const apiKey = dataConfig.apikey2;

        if (!apiKey) {
            return enviar("❌ apikey2 não encontrada no data.json.");
        }

        const apiURL = `https://api.blackaut.shop/api/18/video/sex?apikey=${apiKey}`;

        await client.sendMessage(from, {
            video: { url: apiURL },
            mimetype: "video/mp4",
        }, { quoted: info });

    } catch (err) {
        console.log("SEX ERROR:", err);
        enviar("❌ Erro ao carregar o conteúdo.");
    }
}
break;


case "antibot": {

  if (!isGroup)
    return enviar("❌ Apenas em grupo.");

  if (!isAdmin && !soDono)
    return enviar("❌ Apenas admin pode usar.");

  if (!isBotAdmins)
    return enviar("❌ Preciso ser admin.");

  if (!args[0])
    return enviar(`Use:\n${prefix}antibot on\n${prefix}antibot off`);

  const db = antiBotGlobal;

  if (args[0] === "on") {
    db[from] = true;
    fs.writeFileSync(antiBotGlobalPath, JSON.stringify(db, null, 2));
    return enviar("🤖 Antibot ativado com sucesso.");
  }

  if (args[0] === "off") {
    delete db[from];
    fs.writeFileSync(antiBotGlobalPath, JSON.stringify(db, null, 2));
    return enviar("🤖 Antibot desativado.");
  }
}
break;

case "antipalavrao": {
    if (!isGroup) return enviar("❌ Apenas em grupo.");
    if (!isAdmin) return enviar("❌ Apenas administradores.");

    const db = lerAntiPalavrao();

    if (db[from]) {
        delete db[from];
        salvarAntiPalavrao(db);
        return enviar("❌ Antipalavrão desativado.");
    } else {
        db[from] = true;
        salvarAntiPalavrao(db);
        return enviar("✅ Antipalavrão ativado.");
    }
}
break;

case "antiflood": {

if (!isGroup) return enviar("Somente em grupo.");
if (!isAdmin && !soDono) return enviar("Apenas admin pode usar.");

const db = lerAntiFlood();

if (args[0] === "on") {
    db[from] = true;
    salvarAntiFlood(db);
    return enviar("Antiflood ativado.");
}

if (args[0] === "off") {
    delete db[from];
    salvarAntiFlood(db);
    return enviar("Antiflood desativado.");
}

enviar("Use: antiflood on/off");
}
break;

case "antiaudio": {

if (!isGroup)
    return enviar("❌ Este comando só funciona em grupo.");

if (!isAdmin && !soDono)
    return enviar("❌ Apenas administradores podem usar este comando.");

const dbAudio = lerAntiAudio();

if (!args[0])
    return enviar(`Use:\n${prefix}antiaudio on\n${prefix}antiaudio off`);

if (args[0].toLowerCase() === "on") {

    dbAudio[from] = true;
    salvarAntiAudio(dbAudio);

    return enviar("🛡 Antiaudio ativado neste grupo.");
}

if (args[0].toLowerCase() === "off") {

    delete dbAudio[from];
    salvarAntiAudio(dbAudio);

    return enviar("🛡 Antiaudio desativado neste grupo.");
}

enviar("Use apenas on ou off.");

}
break;

case "antifigu": {

if (!isGroup)
    return enviar("❌ Este comando só funciona em grupo.");

if (!isAdmin && !soDono)
    return enviar("❌ Apenas administradores podem usar este comando.");

const dbFigu = lerAntiFigu();

if (!args[0])
    return enviar(`Use:\n${prefix}antifigu on\n${prefix}antifigu off`);

if (args[0].toLowerCase() === "on") {

    dbFigu[from] = true;
    salvarAntiFigu(dbFigu);

    return enviar("🛡 Antifigu ativado neste grupo.");
}

if (args[0].toLowerCase() === "off") {

    delete dbFigu[from];
    salvarAntiFigu(dbFigu);

    return enviar("🛡 Antifigu desativado neste grupo.");
}

enviar("Use apenas on ou off.");

}
break;

case "antivideo": {

if (!isGroup)
    return enviar("❌ Este comando só funciona em grupo.");

if (!isAdmin && !soDono)
    return enviar("❌ Apenas administradores podem usar este comando.");

const dbVideo = lerAntiVideo();

if (!args[0])
    return enviar(`Use:\n${prefix}antivideo on\n${prefix}antivideo off`);

if (args[0].toLowerCase() === "on") {

    dbVideo[from] = true;
    salvarAntiVideo(dbVideo);

    return enviar("🛡 Antivideo ativado neste grupo.");
}

if (args[0].toLowerCase() === "off") {

    delete dbVideo[from];
    salvarAntiVideo(dbVideo);

    return enviar("🛡 Antivideo desativado neste grupo.");
}

enviar("Use apenas on ou off.");

}
break;

case "antimg": {

if (!isGroup)
    return enviar("❌ Este comando só funciona em grupo.");

if (!isAdmin && !soDono)
    return enviar("❌ Apenas administradores podem usar este comando.");

const dbImg = lerAntiImg();

if (!args[0])
    return enviar(`Use:\n${prefix}antimg on\n${prefix}antimg off`);

if (args[0].toLowerCase() === "on") {

    dbImg[from] = true;
    salvarAntiImg(dbImg);

    return enviar("🛡 Antimg ativado neste grupo.");
}

if (args[0].toLowerCase() === "off") {

    delete dbImg[from];
    salvarAntiImg(dbImg);

    return enviar("🛡 Antimg desativado neste grupo.");
}

enviar("Use apenas on ou off.");

}
break;

case "antilinkgp": {
    if (!isGroup) return enviar("🚫 Apenas em grupo.");
    if (!isAdmin) return enviar("🚫 Apenas administradores.");

    const db = lerAntiLinkGp();
    const opcao = args[0]?.toLowerCase();

    if (!opcao) {
        return enviar(`⚙ Uso correto:\n\n${prefix}antilinkgp on\n${prefix}antilinkgp off`);
    }

    if (opcao === "on") {
        db[from] = true;
        salvarAntiLinkGp(db);
        return enviar("✅ Antilink de grupos ativado com sucesso.");
    }

    if (opcao === "off") {
        delete db[from];
        salvarAntiLinkGp(db);
        return enviar("❌ Antilink de grupos desativado.");
    }

    return enviar("Use apenas on ou off.");
}
break;

case "antilink": {

if (!isGroup)
    return enviar("❌ Este comando só funciona em grupo.");

if (!isAdmin && !soDono)
    return enviar("❌ Apenas administradores podem usar este comando.");

const dbAnti = lerAntiLink();

if (!args[0])
    return enviar(`Use:\n${prefix}antilink on\n${prefix}antilink off`);

if (args[0].toLowerCase() === "on") {

    dbAnti[from] = true;
    salvarAntiLink(dbAnti);

    return enviar("🛡 Antilink ativado neste grupo.");

}

if (args[0].toLowerCase() === "off") {

    delete dbAnti[from];
    salvarAntiLink(dbAnti);

    return enviar("🛡 Antilink desativado neste grupo.");
}

enviar("Use apenas on ou off.");

}
break;

case "reiniciar": {
try {

if (!soDono)
return enviar("Apenas o dono pode usar este comando.");

const fs = require("fs");
const restartPath = "./dono/config/restart.json";

// salva chat e id da mensagem para quoted depois
fs.writeFileSync(restartPath, JSON.stringify({
ativo: true,
chat: from,
quoted: info
}, null, 2));

await client.sendMessage(from, {
text: "🔄 Reiniciando sistema, aguarde alguns segundos."
}, { quoted: info });

setTimeout(() => {
process.exit(1);
}, 2000);

} catch (err) {

console.log("RESTART ERROR:", err);
enviar("Falha ao reiniciar.");

}

break;
}


case "listblockcmd": {

    if (!soDono)
        return enviar("🚫 Apenas o dono pode ver a lista.");

    const lista = lerCmdBlock();

    if (!lista.length)
        return enviar("📭 Nenhum comando bloqueado.");

    let texto = "🚫 COMANDOS BLOQUEADOS:\n\n";

    lista.forEach((c, i) => {
        texto += `${i + 1}. ${c}\n`;
    });

    enviar(texto);
}
break;

case "unblockcmd": {

    if (!soDono)
        return enviar("🚫 Apenas o dono pode desbloquear comandos.");

    const cmd = args[0]?.toLowerCase();

    if (!cmd)
        return enviar(`⚙️ Use:\n➤ ${prefix}unblockcmd nomeDoComando`);

    let lista = lerCmdBlock();

    if (!lista.includes(cmd))
        return enviar("⚠️ Este comando não está bloqueado.");

    lista = lista.filter(c => c !== cmd);
    salvarCmdBlock(lista);

    enviar(`✅ Comando "${cmd}" desbloqueado.`);
}
break;

case "blockcmd": {

    if (!soDono)
        return enviar("🚫 Apenas o dono pode bloquear comandos.");

    const cmd = args[0]?.toLowerCase();

    if (!cmd)
        return enviar(`⚙️ Use:\n➤ ${prefix}blockcmd nomeDoComando`);

    let lista = lerCmdBlock();

    if (lista.includes(cmd))
        return enviar("⚠️ Este comando já está bloqueado.");

    lista.push(cmd);
    salvarCmdBlock(lista);

    enviar(`🔒 Comando "${cmd}" bloqueado com sucesso.`);
}
break;

case "desblockia": {

    if (!soDono)
        return enviar("🚫 Apenas o dono pode usar este comando.");

    let alvo = null;

    // 1️⃣ Se marcou alguém
    alvo = info.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

    // 2️⃣ Se respondeu mensagem de alguém
    if (!alvo) {
        alvo = info.message?.extendedTextMessage?.contextInfo?.participant;
    }

    // 3️⃣ Se digitou número manual
    if (!alvo && args[0]) {
        alvo = args[0].replace(/\D/g, '') + "@s.whatsapp.net";
    }

    if (!alvo)
        return enviar(`⚠️ Marque, responda a mensagem ou use:
➤ ${prefix}desbloquearia 556399999999`);

    const numero = alvo.replace(/\D/g, '');

    let lista = lerIABlock();

    if (!lista.includes(numero))
        return enviar("⚠️ Este usuário não está bloqueado.");

    lista = lista.filter(n => n !== numero);
    salvarIABlock(lista);

    enviar("✅ Usuário desbloqueado da IA com sucesso.");
}
break;

case "blockia": {

    if (!soDono)
        return enviar("🚫 Apenas o dono pode usar este comando.");

    let alvo = null;

    // 1️⃣ Se marcou alguém
    alvo = info.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

    // 2️⃣ Se respondeu mensagem de alguém
    if (!alvo) {
        alvo = info.message?.extendedTextMessage?.contextInfo?.participant;
    }

    // 3️⃣ Se digitou número manual
    if (!alvo && args[0]) {
        alvo = args[0].replace(/\D/g, '') + "@s.whatsapp.net";
    }

    if (!alvo)
        return enviar(`⚠️ Marque, responda a mensagem ou use:
➤ ${prefix}blockia 556399999999`);

    const numero = alvo.replace(/\D/g, '');

    let lista = lerIABlock();

    if (lista.includes(numero))
        return enviar("⚠️ Este usuário já está bloqueado da IA.");

    lista.push(numero);
    salvarIABlock(lista);

    enviar("🚫 Usuário bloqueado da IA com sucesso.");
}
break;

case "bcgp": {
    try {

        if (!soDono)
            return enviar("🚫 Apenas o dono pode usar este comando.");

        const mensagem = args.join(" ").trim();

        if (!mensagem) {
            return enviar(
`📢 Use assim:
➜ ${prefix}bcgp Sua mensagem aqui`
            );
        }

        await reagir("🚀");

        await enviar(
`🌍 *Transmissão Global*

⏳ Iniciando envio para todos os grupos...
Aguarde a finalização.`
        );

        const chats = await client.groupFetchAllParticipating();
        const grupos = Object.keys(chats);

        if (!grupos.length)
            return enviar("❌ Nenhum grupo encontrado.");

        let enviados = 0;
        let erros = 0;

        for (let id of grupos) {

            try {

                const metadata = chats[id];
                const participantes = metadata.participants || [];

                const membros = participantes.map(p => p.id);

                await client.sendMessage(id, {
                    text:
`📢 *TRANSMISSÃO GLOBAL*

${mensagem}

━━━━━━━━━━━━━━━━━━
${data.NomeBot || "Bot"}`,
                    mentions: membros
                });

                enviados++;

                await new Promise(r => setTimeout(r, 3000));

            } catch (err) {
                erros++;
            }
        }

        await enviar(
`✅ *Transmissão Finalizada*

📤 Enviado para: ${enviados} grupos
⚠ Falhas: ${erros}

🌍 Processo concluído com sucesso.`
        );

    } catch (err) {
        console.log("BCGP ERROR:", err);
        enviar("❌ Erro ao executar transmissão.");
    }
}
break;


case "rmaluguel": {
    if (!soDono) return enviar("🚫 Apenas o dono pode usar.");
    if (!isGroup) return enviar("❌ Use apenas em grupo.");

    const dados = lerSistemaAluguelGlobal();

    if (!dados.gruposLiberados[from]) {
        return enviar("⚠️ Este grupo não está liberado no aluguel global.");
    }

    delete dados.gruposLiberados[from];

    salvarSistemaAluguelGlobal(dados);

    return enviar("🗑️ Grupo removido do aluguel global.");
}
break;

case "addaluguel": {
    if (!soDono) return enviar("🚫 Apenas o dono pode usar.");
    if (!isGroup) return enviar("❌ Use apenas em grupo.");

    const tempoArg = args[0];

    if (!tempoArg) {
        return enviar(`⚙️ Use:\n➜ ${prefix}addaluguel 1d\n➜ ${prefix}addaluguel 30m`);
    }

    let tempoMs;

    if (tempoArg.endsWith("d")) {
        const dias = parseInt(tempoArg);
        tempoMs = dias * 24 * 60 * 60 * 1000;
    } 
    else if (tempoArg.endsWith("m")) {
        const minutos = parseInt(tempoArg);
        tempoMs = minutos * 60 * 1000;
    } 
    else {
        return enviar("❌ Formato inválido. Use 1d ou 30m.");
    }

    const dados = lerSistemaAluguelGlobal();

    dados.gruposLiberados[from] = {
        expiraEm: Date.now() + tempoMs
    };

    salvarSistemaAluguelGlobal(dados);

    return enviar(`✅ Grupo liberado por ${tempoArg}.`);
}
break;


case "aluguel-global": {
    if (!soDono) return enviar("🚫 Apenas o dono pode usar.");

    const opcao = args[0]?.toLowerCase();

    if (!["on", "off"].includes(opcao)) {
        return enviar(`⚙️ Use:\n➜ ${prefix}aluguelglobal on\n➜ ${prefix}aluguelglobal off`);
    }

    const dados = lerSistemaAluguelGlobal();

    dados.ativo = opcao === "on";

    salvarSistemaAluguelGlobal(dados);

    return enviar(
        opcao === "on"
        ? "🌍 Aluguel global ativado.\nBot bloqueado em todos os grupos."
        : "🌍 Aluguel global desativado.\nBot liberado normalmente."
    );
}
break;

case "nomedono": {
    if (!soDono) {
        return enviar("?? Apenas o dono pode alterar o nome do dono.");
    }

    const novoNome = args.join(" ").trim();

    if (!novoNome) {
        return enviar(
`⚙️ Informe o novo nome do dono.

Exemplo:
➜ ${prefix}nomedono GUSTA`
        );
    }

    try {

        const fs = require("fs");
        const caminho = "./dono/config/data.json";

        const dataConfig = JSON.parse(fs.readFileSync(caminho, "utf-8"));

        dataConfig.NickDono = novoNome;

        fs.writeFileSync(caminho, JSON.stringify(dataConfig, null, 2));

        await client.sendMessage(from, {
            text: `👑 Nome do dono alterado com sucesso!\n\nNovo nome: *${novoNome}*`
        }, { quoted: info });

    } catch (err) {
        console.error("ERRO SETNOMEDONO:", err);
        await client.sendMessage(from, {
            text: "❌ Falha ao alterar o nome do dono."
        }, { quoted: info });
    }

    break;
}

case "nomebot": {
    if (!soDono) {
        return enviar("🚫 Apenas o dono pode alterar o nome do bot.");
    }

    const novoNome = args.join(" ").trim();

    if (!novoNome) {
        return enviar(
`⚙️ Informe o novo nome do bot.

Exemplo:
➜ ${prefix}nomebot FAATAL MD`
        );
    }

    try {

        const fs = require("fs");
        const caminho = "./dono/config/data.json";

        const dataConfig = JSON.parse(fs.readFileSync(caminho, "utf-8"));

        dataConfig.NomeBot = novoNome;

        fs.writeFileSync(caminho, JSON.stringify(dataConfig, null, 2));

        // ENVIO DIRETO SEM FUNÇÃO AUXILIAR
        await client.sendMessage(from, {
            text: `🤖 Nome do bot alterado com sucesso!\n\nNovo nome: *${novoNome}*`
        }, { quoted: info });

    } catch (err) {
        console.error("ERRO SETNOMEBOT:", err);
        await client.sendMessage(from, {
            text: "❌ Falha ao alterar o nome do bot."
        }, { quoted: info });
    }

    break;
}

case "setprefix": {
    try {

        if (!soDono) {
            return enviar("🚫 Apenas o dono pode alterar o prefixo.");
        }

        const novoPrefixo = args[0];

        if (!novoPrefixo) {
            return enviar(
`⚙️ Informe o novo prefixo.

Exemplo:
➜ ${prefix}setprefix !`
            );
        }

        if (novoPrefixo.length > 3) {
            return enviar("❌ O prefixo deve ter no máximo 3 caracteres.");
        }

        const fs = require("fs");
        const caminho = "./dono/config/data.json";

        if (!fs.existsSync(caminho)) {
            return enviar("❌ data.json não encontrado.");
        }

        const dataConfig = JSON.parse(fs.readFileSync(caminho, "utf-8"));

        dataConfig.prefix = novoPrefixo;

        fs.writeFileSync(caminho, JSON.stringify(dataConfig, null, 2));

        return enviar(
`✅ Prefixo alterado com sucesso!

Novo prefixo: *${novoPrefixo}*`
        );

    } catch (err) {
        console.error("ERRO SETPREFIX:", err);
        return enviar("❌ Falha ao alterar prefixo.");
    }
}
break;

case "imgai":
case "imagemai": {
    try {

        const userPrompt = args.join(" ").trim();

const q = `Ultra detailed image of ${userPrompt}, main subject centered, vibrant colors, high quality, 4k, focus on the main subject`;

        if (!q) {
            return enviar(
`⚠️ Informe o que deseja gerar.

Exemplo:
➜ ${prefix}imgai gato rosa`
            );
        }

        await reagir("🎨");

        await client.sendMessage(from, {
            text: `🎨 Aguarda um instante, estou gerando sua imagem...`
        }, { quoted: info });

        const fs = require("fs");
        const dataConfig = JSON.parse(fs.readFileSync("./dono/config/data.json"));
        const apiKey = dataConfig.apikey2;

        if (!apiKey) {
            return enviar("❌ apikey2 não encontrada no data.json.");
        }

        const apiURL = `https://api.blackaut.shop/api/ai/imagem/imagemAi?query=${encodeURIComponent(q)}&apikey=${apiKey}`;

        await client.sendMessage(from, {
    image: { url: apiURL },
    caption: `✨ Imagem gerada para: *${userPrompt}*`
}, { quoted: info });

    } catch (err) {
        console.error("Erro ao gerar imagem AI:", err);
        enviar("❌ Falha ao gerar imagem. Tente novamente.");
    }
}
break;

case "dataconta":
case "datadaconta": {
try {

const id = args[0];

if (!id)
return enviar(`📌 Uso correto:\n➤ ${prefix}dataconta 1686576852`);

await reagir("📅");

const fs = require("fs");
const axios = require("axios");

const data = JSON.parse(
fs.readFileSync("./dono/config/data.json")
);

const apiKey = data.apikey;

const apiURL =
`https://tokito-apis.site/api/datadaconta?id=${encodeURIComponent(id)}&apikey=${apiKey}`;

const { data: json } = await axios.get(apiURL, {
timeout: 20000
});

if (!json || !json.status)
return enviar("❌ ID não encontrado.");

// 🔥 MOSTRA EXATAMENTE COMO A API ENVIOU

await enviar(json.datacriacao);

} catch (err) {

console.log("DATACONTA ERROR:", err.response?.data || err);
await enviar("❌ Erro ao buscar informações.");

}

break;
}

case "infoff": {
try {

const id = args[0];

if (!id)
return enviar(`📌 Uso correto:\n➤ ${prefix}infoff 1686576852`);

await reagir("🎮");

const fs = require("fs");
const axios = require("axios");

//━━━━━━━━━━━━━━━━━━
// 🔑 LER APIKEY
//━━━━━━━━━━━━━━━━━━

const data = JSON.parse(
fs.readFileSync("./dono/config/data.json")
);

const apiKey = data.apikey;

const apiURL =
`https://tokito-apis.site/api/infoff?id=${encodeURIComponent(id)}&apikey=${apiKey}`;

const { data: json } = await axios.get(apiURL, {
timeout: 20000
});

if (!json || !json.status)
return enviar("❌ ID não encontrado.");

//━━━━━━━━━━━━━━━━━━
// 📦 EXTRAIR DADOS
//━━━━━━━━━━━━━━━━━━

const info = json.basicInfo;
const clan = json.clanBasicInfo;
const social = json.socialInfo;
const pet = json.petInfo;
const credit = json.creditScoreInfo;

//━━━━━━━━━━━━━━━━━━
// 🕒 CONVERTER DATA
//━━━━━━━━━━━━━━━━━━

let ultimoLoginFormatado = "Desconhecido";

if (info.ultimoLogin) {

const [dataParte, horaParte] = info.ultimoLogin.split(", ");
const [dia, mes, ano] = dataParte.split("/");
const [hora, minuto, segundo] = horaParte.split(":");

const dataCorrigida = new Date(
`${ano}-${mes}-${dia}T${hora}:${minuto}:${segundo}-03:00`
);

ultimoLoginFormatado = dataCorrigida.toLocaleString("pt-BR", {
timeZone: "America/Sao_Paulo"
});

}

//━━━━━━━━━━━━━━━━━━
// 🧠 AJUSTES VISUAIS
//━━━━━━━━━━━━━━━━━━

const nickLimpo = info.nickname
.replace(/\n/g, "")
.replace(/\s+/g, " ")
.trim();

const sexoTraduzido =
social?.sexo === "MALE" ? "Masculino" :
social?.sexo === "FEMALE" ? "Feminino" :
"Não informado";

const bioLimpa = social?.bio
?.replace(/\[.*?\]/g, "")
?.trim() || "Sem bio";

//━━━━━━━━━━━━━━━━━━
// 📝 MENSAGEM FINAL
//━━━━━━━━━━━━━━━━━━

const msg = `
╭━━━〔 🎮 PERFIL FREE FIRE 〕━━━⬣

👤 Nick: ${nickLimpo}
🆔 ID: ${info.id}
🌎 Região: ${info.region}

🎖 Nível: ${info.level}
✨ XP Total: ${info.exp.toLocaleString("pt-BR")}
❤️ Likes: ${info.liked.toLocaleString("pt-BR")}

🏆 Rank Global Atual: ${info.rank}
🥇 Rank CS Atual: ${info.csRank}
🔝 Melhor Rank já alcançado: ${info.maxRank}
🎯 Pontos atuais no ranqueado: ${info.rankingPoints}

📅 Conta criada em: ${info.criadoEm}
⏳ Último login: ${ultimoLoginFormatado}
🔄 Versão do jogo: ${info.releaseVersion}

💎 Diamantes já gastos na conta: ${info.diamondCost}

━━━━━━━━━━━━━━━━━━

🏰 Guilda: ${clan?.nome || "Sem guilda"}
🏰 Nível da guilda: ${clan?.nivel || "—"}
👥 Membros: ${clan?.membros || "—"}/${clan?.capacidade || "—"}

🐾 Pet: ${pet?.nome || "Nenhum"}
🐾 Nível do pet: ${pet?.nivel || "—"}
🐾 XP do pet: ${pet?.exp?.toLocaleString("pt-BR") || "—"}

━━━━━━━━━━━━━━━━━━

👤 Sexo: ${sexoTraduzido}
⭐ Pontuação de crédito: ${credit?.creditScore || "—"}

📝 Bio:
${bioLimpa}

╰━━━━━━━━━━━━━━━━━━⬣
`;

await enviar(msg);

} catch (err) {

console.log("INFOFF ERROR:", err.response?.data || err);
await enviar("❌ Erro ao buscar informações.");

}

break;
}


case "ttk2":
case "tiktoksearch": {
try {

if (!args.length) {
return enviar(`⚠️ Uso correto:\n➤ ${prefix}ttsearch neymar edit`);
}

await enviar("🔎 Buscando seu vídeo...");

const fs = require("fs");
const axios = require("axios");

const data = JSON.parse(fs.readFileSync("./dono/config/data.json"));
const apikey = data.apikey;

const query = encodeURIComponent(args.join(" "));
const apiURL = `https://tokito-apis.site/api/tiktok-search?query=${query}&apikey=${apikey}`;

// ⏳ Timeout aumentado para 30 segundos
const response = await axios.get(apiURL, {
timeout: 30000
});

const json = response.data;

if (!json.status || !json.resultados || json.resultados.length === 0) {
return enviar("❌ Nenhum vídeo encontrado.");
}

const videoURL = json.resultados[0].video_sem_marca || json.resultados[0].video;

if (!videoURL) {
return enviar("❌ Vídeo indisponível.");
}

await client.sendMessage(from, {
video: { url: videoURL }
}, { quoted: info });

} catch (err) {

if (err.code === "ECONNABORTED" || err.code === "UND_ERR_CONNECT_TIMEOUT") {
return enviar("⚠️ A API demorou para responder. Tente novamente.");
}

console.log("TTSEARCH ERROR:", err);
enviar("❌ Erro ao buscar vídeo.");

}
}
break;


case "afk": {
    try {
        if (!isGroup) return reply("❌ Esse comando só funciona em grupos.");

        await reagir("💤");

        const motivo = text || "Sem motivo especificado";

        let afkDB = lerAFK();

        const chave = `${from}_${sender}`;

        afkDB[chave] = {
            motivo: motivo,
            timestamp: Date.now(),
            pushName: info.pushName || "Usuário"
        };

        salvarAFK(afkDB);

        await client.sendMessage(from, {
            text: `Você está agora AFK 🙇. Motivo: ${motivo}`,
            mentions: [sender]
        }, { quoted: info });

    } catch (e) {
        console.error("Erro no comando afk:", e);
        await client.sendMessage(from, { text: "❌ Ocorreu um erro ao ativar o modo AFK." }, { quoted: info });
    }
}
break;

case "print":
case "printsite": {
try {

await reagir("🌐");

if (!args.length) {
return enviar(`⚠️ Uso correto:\n➤ ${prefix}print https://google.com`);
}

const fs = require("fs");

// 📂 Lê apikey
const dataPath = "./dono/config/data.json";
if (!fs.existsSync(dataPath)) {
return enviar("❌ data.json não encontrado.");
}

const data = JSON.parse(fs.readFileSync(dataPath));
const apikey = data.apikey;

let urlSite = args[0];

// adiciona https automaticamente se não tiver
if (!urlSite.startsWith("http://") && !urlSite.startsWith("https://")) {
urlSite = "https://" + urlSite;
}

const apiURL =
`https://tokito-apis.site/api/print-site?url=${encodeURIComponent(urlSite)}&apikey=${apikey}`;

await client.sendMessage(from, {
image: { url: apiURL },
caption: `🖥️ Print do site:\n${urlSite}`
}, { quoted: info });

} catch (err) {

console.log("PRINT ERROR:", err);
enviar("❌ Erro ao gerar print do site.");

}
}
break;

case "brat2":
case "bratvid": {
try {


if (!args.length) {
return enviar(`⚠️ Uso correto:\n➤ ${prefix}brat2 faatal`);
}

const fs = require("fs").promises;
const fsSync = require("fs");
const path = require("path");
const axios = require("axios");
const { exec } = require("child_process");

// 📂 Lê apikey
const dataPath = "./dono/config/data.json";
if (!fsSync.existsSync(dataPath)) {
return enviar("❌ data.json não encontrado.");
}

const data = JSON.parse(fsSync.readFileSync(dataPath));
const apikey = data.apikey;

const texto = encodeURIComponent(args.join(" "));
const url =
`https://tokito-apis.site/api/stickers/brat-vid?text=${texto}&apikey=${apikey}`;

await enviar("Criando sua figurinha, aguarde...");

// 📥 Baixa o vídeo da API
const response = await axios.get(url, {
responseType: "arraybuffer"
});

if (!response.data || response.data.length < 1000) {
return enviar("❌ A API retornou um erro ao gerar a figurinha.");
}

// 📁 Pasta temporária
const tmpDir = path.resolve(__dirname, "tmp");
if (!fsSync.existsSync(tmpDir)) {
fsSync.mkdirSync(tmpDir, { recursive: true });
}

const nomeArquivo = `brat_${Date.now()}`;
const tempMp4 = path.join(tmpDir, `${nomeArquivo}.mp4`);
const tempWebp = path.join(tmpDir, `${nomeArquivo}.webp`);

await fs.writeFile(tempMp4, response.data);

// 🔥 Converte MP4 → WEBP animado válido
const cmd = `ffmpeg -y -i "${tempMp4}" -vcodec libwebp -filter:v "fps=15,scale=512:512:flags=lanczos" -loop 0 -preset default -an -vsync 0 "${tempWebp}"`;

exec(cmd, async (err) => {

if (err) {
console.error("BRAT CONVERT ERROR:", err);
if (fsSync.existsSync(tempMp4)) fsSync.unlinkSync(tempMp4);
return enviar("❌ Erro ao converter figurinha animada.\n\n💡 Instale ffmpeg:\n`pkg install ffmpeg`");
}

try {

if (fsSync.existsSync(tempWebp)) {
const stickerBuffer = await fs.readFile(tempWebp);

await client.sendMessage(from, {
sticker: stickerBuffer
}, { quoted: info });
}

} catch (e) {
enviar("❌ Erro ao enviar figurinha.");
}

// 🧹 Limpeza
setTimeout(() => {
[tempMp4, tempWebp].forEach(f => {
if (fsSync.existsSync(f)) fsSync.unlinkSync(f);
});
}, 2000);

});

} catch (err) {

console.log("BRATVID ERROR:", err);
enviar("❌ Erro interno ao gerar figurinha animada.");

}
}
break;


case "brat": {
try {


if (!args.length) {
return enviar(`⚠️ Uso correto:\n➤ ${prefix}brat faatal`);
}

const fs = require("fs");

const dataPath = "./dono/config/data.json";

if (!fs.existsSync(dataPath)) {
return enviar("❌ data.json não encontrado.");
}

const data = JSON.parse(fs.readFileSync(dataPath));
const apikey = data.apikey;

if (!apikey) {
return enviar("❌ Apikey não encontrada no data.json.");
}

await enviar("🧪 Criando sua figurinha brat, aguarde...");

const texto = encodeURIComponent(args.join(" "));

const url =
`https://tokito-apis.site/api/stickers/brat-img?text=${texto}&apikey=${apikey}`;

// 📦 Envia figurinha
await client.sendMessage(from, {
sticker: { url }
}, { quoted: info });

} catch (err) {

console.log("BRAT ERROR:", err);
await enviar("❌ Erro ao gerar figurinha.");

}

}
break;

case "faatal": {
    if (!soDono)
        return enviar("🚫 Apenas meu mestre pode controlar a IA FAATAL.");

    const opcao = args[0]?.toLowerCase();

    if (!opcao)
        return enviar(`⚙️ Use:\n➤ ${prefix}ia on\n➤ ${prefix}ia off`);

    let sistema = lerIA();

    if (opcao === "on") {
        sistema.ativa = true;
        salvarIA(sistema);
        return enviar("🤖 IA FAATAL ativada com sucesso.");
    }

    if (opcao === "off") {
        sistema.ativa = false;
        salvarIA(sistema);
        return enviar("🛑 IA FAATAL desativada.");
    }

    enviar("⚠️ Use apenas: on ou off.");
}
break;

case "gemini":
case "gpt": {
    try {

        const texto = args.join(" ").trim();

        if (!texto)
            return enviar(`⚠️ Uso correto:\n➤ ${prefix}gemini sua pergunta`);

        await reagir("🤖");

        const apiKey = data.apikey;

        if (!apiKey)
            return enviar("❌ APIKEY não configurada no data.json.");

        const url = `https://tokito-apis.site/api/gemini-pro?texto=${encodeURIComponent(texto)}&apikey=${apiKey}`;

        const res = await fetch(url);

        if (!res.ok)
            return enviar("❌ Falha ao conectar com a API.");

        const json = await res.json();

        const resposta =
            json?.resposta?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!resposta)
            return enviar("❌ Não consegui interpretar a resposta da API.");

        await enviar(`🤖 *Gemini Pro:*\n\n${resposta}`);

    } catch (err) {
        console.log("GEMINI ERROR:", err);
        enviar("❌ Erro ao processar a solicitação.");
    }

    break;
}

case "listavip": {

    if (!soDono)
        return enviar("🚫 Apenas meu mestre pode ver a lista de usuários VIPs.");

    const lista = lerVip();

    if (!lista.length)
        return enviar("📭 Nenhum usuário VIP cadastrado.");

    let texto =
`╭━━━〔 ✨ LISTA DOS VIPS ✨ 〕━━━╮

`;

    const mentions = [];

    for (const jid of lista) {

        const numero = jid.split("@")[0];

        // tenta obter nome do contato
        let nome = numero;

        try {
            const contato = await client.onWhatsApp(jid);
            if (contato && contato[0]?.notify) {
                nome = contato[0].notify;
            }
        } catch {}

        texto += `┃ 🎗 @${numero}\n`;
        mentions.push(jid);
    }

    texto += `
┃
┃ ✨ Total: ${lista.length}
╰━━━━━━━━━━━━━━━━━━━━╯
> 𝙵𝙰𝙰𝚃𝙰𝙻 𝙼𝙳`;

    const fs = require("fs");
    const caminhoImagem = "./arquivos/fotos/vip.jpg";

    try {
        if (fs.existsSync(caminhoImagem)) {
            await client.sendMessage(from, {
                image: fs.readFileSync(caminhoImagem),
                caption: texto,
                mentions
            }, { quoted: info });
        } else {
            await client.sendMessage(from, {
                text: texto,
                mentions
            }, { quoted: info });
        }
    } catch {
        await client.sendMessage(from, {
            text: texto,
            mentions
        }, { quoted: info });
    }

}
break;

case "servip": {

    if (!soDono)
        return enviar("🚫 Apenas o dono pode usar este comando.");

    const meuNumero = sender.replace(/\D/g, '');

    let lista = lerVip();

    if (lista.includes(meuNumero)) {
        return enviar("💎 Você já está na lista VIP, mestre.");
    }

    lista.push(meuNumero);
    salvarVip(lista);

    enviar("Agora vc está na lista VIP, mestre 🙇");
}
break;

case "addvip": {

    if (!soDono)
        return enviar("🚫 Apenas meu mestre pode adicionar usuários na lista VIP.");

    const alvo =
        info.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] ||
        (args[0] ? args[0].replace(/\D/g, '') + "@s.whatsapp.net" : null);

    if (!alvo)
        return enviar(`⚠️ Marque o usuário ou use:\n➤ ${prefix}addvip 556399999999`);

    const numero = alvo.replace(/\D/g, '');

    let lista = lerVip();

    if (lista.includes(numero))
        return enviar("⚠️ Este usuário já é VIP.");

    lista.push(numero);
    salvarVip(lista);

    enviar("💎 Usuário adicionado ao VIP com sucesso.");
    break;
}

case "rmvip": {

    if (!soDono)
        return enviar("🚫 Apenas meu mestre pode remover usuários da lista VIP.");

    const alvo =
        info.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] ||
        (args[0] ? args[0].replace(/\D/g, '') + "@s.whatsapp.net" : null);

    if (!alvo)
        return enviar(`⚠️ Marque o usuário ou use:\n➤ ${prefix}rmvip 556399999999`);

    const numero = alvo.replace(/\D/g, '');

    let lista = lerVip();

    if (!lista.includes(numero))
        return enviar("⚠️ Este usuário não é VIP.");

    lista = lista.filter(n => n !== numero);
    salvarVip(lista);

    enviar("❌ Usuário removido do VIP.");
    break;
}

case "plaq": {
    try {
if (!vip && !soDono)
    return enviar("🚫 Este comando é exclusivo para usuários VIP.");

        if (!args.length) {
            return enviar(`⚠️ Uso correto:\n➤ ${prefix}plaq1 faatal`);
        }

        

        const texto = encodeURIComponent(args.join(" "));
        const apiKey = data.apikey;
        const baseURL = data.site_apikey;

        const url = `${baseURL}api/plaq1?texto=${texto}&apikey=${apiKey}`;

        await enviar("✨ Gerando sua plaquinha...");

        const res = await fetch(url);
        const buffer = Buffer.from(await res.arrayBuffer());

        await client.sendMessage(from, {
            image: buffer,
            caption: `😈 Plaquinha gerada com sucesso.`
        }, { quoted: info });

    } catch (err) {
        console.log("PLAQ1 ERROR:", err);
        enviar("❌ Erro ao gerar a plaquinha.");
    }

    break;
}


case "plaq1": {
    try {
if (!vip && !soDono)
    return enviar("🚫 Este comando é exclusivo para usuários VIP.");

        if (!args.length) {
            return enviar(`⚠️ Uso correto:\n➤ ${prefix}plaq2 faatal`);
        }

       

        const texto = encodeURIComponent(args.join(" "));
        const apiKey = data.apikey;
        const baseURL = data.site_apikey;

        const url = `${baseURL}api/plaq2?texto=${texto}&apikey=${apiKey}`;

        await enviar("✨ Gerando sua plaquinha...");

        const res = await fetch(url);
        const buffer = Buffer.from(await res.arrayBuffer());

        await client.sendMessage(from, {
            image: buffer,
            caption: `😈 Plaquinha gerada com sucesso.`
        }, { quoted: info });

    } catch (err) {
        console.log("PLAQ2 ERROR:", err);
        enviar("❌ Erro ao gerar a plaquinha.");
    }

    break;
}


case "plaq2": {
    try {
if (!vip && !soDono)
    return enviar("🚫 Este comando é exclusivo para usuários VIP.");

        if (!args.length) {
            return enviar(`⚠️ Uso correto:\n➤ ${prefix}plaq3 faatal`);
        }

        const texto = encodeURIComponent(args.join(" "));
        const apiKey = data.apikey;
        const baseURL = data.site_apikey;

        const url = `${baseURL}api/plaq3?texto=${texto}&apikey=${apiKey}`;

        await enviar("✨ Gerando sua plaquinha...");

        const res = await fetch(url);
        const buffer = Buffer.from(await res.arrayBuffer());

        await client.sendMessage(from, {
            image: buffer,
            caption: `😈 Plaquinha gerada com sucesso.`
        }, { quoted: info });

    } catch (err) {
        console.log("PLAQ3 ERROR:", err);
        enviar("❌ Erro ao gerar a plaquinha.");
    }

    break;
}

case "plaq3": {
    try {
if (!vip && !soDono)
    return enviar("🚫 Este comando é exclusivo para usuários VIP.");

        if (!args.length) {
            return enviar(`⚠️ Uso correto:\n➤ ${prefix}plaq4 faatal`);
        }

        const texto = encodeURIComponent(args.join(" "));
        const apiKey = data.apikey;
        const baseURL = data.site_apikey;

        const url = `${baseURL}api/plaq4?texto=${texto}&apikey=${apiKey}`;

        await enviar("✨ Gerando sua plaquinha...");

        const res = await fetch(url);
        const buffer = Buffer.from(await res.arrayBuffer());

        await client.sendMessage(from, {
            image: buffer,
            caption: `😈 Plaquinha gerada com sucesso.`
        }, { quoted: info });

    } catch (err) {
        console.log("PLAQ4 ERROR:", err);
        enviar("❌ Erro ao gerar a plaquinha.");
    }

    break;
}

case "plaq4": {
    try {
if (!vip && !soDono)
    return enviar("🚫 Este comando é exclusivo para usuários VIP.");

        if (!args.length) {
            return enviar(`⚠️ Uso correto:\n➤ ${prefix}plaq5 faatal`);
        }

        const texto = encodeURIComponent(args.join(" "));
        const apiKey = data.apikey;
        const baseURL = data.site_apikey;

        const url = `${baseURL}api/plaq5?texto=${texto}&apikey=${apiKey}`;

        await enviar("✨ Gerando sua plaquinha...");

        const res = await fetch(url);
        const buffer = Buffer.from(await res.arrayBuffer());

        await client.sendMessage(from, {
            image: buffer,
            caption: `😈 Plaquinha gerada com sucesso.`
        }, { quoted: info });

    } catch (err) {
        console.log("PLAQ5 ERROR:", err);
        enviar("❌ Erro ao gerar a plaquinha.");
    }

    break;
}

case "plaq5": {
    try {
if (!vip && !soDono)
    return enviar("🚫 Este comando é exclusivo para usuários VIP.");

        if (!args.length) {
            return enviar(`⚠️ Uso correto:\n➤ ${prefix}plaq6 faatal`);
        }

        const texto = encodeURIComponent(args.join(" "));
        const apiKey = data.apikey;
        const baseURL = data.site_apikey;

        const url = `${baseURL}api/plaq6?texto=${texto}&apikey=${apiKey}`;

        await enviar("✨ Gerando sua plaquinha...");

        const res = await fetch(url);
        const buffer = Buffer.from(await res.arrayBuffer());

        await client.sendMessage(from, {
            image: buffer,
            caption: `😈 Plaquinha gerada com sucesso.`
        }, { quoted: info });

    } catch (err) {
        console.log("PLAQ6 ERROR:", err);
        enviar("❌ Erro ao gerar a plaquinha.");
    }

    break;
}

case "plaq6": {
    try {
if (!vip && !soDono)
    return enviar("🚫 Este comando é exclusivo para usuários VIP.");

        if (!args.length) {
            return enviar(`⚠️ Uso correto:\n➤ ${prefix}plaq7 faatal`);
        }

        const texto = encodeURIComponent(args.join(" "));
        const url = `${data.site_apikey}api/plaq7?texto=${texto}&apikey=${data.apikey}`;

        await enviar("✨ Gerando sua plaquinha...");

        const res = await fetch(url);
        const buffer = Buffer.from(await res.arrayBuffer());

        await client.sendMessage(from, {
            image: buffer,
            caption: `😈 Plaquinha gerada com sucesso.`
        }, { quoted: info });

    } catch (err) {
        console.log("PLAQ7 ERROR:", err);
        enviar("❌ Erro ao gerar a plaquinha.");
    }
    break;
}

case "plaq7": {
    try {
if (!vip && !soDono)
    return enviar("🚫 Este comando é exclusivo para usuários VIP.");

        if (!args.length) {
            return enviar(`⚠️ Uso correto:\n➤ ${prefix}plaq8 faatal`);
        }

        const texto = encodeURIComponent(args.join(" "));
        const url = `${data.site_apikey}api/plaq8?texto=${texto}&apikey=${data.apikey}`;

        await enviar("✨ Gerando sua plaquinha...");

        const res = await fetch(url);
        const buffer = Buffer.from(await res.arrayBuffer());

        await client.sendMessage(from, {
            image: buffer,
            caption: `😈 Plaquinha gerada com sucesso.`
        }, { quoted: info });

    } catch (err) {
        console.log("PLAQ8 ERROR:", err);
        enviar("❌ Erro ao gerar a plaquinha.");
    }
    break;
}

case "plaq8": {
    try {
if (!vip && !soDono)
    return enviar("🚫 Este comando é exclusivo para usuários VIP.");

        if (!args.length) {
            return enviar(`⚠️ Uso correto:\n➤ ${prefix}plaq9 faatal`);
        }

        const texto = encodeURIComponent(args.join(" "));
        const url = `${data.site_apikey}api/plaq9?texto=${texto}&apikey=${data.apikey}`;

        await enviar("✨ Gerando sua plaquinha...");

        const res = await fetch(url);
        const buffer = Buffer.from(await res.arrayBuffer());

        await client.sendMessage(from, {
            image: buffer,
            caption: `😈 Plaquinha gerada com sucesso.`
        }, { quoted: info });

    } catch (err) {
        console.log("PLAQ9 ERROR:", err);
        enviar("❌ Erro ao gerar a plaquinha.");
    }
    break;
}

case "plaq9": {
    try {
if (!vip && !soDono)
    return enviar("🚫 Este comando é exclusivo para usuários VIP.");

        if (!args.length) {
            return enviar(`⚠️ Uso correto:\n➤ ${prefix}plaq10 faatal`);
        }

        const texto = encodeURIComponent(args.join(" "));
        const url = `${data.site_apikey}api/plaq10?texto=${texto}&apikey=${data.apikey}`;

        await enviar("✨ Gerando sua plaquinha...");

        const res = await fetch(url);
        const buffer = Buffer.from(await res.arrayBuffer());

        await client.sendMessage(from, {
            image: buffer,
            caption: `😈 Plaquinha gerada com sucesso.`
        }, { quoted: info });

    } catch (err) {
        console.log("PLAQ10 ERROR:", err);
        enviar("❌ Erro ao gerar a plaquinha.");
    }
    break;
}


case "banirfigu": {
    try {

        if (!isGroup)
            return enviar("❌ Este comando só funciona em grupos.");

        if (!isAdmin && !soDono)
            return enviar("❌ Apenas administradores podem usar.");

        const RSM = info.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const stickerMsg = RSM?.stickerMessage;

        if (!stickerMsg)
            return enviar("⚠️ Marque a figurinha que deseja banir.");

        const hash = Buffer.from(stickerMsg.fileSha256).toString("base64");

        const figuDB = carregarFiguBan();

        if (!figuDB[from]) figuDB[from] = [];

        if (figuDB[from].includes(hash))
            return enviar("⚠️ Esta figurinha já está banida.");

        figuDB[from].push(hash);
        salvarFiguBan(figuDB);

        await reagir("🚫");

        await enviar("🚫 Figurinha banida com sucesso.\nAgora ela será apagada automaticamente.");

    } catch (err) {
        console.log("BANIRFIGU ERROR:", err);
        enviar("❌ Erro ao banir figurinha.");
    }

    break;
}

case "desbanfigu": {
    try {

        if (!isGroup)
            return enviar("❌ Este comando só funciona em grupos.");

        if (!isAdmin && !soDono)
            return enviar("❌ Apenas administradores podem usar.");

        const RSM = info.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const stickerMsg = RSM?.stickerMessage;

        if (!stickerMsg)
            return enviar("⚠️ Marque a figurinha que deseja desbanir.");

        const hash = Buffer.from(stickerMsg.fileSha256).toString("base64");

        const figuDB = carregarFiguBan();

        if (!figuDB[from] || !figuDB[from].includes(hash))
            return enviar("⚠️ Esta figurinha não está banida.");

        figuDB[from] = figuDB[from].filter(h => h !== hash);

        salvarFiguBan(figuDB);

        await reagir("✅");

        await enviar("✅ Figurinha desbanida com sucesso.");

    } catch (err) {
        console.log("DESBANFIGU ERROR:", err);
        enviar("❌ Erro ao desbanir figurinha.");
    }

    break;
}

case 'adverter':
    case 'adv': {
        try {
            // Funções de suporte internas para evitar erro de definição
            const warnPath = "./arquivos/config/avisos.json";
            if (!require('fs').existsSync(warnPath)) require('fs').writeFileSync(warnPath, JSON.stringify({}));
            
            const carregarAvisos = () => JSON.parse(require('fs').readFileSync(warnPath));
            const salvarAvisos = (data) => require('fs').writeFileSync(warnPath, JSON.stringify(data, null, 2));

            if (!isGroup) return enviar("❌ Este comando só pode ser usado em grupos.");
            if (!isAdmin && !soDono) return enviar("❌ Você precisa ser um administrador para usar este comando.");
            
            let user = info.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || 
                       info.message?.extendedTextMessage?.contextInfo?.participant || 
                       (args[0] ? args[0].replace(/\D/g, '') + '@s.whatsapp.net' : '');

            if (!user) return enviar("⚠️ Marque o usuário ou responda a mensagem de quem você deseja adverter.");
            if (user === sender) return enviar("⚠️ Você não pode se adverter.");
            
            let avisosDB = carregarAvisos();
            if (!avisosDB[from]) avisosDB[from] = {};
            if (!avisosDB[from][user]) avisosDB[from][user] = 0;

            avisosDB[from][user] += 1;
            const totalAvisos = avisosDB[from][user];

            if (totalAvisos >= 3) {
                if (!isBotAdmins) {
                    enviar(`⚠️ O membro @${user.split('@')[0]} atingiu 3 avisos, mas não posso removê-lo pois não sou ADM.`);
                } else {
                    await client.groupParticipantsUpdate(from, [user], "remove");
                    await client.sendMessage(from, {
                        text: `🚫 O membro @${user.split('@')[0]} foi removido por atingir o limite de 3 advertências!`,
                        mentions: [user]
                    });
                    delete avisosDB[from][user];
                }
            } else {
                await client.sendMessage(from, {
                    text: `⚠️ *ADVERTÊNCIA* ⚠️\n\n👤 *Membro:* @${user.split('@')[0]}\n👮 *ADM:* @${sender.split('@')[0]}\n📉 *Avisos:* ${totalAvisos}/3\n\nCuidado! Ao atingir 3 avisos você será removido.`,
                    mentions: [user, sender]
                }, { quoted: info });
            }

            salvarAvisos(avisosDB);
            await reagir("⚠️");

        } catch (err) {
            console.log("ERRO ADVERTER:", err);
            enviar("❌ Ocorreu um erro ao processar a advertência.");
        }
    }
    break;

    case 'rmadv':
    case 'removeradv': {
        try {
            const warnPath = "./arquivos/config/avisos.json";
            const carregarAvisos = () => JSON.parse(require('fs').readFileSync(warnPath));
            const salvarAvisos = (data) => require('fs').writeFileSync(warnPath, JSON.stringify(data, null, 2));

            if (!isGroup) return enviar("❌ Este comando só pode ser usado em grupos.");
            if (!isAdmin && !soDono) return enviar("❌ Você precisa ser um administrador.");

            let user = info.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || 
                       info.message?.extendedTextMessage?.contextInfo?.participant || 
                       (args[0] ? args[0].replace(/\D/g, '') + '@s.whatsapp.net' : '');

            if (!user) return enviar("⚠️ Marque o usuário para remover a advertência.");

            let avisosDB = carregarAvisos();
            if (avisosDB[from] && avisosDB[from][user]) {
                avisosDB[from][user] -= 1;
                if (avisosDB[from][user] <= 0) delete avisosDB[from][user];
                
                const totalAvisos = avisosDB[from] && avisosDB[from][user] ? avisosDB[from][user] : 0;
                
                await client.sendMessage(from, {
                    text: `✅ Advertência removida para @${user.split('@')[0]}.\n📉 *Avisos atuais:* ${totalAvisos}/3`,
                    mentions: [user]
                }, { quoted: info });
                
                salvarAvisos(avisosDB);
                await reagir("✅");
            } else {
                enviar("❌ Este usuário não possui advertências neste grupo.");
            }

        } catch (err) {
            console.log("ERRO UNADV:", err);
            enviar("❌ Ocorreu um erro.");
        }
    }
    break;

case 'promover': {
    try {
        if (!isGroup) return enviar("❌ Este comando só pode ser usado em grupos.");
        if (!isAdmin && !soDono) return enviar("❌ Você precisa ser um administrador para usar este comando.");
        if (!isBotAdmins) return enviar("❌ Eu preciso ser administrador para promover alguém.");

        let users = info.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || 
                    info.message?.extendedTextMessage?.contextInfo?.participant || 
                    (args[0] ? args[0].replace(/\D/g, '') + '@s.whatsapp.net' : '');

        if (!users) return enviar("⚠️ Marque o usuário ou responda a mensagem de quem você deseja promover.");

        await client.groupParticipantsUpdate(from, [users], "promote");
        
        const nomePromovido = `@${users.split('@')[0]}`;
        const nomeAdm = `@${sender.split('@')[0]}`;

        await client.sendMessage(from, {
            text: `✅ O membro ${nomePromovido} foi promovido a *ADMINISTRADOR* com sucesso pelo ADM ${nomeAdm}!`,
            mentions: [users, sender]
        }, { quoted: info });


    } catch (err) {
        console.log("ERRO PROMOVER:", err);
        enviar("❌ Ocorreu um erro ao tentar promover o usuário.");
    }
}
break;

case 'rebaixar': {
    try {
        if (!isGroup) return enviar("❌ Este comando só pode ser usado em grupos.");
        if (!isAdmin && !soDono) return enviar("❌ Você precisa ser um administrador para usar este comando.");
        if (!isBotAdmins) return enviar("❌ Eu preciso ser administrador para rebaixar alguém.");

        let users = info.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || 
                    info.message?.extendedTextMessage?.contextInfo?.participant || 
                    (args[0] ? args[0].replace(/\D/g, '') + '@s.whatsapp.net' : '');

        if (!users) return enviar("⚠️ Marque o usuário ou responda a mensagem de quem você deseja rebaixar.");

        await client.groupParticipantsUpdate(from, [users], "demote");
        
        const nomeRebaixado = `@${users.split('@')[0]}`;
        const nomeAdm = `@${sender.split('@')[0]}`;

        await client.sendMessage(from, {
            text: `⬇️ O membro ${nomeRebaixado} foi rebaixado a *MEMBRO COMUM* com sucesso pelo ADM ${nomeAdm}!`,
            mentions: [users, sender]
        }, { quoted: info });


    } catch (err) {
        console.log("ERRO REBAIXAR:", err);
        enviar("❌ Ocorreu um erro ao tentar rebaixar o usuário.");
    }
}
break;

case "alg": {
    if (!isGroup) return;
    if (!soDono) return;

    const opcao = args[0];
    let gruposAlugados = lerAluguel();

    // 🔥 pega nome do grupo
    const metadata = await client.groupMetadata(from);
    const nomeGrupo = metadata.subject;

    if (opcao === "1") {

        if (!gruposAlugados.includes(from)) {
            gruposAlugados.push(from);
            salvarAluguel(gruposAlugados);
        }

        await client.sendMessage(sender, {
            text: `🏷️ Aluguel ativado com sucesso no grupo:\n📌 ${nomeGrupo}`
        });

    } else if (opcao === "0") {

        gruposAlugados = gruposAlugados.filter(g => g !== from);
        salvarAluguel(gruposAlugados);

        await client.sendMessage(sender, {
            text: `🔓 Aluguel desativado no grupo:\n📌 ${nomeGrupo}`
        });
    }

    break;
}


case 'togif':
case 'tovideo': {
    const RSM = info.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    const msgSticker = RSM?.stickerMessage || info.message?.stickerMessage;

    if (!msgSticker) return enviar('⚠️ Responda a uma figurinha animada.');
    if (msgSticker.isAnimated === false) return enviar('⚠️ Este comando funciona apenas com figurinhas animadas.');

    // 🔄 Mensagem de espera
    const msgAguarde = await enviar('💓 Convertendo figurinha em GIF...');

    try {
        const fs = require('fs').promises;
        const fsSync = require('fs');
        const path = require('path');
        const { exec } = require('child_process');

        const tmpDir = path.resolve(__dirname, 'tmp');
        if (!fsSync.existsSync(tmpDir)) {
            fsSync.mkdirSync(tmpDir, { recursive: true });
        }

        const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
        const stream = await downloadContentFromMessage(msgSticker, 'sticker');
        
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }

        if (!buffer || buffer.length === 0) {
            return enviar("⚠️ Não consegui baixar a figurinha.");
        }

        const nomeArquivo = `convert_${Date.now()}`;
        const tempWebp = path.join(tmpDir, `${nomeArquivo}.webp`);
        const tempMp4 = path.join(tmpDir, `${nomeArquivo}.mp4`);

        await fs.writeFile(tempWebp, buffer);

        const complexCmd = `ffmpeg -y -vcodec libwebp -i "${tempWebp}" -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" -movflags +faststart "${tempMp4}"`;

        exec(complexCmd, async (err) => {
            if (err) {
                const tempGif = path.join(tmpDir, `${nomeArquivo}.gif`);
                const magickCmd = `magick "${tempWebp}" "${tempGif}" && ffmpeg -y -i "${tempGif}" -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" "${tempMp4}"`;
                
                exec(magickCmd, async (err2) => {
                    if (err2) {
                        console.error("CONVERSION FAILED:", err2);
                        if (fsSync.existsSync(tempWebp)) fsSync.unlinkSync(tempWebp);
                        return enviar('❌ Erro crítico na conversão.\n\n💡 Execute no Termux:\n`pkg install ffmpeg imagemagick webp-tools`');
                    }
                    await sendConvertedVideo();
                });
            } else {
                await sendConvertedVideo();
            }

            async function sendConvertedVideo() {
                try {
                    if (fsSync.existsSync(tempMp4)) {
                        const videoBuffer = await fs.readFile(tempMp4);
                        await client.sendMessage(from, { 
                            video: videoBuffer, 
                            gifPlayback: true,
                           
                        }, { quoted: info });
                    }
                } catch (e) {}

                setTimeout(async () => {
                    [tempWebp, tempMp4, path.join(tmpDir, `${nomeArquivo}.gif`)].forEach(f => {
                        if (fsSync.existsSync(f)) fsSync.unlinkSync(f);
                    });
                }, 2000);
            }
        });

    } catch (e) {
        enviar('❌ Erro interno na conversão.');
    }
}
break;


case "toimg": {
try {

const RSM = info.message?.extendedTextMessage?.contextInfo?.quotedMessage;
const stickerMsg = RSM?.stickerMessage;

if (!stickerMsg)
return enviar("⚠️ Marque uma figurinha para converter.");

await enviar("*Transformando em imagem!!⚡*");

const buffer = await getFileBuffer(stickerMsg, "sticker");

const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

// 🔥 usa a pasta tmp do seu projeto
const inputPath = path.join(process.cwd(), "tmp", `${Date.now()}.webp`);
const outputPath = path.join(process.cwd(), "tmp", `${Date.now()}.png`);

fs.writeFileSync(inputPath, buffer);

exec(
`ffmpeg -i "${inputPath}" "${outputPath}"`,
async (err) => {

if (err) {
console.log(err);
return enviar("❌ Erro ao converter.");
}

const imgBuffer = fs.readFileSync(outputPath);

// limpa arquivos
fs.unlinkSync(inputPath);
fs.unlinkSync(outputPath);

await client.sendMessage(from, {
image: imgBuffer,
}, { quoted: info });

}
);

} catch (err) {

console.log("TOIMG ERROR:", err);
enviar("❌ Falha na conversão.");

}

break;
}

case "fotoperfil":
case "pfp": {
try {

// 🔎 Se marcou alguém usa o marcado
const alvo =
info.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] ||
sender;

let pfpUrl;

try {
pfpUrl = await client.profilePictureUrl(alvo, "image");
} catch {
return enviar("⚠️ Este usuário não possui foto de perfil.");
}

// 📥 Baixa imagem
const response = await fetch(pfpUrl);
const buffer = Buffer.from(await response.arrayBuffer());

// 🏷 Nome da pessoa
const nome = alvo === sender
? (info.pushName || "Usuário")
: `@${alvo.split("@")[0]}`;

// 🚀 Envia no grupo
await client.sendMessage(from, {
image: buffer,
caption: `📸 Foto de perfil de ${nome}`,
mentions: [alvo]
}, { quoted: info });

} catch (err) {

console.log("FOTOPERFIL ERROR:", err);
enviar("❌ Erro ao pegar foto de perfil.");

}

break;
}

case "figuperfil":
case "fperfil": {
try {

await reagir("📸");

// 🔎 Se marcou alguém usa a pessoa marcada
const alvo =
info.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] ||
sender;

let ppUrl;

try {
ppUrl = await client.profilePictureUrl(alvo, "image");
} catch {
return enviar("⚠️ Este usuário não possui foto de perfil.");
}

// 📥 Baixa a imagem
const response = await fetch(ppUrl);
const imgBuffer = Buffer.from(await response.arrayBuffer());

// 🏷 Pack personalizado
const pack = "𝑷𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚 𝑭𝒂𝒂𝒕𝒂𝒍 𝑴𝑫";

await sendImageAsSticker2(client, from, imgBuffer, info, {
packname: pack,
author: "⚝"
});


} catch (err) {

console.log("FIGU PERFIL ERROR:", err);
enviar("❌ Erro ao criar figurinha.");

}

break;
}

case "add": {
try {

if (!isGroup) return enviar("❌ Este comando funciona apenas em grupos.");
if (!isAdmin && !soDono) return;

if (!text) return enviar("❌ Informe o número para adicionar.");

await reagir("➕");

// 🔹 remove tudo que não for número
let numero = text.replace(/\D/g, "");

// 🔹 se não começar com 55, adiciona
if (!numero.startsWith("55")) {
numero = "55" + numero;
}

const jid = numero + "@s.whatsapp.net";

// 🔹 verifica direto no WhatsApp
const check = await client.onWhatsApp(jid);

if (!check || !check[0]?.exists)
return enviar("❌ O WhatsApp não reconheceu este número.");

// 🔹 tenta adicionar
await client.groupParticipantsUpdate(from, [jid], "add");

await client.sendMessage(from, {
text: `✅ O número ${numero} foi adicionado com sucesso.`
}, { quoted: info });

} catch (err) {

console.log("ADD ERROR:", err);
enviar("❌ Não foi possível adicionar o número.");

}

break;
}

case "mutar": {
try {

if (!isGroup) return enviar("❌ Este comando funciona apenas em grupos.");
if (!isAdmin && !soDono) return;

const alvo =
info.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

if (!alvo) return enviar("❌ Marque o usuário que deseja mutar.");

const db = carregarMutes();

if (!db[from]) db[from] = [];

// ✅ já está mutado
if (db[from].includes(alvo)) {
return client.sendMessage(from, {
text:
`⚠️ @${alvo.split("@")[0]} já está mutado.`,
mentions: [alvo]
}, { quoted: info });
}

// adiciona mute
db[from].push(alvo);
salvarMutes(db);

await client.sendMessage(from, {
text: `🔇 O usuário @${alvo.split("@")[0]} foi mutado com sucesso.`,
mentions: [alvo]
}, { quoted: info });

} catch (err) {
console.log("MUTE ERROR:", err);
enviar("❌ Não foi possível aplicar o mute.");
}

break;
}

case "desmutar": {
try {

if (!isGroup) return enviar("❌ Este comando funciona apenas em grupos.");
if (!isAdmin && !soDono) return;

const alvo =
info.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

if (!alvo) return enviar("❌ Marque o usuário que deseja desmutar.");

const db = carregarMutes();

if (!db[from] || !db[from].includes(alvo)) {
return enviar("⚠️ Este usuário não está mutado.");
}

db[from] = db[from].filter(u => u !== alvo);
salvarMutes(db);

await client.sendMessage(from, {
text: `🔊 O usuário @${alvo.split("@")[0]} foi desmutado com sucesso.`,
mentions: [alvo]
}, { quoted: info });

} catch (err) {
console.log("UNMUTE ERROR:", err);
enviar("❌ Não foi possível remover o mute.");
}

break;
}

case "ban": {
try {

if (!isGroup) return enviar("❌ Só funciona em grupo.");
if (!isAdmin && !soDono) return;

// ━━━━━━━━━━━━━━━━━━━
// 📂 LÊ CONFIG DO DONO
// ━━━━━━━━━━━━━━━━━━━
const fs = require("fs");

const configPath = "./dono/config/data.json";
if (!fs.existsSync(configPath)) {
    return enviar("❌ Arquivo de configuração não encontrado.");
}

const dataConfig = JSON.parse(fs.readFileSync(configPath));

const LidDono = String(dataConfig.LidDono || "").replace(/\D/g, "");
const LidBot = String(dataConfig.LidBot || "").replace(/\D/g, "");

// ━━━━━━━━━━━━━━━━━━━
// 🎯 PEGA USUÁRIO (MARCAÇÃO OU RESPOSTA)
// ━━━━━━━━━━━━━━━━━━━

let alvo = null;

// 1️⃣ Se marcou alguém
alvo = info.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

// 2️⃣ Se respondeu mensagem
if (!alvo) {
    alvo = info.message?.extendedTextMessage?.contextInfo?.participant;
}

if (!alvo) return enviar("❌ Marque ou responda a mensagem da pessoa.");

const numeroAlvo = alvo.split("@")[0].replace(/\D/g, "");

// ━━━━━━━━━━━━━━━━━━━
// 🛡 PROTEÇÃO DONO E BOT
// ━━━━━━━━━━━━━━━━━━━
if (numeroAlvo === LidDono) {
    return enviar("🚫 Você não pode banir meu dono.");
}

if (numeroAlvo === LidBot) {
    return enviar("🚫 Eu não posso me banir né.");
}

// ━━━━━━━━━━━━━━━━━━━
// 🔥 REMOVE
// ━━━━━━━━━━━━━━━━━━━
await client.groupParticipantsUpdate(from, [alvo], "remove");

await client.sendMessage(from, {
    text: `✅ @${numeroAlvo} foi removido com sucesso.`,
    mentions: [alvo]
}, { quoted: info });

} catch (err) {

console.log("BAN ERROR:", err);
enviar("❌ Falha ao remover.");

}

break;
}


case "gerarcpf": {
try {

await reagir("🧾");

// gera 9 dígitos base
let n = [];
for (let i = 0; i < 9; i++)
n.push(Math.floor(Math.random() * 10));

// dígito 1
let d1 = 0;
for (let i = 0; i < 9; i++)
d1 += n[i] * (10 - i);

d1 = (d1 * 10) % 11;
if (d1 === 10) d1 = 0;

// dígito 2
let d2 = 0;
for (let i = 0; i < 9; i++)
d2 += n[i] * (11 - i);

d2 += d1 * 2;
d2 = (d2 * 10) % 11;
if (d2 === 10) d2 = 0;

// monta e formata
const cpf = `${n.join("")}${d1}${d2}`;
const formatado = cpf.replace(
/(\d{3})(\d{3})(\d{3})(\d{2})/,
"$1.$2.$3-$4"
);

// envia
await enviar(`🧾 CPF gerado:\n${formatado}`);

} catch (err) {

console.log("CPF ERROR:", err);
enviar("❌ erro");

}

break;
}

case 'criargp': {
    try {
        if (!soDono) 
            return enviar("❌ Você precisa ser um administrador ou o dono para usar este comando.");

        const nomeDoGrupo = args.join(" ");
        if (!nomeDoGrupo) 
            return enviar("⚠️ Por favor, forneça o nome do grupo que deseja criar.");

       
        await client.sendMessage(from, {
            react: { text: "🚀", key: info.key }
        });

        let participantesG = [];

        if (info.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
            participantesG = info.message.extendedTextMessage.contextInfo.mentionedJid;
        }

       
        const group = await client.groupCreate(nomeDoGrupo, participantesG);

       
        const inviteCode = await client.groupInviteCode(group.id);
        const linkGrupo = `https://chat.whatsapp.com/${inviteCode}`;

       
        await client.sendMessage(from, {
            text: `✅ *GRUPO CRIADO COM SUCESSO!*\n\n📛 Nome: *${nomeDoGrupo}*\n🔗 Link: ${linkGrupo}`
        }, { quoted: info });

    } catch (err) {
        console.log("ERRO CRIARGP:", err);
        enviar("❌ Ocorreu um erro ao tentar criar o grupo.");
    }
}
break;


case 'gerarlink': {
    try {
        const axios = require('axios');
        const FormData = require('form-data');

        const RSM = info.message?.extendedTextMessage?.contextInfo?.quotedMessage;

        const image =
            RSM?.imageMessage ||
            info.message?.imageMessage ||
            RSM?.viewOnceMessageV2?.message?.imageMessage ||
            info.message?.viewOnceMessageV2?.message?.imageMessage;

        if (!image)
            return enviar("📸 Envie ou marque uma imagem.");

        // reação enquanto gera
        await client.sendMessage(from, {
            react: {
                text: "🔗",
                key: info.key
            }
        });

        const buffer = await getFileBuffer(image, 'image');

        const form = new FormData();
        form.append("files[]", buffer, "imagem.jpg");

        const { data } = await axios.post(
            "https://uguu.se/upload.php",
            form,
            { headers: form.getHeaders() }
        );

        const link = data.files[0].url;

        enviar(`✅ Link gerado com sucesso:\n${link}`);

    } catch (err) {
        console.log("IMG LINK ERROR:", err);
        enviar("❌ Erro ao gerar o link.");
    }
}
break;


case 'rename':
case 'renomear': {
    // 🛡️ Captura o texto e remove espaços inúteis
    let textoDigitado = info.message?.extendedTextMessage?.text?.split(' ').slice(1).join(' ') || 
                        info.message?.conversation?.split(' ').slice(1).join(' ') || "";
    
    textoDigitado = textoDigitado.trim();

    // Limpa o comando se ele vier repetido no texto por causa do espaço após o prefixo
    let q = textoDigitado.replace(/^(rename|renomear)\s+/i, "").trim();

    const RSM = info.message?.extendedTextMessage?.contextInfo?.quotedMessage
    const stickerMsg = RSM?.stickerMessage

    if (!stickerMsg) return enviar('⚠️ Marque uma figurinha para que eu possa renomear.')

    // ✨ Guia de uso atualizado com a barra /
    if (!q) {
        const helpText = `📝 *GUIA DE RENOMEAÇÃO* 📝\n\n` +
                         `💡 *Exemplo de uso:* \n` +
                         `➜ \`${prefix}rename Faatal / MD\`\n\n` +
                         `✨ *Ou use apenas:* \n` +
                         `➜ \`${prefix}rename Faatal\``;
        return enviar(helpText);
    }

    // ✂️ Agora o separador é a barra /
    const [pack, author] = q.split('/').map(v => v.trim())

    await reagir('🏷️')

    try {
        const mediaBuffer = await getFileBuffer(stickerMsg, 'sticker')
        const WebP = require('node-webpmux')
        const img = new WebP.Image()

        const json = { 
            "sticker-pack-id": `faatal-rename-${Date.now()}`, 
            "sticker-pack-name": pack, 
            "sticker-pack-publisher": author || "" 
        }

        const exifAttr = Buffer.from([0x49,0x49,0x2A,0x00,0x08,0x00,0x00,0x00,0x01,0x00,0x41,0x57,0x07,0x00,0x00,0x00,0x00,0x00,0x16,0x00,0x00,0x00])
        const jsonBuffer = Buffer.from(JSON.stringify(json), "utf-8")
        const exif = Buffer.concat([exifAttr, jsonBuffer])
        exif.writeUIntLE(jsonBuffer.length, 14, 4)

        await img.load(mediaBuffer)
        img.exif = exif
        const stickerFinal = await img.save(null)

        await client.sendMessage(from, { sticker: stickerFinal }, { quoted: info })
        await reagir('✅')

    } catch (e) {
        console.error(e)
        enviar('❌ Erro ao processar a figurinha.')
    }
}
break


case 'take':
case 'wm': {
    const RSM = info.message?.extendedTextMessage?.contextInfo?.quotedMessage
    const stickerMsg = RSM?.stickerMessage

    // Verifica se há uma figurinha marcada
    if (!stickerMsg) return enviar('⚠️ Marque uma figurinha para eu renomear.')

    // Reação silenciosa de processamento
    await reagir('✂️')

    try {
        const packName = info.pushName || 'Usuário'
        const mediaBuffer = await getFileBuffer(stickerMsg, 'sticker')

        const WebP = require('node-webpmux')
        const img = new WebP.Image()
        
        const json = { 
            "sticker-pack-id": `faatal-${Date.now()}`, 
            "sticker-pack-name": packName, 
            "sticker-pack-publisher": "" 
        }

        const exifAttr = Buffer.from([
            0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 
            0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 
            0x00, 0x00, 0x16, 0x00, 0x00, 0x00
        ])

        const jsonBuffer = Buffer.from(JSON.stringify(json), "utf-8")
        const exif = Buffer.concat([exifAttr, jsonBuffer])
        exif.writeUIntLE(jsonBuffer.length, 14, 4)

        await img.load(mediaBuffer)
        img.exif = exif
        
        const stickerFinal = await img.save(null)

        // Envio com painel de créditos limpo
        await client.sendMessage(from, { 
            sticker: stickerFinal,
            contextInfo: {
                externalAdReply: {
                    title: `『 🌹 By: ${packName.toUpperCase()} 』`,
                    body: `✅ Figurinha Renomeada!`,
                    previewType: "PHOTO",
                    thumbnail: mediaBuffer, 
                    showAdAttribution: false,
                    sourceUrl: "" 
                }
            }
        }, { quoted: info })

        await reagir('✅')

    } catch (e) {
        console.error("Erro no Take:", e)
        await reagir('❌')
    }
}
break


case 'revelar':
case 'readviewonce': {
    if (!soDono) return enviar('⚠️ Este comando é restrito ao meu mestre.')

    // Pega a mensagem marcada (quoted)
    const q = info.message?.extendedTextMessage?.contextInfo?.quotedMessage
    
    // Procura a mídia de visualização única em todos os lugares possíveis (v2 e extensões)
    const viewOnce = q?.viewOnceMessageV2?.message || 
                     q?.viewOnceMessage?.message || 
                     q?.viewOnceMessageV2Extension?.message ||
                     q 
    
    const image = viewOnce?.imageMessage
    const video = viewOnce?.videoMessage
    
    if (!image && !video) return enviar('⚠️ Marque uma imagem ou vídeo de visualização única.')

    await reagir('👁️')

    try {
        const type = image ? 'image' : 'video'
        const mediaData = image || video

        // 📥 Download com qualidade máxima
        const buffer = await getFileBuffer(mediaData, type)

        // 🚀 Envio da legenda da foto 
        if (type === 'image') {
            await client.sendMessage(from, { 
                image: buffer, 
                caption: `✅ *imagem revelada com sucesso*` 
            }, { quoted: info })
        } else {
            await client.sendMessage(from, { 
                video: buffer, 
                caption: `✅ *imagem revelada com sucesso*` 
            }, { quoted: info })
        }

        await reagir('✅')
    } catch (e) {
        console.log("Erro ao revelar:", e)
        enviar('❌ Erro técnico ao processar a mídia.')
    }
}
break



case 'g': { // Comando autoritário adaptado
    if (!soDono) return enviar('⚠️ Apenas o dono pode usar este comando, mortal.')

    const RSM = info.message?.extendedTextMessage?.contextInfo?.quotedMessage
    const stickerMsg = RSM?.stickerMessage
    if (!stickerMsg) return enviar('⚠️ Marque uma figurinha para transformar, mestre.')

    await reagir('⏳')

    try {
        // 📥 DOWNLOAD usando a função nativa do seu bot
        const mediaBuffer = await getFileBuffer(stickerMsg, 'sticker')

        const WebP = require('node-webpmux')
        const webpMaker = new WebP.Image()

        // 🧠 Pack + assinatura 
        const packName = "🚬 𝚁𝚘𝚞𝚋𝚊 𝚗ã𝚘 𝚜𝚞𝚊 𝚙𝚞𝚝𝚒𝚗𝚑𝚊! 𝙸'𝚖 𝚏𝚊𝚊𝚝𝚊𝚕!"
        const megaEspaco = "\u200B\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n".repeat(12000) 

        const json = { 
            "sticker-pack-id": `abyss-${Date.now()}`, 
            "sticker-pack-name": packName,
            "sticker-pack-publisher": megaEspaco
        }

        // 🧩 EXIF CORRETO (O seu modelo original)
        const exifAttr = Buffer.from([
            0x49,0x49,0x2A,0x00,0x08,0x00,0x00,0x00,
            0x01,0x00,0x41,0x57,0x07,0x00,0x00,0x00,
            0x00,0x00,0x16,0x00,0x00,0x00
        ])

        const jsonBuffer = Buffer.from(JSON.stringify(json), "utf-8")
        const exif = Buffer.concat([exifAttr, jsonBuffer])
        exif.writeUIntLE(jsonBuffer.length, 14, 4)

        await webpMaker.load(mediaBuffer)
        webpMaker.exif = exif

        // 🚀 Criando o buffer final e enviando
        const stickerFinal = await webpMaker.save(null)

        await client.sendMessage(from, { sticker: stickerFinal }, { quoted: info })
        await reagir('✅')

    } catch (e) {
        console.log(e)
        enviar('❌ Falha ao processar os metadados da figurinha.')
    }
}
break

case 'corno': {
    if (!isGroup) return reply("🤠 Esse comando só funciona em grupo.");

    if (!mentioned[0]) 
        return reply("🤠 Marca alguém pra revelar a verdade.");

    const alvo = mentioned[0];

    // 👑 PROTEÇÃO DO DONO
    const lidDono = String(data.LidDono).replace(/\D/g, '');
    const lidAlvo = alvo.split("@")[0].replace(/\D/g, '');

    if (lidAlvo === lidDono) {
        const frasesProtecao = [
            "👑 O dono não entra nessas estatísticas.",
            "🛑 Análise bloqueada. Usuáro supremo.",
            "👑 Isso não se aplica ao criador.",
            "⚠️ Hierarquia detectada. Ação cancelada.",
            "✨ O supremo está acima disso."
        ];
        return reply(frasesProtecao[Math.floor(Math.random() * frasesProtecao.length)]);
    }

    // 🤠 REAÇÃO IMEDIATA
    await client.sendMessage(from, {
        react: { text: "🤠", key: info.key }
    });

    // 🔍 MENSAGEM INICIAL
    const mensagensBusca = [
        "🔍 Investigando histórico amoroso...",
        "🤠 Verificando sinais suspeitos...",
        "👀 Observando movimentações estranhas...",
        "📡 Rastreando possíveis traições...",
        "🕵️ Analisando comportamentos duvidosos..."
    ];

    await client.sendMessage(from, {
        text: mensagensBusca[Math.floor(Math.random() * mensagensBusca.length)]
    }, { quoted: info });

    await new Promise(resolve => setTimeout(resolve, 1300));

    const porcentagem = Math.floor(Math.random() * 101);
    let diagnostico = "";

    // 🔵 0–20%
    if (porcentagem <= 20) {
        const frases = [
            "😎 Nenhum sinal detectado.",
            "🧊 Pode dormir tranquilo.",
            "✅ Tudo sob controle."
        ];
        diagnostico = frases[Math.floor(Math.random() * frases.length)];
    }

    // 🟢 21–50%
    else if (porcentagem <= 50) {
        const frases = [
            "👀 Alguns sinais estranhos...",
            "🤔 Melhor ficar atento.",
            "📱 Movimentações suspeitas detectadas."
        ];
        diagnostico = frases[Math.floor(Math.random() * frases.length)];
    }

    // 🟡 51–80%
    else if (porcentagem <= 80) {
        const frases = [
            "⚠️ Algo estranho está acontecendo.",
            "😬 Indícios preocupantes encontrados.",
            "👀 Melhor investigar melhor."
        ];
        diagnostico = frases[Math.floor(Math.random() * frases.length)];
    }

    // 🔴 81–99%
    else if (porcentagem <= 99) {
        const frases = [
            "🚨 ALERTA 🚨 Situação extremamente suspeita.",
            "💔 Grandes chances de sofrimento.",
            "📡 Evidências comprometedoras detectadas."
        ];
        diagnostico = frases[Math.floor(Math.random() * frases.length)];
    }

    // ☠️ 100%
    else {
        const frases = [
            "☠️ Caso confirmado.",
            "🤠 Pode comprar o chapéu.",
            "💀 Situação irreversível."
        ];
        diagnostico = frases[Math.floor(Math.random() * frases.length)];
    }

    const textoFinal =
`┏━━━ 🤠 𝐃𝐄𝐓𝐄𝐂𝐓𝐎𝐑 𝐃𝐄 𝐂𝐎𝐑𝐍𝐎 🤠 ━━━┓

👤 Alvo analisado: @${lidAlvo}
📊 Nível de chifre: *${porcentagem}%*

🧠 Diagnóstico:
${diagnostico}

┗━━━━━━━━━━━━━━━━━━┛`;

    const caminhoImagem = "./arquivos/fotos/corno.jpg";

    try {
        if (fs.existsSync(caminhoImagem)) {
            await client.sendMessage(from, {
                image: fs.readFileSync(caminhoImagem),
                caption: textoFinal,
                mentions: [alvo]
            }, { quoted: info });
        } else {
            await client.sendMessage(from, {
                text: textoFinal,
                mentions: [alvo]
            }, { quoted: info });
        }
    } catch {
        await client.sendMessage(from, {
            text: textoFinal,
            mentions: [alvo]
        }, { quoted: info });
    }
}
break;


case 'gado': {
    if (!isGroup) return reply("🐂 Esse comando só funciona em grupo.");

    if (!mentioned[0]) 
        return reply("🐂 Marca alguém pra medir o nível de gadice.");

    const alvo = mentioned[0];

    // 👑 PROTEÇÃO SUPREMA VIA LID
    const lidDono = String(data.LidDono).replace(/\D/g, '');
    const lidAlvo = alvo.split("@")[0].replace(/\D/g, '');

    if (lidAlvo === lidDono) {
        const frasesMestre = [
            "👑 Você não pode marcar meu mestre.",
            "🛑 O supremo está acima da gadice.",
            "👑 Gadice não se aplica ao criador.",
            "⚠️ Hierarquia detectada. Ação cancelada.",
            "🧊 Frio demais pra ser gado."
        ];
        return reply(frasesMestre[Math.floor(Math.random() * frasesMestre.length)]);
    }

    // 🐂 REAÇÃO IMEDIATA
    await client.sendMessage(from, {
        react: {
            text: "🐂",
            key: info.key
        }
    });

    // 🔍 MENSAGEM INICIAL
    const mensagensBusca = [
        "🔍 Detectando nível de gado...",
        "🐂 Analisando comportamento emocional...",
        "📡 Escaneando sinais de gadice...",
        "👀 Observando nível de apego...",
        "🧠 Calculando intensidade sentimental..."
    ];

    await client.sendMessage(from, {
        text: mensagensBusca[Math.floor(Math.random() * mensagensBusca.length)]
    }, { quoted: info });

    await new Promise(resolve => setTimeout(resolve, 1200));

    const porcentagem = Math.floor(Math.random() * 101);
    let frase = "";

    // 🔵 0–10%
    if (porcentagem <= 10) {
        const frases = [
            "😎 Zero emoção. Essa pessoa não se apega fácil.",
            "🧊 Frio e calculista. Gadice inexistente.",
            "📵 Visualiza e responde quando quer."
        ];
        frase = frases[Math.floor(Math.random() * frases.length)];
    }

    // 🟢 11–30%
    else if (porcentagem <= 30) {
        const frases = [
            "🙂 Leve interesse, mas nada preocupante.",
            "👀 Observa de longe, sem se humilhar.",
            "📱 Responde rápido às vezes, mas mantém pose."
        ];
        frase = frases[Math.floor(Math.random() * frases.length)];
    }

    // 🟡 31–60%
    else if (porcentagem <= 60) {
        const frases = [
            "😏 Já manda bom dia personalizado.",
            "💬 Fica online esperando resposta sim.",
            "📸 Curtiu foto antiga e fingiu demência."
        ];
        frase = frases[Math.floor(Math.random() * frases.length)];
    }

    // 🟠 61–85%
    else if (porcentagem <= 85) {
        const frases = [
            "🐂 Já faz pix sem pedir explicação.",
            "🍔 Compra lanche e fala que não foi nada.",
            "⚡ Responde em 0.2 segundos."
        ];
        frase = frases[Math.floor(Math.random() * frases.length)];
    }

    // 🔴 86–99%
    else if (porcentagem <= 99) {
        const frases = [
            "🚨 ALERTA 🚨 Vive em função da pessoa.",
            "💳 Já parcelou presente em 12x.",
            "📞 Se a pessoa espirra, já pergunta se tá bem."
        ];
        frase = frases[Math.floor(Math.random() * frases.length)];
    }

    // ☠️ 100%
    else {
        const frases = [
            "☠️ 100% GADO ☠️ Dignidade perdida.",
            "🐄 Está oficialmente pastando.",
            "🚑 Caso irreversível."
        ];
        frase = frases[Math.floor(Math.random() * frases.length)];
    }

    const textoFinal =
`┏━━━ 🐂 𝐃𝐄𝐓𝐄𝐂𝐓𝐎𝐑 𝐃𝐄 𝐆𝐀𝐃𝐎 🐂 ━━━┓

👤 Alvo analisado: @${lidAlvo}
📊 Nível de gado: *${porcentagem}%*

🧠 Diagnóstico:
${frase}

┗━━━━━━━━━━━━━━━━━━┛`;

    const caminhoImagem = "./arquivos/fotos/gado.jpg";

    try {
        if (fs.existsSync(caminhoImagem)) {
            await client.sendMessage(from, {
                image: fs.readFileSync(caminhoImagem),
                caption: textoFinal,
                mentions: [alvo]
            }, { quoted: info });
        } else {
            await client.sendMessage(from, {
                text: textoFinal,
                mentions: [alvo]
            }, { quoted: info });
        }
    } catch (e) {
        await client.sendMessage(from, {
            text: textoFinal,
            mentions: [alvo]
        }, { quoted: info });
    }
}
break;

	case 's':
case 'sticker':
case 'f': {
    try {
        const fs = require('fs').promises;
        const fsSync = require('fs');
        const path = require('path');
        const { exec } = require('child_process');

        const tmpDir = path.resolve(__dirname, 'tmp');
        if (!fsSync.existsSync(tmpDir)) {
            fsSync.mkdirSync(tmpDir, { recursive: true });
        }

        const pack = data.NomeBot || "Faatal MD";
        const author = data.NickDono || "Sistema";

        const RSM = info.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const image = RSM?.imageMessage || info.message?.imageMessage || RSM?.viewOnceMessageV2?.message?.imageMessage;
        const video = RSM?.videoMessage || info.message?.videoMessage || RSM?.viewOnceMessageV2?.message?.imageMessage; // Ajustado para pegar video também em viewOnce

        // 🖼️ FIGURINHA DE IMAGEM
        if (image) {
           await enviar("🧸 Gerando figurinha...");  
            
            const buffer = await getFileBuffer(image, 'image');
            await sendImageAsSticker2(client, from, buffer, info, { 
                packname: pack, 
                author: author 
            });
            return;
        }

        // 🎞️ FIGURINHA ANIMADA
        if (video || (RSM?.videoMessage || info.message?.videoMessage)) {
            const videoData = video || RSM?.videoMessage || info.message?.videoMessage;
            
            if (videoData.seconds > 10)
                return enviar("⚠️ O vídeo deve ter no máximo 10 segundos.");

            
            await enviar("🧸 Gerando figurinha animada...");  

            const { downloadContentFromMessage } = require('@whiskeysockets/baileys');  
            const stream = await downloadContentFromMessage(videoData, 'video');  
              
            let buffer = Buffer.from([]);  
            for await (const chunk of stream) {  
                buffer = Buffer.concat([buffer, chunk]);  
            }  

            if (!buffer || buffer.length === 0) {  
                return enviar("⚠️ Não consegui baixar o vídeo. Tente reenviar.");  
            }  

            // Usamos a função utilitária que já lida com metadados para vídeos
            // Isso é muito mais limpo e garante que o Pack Name/Author funcione
            if (typeof sendVideoAsSticker2 === 'function') {
                await sendVideoAsSticker2(client, from, buffer, info, { 
                    packname: pack, 
                    author: author 
                });
            } else {
               
                const nomeArquivo = `sticker_${Date.now()}`;  
                const tempVideo = path.join(tmpDir, `${nomeArquivo}.mp4`);  
                await fs.writeFile(tempVideo, buffer);
                
                
                await sendVideoAsSticker2(client, from, tempVideo, info, { 
                    packname: pack, 
                    author: author 
                });
            }
            return;
        }

        enviar(`⚠️ Marque uma imagem ou vídeo de até 10 segundos com ${prefix}${comando}`);  

    } catch (e) {
        console.log("STICKER CASE ERROR:", e);
        enviar("❌ Ocorreu um erro interno ao processar a figurinha.");
    }
    break;
}

    



case "tmadms": {
try {

if (!isGroup)
return enviar("❌ Use apenas em grupos.");

const mensagem = args.join(" ").trim();

if (!mensagem)
return enviar(`📌 Uso:\n${prefix}tmadms sua mensagem`);

await reagir("🚨");

//━━━━━━━━━━━━━━━━━━
// 📌 PEGAR ADMINS
//━━━━━━━━━━━━━━━━━━

const metadata = await client.groupMetadata(from);

const admins = metadata.participants
.filter(p => p.admin !== null);

if (!admins.length)
return enviar("❌ Nenhum admin encontrado.");

const mentions = admins.map(a => a.id);

//━━━━━━━━━━━━━━━━━━
// 👤 SOLICITANTE
//━━━━━━━━━━━━━━━━━━

const solicitante = info.pushName || "Usuário";

//━━━━━━━━━━━━━━━━━━
// 🎨 LAYOUT
//━━━━━━━━━━━━━━━━━━

const texto =
`╭━━━〔 🚨 ATENÇÃO ADMS 〕━━━╮
┃
┃ 📝 ${mensagem}
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯
> chamado administrativo`;

//━━━━━━━━━━━━━━━━━━
// 🚀 ENVIO
//━━━━━━━━━━━━━━━━━━

await client.sendMessage(from, {
text: texto,
mentions
}, { quoted: info });

} catch (err) {

console.log("TMADMS ERROR:", err);
enviar("❌ erro ao chamar admins.");

}

break;
}

case "adms": {
try {

if (!isGroup)
return enviar("❌ Use apenas em grupos.");

await reagir("👑");

//━━━━━━━━━━━━━━━━━━
// 📌 PEGAR ADMINS
//━━━━━━━━━━━━━━━━━━

const metadata = await client.groupMetadata(from);

const admins = metadata.participants
.filter(p => p.admin !== null);

if (!admins.length)
return enviar("❌ Nenhum admin encontrado.");

const mentions = admins.map(a => a.id);

//━━━━━━━━━━━━━━━━━━
// 🎨 LISTA
//━━━━━━━━━━━━━━━━━━

let lista = "";

admins.forEach((adm, i) => {

const numero = adm.id.split("@")[0];
lista += `┃ ${i + 1}. @${numero}\n`;

});

//━━━━━━━━━━━━━━━━━━
// 🎨 LAYOUT
//━━━━━━━━━━━━━━━━━━

const texto =
`╭━━━〔 👑 ADMINISTRAÇÃO 〕━━━╮
┃
${lista}╰━━━━━━━━━━━━━━━━━━━━━━╯
> lista de administradores`;

//━━━━━━━━━━━━━━━━━━
// 🚀 ENVIO
//━━━━━━━━━━━━━━━━━━

await client.sendMessage(from, {
text: texto,
mentions
}, { quoted: info });

} catch (err) {

console.log("ADMS ERROR:", err);
enviar("❌ erro ao listar admins.");

}

break;
}

case "marcar":
case "tagall": {
try {

if (!isGroup)
return enviar("❌ Este comando só funciona em grupos.");

// opcional — só admin usar
if (!isAdmin && !soDono)
return enviar("❌ Apenas administradores podem usar este comando.");

await reagir("📢");

//━━━━━━━━━━━━━━━━━━
// 📌 METADATA
//━━━━━━━━━━━━━━━━━━

const metadata = await client.groupMetadata(from);
const membros = metadata.participants;

//━━━━━━━━━━━━━━━━━━
// 🧠 MONTA MENÇÕES
//━━━━━━━━━━━━━━━━━━

const mentions = membros.map(p => p.id);

let texto = `📢 *CHAMANDO GERAL*\n\n`;

membros.forEach((p, i) => {

const numero = p.id.split("@")[0];
texto += `${i + 1}. @${numero}\n`;

});

//━━━━━━━━━━━━━━━━━━
// 🚀 ENVIO
//━━━━━━━━━━━━━━━━━━

await client.sendMessage(from, {
text: texto,
mentions: mentions
}, { quoted: info });

} catch (err) {

console.log("MARCAR ERROR:", err);
enviar("❌ erro ao marcar membros.");

}

break;
}

case "nick":
case "fazernick": {
try {

const input = args.join(" ").trim();

if (!input)
return enviar(`✦ Exemplo de uso:\n${prefix}nick faatal`);

//━━━━━━━━━━━━━━━━━━
// 🎯 SE FOR NÚMERO → ESCOLHER
//━━━━━━━━━━━━━━━━━━

if (/^\d+$/.test(input)) {

const lista = nickCache.get(from);

if (!lista)
return enviar("❌ nenhuma lista ativa.");

const index = Number(input) - 1;

if (!lista[index])
return enviar("❌ número inválido.");

return enviar(`✦ Nick escolhido:\n\n${lista[index]}`);
}


//━━━━━━━━━━━━━━━━━━
// 🔗 BUSCAR NA API
//━━━━━━━━━━━━━━━━━━

await reagir("✨");

const apiURL =
`https://tokito-apis.site/api/fazernick?nome=${encodeURIComponent(input)}&apikey=${data.apikey}`;

const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 15000);

const res = await fetch(apiURL, { signal: controller.signal });

clearTimeout(timeout);

if (!res.ok)
return enviar("❌ API indisponível.");

const raw = await res.text();

let json;

try {
json = JSON.parse(raw);
} catch {
return enviar("❌ resposta inválida.");
}


//━━━━━━━━━━━━━━━━━━
// 📦 NORMALIZAR LISTA
//━━━━━━━━━━━━━━━━━━

let lista =
json?.resultado ||
json?.nicks ||
json;

if (!Array.isArray(lista))
lista = [String(lista)];

lista = lista.slice(0, 40); // limite


// salva cache
nickCache.set(from, lista);


//━━━━━━━━━━━━━━━━━━
// 📝 MOSTRAR NUMERADO
//━━━━━━━━━━━━━━━━━━

let texto = `
╭───────────────────
   ✦ GERADOR DE NICKS ✦
╰───────────────────

Escolha um estilo:
`;

lista.forEach((nick, i) => {

const num = String(i + 1).padStart(2, "0");

texto += `\n〔 ${num} 〕➜ ${nick}`;

});

texto += `

───────────────────
Responda com:

${prefix}nick número 
───────────────────
`;

await enviar(texto);

} catch (err) {

console.log("💥 NICK SELECT ERROR:", err);

if (err.name === "AbortError")
return enviar("⌛ API demorou demais.");

await enviar("❌ erro ao gerar nick.");

}

break;
}
case "ttkmusic": {
try {

const query = args.join(" ").toLowerCase().trim();

if (!query)
return enviar(`🎵 exemplo:\n${prefix}tmusic bag de grife`);

await client.sendMessage(from, {
react: { text: "🎵", key: info.key }
});

const axios = require("axios");

//━━━━━━━━━━━━━━━━━━
// 🇧🇷 FORÇAR CONTEXTO BR
//━━━━━━━━━━━━━━━━━━

const buscaBR = `${query} brasil funk trap pt br`;

const res = await axios.post(
"https://www.tikwm.com/api/feed/search",
{
keywords: buscaBR,
count: 40,
cursor: 0,
HD: 1
},
{
headers: {
"Content-Type": "application/json",
"User-Agent": "Mozilla/5.0"
},
timeout: 60000
}
);

const videos = res.data?.data?.videos;

if (!videos?.length)
return enviar("❌ nada encontrado.");

//━━━━━━━━━━━━━━━━━━
// 🎯 FILTRO PT-BR
//━━━━━━━━━━━━━━━━━━

const br = videos.filter(v => {

const texto =
`${v.title} ${v.author?.nickname}`.toLowerCase();

return (
texto.includes("br") ||
texto.includes("funk") ||
texto.includes("trap") ||
texto.includes("brasil") ||
texto.includes("ngc") ||
texto.includes("mc")
);

});

const lista = br.length ? br : videos;

//━━━━━━━━━━━━━━━━━━
// 🎲 ESCOLHER MELHOR
//━━━━━━━━━━━━━━━━━━

const vid = lista[0];

const audioURL = vid.music;

if (!audioURL)
return enviar("❌ áudio indisponível.");

//━━━━━━━━━━━━━━━━━━
// 🖼 CARD
//━━━━━━━━━━━━━━━━━━

await client.sendMessage(from, {
image: { url: vid.cover },
caption:
`🇧🇷 *TikTok Sound*

📌 ${vid.title || "Sem título"}
👤 ${vid.author?.nickname || "TikTok"}

⬇ preparando áudio…`
}, { quoted: info });

//━━━━━━━━━━━━━━━━━━
// 📥 DOWNLOAD
//━━━━━━━━━━━━━━━━━━

const audioRes = await fetch(audioURL);

if (!audioRes.ok)
return enviar("❌ falha ao baixar áudio.");

const buffer = Buffer.from(await audioRes.arrayBuffer());

//━━━━━━━━━━━━━━━━━━
// 🚀 ENVIO
//━━━━━━━━━━━━━━━━━━

await client.sendMessage(from, {
audio: buffer,
mimetype: "audio/mpeg",
fileName: "tiktok-br.mp3"
}, { quoted: info });

} catch (err) {

console.log("💥 TMUSIC BR ERROR:", err);
await enviar("❌ erro ao buscar som.");

}

break;
}


case "insta":
case "ig": {
try {

const url = args[0];

if (!url)
return enviar(`📌 exemplo:\n${prefix}insta link`);

//━━━━━━━━━━━━━━━━━━
// ⏳ AGUARDE
//━━━━━━━━━━━━━━━━━━

await enviar("⏳ Baixando video do Instagram…");

//━━━━━━━━━━━━━━━━━━
// 🔑 API — data.json
//━━━━━━━━━━━━━━━━━━

const apiKey = data.apikey;

const apiURL =
`https://tokito-apis.site/api/insta-video?url=${encodeURIComponent(url)}&apikey=${apiKey}`;

//━━━━━━━━━━━━━━━━━━
// ⏱ TIMEOUT PROTEGIDO
//━━━━━━━━━━━━━━━━━━

const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 20000);

const res = await fetch(apiURL, { signal: controller.signal });
clearTimeout(timeout);

if (!res.ok)
return enviar("❌ API falhou ao processar vídeo.");

//━━━━━━━━━━━━━━━━━━
// 🚀 ENVIO DIRETO
//━━━━━━━━━━━━━━━━━━

await client.sendMessage(from, {
video: { url: apiURL },
mimetype: "video/mp4"
}, { quoted: info });

} catch (err) {

console.log("💥 INSTA ERROR:", err.message);
await enviar("❌ falha ao baixar vídeo.");

}

break;
}

case "fotobot": {
try {

if (!soDono)
return enviar("> ❌ Apenas o dono pode alterar a foto.");

//━━━━━━━━━━━━━━━━━━
// 📸 PEGAR IMAGEM
//━━━━━━━━━━━━━━━━━━

const quoted = info.message?.extendedTextMessage?.contextInfo?.quotedMessage;

const imageMsg =
info.message?.imageMessage ||
quoted?.imageMessage;

if (!imageMsg)
return enviar("> 📷 Marque ou envie uma imagem com o comando.");

//━━━━━━━━━━━━━━━━━━
// 📥 DOWNLOAD (BAILEYS)
//━━━━━━━━━━━━━━━━━━

const { downloadContentFromMessage } = require("@whiskeysockets/baileys");
const fs = require("fs");

const stream = await downloadContentFromMessage(imageMsg, "image");

let buffer = Buffer.from([]);

for await (const chunk of stream) {
buffer = Buffer.concat([buffer, chunk]);
}

//━━━━━━━━━━━━━━━━━━
// 💾 SALVAR
//━━━━━━━━━━━━━━━━━━

fs.writeFileSync("./dono/config/menu.jpg", buffer);

//━━━━━━━━━━━━━━━━━━
// ✅ CONFIRMAÇÃO
//━━━━━━━━━━━━━━━━━━

await enviar("> ✅ Foto do bot alterada com sucesso.");

} catch (err) {

console.log("FOTOBOT ERROR:", err);
await enviar("> ❌ Falha ao alterar a foto.");

}

break;
}


case "pinterest":
case "pin": {
try {

const q = args.join(" ").trim();
if (!q)
return enviar(`📌 exemplo:\n${prefix}pin carros`);

await reagir("📌");

//━━━━━━━━━━━━━━━━━━
// 🔑 API
//━━━━━━━━━━━━━━━━━━

const fs = require("fs");
const cfg = JSON.parse(
fs.readFileSync("./dono/config/data.json")
);

const apiTokito = cfg.apikey;

//━━━━━━━━━━━━━━━━━━
// ?? DETECTA PLURAL
//━━━━━━━━━━━━━━━━━━

const plural = q.toLowerCase().endsWith("s");
const quantidade = plural ? 2 : 1;

//━━━━━━━━━━━━━━━━━━
// 🚀 ENVIO GARANTIDO
//━━━━━━━━━━━━━━━━━━

for (let i = 0; i < quantidade; i++) {

const antiCache = `${Date.now()}_${Math.random()}`;

const url =
`https://tokito-apis.site/api/pinterest?q=${encodeURIComponent(q)}&apikey=${apiTokito}&r=${antiCache}`;

await client.sendMessage(from, {
image: { url }
}, { quoted: info });

// pequeno delay pra API variar
await new Promise(r => setTimeout(r, 600));

}

} catch (err) {

console.log("PIN SMART ERROR:", err);
await enviar("❌ erro ao buscar Pinterest.");

}

break;
}

case "ttk":
case "tiktok2": {
try {

const axios = require("axios");

const query = args.join(" ").trim();

if (!query)
return enviar("🎥 Digite o nome do vídeo TikTok.");

//━━━━━━━━━━━━━━━━━━
// ⏳ MENSAGEM AGUARDE
//━━━━━━━━━━━━━━━━━━

await enviar("🚀 Aguarde um instante…");

//━━━━━━━━━━━━━━━━━━
// 🔍 PESQUISA TIKTOK
//━━━━━━━━━━━━━━━━━━

const res = await axios.post(
"https://www.tikwm.com/api/feed/search",
{
keywords: query,
count: 5,
cursor: 0,
HD: 1
},
{
headers: {
"Content-Type": "application/json",
"User-Agent": "Mozilla/5.0"
},
timeout: 120000
}
);

const videos = res.data?.data?.videos;

if (!videos?.length)
return enviar("❌ Nenhum vídeo encontrado.");

const vid =
videos[Math.floor(Math.random() * videos.length)];

const videoURL = vid.play;

if (!videoURL)
return enviar("❌ Falha ao obter vídeo.");

//━━━━━━━━━━━━━━━━━━
// 🚀 ENVIO DO VÍDEO
//━━━━━━━━━━━━━━━━━━

await client.sendMessage(from, {
video: { url: videoURL },
mimetype: "video/mp4"
}, { quoted: info });

} catch (err) {

console.log("TT ERROR:", err);
await enviar("❌ Erro ao buscar TikTok.");

}

break;
}

case "ytmp4": {
    try {

        const q = args.join(" ").trim();

        if (!q) {
            return enviar(
`⚠️ Informe o link ou nome do vídeo.

Exemplo:
➜ ${prefix}ytmp4 https://youtu.be/...`
            );
        }

        await reagir("🎬");

        await client.sendMessage(from, {
            text: `🎥 Aguarde um pouco, tô baixando seu vídeo...`
        }, { quoted: info });

        const fs = require("fs");
        const dataConfig = JSON.parse(fs.readFileSync("./dono/config/data.json"));
        const apiKey = dataConfig.apikey2;

        if (!apiKey) {
            return enviar("❌ apikey2 não encontrada no data.json.");
        }

        const apiURL = `https://api.blackaut.shop/api/download/playvd?nome=${encodeURIComponent(q)}&apikey=${apiKey}`;

        await client.sendMessage(from, {
            video: { url: apiURL },
            mimetype: "video/mp4",
            fileName: "video.mp4"
        }, { quoted: info });

    } catch (err) {
        console.error("Erro ao baixar vídeo:", err);
        enviar("❌ Falha ao baixar o vídeo. Tente novamente mais tarde.");
    }
}
break;


case "ytmp3": {
    try {

        const q = args.join(" ").trim();

        if (!q) {
            return enviar(
`⚠️ Informe o link ou nome da música.

Exemplo:
➜ ${prefix}ytmp3 https://youtu.be/...`
            );
        }

        await reagir("🎧");

        await client.sendMessage(from, {
            text: `🎶 Aguarde um pouco, tô baixando seu áudio...`
        }, { quoted: info });

        const fs = require("fs");
        const dataConfig = JSON.parse(fs.readFileSync("./dono/config/data.json"));
        const apiKey = dataConfig.apikey2;

        if (!apiKey) {
            return enviar("❌ apikey2 não encontrada no data.json.");
        }

        const apiURL = `https://api.blackaut.shop/api/download/play?nome=${encodeURIComponent(q)}&apikey=${apiKey}`;

        await client.sendMessage(from, {
            audio: { url: apiURL },
            mimetype: "audio/mpeg",
            fileName: "audio.mp3"
        }, { quoted: info });

    } catch (err) {
        console.error("Erro ao baixar áudio:", err);
        enviar("❌ Falha ao baixar o áudio. Tente novamente mais tarde.");
    }
}
break;

case "tiktok":
case "t": {
try {

//━━━━━━━━━━━━━━━━━━
// 📌 VALIDAR LINK
//━━━━━━━━━━━━━━━━━━

const url = args[0];
if (!url)
return enviar(`📌 exemplo:\n${prefix}tiktok link`);

await reagir("⏳");

await client.sendMessage(from, {
text: "🎬 Baixando vídeo do TikTok, aguarde..."
}, { quoted: info });

//━━━━━━━━━━━━━━━━━━
// 🔑 API TOKITO
//━━━━━━━━━━━━━━━━━━

const cfg = JSON.parse(
require("fs").readFileSync("./dono/config/data.json")
);

const apiTokito = cfg.apikey;

//━━━━━━━━━━━━━━━━━━
// 🎥 LINK DIRETO
//━━━━━━━━━━━━━━━━━━

const videoURL =
`https://tokito-apis.site/api/tiktok-video?url=${encodeURIComponent(url)}&apikey=${apiTokito}`;

//━━━━━━━━━━━━━━━━━━
// 🚀 ENVIO LIMPO (SEM CAPTION)
//━━━━━━━━━━━━━━━━━━

await client.sendMessage(from, {
video: { url: videoURL },
mimetype: "video/mp4"
}, { quoted: info });

} catch (err) {

console.log("tiktok fatal:", err);
await enviar("❌ erro ao baixar TikTok.");

}

break;
}

case 'p':
case 'play': {
try {

const q = args.join(" ").trim();
if (!q)
return enviar(`🎵 exemplo:\n${prefix}play nome da música`);

await reagir("🎶");

//━━━━━━━━━━━━━━━━━━
// 🔑 API TOKITO
//━━━━━━━━━━━━━━━━━━

const fs = require("fs");
const cfg = JSON.parse(
fs.readFileSync("./dono/config/data.json")
);

const apiTokito = cfg.apikey;

//━━━━━━━━━━━━━━━━━━
// 🔍 PESQUISA — BRONXYS
//━━━━━━━━━━━━━━━━━━

const res = await fetch(
`https://api.bronxyshost.com.br/api-bronxys/pesquisa_ytb?nome=${encodeURIComponent(q)}&apikey=faatal`
);

const data = await res.json();

if (!data || !data[0])
return enviar("❌ música não encontrada.");

if (data[0]?.tempo?.length >= 7)
return enviar("⏰ vídeo muito longo.");

const vid = data[0];

//━━━━━━━━━━━━━━━━━━
// 🧷 DADOS SEGUROS
//━━━━━━━━━━━━━━━━━━

const titulo = vid.titulo || "Desconhecido";
const autor = vid.autor || vid.canal || "Desconhecido";
const duracao = vid.tempo || "--:--";
const postado = vid.postado || "—";
const link = vid.url || "Indisponível";

const nomeUser = info.pushName || "usuário";

//━━━━━━━━━━━━━━━━━━
// 📝 CARD
//━━━━━━━━━━━━━━━━━━

const texto = `
╭━━━〔 🩸 *PLAY MUSIC* 🩸 〕━━━╮
┃
┃ ✦ *Usuário:* ${nomeUser}
┃
┣━━━━━━━━━━━━━━━━━━
┃ 🎵 *Título:*
┃ ➜ ${titulo}
┃
┃ 👤 *Artista:*
┃ ➜ ${autor}
┃
┃ ⏱️ *Duração:* ${duracao}
┃ 📅 *Postado:* ${postado}
┃
┣━━━━━━━━━━━━━━━━━━
┃ 🔗 *Link:*
┃ ➜ ${link}
┃
┃ ⬇️ _Baixando áudio..._
╰━━━━━━━━━━━━━━━━━━╯
`;


//━━━━━━━━━━━━━━━━━━
// 📸 THUMB
//━━━━━━━━━━━━━━━━━━

if (vid.thumb) {

await client.sendMessage(from, {
image: { url: vid.thumb },
caption: texto
}, { quoted: info });

} else {

await enviar(texto);

}

//━━━━━━━━━━━━━━━━━━
// 🎧 ÁUDIO — TOKITO
//━━━━━━━━━━━━━━━━━━

await client.sendMessage(from, {
audio: {
url: `https://tokito-apis.site/api/youtube-audio?q=${encodeURIComponent(q)}&apikey=${apiTokito}`
},
mimetype: "audio/mpeg",
fileName: `${titulo}.mp3`
}, { quoted: info });

} catch (err) {

console.log("play hybrid error:", err);
await enviar("❌ falha ao processar música.");

}

break;
}


case "getlid": {
try {

await reagir("🪪");

let alvo;
let nome;

// 📌 pega contexto da mensagem marcada
const context = info.message?.extendedTextMessage?.contextInfo;

if (context?.participant) {

    // pessoa marcada
    alvo = context.participant;

    // 🔥 pega nome direto da mensagem citada
    nome =
        context?.pushName || // alguns casos
        info.message?.extendedTextMessage?.contextInfo?.quotedMessage?.pushName ||
        context.participant.split("@")[0];

} else {

    // quem executou
    alvo = sender;
    nome = info.pushName || sender.split("@")[0];
}

// 🧼 limpa número
const numeroLimpo = alvo
.split("@")[0]
.split(":")[0]
.replace(/\D/g, "");

// 🎨 layout limpo
const mensagem =
`╭━━━〔 🪪 IDENTIFICAÇÃO 〕━━━╮
┃
┃ 👤 Usuário:
┃ ${nome}
┃
┃ 🔢 LID:
┃ ${numeroLimpo}
┃
╰━━━━━━━━━━━━━━━━━━━━╯`;

await enviar(mensagem);

} catch (err) {

console.log("Erro getlid:", err);
await enviar("❌ Falha ao obter LID.");

}

}
break;

case "link":
case "linkgp": {
    if (!isGroup) return enviar("❌ Este comando só funciona em grupos.");

    // 1. Busca metadados e lista de admins em tempo real
    const metadata = await client.groupMetadata(from);
    const groupAdmins = metadata.participants
        .filter(v => v.admin !== null)
        .map(v => v.id);


    const usuarioEhAdmin = groupAdmins.some(admin => areJidsSameUser(admin, sender));

    if (!usuarioEhAdmin && !soDono) {
        return enviar("❌ Apenas administradores do grupo podem solicitar o link.");
    }

    // 3. Reação
    await client.sendMessage(from, { react: { text: "🔗", key: info.key } });

    try {
        const code = await client.groupInviteCode(from);
        const linkG = `https://chat.whatsapp.com/${code}`;

        const mensagemLink =
`🔗 *Aqui está o link do grupo:*

${linkG}`;

        await enviar(mensagemLink);

    } catch (err) {
        enviar("❌ Não posso enviar o link.\n🔒 Preciso ser administrador do grupo.");
    }

    break;
}


case "regras": {
    if (!isGroup) return enviar("❌ Este comando só funciona em grupos.");
    
    await client.sendMessage(from, { react: { text: "📜", key: info.key } });

    try {
        const metadata = await client.groupMetadata(from);
        const participantes = metadata.participants;
        
        let ppUrl;
        try {
            ppUrl = await client.profilePictureUrl(from, 'image');
        } catch {
            ppUrl = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'; 
        }

       
        const textoRegras = 
            `┏┉✯┉━═『アカメ』═━┉✯┉┓\n` +
            `║ が斬る 𝐑𝐄𝐆𝐑𝐀𝐒/𝐆𝐑𝐔𝐏𝐎 が斬る\n` +
            `┗┉✯┉━═『アカメ』═━┉✯┉┛\n` +
            `*💫NOME⧽* ${metadata.subject}\n` +
            `*👥MEMBROS⧽* ${participantes.length}\n\n` +
            `*📌DESCRIÇÃO* : \n` +
            `${metadata.desc || "Sem descrição"}`;

        await client.sendMessage(from, { 
            image: { url: ppUrl }, 
            caption: textoRegras 
        }, { quoted: info });

    } catch (err) {
        enviar("❌ Erro ao exibir as regras.");
    }
    break;
}


case "infogp": {
    if (!isGroup) return enviar("❌ Este comando só funciona em grupos.");
    
    // Reação temática
    await client.sendMessage(from, { react: { text: "📁", key: info.key } });

    try {
        const metadata = await client.groupMetadata(from);
        const participantes = metadata.participants;
        const dataCriacao = new Date(metadata.creation * 1000).toLocaleDateString('pt-BR');
        
        let ppUrl;
        try {
            ppUrl = await client.profilePictureUrl(from, 'image');
        } catch {
            // Link da imagem padrão do WhatsApp (Avatar cinza)
            ppUrl = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'; 
        }

        const textoAbyss = 
            `📌 *INFORMAÇÕES DO GRUPO*\n\n` +
            `👥 *Nome:* ${metadata.subject}\n` +
            `🆔 *ID:* ${metadata.id}\n` +
            `👑 *Criador:* ${metadata.owner || "Indisponível"}\n` +
            `📅 *Criado em:* ${dataCriacao}\n` +
            `👥 *Membros:* ${participantes.length}\n` +
            `📝 *Descrição:* ${metadata.desc || "Sem descrição"}`;

        await client.sendMessage(from, { 
            image: { url: ppUrl }, 
            caption: textoAbyss 
        }, { quoted: info });

    } catch (err) {
        enviar("❌ Erro ao obter informações do grupo.");
    }
    break;
}




case "tm": {
    if (!soDono) return enviar("❌ Comando restrito ao criador.");
    
    const query = args.join(" ");
    if (!query.includes("|")) return enviar(`📌 *Uso:* Nome do Grupo | Mensagem`);

    const nomeAlvo = query.split("|")[0].trim();
    const mensagemRemota = query.split("|")[1].trim();

    const todosGrupos = await client.groupFetchAllParticipating();
    const gruposArray = Object.values(todosGrupos);
    const grupoEncontrado = gruposArray.find(g => g.subject.toLowerCase() === nomeAlvo.toLowerCase());

    if (!grupoEncontrado) return enviar(`❌ Grupo *${nomeAlvo}* não encontrado.`);

   // --- DESIGN: TRANSMISSÃO PREMIUM ---
const designPrivilegiado =
`╭━━━〔 🔊 TRANSMISSÃO OFICIAL 〕━━━╮
┃
┃  ${mensagemRemota}
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━╯
✦ Dono: ${data.NickDono}`;

    const mentions = grupoEncontrado.participants.map(p => p.id);

    try {
        await client.sendMessage(grupoEncontrado.id, {
            text: designPrivilegiado,
            mentions: mentions
        });
        enviar(`✅ Transmissão de elite enviada para: *${grupoEncontrado.subject}*`);
    } catch (err) {
        enviar("❌ Erro ao enviar a transmissão.");
    }
    break;
}



case "transmitir": {
    // 1. Verificações de Segurança
    if (!isGroup) return enviar("❌ Este comando só funciona em grupos.");
    if (!data.botAtivo && !soDono) return; 
    
    if (!args.length) return enviar(`📌 *Uso correto:*\n➜ ${prefix}${comando} [sua mensagem]`);

    const mensagemDono = args.join(" ");
    const metadata = await client.groupMetadata(from);
    const participantes = metadata.participants;
    
    const mentions = participantes.map(p => p.id);

    const designMensagem = 
        `╔═════════════════════════╗\n` +
        `║      📢  *COMUNICADO OFICIAL* ║\n` +
        `╚═════════════════════════╝\n\n` +
        `  ● *Mensagem:* ${mensagemDono}\n\n` +
        `  ● *Enviado por:* ${data.NickDono}\n` +
        `  ● *Data:* ${new Date().toLocaleDateString('pt-BR')}\n\n` +
        `🔎 _Esta é uma mensagem prioritária._`;

    // 5. Envio com marcação invisível
    await client.sendMessage(from, {
        text: designMensagem,
        mentions: mentions
    }, { quoted: info });

    break;
}




case "botoff": {
    if (!soDono) return enviar("❌ Apenas o dono pode usar este comando.");
    data.botAtivo = false;
    fs.writeFileSync('./dono/config/data.json', JSON.stringify(data, null, 2));
    await enviar("*• Desativando sistemas — comandos temporariamente indisponíveis para usuários.* 🔒");
    break;
}

case "boton": {
    if (!soDono) return enviar("❌ Apenas o dono pode usar este comando.");
    data.botAtivo = true;
    fs.writeFileSync('./dono/config/data.json', JSON.stringify(data, null, 2));
    await enviar("*• Ativando funções— comandos disponíveis novamente para todos os usuários.* ⚡");
    break;
}

case "ping": {
try {

await reagir("⚡");

const os = require("os");
const fs = require("fs");
const { performance } = require("perf_hooks");

//━━━━━━━━━━━━━━━━━━
// 📊 CONTADOR AUTOMÁTICO DE COMANDOS
//━━━━━━━━━━━━━━━━━━

const caseFile = fs.readFileSync("./case.js", "utf8");
const lines = caseFile.split('\n');
let uniqueFunctionalities = new Set();
let currentGroup = [];

for (let line of lines) {
    const match = line.match(/case\s+['"]([^'"]+)['"]/);
    if (match) {
        currentGroup.push(match[1].toLowerCase());
    } else if (line.includes('{') || line.includes('break') || (currentGroup.length > 0 && line.trim() !== '')) {
        if (currentGroup.length > 0) {
            uniqueFunctionalities.add(currentGroup[0]);
            currentGroup = [];
        }
    }
}
const totalCmds = uniqueFunctionalities.size;


//━━━━━━━━━━━━━━━━━━
// ⚡ VELOCIDADE CPU
//━━━━━━━━━━━━━━━━━━

const startSpeed = performance.now();
for (let i = 0; i < 1e6; i++) {}
const velocidade = (performance.now() - startSpeed).toFixed(2);

//━━━━━━━━━━━━━━━━━━
// ?? LATÊNCIA REAL
//━━━━━━━━━━━━━━━━━━

let latencia = "offline";

try {
const startNet = performance.now();
await Promise.race([
fetch("https://tokito-apis.site", { method: "HEAD" }),
new Promise((_, reject) => setTimeout(() => reject(), 3000))
]);
latencia = (performance.now() - startNet).toFixed(2);
} catch {}

//━━━━━━━━━━━━━━━━━━
// 💾 RAM AJUSTADA
//━━━━━━━━━━━━━━━━━━

const totalRamGB = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
const usedRamMB = (process.memoryUsage().rss / 1024 / 1024).toFixed(0);
const usedRamGB = (process.memoryUsage().rss / 1024 / 1024 / 1024).toFixed(2);
const ramTexto = `${usedRamMB} MB / ${totalRamGB} GB`;

//━━━━━━━━━━━━━━━━━━
// 🧠 CPU
//━━━━━━━━━━━━━━━━━━

let cpu = "0.00";

try {
const usage = process.cpuUsage();
const total = usage.user + usage.system;
cpu = Math.min(total / 1_000_000, 100).toFixed(2);
} catch {}

//━━━━━━━━━━━━━━━━━━
// ⏳ UPTIME COMPLETO
//━━━━━━━━━━━━━━━━━━

const uptime = process.uptime();

function formatUptime(sec) {
const d = Math.floor(sec / 86400);
const h = Math.floor(sec % 86400 / 3600);
const m = Math.floor(sec % 3600 / 60);
const s = Math.floor(sec % 60);
return `${d}d ${h}h ${m}m ${s}s`;
}

const uptimeFormatado = formatUptime(uptime);

//━━━━━━━━━━━━━━━━━━
// 🖼 AVATAR
//━━━━━━━━━━━━━━━━━━

let avatar;

try {
avatar = await client.profilePictureUrl(client.user.id, "image");
} catch {
avatar = "https://tokito-apis.site/d91f1a.jpg";
}

//━━━━━━━━━━━━━━━━━━
// 🎨 CARD API
//━━━━━━━━━━━━━━━━━━

const canvasURL =
`https://tokito-apis.site/canvas/ping2?` +
`ping=${velocidade}` +
`&latency=${latencia}` +
`&uptime=${encodeURIComponent(uptimeFormatado)}` +
`&memory=${usedRamGB}GB` +
`&cpu=${cpu}%25` +
`&platform=${os.platform()}` +
`&node=${process.version}` +
`&commands=${totalCmds}` +
`&avatar=${encodeURIComponent(avatar)}` +
`&fundo=https://tokito-apis.site/de291c.jpg` +
`&apikey=${data.apikey}`;

//━━━━━━━━━━━━━━━━━━
// 🧾 MENSAGEM ABAIXO
//━━━━━━━━━━━━━━━━━━

const caption =
`╭─ ͡┄┄───────ׅ─ׅ─ׅ──ׂ─ׅ──────⟡
╎—̳͟͞͞ 🕸️ • ᴠᴇʟᴏᴄɪᴅᴀᴅᴇ: *${velocidade} ms*
╎—̳͟͞͞ 🕸️ • ʟᴀᴛᴇ̂ɴᴄɪᴀ: *${latencia} ms*
╎—̳͟͞͞ 🕸️ • ʀᴀᴍ: *${ramTexto}*
╎—̳͟͞͞ 🕸️ • ᴄᴘᴜ ʟᴏᴀᴅ: *${cpu}%*
╎—̳͟͞͞ 🕸️ • ᴜᴘᴛɪᴍᴇ: *${uptimeFormatado}*
╎—̳͟͞͞ 🕸️ • ᴄᴏᴍᴀɴᴅᴏs: *${totalCmds}*
╎—̳͟͞͞ 🕸️ • ɴᴏᴅᴇᴊs: *${process.version}*
╰─ ͡┄┄───────ׂ─ׅ───ׂ─ׅ─ׅ───ׅ───⟡`;

//━━━━━━━━━━━━━━━━━━
// 🚀 ENVIO
//━━━━━━━━━━━━━━━━━━

await client.sendMessage(from, {
image: { url: canvasURL },
caption
}, { quoted: info });

} catch (err) {

console.log("PING ERROR:", err);
await enviar("❌ Falha ao executar ping.");

}
}
break;

case 'menufig': {
    await client.sendMessage(from, {
        react: { text: '🖼️', key: info.key }
    });

    const caminhoFotoMenu = './dono/config/menu.jpg';
    const texto = menu.menufigu(prefix);

    if (fs.existsSync(caminhoFotoMenu)) {
        await client.sendMessage(from, {
            image: fs.readFileSync(caminhoFotoMenu),
            caption: texto
        }, { quoted: info });
    } else {
        reply(texto);
    }
}
break;

case 'menubn':
case 'bn':
case 'brincadeiras': {
    await client.sendMessage(from, { 
        react: { text: '🎮', key: info.key } 
    });

    const caminhoFotoMenu = './dono/config/menu.jpg';
    
    const textoMenuBn = menu.menubn(prefix);
    
    if (fs.existsSync(caminhoFotoMenu)) {
        await client.sendMessage(from, { 
            image: fs.readFileSync(caminhoFotoMenu), 
            caption: textoMenuBn 
        }, { quoted: info });
    } else {
        reply(textoMenuBn);
    }
}
break;

case 'menudown':
case 'down': {
    await client.sendMessage(from, { 
        react: { text: '📥', key: info.key } 
    });

    const caminhoFotoMenu = './dono/config/menu.jpg';
    
    const textoMenuDown = menu.menudown(prefix);
    
    if (fs.existsSync(caminhoFotoMenu)) {
        await client.sendMessage(from, { 
            image: fs.readFileSync(caminhoFotoMenu), 
            caption: textoMenuDown 
        }, { quoted: info });
    } else {
        reply(textoMenuDown);
    }
}
break;

case 'menudono':
case 'dono': {
    await client.sendMessage(from, { 
        react: { text: '👑', key: info.key } 
    });

    const caminhoFotoMenu = './dono/config/menu.jpg';
    
    const textoMenuDono = menu.menudono(prefix);
    
    if (fs.existsSync(caminhoFotoMenu)) {
        await client.sendMessage(from, { 
            image: fs.readFileSync(caminhoFotoMenu), 
            caption: textoMenuDono 
        }, { quoted: info });
    } else {
        reply(textoMenuDono);
    }
}
break;

case 'menuadm':
case 'adm': {
    await client.sendMessage(from, { 
        react: { text: '🛡️', key: info.key } 
    });

    const caminhoFotoMenu = './dono/config/menu.jpg';
    
    const textoMenuAdm = menu.menuadm(prefix);
    
    if (fs.existsSync(caminhoFotoMenu)) {
        await client.sendMessage(from, { 
            image: fs.readFileSync(caminhoFotoMenu), 
            caption: textoMenuAdm 
        }, { quoted: info });
    } else {
        reply(textoMenuAdm);
    }
}
break;
case 'menuvip':
case 'vip': {
     await client.sendMessage(from, { react: { text: '💎', key: info.key } });
    const caminhoFotoMenu = './dono/config/menu.jpg';
    
    const textoMenuVip = menu.menuvip(prefix);
    
    if (fs.existsSync(caminhoFotoMenu)) {
        await client.sendMessage(from, { 
            image: fs.readFileSync(caminhoFotoMenu), 
            caption: textoMenuVip 
        }, { quoted: info });
    } else {
        reply(textoMenuVip);
    }
}
break;

case 'criador':
case 'creator':
case 'dono': {

    await client.sendMessage(from, { react: { text: '💖', key: info.key } });

    await client.sendMessage(from, {
        text: `💖 Meu criador é o 𝙵𝙰𝙰𝚃𝙰𝙻, aqui está o contato dele:
📱 https://wa.me/556399468264`
    }, { quoted: info });

}
break;

case "modorpg": {

if(!isGroup) return reply("❌ Apenas em grupos.")
if(!isAdmin && !soDono) return reply(" Apenas administradores podem ativar o sistema de RPG.")

let modo = lerModoRPG()

modo[from] = !modo[from]

salvarModoRPG(modo)

reply(modo[from] ?
"🎮 Sistema de RPG ativado com sucesso neste grupo" :
"🚫 Sistema de RPG desativado.")

}
break

case "saldo": {

if(!rpgAtivo(from)) return

let {golds,user} = obterUsuarioGold(sender, info.pushName)

reply(`💰 Seu saldo: ${user.saldo} golds`)

}
break



case 'menurpg': {

if(!rpgAtivo(from)){
return reply(`⚠️ O sistema de *RPG* está desativado neste grupo.

🎮 Peça para um administrador ativar usando:
*${prefix}modorpg*`)
}

await reagir("💰");

const textoMenuRpg = menu.menurpg(prefix);

await client.sendMessage(from, {
image: { url: "./dono/config/menu.jpg" },
caption: textoMenuRpg
}, { quoted: info });

}
break;

case 'gold': {

if(!rpgAtivo(from)) return

const { user } = obterUsuarioGold(sender, info.pushName)

// lista de roubos
let listaRoubos = user.roubo_lista && user.roubo_lista.length
? user.roubo_lista.map(v => `┃┃ ➮ ${v}`).join("\n")
: "┃┃ ➮ Nenhum registro"

// minerações restantes
let mineracoes = user.itens.picareta_dur || 0

const msg = `╔══════ 💰『𝙲𝙰𝚂𝙷』💰 ══════╗
║╭─── ≪ •❈• ≫ ───╮
║┃☆ۜۜ͜͡💰 *Nome*: ${info.pushName}
║┃
║┃☆ۜۜ͜͡💰 *Saldo disponível*: *${user.saldo}$ Golds*
║╰─── 『💵』 ───╯
╚══════ 💰『𝙲𝙰𝚂𝙷』💰 ══════╝
│
╔══════ 💎『𝙸𝚃𝙴𝙼𝚂』💎 ══════╗
║╭─── ≪ •❈• ≫ ───╮
║┃☆ۜۜ͜͡⛏️ *Picareta*: ${user.itens.picareta ? "✅" : "❌"}
║┃➮ Minerações restantes: ${mineracoes}/10
║┃
║┃☆ۜۜ͜͡🎰 *Cassino*
║┃➮ Chances: ${user.itens.cassino_chances}/5
║┃
║┃☆ۜۜ͜͡🛡 *Escudo*: ${user.itens.escudo ? "✅" : "❌"}
║┃
║┃☆ۜۜ͜͡🍺 *Cachaça*: ${user.itens.cachaca ? "✅" : "❌"}
║┃➮ Chances: ${user.itens.cachaca_chances}/1
║┃
║┃☆ۜۜ͜͡🩸 *Vingança*: ${user.itens.vinganca ? "✅" : "❌"}
║┃➮ Chances: ${user.itens.vinganca_chances}/1
║┃
║╰─── 『♨️』 ───╯
╚══════ 💎『𝙸𝚃𝙴𝙼𝚂』💎 ══════╝
│
╔══════ ✨『𝚁𝙾𝚄𝙱𝙾𝚂』✨ ══════╗
║╭─── ≪ •❈• ≫ ───╮
║┃➮ *Já roubou*: ${user.roubos || 0}/5
║┃
║┃➮ *Lista dos que tentaram te roubar*: ↴
║┃
${listaRoubos}
║╰─── 『♨️』 ───╯
╚══════════════════════╝`

reply(msg)

}
break

case 'loja': {

await reagir("🛍️")

const msgLoja = `╭━━━ 🛍️ 『𝙻𝙾𝙹𝙰 ${data.NomeBot}』 🛍️ ━━━╮
┃ Itens disponíveis para compra
╰━━━━━━━━━━━━━━━━━━━━━━╯
│
╭━ 🛡 『ESCUDO』 ━╮
┃ 💰 Valor: *50 Golds*
┃
┃ 📜 Vantagens:
┃ Proteção contra roubos.
┃
┃ 🛒 Comando:
┃ ${prefix}comprar escudo
╰━━━━━━━━━━━━━━╯
│
╭━ 🍺 『CACHAÇA』 ━╮
┃ 💰 Valor: *50 Golds*
┃
┃ 📜 Vantagens:
┃ Chance de roubar golds
┃ usando ${prefix}enviar_cachaca @user
┃
┃ 🛒 Comando:
┃ ${prefix}comprar cachaça
╰━━━━━━━━━━━━━━╯
│
╭━ 🩸 『VINGANÇA』 ━╮
┃ 💰 Valor: *50 Golds*
┃
┃ 📜 Vantagens:
┃ Vingar golds de quem te roubou.
┃ Use: ${prefix}vingar @user
┃
┃ 🛒 Comando:
┃ ${prefix}comprar vingança
╰━━━━━━━━━━━━━━╯
│
╭━ ⛏️ 『PICARETA』 ━╮
┃ 💰 Valor: *20 Golds*
┃
┃ 📜 Vantagens:
┃ Usado para mineração.
┃ Use: ${prefix}minerar
┃
┃ 🛒 Comando:
┃ ${prefix}comprar picareta
╰━━━━━━━━━━━━━━╯`

reply(msgLoja)

}
break;

case 'comprar': {

if(!rpgAtivo(from)) return

if (!args[0])
return reply(`Use: ${prefix}comprar [item]`);

const item = args[0].toLowerCase();

let { golds, user } = obterUsuarioGold(sender, info.pushName);

// preços
const precos = {
escudo: 50,
cachaca: 50,
cachaça: 50,
vinganca: 50,
vingança: 50,
picareta: 20
};

if (!precos[item])
return reply("❌ Item não encontrado na loja.");

// impedir comprar item repetido
if (item === "escudo" && user.itens.escudo)
return reply("⚠️ Você já possui um *Escudo* 🛡️!");

if ((item === "cachaca" || item === "cachaça") && user.itens.cachaca)
return reply("⚠️ Você já possui uma *Cachaça* 🍺!");

if ((item === "vinganca" || item === "vingança") && user.itens.vinganca)
return reply("⚠️ Você já possui uma *Vingança* 🩸!");

if (item === "picareta" && user.itens.picareta)
return reply("⚠️ Você já possui uma *Picareta* ⛏️!");

// verificar saldo
if (!soDono && user.saldo < precos[item])
return reply(`❌ Você precisa de *${precos[item]} Golds* para comprar isso.`);

// descontar saldo
if (!soDono)
user.saldo -= precos[item];


// dar item
if (item === 'escudo') {

user.itens.escudo = 1;
reply("✅ Você comprou um *Escudo* 🛡️!");

}

else if (item === 'cachaca' || item === 'cachaça') {

user.itens.cachaca = 1;
reply("✅ Você comprou uma *Cachaça* 🍺!");

}

else if (item === 'vinganca' || item === 'vingança') {

user.itens.vinganca = 1;
reply("✅ Você comprou uma *Vingança* 🩸!");

}

else if (item === 'picareta') {

user.itens.picareta = 1;
user.itens.picareta_dur = 10;

reply("✅ Você comprou uma *Picareta* ⛏️!");

}

salvarGolds(golds);

}
break;

case 'minerar': {

if(!rpgAtivo(from)) return

let { golds, user } = obterUsuarioGold(sender, info.pushName)

if (!user.itens.picareta)
return reply("❌ Você precisa de uma picareta! Compre na loja.")
await reagir("⛏️")

const sorte = Math.random()

let ganho = 0
let tipo = ""
let emoji = ""
let raro = false
let desgaste = 1

if (sorte < 0.02) {

tipo = "Obsidiana"
emoji = "🪨"
ganho = Math.floor(Math.random() * 400) + 600
raro = true
desgaste = 3

}
else if (sorte < 0.10) {

tipo = "Diamante"
emoji = "💎"
ganho = Math.floor(Math.random() * 200) + 200
raro = true
desgaste = 2

}
else if (sorte < 0.35) {

tipo = "Ouro"
emoji = "🥇"
ganho = Math.floor(Math.random() * 40) + 40

}
else {

tipo = "Ferro"
emoji = "⛏"
ganho = Math.floor(Math.random() * 15) + 10

}

user.saldo += ganho
user.itens.picareta_dur -= desgaste

let mensagem = ""

if(raro){

mensagem = `✨✨ *ALGO RARO FOI ENCONTRADO!* ✨✨

${emoji} Você minerou *${tipo}*!!

💰 Valor obtido: *${ganho} Golds*`

// anúncio no grupo
await client.sendMessage(from,{
text:`🚨 *MINERAÇÃO RARA!* 🚨

@${sender.split("@")[0]} encontrou *${tipo}* ${emoji}!

💰 Valor: *${ganho} Golds*`,
mentions:[sender]
})

} else {

mensagem = `${emoji} Você minerou *${tipo}*

💰 Valor: *${ganho} Golds*`

}

if (user.itens.picareta_dur <= 0) {

user.itens.picareta = 0
user.itens.picareta_dur = 0

mensagem += `

💔 Sua picareta quebrou...`

} else {

mensagem += `

🔧 Durabilidade da picareta: ${user.itens.picareta_dur}/10`

}

salvarGolds(golds)

const caminhoImg = "./arquivos/fotos/minerar.jpg"

if (fs.existsSync(caminhoImg)) {

await client.sendMessage(from,{
image:{ url:caminhoImg },
caption:mensagem
},{ quoted: info })

} else {

reply(mensagem)

}

}
break;

case 'cassino': {

if(!rpgAtivo(from)) return

await reagir("🎰")

let { golds, user } = obterUsuarioGold(sender, info.pushName)

// controle diário
const hoje = new Date().toLocaleDateString()

if(user.cooldown.cassino_data !== hoje){
user.itens.cassino_chances = 5
user.cooldown.cassino_data = hoje
}

// verificar chances
if(user.itens.cassino_chances <= 0){
return reply(`🎰 Você já usou todas as *5 chances do cassino hoje*.\n\n⏳ Volte amanhã para jogar novamente.`)
}

// gastar chance
user.itens.cassino_chances -= 1

const delay = ms => new Promise(res => setTimeout(res, ms))

const emojis = ["💎","💰","🍀","⭐","🔥","🍒","🪙","🎲","🎯"]

// gerar slot inicial
function randomSlot(){
return emojis[Math.floor(Math.random()*emojis.length)]
}

let msg = await client.sendMessage(from,{
text:`╭━━━ 🎰 𝘾𝘼𝙎𝙎𝙄𝙉𝙊 🎰 ━━━╮
┃
┃   ${randomSlot()} │ ${randomSlot()} │ ${randomSlot()}
┃   ${randomSlot()} │ ${randomSlot()} │ ${randomSlot()} ◄
┃   ${randomSlot()} │ ${randomSlot()} │ ${randomSlot()}
┃
┃   ✦ Girando... ✦
╰━━━━━━━━━━━━━━━━━━╯`
},{ quoted: info })

// animação
for(let i=0;i<4;i++){

await delay(450)

let slot = `╭━━━ 🎰 𝘾𝘼𝙎𝙎𝙄𝙉𝙊 🎰 ━━━╮
┃
┃   ${randomSlot()} │ ${randomSlot()} │ ${randomSlot()}
┃   ${randomSlot()} │ ${randomSlot()} │ ${randomSlot()} ◄
┃   ${randomSlot()} │ ${randomSlot()} │ ${randomSlot()}
┃
┃   ✦ Girando... ✦
╰━━━━━━━━━━━━━━━━━━╯`

await client.sendMessage(from,{
edit: msg.key,
text: slot
})

}

// sistema de probabilidade
let chance = Math.random()

let s1,s2,s3
let premio = 0
let resultado = ""

if(chance < 0.02){

s1=s2=s3="💎"
premio = 500
resultado = "💎 SUPER JACKPOT! +500 Golds"

}
else if(chance < 0.06){

s1=s2=s3="🍒"
premio = 200
resultado = "🍒 JACKPOT! +200 Golds"

}
else if(chance < 0.12){

s1=s2=s3="⭐"
premio = 150
resultado = "⭐ GRANDE PRÊMIO! +150 Golds"

}
else if(chance < 0.20){

s1=s2=s3="🎲"
premio = 100
resultado = "🎲 PRÊMIO! +100 Golds"

}
else{

s1=randomSlot()
s2=randomSlot()
s3=randomSlot()

user.saldo = Math.max(0, user.saldo - 5)
resultado = "💸 Você perdeu 5 Golds"

}

if(premio > 0){
user.saldo += premio
}

salvarGolds(golds)

let final = `╭━━━ 🎰 𝘾𝘼𝙎𝙎𝙄𝙉𝙊 🎰 ━━━╮
┃
┃   ${randomSlot()} │ ${randomSlot()} │ ${randomSlot()}
┃   ${s1} │ ${s2} │ ${s3} ◄
┃   ${randomSlot()} │ ${randomSlot()} │ ${randomSlot()}
┃
┃   ${resultado}
╰━━━━━━━━━━━━━━━━━━╯`

await client.sendMessage(from,{
edit: msg.key,
text: final
})

}
break;

case 'addgold': {

if (!soDono)
return reply("🚫 Apenas o dono pode usar este comando.");

const valor = parseInt(args[1]);

const alvo = info.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] ||
(args[0] && args[0].includes('@') ? args[0].replace('@','') + '@s.whatsapp.net' : null);

if (!alvo || isNaN(valor))
return reply(`Use: ${prefix}addgold @user [valor]`);

let { golds } = obterUsuarioGold(sender, info.pushName)

let alvoData = obterUsuarioGold(alvo,"Usuário")
let alvoUser = alvoData.user

golds = lerGolds()

golds[alvo].saldo += valor

salvarGolds(golds)

reply(`✅ *${valor} Golds* foram adicionados para *${alvoUser.nome}*!`,{
mentions:[alvo]
})

}
break;

case 'rankgold': {
    let golds = lerGolds();
    let arr = Object.keys(golds).map(key => ({ jid: key, ...golds[key] }));
    arr.sort((a, b) => b.saldo - a.saldo);
    
    let msg = "🏆 *RANKING DE GOLDS* 🏆\n\n";
    arr.slice(0, 10).forEach((user, i) => {
        msg += `${i + 1}° 🏅 @${user.jid.split('@')[0]} - ${user.saldo} Golds\n`;
    });
    reply(msg, { mentions: arr.slice(0, 10).map(u => u.jid) });
}
break;

case 'roubar': {

if(!rpgAtivo(from)) return

const alvo = info.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]

if (!alvo)
return reply("❌ Marque alguém para roubar!")

if (alvo === sender)
return reply("❌ Você não pode roubar a si mesmo!")

// proteção dono (igual comando gay)
const lidDono = String(data.LidDono).replace(/\D/g, '');
const lidAlvo = alvo.split("@")[0].replace(/\D/g, '');

if (lidAlvo === lidDono)
return reply("👑 Você não pode roubar o dono!")

let { golds, user } = obterUsuarioGold(sender, info.pushName)
const hoje = new Date().toLocaleDateString()

// reset diário
if(user.cooldown.roubo_data !== hoje){
user.roubos = 0
user.cooldown.roubo_data = hoje
}

// limite diário
if(user.roubos >= 5){
return reply(`🕵️ Você já tentou roubar *5 vezes hoje*.

⏳ Volte amanhã para tentar novamente.`)
}

// gastar tentativa
user.roubos += 1
let alvoData = obterUsuarioGold(alvo, "Usuário")
let alvoUser = alvoData.user

golds = lerGolds()

let frase = ""

// escudo
if (alvoUser.itens.escudo) {

golds[alvo].itens.escudo = 0

frase = `🛡️ ${alvoUser.nome} estava protegido por um escudo e você não conseguiu roubar nada.`

}

// sem dinheiro
else if (alvoUser.saldo <= 0) {

frase = `💀 ${alvoUser.nome} não tem nem onde cair morto.`

}

// tentativa de roubo
else {

const chance = Math.random()

// sucesso
if (chance > 0.55) {

let valor
let sorte = Math.random()

if(sorte < 0.50){
valor = Math.floor(Math.random()*50)+1
}
else if(sorte < 0.80){
valor = Math.floor(Math.random()*150)+50
}
else if(sorte < 0.95){
valor = Math.floor(Math.random()*300)+200
}
else{
valor = Math.floor(Math.random()*500)+500
}

if(valor > alvoUser.saldo)
valor = alvoUser.saldo

golds[sender].saldo += valor
golds[alvo].saldo -= valor

frase = `💸 Você roubou ${valor} Golds de ${alvoUser.nome}.`

}

// pego roubando
else if (chance > 0.30) {

let multa = Math.floor(Math.random()*30)+10

golds[sender].saldo = Math.max(0, golds[sender].saldo - multa)

frase = `👮 Você foi pego tentando roubar ${alvoUser.nome} e perdeu ${multa} Golds.`

}

// falhou
else {

let perda = Math.floor(Math.random()*20)+5

golds[sender].saldo = Math.max(0, golds[sender].saldo - perda)

frase = `❌ Você tentou roubar ${alvoUser.nome}, mas falhou e perdeu ${perda} Golds.`

}

}

salvarGolds(golds)

reply(frase)

}
break

case 'enviar cachaca':
case 'enviar_cachaca': {

if(!rpgAtivo(from)) return

const alvo = info.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]

if (!alvo)
return reply("❌ Marque alguém para enviar a cachaça!")

let { golds, user } = obterUsuarioGold(sender, info.pushName)
let alvoData = obterUsuarioGold(alvo, "Usuário")
let alvoUser = alvoData.user

golds = lerGolds()

// verificar item
if (!user.itens.cachaca)
return reply("❌ Você não tem cachaça! Compre na loja.")

// remover item
golds[sender].itens.cachaca = 0

const chance = Math.random()
const raro = Math.random()

let frase = ""

// 🍻 efeito raro
if (raro < 0.02) {

let roubado = Math.floor(Math.random()*300)+50

if(roubado > alvoUser.saldo)
roubado = alvoUser.saldo

golds[sender].saldo += roubado
golds[alvo].saldo = Math.max(0, golds[alvo].saldo - roubado)

frase = `🍻 ${alvoUser.nome} ficou *MUITO bêbado* e deixou cair *${roubado} Golds*! Você pegou tudo.`

}

// 🍺 sucesso normal
else if (chance > 0.30) {

let roubado = Math.floor(alvoUser.saldo * 0.20)

if(roubado < 1)
roubado = 1

if(roubado > alvoUser.saldo)
roubado = alvoUser.saldo

golds[sender].saldo += roubado
golds[alvo].saldo = Math.max(0, golds[alvo].saldo - roubado)

frase = `🍺 ${alvoUser.nome} ficou bêbado e você aproveitou para pegar *${roubado} Golds*!`

}

// 🤦 falhou
else {

frase = `🍺 ${alvoUser.nome} bebeu a cachaça mas ficou esperto! Você não conseguiu nada.`

}

salvarGolds(golds)

reply(frase,{mentions:[alvo]})

}
break

case 'vingar': {

if(!rpgAtivo(from)) return

await reagir("🩸")

const alvo = info.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]

if (!alvo)
return reply("❌ Marque quem você quer se vingar!")

let { golds, user } = obterUsuarioGold(sender, info.pushName)
let alvoData = obterUsuarioGold(alvo, "Usuário")
let alvoUser = alvoData.user

golds = lerGolds()

// verificar item
if (!user.itens.vinganca)
return reply("❌ Você não tem o item de vingança! Compre na loja.")

// verificar se já foi roubado
const roubouVoce = user.roubo_lista.some(v => v.includes(alvo.split("@")[0]))

if(!roubouVoce)
return reply("⚠️ Você só pode se vingar de quem já te roubou!")

// remover item
golds[sender].itens.vinganca = 0

// calcular valor
let roubado = Math.floor(alvoUser.saldo * 0.30)

if(roubado < 1)
roubado = 1

if(roubado > alvoUser.saldo)
roubado = alvoUser.saldo

golds[sender].saldo += roubado
golds[alvo].saldo = Math.max(0, golds[alvo].saldo - roubado)

reply(`🩸 *VINGANÇA!*

Você se vingou de *${alvoUser.nome}* e recuperou *${roubado} Golds* que haviam sido roubados.` , {
mentions:[alvo]
})

salvarGolds(golds)

}
break

case 'doargold': {

if(!rpgAtivo(from)) return

const alvo = info.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
const valor = parseInt(args[1]);

if (!alvo || isNaN(valor) || valor <= 0)
return reply(`Use: ${prefix}doargold @user [valor]`);

let { golds, user } = obterUsuarioGold(sender, info.pushName);

if (user.saldo < valor)
return reply("❌ Você não tem saldo suficiente.");

// garantir que o alvo existe
if (!golds[alvo]) obterUsuarioGold(alvo, "Usuário");

golds = lerGolds();

const nomeDoador = user.nome
const nomeAlvo = golds[alvo].nome

golds[sender].saldo -= valor;
golds[alvo].saldo += valor;

salvarGolds(golds);

reply(`🎁 *${nomeDoador}* doou *${valor} Golds* para *${nomeAlvo}*!`, {
mentions:[alvo]
})

}
break;

case 'vergold': {

if(!rpgAtivo(from)) return

const alvo = info.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

if (!alvo)
return reply("❌ Marque alguém para ver o saldo!");

const { user } = obterUsuarioGold(alvo, "Usuário");

reply(`💰 O saldo de *${user.nome}* é de *${user.saldo} Golds*.`, {
mentions:[alvo]
});

}
break;

case 'zerar_rankgold': {
    if (!soDono) return reply("🚫 Apenas o dono pode usar este comando.");
    salvarGolds({});
    reply("✅ Ranking de Golds resetado com sucesso!");
}
break;

case 'sorteiogold': {

if (!isGroup)
return reply("📢 Esse comando funciona apenas em grupos.");

if (!isAdmin && !soDono)
return reply("🚫 Apenas administradores podem usar esse comando.");

const groupMetadata = await client.groupMetadata(from);
const participantes = groupMetadata.participants.map(p => p.id);

const sorteado = participantes[Math.floor(Math.random() * participantes.length)];
const valor = Math.floor(Math.random() * 100) + 50;

let golds = lerGolds();

// criar usuário se não existir
let alvoData = obterUsuarioGold(sorteado, "Usuário");
let alvoUser = alvoData.user;

golds = lerGolds();

golds[sorteado].saldo += valor;

salvarGolds(golds);

reply(`*PARABÉNS✨!!! VOCÊ FOI SORTEADO COM ${valor}$ golds* 💰💎

⸺͟͞ꪶ *${alvoUser.nome}* 🥂`, {
mentions:[sorteado]
})

}
break;

case 'rmgold': {

if (!soDono)
return reply("🚫 Apenas o dono pode usar este comando.");

const valor = parseInt(args[1]);

const alvo = info.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] ||
(args[0] && args[0].includes('@') ? args[0].replace('@','') + '@s.whatsapp.net' : null);

if (!alvo || isNaN(valor))
return reply(`Use: ${prefix}rmgold @user [valor]`);

let alvoData = obterUsuarioGold(alvo,"Usuário")
let alvoUser = alvoData.user

let golds = lerGolds()

// remover gold
golds[alvo].saldo = Math.max(0, golds[alvo].saldo - valor)

salvarGolds(golds)

reply(`❌ *${valor} Golds* foram removidos de *${alvoUser.nome}*!`,{
mentions:[alvo]
})

}
break;

case "menu": {

await reagir("🩸");

const nomeBot = data.NomeBot;
const nomeUser = info.pushName || "Usuário";
const NickDono = data.NickDono;

const textoMenu =
menu.menu(prefix, nomeUser, nomeBot, NickDono, vip);

await client.sendMessage(from, {
image: { url: "./dono/config/menu.jpg" },
caption: textoMenu.replace("@user", `@${sender.split("@")[0]}`),
mentions: [sender]
}, { quoted: info });
break;
}

/*━━━━━━━━━━━━━━━━━━━━━━━━━━
🎮 FIM DOS COMANDOS 
━━━━━━━━━━━━━━━━━━━━━━━━━━*/

default:

const sugestao = sugerirComando(comando);

if (sugestao) {

await enviar(`⛔ Ops… comando não encontrado.

💡 Talvez você quis usar:
➜ ${prefix}${sugestao}

📌 Digite ${prefix}menu e veja tudo que posso fazer.`);

} else {

await enviar(`⛔ Hm… não reconheci esse comando.

📌 Digite ${prefix}menu para explorar os comandos disponíveis.`);
}

break;

}

}


// timeout protegido
await Promise.race([
executar(),
new Promise((_, reject) =>
setTimeout(
() => reject(new Error("Timeout comando")),
COMMAND_TIMEOUT
)
)
]);

executionLock.delete(from); 

} catch (err) {

console.log("⚠ ERRO CASE:", err.message);

}


};