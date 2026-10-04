/* ===================== CONTENT ===================== */
const CATS = {
  character:{name:"Character",color:"var(--cyan)"},
  identity:{name:"Identity",color:"var(--blue)"},
  life:{name:"Real life",color:"var(--orange)"},
  faith:{name:"Faith basics",color:"var(--green)"},
  rel:{name:"Relationships",color:"#B57BFF"}
};
/* Topic library. Topics with a `lesson` are fully written; the rest show as "coming soon". */
const TOPICS = [
  {id:"love",cat:"character",title:"Love",blurb:"The kind of love God shows us, and how to pass it on.",tags:"love unloved lonely alone friends kindness care 1 corinthians 13 john 15 1 john 4",mins:15,lesson:true},
  {id:"long-suffering",cat:"character",title:"Long-suffering",blurb:"Patience with people who test it, and staying steady when life is slow.",tags:"patience patient annoyed angry frustrated impatient waiting galatians 5 colossians 3 james 1 joseph",mins:15,lesson:true},
  {id:"kindness",cat:"character",title:"Kindness",blurb:"Small choices that make people feel seen.",tags:"kind mean bullying"},
  {id:"self-control",cat:"character",title:"Self-control",blurb:"Saying no to what pulls you away.",tags:"temptation phone habits"},
  {id:"humility",cat:"character",title:"Humility",blurb:"Confidence without pride.",tags:"proud pride"},
  {id:"who-god-says",cat:"identity",title:"Who God says I am",blurb:"Your worth was settled before anyone rated you.",tags:"identity self-worth worthless not enough insecure compare comparison ugly psalm 139 ephesians 2 1 peter 2 gideon",mins:15,lesson:true},
  {id:"self-worth",cat:"identity",title:"Self-worth",blurb:"When likes and grades start to define you.",tags:"worth confidence"},
  {id:"purpose",cat:"identity",title:"Purpose",blurb:"What you were made for.",tags:"purpose future calling lost"},
  {id:"anxiety",cat:"life",title:"Anxiety & worry",blurb:"What to do with the weight in your chest.",tags:"anxiety anxious worried worry stressed stress scared afraid fear exams overwhelmed philippians 4 1 peter 5 isaiah 41 elijah",mins:15,lesson:true},
  {id:"friendships",cat:"life",title:"Friendships",blurb:"Finding and being a good friend.",tags:"friends lonely alone left out"},
  {id:"dating",cat:"life",title:"Dating",blurb:"Honest talk about relationships.",tags:"crush dating boyfriend girlfriend"},
  {id:"peer-pressure",cat:"life",title:"Peer pressure",blurb:"Standing firm when everyone else goes along.",tags:"pressure fitting in"},
  {id:"social-media",cat:"life",title:"Social media",blurb:"Scrolling without losing yourself.",tags:"instagram tiktok phone comparison"},
  {id:"prayer",cat:"faith",title:"Prayer",blurb:"How to talk to God when you don't know what to say.",tags:"pray prayer talk to god"},
  {id:"salvation",cat:"faith",title:"Salvation",blurb:"What Jesus did and what it means for you.",tags:"saved jesus gospel"},
  {id:"holy-spirit",cat:"faith",title:"The Holy Spirit",blurb:"God with you, every day.",tags:"spirit"},
  {id:"bible",cat:"faith",title:"Reading the Bible",blurb:"Where to start and how to keep going.",tags:"bible read study"},
  {id:"parents",cat:"rel",title:"Parents",blurb:"Honour, frustration and finding common ground.",tags:"parents mum dad family home"},
  {id:"forgiveness",cat:"rel",title:"Forgiveness",blurb:"Letting go without pretending it didn't hurt.",tags:"forgive hurt betrayed"},
  {id:"conflict",cat:"rel",title:"Conflict",blurb:"Fighting fair and making peace.",tags:"argument fight conflict"}
];
const FEELINGS = [
  {label:"I feel lonely",q:"lonely"},{label:"I'm anxious",q:"anxious"},{label:"I'm not enough",q:"not enough"},
  {label:"I'm so annoyed",q:"annoyed"},{label:"Exams are stressing me",q:"exams"}
];

