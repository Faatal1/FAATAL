const readMore = String.fromCharCode(8206).repeat(4001)

// =============================
// 🕒 HORA ATUAL
// =============================
function pegarHora() {
return new Date().toLocaleTimeString("pt-BR", {
timeZone: "America/Sao_Paulo"
})
}

exports.menu = (prefix, pushname, nomeBot, NickDono, vip) => {

const hora = pegarHora()
const statusVip = vip ? '✓ ' : '✗'

return `╭━━━〔 👹 𝐅𝐀𝐀𝐓𝐀𝐋 𝐌𝐃 👹 〕━━━
┃ 🎭 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐂̧𝐎̃𝐄𝐒
╰━━━━━━━━━━━━━━━━━━━━━━

👺 𝐔𝐬𝐮𝐚́𝐫𝐢𝐨: ${pushname}
🕰️ 𝐇𝐨𝐫𝐚́𝐫𝐢𝐨: ${hora}

🩸 𝐁𝐨𝐭: ${nomeBot}
🎩 𝐃𝐨𝐧𝐨: ${NickDono}
💎 𝐕𝐢𝐩: ${statusVip}
${readMore}
╭━━━〔 ⚔️ 𝐂𝐎𝐌𝐀𝐍𝐃𝐎𝐒 ⚔️ 〕━━━
┃
┃ 🎭 ${prefix}menudono
┃ 🎭 ${prefix}menuadm
┃ 🎭 ${prefix}menudown
┃ 🎭 ${prefix}menuvip
┃ 🎭 ${prefix}menubn
┃ 🎭 ${prefix}menufig
┃
┠───〔 ⛓️ 𝐄𝐗𝐓𝐑𝐀𝐒 ⛓️ 〕───┨
┃
┃ 🩸 ${prefix}ping
┃ 🩸 ${prefix}criador
┃ 🩸 ${prefix}nick (seu nick)
┃ 🩸 ${prefix}gerarlink (marcar/img)
┃ 🩸 ${prefix}fotoperfil (@)
┃ 🩸 ${prefix}gemini (texto)
┃ 🩸 ${prefix}printsite (link do site)
┃ 🩸 ${prefix}afk (motivo)
┃ 🩸 ${prefix}infoff (ID)
┃ 🩸 ${prefix}dataconta (ID)
┃ 🩸 ${prefix}imgai (gato)
┃ 🩸 ${prefix}edits (aleatórias)
┃ 🩸 ${prefix}editjj (jujutsu)
┃ 🩸 ${prefix}editnt (naruto)
┃ 🩸 ${prefix}editff (free fire)
┃
╰━━━━━━━━━━━━━━━━━━━━━━`

}

exports.menufigu = (prefix) => {
return `╭━━━〔 👹 𝐅𝐈𝐆𝐔𝐑𝐈𝐍𝐇𝐀𝐒 👹 〕━━━
┃ 🎭 𝐀𝐑𝐓𝐄𝐒 & 𝐒𝐓𝐈𝐂𝐊𝐄𝐑𝐒
╰━━━━━━━━━━━━━━━━━━━━━━
┃
┃ 👺 ${prefix}s (marcar/img)
┃ 👺 ${prefix}sticker (marcar/img)
┃ 👺 ${prefix}take (marcar/fig)
┃ 👺 ${prefix}rename (marcar/fig)
┃ 👺 ${prefix}toimg (marcar/fig)
┃ 👺 ${prefix}figuperfil
┃ 👺 ${prefix}togif marcar/fig)
┃ 👺 ${prefix}brat (frase)
┃ 👺 ${prefix}bratvid (frase 1/ frase 2)
┃ 👺 ${prefix}atp (frase)
┃ 👺 ${prefix}attp (frase)
┃ 👺 ${prefix}figbts
┃ 👺 ${prefix}fig18
┃ 👺 ${prefix}figaleatori
┃ 👺 ${prefix}figemoji
┃ 👺 ${prefix}figraiva
┃ 👺 ${prefix}figcoreana
┃ 👺 ${prefix}figdesenho
┃ 👺 ${prefix}figmeme
┃ 👺 ${prefix}figroblox
┃ 👺 ${prefix}figanime
┃
╰━━━━━━━━━━━━━━━━━━━━━━`;
}

