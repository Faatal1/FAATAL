const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const { spawn } = require('child_process');
const fs = require('fs');
const crypto = require('crypto');
const WebP = require('node-webpmux'); // Biblioteca leve para Termux

function tmp(ext) {
    return `./tmp/${crypto.randomBytes(5).toString('hex')}${ext}`;
}

// Função auxiliar para baixar a mídia
async function getFileBuffer(msg, type) {
    const stream = await downloadContentFromMessage(msg, type);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
    }
    return buffer;
}

// ⚙️ GERADOR DE METADADOS (O SEGREDO DO NOME)
// Cria o buffer EXIF necessário para o WhatsApp ler o nome
async function createExif(pack, author) {
    const json = {
        "sticker-pack-id": "com.snow.sticker",
        "sticker-pack-name": pack,
        "sticker-pack-publisher": author,
        "emojis": ["❄️"]
    };

    const exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00]);
    const jsonBuffer = Buffer.from(JSON.stringify(json), "utf-8");
    const exif = Buffer.concat([exifAttr, jsonBuffer]);
    
    // Adiciona o tamanho do JSON no buffer (Little Endian)
    exif.writeUIntLE(jsonBuffer.length, 14, 4); 
    return exif;
}

// 📸 IMAGEM → STICKER (COM NOME)
async function sendImageAsSticker2(client, jid, buffer, quoted, opts = {}) {
    const input = tmp('.jpg');
    const output = tmp('.webp');
    
    try {
        fs.writeFileSync(input, buffer);

        // 1. Converter usando FFmpeg (Rápido e Estável)
        await new Promise((resolve, reject) => {
            spawn('ffmpeg', [
                '-y', '-i', input,
                '-vf', 'scale=512:-1:flags=lanczos',
                '-vcodec', 'libwebp',
                '-lossless', '1',
                '-loop', '0',
                '-preset', 'default',
                '-an', '-vsync', '0',
                '-s', '512:512',
                output
            ]).on('close', code => code === 0 ? resolve() : reject(code));
        });

        // 2. Adicionar o Nome (Metadados) usando node-webpmux
        const img = new WebP.Image();
        await img.load(output);
        img.exif = await createExif(opts.packname || 'Pacote', opts.author || 'Bot');
        const stickerBuffer = await img.save(null);

        // 3. Enviar
        await client.sendMessage(jid, { sticker: stickerBuffer }, { quoted });

    } catch (e) {
        console.error("Erro no Sticker:", e);
        throw e;
    } finally {
        if (fs.existsSync(input)) fs.unlinkSync(input);
        if (fs.existsSync(output)) fs.unlinkSync(output);
    }
}

// 🎬 VÍDEO → STICKER (COM NOME)
async function sendVideoAsSticker2(client, jid, buffer, quoted, opts = {}) {
    const input = tmp('.mp4');
    const output = tmp('.webp');

    try {
        fs.writeFileSync(input, buffer);

        // 1. Converter vídeo para WebP Animado
        await new Promise((resolve, reject) => {
            spawn('ffmpeg', [
                '-y', '-i', input,
                '-vf', 'scale=512:-1,fps=15', // FPS 15 para não ficar pesado
                '-loop', '0',
                '-ss', '00:00:00',
                '-t', '00:00:06', // Corta em 6 segundos
                '-preset', 'default',
                '-an', '-vsync', '0',
                '-s', '512:512',
                output
            ]).on('close', code => code === 0 ? resolve() : reject(code));
        });

        // 2. Adicionar o Nome
        const img = new WebP.Image();
        await img.load(output);
        img.exif = await createExif(opts.packname || 'Pacote', opts.author || 'Bot');
        const stickerBuffer = await img.save(null);

        // 3. Enviar
        await client.sendMessage(jid, { sticker: stickerBuffer }, { quoted });

    } catch (e) {
        console.error("Erro no Sticker Animado:", e);
        throw e;
    } finally {
        if (fs.existsSync(input)) fs.unlinkSync(input);
        if (fs.existsSync(output)) fs.unlinkSync(output);
    }
}

module.exports = { getFileBuffer, sendImageAsSticker2, sendVideoAsSticker2 };
