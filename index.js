//━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🛡 PROTEÇÃO GLOBAL
//━━━━━━━━━━━━━━━━━━━━━━━━━━

process.on("unhandledRejection", console.error);
process.on("uncaughtException", console.error);



/*━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 MÓDULOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/

const {
default: makeWASocket,
useMultiFileAuthState,
fetchLatestBaileysVersion,
Browsers,
DisconnectReason,
downloadContentFromMessage
} = require('@whiskeysockets/baileys');

const pino = require('pino');
const readline = require('readline');
const chalk = require('chalk');
const gradient = require('gradient-string');


const data = require('./dono/config/data.json');

let caseHandler = require('./case');

const {
hotReload,
mostrarBoot,
iniciarSpinner,
finalizarSpinner
} = require('./arquivos/lib/functions');

const { checkAndApplyUpdates } = require('./autoupdate');



const fs = require('fs')
if (!fs.existsSync('./tmp')) fs.mkdirSync('./tmp');

const path = require('path');

const caminhoPrefixos = path.join(__dirname, 'arquivos/config/prefixos.json');

function lerPrefixos() {
    if (!fs.existsSync(caminhoPrefixos)) return {};
    return JSON.parse(fs.readFileSync(caminhoPrefixos));
}

function getPrefix(from, isGroup) {
    const prefixos = lerPrefixos();

    if (isGroup && prefixos[from]) {
        return prefixos[from];
    }

    const config = JSON.parse(fs.readFileSync('./dono/config/data.json'));
return config.prefix; 
}

if (!fs.existsSync('./tmp')) {
fs.mkdirSync('./tmp')
}




function lerHorario() {
    const caminho = "./arquivos/config/horario_gp.json";
    if (!fs.existsSync(caminho)) return {};
    return JSON.parse(fs.readFileSync(caminho));
}

//━━━━━━━━━━━━━━━━━━
// 🎨 DESIGN DO PACK
//━━━━━━━━━━━━━━━━━━

function criarPackInfo(pushname, nomeGrupo, data) {

    const botNome = data.NomeBot || "FAATAL MD";
    const dono = data.NickDono || "GUSTA";

    return {
        packname:
`✧ Criado por: 💖
『 ${botNome} 』

✧ Dono: 👑
『 ${dono} 』
────────────
`,
        author:
`✧ Solicitado por: 💎
『 ${pushname} 』

✧ Grupo: 🌌
『 ${nomeGrupo} 』`
    };
}


/*━━━━━━━━━━━━━━━━━━━━━━━━━━
🛡 BLINDAGEM GLOBAL
━━━━━━━━━━━━━━━━━━━━━━━━━━*/

process.on('uncaughtException', err => {
console.log('💥 ERRO CRÍTICO:', err.message);
});

process.on('unhandledRejection', err => {
console.log('⚠ PROMISE NÃO TRATADA:', err);
});

console.debug = () => {};
console.info = () => {};

const messageCache = new Set();

setInterval(() => {
messageCache.clear();
}, 60_000);

setInterval(() => {
const mem = process.memoryUsage().heapUsed / 1024 / 1024;
if (mem > 500) {
console.log(`⚠ Uso de memória alto: ${mem.toFixed(2)}MB`);
}
}, 30_000);


/*━━━━━━━━━━━━━━━━━━━━━━━━━━
⚙ CONFIG
━━━━━━━━━━━━━━━━━━━━━━━━━━*/


let jaPareou = false;
let reconectando = false;
let delayReconexao = 2000;

global.botLigado = false;

/*━━━━━━━━━━━━━━━━━━━━━━━━━━
🧹 LIMPEZA INTELIGENTE DE SESSÃO
━━━━━━━━━━━━━━━━━━━━━━━━━━*/

