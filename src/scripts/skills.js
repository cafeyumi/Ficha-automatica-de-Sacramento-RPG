const lifeSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="24 16 208 216"><title>Circulo de Vida</title><path d="M128,16C70.65,16,24,60.86,24,116c0,34.1,18.27,66,48,84.28V216a16,16,0,0,0,16,16h8a4,4,0,0,0,4-4V200.27a8.17,8.17,0,0,1,7.47-8.25,8,8,0,0,1,8.53,8v28a4,4,0,0,0,4,4h16a4,4,0,0,0,4-4V200.27a8.17,8.17,0,0,1,7.47-8.25,8,8,0,0,1,8.53,8v28a4,4,0,0,0,4,4h8a16,16,0,0,0,16-16V200.28C213.73,182,232,150.1,232,116,232,60.86,185.35,16,128,16ZM92,152a20,20,0,1,1,20-20A20,20,0,0,1,92,152Zm72,0a20,20,0,1,1,20-20A20,20,0,0,1,164,152Z"></path></svg>`;
const painSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="24 32 208 200"><title>Circulo de Dor</title><path d="M232,120v8A104,104,0,0,1,127.63,232c-54-.19-98-42.06-103.12-94.78a4,4,0,0,1,5.56-4A35.94,35.94,0,0,0,72,122.59a35.92,35.92,0,0,0,53.94,2.33,40.36,40.36,0,0,0,12.87,13A47.94,47.94,0,0,0,120,176a8,8,0,0,0,8.67,8,8.21,8.21,0,0,0,7.33-8.26A32,32,0,0,1,168,144a8,8,0,0,0,8-8.53,8.18,8.18,0,0,0-8.25-7.47H160a24,24,0,0,1-24-24V88h64A32,32,0,0,1,232,120ZM44.73,120C55.57,119.6,64,110.37,64,99.52v-23C64,65.63,55.57,56.4,44.73,56A20,20,0,0,0,24,76v24A20,20,0,0,0,44.73,120Zm56,0c10.84-.39,19.27-9.62,19.27-20.47v-47c0-10.85-8.43-20.08-19.27-20.47A20,20,0,0,0,80,52v48A20,20,0,0,0,100.73,120ZM176,52a20,20,0,0,0-20.73-20C144.43,32.4,136,41.63,136,52.48V72h36a4,4,0,0,0,4-4Z"></path></svg>`;

