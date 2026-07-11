export const CHART_2006 = [
  'Gnarls Barkley Crazy', 'Nelly Furtado Promiscuous', 'Rihanna SOS',
  'Shakira Hips Don\'t Lie', 'Justin Timberlake SexyBack',
  'The Killers When You Were Young', 'Red Hot Chili Peppers Dani California',
  'Beyonce Irreplaceable', 'Panic At The Disco I Write Sins Not Tragedies',
  'The Fray How to Save a Life',
];

export const NEW_RELEASES = [
  'Amy Winehouse Rehab', 'The Killers Bones', 'Akon Smack That',
  'Evanescence Call Me When You\'re Sober', 'Fergie Fergalicious',
  'Snow Patrol Chasing Cars', 'John Legend Save Room', 'JoJo Too Little Too Late',
];

export const STAFF_PICKS = [
  'Arctic Monkeys I Bet You Look Good on the Dancefloor',
  'Gym Class Heroes Cupid\'s Chokehold', 'The Raconteurs Steady As She Goes',
  'Regina Spektor Fidelity', 'TV on the Radio Wolf Like Me', 'Muse Starlight',
];

export const HIDDEN_GEMS = [
  'Camera Obscura Lloyd I\'m Ready to Be Heartbroken', 'Band of Horses The Funeral',
  'Cat Power The Greatest', 'Beirut Postcards from Italy', 'Midlake Roscoe',
  'Phoenix Consolation Prizes',
];

export const FEATURED_ARTIST = {
  name: 'Amy Winehouse',
  note: 'back to black just dropped. you\'ll be hearing about this one.',
};

export const EDITORIAL = [
  { name: '2006 essentials', desc: 'the year, condensed.', terms: CHART_2006 },
  { name: 'emo night', desc: 'eyeliner not included.',
    terms: ['My Chemical Romance Welcome to the Black Parade', 'Fall Out Boy Dance Dance',
            'Panic At The Disco I Write Sins Not Tragedies', 'Dashboard Confessional Vindicated',
            'Jimmy Eat World The Middle', 'Taking Back Sunday MakeDamnSure'] },
  { name: 'indie disco', desc: 'dance, but make it skinny jeans.',
    terms: ['Arctic Monkeys I Bet You Look Good on the Dancefloor', 'Franz Ferdinand Take Me Out',
            'Bloc Party Banquet', 'The Strokes Juicebox', 'Hot Chip Over and Over', 'LCD Soundsystem Daft Punk Is Playing at My House'] },
  { name: 'summer 06', desc: 'windows down forever.',
    terms: ['Rihanna SOS', 'Sean Paul Temperature', 'Shakira Hips Don\'t Lie',
            'Nelly Furtado Promiscuous', 'Cassie Me & U', 'Chamillionaire Ridin'] },
];

export const STATIONS = [
  { freq: '89.1',  name: 'POP 2K6',       artists: ['Nelly Furtado', 'Justin Timberlake', 'Rihanna', 'Christina Aguilera', 'Pink'] },
  { freq: '92.7',  name: 'ALT ROCK',      artists: ['The Killers', 'Muse', 'Franz Ferdinand', 'Bloc Party', 'Snow Patrol'] },
  { freq: '95.5',  name: 'HIP-HOP',       artists: ['Kanye West', 'T.I.', 'Ludacris', 'Outkast', 'Chamillionaire'] },
  { freq: '98.3',  name: 'R&B SLOW JAMS', artists: ['Ne-Yo', 'Beyonce', 'Usher', 'Alicia Keys', 'John Legend'] },
  { freq: '101.9', name: 'EMO / PUNK',    artists: ['My Chemical Romance', 'Fall Out Boy', 'Panic At The Disco', 'Paramore', 'Jimmy Eat World'] },
  { freq: '104.1', name: 'INDIE',         artists: ['Arctic Monkeys', 'The Shins', 'Belle and Sebastian', 'Regina Spektor', 'Cat Power'] },
];

