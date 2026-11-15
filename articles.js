// Editorial content. Shared by the API and the React app (single source of truth).

export const ARTICLE_CATEGORIES = ['Seasonal care', 'Health', 'Legal', 'Stray safety', 'Pet care', 'Advocacy']

export const ARTICLES = [
  {
    slug: 'water-for-street-animals-summer',
    title: 'Water for Life: Keeping Street Animals Hydrated Through an Indian Summer',
    category: 'Seasonal care',
    excerpt:
      'A bowl of clean water in the shade can be the difference between life and death. Here is how to set up a water station that actually works — and the mistakes that can harm the animals you are trying to help.',
    readTime: 6,
    date: '2026-03-21',
    featured: true,
    cover: '/images/cover-summer-water.svg',
    blocks: [
      {
        type: 'p',
        text: 'Between March and June, road surfaces in most Indian cities cross 50°C. Street dogs, cats, cattle and birds lose water fast — and clean drinking water is scarcer than food. Unlike hunger, dehydration can kill within hours, especially for puppies, kittens, nursing mothers and older animals.',
      },
      { type: 'h2', text: 'Why a bowl in the shade beats a bucket in the sun' },
      {
        type: 'p',
        text: 'Water left in direct sun heats up within an hour — animals often refuse it, and warm water grows bacteria faster. A shallow, heavy bowl placed in shade stays drinkable longer and does not tip over when a dog steps on the rim.',
      },
      {
        type: 'ul',
        items: [
          'Choose a wide, shallow bowl (2–3 inches deep). Deep vessels are hard for small dogs, cats and birds to drink from.',
          'Pick shade that lasts: under a tree, a compound wall, a shop awning. Avoid spots that become sun-baked by noon.',
          'Refill twice a day in normal heat, every 4–6 hours during a heatwave.',
          'Scrub the bowl daily. Algae and mosquito larvae appear within 48 hours in summer.',
          'Set out two or three small stations rather than one large one — animals compete less and more of them get a drink.',
          'Mark the station with paint or a sign so municipal sweepers and neighbours do not throw it away.',
        ],
      },
      { type: 'tip', title: 'Earthen pots stay cool', text: 'A matka or earthen bowl keeps water several degrees cooler than plastic or steel, and its rough surface is easy for animals to grip. Replace cracked pots — broken edges cut tongues and paws.' },
      { type: 'h2', text: 'What not to give' },
      {
        type: 'ul',
        items: [
          'Milk — most adult dogs and cats are lactose intolerant; it causes diarrhoea, which worsens dehydration.',
          'Ice-cold water — rapid cooling can shock an overheated animal. Cool, not cold, is the rule.',
          'Sugary drinks, tea, coffee or salt water — all harmful.',
          'Stale water with visible algae or floating debris — empty, scrub and refill instead.',
        ],
      },
      { type: 'h2', text: 'Shade is half the job' },
      {
        type: 'p',
        text: 'Water without shade still leaves animals panting in the sun. If you can, keep a corner of your compound or building lobby open to street animals during peak afternoon hours. A wet patch of earth under a tree works too — animals dig into cool soil to regulate body temperature.',
      },
      { type: 'h2', text: 'Recognise heatstroke early' },
      {
        type: 'p',
        text: 'Heatstroke is an emergency. Watch for heavy, noisy panting that does not settle, thick drooling, bright red gums, wobbling, vomiting or collapse.',
      },
      {
        type: 'ol',
        items: [
          'Move the animal to shade immediately. Do not crowd it.',
          'Pour cool — not ice-cold — water over the paws, belly, ears and neck; keep air moving with a fan or newspaper.',
          'Offer small sips of water only if the animal is conscious and swallowing.',
          'Call 108 or the nearest vet while you cool the animal. Do not wait to see if it improves.',
        ],
      },
      { type: 'warning', title: 'Never leave an animal in a parked vehicle', text: 'Even at 30°C outside, a parked car can reach 50°C within minutes. Cracking a window does not help. If you see an animal locked in a hot car, call 112 and note the vehicle number.' },
      { type: 'h2', text: 'Make it a neighbourhood habit' },
      {
        type: 'p',
        text: 'One person refilling one bowl changes one street. A building committee, a resident welfare association or a group of shopkeepers can keep five stations going with a rota. Pair it with the feeding drives on this site — and remember that water is needed all year, not only in summer.',
      },
    ],
  },
  {
    slug: 'vaccination-guide-dogs-cats',
    title: 'Vaccines Save Lives: A Practical Guide for Dogs and Cats',
    category: 'Health',
    excerpt:
      'Rabies kills about 5,700 people in India every year — and it is 100% preventable. Here is what to vaccinate, when, and why vaccinating street dogs protects everyone.',
    readTime: 7,
    date: '2026-09-28',
    featured: true,
    cover: '/images/cover-vaccination.svg',
    blocks: [
      {
        type: 'p',
        text: 'Vaccination is the cheapest, most effective protection we can give an animal — and, in the case of rabies, the most effective protection we can give ourselves. India records roughly 5,700 rabies deaths a year (ICMR, 2025), almost all from dog bites. Every one of those deaths is preventable.',
      },
      { type: 'h2', text: 'The core vaccines for dogs' },
      {
        type: 'ul',
        items: [
          'DHPPi — distemper, hepatitis (adenovirus), parvovirus and parainfluenza. A single combined shot covering four serious diseases.',
          'Anti-rabies — required by law in most Indian states and the backbone of rabies control.',
          'Leptospirosis — recommended in many parts of India, especially where dogs access stagnant water.',
          'Kennel cough (Bordetella) — useful for dogs in shelters, boarding or dense community settings.',
        ],
      },
      {
        type: 'p',
        text: 'Puppies usually start at 6–8 weeks, with boosters every 3–4 weeks until about 16 weeks of age. Rabies is given at 12–16 weeks. A booster at one year, then boosters every one to three years depending on the vaccine and your vet’s advice, keeps protection strong.',
      },
      { type: 'h2', text: 'The core vaccines for cats' },
      {
        type: 'ul',
        items: [
          'FVRCP — feline viral rhinotracheitis, calicivirus and panleukopenia.',
          'Anti-rabies — equally important for outdoor and indoor cats.',
        ],
      },
      {
        type: 'p',
        text: 'Kittens follow a similar schedule: start at 6–8 weeks, boost every 3–4 weeks until 16 weeks, then a one-year booster. Adult cats with an unknown history can start the course at any age.',
      },
      { type: 'tip', title: 'Keep a record', text: 'Ask for a vaccination card with dates, vaccine names and batch numbers. If you feed or foster community animals, a shared spreadsheet of vaccination dates makes booster drives far easier.' },
      { type: 'h2', text: 'Street dogs, ABC and the rabies shield' },
      {
        type: 'p',
        text: 'India’s Animal Birth Control (ABC) programme — governed by the ABC Rules, 2001 and updated in 2023 — pairs sterilisation with anti-rabies vaccination. A vaccinated, sterilised community dog is calmer, healthier and safer for the neighbourhood. This is why the World Health Organization calls mass dog vaccination the most cost-effective way to eliminate human rabies.',
      },
      { type: 'h2', text: 'If you are bitten or scratched' },
      {
        type: 'ol',
        items: [
          'Wash the wound immediately with soap and running water for a full 15 minutes. This single step dramatically reduces the risk of rabies.',
          'Do not apply chilli, turmeric, oil, lime or toothpaste — these are common but harmful home remedies.',
          'Go to a hospital or anti-rabies clinic the same day. Post-exposure prophylaxis (PEP) — a course of rabies vaccine, sometimes with immunoglobulin — is safe and highly effective.',
          'Note the animal’s location and description. Do not kill or chase it; a healthy dog can be observed. Inform the local municipality or animal welfare officer.',
        ],
      },
      { type: 'warning', title: 'There is no cure once symptoms appear', text: 'Rabies is almost always fatal after symptoms begin. If there is any risk of exposure, start PEP immediately — never “wait and watch”.' },
      {
        type: 'p',
        text: 'Vaccination schedules vary by product, age and health status. This guide is a starting point, not a prescription — always follow your veterinarian’s plan for the individual animal.',
      },
    ],
  },
  {
    slug: 'animal-rights-india-law',
    title: 'The Law Is on Their Side: Animal Rights in India',
    category: 'Legal',
    excerpt:
      'From Article 21 to the Prevention of Cruelty to Animals Act and the BNS, Indian law recognises animals as beings entitled to dignity. Here is what protects them — and how to use it.',
    readTime: 8,
    date: '2026-10-12',
    featured: true,
    cover: '/images/cover-legal-rights.svg',
    blocks: [
      {
        type: 'p',
        text: 'Animal protection in India rests on a surprisingly strong constitutional foundation. Article 51A(g) makes it a fundamental duty of every citizen to have compassion for living creatures. In 2014, the Supreme Court went further: in Animal Welfare Board of India v. A. Nagaraja, it held that animals are entitled to the right to life, liberty and dignity under Article 21.',
      },
      { type: 'h2', text: 'The Prevention of Cruelty to Animals Act, 1960' },
      {
        type: 'p',
        text: 'The PCA Act is the country’s core animal welfare law. Section 11 makes it an offence to treat any animal so as to subject it to unnecessary pain or suffering — covering beating, overloading, confinement, abandonment and failure to provide food, water or shelter. The Act also created the Animal Welfare Board of India (AWBI).',
      },
      {
        type: 'p',
        text: 'Its weakness is its penalty: a maximum fine of ₹50 for a first offence and ₹500 for a repeat offence, unchanged for decades. Amendment bills proposing far higher fines and imprisonment have repeatedly been drafted but not enacted. Courts have often used other provisions to impose meaningful consequences.',
      },
      { type: 'h2', text: 'The Bharatiya Nyaya Sanhita, 2023' },
      {
        type: 'p',
        text: 'Since the BNS replaced the Indian Penal Code in 2024, Section 325 covers killing, poisoning, maiming or rendering useless any animal. Importantly, it removed the old IPC limitation to “animals of value” — stray and community animals are now squarely covered. Punishment can extend to several years’ imprisonment. (Confirm the current text with a lawyer or the latest statute before citing it in a complaint.)',
      },
      { type: 'h2', text: 'Strays, ABC and feeding' },
      {
        type: 'ul',
        items: [
          'The Animal Birth Control Rules, 2001 (revised in 2023) require municipalities to sterilise and vaccinate street dogs rather than kill them.',
          'Community dogs have a right to their territory; removing or relocating them arbitrarily is not permitted under the ABC framework.',
          'Courts, including the Bombay High Court in 2023, have protected the right of residents to feed community animals in designated areas — with responsibility for cleanliness and hygiene.',
          'Sterilisation and vaccination are the legally mandated, humane route to stable street-dog populations.',
        ],
      },
      { type: 'h2', text: 'Wildlife, transport and entertainment' },
      {
        type: 'p',
        text: 'The Wild Life (Protection) Act, 1972 protects scheduled species and prohibits their capture, trade or keeping without permission. Separate rules govern the transport of animals, slaughterhouses, performing animals and experimentation. India also banned cosmetic testing on animals in 2014 — the first country in Asia to do so.',
      },
      { type: 'h2', text: 'How to file a cruelty complaint that moves' },
      {
        type: 'ol',
        items: [
          'Document first: date, time, exact location, what you saw, and photos or video taken from a safe distance.',
          'Give a written complaint at the nearest police station citing Section 11 of the PCA Act, 1960 and Section 325 of the BNS, 2023. Ask for a receipt or acknowledgement.',
          'Inform the AWBI grievance channel (awbi.gov.in) and your State Animal Welfare Board. Local SPCA societies and animal welfare officers can push the case.',
          'Follow up in writing. If the police refuse to register a complaint, escalate to the Superintendent of Police or Commissioner, then to the local magistrate.',
          'For ongoing or organised cruelty — illegal transport, puppy mills, baiting — also alert the local NGO network and, where wildlife is involved, the forest department.',
        ],
      },
      { type: 'tip', title: 'A short complaint template', text: '“I wish to report an offence under Section 11 of the Prevention of Cruelty to Animals Act, 1960 and Section 325 of the Bharatiya Nyaya Sanhita, 2023. On [date] at [time], at [address], I observed [describe]. Photographs/video are enclosed. Kindly register my complaint and provide an acknowledgement.”' },
      { type: 'warning', title: 'Do not confront the abuser', text: 'Your safety comes first. Record evidence, note vehicle numbers and identities if visible, and let the police and welfare organisations act. Confrontation can escalate and endanger both you and the animal.' },
    ],
  },
  {
    slug: 'stray-animal-safety',
    title: 'Street-Smart: Staying Safe Around Community Animals',
    category: 'Stray safety',
    excerpt:
      'Most dog “attacks” are fear responses, not hunting. Learn to read body language, defuse a charge, feed responsibly, and keep children safe around street animals.',
    readTime: 6,
    date: '2026-08-18',
    cover: '/images/cover-stray-safety.svg',
    blocks: [
      {
        type: 'p',
        text: 'India has an estimated 30 million street dogs, and millions of people live alongside them every day. Conflict is rare, but it happens — usually when a dog feels cornered, is protecting puppies or food, is injured, or has learned that chasing two-wheelers is rewarding. Understanding that behaviour keeps everyone safer.',
      },
      { type: 'h2', text: 'If a dog runs at you' },
      {
        type: 'ul',
        items: [
          'Do not run. Running triggers a chase instinct and you will not outrun a dog.',
          'Stop, stand still and turn slightly sideways. Avoid a direct stare, which reads as a challenge.',
          'Do not scream, wave your arms or smile with teeth showing.',
          'Back away slowly once the dog loses interest. Keep a bag, bicycle or umbrella between you as a barrier — not as a weapon.',
          'If you are knocked down, curl into a ball, protect your head and neck, and stay still.',
        ],
      },
      { type: 'h2', text: 'Read the body language' },
      {
        type: 'ul',
        items: [
          'Relaxed: soft ears, loose wagging tail, curved body — usually safe to pass at a distance.',
          'Anxious: lip-licking, yawning, tucked tail, looking away — give space and do not approach.',
          'Warning: stiff body, hard stare, growl, bared teeth, raised hackles — stop, do not stare, move away slowly.',
          'Pain or fear: trembling, snapping when touched, hiding — call a rescuer instead of handling the animal yourself.',
        ],
      },
      { type: 'h2', text: 'Children need different rules' },
      {
        type: 'ul',
        items: [
          'Never approach an unknown dog, even a “friendly” one, without an adult and the dog’s caregiver present.',
          'Do not hug, kiss, pick up or stare at dogs; do not take food or toys from them.',
          'Never disturb a dog that is eating, sleeping or with puppies.',
          'If a dog approaches, stand still like a tree and tell an adult.',
        ],
      },
      { type: 'h2', text: 'Feeding responsibly' },
      {
        type: 'p',
        text: 'Feeding community animals is legal and valuable — but how you feed matters. Pick a fixed time and a safe spot away from traffic and doorways. Use a clean plate or newspaper you can remove, never plastic bags that animals swallow. Avoid bones (splinters), onion, garlic, chocolate, grapes and salty human leftovers.',
      },
      {
        type: 'ul',
        items: [
          'Feed after peak traffic hours and in daylight.',
          'Clean up leftovers so the spot does not become a garbage pile or a complaint.',
          'Always provide clean water alongside food.',
          'Coordinate with neighbours and other feeders so animals are not overfed or fed at random hours.',
          'Support ABC sterilisation and vaccination drives — they are the long-term solution.',
        ],
      },
      { type: 'warning', title: 'If someone is bitten', text: 'Wash the wound with soap and running water for 15 minutes and go to a hospital the same day for rabies post-exposure prophylaxis. Do not apply home remedies. Report the incident to the local animal welfare officer so the dog can be observed — not killed.' },
      { type: 'h2', text: 'Monsoon and festival care' },
      {
        type: 'p',
        text: 'During heavy rain, street animals need raised, dry shelter and fresh water that has not been contaminated by runoff. Around Diwali, loud crackers cause panic, running injuries and stress-related illness; keep pets indoors, use a quiet room with white noise, and never let a frightened animal off-leash.',
      },
    ],
  },
  {
    slug: 'proper-pet-care-basics',
    title: 'Beyond Cuddles: The Everyday Basics of Proper Pet Care',
    category: 'Pet care',
    excerpt:
      'Adopting an animal is a 10–15 year commitment. From nutrition and vaccination to enrichment and festival safety, here is the practical checklist every guardian needs.',
    readTime: 7,
    date: '2026-07-05',
    cover: '/images/cover-pet-care.svg',
    blocks: [
      {
        type: 'p',
        text: 'A pet is not a decoration or a temporary lockdown hobby. Dogs and cats depend on us for food, water, health care, safety and company for their entire lives. Good care is mostly ordinary, consistent things done well.',
      },
      { type: 'h2', text: 'Adopt, don’t shop' },
      {
        type: 'p',
        text: 'Indian pariah dogs and community cats are hardy, adaptable and genetically healthier than many pedigree breeds. Shelters and foster networks are full of vaccinated, sterilised animals waiting for homes. Buying from a pet shop or breeder often funds puppy mills; if you do buy, visit the breeding facility and insist on health records.',
      },
      { type: 'h2', text: 'Health: the non-negotiables' },
      {
        type: 'ul',
        items: [
          'Vaccinate on schedule (see our vaccination guide) and keep a record.',
          'Deworm regularly — typically every three months for adults, and as advised for puppies and kittens.',
          'Use vet-prescribed flea and tick prevention, especially in humid months.',
          'Spay or neuter. It prevents cancers and pyometra, reduces roaming and fighting, and stops unwanted litters.',
          'Book an annual health check, even when the animal seems fine. Dental disease and arthritis are easy to miss.',
        ],
      },
      { type: 'h2', text: 'Food and water' },
      {
        type: 'p',
        text: 'Feed a complete, species-appropriate diet in portions suited to the animal’s weight, age and activity. Dogs are omnivores; cats are obligate carnivores and need meat-based food. Fresh, clean water must be available at all times.',
      },
      {
        type: 'ul',
        items: [
          'Never feed onion, garlic, grapes, raisins, chocolate, coffee, alcohol or xylitol (found in sugar-free gum) — all are toxic.',
          'Avoid cooked bones; they splinter and can perforate the gut.',
          'Skip spicy, oily human leftovers — they cause pancreatitis and diarrhoea.',
          'Measure portions; obesity is one of the most common welfare problems in Indian pets.',
        ],
      },
      { type: 'h2', text: 'A safe home' },
      {
        type: 'ul',
        items: [
          'Use a leash and a collar or harness with an ID tag carrying your phone number. Microchip if available.',
          'Mesh balconies and windows for cats — high-rise falls are common and often fatal.',
          'Store medicines, phenyl, rat poison and cleaning chemicals out of reach.',
          'Never leave an animal in a parked car, even briefly.',
          'Plan for Diwali: quiet room, closed windows, white noise, and company during peak firework hours.',
        ],
      },
      { type: 'h2', text: 'Enrichment is welfare' },
      {
        type: 'p',
        text: 'A bored animal is a stressed animal. Dogs need daily walks and sniffing time; cats need scratching posts, climbing spaces and play that mimics hunting. Rotate toys, use puzzle feeders, and give animals a quiet place to retreat. Socialisation — gentle exposure to people, sounds and other animals — prevents fear and aggression later.',
      },
      { type: 'tip', title: 'The Five Freedoms', text: 'Every animal should have: freedom from hunger and thirst; from discomfort; from pain, injury and disease; freedom to express normal behaviour; and freedom from fear and distress. Use this as your checklist.' },
      { type: 'warning', title: 'Abandonment is a crime', text: 'Turning an animal out when it becomes inconvenient is cruelty under the PCA Act and leaves the animal to starve, be injured or be abused. If you truly cannot keep an animal, contact a shelter or rehoming network — never dump it.' },
    ],
  },
  {
    slug: 'how-to-report-animal-cruelty',
    title: 'Report It Right: Documenting Cruelty So Action Actually Happens',
    category: 'Advocacy',
    excerpt:
      'A blurry photo and an angry post rarely help. A time-stamped, geotagged, written complaint does. Here is the evidence checklist that welfare officers and police need.',
    readTime: 5,
    date: '2026-11-01',
    cover: '/images/cover-report.svg',
    blocks: [
      {
        type: 'p',
        text: 'Animal cruelty cases fail for mundane reasons: no location, no time, no written complaint, no follow-up. Whether you use this site’s report form or go straight to the police, the quality of your documentation decides whether anything happens.',
      },
      { type: 'h2', text: 'What to record' },
      {
        type: 'ul',
        items: [
          'Date and exact time.',
          'Precise location — street, landmark, building name, and GPS coordinates if possible.',
          'What you saw, in plain factual language. Avoid conclusions; describe actions.',
          'The animal: species, approximate age, colour, distinguishing marks, visible injuries.',
          'Photos or video: one wide shot showing the location, then close-ups of the animal and injuries.',
          'Vehicle numbers, shop names or people involved, if visible from a safe distance.',
          'Names and phone numbers of any witnesses.',
        ],
      },
      { type: 'warning', title: 'Your safety comes first', text: 'Never confront a person abusing an animal, enter private property, or film people in a way that provokes them. Report and move away. For organised cruelty or illegal transport, call 112.' },
      { type: 'h2', text: 'Where to send it' },
      {
        type: 'ol',
        items: [
          'In an emergency or a crime in progress: call 112.',
          'File a written complaint at the nearest police station under Section 11 of the PCA Act, 1960 and Section 325 of the BNS, 2023. Keep a receipt.',
          'Submit the details to AWBI’s grievance channel at awbi.gov.in and to your State Animal Welfare Board.',
          'Alert a local shelter or rescue from the directory — they can provide veterinary care and practical support.',
          'Use Rescue Beacon’s report form to create a timestamped record with photos and location, and to route the case to the right team.',
        ],
      },
      { type: 'h2', text: 'Follow up' },
      {
        type: 'p',
        text: 'Ask for the complaint number and the name of the officer. Follow up after 48 hours, then weekly. If no action is taken, escalate in writing to the Superintendent of Police or Commissioner, and then to the magistrate. Persistence is what separates a closed file from a prosecution.',
      },
      { type: 'tip', title: 'Share responsibly', text: 'Blur identifying details before posting images publicly, and avoid graphic content that can traumatise viewers. Do not name suspects online — it can compromise the case and invite harassment. Let the formal complaint do the work.' },
      {
        type: 'p',
        text: 'Every credible report builds the record that authorities respond to. Even when a single case cannot be prosecuted, documented patterns lead to rescues, seizures and policy action.',
      },
    ],
  },
]

export const getArticle = (slug) => ARTICLES.find((a) => a.slug === slug)