exports.menubn = (prefix) => {
return `╭━━━〔 👹 𝐁𝐑𝐈𝐍𝐂𝐀𝐃𝐄𝐈𝐑𝐀𝐒 👹 〕━━━
┃ 🎭 𝐃𝐈𝐕𝐄𝐑𝐒𝐀̃𝐎 & 𝐆𝐀𝐌𝐄𝐒
╰━━━━━━━━━━━━━━━━━━━━━━
┃
┃ 🃏 ${prefix}casal
┃ 🃏 ${prefix}rankputa
┃ 🃏 ${prefix}rankgay
┃ 🃏 ${prefix}rankinteligente 
┃ 🃏 ${prefix}rankrico
┃ 🃏 ${prefix}rankpobre
┃ 🃏 ${prefix}rankego
┃ 🃏 ${prefix}rankpegador
┃ 🃏 ${prefix}rankgado
┃ 🃏 ${prefix}rankcorno
┃ 🃏 ${prefix}comer (@)
┃ 🃏 ${prefix}espancar (@)
┃ 🃏 ${prefix}matar (@)
┃ 🃏 ${prefix}gado (@)
┃ 🃏 ${prefix}tapa (@)
┃
╰━━━━━━━━━━━━━━━━━━━━━━`;
};

exports.menudown = (prefix) => {
return `╭━━━〔 👹 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐒 👹 〕━━━
┃ 🎭 𝐌𝐈́𝐃𝐈𝐀𝐒 & 𝐒𝐎𝐂𝐈𝐀𝐋
╰━━━━━━━━━━━━━━━━━━━━━━
┃
┃ 🩸 ${prefix}play/p (nome)
┃ 🩸 ${prefix}tiktok (link)
┃ 🩸 ${prefix}ytmp3 (link)
┃ 🩸 ${prefix}ytmp4 (link)
┃ 🩸 ${prefix}Pinterest (nome)
┃ 🩸 ${prefix}insta (link)
┃ 🩸 ${prefix}tiktok2 (nome)
┃ 🩸 ${prefix}ttkmusic (nome)
┃
╰━━━━━━━━━━━━━━━━━━━━━━`;
};

exports.menudono = (prefix) => {
return `╭━━━〔 👹 𝐌𝐄𝐍𝐔 𝐃𝐎𝐍𝐎 👹 〕━━━
┃ 🎭 𝐂𝐎𝐍𝐓𝐑𝐎𝐋𝐄 𝐓𝐎𝐓𝐀𝐋
╰━━━━━━━━━━━━━━━━━━━━━━
┃
┃ 🎩 ${prefix}fotobot
┃ 🎩 ${prefix}revelar 
┃ 🎩 ${prefix}criargp
┃ 🎩 ${prefix}listavip
┃ 🎩 ${prefix}servip
┃ 🎩 ${prefix}addvip (@)
┃ 🎩 ${prefix}rmvip (@)
┃ 🎩 ${prefix}faatal on/off
┃ 🎩 ${prefix}boton/off
┃ 🎩 ${prefix}setprefix
┃ 🎩 ${prefix}nomedono
┃ 🎩 ${prefix}nomebot
┃ 🎩 ${prefix}aluguelglobal
┃ 🎩 ${prefix}addaluguel
┃ 🎩 ${prefix}rmaluguel
┃ 🎩 ${prefix}bcgp (aviso)
┃ 🎩 ${prefix}blockia
┃ 🎩 ${prefix}desblockia
┃ 🎩 ${prefix}blockcmd
┃ 🎩 ${prefix}unblockcmd
┃ 🎩 ${prefix}listblockcmd
┃ 🎩 ${prefix}reiniciar
┃ 🎩 ${prefix}setprefixgp
┃
╰━━━━━━━━━━━━━━━━━━━━━━`;
};