export const TREND_SEED = [
  { term: 'Amy Winehouse Rehab',              up: '+312%' },
  { term: 'Peter Bjorn and John Young Folks', up: '+204%' },
  { term: 'Lily Allen Smile',                 up: '+178%' },
  { term: 'Mika Grace Kelly',                 up: '+95%' },
  { term: 'Klaxons Golden Skans',             up: '+61%' },
];

export const NAV_TREE = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'search', label: 'Search', icon: 'search' },
  { id: 'liked', label: 'Liked Songs', icon: 'liked' },
  { id: 'queue', label: 'Up Next', icon: 'queue' },
  { id: 'library', label: 'Library', icon: 'library', children: [
    { id: 'songs', label: 'Songs', icon: 'songs' },
    { id: 'artists', label: 'Artists', icon: 'artists' },
    { id: 'albums', label: 'Albums', icon: 'albums' },
  ] },
  { id: 'playlists', label: 'Playlists', icon: 'playlists' },
  { id: 'mixcds', label: 'Mix CDs', icon: 'mixcd' },
  { id: 'radio', label: 'Radio', icon: 'radio' },
  { id: 'downloads', label: 'Downloads', icon: 'downloads' },
];

/* ---- DJ_Sp1n brain data ---- */

export const MOODS = [
  {
    keys: ['emo', 'sad', 'cry', 'rain', 'heartbreak', 'breakup', 'lonely'],
    reply: ['oh.', "it's one of those days.", 'got you <3'],
    terms: ['My Chemical Romance Welcome to the Black Parade', 'Dashboard Confessional Vindicated',
            'The Fray How to Save a Life', 'Death Cab for Cutie I Will Follow You Into the Dark'],
    name: 'rainy bus window mix',
  },
  {
    keys: ['party', 'dance', 'club', 'friday', 'weekend', 'birthday'],
    reply: ['say less.'],
    terms: ['Sean Paul Temperature', 'Fergie London Bridge',
            'Pussycat Dolls Buttons', 'Justin Timberlake SexyBack'],
    name: 'friday nite burnout',
  },
  {
    keys: ['crush', 'love', 'cute', 'date', 'valentine', 'boyfriend', 'girlfriend'],
    reply: ['a crush, huh.', 'burn them this.', 'works more often than it should.'],
    terms: ['Ne-Yo So Sick', 'James Blunt You\'re Beautiful',
            'Mariah Carey We Belong Together', 'Chris Brown Yo Excuse Me Miss'],
    name: 'do u like me y/n',
  },
  {
    keys: ['angry', 'mad', 'rage', 'hate', 'ugh', 'annoyed'],
    reply: ['punch the pillow.', 'not the monitor.', 'here.'],
    terms: ['Three Days Grace Animal I Have Become', 'Linkin Park What I\'ve Done',
            'Rise Against Prayer of the Refugee', 'System of a Down Hypnotize'],
    name: 'slam ur bedroom door',
  },
  {
    keys: ['chill', 'relax', 'study', 'homework', 'calm', 'sleep', 'coffee'],
    reply: ['easy now.', 'sunday speed only.'],
    terms: ['Jack Johnson Better Together', 'Corinne Bailey Rae Put Your Records On',
            'John Mayer Waiting on the World to Change', 'Norah Jones Sunrise'],
    name: 'sunday morning cereal',
  },
  {
    keys: ['gym', 'workout', 'run', 'pump', 'lift', 'sports'],
    reply: ['alright.', 'time to wake the neighbors.'],
    terms: ['Eminem Lose Yourself', '50 Cent In Da Club',
            'Kanye West Gold Digger', 'Black Eyed Peas Pump It'],
    name: 'gym class heroes (not the band)',
  },
  {
    keys: ['road', 'trip', 'drive', 'car', 'highway', 'summer'],
    reply: ['windows down.', 'arm out.', "here's the soundtrack."],
    terms: ['Red Hot Chili Peppers Snow Hey Oh', 'The Killers When You Were Young',
            'All-American Rejects Move Along', 'Boston More Than a Feeling'],
    name: 'shotgun rules apply',
  },
  {
    keys: ['late', 'night', 'midnight', '2am', 'insomnia'],
    reply: ['late one tonight.'],
    terms: ['Imogen Heap Hide and Seek', 'The Postal Service Such Great Heights',
            'Coldplay Fix You', 'Frou Frou Let Go'],
    name: 'after hours',
  },
];

