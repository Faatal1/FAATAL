const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━
🔎 VERIFICAR SE EXISTE UPDATE
━━━━━━━━━━━━━━━━━━━━━━━━━━
*/

function temAtualizacao(){

try{

execSync('git fetch',{stdio:'ignore'})

const local = execSync('git rev-parse HEAD').toString().trim()
const remote = execSync('git rev-parse origin/main').toString().trim()

return local !== remote

}catch{

return false

}

}

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━
⬇ APLICAR ATUALIZAÇÃO
━━━━━━━━━━━━━━━━━━━━━━━━━━
*/

async function checkAndApplyUpdates(){

console.log(chalk.cyan('🔎 Verificando atualizações...'))

try{

if(!fs.existsSync(path.join(__dirname,'.git'))){

console.log(chalk.yellow('⚠ Repositório git não encontrado.'))
return false

}

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━
🔒 PROTEGER DADOS DO USUÁRIO
━━━━━━━━━━━━━━━━━━━━━━━━━━
*/

try{

execSync(
"git update-index --skip-worktree dono/config/data.json",
{stdio:"ignore"}
)

execSync(
"git ls-files arquivos/config/*.json | xargs -I {} git update-index --skip-worktree {}",
{stdio:"ignore"}
)

}catch{}

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━
🔎 VERIFICAR UPDATE
━━━━━━━━━━━━━━━━━━━━━━━━━━
*/

execSync('git fetch',{stdio:'ignore'})

const local = execSync('git rev-parse HEAD').toString().trim()
const remote = execSync('git rev-parse origin/main').toString().trim()

if(local === remote){

console.log(chalk.green('✔ Bot já está atualizado.'))
return false

}

console.log(chalk.yellow('⬇ Atualização encontrada. Atualizando...'))

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━
⬇ ATUALIZAÇÃO NORMAL
━━━━━━━━━━━━━━━━━━━━━━━━━━
*/

try{

execSync('git pull origin main',{stdio:'ignore'})

execSync('npm install',{stdio:'ignore'})

console.log(chalk.green('✅ Bot atualizado com sucesso.'))

return true

}catch{

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━
🛠 FALLBACK SEGURO
━━━━━━━━━━━━━━━━━━━━━━━━━━
*/

console.log(chalk.red('⚠ Aplicando atualização segura...'))

execSync('git fetch origin main',{stdio:'ignore'})

execSync('git reset --hard origin/main',{stdio:'ignore'})

execSync('npm install',{stdio:'ignore'})

console.log(chalk.green('✅ Atualização concluída.'))

return true

}

}catch(e){

console.log(chalk.red('❌ Falha ao verificar atualização.'))
return false

}

}

module.exports = { checkAndApplyUpdates, temAtualizacao }