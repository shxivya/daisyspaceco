// ── DATA ──
// All static content arrays. No DOM logic here.

// ── ACTS ──
const acts = [
    // COMMUNITY (10)
    { text: "Leave a bunch of flowers on a neighbor's doorstep anonymously.", category: "Community", icon: "🌸" },
    { text: "Pick up three pieces of litter while walking through your park.", category: "Community", icon: "🌱" },
    { text: "Write a positive review for a local business you love.", category: "Community", icon: "⭐" },
    { text: "Leave your extra change at a laundromat or vending machine.", category: "Community", icon: "🪙" },
    { text: "Donate 5 high-quality items to a local charity shop.", category: "Community", icon: "🎁" },
    { text: "Leave a 'thank you' note in your mailbox for the mail carrier.", category: "Community", icon: "📮" },
    { text: "Buy a coffee for the person behind you in line.", category: "Community", icon: "☕" },
    { text: "Offer to return a stranger's shopping cart at the grocery store.", category: "Community", icon: "🛒" },
    { text: "Put out a bowl of water for neighborhood dogs/birds.", category: "Community", icon: "💧" },
    { text: "Sign up for one local volunteer shift this month.", category: "Community", icon: "🤝" },

    // DIGITAL (10)
    { text: "Endorse a former colleague for a skill on LinkedIn.", category: "Digital", icon: "💼" },
    { text: "Send an email to a teacher who once inspired you.", category: "Digital", icon: "📧" },
    { text: "Leave a genuinely supportive comment on a creator's post.", category: "Digital", icon: "📱" },
    { text: "Share a friend's small business or art on your social media.", category: "Digital", icon: "✨" },
    { text: "Unsubscribe from 5 newsletters that clutter your mind.", category: "Digital", icon: "🧹" },
    { text: "Send a 'thinking of you' text to someone you haven't spoken to in months.", category: "Digital", icon: "💌" },
    { text: "Report 3 pieces of positive news you found online to a friend.", category: "Digital", icon: "📰" },
    { text: "Clear your phone's photo library of 100 things and keep the memories.", category: "Digital", icon: "📸" },
    { text: "Tag a friend in a post that reminded you of a joke you share.", category: "Digital", icon: "😂" },
    { text: "Write a LinkedIn recommendation for a hardworking peer.", category: "Digital", icon: "✍️" },

    // CONNECTION (10)
    { text: "Call a relative just to ask about their day.", category: "Connection", icon: "📞" },
    { text: "Write a physical letter to a grandparent or older relative.", category: "Connection", icon: "📝" },
    { text: "Compliment a stranger on something specific (like their style).", category: "Connection", icon: "👗" },
    { text: "Invite a friend for a walk, no phones allowed.", category: "Connection", icon: "🚶" },
    { text: "Tell a family member one thing you truly appreciate about them.", category: "Connection", icon: "❤️" },
    { text: "Cook a meal for someone who has had a busy week.", category: "Connection", icon: "🍲" },
    { text: "Remember a friend's big meeting or event and text them 'Good Luck'.", category: "Connection", icon: "🍀" },
    { text: "Ask an elder in your life to tell you a story about their youth.", category: "Connection", icon: "👵" },
    { text: "Give someone a genuine, long-lasting hug today.", category: "Connection", icon: "🫂" },
    { text: "Host a small tea or coffee chat for a neighbor.", category: "Connection", icon: "🫖" },

    // SELF-CARE (10)
    { text: "Go for a 15-minute walk without any music or podcasts.", category: "Self", icon: "🌳" },
    { text: "Drink a full glass of water right now.", category: "Self", icon: "🥤" },
    { text: "Write down three things you accomplished today, no matter how small.", category: "Self", icon: "📝" },
    { text: "Stretch your body for 5 minutes before bed.", category: "Self", icon: "🧘" },
    { text: "Forgive yourself for a mistake you made earlier this week.", category: "Self", icon: "🕊️" },
    { text: "Turn off your screens one hour before you go to sleep.", category: "Self", icon: "🌙" },
    { text: "Buy yourself a small treat (like a flower or a favorite snack).", category: "Self", icon: "🍫" },
    { text: "Set a boundary today by saying 'no' to something that drains you.", category: "Self", icon: "🛡️" },
    { text: "Light a candle or use a scent that makes you feel calm.", category: "Self", icon: "🕯️" },
    { text: "Sit in silence for 2 minutes and just breathe.", category: "Self", icon: "🌬️" },

    // PRESENCE (10)
    { text: "Hold the door open and wait for the person behind you.", category: "Presence", icon: "🚪" },
    { text: "Let someone with fewer items go ahead of you at the store.", category: "Presence", icon: "🛒" },
    { text: "Put your phone away entirely during your next conversation.", category: "Presence", icon: "📵" },
    { text: "Actually listen today—wait for others to finish before you speak.", category: "Presence", icon: "👂" },
    { text: "Make eye contact and smile at the person serving your food/coffee.", category: "Presence", icon: "😊" },
    { text: "Watch a sunset or sunrise without taking a single photo.", category: "Presence", icon: "🌅" },
    { text: "Give your full attention to a child or pet when they want to play.", category: "Presence", icon: "🐕" },
    { text: "Let another driver merge into your lane with a friendly wave.", category: "Presence", icon: "🚗" },
    { text: "Take 3 deep breaths before entering your next meeting or room.", category: "Presence", icon: "🌬️" },
    { text: "Observe one beautiful thing in your immediate environment right now.", category: "Presence", icon: "🔍" },

    // GENEROSITY/MISC (10)
    { text: "Leave a 25% tip for great service today.", category: "Generosity", icon: "💸" },
    { text: "Pay for the person's toll or bus fare behind you.", category: "Generosity", icon: "🚌" },
    { text: "Bring a healthy snack to share at your workplace.", category: "Generosity", icon: "🍎" },
    { text: "Donate blood if you are able to.", category: "Generosity", icon: "🩸" },
    { text: "Plant a tree or a small pot of wildflowers.", category: "Generosity", icon: "🌻" },
    { text: "Offer to babysit or pet-sit for a friend for free.", category: "Generosity", icon: "🐾" },
    { text: "Leave a book you've finished in a public place with a note.", category: "Generosity", icon: "📚" },
    { text: "Tidy up a shared space (like a breakroom) that isn't your job.", category: "Generosity", icon: "🧹" },
    { text: "Give a generous compliment to someone you don't usually talk to.", category: "Generosity", icon: "💬" },
    { text: "Sponsor a classroom or a small project on a crowdfunding site.", category: "Generosity", icon: "🏫" }
];