function limparSessoesAntigas() {
    // Só roda se o bot estiver online
    if (!global.botLigado) return;

    const pasta = './sessao';
    const AGORA = Date.now();

    // Remove arquivos com mais de 24h
    const LIMITE_TEMPO = 24 * 60 * 60 * 1000;

    // Limite máximo de arquivos permitidos
    const LIMITE_ARQUIVOS = 800;

    try {
        if (!fs.existsSync(pasta)) return;

        let arquivos = fs.readdirSync(pasta);

        // 🔒 Nunca mexer no arquivo principal de credenciais
        arquivos = arquivos.filter(a => !a.includes('creds.json'));

        // 🧹 LIMPEZA POR TEMPO
        arquivos.forEach(arquivo => {
            const caminho = `${pasta}/${arquivo}`;
            const stats = fs.statSync(caminho);
            const idade = AGORA - stats.mtimeMs;

            if (idade > LIMITE_TEMPO) {
                fs.unlinkSync(caminho);
                console.log(`🧹 Removido por tempo: ${arquivo}`);
            }
        });

        // 🔄 Atualiza lista depois da limpeza por tempo
        arquivos = fs.readdirSync(pasta)
            .filter(a => !a.includes('creds.json'))
            .map(a => ({
                nome: a,
                tempo: fs.statSync(`${pasta}/${a}`).mtimeMs
            }))
            .sort((a, b) => a.tempo - b.tempo); // mais antigo primeiro

        // 🧹 LIMPEZA POR QUANTIDADE (se ultrapassar limite)
        if (arquivos.length > LIMITE_ARQUIVOS) {
            const excesso = arquivos.length - LIMITE_ARQUIVOS;

            for (let i = 0; i < excesso; i++) {
                const caminho = `${pasta}/${arquivos[i].nome}`;
                fs.unlinkSync(caminho);
                console.log(`🗑 Removido por excesso: ${arquivos[i].nome}`);
            }
        }

    } catch (err) {
        console.log("⚠ Erro na limpeza automática:", err.message);
    }
}

// ⏱ Executa a cada 1 hora
setInterval(() => {
    limparSessoesAntigas();
}, 60 * 60 * 1000);


/*━━━━━━━━━━━━━━━━━━━━━━━━━━
⏱ CONTROLE DE INÍCIO DO BOT
━━━━━━━━━━━━━━━━━━━━━━━━━━*/

const BOT_START_TIME = Math.floor(Date.now() / 1000);


/*━━━━━━━━━━━━━━━━━━━━━━━━━━
⚒ UTIL
━━━━━━━━━━━━━━━━━━━━━━━━━━*/

const rl = readline.createInterface({
input: process.stdin,
output: process.stdout
});

const question = text =>
new Promise(resolve => rl.question(text, resolve));



/*━━━━━━━━━━━━━━━━━━━━━━━━━━
🧾 LOG DO SISTEMA
━━━━━━━━━━━━━━━━━━━━━━━━━━*/

function logMensagem(info, body, isGroup, prefix) {

const nome = info.pushName || "Desconhecido";
const numero = info.key.remoteJid.split("@")[0];
const hora = new Date().toLocaleTimeString("pt-BR");

// Pega o nome real do grupo corretamente
const grupoNome = isGroup && info.chat
? info.chat.name
: null;

const comando = body.startsWith(prefix)
? body.slice(prefix.length).split(" ")[0]
: null;

const vermelho = chalk.hex("#b11226");
const cinza = chalk.hex("#444");
const branco = chalk.white;

console.log("\n" + cinza("╭──────────────────────────────────────────────╮"));

console.log(
cinza("│ ") +
vermelho.bold("FAATAL MD") +
chalk.gray("  •  Registro de atividade")
);

console.log(cinza("├──────────────────────────────────────────────┤"));

console.log(
cinza("│ ") +
chalk.gray("Horário: ") + branco(hora) +
chalk.gray("   |   Tipo: ") +
vermelho(isGroup ? "Grupo" : "Privado")
);

// Usuário + grupo na mesma linha
console.log(
cinza("│ ") +
chalk.gray("Usuário: ") +
branco(nome) +
(isGroup && grupoNome
? chalk.gray("  (") + branco(grupoNome) + chalk.gray(")")
: "")
);

console.log(
cinza("│ ") +
chalk.gray("Número:  ") + vermelho(numero)
);

if (comando) {
console.log(cinza("├──────────────────────────────────────────────┤"));
console.log(
cinza("│ ") +
chalk.gray("Comando: ") +
chalk.black.bgHex("#b11226").bold(` ${prefix + comando} `)
);
}

console.log(cinza("├──────────────────────────────────────────────┤"));

console.log(
cinza("│ ") +
chalk.gray("Mensagem: ") + branco(body)
);

console.log(cinza("╰──────────────────────────────────────────────╯\n"));

}



/*━━━━━━━━━━━━━━━━━━━━━━━━━━
🤖 BOT
━━━━━━━━━━━━━━━━━━━━━━━━━━*/

