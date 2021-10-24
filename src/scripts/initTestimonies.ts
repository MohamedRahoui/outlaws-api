import { PrismaClient, Prisma } from '.prisma/client';

let testimonies: Prisma.TestimonyCreateManyInput[] = [
  {
    text: "J'ai avorté <b>3</b> fois. Sahebti daba elle est enceinte ou ma3endhash flous l'avortement. Ou kantsna psk elle a peur tmshi ou tra liha shi haja ou hia ma3endha flous.",
    name: 'Chaimaa',
    age: '23 ans',
  },
  {
    text: "On était en voiture. Un flic nous a arrêté. On lui a dit qu'on était frère et soeur. Il ne nous a pas cru. On lui a monntré nos papiers. <b>On disait vrai.</b>",
    name: 'Meriem',
    age: '26 ans',
  },
  {
    text: 'I was with my bf. <b>We were hiding inside a building, kissing.</b> A neighbor caught us and threatened to call the cops. We pretended we were Americans. He suddenly changed his tone and told us to be careful like... Moroccans are closed-minded.',
    name: 'Camelia',
    age: '25 ans',
  },
  {
    text: "J'ai été <b>traitée de pute</b> par le médecin qui m'a fait avorter parce que j'ai refusé ses avances et son harcèlement.",
    name: 'Leila',
    age: '23 ans',
  },
  {
    text: "While waiting for friends at the train station I was arrested by two cops for sex trafficking. They took mu ID and said: <b>now there's no difference between you and a whore.</b> I was a business student",
    name: 'Fatima-Zahra',
    age: '34 ans',
  },
  {
    text: "Quand je me suis rendue compte que j'étais enceinte, <b>j'ai appelé une copine pour m'aider.</b> Elle m'a filé des pilules pour avorter. J'ai suivi tout ces conseils. Mai rien ne s'est passé. Le bébé est encore là...",
    name: 'Sara',
    age: '28 ans',
  },
  {
    text: 'It was our wedding night. We went to our hotel, in a suit and wedding dress. As we were checking in, they asked for our marriage certificate to get the <b>right</b> to sleep in the same room...',
    name: 'Fati',
    age: '30 ans',
  },
  {
    text: "J'ai été viloée à 20 ans. Je suis tombée enceinte. Heureusement, j'étais étudiante en France et j'ai pu me faire avorter sans danger et sans jugements. Au Maroc, je ne sais pas ce que j'aurais fait. Sans doute <b>me marier avec mon violeur...</b>",
    name: 'Nawal',
    age: '28 ans',
  },
  {
    text: "J'étais avec mon ex dans sa voiture et des gendarmes nous ont arrêtés alors qu'on s'embrassait. Ils ont commencé à m'insulter <q>pute</q> <q>fille facile</q>. J'ai dit que j'étais la fille de quelqu'un de très important (c'est pas vrai). <b>Ils ont vite changé de ton.</b>",
    name: 'Zineb',
    age: '22 ans',
  },
  {
    text: "I <b>got thretened by neighbors</b> because I'm an independent women who has a lover that comes over, so they asked for his ID to prove he is family. Ndt 3la s3di w3di 7lit photoshop",
    name: 'Sofia',
    age: '27 ans',
  },
  {
    text: "My doctor assistant pushed the volume of the ultrasound against my will and forced me to listen to the heartbeat. Now, a year after my abortion, I'm still uncovering <b>the layers of shame and guilt</b> that I gathered from that experience.",
    name: 'Soukaina',
    age: '25 ans',
  },
  {
    text: "Pour me faire avorter, j'ai payé 10 comprimés de cycotec à 3000 balles (ça peut aller même jusqu'à 8000 ou plus) alors qu'ils ne valent que 37€. <b>L'avortement au Mroc est un vrai business.</b>",
    name: 'Narjiss',
    age: '30 ans',
  },
  {
    text: 'My boyfriend and I went to this house. A neighbour saw us from behind and started yelling. When I turned back, he was shocked and apologized saying sorry I thought it was a girl. <b>I am a tomboy</b>',
    name: 'Chaimaa',
    age: '22 ans',
  },
  {
    text: "Je vivais en concubinage avec mon conjoint. Mes parents se sont fait cambrioler, et lors de l'enquête de police,ils ont dû <b>mentir pour expliquer mon absence.</b> Ce jour-là j'ai compris qu'on devait se marier",
    name: 'Leila',
    age: '32 ans',
  },
  {
    text: "I was kissng my girlfiend at night in an empty street. The security guys saw us. <b>They called the cops,</b> who called our parents. We didn't talk from that day. I am so sad.",
    name: 'Othman',
    age: '18 ans',
  },
  {
    text: 'We were kissing in a riad in the medina of Fez and the waited told us: hadchi RA mmnou3. I was like: hahoma lquwer gualssin madwa m3ahom 7ed. He told me: <b>wahadok RA gwer !</b>',
    name: 'Hiba',
    age: '20 ans',
  },
  {
    text: "À 17 ans, j'ai subi un curetage traditionnel chez un médecin conservateur. Sans anesthésie durant l'opération, mais avec <b>des gifles</b> et <b>des insultes</b> pour ne plus commettre le crime d'être avec un homme hors mariage...",
    name: 'Selma',
    age: '27 ans',
  },
  {
    text: 'My fiancé and I are long distance. To meet, we are always <b>forced to lie</b> about our nationalities to get an Airbnb. Some owners still ask for a marriage certificate, as they fear ending up in jail as well.',
    name: 'Hanane',
    age: '24 ans',
  },
  {
    text: 'One day I was with my Turkish boyfriend sitting in the car and a gardian attacked us: << You are Turkish and Erdogan is Muslim ! Shame on you !>> My boyfriend was really shocked.',
    name: 'Rizlan',
    age: '28 ans',
  },
  {
    text: "Un soir d'hiver, un voisin ivre nous attaque ma copine et moi, nou traitant <b>d'impurs,</b> sous les yeux de l'agent de sécurité. Ce dernier refuse d'appeler la police et nous dit: <q>bous êtes déjà <b>hors la loi.</b></q>",
    name: 'Rachid',
    age: '25 ans',
  },
];
testimonies = testimonies.map((testimonie) => {
  testimonie.valid = true;
  return testimonie;
});
const prisma = new PrismaClient();

const main = async () => {
  await prisma.testimony.createMany({
    data: testimonies,
    skipDuplicates: true,
  });
};

main();