// ── MOOD DATA ──
const coreMoods = [
    {
        name: "Calm",
        color: "#A8C4A2",
        quotes: [
            { text: "Still water runs deep. So do you.", author: "Anonymous" },
            { text: "Calm is not the absence of feeling. It is mastery of it.", author: "Unknown" },
            { text: "Peace is not found — it is practised.", author: "Anonymous" }
        ]
    },
    {
        name: "Happy",
        color: "#F6E7A5",
        quotes: [
            { text: "Your joy is a gift to every room you walk into.", author: "Anonymous" },
            { text: "Happiness shared is happiness doubled.", author: "Unknown" },
            { text: "Let this feeling anchor you on harder days.", author: "Anonymous" }
        ]
    },
    {
        name: "Neutral",
        color: "#EDE8DE",
        quotes: [
            { text: "Ordinary days are the ones we miss most.", author: "Anonymous" },
            { text: "Peace is found in the unremarkable moments.", author: "Unknown" },
            { text: "Steady is its own kind of beautiful.", author: "Anonymous" }
        ]
    },
    {
        name: "Loved",
        color: "#F2C6CF",
        quotes: [
            { text: "To feel loved is one of the greatest gifts.", author: "Anonymous" },
            { text: "You are held, even when you cannot feel it.", author: "Unknown" },
            { text: "Love noticed is love doubled.", author: "Anonymous" }
        ]
    },
    {
        name: "Relaxed",
        color: "#D6CFEA",
        quotes: [
            { text: "Rest is where the best ideas are born.", author: "Anonymous" },
            { text: "You have earned this softness.", author: "Unknown" },
            { text: "Ease is not laziness. It is wisdom.", author: "Anonymous" }
        ]
    },
    {
        name: "Hopeful",
        color: "#CFE7D6",
        quotes: [
            { text: "Hope is the quiet belief that good things are still coming.", author: "Anonymous" },
            { text: "Even in the dark, you are moving toward the light.", author: "Unknown" },
            { text: "A little bit of hope changes everything.", author: "Anonymous" }
        ]
    },
    {
        name: "Grateful",
        color: "#F4D1B5",
        quotes: [
            { text: "Gratitude turns what we have into enough.", author: "Anonymous" },
            { text: "A grateful heart is a magnet for all good things.", author: "Unknown" },
            { text: "Notice the small things. They are rarely small.", author: "Anonymous" }
        ]
    },
    {
        name: "Tired",
        color: "#CFC9C2",
        quotes: [
            { text: "Rest is not quitting; it is refuelling.", author: "Anonymous" },
            { text: "You cannot pour from an empty cup.", author: "Eleanor Brown" },
            { text: "A tired body is asking for care. Listen.", author: "Unknown" }
        ]
    },
    {
        name: "Anxious",
        color: "#C4CBE3",
        quotes: [
            { text: "Anxiety is not a flaw; it is a sign you care deeply.", author: "Anonymous" },
            { text: "You have survived every difficult moment so far.", author: "Unknown" },
            { text: "One breath is enough to begin again.", author: "Anonymous" }
        ]
    },
    {
        name: "Frustrated",
        color: "#D8A7A1",
        quotes: [
            { text: "Frustration means you care. Channel it gently.", author: "Anonymous" },
            { text: "It is okay to feel this. Let it pass through you.", author: "Unknown" },
            { text: "Even the most patient people have hard days.", author: "Anonymous" }
        ]
    },
    {
        name: "Sad",
        color: "#BFC9D9",
        quotes: [
            { text: "The sun will rise again, and so will your spirit.", author: "Rumi" },
            { text: "It is okay to not be okay. Healing takes time.", author: "Anonymous" },
            { text: "Your sensitivity is your strength, not your weakness.", author: "Unknown" }
        ]
    },
    {
        name: "Lonely",
        color: "#E1DCE8",
        quotes: [
            { text: "Even alone, you are not without worth.", author: "Anonymous" },
            { text: "Loneliness is a reminder that you were made for connection.", author: "Unknown" },
            { text: "Reach out, even gently. Someone will reach back.", author: "Anonymous" }
        ]
    }
];

