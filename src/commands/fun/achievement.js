module.exports = class PingCommand {
	constructor() {
		return {
			permissoes: {
				membro: [], //Permissoes que o usuario necessita
				bot: ['attachFiles'], //Permissoes que o bot necessita
				dono: true //Se apenas nos devs podem usar o comando
			},
			pt: {
				nome: 'achievement',
				categoria: '😄 • Diversão',
				desc: 'MORRE PRAGA'
			},
			en: {
				nome: 'achievement',
				categoria: '😄 • Fun',
				desc: 'DIE PLAGUE'
			},
			aliases: ['mcconquista', 'mcachievement', 'ma', 'mconquista', 'machievement', 'progresso', 'progressofeito'],
			run: this.run
		};
	}
	async run(ctx) {
        if(!ctx.args[0]) return ctx.send(`${idioma.image.args.replace("%u", ctx.message.author.mention)}`)
        if((ctx.args.join(" ").length) > 300) return ctx.send(`${idioma.image.long.replace("%u", ctx.message.author.mention)}`)
        const {createCanvas,loadImage,registerFont} = require('canvas');
		const {shortenText} = require('../../Helpers/Canvas');
		registerFont("./assets/Minecraft.ttf", {family:'Minecraft'})
		if((ctx.args.join(" ").length) > 300) return ctx.send(ctx.idioma.image.long.replace("%u", ctx.message.author.mention))
		if(!ctx.args[0]) return ctx.send(`${ctx.idioma.image.args.replace("%u", ctx.message.author.mention)}`)
		const text = ctx.args.join(" ");

		const base = await loadImage('./assets/achievement.png')
		const canvas = createCanvas(base.width, base.height);
		const foto = canvas.getContext('2d');
		foto.drawImage(base, 0, 0);
		foto.font = '17px Minecraft';
		foto.fillStyle = '#ffff00';
		foto.fillText(`${ctx.idioma.image.achivment}`, 60, 30);
		foto.fillStyle = '#ffffff';
		foto.fillText(shortenText(foto, text, 230), 60, 50);

		ctx.message.channel.createMessage(ctx.message.author.mention, {
			file: canvas.toBuffer(),
            name: "mcconquista.png"
		})
    }
}