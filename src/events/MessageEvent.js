// Coisas Importantes
const {client} = require("../../bot.js");
const config = require("../config.json");
const Discord = require('discord.js')
const c = require('colors')
// Arquivos
const bldb = require("../mongodb/blacklist.js");
const dc = require('../mongodb/dc.js')
const pr = require("../mongodb/prefix");
const autorole = require('../mongodb/autorole.js');
const welcomeChannel = require('../mongodb/WelcomeChannel.js');
const logChannel = require('../mongodb/messagelog.js');
const economy = require("../mongodb/economy.js");
const antilink = require('../mongodb/antilink');
const user = require('../mongodb/user.js');
const emoji = require('../jsons/emojis.json')
const barrar = new Set();
// Inicio do Code
client.on('message', message => {
  if (message.author.bot) return;
  if (message.channel.type === "dm") return;

  if (message.mentions.has(client.user)) {
    message.react('800474308996104222')
  }

  pr.findOne({name: "prefix", preid: message.guild.id}).then(res => {
    let prefix = res ? res.prefix : config.prefix;
  if (message.content.startsWith(prefix)) {
        message.quote(`<a:alerta:763434977412120586> | ${message.author} Você está usando a versão experimental da Star:tm:. Várias funcionalidades podem não funcionar, posso ficar offline a qualquer momento, seu servidor pode explodir e muito mais! Não reporte problemas da versão experimental caso não seja solicitado, obrigada!`).then(msg => {
          msg.delete({timeout:5000})
        })
  }
})
});

client.on("message", message => {
  // If's
  if (message.author.bot) return;
  if (message.channel.type === "dm") return;
  antilink.findOne({_id:message.guild.id}, (err, anti) => {
    if(anti){
      if (message.author.bot) return;
      if (message.channel.type === "dm") return;
      if (message.member.permissions.has("MANAGE_GUILD")) return;
      if (message.content.toLowerCase().includes("https://")){
      console.log(c.bold(`[ANTILINK] - Antilink: ${message.guild.name}`))
      message.delete()
      message.reply('você não pode enviar links aqui!')
      }
      if (message.content.toLowerCase().includes("http://")){
      console.log(c.bold(`[ANTILINK] - Antilink: ${message.guild.name}`))
      message.delete()
      message.reply('você não pode enviar links aqui!')
      }
      if (message.content.toLowerCase().includes("www.")){
      console.log(c.bold(`[ANTILINK] - Antilink: ${message.guild.name}`))
      message.delete()
      message.reply('você não pode enviar links aqui!')
      }
    }
})
  // Custom Prefix
  pr.findOne({name: "prefix", preid: message.guild.id}).then(res => {
    let prefix = res ? res.prefix : config.prefix;
    if(message.content.toLowerCase().includes(`<@!${client.user.id}>`) || message.content.toLowerCase().includes(`<@${client.user.id}>`)){
      return message.quote(`<a:Rosa_seta_pg:754374503001358467> Olá, ${message.author}! Meu prefixo atual é \`${prefix}\` para ver meus comandos use \`${prefix}ajuda\``)}
  if (!message.content.startsWith(prefix)) return;
  user.findOne({id:message.author.id}, (err, db) => {
    if(db) return;
    if(!db) {
      new user({
        id:message.author.id,
        sobre:`Eu Amo a star, você pode alterar isso com s!sobremim`,
        votos:'0',
        perfil:'https://media.discordapp.net/attachments/723135372737118349/727278263784964217/unknown.png?width=1004&height=564'
      }).save().catch(console.error);
      message.quote(`<a:Rosa_seta_pg:754374503001358467> ${message.author}, aparentemente você não tinha uma conta em meu banco de dados, acabei de criar uma, caso queira deletar ultilize: \`${prefix}removerconta\`, ultilize o comando: \`${message.content}\` novamente!`)
    }
  })
  // Deletar Comando
  dc.findOne({_id:message.guild.id}, (err, dc) => {
    if(dc){
      message.delete()
    }
  })
  if (barrar.has(message.author.id)) {
    return message.reply("Se você está recebendo está mensagem significa que você não concluiu o processo de exclusão de dados do meu banco de dados, finalize o processo ou espere o tempo de 30 segundos após a execução do comando.")
  }
  // Caso o user esteja banido
  bldb.findOne({_id:message.author.id}, (err, bl) => {
    if(bl) {
      const detectado = new Discord.MessageEmbed()
      .setTitle("<a:ban_cat:768210628913266689> | Você está Banido")
      .setColor("ff0000")
      if(!bl.motivo) {
        detectado.setDescription(`Você foi banido de utilizar a Star:tm: por desrespeitar os termos de uso, caso ache que isto é um engano contate nosso [suporte](https://discord.gg/2pFH6Yy) e tentaremos resolver\n\n**Motivo:** \`Não Definido - Punido por: ${bl.autorTag}\`\n**Apelação:** \`Você pode enviar uma apelação para seu unban: https://bit.ly/star-unban\``)
    } else if(bl.motivo) {
      detectado.setDescription(`Você foi banido de utilizar a Star:tm: por desrespeitar os termos de uso, caso ache que isto é um engano contate nosso [suporte](https://discord.gg/2pFH6Yy) e tentaremos resolver\n\n**Motivo:** \`${bl.motivo} - Punido por: ${bl.autorTag}\`\n**Apelação:** \`Você pode enviar uma apelação para seu unban: https://bit.ly/star-unban\``)
    }
       return message.quote(detectado)
        }
  // Alguns Args
  var args = message.content.substring(prefix.length).split(" ");
  let cmd = args.shift().toLowerCase();
  if (!message.content.toLowerCase().startsWith(prefix) || message.author.bot) return;
  let command =client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
  if (!command) return console.log(c.america('[COMANDO] - COMANDO INEXISTENTE'))
  if(command.help.status === 'off') return message.quote(`${emoji.nao} ${message.author}, Sinto muito, esse comando está desabilitado, aguarde`);
  if (command) {
    pr.findOne({name: "prefix", preid: message.guild.id}).then(res => {
        let prefix = res ? res.prefix : config.prefix
    command.run(client, message, args, prefix, barrar);
    })
  } else {
    console.log();
  }
});
})
})
