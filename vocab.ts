import type { Lang, Word } from '../types';

type Row = [term: string, reading: string, meaning: string, example: string, exampleEn: string];
const make = (lang: Lang, rows: Row[]): Word[] =>
  rows.map(([term, reading, meaning, example, exampleEn]) => ({
    id: `${lang}:${term}`, lang, term, reading, meaning, example, exampleEn,
  }));

const ko = make('ko', [
  ['안녕하세요', 'annyeonghaseyo', 'hello', '안녕하세요, 만나서 반가워요.', 'Hello, nice to meet you.'],
  ['감사합니다', 'gamsahamnida', 'thank you', '도와주셔서 감사합니다.', 'Thank you for helping me.'],
  ['물', 'mul', 'water', '물 한 잔 주세요.', 'A glass of water, please.'],
  ['밥', 'bap', 'rice; meal', '밥 먹었어요?', 'Have you eaten?'],
  ['친구', 'chingu', 'friend', '친구가 집에 왔어요.', 'A friend came to my house.'],
  ['학교', 'hakgyo', 'school', '학교에 가요.', 'I go to school.'],
  ['사랑', 'sarang', 'love', '사랑해요.', 'I love you.'],
  ['시간', 'sigan', 'time', '시간이 없어요.', 'I have no time.'],
  ['집', 'jip', 'home; house', '지금 집에 있어요.', "I'm at home now."],
  ['책', 'chaek', 'book', '책을 읽어요.', 'I read a book.'],
  ['오늘', 'oneul', 'today', '오늘 날씨가 좋아요.', 'The weather is nice today.'],
  ['내일', 'naeil', 'tomorrow', '내일 만나요.', "Let's meet tomorrow."],
  ['맛있다', 'masitda', 'to be delicious', '이 김치 맛있어요.', 'This kimchi is delicious.'],
  ['예쁘다', 'yeppeuda', 'to be pretty', '꽃이 예뻐요.', 'The flowers are pretty.'],
  ['가다', 'gada', 'to go', '지금 가요.', "I'm going now."],
  ['먹다', 'meokda', 'to eat', '빵을 먹어요.', 'I eat bread.'],
  ['어디', 'eodi', 'where', '화장실이 어디예요?', 'Where is the restroom?'],
  ['얼마', 'eolma', 'how much', '이거 얼마예요?', 'How much is this?'],
]);

const ja = make('ja', [
  ['こんにちは', 'konnichiwa', 'hello', 'こんにちは、お元気ですか。', 'Hello, how are you?'],
  ['ありがとう', 'arigatou', 'thank you', '手伝ってくれてありがとう。', 'Thanks for helping me.'],
  ['水', 'mizu', 'water', '水をください。', 'Water, please.'],
  ['ご飯', 'gohan', 'rice; meal', 'ご飯を食べました。', 'I ate a meal.'],
  ['友達', 'tomodachi', 'friend', '友達と遊びます。', 'I hang out with a friend.'],
  ['学校', 'gakkou', 'school', '学校に行きます。', 'I go to school.'],
  ['愛', 'ai', 'love', '愛は大切です。', 'Love is important.'],
  ['時間', 'jikan', 'time', '時間がありません。', 'I have no time.'],
  ['家', 'ie', 'house; home', '家に帰ります。', 'I return home.'],
  ['本', 'hon', 'book', '本を読みます。', 'I read a book.'],
  ['今日', 'kyou', 'today', '今日は暑いです。', "It's hot today."],
  ['明日', 'ashita', 'tomorrow', '明日会いましょう。', "Let's meet tomorrow."],
  ['美味しい', 'oishii', 'delicious', 'このラーメンは美味しい。', 'This ramen is delicious.'],
  ['綺麗', 'kirei', 'pretty; clean', '花が綺麗ですね。', 'The flowers are pretty.'],
  ['行く', 'iku', 'to go', '駅に行きます。', 'I go to the station.'],
  ['食べる', 'taberu', 'to eat', 'パンを食べます。', 'I eat bread.'],
  ['どこ', 'doko', 'where', 'トイレはどこですか。', 'Where is the restroom?'],
  ['いくら', 'ikura', 'how much', 'これはいくらですか。', 'How much is this?'],
]);

const es = make('es', [
  ['hola', 'OH-lah', 'hello', 'Hola, ¿cómo estás?', 'Hello, how are you?'],
  ['gracias', 'GRAH-syahs', 'thank you', 'Gracias por tu ayuda.', 'Thanks for your help.'],
  ['agua', 'AH-gwah', 'water', 'Un vaso de agua, por favor.', 'A glass of water, please.'],
  ['comida', 'koh-MEE-dah', 'food', 'La comida está lista.', 'The food is ready.'],
  ['amigo', 'ah-MEE-goh', 'friend', 'Mi amigo vive aquí.', 'My friend lives here.'],
  ['escuela', 'es-KWEH-lah', 'school', 'Voy a la escuela.', 'I go to school.'],
  ['amor', 'ah-MOR', 'love', 'El amor es importante.', 'Love is important.'],
  ['tiempo', 'TYEM-poh', 'time; weather', 'No tengo tiempo.', 'I have no time.'],
  ['casa', 'KAH-sah', 'house; home', 'Estoy en casa.', "I'm at home."],
  ['libro', 'LEE-broh', 'book', 'Leo un libro.', 'I read a book.'],
  ['hoy', 'oy', 'today', 'Hoy hace calor.', "It's hot today."],
  ['mañana', 'mah-NYAH-nah', 'tomorrow; morning', 'Nos vemos mañana.', 'See you tomorrow.'],
  ['delicioso', 'deh-lee-SYOH-soh', 'delicious', 'Este pan es delicioso.', 'This bread is delicious.'],
  ['bonito', 'boh-NEE-toh', 'pretty', 'Qué flor tan bonita.', 'What a pretty flower.'],
  ['ir', 'eer', 'to go', 'Voy al mercado.', "I'm going to the market."],
  ['comer', 'koh-MER', 'to eat', 'Quiero comer pan.', 'I want to eat bread.'],
  ['dónde', 'DOHN-deh', 'where', '¿Dónde está el baño?', 'Where is the restroom?'],
  ['cuánto', 'KWAN-toh', 'how much', '¿Cuánto cuesta esto?', 'How much does this cost?'],
]);

export const WORDS: Word[] = [...ko, ...ja, ...es];
export const wordsFor = (lang: Lang) => WORDS.filter((w) => w.lang === lang);