const LESSONS = {
"love":{
  hook:"Your group chat is roasting someone who isn't in it. It's funny, and it's easy to add one more joke. Then you remember they sat alone at lunch today. Love is usually that small moment: the choice nobody else would notice.",
  verses:[
    ["1 Corinthians 13:4–7","Charity suffereth long, and is kind; charity envieth not; charity vaunteth not itself, is not puffed up, doth not behave itself unseemly, seeketh not her own, is not easily provoked, thinketh no evil; rejoiceth not in iniquity, but rejoiceth in the truth; beareth all things, believeth all things, hopeth all things, endureth all things."],
    ["John 15:13","Greater love hath no man than this, that a man lay down his life for his friends."],
    ["1 John 4:19","We love him, because he first loved us."],
    ["Romans 5:8","But God commendeth his love toward us, in that, while we were yet sinners, Christ died for us."]
  ],
  versesNote:"“Charity” here means love.",
  teaching:[
    "Most songs and films treat love as a feeling that happens to you. The Bible treats it as something you do. Read 1 Corinthians 13 again and count the verbs: love is patient, is kind, doesn't envy, doesn't keep score. Almost every line describes a choice.",
    "That kind of love doesn't start with us. 1 John 4:19 says we love because God loved us first, and Romans 5:8 shows when He did it: while we were still getting it wrong. You don't earn God's love by being lovable. You receive it, and then you have something to give away.",
    "Jesus set the highest bar in John 15:13 and then cleared it on the cross. Most of us won't be asked to die for a friend. We will be asked to give up a joke, some time, our pride, or being right. That is where love gets practised."
  ],
  character:{name:"Ruth",ref:"Ruth 1:16",text:"After her husband died, Ruth could have gone home to her own people and started over. Instead she stayed with her grieving mother-in-law Naomi, in a foreign country, with no guarantee of anything. Her words are some of the most loyal in the Bible: “whither thou goest, I will go.” Ruth's love cost her comfort and certainty. God honoured it: she became the great-grandmother of King David and part of the family line of Jesus."},
  questions:["Which line of 1 Corinthians 13:4–7 is hardest for you to live out right now?","Who in your life is easy to overlook? What would love look like towards them this week?","How does knowing God loved you first change the way you see yourself?","Think of someone who loved you well. What did they actually do?"],
  memory:["1 John 4:19","We love him, because he first loved us."],
  challenge:"Pick one person who is easy to overlook (at school, church or home). Do one specific, kind thing for them before Sunday, and don't post about it.",
  prayer:"Father, thank You for loving me first, before I did anything right. Teach me to love the way You love: patiently, kindly, without keeping score. Show me who needs that love from me this week, and give me the courage to act. In Jesus' name, amen.",
  quiz:[
    {q:"According to 1 John 4:19, why are we able to love?",o:["Because we are good people","Because God first loved us","Because others love us"],a:1},
    {q:"Which of these is NOT in 1 Corinthians 13:4–7?",o:["Love is kind","Love keeps a record of wrongs","Love endures all things"],a:1},
    {q:"Who stayed with her mother-in-law out of loyal love?",o:["Ruth","Esther","Mary"],a:0}
  ]
},
"long-suffering":{
  hook:"Your younger brother has asked the same question four times. Your group-project partner still hasn't done their part. The bus is late again. By the end of the day you're snapping at everyone. Long-suffering is the old word for patience that lasts, and it gets tested in exactly these moments.",
  verses:[
    ["Galatians 5:22","But the fruit of the Spirit is love, joy, peace, longsuffering, gentleness, goodness, faith,"],
    ["Colossians 3:12–13","Put on therefore, as the elect of God, holy and beloved, bowels of mercies, kindness, humbleness of mind, meekness, longsuffering; forbearing one another, and forgiving one another, if any man have a quarrel against any: even as Christ forgave you, so also do ye."],
    ["James 1:2–4","My brethren, count it all joy when ye fall into divers temptations; knowing this, that the trying of your faith worketh patience. But let patience have her perfect work, that ye may be perfect and entire, wanting nothing."],
    ["Ephesians 4:2","With all lowliness and meekness, with longsuffering, forbearing one another in love;"]
  ],
  versesNote:"“Forbearing” means putting up with each other. “Divers temptations” means all kinds of trials.",
  teaching:[
    "Long-suffering means suffering long: staying kind and steady for longer than feels fair. It shows up in two places. One is with people: the friend who keeps letting you down, the sibling who gets on your nerves. The other is with circumstances: waiting for results, for healing, or for things at home to change.",
    "Galatians 5:22 calls it fruit of the Spirit. Fruit grows; you can't force it overnight. Colossians 3 says to “put on” long-suffering like clothes, which means it's a daily decision as well. God grows it in you, and you choose to wear it.",
    "James goes further and says trials are where patience is built. That doesn't make hard things good. It means God doesn't waste them. Every time you choose patience when you'd rather explode, something in you gets stronger."
  ],
  character:{name:"Joseph",ref:"Genesis 37–50",text:"Joseph's brothers sold him as a slave. He was falsely accused and forgotten in prison for years. He had every reason to become bitter. Instead he kept working faithfully wherever he was put. When he finally had power over his brothers, he chose forgiveness: “ye thought evil against me; but God meant it unto good” (Genesis 50:20). His patience lasted around 13 years before anything changed."},
  questions:["Who is hardest for you to be patient with, and why?","What situation are you waiting on right now? How are you handling the wait?","When you lose patience, what usually comes out: words, silence, or something else?","What might God be growing in you through something hard this season?"],
  memory:["Ephesians 4:2","With all lowliness and meekness, with longsuffering, forbearing one another in love;"],
  challenge:"Name the person who tests your patience most. This week, when they get on your nerves, pause for one deep breath before you answer, and answer kindly. Keep count of how many times you manage it.",
  prayer:"Lord, You are patient with me every single day. Grow long-suffering in me. When people frustrate me, help me pause before I react. When I'm waiting and nothing seems to change, help me trust that You are still working, like You were with Joseph. In Jesus' name, amen.",
  quiz:[
    {q:"In Galatians 5:22, long-suffering is part of…",o:["The armour of God","The fruit of the Spirit","The Ten Commandments"],a:1},
    {q:"According to James 1:3, what does the testing of our faith produce?",o:["Patience","Wealth","Fear"],a:0},
    {q:"What did Joseph tell his brothers in Genesis 50:20?",o:["“I will never forgive you”","“God meant it unto good”","“Leave Egypt now”"],a:1}
  ]
},
"who-god-says":{
  hook:"You post a photo. Ten minutes later it has fewer likes than your friend's. Suddenly you're zooming in on your face, rereading your caption and wondering what's wrong with you. Most of us let other people tell us who we are. This study looks at what God says instead.",
  verses:[
    ["Psalm 139:14","I will praise thee; for I am fearfully and wonderfully made: marvellous are thy works; and that my soul knoweth right well."],
    ["Ephesians 2:10","For we are his workmanship, created in Christ Jesus unto good works, which God hath before ordained that we should walk in them."],
    ["1 Peter 2:9","But ye are a chosen generation, a royal priesthood, an holy nation, a peculiar people; that ye should shew forth the praises of him who hath called you out of darkness into his marvellous light:"],
    ["2 Corinthians 5:17","Therefore if any man be in Christ, he is a new creature: old things are passed away; behold, all things are become new."]
  ],
  versesNote:"“Peculiar people” here means a people who belong to God, His own possession.",
  teaching:[
    "Your identity is the answer to the question “Who am I?” Everyone answers it somehow: with grades, looks, followers, family, talent or failures. The trouble is that those things change, so an identity built on them keeps changing too.",
    "God answers the question differently. Psalm 139 says you were made with care and on purpose. Ephesians 2:10 calls you His “workmanship”, the word for a crafted work of art, made with good things in mind for you to do. 1 Peter 2:9 says you are chosen, and 2 Corinthians 5:17 says that in Christ your past doesn't get the final word.",
    "None of this depends on how today went. Bad days are real, and you'll still have them. They just don't get to rename you. Your identity is something God gives, not something you have to earn."
  ],
  character:{name:"Gideon",ref:"Judges 6",text:"When the angel of the Lord found Gideon, he was hiding, threshing wheat in a winepress so the enemy wouldn't see. The angel greeted him: “The LORD is with thee, thou mighty man of valour.” Gideon argued back that his family was the poorest and he was “the least in my father's house.” God didn't argue with his feelings. He kept calling Gideon what He saw, and Gideon went on to lead Israel to freedom."},
  questions:["What do you most often let define you: grades, looks, followers, friends, or something else?","Which verse in this study is hardest for you to believe about yourself? Why?","Like Gideon, what label have you given yourself that God might disagree with?","How would your week look different if you believed you were God's workmanship?"],
  memory:["Psalm 139:14","I will praise thee; for I am fearfully and wonderfully made: marvellous are thy works; and that my soul knoweth right well."],
  challenge:"Write “fearfully and wonderfully made” somewhere you'll see it every morning (your mirror or lock screen). Each time you catch yourself thinking something harsh about yourself, replace it with one line from this study.",
  prayer:"God, thank You that You made me on purpose and with care. When I start measuring myself by likes, grades or other people's opinions, remind me what You say about me. Help me believe that I am chosen, loved and Your workmanship. In Jesus' name, amen.",
  quiz:[
    {q:"Ephesians 2:10 says we are God's…",o:["Servants","Workmanship","Judges"],a:1},
    {q:"How was Gideon hiding when God called him?",o:["In a cave","Threshing wheat in a winepress","On a boat"],a:1},
    {q:"According to 2 Corinthians 5:17, anyone in Christ is…",o:["A new creature","Perfect already","Never tempted"],a:0}
  ]
},
"anxiety":{
  hook:"It's 11:40pm. Your exam is at 9. You've studied, but your mind keeps looping through every way tomorrow could go wrong. Your chest feels tight and sleep isn't coming. Anxiety is common, it's real, and the Bible has more to say about it than “just stop worrying.”",
  verses:[
    ["Philippians 4:6–7","Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God. And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus."],
    ["1 Peter 5:7","Casting all your care upon him; for he careth for you."],
    ["Isaiah 41:10","Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness."],
    ["Matthew 6:34","Take therefore no thought for the morrow: for the morrow shall take thought for the things of itself. Sufficient unto the day is the evil thereof."]
  ],
  versesNote:"“Be careful for nothing” means don't be anxious about anything.",
  teaching:[
    "Paul wrote Philippians 4 from prison, so he wasn't writing from an easy life. He doesn't say to pretend you're fine. He gives a swap: turn the worry into prayer, specifically, with thanks for what God has already done. The promise isn't that every problem disappears. It's that God's peace will guard your heart and mind.",
    "1 Peter 5:7 uses the word “casting”, like throwing something heavy off your back. You're allowed to hand God the thing you can't carry, and the reason given is simple: He cares for you.",
    "Jesus in Matthew 6:34 points to a habit: living tomorrow's problems today. One way to practise this is to ask, “What is the next right step for today?” and to leave the rest with God."
  ],
  character:{name:"Elijah",ref:"1 Kings 19",text:"Right after a huge victory, Elijah got a death threat and ran into the wilderness. He was so overwhelmed he asked God to let him die. God didn't lecture him. He let him sleep, sent an angel with food, and let him rest again. Then He spoke to Elijah, not in the wind, earthquake or fire, but in “a still small voice.” God cares about your body and your mind, not only your spiritual life."},
  questions:["What are you most worried about right now? Write it down plainly.","Which part of that worry is about today, and which is about tomorrow?","Elijah needed sleep and food before anything else. What does your body need right now?","Who is one trusted adult you could talk to when worry gets heavy?"],
  memory:["1 Peter 5:7","Casting all your care upon him; for he careth for you."],
  challenge:"Each night this week, write down one worry and turn it into a one-line prayer. Then write one thing you're thankful for. At the end of the week, read the list back.",
  prayer:"Jesus, You know what's making me anxious, even the parts I can't explain. I give them to You now. Thank You that You care for me. Guard my heart and mind with Your peace, help me take the next right step today, and give me people I can talk to. In Your name, amen.",
  quiz:[
    {q:"In Philippians 4:6, what should we do instead of being anxious?",o:["Ignore our feelings","Pray, with thanksgiving","Work harder"],a:1},
    {q:"Why does 1 Peter 5:7 say we can cast our cares on God?",o:["Because He cares for us","Because problems are small","Because worry is a sin"],a:0},
    {q:"How did God first help Elijah when he was overwhelmed?",o:["He scolded him","He gave him rest and food","He sent him straight back"],a:1}
  ],
  safety:"If worry or fear is stopping you from sleeping, eating or getting through the day, please tell a parent, a youth leader or another adult you trust. Getting help is a sign of strength, and God often helps through people."
}};

