const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

/**
 * Sistema de Atualização Automática Global - FAATAL-MD
 * Este script verifica se há atualizações no repositório Git e as aplica.
 */

async function checkAndApplyUpdates() {
    console.log(chalk.blue('🔄 Verificando se há atualizações...'));

    try {
        // Verifica se é um repositório git
        if (!fs.existsSync(path.join(__dirname, '.git'))) {
            console.log(chalk.yellow('⚠️ [Auto-Update] Repositório Git não encontrado. O auto-update requer que o bot tenha sido clonado via Git.'));
            return false;
        }

        // Busca as alterações do remoto
        execSync('git fetch', { stdio: 'inherit' });

        // Verifica se o branch local está atrás do remoto
        const status = execSync('git status -uno').toString();
        
        if (status.includes('Your branch is behind') || status.includes('pode ser atualizado')) {
            console.log(chalk.green('✨  Nova atualização encontrada! Aplicando...'));
            
            // Faz o pull das alterações
            // Usamos --rebase para evitar commits de merge desnecessários
            // E assumimos que o usuário não mexeu nos arquivos principais (ou usamos stash se necessário)
            try {
                execSync('git pull --rebase', { stdio: 'inherit' });
                console.log(chalk.green('✅ Bot atualizado com sucesso.'));
                
                // Verifica se o package.json mudou 
                // execSync('npm install', { stdio: 'inherit' });
                
                return true; // Indica que houve atualização e o bot deve reiniciar
            } catch (pullError) {
                console.log(chalk.red('🚫 Erro ao atualizar. Tentando forçar atualização...'));
                // Se houver conflito, podemos forçar o reset para o estado do servidor
                // CUIDADO: Isso apaga alterações locais do cliente nos arquivos do bot
                // execSync('git reset --hard origin/main', { stdio: 'inherit' });
                return false;
            }
        } else {
            console.log(chalk.cyan('✅ O bot já está atualizado.'));
            return false;
        }
    } catch (error) {
        console.error(chalk.red('❌ [Auto-Update] Erro durante a verificação:'), error.message);
        return false;
    }
}

module.exports = { checkAndApplyUpdates };
