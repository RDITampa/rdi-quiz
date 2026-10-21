// R, D, or I? episode data. To add an episode, append one object to EPISODES.
// key: one letter per choice (A,B,C) -> R/D/I, exactly as revealed in the video's answer key.
// Scoring (from the videos): 7+ of one letter = Strong, 5-6 = Lean, no letter above 4 or top-two tie = Mixed.
window.EPISODES = [
 {
  "id": "ep1",
  "number": 1,
  "title": "Republican, Democrat, or Independent? Take the 10-Question Quiz",
  "short": "The starter quiz",
  "questions": [
   {
    "n": 1,
    "topic": "Role of government",
    "stem": "When a big problem hits the country, the first move should be…",
    "choices": [
     "It depends on the problem. Back whatever's actually worked, no matter which party came up with it.",
     "Let families, businesses, local communities, and states take the lead, and keep Washington's role limited.",
     "Use the federal government to step in with programs and protections, because some problems are too big to handle alone."
    ],
    "key": "IRD"
   },
   {
    "n": 2,
    "topic": "Economy & taxes",
    "stem": "The best way to grow the economy is…",
    "choices": [
     "Ask top earners and big corporations to pay more, and invest that in workers, families, and infrastructure.",
     "Get the budget under control first, and mix tax and spending ideas from both sides to do it.",
     "Lower taxes and cut red tape, so businesses can invest, grow, and hire."
    ],
    "key": "DIR"
   },
   {
    "n": 3,
    "topic": "Healthcare",
    "stem": "Healthcare. I'd rather…",
    "choices": [
     "Have more choice and competition in private insurance, with less control from Washington.",
     "Expand public coverage options, so everyone can get insured.",
     "Keep what's working, focus hard on bringing costs down, and take good ideas from either party."
    ],
    "key": "RDI"
   },
   {
    "n": 4,
    "topic": "Immigration",
    "stem": "Immigration. The top priority should be…",
    "choices": [
     "One package deal: stronger border security and legal pathways, passed together.",
     "A path to legal status for people who've lived and worked here for years, along with an orderly, well-run border.",
     "Securing the border and enforcing the laws we already have, first."
    ],
    "key": "IDR"
   },
   {
    "n": 5,
    "topic": "Guns",
    "stem": "Guns. I lean toward…",
    "choices": [
     "Adding measures like universal background checks, to help keep guns out of the wrong hands.",
     "Protecting the right to own firearms, and enforcing the laws that are already on the books.",
     "Some of each. I look at every proposal on its own merits."
    ],
    "key": "DRI"
   },
   {
    "n": 6,
    "topic": "Energy",
    "stem": "On energy, I want…",
    "choices": [
     "More American oil, gas, and energy production, without costly mandates.",
     "Whatever's cheapest and most reliable. Let technology and the market sort out the mix.",
     "A faster move to clean energy, backed by public investment and clear standards."
    ],
    "key": "RID"
   },
   {
    "n": 7,
    "topic": "Schools",
    "stem": "Schools. I'd prefer…",
    "choices": [
     "More investment in public schools and teachers.",
     "Let local communities decide what works for them.",
     "Expanded school choice, where the funding follows the student."
    ],
    "key": "DIR"
   },
   {
    "n": 8,
    "topic": "Social Security",
    "stem": "To keep Social Security going for the long haul, I'd…",
    "choices": [
     "Put everything on the table and get a bipartisan deal done.",
     "Reform it for future generations, including more options for personal accounts.",
     "Protect current benefits, and raise the cap on payroll taxes for high earners."
    ],
    "key": "IRD"
   },
   {
    "n": 9,
    "topic": "How you vote",
    "stem": "When you vote, you usually…",
    "choices": [
     "Mostly pick Republican candidates.",
     "Mostly pick Democratic candidates.",
     "Pick the person over the party. You split your ticket a lot."
    ],
    "key": "RDI"
   },
   {
    "n": 10,
    "topic": "Which statement fits",
    "stem": "Which of these sounds most like you?",
    "choices": [
     "“Fairness, opportunity for all, and a government that helps.”",
     "“Neither party speaks for me most of the time.”",
     "“Freedom, personal responsibility, and limited government.”"
    ],
    "key": "DIR"
   }
  ]
 },
 {
  "id": "ep2",
  "number": 2,
  "title": "Should Government Step In or Step Back?",
  "short": "Role of government",
  "draft": true,
  "questions": [
   {
    "n": 1,
    "topic": "Size of government",
    "stem": "When it comes to the size of government, I believe…",
    "choices": [
     "Size isn't the point. I care whether it's run well, and I'll back any program that delivers results for the money.",
     "A bigger role is worth it when it means more people get the help, services, and protections they need.",
     "Smaller is better. Lower costs, fewer programs, and more left to people, families, and communities."
    ],
    "key": "IDR"
   },
   {
    "n": 2,
    "topic": "Federal or state?",
    "stem": "On most big issues, the decision should be made by…",
    "choices": [
     "The states. Florida knows what Florida needs better than Washington does.",
     "Whichever level does that job best. Some things work better nationally, some locally, and I'd decide case by case.",
     "The federal government, with national standards, so your basic rights and protections don't depend on which state you live in."
    ],
    "key": "RID"
   },
   {
    "n": 3,
    "topic": "Regulation",
    "stem": "When it comes to rules for businesses…",
    "choices": [
     "We need strong rules that protect workers, consumers, and the environment, and the agencies to enforce them.",
     "Cut the red tape. Too many rules raise prices, slow hiring, and make it hard for small businesses to compete.",
     "Keep the rules that are proven to work, drop the ones that don't, and review them on a regular schedule."
    ],
    "key": "DRI"
   },
   {
    "n": 4,
    "topic": "The safety net",
    "stem": "Programs that help people who are struggling should…",
    "choices": [
     "Protect the people who truly need help, and go hard after waste and fraud so the money gets where it should.",
     "Be a temporary bridge, with work requirements, while churches, charities, and communities do more of the helping.",
     "Be strong and reliable. A real safety net is part of what a fair country owes its people."
    ],
    "key": "IRD"
   },
   {
    "n": 5,
    "topic": "The national debt",
    "stem": "To deal with the national debt, I'd…",
    "choices": [
     "Keep investing in things that grow the country, and ask the wealthiest and biggest corporations to pay more to cover it.",
     "Put everything on the table, spending cuts and new revenue together, in one deal both parties have to sign.",
     "Cut spending first. Washington doesn't have a revenue problem, it has a spending problem."
    ],
    "key": "DIR"
   },
   {
    "n": 6,
    "topic": "Disasters",
    "stem": "When a hurricane or other disaster hits…",
    "choices": [
     "States and local communities should lead, with the federal government backing them up, and people should be ready to look out for themselves and their neighbors.",
     "The federal government should lead, with plenty of funding for recovery and for preparing communities before the next storm.",
     "I don't care whose logo is on the truck. Whoever can get help there fastest should be in charge."
    ],
    "key": "RDI"
   },
   {
    "n": 7,
    "topic": "Trust",
    "stem": "Which is closest to how you feel about government?",
    "choices": [
     "I trust it when it earns it. I judge it one program at a time, not by which party is running it.",
     "Government can be a real force for good when it's properly funded and run by people who believe in it.",
     "I trust free people and free markets more than I trust government to make the right call."
    ],
    "key": "IDR"
   },
   {
    "n": 8,
    "topic": "Infrastructure",
    "stem": "To pay for roads, bridges, and internet access, the best approach is…",
    "choices": [
     "Major federal investment. These are things the whole country depends on.",
     "Let states and private partners lead, with tolls and user fees where they make sense, and less federal spending.",
     "Fund the projects with the clearest payoff, whoever pays for them, and publish what each one actually costs."
    ],
    "key": "DRI"
   },
   {
    "n": 9,
    "topic": "Wages",
    "stem": "When it comes to the minimum wage, I'd rather…",
    "choices": [
     "Let employers, workers, and the states set pay. A high federal minimum can cost entry-level jobs.",
     "Tie it to the local cost of living. A dollar in Tampa doesn't go as far as a dollar in a small town, and the reverse is true in big cities.",
     "Raise the federal minimum, so anyone working full time can afford the basics."
    ],
    "key": "RID"
   },
   {
    "n": 10,
    "topic": "Which sounds like you?",
    "stem": "Which statement sounds most like you?",
    "choices": [
     "“Government should make sure everybody gets a fair shot.”",
     "“I don't care how big government is. I just want it to work.”",
     "“The government that governs best is the one that stays out of the way.”"
    ],
    "key": "DIR"
   }
  ]
 }
];
