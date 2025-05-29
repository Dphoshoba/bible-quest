export type Difficulty = 'easy' | 'medium' | 'hard';
export type Category = 'old_testament' | 'new_testament' | 'gospels' | 'prophets' | 'wisdom';

export interface BibleQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  reference: string;
  difficulty: Difficulty;
  category: Category;
  hint: string;
  explanation: string;
  lesson: string;
  character: string;
}

export const questions: BibleQuestion[] = [
  {
    id: 1,
    question: "Who built the ark according to the Bible?",
    options: ["Moses", "Noah", "Abraham", "David"],
    correctAnswer: "Noah",
    reference: "Genesis 6:9",
    difficulty: "easy",
    category: "old_testament",
    hint: "This man was chosen by God to save his family and the animals from the flood.",
    explanation: "Noah was a righteous man who found favor in God's eyes. He was instructed to build an ark to save his family and pairs of every animal from the great flood.",
    lesson: "Noah teaches us about obedience and trust in God. Even when others didn't believe him, he followed God's instructions faithfully.",
    character: "Noah"
  },
  {
    id: 2,
    question: "How many days and nights did it rain during the flood?",
    options: ["30 days", "40 days", "50 days", "60 days"],
    correctAnswer: "40 days",
    reference: "Genesis 7:12",
    difficulty: "easy",
    category: "old_testament",
    hint: "This number appears frequently in the Bible, often representing a period of testing or trial.",
    explanation: "The rain fell for 40 days and 40 nights, symbolizing a period of testing and purification.",
    lesson: "The 40 days remind us that God's promises are true and that He keeps His word, even when things seem impossible.",
    character: "Noah"
  },
  {
    id: 3,
    question: "Who was thrown into the lion's den but was protected by God?",
    options: ["David", "Daniel", "Joseph", "Jonah"],
    correctAnswer: "Daniel",
    reference: "Daniel 6:16-23",
    difficulty: "medium",
    category: "prophets",
    hint: "This prophet served in the court of a foreign king and was known for his wisdom.",
    explanation: "Daniel was thrown into the lion's den for praying to God instead of the king, but God sent an angel to shut the lions' mouths.",
    lesson: "Daniel shows us the importance of staying faithful to God even when it's difficult or dangerous. He teaches us about courage and trust in God's protection.",
    character: "Daniel"
  },
  {
    id: 4,
    question: "What was the name of the first man created by God?",
    options: ["Adam", "Eve", "Abel", "Cain"],
    correctAnswer: "Adam",
    reference: "Genesis 2:7",
    difficulty: "easy",
    category: "old_testament",
    hint: "His name means 'man' or 'human' in Hebrew.",
    explanation: "Adam was created from the dust of the ground and God breathed into his nostrils the breath of life.",
    lesson: "Adam's story teaches us about our special relationship with God and the importance of taking care of God's creation.",
    character: "Adam"
  },
  {
    id: 5,
    question: "Who led the Israelites out of Egypt?",
    options: ["Abraham", "Moses", "Joshua", "David"],
    correctAnswer: "Moses",
    reference: "Exodus 3:10",
    difficulty: "easy",
    category: "old_testament",
    hint: "This prophet received the Ten Commandments on Mount Sinai.",
    explanation: "Moses was chosen by God to lead the Israelites out of slavery in Egypt and through the wilderness to the Promised Land.",
    lesson: "Moses teaches us about leadership, courage, and trusting God even when we feel inadequate. He shows us that God can use anyone who is willing to follow Him.",
    character: "Moses"
  },
  {
    id: 6,
    question: "Which book comes first in the New Testament?",
    options: ["Mark", "Matthew", "Luke", "John"],
    correctAnswer: "Matthew",
    reference: "Matthew 1:1",
    difficulty: "medium",
    category: "gospels",
    hint: "This gospel begins with a genealogy of Jesus.",
    explanation: "The Gospel of Matthew is the first book of the New Testament, written primarily for a Jewish audience.",
    lesson: "Matthew's gospel teaches us about Jesus' life and teachings, showing us how to live as followers of Christ.",
    character: "Matthew"
  },
  {
    id: 7,
    question: "What was the name of the place where Jesus was crucified?",
    options: ["Mount Sinai", "Mount of Olives", "Golgotha", "Mount Moriah"],
    correctAnswer: "Golgotha",
    reference: "John 19:17",
    difficulty: "medium",
    category: "gospels",
    hint: "This name means 'place of the skull' in Aramaic.",
    explanation: "Golgotha, also known as Calvary, was the place outside Jerusalem where Jesus was crucified.",
    lesson: "Jesus' sacrifice on the cross teaches us about God's great love for us and the importance of forgiveness.",
    character: "Jesus"
  },
  {
    id: 8,
    question: "Which prophet was swallowed by a great fish?",
    options: ["Elijah", "Jonah", "Elisha", "Isaiah"],
    correctAnswer: "Jonah",
    reference: "Jonah 1:17",
    difficulty: "easy",
    category: "prophets",
    hint: "This prophet was sent to preach to the city of Nineveh.",
    explanation: "Jonah was swallowed by a great fish after trying to flee from God's command to preach to Nineveh.",
    lesson: "Jonah's story teaches us about obedience and God's mercy. It shows us that we can't run away from God's plans for us.",
    character: "Jonah"
  },
  {
    id: 9,
    question: "What is the first book of the Bible?",
    options: ["Exodus", "Genesis", "Leviticus", "Numbers"],
    correctAnswer: "Genesis",
    reference: "Genesis 1:1",
    difficulty: "easy",
    category: "old_testament",
    hint: "This book begins with the creation story.",
    explanation: "Genesis is the first book of the Bible, meaning 'beginning' or 'origin' in Greek.",
    lesson: "Genesis teaches us about God's creation and His plan for humanity. It shows us that everything begins with God.",
    character: "God"
  },
  {
    id: 10,
    question: "Who wrote most of the Psalms?",
    options: ["Solomon", "David", "Moses", "Samuel"],
    correctAnswer: "David",
    reference: "Psalm 72:20",
    difficulty: "medium",
    category: "wisdom",
    hint: "This king was known as a man after God's own heart.",
    explanation: "King David wrote many of the Psalms, which are songs of praise, prayer, and worship to God.",
    lesson: "David teaches us about worship, repentance, and having a heart for God. His psalms show us how to express our feelings to God.",
    character: "David"
  },
  {
    id: 11,
    question: "Who was the youngest son of Jacob?",
    options: ["Joseph", "Benjamin", "Judah", "Reuben"],
    correctAnswer: "Benjamin",
    reference: "Genesis 35:18",
    difficulty: "medium",
    category: "old_testament",
    hint: "His mother died giving birth to him.",
    explanation: "Benjamin was the youngest son of Jacob and Rachel, born on the way to Bethlehem.",
    lesson: "Benjamin's story teaches us about family love and loyalty. His father Jacob's special love for him shows us the importance of family bonds.",
    character: "Benjamin"
  },
  {
    id: 12,
    question: "Who was the first king of Israel?",
    options: ["David", "Saul", "Solomon", "Samuel"],
    correctAnswer: "Saul",
    reference: "1 Samuel 10:1",
    difficulty: "medium",
    category: "old_testament",
    hint: "He was chosen by God but later lost the kingdom.",
    explanation: "Saul was anointed as the first king of Israel by the prophet Samuel.",
    lesson: "Saul's story teaches us about the importance of obedience and humility. It shows us what happens when we let pride take over.",
    character: "Saul"
  },
  {
    id: 13,
    question: "Who was the mother of Jesus?",
    options: ["Elizabeth", "Mary", "Martha", "Sarah"],
    correctAnswer: "Mary",
    reference: "Luke 1:31",
    difficulty: "easy",
    category: "gospels",
    hint: "She was visited by an angel who told her she would have a special baby.",
    explanation: "Mary was a young woman chosen by God to be the mother of Jesus, the Son of God.",
    lesson: "Mary teaches us about faith, obedience, and trust in God's plan. She shows us how to say 'yes' to God even when His plans seem impossible.",
    character: "Mary"
  },
  {
    id: 14,
    question: "Who was the first martyr of the Christian church?",
    options: ["Peter", "Paul", "Stephen", "James"],
    correctAnswer: "Stephen",
    reference: "Acts 7:54-60",
    difficulty: "hard",
    category: "new_testament",
    hint: "He was stoned to death for preaching about Jesus.",
    explanation: "Stephen was a deacon in the early church who was stoned to death for his faith in Jesus.",
    lesson: "Stephen teaches us about courage and forgiveness. Even while being stoned, he prayed for those who were killing him.",
    character: "Stephen"
  },
  {
    id: 15,
    question: "Who was the first person to see Jesus after His resurrection?",
    options: ["Peter", "Mary Magdalene", "John", "Thomas"],
    correctAnswer: "Mary Magdalene",
    reference: "John 20:11-18",
    difficulty: "medium",
    category: "gospels",
    hint: "She was one of Jesus' most faithful followers.",
    explanation: "Mary Magdalene was the first person to see Jesus after He rose from the dead.",
    lesson: "Mary Magdalene teaches us about loyalty and love for Jesus. Her story shows us that Jesus values everyone equally.",
    character: "Mary Magdalene"
  }
]; 