// ── AFFIRMATIONS ──
const affirmations = [
    { text: "I am allowed to take things slowly.", source: "Gentle Reminder" },
    { text: "I am learning at my own pace.", source: "Self-Compassion" },
    { text: "Rest is productive.", source: "Gentle Reminder" },
    { text: "I don't need to be perfect today.", source: "Self-Compassion" },
    { text: "My feelings are valid.", source: "Inner Kindness" },
    { text: "I am doing the best I can with what I have.", source: "Gentle Reminder" },
    { text: "I deserve the same kindness I give to others.", source: "Self-Compassion" },
    { text: "Small steps still move me forward.", source: "Inner Kindness" },
    { text: "I am allowed to change my mind.", source: "Gentle Reminder" },
    { text: "Today, I choose gentleness over pressure.", source: "Self-Compassion" },
    { text: "I am more than my productivity.", source: "Inner Kindness" },
    { text: "I give myself permission to rest.", source: "Gentle Reminder" },
    { text: "I am growing, even when I can't see it.", source: "Self-Compassion" },
    { text: "It is okay to ask for help.", source: "Inner Kindness" },
    { text: "I trust myself to figure things out.", source: "Gentle Reminder" },
    { text: "My presence is enough.", source: "Self-Compassion" },
    { text: "I release what I cannot control.", source: "Inner Kindness" },
    { text: "I am worthy of love, exactly as I am.", source: "Gentle Reminder" },
    { text: "Healing is not linear, and that is okay.", source: "Self-Compassion" },
    { text: "I choose to be kind to myself today.", source: "Inner Kindness" },
    { text: "I am not behind — I am exactly where I need to be.", source: "Gentle Reminder" },
    { text: "My sensitivity is a strength.", source: "Self-Compassion" },
    { text: "I can begin again at any moment.", source: "Inner Kindness" },
    { text: "I am enough, right now, as I am.", source: "Gentle Reminder" },
    { text: "I honour my limits without shame.", source: "Self-Compassion" },
    { text: "Every breath is a fresh start.", source: "Inner Kindness" },
    { text: "I am deserving of good things.", source: "Gentle Reminder" },
    { text: "I release the need to compare myself to others.", source: "Self-Compassion" },
    { text: "I welcome peace into this moment.", source: "Inner Kindness" },
    { text: "I am capable of incredible things.", source: "Gentle Reminder" },
];

