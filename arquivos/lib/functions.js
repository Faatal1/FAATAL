const cfonts = require("cfonts");
const fs = require("fs");
const path = require('path');
const chalk = require('chalk');
const gradient = require('gradient-string'); 


/*━━━━━━━━━━━━━━━━━━━━━━━━━━
🛡 ESTADO GLOBAL
━━━━━━━━━━━━━━━━━━━━━━━━━━*/


const watchers = new Set();


/*━━━━━━━━━━━━━━━━━━━━━━━━━━
⏳ DELAY
━━━━━━━━━━━━━━━━━━━━━━━━━━*/

function esperar(ms) {
return new Promise(r => setTimeout(r, ms));
}


/*━━━━━━━━━━━━━━━━━━━━━━━━━━
🎨 BANNER
━━━━━━━━━━━━━━━━━━━━━━━━━━*/

function mostrarBanner() {
    try {
        const banner = cfonts.render("FAATAL|MD", {
            font: "block",
            align: "center",
            gradient: ["red", "gray"],
            letterSpacing: 1
        });
        console.log(banner.string);

        // Criamos as partes com cores diferentes para dar o efeito de mistura
        const p1 = chalk.red("CRIADOR: ");
        const p2 = chalk.cyan("GUSTAVO");
        const p3 = chalk.gray(" - +556399468264");
        
        const textoPuro = "CRIADOR: GUSTAVO - +556399468264";
        
        const colunas = process.stdout.columns || 80;
        const espacos = " ".repeat(Math.max(0, (colunas - textoPuro.length) / 2));
        
        console.log(espacos + p1 + p2 + p3);
        console.log("\n");

    } catch (err) {
        console.log(chalk.red("⚠ Erro no banner:"), err.message);
    }
}


/*━━━━━━━━━━━━━━━━━━━━━━━━━━
🔥 BOOT
━━━━━━━━━━━━━━━━━━━━━━━━━━*/

async function mostrarBoot() {

try {

console.log(
chalk.red("➤ ") + chalk.blue("Iniciando módulos de segurança...\n")
);

await esperar(1200);

console.log(
chalk.red("➤ ") + chalk.cyan("Estabelecendo link com o servidor\n")
);

await esperar(1200);

mostrarBanner();

console.log(
chalk.red("➤ ") + chalk.blue("FAATAL MD ONLINE E OPERACIONAL\n")
);

} catch (err) {

console.log("⚠ Erro no boot:", err.message);

}

}





/*━━━━━━━━━━━━━━━━━━━━━━━━━━
♻ HOT RELOAD BLINDADO
━━━━━━━━━━━━━━━━━━━━━━━━━━*/

function hotReload(file) {

if (watchers.has(file)) return;

watchers.add(file);

try {

fs.watchFile(file, () => {

fs.unwatchFile(file);
watchers.delete(file);

const nome = path.basename(file);

console.log(
chalk.red(`♻ Alteração detectada em ${nome}`)
);

process.exit(0);

});

} catch (err) {

console.log("⚠ Falha hot reload:", err.message);

}

}


/*━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 EXPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━*/

module.exports = {
mostrarBoot,
mostrarBanner,
hotReload
};