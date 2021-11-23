import { PrismaClient, Prisma } from '.prisma/client';

let testimonies: Prisma.TestimonyCreateManyInput[] = [
  {
    text: 'J’ai porté plainte contre une personne qui avait des vidéos intimes de moi. Lors du rendez-vous avec le procureur du roi, il m’a demandé c’est quoi la nature de ma relation avec la personne dans la vidéo. Je lui ai répondu c’est mon ex-copine. Il m’a dit : donc c’est une relation non légitime. En fin du compte, j’ai été obligé de retirer la plainte pour ne pas être poursuivis en justice. Je veux que cet article 490 soit bani !',
    name: '',
    age: '',
  },
  {
    text: "One day, my girlfriend and I were in a train station waiting for her train. She was very sick and could barely walk, so we sat then she put her head on my shoulder. A few minutes later three police officers came our way shouting and cursing at us, claiming that families in the area complained about what we were doing and threatened to take us to the police station. That same day I realized that I can't live in such a country. After all, what can we expect from a society that condemns showing affection and love but not violence and hate.",
    name: '',
    age: '',
  },
  {
    text: "Je suis actuellement victime de menaces de revenge porn et je ne sais pas comment procéder pour déposer plainte. Je me suis dirigée vers la cellule de violence au niveau du tribunal de 1e instance, où j'ai été agressée et SLUTSHAMée par LA substitut du procureur qui ne voulait même pas m'offrir de chaise pour m'asseoir et qui a menacé de m'arrêter car j'avouais avoir eu des relations hors cadre du mariage !! J'ai pris peur et pris la fuite en pleurant ce jour-là.",
    name: '',
    age: '',
  },
  {
    text: "I'm 19 years old and pansexual. I've been in a relationship with my boyfriend for the 3rd year now. Unfortunately we can't really spend time with each other and when we do, we don't feel at ease. I hate this strict society who's preventing us from enjoying our youth and the company of the closest people to our hearts. I'm hiding my true identity from people whom I fear they'd judge me or punish me for being myself, especially my family, until I leave this country to somewhere else where I'll feel safe, then I'll unleash my true self.",
    name: '',
    age: '',
  },
  {
    text: "I am a girl, almost 17 and i am pansexual. I have a girlfriend whom everybody thinks is my bestfriend. We are tired of hiding it, we just wanna hold hands or kiss in public without having to think about other people's reaction. I wish i could leave this country and go abroad to live freely and marry whoever i want.",
    name: '',
    age: '',
  },
  {
    text: "I was walking at night with my half brother to his house and a '3assas' stopped us and asked about our relationship. My brother said I am his sister, then we left. One hour later, the police was at our door and they arrested us. All of that cuz we dont share the same last name.",
    name: '',
    age: '',
  },
  {
    text: "À 18 ans, étudiante, je suis allée avec mon copain chez lui. Les voisins ont appelé la police et ils se sont réunis dans le couloir pour qu'on ne quitte pas les lieux. La police est venue et a fait un contrôle d'identité. Heureusement que mon copain à l'époque avait reconnu le policier et on nous a laissé partir. Toutefois, les insultes et la violence des voisins en sortant m'ont marqué à vie. On m'a traité de pute et de délinquante. J'ai tellement pleuré ce jour-là mais je n'ai jamais arrêté de croire à mon droit d'être libre.",
    name: '',
    age: '',
  },
  {
    text: 'J’ai porté plainte contre une personne qui avait des vidéos intimes de moi. Lors du rendez-vous avec le procureur du roi, il m’a demandé c’est quoi la nature de ma relation avec la personne dans la vidéo. Je lui ai répondu c’est mon ex-copine. Il m’a dit : donc c’est une relation non légitime. En fin du compte, j’ai été obligé de retirer la plainte pour qu’on ne soit pas poursuivis en justice mon ex-copine et moi. Je veux que cet article 490 soit bani !',
    name: '',
    age: '',
  },
  {
    text: "J'habitais seule en étant étudiante dans une autre ville et je me suis installée dans un appartement que possède mes parents. J'invitais beaucoup mes camarades, surtout en période de préparation d'examens. Les voisins s'en sont plains à mon père qui n'en avait rien à cirer, du coup ils ont tenté de m'expulser en signant une pétition pour demander au syndic de porter plainte. Ma voisine (mère de famille) m'a prévenu et leur a tenu tête. J'ai quitté le pays après mes études.",
    name: '',
    age: '',
  },
  {
    text: "Je suis une fille homosexuelle, moi et ma copine étions dans un parking à Casablanca dans ma voiture, on s'est embrassés, mais rien de plus ! à un moment donné, un homme de la securité,  la soixantaine, ja l3endna et nous a dit ' shdatkoum la caméra et je dois appeler la police '. J’ai dû lui donner 200 dhs pour qu’il ne les appelle pas. Mais il m’a aussi demandé mon numéro de téléphone. Paniquée, je lui ai donné. Il nous a enfin laissé partir en me disant : « Mli n3yetlik jawbini » Le soir il m'envoie un ' Salut ' sur Whatsapp. Je l'ai bloqué.",
    name: '',
    age: '',
  },
  {
    text: "One day, my girlfriend and I were in a train station waiting for her train. She was very sick and could barely walk, so we sat then she put her head on my shoulder. A few minutes later three police officers came our way shouting and cursing at us, claiming that families in the area complained about what we were doing and threatened to take us to the police station. That same day I realized that I can't live in such a country. After all, what can we expect from a society that condemns showing affection and love but not violence and hate.",
    name: '',
    age: '',
  },
  {
    text: "At 2am, the police knocked on the door. I was with my girlfriend at her place. They took us to the police station, and called our parents. I didn't hear from her since. I always wanted to marry her. ",
    name: 'Yassine',
    age: '21',
  },
  {
    text: 'My ex boyfriend and I were waiting for his train and hugging innocently. A security guy came to us and harassed us for a good 10 min. I think I will cry from happiness if this manifesto works.',
    name: 'Nezha',
    age: '27',
  },
  {
    text: 'Il y a deux semaines, j’ai fait une fausse couche. Je suis allée à l’une des cliniques les plus réputées de Casablanca. On a refusé de me traiter car je n’avais pas mon acte de mariage sur moi.',
    name: 'Temtem',
    age: '32 ans',
  },
  {
    text: "When I was 16, I got my girlfriend pregnant. We tried a lot of homemade recipes to cause an abortion, it didn't work. When she told her mother, she beat her up so bad that she broke her fingers and then, she accused me of rape even though it was consensual. My girlfriend was so traumatized, she attempted suicide.",
    name: 'Thamer',
    age: '23',
  },
  {
    text: "My ex boyfriend kissed me in public. The police saw us and threatened to arrest me, degrading me by saying I should do 'my sluty activities' in private. They never said a word to him. He was foreign.",
    name: 'Ibtissam',
    age: '25',
  },
  {
    text: 'Nous étions dans un restaurant à Fès pour l’anniversaire de mon fiancé. Après avoir soufflé les bougies, nous nous sommes embrassés. Le gérant est alors venu vers nous pour nous chasser sans ménagement. Nous avions nos bagues aux doigts. ',
    name: 'Maha',
    age: ' 21 ans',
  },
  {
    text: 'Un jour, je me baladais avec ma copine en nous tenant la main. Une femme a commencé à nous insulter, nous filmer et menacer d’appeler la police. Quand elle s’est rendue compte que ma copine était une fille (elle est très masculine) elle a dit:  « sm7ou liya abnati rah kter lfassad, khasna n7iydou lkhnez. » ',
    name: 'Zineb ',
    age: '17 ans',
  },
  {
    text: 'I came with my fiancé from Germany to Morocco. We went to the riad we booked late at night and they kicked us out. The reason:  I have a Moroccan passport so we can’t sleep in the same room. I felt like a homeless in my own country. ',
    name: 'Issam',
    age: '27',
  },
  {
    text: "J'ai 28 ans, et j’ai toujours une phobie de faire l'amour à cause de ces lois injustes. J'aime le Maroc et je suis fier d'être marocain mais malheureusement, je travaille aujourd’hui pour le quitter et changer de nationalité.",
    name: 'Nacih',
    age: '28 ans',
  },
  {
    text: 'واحد النهار، عرضت على صحابي للدار و كانت معهم واحد البنت. السانديك ديال العمارة عيط على الجيران و على والدي. عايروني و هددوني باش يعيطو للبوليس و جراوا على صحابي. كلشي صبح كيهدر علي بحال الا قتلت شي واحد.',
    name: 'بدر',
    age: '26 عام',
  },
  {
    text: 'كنت أنا و صاحبتي، كنتغداو فالبحر، جا عندي بوليسي قاليا شنو كتجيك، قلت ليه صاحبتي، قاليا غادي تمشيو معايا لبوست.. يسحابليك حنا فمريكان..حنا بلد إسلامي اسي !',
    name: 'عبد الكبير',
    age: '30 سنة',
  },
  {
    text: "J'ai vécu avec mon copain à Casa pendant 3 ans. Quand on a voulu changer d'appartement, le proprio est venu menacer de me dénoncer à la police si je ne lui laissais pas la caution. Depuis, j’ai quitté le Maroc. ",
    name: 'Sam',
    age: '27 ans',
  },
  {
    text: "I only have male friends. When out, we're always stopped by the police because I am the only girl among the guys. Now, they don’t want to go out with me anymore. ",
    name: 'Nada',
    age: '18',
  },
  {
    text: 'My fiancé and I are long distance. To meet, we are always forced to lie about our nationalities to get an Airbnb. Some owners still ask for a marriage certificate, as they fear ending up in jail as well. ',
    name: 'Hanane',
    age: '24',
  },
  {
    text: "Un jour, le voisin de mon copain a été jeté en prison pour avoir reçu une fille chez lui. Mon copain m'a dit 'ça aurait pu être nous'. On s'aime toujours en cachette. ",
    name: 'Hind',
    age: '22 ans',
  },
  {
    text: "Un soir d’hiver, un voisin ivre nous attaque ma copine et moi, nous traitant d’impurs, sous les yeux de l'agent de sécurité. Ce dernier refuse d’appeler la police et nous dit : « vous êtes déjà hors la loi. »",
    name: 'Rachid',
    age: '25 ans',
  },
  {
    text: 'À 17 ans, j’ai subi un curetage traditionnel chez un médecin conservateur. Sans anesthésie durant l’opération, mais avec des gifles et des insultes pour ne plus commettre le crime d’être avec un homme hors mariage. ',
    name: 'Selma',
    age: '27 ans',
  },
  {
    text: 'One day I was with my Turkish boyfriend sitting in the car and a gardian attacked us: « Your are Turkish and Erdogan is Muslim ! Shame on you ! » My boyfriend was really shocked.',
    name: 'Rizlan',
    age: '28 ',
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