// ── COLOUR THEMES ──
const colorThemes = [
    {
        id: 'sage', name: 'Sage Garden', swatch: '#7a9e7e', swatchAlt: '#d4e4d0',
        light: {
            '--cream': '#f4efe5', '--warm': '#e8e2d4', '--beige': '#ddd7c6',
            '--sage': '#7a9e7e', '--sage-light': '#a8c4a2', '--sage-pale': '#d4e4d0',
            '--sage-dark': '#587a5c', '--deep': '#3d3228', '--mid': '#6b5c4e',
            '--muted': '#9e9082', '--soft': '#ede8de', '--white': '#fdfaf5',
            '--blob1-color': '#bdd4b9', '--blob2-color': '#ddd8cc', '--blob3-color': '#c8d4b8'
        },
        dark: {
            '--cream': '#121715', '--white': '#1a211e', '--soft': '#222b27',
            '--deep': '#f4efe5', '--mid': '#cfc7bb', '--muted': '#9f988c',
            '--warm': '#1f2723', '--beige': '#2a332e',
            '--sage': '#9fc3a2', '--sage-light': '#b7d6bb', '--sage-pale': '#2f3f36',
            '--sage-dark': '#cfe6d4',
            '--blob1-color': '#bdd4b9', '--blob2-color': '#ddd8cc', '--blob3-color': '#c8d4b8'
        }
    },
    {
        id: 'sky', name: 'Coastal Blue', swatch: '#6b9eb8', swatchAlt: '#d6eaf4',
        light: {
            '--cream': '#f0f6fa', '--warm': '#e2eef5', '--beige': '#cce0ed',
            '--sage': '#6b9eb8', '--sage-light': '#94bdd1', '--sage-pale': '#d6eaf4',
            '--sage-dark': '#4a7d96', '--deep': '#1e3545', '--mid': '#3d5f74',
            '--muted': '#7a9aad', '--soft': '#e8f2f8', '--white': '#f8fcfe',
            '--blob1-color': '#b8d8eb', '--blob2-color': '#cde5f2', '--blob3-color': '#a8cfe3'
        },
        dark: {
            '--cream': '#0f1a21', '--white': '#162530', '--soft': '#1c2e38',
            '--deep': '#e8f4fb', '--mid': '#b8d5e6', '--muted': '#7da3b5',
            '--warm': '#162230', '--beige': '#1e3040',
            '--sage': '#7fb8d0', '--sage-light': '#9ecde0', '--sage-pale': '#1e3545',
            '--sage-dark': '#c0e0ef',
            '--blob1-color': '#b8d8eb', '--blob2-color': '#cde5f2', '--blob3-color': '#a8cfe3'
        }
    },
    {
        id: 'rose', name: 'Rose Petal', swatch: '#c47a8a', swatchAlt: '#f5dde3',
        light: {
            '--cream': '#fdf5f7', '--warm': '#f5e8ec', '--beige': '#edd6dc',
            '--sage': '#c47a8a', '--sage-light': '#d89daa', '--sage-pale': '#f5dde3',
            '--sage-dark': '#9e5566', '--deep': '#3d2028', '--mid': '#6b404e',
            '--muted': '#a87a84', '--soft': '#f8edf0', '--white': '#fef9fa',
            '--blob1-color': '#f0c8d0', '--blob2-color': '#f5dde3', '--blob3-color': '#e8b8c4'
        },
        dark: {
            '--cream': '#200f14', '--white': '#2d151c', '--soft': '#381a22',
            '--deep': '#faeef1', '--mid': '#e0bdc5', '--muted': '#b08a92',
            '--warm': '#2a141a', '--beige': '#3a1e26',
            '--sage': '#d99aaa', '--sage-light': '#e5b4c0', '--sage-pale': '#3d1e28',
            '--sage-dark': '#f0cdd5',
            '--blob1-color': '#f0c8d0', '--blob2-color': '#f5dde3', '--blob3-color': '#e8b8c4'
        }
    },
    {
        id: 'sunshine', name: 'Sunshine', swatch: '#c9973a', swatchAlt: '#fbefd4',
        light: {
            '--cream': '#fdf8ee', '--warm': '#f7edd8', '--beige': '#eedfc0',
            '--sage': '#c9973a', '--sage-light': '#ddb264', '--sage-pale': '#fbefd4',
            '--sage-dark': '#a07028', '--deep': '#3a2a10', '--mid': '#6b4e20',
            '--muted': '#a88c5a', '--soft': '#f8f0de', '--white': '#fefcf5',
            '--blob1-color': '#f5dfa8', '--blob2-color': '#f0e4be', '--blob3-color': '#ebd498'
        },
        dark: {
            '--cream': '#1a1408', '--white': '#24190a', '--soft': '#2e200e',
            '--deep': '#fdf4e0', '--mid': '#e0c98a', '--muted': '#b09050',
            '--warm': '#221800', '--beige': '#322200',
            '--sage': '#d4a84a', '--sage-light': '#e0bf72', '--sage-pale': '#3a2800',
            '--sage-dark': '#f0d890',
            '--blob1-color': '#f5dfa8', '--blob2-color': '#f0e4be', '--blob3-color': '#ebd498'
        }
    },
    {
        id: 'terracotta', name: 'Terracotta', swatch: '#b8694a', swatchAlt: '#f5e0d8',
        light: {
            '--cream': '#fdf4ef', '--warm': '#f5e5dc', '--beige': '#ead4c8',
            '--sage': '#b8694a', '--sage-light': '#cf9080', '--sage-pale': '#f5e0d8',
            '--sage-dark': '#8c4a30', '--deep': '#3a1e14', '--mid': '#6b3a28',
            '--muted': '#a87060', '--soft': '#f8ece6', '--white': '#fef9f7',
            '--blob1-color': '#e8c0b0', '--blob2-color': '#f0d4c8', '--blob3-color': '#e0b0a0'
        },
        dark: {
            '--cream': '#1c0e08', '--white': '#281410', '--soft': '#321a14',
            '--deep': '#faeae4', '--mid': '#dbb8a8', '--muted': '#b08070',
            '--warm': '#220e08', '--beige': '#301808',
            '--sage': '#cc8060', '--sage-light': '#dba090', '--sage-pale': '#3a1a10',
            '--sage-dark': '#f0c0a8',
            '--blob1-color': '#e8c0b0', '--blob2-color': '#f0d4c8', '--blob3-color': '#e0b0a0'
        }
    },
    {
        id: 'lavender', name: 'Lavender Mist', swatch: '#8b7ab8', swatchAlt: '#e8e0f5',
        light: {
            '--cream': '#f8f5fd', '--warm': '#eeebf8', '--beige': '#e0daf0',
            '--sage': '#8b7ab8', '--sage-light': '#ab9fd0', '--sage-pale': '#e8e0f5',
            '--sage-dark': '#6458a0', '--deep': '#201835', '--mid': '#4a3d70',
            '--muted': '#9088b8', '--soft': '#f2eefb', '--white': '#fbf9fe',
            '--blob1-color': '#d8d0f0', '--blob2-color': '#e8e0f8', '--blob3-color': '#c8c0e8'
        },
        dark: {
            '--cream': '#130f1e', '--white': '#1c1530', '--soft': '#251d3a',
            '--deep': '#f0ecfc', '--mid': '#c8c0e0', '--muted': '#9088b0',
            '--warm': '#181028', '--beige': '#221838',
            '--sage': '#a898d0', '--sage-light': '#bdb0e0', '--sage-pale': '#2a2040',
            '--sage-dark': '#d8d0f0',
            '--blob1-color': '#d8d0f0', '--blob2-color': '#e8e0f8', '--blob3-color': '#c8c0e8'
        }
    },
    {
        id: 'strawberry', name: 'Strawberry', swatch: '#d44f6e', swatchAlt: '#fde0e8',
        light: {
            '--cream': '#fff5f8', '--warm': '#fde8ef', '--beige': '#f8d4e0',
            '--sage': '#d44f6e', '--sage-light': '#e47a94', '--sage-pale': '#fde0e8',
            '--sage-dark': '#a8304c', '--deep': '#380018', '--mid': '#6e2840',
            '--muted': '#b06878', '--soft': '#feeef4', '--white': '#fff9fb',
            '--blob1-color': '#f8c0d0', '--blob2-color': '#fdd8e4', '--blob3-color': '#f0a8bc'
        },
        dark: {
            '--cream': '#200010', '--white': '#2e0018', '--soft': '#3a0020',
            '--deep': '#ffeef4', '--mid': '#e0b8c8', '--muted': '#b07888',
            '--warm': '#280010', '--beige': '#360018',
            '--sage': '#e06880', '--sage-light': '#ec90a4', '--sage-pale': '#3a0820',
            '--sage-dark': '#f0b0c0',
            '--blob1-color': '#f8c0d0', '--blob2-color': '#fdd8e4', '--blob3-color': '#f0a8bc'
        }
    },
    {
        id: 'matcha', name: 'Matcha Latte', swatch: '#5a8a5a', swatchAlt: '#e0eed8',
        light: {
            '--cream': '#f5f8f0', '--warm': '#e8f0e0', '--beige': '#d8e8cc',
            '--sage': '#5a8a5a', '--sage-light': '#80aa80', '--sage-pale': '#e0eed8',
            '--sage-dark': '#3a6a3a', '--deep': '#1a2e1a', '--mid': '#3a5a3a',
            '--muted': '#7a9a7a', '--soft': '#ecf2e8', '--white': '#f8fbf5',
            '--blob1-color': '#c8e0c0', '--blob2-color': '#d8ecd0', '--blob3-color': '#b8d8b0'
        },
        dark: {
            '--cream': '#0e180e', '--white': '#142014', '--soft': '#1a281a',
            '--deep': '#e8f4e8', '--mid': '#b8d0b8', '--muted': '#809a80',
            '--warm': '#101810', '--beige': '#182418',
            '--sage': '#7aaa7a', '--sage-light': '#94c094', '--sage-pale': '#1e3020',
            '--sage-dark': '#b8d8b8',
            '--blob1-color': '#c8e0c0', '--blob2-color': '#d8ecd0', '--blob3-color': '#b8d8b0'
        }
    }
];