async function ligarbot() {

if (global.botLigado) {
console.log("⚠ Socket já ativo — ignorando duplicação");
return;
}

// 🔄 VERIFICAÇÃO DE ATUALIZAÇÕES 
// Se houver atualização, o bot faz o pull e encerra o processo para o start.sh reiniciar
const updated = await checkAndApplyUpdates();
if (updated) {
    console.log(chalk.green('🚀 [Auto-Update] Reiniciando o bot para aplicar as novas alterações...'));
    process.exit(0); // O loop no start.sh cuidará do reinício
}


global.botLigado = true;

const { state, saveCreds } =
await useMultiFileAuthState('./sessao');

const { version } =
await fetchLatestBaileysVersion();

const client = makeWASocket({
version,
auth: state,
logger: pino({ level: 'silent' }),
browser: Browsers.ubuntu('Chrome'),
printQRInTerminal: false
});

client.ev.on('creds.update', saveCreds);


    /*━━━━━━━━━━━━━━━━━━
    📧 MENSAGENS
    ━━━━━━━━━━━━━━━━━━*/

    client.ev.on('messages.upsert', async ({ messages }) => {
        try {
            const info = messages[0];
            if (!info || !info.message) return;

            // 🚫 ignora backlog de mensagens antigas
            const msgTime = info.messageTimestamp || 0;
            if (msgTime < BOT_START_TIME) return;

            const msgId = info.key.id;
            if (messageCache.has(msgId)) return;
            messageCache.add(msgId);

            let body = "";
            if (info.message?.conversation) body = info.message.conversation;
            else if (info.message?.extendedTextMessage?.text) body = info.message.extendedTextMessage.text;
            else if (info.message?.imageMessage) body = "[imagem]";
            else if (info.message?.videoMessage) body = "[vídeo]";
            else if (info.message?.stickerMessage) body = "[figurinha]";
            else if (info.message?.audioMessage) body = "[áudio]";
            else return;

            const isGroup = info.key.remoteJid.endsWith("@g.us");
            const prefix = getPrefix(info.key.remoteJid, isGroup);

           
            logMensagem(info, body, isGroup, prefix);

///━━━━━━━━━━━━━━━━━━
       // 🧩 AUTO STICKER ENGINE
        //━━━━━━━━━━━━━━━━━━
            const processarAutoSticker = async () => {
                try {
                    if (!info.key || !info.key.remoteJid) return;
                    const jid = info.key.remoteJid;
                    const autoPath = "./arquivos/config/autosticker.json";
                    if (!fs.existsSync(autoPath)) return;

                    const dbAuto = JSON.parse(fs.readFileSync(autoPath));
                    if (!isGroup || !dbAuto[jid]) return;

                    const msg = info.message;
                    if (!msg || msg.viewOnceMessageV2) return;

                    const image = msg.imageMessage;
                    const video = msg.videoMessage;
                    if (msg.stickerMessage) return;

                    const { getFileBuffer, sendImageAsSticker2, sendVideoAsSticker2 } = require('./arquivos/lib/sticker-utils');
                    const pushname = info.pushName || "Usuário";
                    
                    let nomeGrupo = "Grupo";
                    try {
                        const metadata = await client.groupMetadata(jid);
                        nomeGrupo = metadata.subject || "Grupo";
                    } catch {}

                    const packInfo = criarPackInfo(pushname, nomeGrupo, data);

                    if (image) {
                        const buffer = await getFileBuffer(image, 'image');
                        if (buffer) await sendImageAsSticker2(client, jid, buffer, info, packInfo);
                        return;
                    }

                    if (video) {
                        const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
                        const stream = await downloadContentFromMessage(video, 'video');
                        let buffer = Buffer.from([]);
                        for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
                        
                        if (!buffer.length) return;

                        const tmpDir = "./tmp";
                        if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

                        const tempIn = path.join(tmpDir, `in_${Date.now()}.mp4`);
                        const tempOut = path.join(tmpDir, `out_${Date.now()}.mp4`);
                        fs.writeFileSync(tempIn, buffer);

                        const { exec } = require('child_process');
                        await new Promise((resolve, reject) => {
                            exec(`ffmpeg -y -i "${tempIn}" -t 10 -an -vf "fps=15,scale=512:512:force_original_aspect_ratio=decrease" "${tempOut}"`, 
                            err => err ? reject(err) : resolve());
                        });

                        const finalBuffer = fs.readFileSync(tempOut);
                        await sendVideoAsSticker2(client, jid, finalBuffer, info, packInfo);
                        fs.unlinkSync(tempIn);
                        fs.unlinkSync(tempOut);
                    }
                } catch (e) {
                    console.log("AUTO STICKER:", e);
                }
            };

            // Executa o auto-sticker de forma segura
            processarAutoSticker();

            // EXECUTAR CASOS E COMANDOS
            await Promise.race([
                caseHandler(client, info, prefix),
                new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout handler")), 15000))
            ]);

        } catch (err) {
            console.log("⚠ ERRO NO HANDLER:", err.message);
        }
    });



/*━━━━━━━━━━━━━━━━━━
🌐 CONEXÃO
━━━━━━━━━━━━━━━━━━*/

client.ev.on('connection.update', async update => {

const { connection, lastDisconnect, qr } = update;

if (qr && !client.authState.creds.registered && !jaPareou) {

jaPareou = true;

                        // ─── 🔗 INTERFACE DE CONEXÃO ───
            console.log(chalk.cyan.bold("\n┌── PAREAMENTO DE DISPOSITIVO ──────────┐"));
            console.log(chalk.cyan.bold("│") + chalk.white("  Digite o número com DDI e DDD        ") + chalk.cyan.bold("│"));
            console.log(chalk.cyan.bold("│") + chalk.gray("  Exemplo: 556399468264                ") + chalk.cyan.bold("│"));
            console.log(chalk.cyan.bold("└───────────────────────────────────────┘\n"));

            const numero = await question(chalk.cyan("➤ Digite o número: "));
            const limpo = numero.replace(/\D/g, "");

            let code = await client.requestPairingCode(limpo);
            code = code?.match(/.{1,4}/g)?.join("-");

            console.log(chalk.gray("\n╭── CÓDIGO GERADO ──────────────────────╮"));
            console.log(chalk.gray("│") + chalk.white.bold(`   ${code}   `) + chalk.gray("│"));
            console.log(chalk.gray("╰───────────────────────────────────────╯\n"));

            console.log(
                chalk.gray("\n╭── STATUS ─────────────────────────────╮")
            );
            console.log(
                chalk.gray("│") + chalk.white("  Aguardando conexão com o WhatsApp... ") + chalk.gray("│")
            );
            console.log(
                chalk.gray("╰───────────────────────────────────────╯\n")
            );

            if (typeof iniciarSpinner === "function") {
                iniciarSpinner();
            }
        }

        if (connection === 'open') {
            delayReconexao = 2000;
            reconectando = false;
                
            
            await mostrarBoot();


//━━━━━━━━━━━━━━━━━━
// FUNÇÃO PARA LER HORÁRIO 
//━━━━━━━━━━━━━━━━━━

setInterval(async () => {

    const db = lerHorario();

    const agora = new Date();
    const horaAtual =
        String(agora.getHours()).padStart(2, "0") +
        ":" +
        String(agora.getMinutes()).padStart(2, "0");

    for (const grupo in db) {

        try {

            // 🔒 FECHAR GRUPO
            if (db[grupo].fechar === horaAtual) {

                const fs = require("fs");

                await client.groupSettingUpdate(
                    grupo,
                    "announcement"
                );

                const caminhoGif = "./arquivos/fotos/fechargp.mp4";

                if (fs.existsSync(caminhoGif)) {

                    await client.sendMessage(grupo, {
                        video: fs.readFileSync(caminhoGif),
                        gifPlayback: true,
                        caption:
`🔒 O grupo foi fechado automaticamente.
⏰ Horário programado atingido.`
                    });

                } else {

                    await client.sendMessage(grupo, {
                        text:
`🔒 O grupo foi fechado automaticamente.
⏰ Horário programado atingido.`
                    });

                }

            }

            // 🔓 ABRIR GRUPO
            if (db[grupo].abrir === horaAtual) {

                await client.groupSettingUpdate(
                    grupo,
                    "not_announcement"
                );

                await client.sendMessage(grupo, {
                    text:`🔓 Grupo aberto automaticamente.`
                });

            }

        } catch (err) {
            console.log("Erro no sistema de horário:", err);
        }

    }

}, 60000);


//━━━━━━━━━━━━━━━━━━
// 👋 BOAS-VINDAS AUTOMÁTICAS
//━━━━━━━━━━━━━━━━━━

client.ev.on('group-participants.update', async (update) => {
try {

const { id, participants, action } = update
if (action !== 'add') return

const fs = require('fs')

const ativado = "./arquivos/config/bemvindo.json"
const fotoDB = "./arquivos/config/fotobv.json"
const legendaDB = "./arquivos/config/legendabv.json"

if (!fs.existsSync(ativado)) return

const db = JSON.parse(fs.readFileSync(ativado))
if (!db[id]) return

const metadata = await client.groupMetadata(id)
const nomeGrupo = metadata.subject
const regras = metadata.desc || "Sem regras definidas."

let legenda = "👋 Olá {user}, seja bem vindo ao grupo *{grupo}*!"

if (fs.existsSync(legendaDB)) {
const ldb = JSON.parse(fs.readFileSync(legendaDB))
if (ldb[id]) legenda = ldb[id]
}

let foto = null

if (fs.existsSync(fotoDB)) {
const fdb = JSON.parse(fs.readFileSync(fotoDB))
if (fdb[id]) foto = fdb[id]
}

for (let user of participants) {

let mensagem = legenda
.replace(/{user}/g, `@${user.split("@")[0]}`)
.replace(/{grupo}/g, nomeGrupo)
.replace(/{regras}/g, regras)

if (foto && fs.existsSync(foto)) {

await client.sendMessage(id,{
image:{ url: foto },
caption: mensagem,
mentions:[user]
})

} else {

const avatar = await client.profilePictureUrl(user,'image')
.catch(()=> 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png')

const config = require('./dono/config/data.json')
const apikey = config.apikey2

const url = `https://tokito-apis.site/canvas/welcome?fundo=https://tokito-apis.site/6b9dbb.jpg&avatar=${encodeURIComponent(avatar)}&titulo=Bem-vindo!&sub=Novo+Membro&apikey=${apikey}`

await client.sendMessage(id,{
image:{ url },
caption: mensagem,
mentions:[user]
})

}

}

} catch(err){
console.log("Erro boas vindas:", err)
}
})

//━━━━━━━━━━━━━━━━━━
// 🔄 DETECTAR RESTART
//━━━━━━━━━━━━━━━━━━

const restartPath = "./dono/config/restart.json";

if (fs.existsSync(restartPath)) {
const dataRestart = JSON.parse(fs.readFileSync(restartPath));

if (dataRestart?.ativo && dataRestart?.chat) {

setTimeout(async () => {
await client.sendMessage(dataRestart.chat, {
text: "✅ Sistema reiniciado com sucesso."
}, {
quoted: dataRestart.quoted
});

fs.unlinkSync(restartPath);

}, 3000);

}
}

            if (typeof finalizarSpinner === "function") {
                finalizarSpinner();
            }
        }

     if (connection === 'close') {
        global.botLigado = false;

        const status = lastDisconnect?.error?.output?.statusCode;

        if (status === DisconnectReason.loggedOut) {
            console.log(chalk.red("\n✖ Sessão encerrada/Desconectada."));

            try {
                const fs = require('fs');
                const path = './sessao';

                if (fs.existsSync(path)) {
                    fs.rmSync(path, { recursive: true, force: true });
                    console.log(chalk.green("✔ Pasta 'sessao' apagada automaticamente."));
                }
            } catch (err) {
                console.log(chalk.red("⚠ Erro ao remover pasta de sessão:"), err.message);
            }

            process.exit(0);

        } else {
            console.log(chalk.yellow("🔁 Conexão perdida. Tentando reconectar..."));
            reconectarBot();
        }
    }
});

} 

/*━━━━━━━━━━━━━━━━━━━━━━━━━━
🔁 RECONEXÃO
━━━━━━━━━━━━━━━━━━━━━━━━━━*/

async function reconectarBot() {

if (reconectando) return;

reconectando = true;


while (true) {

await new Promise(r =>
setTimeout(r, delayReconexao));

try {

await ligarbot();

delayReconexao = 2000;
reconectando = false;

break;

} catch {

delayReconexao =
Math.min(delayReconexao * 1.5, 15000);

console.log("⚠ Falha — tentando novamente...");

}

}

}


/*━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 BOOT
━━━━━━━━━━━━━━━━━━━━━━━━━━*/

async function start() {
ligarbot();
}

start();


/*━━━━━━━━━━━━━━━━━━━━━━━━━━
🌀 HOT RELOAD
━━━━━━━━━━━━━━━━━━━━━━━━━━*/

hotReload(require.resolve('./case'), () => {
caseHandler = require('./case');
});

hotReload(require.resolve('./menu/menus'));
hotReload(require.resolve('./arquivos/lib/functions'));
hotReload(require.resolve('./dono/config/data')) ;