const SERIES = [
  {id:"fruit",title:"7 Days on the Fruit of the Spirit",ref:"Galatians 5:22–23",color:"var(--cyan)",days:[
    {t:"Love",l:"love"},{t:"Joy"},{t:"Peace"},{t:"Long-suffering",l:"long-suffering"},{t:"Gentleness"},{t:"Goodness"},{t:"Faith & self-control"}]},
  {id:"identity",title:"Identity in 5 Days",ref:"Psalm 139",color:"var(--blue)",days:[
    {t:"Who God says I am",l:"who-god-says"},{t:"Self-worth"},{t:"Made on purpose"},{t:"Chosen, not compared"},{t:"Living it out"}]},
  {id:"peace",title:"Peace over Worry",ref:"Philippians 4:6–7",color:"var(--orange)",days:[
    {t:"Anxiety & worry",l:"anxiety"},{t:"Rest"},{t:"Trusting God with tomorrow"}]}
];

const VOTD = [
  ["Jeremiah 29:11","For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end."],
  ["Isaiah 40:31","But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint."],
  ["1 Timothy 4:12","Let no man despise thy youth; but be thou an example of the believers, in word, in conversation, in charity, in spirit, in faith, in purity."],
  ["Proverbs 3:5–6","Trust in the LORD with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths."],
  ["Philippians 4:13","I can do all things through Christ which strengtheneth me."],
  ["Joshua 1:9","Have not I commanded thee? Be strong and of a good courage; be not afraid, neither be thou dismayed: for the LORD thy God is with thee whithersoever thou goest."],
  ["Psalm 119:105","Thy word is a lamp unto my feet, and a light unto my path."]
];