// ── SIDEBAR QUOTES ──
const sidebarQuotes = [
    "You are doing better than you think.",
    "One small act of kindness changes the entire day.",
    "Rest is not giving up. It is gathering strength.",
    "You don't have to earn your place in the world.",
    "Gentleness is a form of courage.",
    "Today is allowed to be ordinary. That is enough.",
    "The kindness you give quietly matters loudly.",
    "You are someone's reason to feel less alone.",
    "Progress doesn't always look like progress.",
    "Being soft is one of the strongest things you can do.",
];

// ── WALL DATA ──
const wallPrompts = [
    '"Something kind I did today…"',
    '"Something good that happened…"',
    '"A thought I want to leave here…"',
    '"A reminder someone else might need…"',
    '"A tiny win I want to celebrate…"',
    '"Something that made me smile…"',
    '"A small thing I\'m grateful for…"',
    '"Something I\'d tell a struggling friend…"',
];

const wallReactions = [
    { emoji: '🌼', label: 'This helped me' },
    { emoji: '🤍', label: 'Holding this with you' },
    { emoji: '✨', label: 'Thank you for sharing' },
];

// ── MOOD TAG DISPLAY MAP ──
const moodTagDisplay = {
    'Calm': '🌿 Calm',
    'Happy': '�️ Happy',
    'Neutral': '😌 Neutral',
    'Loved': '💗 Loved',
    'Relaxed': '🧘 Relaxed',
    'Hopeful': '� Hopeful',
    'Grateful': '🫶 Grateful',
    'Tired': '😩 Tired',
    'Anxious': '😟 Anxious',
    'Frustrated': '😤 Frustrated',
    'Sad': '� Sad',
    'Lonely': '🤍 Lonely'
};