export const AMBIENT = [
  ['this song slaps.'],
  ['that bassline...', "chef's kiss."],
  ["this one's criminally underrated."],
  ["didn't think you'd like this one.", 'guess i was wrong.'],
  ["you've got expensive taste."],
  ['this mix is shaping up nicely.'],
  ["don't skip this one."],
  ['there it is.', "knew we'd find it."],
  ['this transition is smooth.', 'keeping it.'],
  ["didn't expect", 'you to like this.', 'nice.'],
  ['good choice.'],
];

export const STATUS_IDLE = ['♫ listening...', '♫ digging through crates', '♫ reading id3 tags', '♫ scanning artists'];
export const STATUS_PLAY = ['♫ on air', '♫ matching bpm', '♫ listening...', '♫ finding hidden gems', '♫ scanning artists'];

export const EGGS = [
  { re: /who\s+(are|r)\s+(you|u)/i,
    lines: ['just your neighborhood dj.', "don't tell the engineers i can talk."] },
  { re: /(are|r)\s+(you|u)\s+(an?\s+)?(ai|a\.i\.|bot|robot|chatgpt|gpt|llm)/i,
    lines: ['nah.', "i'm mostly caffeine and playlists."] },
  { re: /what\s+do\s+(you|u)\s+do/i,
    lines: ["i find songs you'll pretend you discovered yourself."] },
  { re: /^(yo|hi|hey|hello|sup|wassup|what'?s up)\b/i,
    lines: ['yo.', "what's the vibe?"] },
  { re: /(thank|thx|ty)\b/i,
    lines: ['anytime.', "that's what i'm here for... allegedly."] },
];

export const PROCESS_STEPS = [
  'digging through the crates...',
  'loading music dna...',
  'reading id3 tags...',
  'checking bpm...',
  'matching artists...',
  'finding hidden gems...',
  'building mix cd...',
];

/* ---- 16px silk-style icons (hand-drawn svg) ---- */

export const ICON_DEFS = `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
<linearGradient id="gBlue" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9BD1F5"/><stop offset="1" stop-color="#2E7CC4"/></linearGradient>
<linearGradient id="gGreen" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C9FA6A"/><stop offset="1" stop-color="#5BA30F"/></linearGradient>
<linearGradient id="gRed" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FF9C9C"/><stop offset="1" stop-color="#C42A3A"/></linearGradient>
<linearGradient id="gSilver" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F2F4F6"/><stop offset="1" stop-color="#9BA3AB"/></linearGradient>
<linearGradient id="gManila" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE9A8"/><stop offset="1" stop-color="#D9A845"/></linearGradient>
<radialGradient id="gDisc" cx="0.5" cy="0.4" r="0.7"><stop offset="0" stop-color="#F8FAFC"/><stop offset="1" stop-color="#8FA0AC"/></radialGradient>
</defs></svg>`;

export const SVG_ICONS = {
  home: '<path d="M8 1.8 14 7.5h-1.8V14H9.8v-4H6.2v4H3.8V7.5H2Z" fill="url(#gBlue)" stroke="#17456F" stroke-width=".7"/>',
  search: '<circle cx="6.5" cy="6.5" r="4" fill="url(#gSilver)" stroke="#5A646E" stroke-width="1"/><circle cx="6.5" cy="6.5" r="2.1" fill="#CDE8F8"/><path d="m9.4 9.4 4 4" stroke="#5A646E" stroke-width="2.2" stroke-linecap="round"/>',
  library: '<path d="M1.5 5h4.2l1.2 1.4h7.6V13a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1Z" fill="url(#gManila)" stroke="#8A6A20" stroke-width=".7"/><path d="M1.5 5V3.6a.9.9 0 0 1 .9-.9h2.8l1.2 1.4H1.5Z" fill="url(#gManila)" stroke="#8A6A20" stroke-width=".7"/>',
  songs: '<path d="M6.2 12V4.2l6-1.6v7" stroke="#2E6A08" stroke-width="1.3" fill="none"/><ellipse cx="4.7" cy="12.2" rx="2" ry="1.5" fill="url(#gGreen)" stroke="#2E6A08" stroke-width=".6"/><ellipse cx="10.7" cy="9.6" rx="2" ry="1.5" fill="url(#gGreen)" stroke="#2E6A08" stroke-width=".6"/>',
  artists: '<circle cx="8" cy="4.8" r="2.9" fill="url(#gBlue)" stroke="#17456F" stroke-width=".6"/><path d="M2.6 14c.5-3.4 2.8-4.9 5.4-4.9s4.9 1.5 5.4 4.9Z" fill="url(#gBlue)" stroke="#17456F" stroke-width=".6"/>',
  albums: '<circle cx="8" cy="8" r="6.2" fill="url(#gDisc)" stroke="#66727C" stroke-width=".7"/><circle cx="8" cy="8" r="1.6" fill="#FFF" stroke="#66727C" stroke-width=".6"/>',
  playlists: '<rect x="2" y="2.6" width="12" height="2.2" rx="1" fill="url(#gGreen)" stroke="#2E6A08" stroke-width=".5"/><rect x="2" y="6.9" width="12" height="2.2" rx="1" fill="url(#gGreen)" stroke="#2E6A08" stroke-width=".5"/><rect x="2" y="11.2" width="8" height="2.2" rx="1" fill="url(#gGreen)" stroke="#2E6A08" stroke-width=".5"/>',
  mixcd: '<circle cx="8" cy="8" r="6.2" fill="url(#gDisc)" stroke="#2E6A08" stroke-width=".8"/><circle cx="8" cy="8" r="3.4" fill="none" stroke="#5BA30F" stroke-width="1"/><circle cx="8" cy="8" r="1.5" fill="#FFF" stroke="#2E6A08" stroke-width=".5"/>',
  liked: '<path d="M8 13.6C4.1 10.3 1.9 8 1.9 5.6c0-1.7 1.3-3 3-3 1.2 0 2.4.7 3.1 1.9C8.7 3.3 9.9 2.6 11.1 2.6c1.7 0 3 1.3 3 3 0 2.4-2.2 4.7-6.1 8Z" fill="url(#gRed)" stroke="#8A1A2A" stroke-width=".7"/>',
  queue: '<rect x="2" y="2.6" width="8.5" height="2" rx="1" fill="url(#gSilver)" stroke="#66727C" stroke-width=".5"/><rect x="2" y="7" width="8.5" height="2" rx="1" fill="url(#gSilver)" stroke="#66727C" stroke-width=".5"/><rect x="2" y="11.4" width="8.5" height="2" rx="1" fill="url(#gSilver)" stroke="#66727C" stroke-width=".5"/><path d="M12 6.8 15 9l-3 2.2Z" fill="url(#gGreen)" stroke="#2E6A08" stroke-width=".6"/>',
  radio: '<path d="M8 1.6v5.6" stroke="#2E6A08" stroke-width="1.3"/><circle cx="8" cy="8.6" r="1.4" fill="url(#gGreen)" stroke="#2E6A08" stroke-width=".5"/><path d="M4.4 12.2a5.1 5.1 0 0 1 0-7.2M11.6 5a5.1 5.1 0 0 1 0 7.2" stroke="#5BA30F" fill="none" stroke-width="1.2" stroke-linecap="round"/>',
  downloads: '<path d="M8 1.8v7M5 6l3 3.2L11 6" stroke="#2E6A08" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M2.5 11.2h11v2.8h-11z" fill="url(#gSilver)" stroke="#66727C" stroke-width=".6"/>',
};