/* Program and event details below come from @elevationteenz on Instagram and navigate.nelifoundation.org (Oct 2026). */
const LINKS={
  ig:"https://www.instagram.com/elevationteenz/",
  yt:"https://www.youtube.com/@tecteenznation",
  fb:"https://www.facebook.com/tecteenz/",
  threads:"https://www.threads.net/@elevationteenz",
  tiktok:"https://www.tiktok.com/@elevationteenz",
  linktree:"https://linktr.ee/elevationteenz",
  app:"https://linktr.ee/TecTeenzApp",
  newBeliever:"https://docs.google.com/forms/d/e/1FAIpQLSfQixfuJdFg2OV3V-kVZLzwJ83ulWfV9gOH8PKsfi7DEU1FfQ/viewform",
  navigate:"https://navigate.nelifoundation.org/"
};
const SERVICE={title:"Teenz Nation Sunday Service",times:"7:00 AM · 9:00 AM · 11:30 AM (WAT)",where:"Pistis Conference Centre, Lekki-Epe Expressway, Lagos",
  what:"A service where teens grow deeper in their relationship with God, build real friendships, ask honest questions and have a great time in a safe, vibrant environment."};
const PROGRAMS = [
  {id:"navigate",name:"Navigate",tag:"Yearly conference & camp",when:"Every August",color:"var(--blue)",img:"assets/g1.jpg",
   what:"The Elevation Church's annual conference for teenagers, built to make spiritual, emotional and mental investments in young people: self-concept, leadership and real-life skills.",
   who:"Ages 12–19",format:"Residential camp in multiple cities",
   theme:"BURN",themeLine:"Burn off the noise. Burn off the pressure. Purpose. Identity. Faith.",
   editions:[["Navigate Lagos 2026","1–7 August 2026","541 teenagers and 116 mentors & volunteers"],["Navigate Abuja 2026","23–27 August 2026","Abuja, Nigeria"]],
   tracks:["Digital marketing","Public speaking","Music","Culinary arts","Fashion design","Hair styling","Photography","Theatre arts","Event planning"],
   moments:["Daily Bible study","Praise night","Prayer & impartation","Cosplay Bible-character party","Academic excellence session","Self-defence training","Morning aerobics","Grand finale"],
   past:["Navigate 2018","Navigate 2019","Navigate 2021","Navigate 2022","Navigate 2023"],
   register:LINKS.navigate},
  {id:"accelerate",name:"Accelerate",tag:"Mid-year conference",when:"Every June",color:"var(--orange)",img:null,flyer:"assets/accelerate.jpg",
   what:"The Accelerate Teenagers Conference is a one-day, mid-year prophetic convergence for teens: a day to be transformed, refined and made bold, built for purpose.",
   who:"Teenagers",format:"One-day conference, 9am–3pm",
   theme:"Power to Transform",themeLine:"Identity. New mindset. Brave and fearless. Built different, purpose driven.",
   editions:[["Accelerate 2026: Power to Transform","Sat 6 June 2026 · 9am–3pm","Pistis Hub, 1 Niwil Close (by Globus Bank), Oba Akran Avenue, Ikeja, Lagos"]],
   past:["Accelerate 2026"]}
];
/* Sunday services follow the fortnightly pattern posted on Instagram (27 Sep 2026, 13 Sep, 30 Aug). Confirm each date. */
const EVENTS = [
  {id:"s1",d:"2026-10-11",title:SERVICE.title,time:"7:00, 9:00 & 11:30 AM",where:"Pistis Conference Centre, Lekki",kind:"Sunday service",confirm:true},
  {id:"s2",d:"2026-10-25",title:SERVICE.title,time:"7:00, 9:00 & 11:30 AM",where:"Pistis Conference Centre, Lekki",kind:"Sunday service",confirm:true},
  {id:"s3",d:"2026-11-08",title:SERVICE.title,time:"7:00, 9:00 & 11:30 AM",where:"Pistis Conference Centre, Lekki",kind:"Sunday service",confirm:true},
  {id:"s4",d:"2026-11-22",title:SERVICE.title,time:"7:00, 9:00 & 11:30 AM",where:"Pistis Conference Centre, Lekki",kind:"Sunday service",confirm:true},
  {id:"s5",d:"2026-12-06",title:SERVICE.title,time:"7:00, 9:00 & 11:30 AM",where:"Pistis Conference Centre, Lekki",kind:"Sunday service",confirm:true}
];
const GALLERY=[["assets/g8.jpg","Navigate '26 grand finale"],["assets/g1.jpg","Navigate Abuja 2026"],["assets/g10.jpg","Cosplay night"],["assets/g9.jpg","Praise night"],["assets/g0.jpg","Day 3 at camp"],["assets/g6.jpg","2 days to go"],["assets/g7.jpg","Countdown to Abuja"],["assets/g4.jpg","D-Day, Abuja"]];
const PRAYERS = [
  {id:"p1",name:"Teen, 15",text:"Please pray for my exams next week. I've been really anxious about maths.",n:12},
  {id:"p2",name:"Teen, 17",text:"Pray for my family. My parents have been arguing a lot and home feels heavy.",n:21},
  {id:"p3",name:"Teen, 14",text:"Pray I find good friends at my new school.",n:9}
];