export const skills = {
	combat: [
		{
			name: "Armas da Natureza",
			description: `Você prefere lutar com métodos "ultrapassados". Seja por tradição ou por gosto, sempre que lutar usando armas rústicas, como facas de pedra, lanças de madeira, machadinhas e armas rudimentares, o dano do seu ataque aumenta em <strong>+1${lifeSvg}</strong> para cada ponto em Físico que tiver.`,
			repeatable: false,
		},
		{
			name: "Ataque Sacana",
			description: `Sua honra pode ser a primeira pá de terra que cai em cima do seu caixão, então para o inferno com ela, não é mesmo? Ao realizar um <strong>ataque surpresa</strong> usando facas, navalhas ou qualquer outra lâmina oculta, o golpe causa dano adicional que aumenta a cada nível conforme a tabela abaixo.`,
			repeatable: false,
			table: {},
		},
		{
			name: "Briga de Bar",
			description: `Quando você viu, já estava enfiando a cara de um maluco no piano do Salão. Você sabe improvisar armas com aquilo que estiver na sua frente: uma cadeira, uma garrafa, ou o <em>bebum</em> segurando a garrafa. Objetos pequenos e médios causam <strong>3${painSvg}</strong>, enquanto objetos grandes causam <strong>1${lifeSvg}</strong> mas, neste segundo caso, os <strong>Testes de Violência</strong> tem <strong>-1</strong> de penalidade para que os objetos desengonçados acertem os alvos.`,
			repeatable: false,
		},
		{
			name: "Coldre de Sabão",
			description: `Quem inventou o ditado: “quem ri por último, ri melhor” era meio <em>tantan</em>. Na Iniciativa, você pode puxar duas cartas e escolher a que quiser, a maior ou a menor, de acordo com a estratégia que pensar para seu turno na hora do combate.`,
			repeatable: false,
		},
		{
			name: "Dedo Quente",
			description: `Você sente a alma de um revólver como o fogo de uma paixão ardente, fazendo de seus tiros tão precisos quanto mortais. Sempre que atirar com um revólver, você recebe <strong>+1</strong> nos <strong>Testes de Violência</strong>. Além disso, contra alvos sem cobertura, o dano dos tiros aumenta conforme seu nível, de acordo com a tabela.`,
			repeatable: false,
			table: {},
		},
		{
			name: "Fúria dos Aflitos",
			description: `Sua raiva é imparável e seu ódio é infinito, a ponto de você não medir perigos e arriscar a própria pele para massacrar seus inimigos. Em combate, você reduz sua Defesa em <strong>-1</strong> ponto, e aumenta o dano de seus ataques corpo a corpo em <strong>+3${painSvg}</strong>.`,
			repeatable: false,
		},
		{
			name: "Gatilho Furioso",
			description: `Martelar o cão é a façanha de puxar o gatilho do revólver com uma das mãos enquanto bate no cão da arma com a outra mão. Você dispara dois tiros na mesma <strong>Ação de Combate</strong>, mas precisa gastar um <strong>Movimento</strong> para fazer isso. Se tiver mais <strong>Ações de Combate</strong> e <strong>Movimentos</strong> até o fim do turno, você pode atirar várias vezes até seu revólver descarregar, depois precisa usar suas <strong>Ações de Combate</strong> para recarregá-lo.`,
			repeatable: false,
		},
		{
			name: "Livramento",
			description: `Você ouviu a morte chamar seu nome, chegou sua hora, mas você não quer bater as botas. Quando riscar todos os seus ${lifeSvg}, caia no chão, recupere <strong>+2${lifeSvg}</strong> e permaneça com a sua carranca feia pela Terra. Se você cair outra vez no mesmo combate, acabou a colher de chá e será preciso fazer o <strong>Teste de Morte</strong> normalmente.`,
			repeatable: false,
		},
		{
			name: "Marretada",
			description: `Pra quê um revolver se sua mão é tão pesada quanto uma marreta? Quando luta de mãos vazias, apenas com o poder de seus socos e chutes, o dano de seus ataques desarmados aumenta em <strong>+1${painSvg}</strong> para cada ponto no <strong>Atributo Físico</strong> que tiver.`,
			repeatable: false,
		},
		{
			name: "Parrudeza",
			description: `Difícil de morrer e duro de matar. Você tem um couro bem grosso ou só gosta muito de estar vivo. Você soma <strong>+2${lifeSvg}</strong> à sua vida. Esta Habilidade pode ser escolhida várias vezes.`,
			repeatable: true,
		},
		{
			name: "Punhos do Oriente",
			description: `Você aprendeu artes marciais na sua terra natal ou com algum velho mestre que topou o ensinar, tornando-se uma grande máquina de distribuir chutes e socos. Você pode usar seus <strong>Movimentos</strong> para realizar ataques desarmados.`,
			repeatable: false,
		},
		{
			name: "Quebra-ossos",
			description: `Aplique golpes especiais de luta livre, como agarrões, arremessos ou o famoso suplex. Para dar este golpe é preciso gastar um <strong>Movimento</strong> e uma <strong>Ação de Combate</strong>. Você pode escolher imobilizar o oponente ou potencializar o dano do seu golpe conforme seu nível.`,
			repeatable: false,
			table: {},
		},
		{
			name: "Sorte dos Covardes",
			description: `Deixe as façanhas incríveis pra lá, o que importa para você é ter sorte. No começo de um combate, puxe uma carta do baralho e obtenha o efeito descrito na tabela abaixo de acordo com o naipe da carta. Os efeitos duram até o final do combate. Para ter esta habilidade você não pode ter mais do que <strong>1</strong> em Intelecto e <strong>2</strong> em Violência, mesmo em níveis mais altos. Se tiver, essa habilidade deixa de funcionar.`,
			repeatable: false,
			table: {},
		},
		{
			name: "Valei-me",
			description: `Improvise explosivos com o que tiver em mãos, como pedaços de pano, garrafas, um pouco de bebida, um ferrolho, um parafuso etc. Para fabricá-los é preciso ter sucesso em um <strong>Teste de Tradição NA 7</strong>. Se estiver no meio de um combate, além do teste, você precisa gastar <strong>2 Ações de Combate</strong> e um <strong>Movimento</strong> por explosivo. O dano do explosivo feito por você aumenta conforme seu nível.`,
			repeatable: false,
			table: {},
		},
		{
			name: "Zói de Gavião",
			description: `De vista afiada como uma ave de rapina, você acerta alvos distantes com maior precisão. Se atirar com um fuzil ou arco longo você recebe <strong>+1</strong> nos <strong>Testes de Violência</strong>. Além disso, se estiver em uma posição vantajosa, o dano dos disparos aumenta conforme seu nível de acordo com a tabela abaixo.`,
			repeatable: false,
			table: {},
		},
	],

	profession: [
		{
			name: "Às na Manga",
			description: `Aquela mesa coberta por um pano verde no canto do Salão lhe é tão familiar quanto a latrina. É na mesa, não na latrina, que você ganha dinheiro, nas cartas e no blefe. Ao fazer Testes envolvendo jogos de cartas, role <strong>2d6</strong> e use o melhor dado.`,
			repeatable: false,
		},
		{
			name: "Boca na Botija",
			description: `Mal aguém sentou no cacto, você já está com o unguento na mão. Sua percepção é tão afiada quanto os dentes de um jacaré. Você quase nunca deixa passar algo desapercebido. Ao fazer <strong>Testes de Atenção</strong>, jogue <strong>2d6</strong> e use o melhor resultado. E outra, sua Defesa não é reduzida por ficar surpreso antes do combate.`,
			repeatable: false,
		},
		{
			name: "Canção da Emoção",
			description: `Uma viola, gaita ou violão está na sua mão enquanto você canta um modão. A melodia pode inspirar sua gangue a superar o pior dos combates. Uma vez por sessão, você pode gastar duas <strong>Ações de Combate</strong> para cada PJ que queira beneficiar e conceder a todos eles um dos bônus a seguir, conforme seu nível. Quando usa esta habilidade você pode conceder benefícios adicionais, conforme seu nível, gastando mais duas <strong>Ações de Combate</strong> para cada PJ por benefício.`,
			repeatable: false,
			table: {},
		},
		{
			name: "Chamego",
			description: `Pula boi, pula cavalo, pula cavalo e boi! Foram tantos anos com o laço na mão que você sabe usar uma corda como ninguém. Ao fazer um teste para laçar algo ou alguém, jogue <strong>2d6</strong> e use o melhor resultado. Além disso, seus nós apertados dão penalidade de <strong>–1</strong> para os Testes a quem tentar se soltar do chamego do seu laço.`,
			repeatable: false,
		},
		{
			name: "Cuspe e Cola",
			description: `Nas condições precárias da Guerra, tinham poucos <em>trem</em> para cuidar dos soldados feridos, às vezes era preciso limpar com cuspe e estancar com cola. Este é o único jeito de curar alguém no meio do combate. Para fazer isso, você precisa estar colado no seu paciente e gastar <strong>2 Ações de Combate</strong> para cada ${lifeSvg} que curar. O limite de usos dessa habilidade aumenta conforme seu nível.`,
			repeatable: false,
			table: {},
		},
		{
			name: "Fogo no céu",
			description: `Ah! A pólvora! Aquele pozinho preto que faz o fogo voar. Você tem fascínio por dinamites, TNT, nitroglicerina ou qualquer coisa que faça BOOOOOM! Ao fazer Testes envolvendo explosivos, jogue <strong>2d6</strong> e use o melhor resultado. Além disso, você também não corre o risco de explodir os próprios miolos caso tire uma falha crítica.`,
			repeatable: false,
		},
		{
			name: "Fumaça na Água",
			description: `O silêncio e a noite são os melhores amigos de um covarde... ops, quer dizer, de quem sobrevive a base da subtração de bens alheios. Quando fizer <strong>Testes de Roubo</strong> para afanar coisas, se esconder ou caminhar na quietude, jogue <strong>2d6</strong> e use o melhor resultado que cair.`,
			repeatable: false,
		},
		{
			name: "Galope Certeiro",
			description: `Gaspar e Estrela, um homem e uma égua. Inseparáveis. A ligação entre humanos e suas montarias é sempre inquebrável e pode motivar vinganças e redenções. Ao fazer <strong>Testes de Montaria</strong> no lombo do seu próprio cavalo, jogue <strong>2d6</strong> e use o melhor resultado. Você também ignora a penalidade em <strong>Testes de Montaria</strong> quando estiver montado em outros animais não familiares a você.`,
			repeatable: false,
		},
		{
			name: "Não Vai Doer Nadinha",
			description: `Quantas vidas você salvou na Guerra? Quantos braços e pernas amputou? Você cuidou de viroses, cancro mole, unha encravada, gripe, caxumba que já desceu e tanta coisa que nada mais o assusta. Ao fazer testes de Medicina, jogue <strong>2d6</strong> e use o melhor resultado. Além disso, sua cura adicional aumenta conforme seu nível, mostrado na tabela abaixo.`,
			repeatable: false,
			table: {},
		},
		{
			name: "Natural da Natureza",
			description: `Os caminhos da natureza estão abertos para você. Você sabe nadar, escalar, subir em árvores, pular de galho em galho, abrir trilhas através das matas e pradarias. Sempre que fizer <strong>Testes de Suor</strong>, jogue <strong>2d6</strong> e use o melhor resultado, Além disso, você não precisa fazer testes para encontrar plantas, ervas medicinais ou comestíveis e abrigo em territórios inóspitos e selvagens.`,
			repeatable: false,
		},
		{
			name: "Sabiá Imperatriz",
			description: `Hora de tirar no dedo a última gota do perfume que vai esconder o futum de bosta que você tem. Sorria, seduza, convença e aperte as mãos certas para conseguir as informações que você tanto precisa. Ao fazer <strong>Testes de Negócios</strong>, jogue <strong>2d6</strong> e use o melhor resultado.`,
			repeatable: false,
		},
		{
			name: "Sabugos e Peçonhas",
			description: `Seus anos vivendo entre as matas do Oeste Selvagem lhe renderam conhecimento para saber tudo o que há de mal nas plantas. Você consegue produzir venenos mais eficientes. Eles causam <strong>1${painSvg}</strong> a cada ação feita pelo alvo envenenado. Ou seja, se o alvo usar uma ação para atirar, sofre <strong>1${painSvg}</strong>. Se der outro tiro, sofre mais até o veneno ser curado, resistido ou o alvo ficar inconsciente.`,
			repeatable: false,
		},
		{
			name: "Salve-se Quem Puder",
			description: `Lutar até morrer é coisa de quem não tem amor à vida, sô. Mesmo que as calças borradas fiquem para trás, ficar vivo não é descaso com ninguém. Só não vai me fazer isso no meio de um duelo porque, aí sim, é coisa de gente sem nem um tiquim de moral. Ao fazer qualquer Teste para escapar ou fugir, jogue <strong>2d6</strong> e use o melhor resultado. Em situações de fuga, você recebe +1 Movimento que só pode ser usado para dar no pé.`,
			repeatable: false,
		},
		{
			name: "Sorrisão, Chapeu na Mão",
			description: `Com a cara lavada e sorriso no rosto, você consegue levar vantagens sempre que existe uma negociação financeira. Sempre que estiver comprando ou vendendo itens comuns, você consegue comprar itens com 25% de desconto e vendê-los 25% mais caro de acordo com os preços na tabela de equipamento.`,
			repeatable: false,
		},
		{
			name: "Zói de Coruja",
			description: `Na vivência ou na escola, seu objetivo sempre foi a busca pela teoria e pelo conhecimento. É uma sede de saber incontrolável que o transforma em enciclopédia ambulante. Sempre que fizer um <strong>Teste de Tradição</strong> para se lembrar de algum conhecimento lá do fundo da cachola, jogue <strong>2d6</strong> e fique com o melhor resultado.`,
			repeatable: false,
		},
	],
};