exports.menuadm = (prefix) => {
return `╭━━━〔 👹 𝐀𝐃𝐌𝐈𝐍𝐈𝐒𝐓𝐑𝐀𝐂̧𝐀̃𝐎 👹 〕━━━
┃ 🎭 𝐆𝐄𝐒𝐓𝐀̃𝐎 𝐃𝐄 𝐆𝐑𝐔𝐏𝐎𝐒
╰━━━━━━━━━━━━━━━━━━━━━━
┃
┃ ☠️ ${prefix}transmitir
┃ ☠️ ${prefix}bemvindo 1/0
┃ ☠️ ${prefix}autosticker 1/0
┃ ☠️ ${prefix}tm
┃ ☠️ ${prefix}infogp
┃ ☠️ ${prefix}regras
┃ ☠️ ${prefix}linkgp
┃ ☠️ ${prefix}marcar
┃ ☠️ ${prefix}tmadms
┃ ☠️ ${prefix}adms
┃ ☠️ ${prefix}ban (@)
┃ ☠️ ${prefix}mutar (@)
┃ ☠️ ${prefix}desmutar (@)
┃ ☠️ ${prefix}add (5563...)
┃ ☠️ ${prefix}alg 1/0
┃ ☠️ ${prefix}promover (@)
┃ ☠️ ${prefix}rebaixar (@)
┃ ☠️ ${prefix}adverter (@)
┃ ☠️ ${prefix}rmadv (@)
┃ ☠️ ${prefix}banirfigu (marcar/fig)
┃ ☠️ ${prefix}desbanfigu (marcar/fig)
┃
┠───〔 🛡️ 𝐏𝐑𝐎𝐓𝐄𝐂̧𝐀̃𝐎 〕───┨
┃
┃ 🛡️ ${prefix}antiaudio on/off
┃ 🛡️ ${prefix}antivideo on/off
┃ 🛡️ ${prefix}antimg on/off
┃ 🛡️ ${prefix}antifigu on/off
┃ 🛡️ ${prefix}antipalavrao on/off
┃ 🛡️ ${prefix}antibot on/off
┃ 🛡️ ${prefix}antilink on/off
┃ 🛡️ ${prefix}antilinkgp on/off
┃ 🛡️ ${prefix}antispam on/off
┃
╰━━━━━━━━━━━━━━━━━━━━━━`;
};

exports.menuvip = (prefix) => {
return `╭━━━〔 👹 𝐕𝐈𝐏 & 𝐂𝐎𝐍𝐒𝐔𝐋𝐓𝐀𝐒 👹 〕━━━
┃ 🎭 𝐏𝐀𝐈𝐍𝐄𝐋 𝐄𝐗𝐂𝐋𝐔𝐒𝐈𝐕𝐎
╰━━━━━━━━━━━━━━━━━━━━━━
┃
┃ 💎 ${prefix}plaq (nome)
┃ 💎 ${prefix}plaq1 (nome)
┃ 💎 ${prefix}plaq2 (nome)
┃ 💎 ${prefix}plaq3 (nome)
┃ 💎 ${prefix}plaq4 (nome)
┃ 💎 ${prefix}plaq5 (nome)
┃ 💎 ${prefix}plaq6 (nome)
┃ 💎 ${prefix}plaq7 (nome)
┃ 💎 ${prefix}plaq8 (nome)
┃ 💎 ${prefix}plaq9 (nome)
┃ 💎 ${prefix}porn
┃ 💎 ${prefix}porn2
┃ 💎 ${prefix}cpf
┃ 💎 ${prefix}nome
┃ 💎 ${prefix}nome2
┃ 💎 ${prefix}placa
┃ 💎 ${prefix}rg
┃ 💎 ${prefix}telefone
┃ 💎 ${prefix}cep
┃ 💎 ${prefix}ddd
┃ 💎 ${prefix}score
┃ 💎 ${prefix}serasa
┃ 💎 ${prefix}bin
┃ 💎 ${prefix}cnpj
┃ 💎 ${prefix}gerarcpf
┃
╰━━━━━━━━━━━━━━━━━━━━━━`;
}


