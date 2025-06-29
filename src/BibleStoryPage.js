import React, { useContext, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CharacterContext } from './CharacterContext.js';
import AiBuddy from "./components/AiBuddy.js";
import { API_ENDPOINTS } from "./config.js";
import ShareButton from './components/ShareButton.js';

const stories = {
  david: {
    name: "David the Brave Shepherd",
    image: "/stories/david_scene1.png",
    levels: [
      {
        title: "Level 1: David the Brave Shepherd (Ages 3-6)",
        content: [
          "David was a little boy who looked after sheep. He loved God very much.",
          "Every day, David took care of his sheep. He kept them safe from big animals like lions and bears.",
          "One day, a giant named Goliath came. He was very big and scary. Everyone was afraid of him.",
          "But David was not scared! He said, 'God will help me.'",
          "David picked up five smooth stones and put one in his sling. He swung it around and let the stone fly.",
          "The stone hit the giant, and Goliath fell down!",
          "Everyone was so happy! David was brave because he trusted God.",
          "David also loved to play music on his harp and sing to God.",
          '"The Lord is my shepherd." – Psalm 23:1'
        ],
        application: "Even when we are small or afraid, we can trust God to help us be brave."
      },
      {
        title: "Level 2: David the Brave Shepherd (Ages 6+)",
        content: [
          "David was a young shepherd boy who lived in the hills of Bethlehem. Even though he was the youngest in his family, he was strong, kind, and loved God with all his heart.",
          "Every day, David looked after his father's sheep. He led them to green pastures and cool streams, making sure they were safe and happy. Sometimes, wild animals like lions and bears tried to attack the flock. But David was brave—he trusted God to protect him, and he fought off the wild animals to keep his sheep safe.",
          "David also loved music. When he wasn't watching the sheep, he played beautiful songs on his harp and sang praises to God. His music was so lovely that even King Saul asked David to play for him whenever he felt sad.",
          "One day, a terrible giant named Goliath came to fight the Israelite army. Goliath was over nine feet tall and wore heavy armour. He shouted at the Israelites every morning, daring them to send someone to fight him. But everyone was too afraid.",
          "David's brothers were soldiers, so David visited them to bring food. When he heard Goliath's challenge, David was surprised that no one was brave enough to face the giant. He said, 'God has helped me protect my sheep from lions and bears. He will help me defeat this giant too!'",
          "David went to King Saul and offered to fight Goliath. The king was unsure, but David's courage convinced him. David didn't wear any armour—he trusted God to protect him. He picked up five smooth stones from a stream and took his sling.",
          "As Goliath laughed at the sight of the small shepherd boy, David stood tall and said, 'You come to me with a sword and spear, but I come to you in the name of the Lord!' He put a stone in his sling, swung it around, and let it fly. The stone hit Goliath right on the forehead, and the giant fell to the ground!",
          "The Israelites cheered! David had saved them because he trusted God and was very brave.",
          "David grew up to become a great king, but he never forgot to trust God and sing praises to Him.",
          '"The Lord is my shepherd." – Psalm 23:1'
        ],
        application: "David's story reminds us that God can use anyone, no matter how young or small, to do great things when we trust Him."
      },
      {
        title: "Level 3: The Life of David (Summary)",
    content: [
          "David was the youngest of eight brothers and lived in Bethlehem. His job was to take care of his father's sheep. Being a shepherd wasn't easy—it was often lonely, with cold nights and hot days, and the sheep could not talk to him. But David loved his work and cared for each sheep carefully. He knew them all and made sure they had good grass to eat and fresh water to drink.",
          "David was very brave. When wild animals like lions or bears tried to attack his sheep, David would fight them off to keep his flock safe. This taught him courage and trust in God, even when he was alone in the fields.",
          "One day, David was sent to bring food to his brothers who were soldiers. While he was there, he saw a giant named Goliath who scared everyone. But David was not afraid because he remembered how God helped him protect his sheep from wild animals. David picked up five smooth stones and used his sling to defeat the giant with God's help.",
          "David also loved to play music on his harp and sing songs to God. Later, he became a great king, uniting the people of Israel and making Jerusalem their capital. Even when he made mistakes, David always trusted God and asked for forgiveness.",
          "David's life shows how caring for others, being brave, and trusting God can help us do great things.",
      '"The Lord is my shepherd." – Psalm 23:1'
        ],
        application: "David's life shows us the importance of courage, faith, and trusting God through good times and bad."
      }
    ]
  },
  esther: {
    name: "Esther the Courageous Queen",
    image: "/stories/esther_scene1.png",
    levels: [
      {
        title: "Level 1: Esther the Courageous Queen (Ages 3-6)",
        content: [
          "Esther was a kind and beautiful girl who loved God.",
          "She became a queen in a big palace.",
          "One day, Esther heard her people were in trouble. She was scared, but she prayed to God.",
          "Esther went to the king and asked for help. The king listened to her because she was brave and kind.",
          "God helped Esther save her people. Everyone was happy!",
          "\"For such a time as this...\" – Esther 4:14"
        ],
        application: "Esther's story reminds us to be courageous and stand up for others, even when it's hard. God can use us to help people if we trust Him."
      },
      {
        title: "Level 2: Esther the Courageous Queen (Ages 6+)",
        content: [
          "Esther was a young Jewish girl who lived in Persia. She was kind, beautiful, and loved God. When the king was looking for a new queen, Esther was chosen because of her beauty and grace.",
          "Esther's cousin, Mordecai, had raised her and always told her to trust God. One day, Mordecai heard about a plan to hurt all the Jewish people. He asked Esther to help, but going to the king without being invited could mean death.",
          "Esther was scared, but she prayed and fasted for three days. She trusted God and decided to be brave. She went to the king, and he was happy to see her. He asked what she wanted, and Esther invited him to a special dinner.",
          "At the dinner, Esther told the king about the plan to hurt her people. The king was angry and stopped the plan. God used Esther to save her people because she was brave and trusted Him.",
          "\"For such a time as this...\" – Esther 4:14"
        ],
        application: "Esther's story teaches us that God can use us to help others if we are brave and trust Him, even when it's scary."
      },
      {
        title: "Level 3: Esther and Mordecai - A Story of Family and Faith",
    content: [
          "Mordecai was a wise and faithful man who lived in Persia. When his cousin Esther's parents died, he took her in and raised her as his own daughter. He taught her about God and how to be kind and wise.",
          "Mordecai worked at the king's gate, where he could watch over Esther even after she became queen. One day, he overheard two guards planning to hurt the king. Mordecai told Esther, who told the king, and the guards were caught. The king wrote this good deed in his book.",
          "Later, a man named Haman became very powerful and wanted to hurt all the Jewish people. He was especially angry at Mordecai because Mordecai wouldn't bow down to him. Haman made a plan to destroy all the Jews, but Mordecai wouldn't give up.",
          "Mordecai sent a message to Esther: 'Maybe you were made queen for such a time as this.' He encouraged her to be brave and help her people. Esther listened to Mordecai's wise advice and saved her people.",
          "The king honored Mordecai for his loyalty and made him second in command. Together, Esther and Mordecai showed how family love and faith in God can overcome any challenge.",
          "\"For such a time as this...\" – Esther 4:14"
        ],
        application: "Esther and Mordecai's story shows us how family support and faith in God can help us overcome difficult situations. It teaches us to be brave, wise, and always ready to help others."
      }
    ]
  },
  samson: {
    name: "Samson the Strong Judge",
    image: "/stories/samson_scene1.png",
    levels: [
      {
        title: "Level 1: Samson the Strong Judge (Ages 3-6)",
        content: [
          "Samson was a very strong man. God gave him special strength.",
          "Samson had long hair. That was his secret!",
          "He helped his people and fought the bad Philistines.",
          "Samson trusted God, even when he was in trouble.",
          "God made Samson strong again, and he helped his people.",
          "God loves to help us when we ask!",
          '"God gave me strength again."'
        ],
        application: "Samson's story shows us that our strength comes from God. Even if we make mistakes, God can forgive us and help us do good things."
      },
      {
        title: "Level 2: Samson the Strong Judge (Ages 6+)",
        content: [
          "Samson was a man chosen by God to help the Israelites. God gave him incredible strength, and his long hair was a sign of his special promise to God. Samson used his strength to fight the Philistines, who were causing trouble for his people.",
          "One day, Samson fell in love with a woman named Delilah. The Philistines asked her to find out the secret of his strength. After many tries, Samson told her that his strength came from his long hair. While he slept, Delilah cut his hair, and Samson lost his strength.",
          "The Philistines captured Samson and made him work hard. But Samson prayed to God, and his hair grew back. One day, in a big temple, Samson pushed the pillars, and the building fell. He saved his people, even though it cost him his life.",
          '"God gave me strength again."'
        ],
        application: "Samson's story reminds us that our strength comes from God, and even when we make mistakes, God can help us do good things if we trust Him."
      },
      {
        title: "Level 3: The Life of Samson - A Story of Strength and Redemption",
    content: [
          "Samson was born to parents who had prayed for a child. An angel told them that their son would be special and would help save Israel from the Philistines. God blessed Samson with incredible strength, and he grew up to be a powerful leader.",
          "As a young man, Samson faced many challenges. He fought lions with his bare hands and used his strength to protect his people. However, he sometimes made poor choices, especially when it came to relationships. He fell in love with Delilah, who betrayed him to the Philistines.",
          "When Delilah cut his hair, Samson lost his strength and was captured by the Philistines. They blinded him and made him work as a slave. But even in his darkest hour, Samson never lost his faith in God. As his hair grew back, so did his strength.",
          "In his final act, Samson prayed to God for strength one last time. He pushed the pillars of the Philistine temple, causing it to collapse. This act saved his people from their enemies. Samson's story shows us that God can use anyone, even after they've made mistakes, to do great things.",
      '"God gave me strength again."'
        ],
        application: "Samson's life teaches us that true strength comes from God, and even when we make mistakes, God can use us to do great things if we trust in Him and seek His help."
      }
    ]
  },
  joseph: {
    name: "Joseph the Dreamer",
    image: "/stories/joseph_scene1.png",
    levels: [
      {
        title: "Level 1: Joseph the Dreamer (Ages 3-6)",
        content: [
          "Joseph had many brothers. He loved God and his family.",
          "His father gave him a beautiful coat of many colors.",
          "Joseph had special dreams from God.",
          "His brothers were jealous and sent him far away.",
          "But God was with Joseph and helped him forgive his brothers.",
          "Joseph became a helper to many people!",
          '"You meant it for harm, but God..." – Gen 50:20'
        ],
        application: "Joseph's story teaches us to forgive others and trust that God can bring good out of hard situations."
      },
      {
        title: "Level 2: Joseph the Dreamer (Ages 6+)",
        content: [
          "Joseph was the favorite son of his father, Jacob. His father gave him a beautiful coat of many colors, which made his brothers jealous. Joseph also had dreams that showed he would one day be great, which made his brothers even more upset.",
          "One day, Joseph's brothers sold him to traders, who took him to Egypt. There, Joseph worked hard and trusted God. He became a helper to a man named Potiphar, but when Potiphar's wife lied about him, Joseph was put in prison.",
          "In prison, Joseph helped others by interpreting their dreams. Later, the king of Egypt had a dream, and Joseph was called to explain it. The king was so impressed that he made Joseph a leader in Egypt, helping to save many people from hunger.",
          "Years later, Joseph's brothers came to Egypt for food. Joseph forgave them and said, 'You meant it for harm, but God meant it for good.'",
          '"You meant it for harm, but God..." – Gen 50:20'
        ],
        application: "Joseph's story shows us that even when bad things happen, God can turn them into good if we trust Him and forgive others."
      },
      {
        title: "Level 3: The Life of Joseph - A Story of Faith and Forgiveness",
    content: [
          "Joseph was the son of Jacob and Rachel, born in his father's old age. As a young man, he had dreams that showed he would one day be great. His father gave him a special coat, showing his love, but this made his brothers jealous.",
          "When Joseph was seventeen, his brothers sold him into slavery in Egypt. There, he worked for Potiphar, an important official. Joseph was honest and hardworking, but when he refused to do wrong, he was falsely accused and sent to prison.",
          "In prison, Joseph interpreted dreams for other prisoners. This gift eventually led him to interpret Pharaoh's dreams about seven years of plenty followed by seven years of famine. Pharaoh made Joseph second in command of Egypt.",
          "During the famine, Joseph's brothers came to Egypt for food. They didn't recognize him, but Joseph knew them. Instead of seeking revenge, Joseph forgave them and said, 'You meant it for harm, but God meant it for good.' He brought his family to Egypt and cared for them.",
          "Joseph's life shows us how God can use difficult circumstances to prepare us for great things. His story teaches us about forgiveness, faith, and trusting God's plan.",
      '"You meant it for harm, but God..." – Gen 50:20'
        ],
        application: "Joseph's life teaches us that God can use our difficult experiences to prepare us for greater things. It shows us the power of forgiveness and trusting in God's plan, even when we don't understand it."
      }
    ]
  },
  "mary-joseph": {
    name: "Mary & Joseph",
    image: "/stories/maryandjoseph_scene1.png",
    levels: [
      {
        title: "Level 1: Mary & Joseph (Ages 3-6)",
        content: [
          "Mary and Joseph loved God very much.",
          "An angel told Mary she would have a special baby named Jesus.",
          "Joseph took care of Mary and baby Jesus.",
          "They traveled to Bethlehem, where Jesus was born in a stable.",
          "Mary and Joseph thanked God for their family.",
          '"You have found favor with God." – Luke 1:30'
        ],
        application: "Mary and Joseph's story reminds us to trust God's plan and care for our families with love."
      },
      {
        title: "Level 2: Mary & Joseph (Ages 6+)",
        content: [
          "Mary was a young woman who loved God. One day, an angel appeared to her and said she would have a special baby named Jesus, who would be the Son of God. Mary was surprised but trusted God's plan.",
          "Joseph, Mary's husband, was a kind and caring man. When he found out Mary was going to have a baby, he was confused, but an angel told him in a dream that the baby was from God. Joseph decided to take care of Mary and the baby.",
          "Mary and Joseph had to travel to Bethlehem for a census. When they arrived, there was no room in the inn, so Jesus was born in a stable. Shepherds and wise men came to visit the baby, and Mary and Joseph knew that God had a special plan for their family.",
          '"You have found favor with God." – Luke 1:30'
        ],
        application: "Mary and Joseph's story teaches us to trust God's plan and care for our families with love, even when things are unexpected."
      },
      {
        title: "Level 3: The Life of Mary & Joseph - A Story of Faith and Family",
    content: [
          "Mary was a young woman from Nazareth who loved God deeply. When the angel Gabriel appeared to her, he told her she would have a special baby named Jesus. Mary trusted God completely, even though she didn't understand everything.",
          "Joseph was a carpenter, a good and kind man. When he learned Mary was expecting a baby, he was confused and hurt. But an angel appeared to him in a dream, explaining that the baby was from God. Joseph chose to trust God and take care of Mary and Jesus.",
          "When the Roman emperor ordered a census, Mary and Joseph had to travel to Bethlehem. The journey was difficult, especially for Mary who was about to have her baby. When they arrived, there was no room in the inn, so Jesus was born in a stable.",
          "After Jesus was born, shepherds came to visit, telling of angels who had announced the birth. Later, wise men from the East came, bringing gifts and worshiping the baby. Mary and Joseph protected Jesus from King Herod's anger by fleeing to Egypt.",
          "Mary and Joseph raised Jesus in Nazareth, teaching him about God and their faith. They watched him grow in wisdom and favor with God and people. Their story shows us the importance of faith, trust, and family love.",
      '"You have found favor with God." – Luke 1:30'
        ],
        application: "Mary and Joseph's life teaches us about trusting God's plan, even when it's difficult to understand. It shows us the importance of family love and faith in raising children."
      }
    ]
  },
  paul: {
    name: "Paul the Bold Preacher",
    image: "/stories/paul_scene1.png",
    levels: [
      {
        title: "Level 1: Paul the Bold Preacher (Ages 3-6)",
        content: [
          "Paul loved telling people about Jesus.",
          "He traveled to many places to share the good news.",
          "Paul wrote letters to help and encourage his friends.",
          "Even when things were hard, Paul trusted God.",
          "Paul taught everyone that Jesus loves them!",
          '"I can do all this..." – Phil 4:13'
        ],
        application: "Paul's story encourages us to share God's love with others and keep going, even when life is tough."
      },
      {
        title: "Level 2: Paul the Bold Preacher (Ages 6+)",
        content: [
          "Paul was once a man named Saul who didn't like Christians. But one day, Jesus appeared to him and changed his heart. Paul became a bold preacher, traveling to many places to tell people about Jesus.",
          "Paul wrote letters to his friends, encouraging them to love God and others. He faced many challenges, like being put in prison, but he never stopped sharing the good news. Paul taught that Jesus loves everyone and wants to be their friend.",
          "Paul's life shows us that God can change anyone's heart and use them to do great things.",
          '"I can do all this..." – Phil 4:13'
        ],
        application: "Paul's story teaches us that God can change our hearts and use us to share His love with others, even when things are hard."
      },
      {
        title: "Level 3: The Life of Paul - A Story of Transformation",
    content: [
          "Paul, originally named Saul, was a well-educated Jewish leader who persecuted Christians. He was present when Stephen, the first Christian martyr, was killed. But one day, while traveling to Damascus, Jesus appeared to him in a bright light.",
          "After this encounter, Paul was blind for three days. When his sight was restored, he became a follower of Jesus. He changed his name from Saul to Paul and began preaching about Jesus. Many people were surprised by this change, but Paul was determined to share the good news.",
          "Paul traveled to many countries, starting churches and teaching about Jesus. He wrote letters to these churches, which became part of the Bible. These letters teach us about love, faith, and how to live as followers of Jesus.",
          "Paul faced many difficulties: he was beaten, imprisoned, and shipwrecked. But he never gave up. He said, 'I can do all things through Christ who strengthens me.' Paul's life shows us how God can transform anyone and use them to do great things.",
      '"I can do all this..." – Phil 4:13'
        ],
        application: "Paul's life teaches us that God can transform anyone, no matter their past. It shows us the power of faith and perseverance in sharing God's love with others."
      }
    ]
  },
  jesus: {
    name: "Jesus the Savior",
    image: "/stories/jesus_scene1.png",
    levels: [
      {
        title: "Level 1: Jesus the Savior (Ages 3-6)",
        content: [
          "Jesus was born in a little town called Bethlehem. His mother was Mary.",
          "Jesus loved children and always blessed them.",
          "He told wonderful stories and helped people who were sick.",
          "One day, Jesus fed a big crowd with just a little boy's lunch!",
          "Jesus walked on water and showed God's love to everyone.",
          "He died on a cross, but then He came back to life! Jesus is our friend forever.",
          "\"I am the way...\" – John 14:6"
        ],
        application: "Jesus' story shows us that God loves us so much and wants to be our friend forever. We can show love and kindness to others like Jesus did."
      },
      {
        title: "Level 2: Jesus the Savior (Ages 6+)",
        content: [
          "Jesus was born in Bethlehem to Mary and Joseph. He grew up to be a kind and loving teacher who told stories about God's love. Jesus performed miracles, like healing the sick and feeding thousands with just a few loaves of bread.",
          "Jesus taught people to love God and each other. He showed kindness to everyone, especially children and those who were hurting. Jesus' greatest act of love was when He died on the cross to save us from our mistakes. But He didn't stay dead—He came back to life, showing that He is stronger than death.",
          "Jesus is our Savior and friend, always ready to help us when we need Him.",
          "\"I am the way...\" – John 14:6"
        ],
        application: "Jesus' story teaches us that God's love is powerful and can help us overcome any challenge. We can follow Jesus by showing love and kindness to others."
      },
      {
        title: "Level 3: The Life of Jesus - A Story of Love and Salvation",
    content: [
          "Jesus was born in Bethlehem, the Son of God, sent to save the world. He grew up in Nazareth, learning about God and helping his father Joseph in the carpentry shop. When he was twelve, he amazed teachers at the temple with his understanding of God's word.",
          "As an adult, Jesus began his ministry by teaching about God's love and performing miracles. He healed the sick, fed the hungry, and even raised people from the dead. He taught through parables, stories that helped people understand God's kingdom.",
          "Jesus chose twelve disciples to follow him and learn from him. He showed them how to love God and others. He taught that the greatest commandments are to love God with all our heart and to love our neighbors as ourselves.",
          "Jesus' greatest act of love was his death on the cross. He took the punishment for our mistakes, showing how much God loves us. Three days later, he rose from the dead, proving he is the Son of God and giving us hope for eternal life.",
          "Jesus' life and teachings continue to inspire people to live with love, hope, and faith. He showed us how to live and promised to be with us always.",
          "\"I am the way...\" – John 14:6"
        ],
        application: "Jesus' life shows us the power of God's love and how we can follow his example by loving and helping others. It teaches us that through faith in Jesus, we can have eternal life and a relationship with God."
      }
    ]
  },
  "adam-eve": {
    name: "Adam & Eve",
    image: "/stories/adamandeve_scene1.png",
    levels: [
      {
        title: "Level 1: Adam & Eve (Ages 3-6)",
        content: [
          "God made Adam and Eve, the first people.",
          "They lived in a beautiful garden called Eden.",
          "God told them to take care of the garden and animals.",
          "Adam and Eve made a mistake, but God still loved them.",
          "God always wants us to listen and trust Him.",
          '"Where are you?" – Genesis 3:9'
        ],
        application: "Adam and Eve's story reminds us that even when we make mistakes, God still loves us and wants us to listen to Him."
      },
      {
        title: "Level 2: Adam & Eve (Ages 6+)",
        content: [
          "God created Adam and Eve and placed them in the Garden of Eden, a beautiful place full of plants and animals. God told them they could eat from any tree except one, the Tree of Knowledge of Good and Evil.",
          "One day, a serpent tricked Eve into eating the forbidden fruit, and she gave some to Adam. They realized they had made a mistake and felt ashamed. God found them and asked, 'Where are you?'",
          "Even though Adam and Eve had disobeyed, God still loved them. He made clothes for them and promised a way to fix their mistake. Their story teaches us about trust, obedience, and God's love.",
          '"Where are you?" – Genesis 3:9'
        ],
        application: "Adam and Eve's story teaches us that God loves us even when we make mistakes, and He wants us to trust and obey Him."
      },
      {
        title: "Level 3: The Life of Adam & Eve - A Story of Creation and Choice",
    content: [
          "God created Adam from the dust of the ground and breathed life into him. He placed Adam in the Garden of Eden, a perfect paradise, and gave him the responsibility to care for it. God saw that Adam needed a companion, so He created Eve from Adam's rib.",
          "God gave Adam and Eve everything they needed in the garden. They could eat from any tree except the Tree of Knowledge of Good and Evil. God warned them that eating from this tree would bring death. This was a test of their trust and obedience.",
          "One day, a serpent, who was actually Satan in disguise, tricked Eve by questioning God's command. He told her that eating the fruit would make her wise like God. Eve ate the fruit and gave some to Adam. Immediately, they realized they had made a terrible mistake.",
          "When God came to the garden, Adam and Eve hid because they were ashamed. God called out, 'Where are you?' This wasn't because He didn't know where they were, but because He wanted them to come to Him and admit their mistake.",
          "Even though Adam and Eve had disobeyed, God showed His love by making clothes for them and promising a way to restore their relationship with Him. Their story teaches us about the importance of trust, obedience, and God's mercy.",
      '"Where are you?" – Genesis 3:9'
        ],
        application: "Adam and Eve's life teaches us about the importance of trusting and obeying God. It shows us that even when we make mistakes, God's love and mercy are always available to us."
      }
    ]
  },
  noah: {
    name: "Noah the Ark Builder",
    image: "/stories/noah_scene1.png",
    levels: [
      {
        title: "Level 1: Noah the Ark Builder (Ages 3-6)",
        content: [
          "Noah loved God and listened to Him.",
          "God told Noah to build a big boat called an ark.",
          "Noah brought animals two by two into the ark.",
          "It rained and rained, but God kept Noah safe.",
          "After the rain, God put a rainbow in the sky as a promise.",
          '"Noah did everything as God commanded."'
        ],
        application: "Noah's story teaches us to obey God and trust Him, even when others don't understand. God keeps His promises."
      },
      {
        title: "Level 2: Noah the Ark Builder (Ages 6+)",
        content: [
          "Noah was a man who loved God and obeyed Him. God told Noah to build a big boat, called an ark, because He was going to send a flood to clean the earth. Noah worked hard, building the ark exactly as God instructed.",
          "God told Noah to bring two of every kind of animal into the ark. Noah did as he was told, and when the rain started, he and his family were safe inside. It rained for forty days and nights, but God kept Noah and the animals safe.",
          "After the flood, God put a rainbow in the sky as a promise that He would never flood the earth again. Noah's story shows us the importance of obedience and trust in God.",
          '"Noah did everything as God commanded."'
        ],
        application: "Noah's story reminds us to obey God and trust His promises, even when things seem impossible."
      },
      {
        title: "Level 3: The Life of Noah - A Story of Faith and Obedience",
    content: [
          "Noah lived in a time when people had become very wicked. But Noah was different - he walked with God and was righteous in his generation. When God saw how bad the world had become, He decided to start fresh with Noah and his family.",
          "God gave Noah detailed instructions for building the ark: it was to be 450 feet long, 75 feet wide, and 45 feet high. Noah and his sons worked for many years building this massive boat, even though it had never rained before. People probably laughed at them, but Noah trusted God.",
          "When the ark was finished, God sent the animals to Noah. They came in pairs, male and female, and Noah led them into the ark. Then God closed the door, and it rained for forty days and nights. The water covered the entire earth, but Noah and his family were safe in the ark.",
          "After the flood, Noah built an altar and offered sacrifices to God. God made a covenant with Noah, promising never to flood the earth again. He gave the rainbow as a sign of this promise. Noah's story shows us the power of faith and obedience to God.",
      '"Noah did everything as God commanded."'
        ],
        application: "Noah's life teaches us about the importance of faith and obedience to God, even when His commands seem unusual or difficult. It shows us that God keeps His promises and rewards those who trust in Him."
      }
    ]
  },
  abraham: {
    name: "Abraham the Father of Nations",
    image: "/stories/abraham_scene1.png",
    levels: [
      {
        title: "Level 1: Abraham the Father of Nations (Ages 3-6)",
        content: [
          "God called Abraham to go to a new land.",
          "Abraham trusted God and obeyed.",
          "God promised Abraham a big family.",
          "Abraham loved God and believed His promises.",
          "God always keeps His promises!",
          '"I will make you a great nation."'
        ],
        application: "Abraham's story reminds us to trust God and believe His promises, even when we can't see how things will work out."
      },
      {
        title: "Level 2: Abraham the Father of Nations (Ages 6+)",
        content: [
          "Abraham was a man who loved God. One day, God told Abraham to leave his home and go to a new land. Abraham trusted God and obeyed, even though he didn't know where he was going.",
          "God promised Abraham that he would have a big family, even though he and his wife, Sarah, were old and had no children. Abraham believed God's promise, and God kept His word. Sarah had a son named Isaac, and Abraham became the father of many nations.",
          "Abraham's story shows us the importance of faith and trust in God's promises.",
          '"I will make you a great nation."'
        ],
        application: "Abraham's story teaches us to trust God and believe His promises, even when they seem impossible."
      },
      {
        title: "Level 3: The Life of Abraham - A Story of Faith and Promise",
    content: [
          "Abraham, originally named Abram, lived in Ur, a wealthy city in Mesopotamia. When God called him to leave his home and go to a new land, Abraham didn't know where he was going, but he trusted God completely. This was the beginning of a journey that would change history.",
          "God made several promises to Abraham: he would have many descendants, they would inherit the land of Canaan, and through him, all nations would be blessed. These promises seemed impossible because Abraham and his wife Sarah were old and childless.",
          "Abraham faced many challenges: famine, war, and the long wait for a child. But he never stopped trusting God. When Sarah finally had Isaac, God tested Abraham's faith by asking him to sacrifice his son. Abraham was willing to obey, but God provided a ram instead.",
          "Abraham's faith was so strong that God counted it as righteousness. He became known as the father of faith, and his story shows us how to trust God's promises, even when they seem impossible.",
      '"I will make you a great nation."'
        ],
        application: "Abraham's life teaches us about the power of faith and trust in God's promises. It shows us that God can do the impossible and that He always keeps His word."
      }
    ]
  },
  samuel: {
    name: "Samuel the Prophet",
    image: "/stories/samuel_scene1.png",
    levels: [
      {
        title: "Level 1: Samuel the Prophet (Ages 3-6)",
        content: [
          "Samuel was a little boy who listened to God.",
          "God called Samuel's name at night.",
          "Samuel said, 'Speak, Lord, I am listening.'",
          "Samuel grew up to help and lead God's people.",
          "God loves when we listen to Him!",
          '"Speak, for your servant is listening."'
        ],
        application: "Samuel's story teaches us to listen for God's voice and be willing to help others."
      },
      {
        title: "Level 2: Samuel the Prophet (Ages 6+)",
        content: [
          "Samuel was a young boy who lived in the temple with a priest named Eli. One night, God called Samuel's name. Samuel thought it was Eli, but Eli told him to listen for God's voice.",
          "When God called again, Samuel said, 'Speak, Lord, I am listening.' God told Samuel that he would be a prophet, someone who speaks for God. Samuel grew up to help and lead the people of Israel, always listening to God's voice.",
          "Samuel's story shows us the importance of listening to God and being ready to serve Him.",
          '"Speak, for your servant is listening."'
        ],
        application: "Samuel's story reminds us to listen for God's voice and be willing to help others, just as Samuel did."
      },
      {
        title: "Level 3: The Life of Samuel - A Story of Dedication and Leadership",
    content: [
          "Samuel's mother, Hannah, had prayed for a child for many years. When Samuel was born, she dedicated him to God and brought him to live in the temple with Eli, the priest. Even as a young boy, Samuel served God faithfully.",
          "One night, God called Samuel's name. At first, Samuel thought it was Eli calling him. After this happened three times, Eli realized it was God and told Samuel to respond, 'Speak, Lord, your servant is listening.'",
          "God gave Samuel a message about Eli's family, and from that time on, Samuel became known as a prophet. He grew up to be a great leader in Israel, serving as a judge and helping the people follow God.",
          "When the people asked for a king, Samuel warned them about the consequences but anointed Saul as their first king. Later, when Saul disobeyed God, Samuel anointed David as the next king. Throughout his life, Samuel remained faithful to God and helped guide the nation of Israel.",
      '"Speak, for your servant is listening."'
        ],
        application: "Samuel's life teaches us about dedication to God, listening to His voice, and being willing to serve others. It shows us how God can use anyone, even a young child, to do great things."
      }
    ]
  },
  naomi: {
    name: "Naomi the Caregiver",
    image: "/stories/naomi_scene1.png",
    levels: [
      {
        title: "Level 1: Naomi the Caregiver (Ages 3-6)",
        content: [
          "Naomi was kind and cared for her family.",
          "Her daughter-in-law Ruth stayed with her.",
          "Naomi and Ruth traveled to Bethlehem together.",
          "God took care of Naomi and Ruth and gave them a new family.",
          "God is always with us and gives us good friends!",
          '"Where you go, I will go."'
        ],
        application: "Naomi's story reminds us to care for our family and friends, and to trust that God will provide for us."
      },
      {
        title: "Level 2: Naomi the Caregiver (Ages 6+)",
        content: [
          "Naomi was a woman who lived in a place called Moab with her family. When her husband and sons died, Naomi decided to return to her hometown, Bethlehem. Her daughter-in-law, Ruth, chose to stay with Naomi, saying, 'Where you go, I will go.'",
          "In Bethlehem, Naomi and Ruth worked hard to take care of each other. God provided for them, and Ruth married a kind man named Boaz. They had a son, and Naomi became a grandmother. God blessed Naomi and Ruth with a new family.",
          "Naomi's story shows us the importance of love, loyalty, and trusting God to provide.",
          '"Where you go, I will go."'
        ],
        application: "Naomi's story teaches us to care for our family and friends, and to trust that God will provide for us, even in difficult times."
      },
      {
        title: "Level 3: The Life of Naomi - A Story of Loss and Restoration",
    content: [
          "Naomi and her family left Bethlehem during a famine and moved to Moab. There, her sons married Moabite women, including Ruth. But tragedy struck when Naomi's husband and both sons died, leaving her alone with her daughters-in-law.",
          "When Naomi decided to return to Bethlehem, Ruth insisted on going with her, saying, 'Where you go, I will go. Your people will be my people, and your God will be my God.' This showed Ruth's deep loyalty and love for Naomi.",
          "In Bethlehem, Naomi helped Ruth find work in the fields of Boaz, a relative of Naomi's late husband. Boaz was kind to Ruth and eventually married her. They had a son named Obed, who became the grandfather of King David.",
          "Naomi's story shows how God can turn sorrow into joy. From being a grieving widow, she became a joyful grandmother. Her life demonstrates God's faithfulness and how He can bring new beginnings after difficult times.",
      '"Where you go, I will go."'
        ],
        application: "Naomi's life teaches us about God's faithfulness in times of loss and how He can bring restoration and joy after difficult times. It shows us the importance of family bonds and trusting God's plan."
      }
    ]
  },
  daniel: {
    name: "Daniel in the Lion's Den",
    image: "/stories/daniel_scene1.png",
    levels: [
      {
        title: "Level 1: Daniel in the Lion's Den (Ages 3-6)",
        content: [
          "Daniel loved God and prayed every day.",
          "Some people tried to get Daniel in trouble, but he kept praying.",
          "Daniel was put in a den with hungry lions.",
          "God sent an angel to keep Daniel safe.",
          "Daniel trusted God, and God protected him!",
          '"My God sent his angel..."'
        ],
        application: "Daniel's story encourages us to keep praying and trusting God, even when it's difficult. God is always able to help us."
      },
      {
        title: "Level 2: Daniel in the Lion's Den (Ages 6+)",
        content: [
          "Daniel was a young man who loved God and prayed to Him every day. Some people were jealous of Daniel and made a rule that no one could pray to anyone except the king. Daniel knew this was wrong, so he continued to pray to God.",
          "When the king found out, he had to put Daniel in a den of hungry lions. But Daniel trusted God, and God sent an angel to keep the lions from hurting him. The next morning, the king found Daniel safe and sound.",
          "Daniel's story shows us the importance of staying faithful to God, even when it's hard.",
          '"My God sent his angel..."'
        ],
        application: "Daniel's story teaches us to stay faithful to God and trust Him, even when we face difficult situations."
      },
      {
        title: "Level 3: The Life of Daniel - A Story of Faith and Integrity",
    content: [
          "Daniel was a young man from Judah who was taken to Babylon when the Babylonians conquered Jerusalem. Even in a foreign land, Daniel remained faithful to God. He and his friends refused to eat the king's food, choosing instead to eat vegetables and water.",
          "God gave Daniel the ability to interpret dreams, which helped him become an important advisor to the king. When the king had a troubling dream, Daniel was able to explain it, showing that God was in control of all things.",
          "Later, when a new law was made that no one could pray to anyone except the king, Daniel continued to pray to God three times a day. He was thrown into the lion's den as punishment, but God sent an angel to protect him.",
          "Daniel's faithfulness and wisdom made him one of the most respected men in the kingdom. He served several kings and remained true to God throughout his life. His story shows us how to live with integrity and trust in God, even in difficult circumstances.",
      '"My God sent his angel..."'
        ],
        application: "Daniel's life teaches us about the importance of staying faithful to God, even when it's difficult. It shows us how God can use our faithfulness to influence others and bring glory to His name."
      }
    ]
  },
  "cain-abel": {
    name: "Cain & Abel",
    image: "/stories/cainabel_scene1.png",
    levels: [
      {
        title: "Level 1: Cain & Abel (Ages 3-6)",
        content: [
          "Cain and Abel were brothers.",
          "They both gave gifts to God.",
          "Cain was sad and made a bad choice, but God still loved him.",
          "God wants us to love and care for each other.",
          '"Am I my brother\'s keeper?"'
        ],
        application: "Cain and Abel's story teaches us to love others and make good choices, even when we feel upset."
      },
      {
        title: "Level 2: Cain & Abel (Ages 6+)",
        content: [
          "Cain and Abel were the first sons of Adam and Eve. They both gave gifts to God, but God was pleased with Abel's gift and not with Cain's. Cain became angry and jealous.",
          "In his anger, Cain made a bad choice and hurt his brother Abel. God asked Cain where Abel was, and Cain replied, 'Am I my brother's keeper?' God showed Cain that his actions had consequences, but He still loved Cain and protected him.",
          "Cain and Abel's story teaches us about the importance of making good choices and loving our family.",
          '"Am I my brother\'s keeper?"'
        ],
        application: "Cain and Abel's story reminds us to love others and make good choices, even when we feel upset or jealous."
      },
      {
        title: "Level 3: The Life of Cain & Abel - A Story of Choices and Consequences",
    content: [
          "Cain and Abel were the first children born to Adam and Eve after they left the Garden of Eden. Cain worked the soil as a farmer, while Abel took care of sheep as a shepherd. Both brothers brought offerings to God, but God accepted Abel's offering and not Cain's.",
          "Cain became very angry and jealous. God warned Cain that sin was trying to control him, but Cain didn't listen. In his anger, Cain lured Abel into a field and killed him. This was the first murder in human history.",
          "When God asked Cain where Abel was, Cain replied, 'Am I my brother's keeper?' God showed Cain that he couldn't hide his sin. As punishment, Cain was sent away to wander the earth, but God protected him from being killed by others.",
          "Cain and Abel's story teaches us about the importance of controlling our emotions and making good choices. It shows us how jealousy and anger can lead to terrible consequences, but also how God's mercy is always available.",
          '"Am I my brother\'s keeper?"'
        ],
        application: "Cain and Abel's life teaches us about the power of our choices and their consequences. It shows us the importance of controlling our emotions and treating others with love and respect."
      }
    ]
  }
};

function BibleStoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { characters, isPremiumUser } = useContext(CharacterContext);
  const character = characters.find((char) => char.id === id);
  const story = stories[id];

  const [level, setLevel] = useState(() => {
    try {
      const saved = localStorage.getItem(`storyLevel_${id}`);
      return saved ? parseInt(saved, 10) : 0;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return 0;
    }
  });

  // AI features state
  const [summary, setSummary] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState("");

  const [reflection, setReflection] = useState("");
  const [reflectionLoading, setReflectionLoading] = useState(false);
  const [reflectionError, setReflectionError] = useState("");

  const [prayer, setPrayer] = useState("");
  const [prayerLoading, setPrayerLoading] = useState(false);
  const [prayerError, setPrayerError] = useState("");

  // AI Story Generator state
  const [showStoryGen, setShowStoryGen] = useState(false);
  const [storyGenInput, setStoryGenInput] = useState("");
  const [storyGenLoading, setStoryGenLoading] = useState(false);
  const [storyGenError, setStoryGenError] = useState("");
  const [storyGenResult, setStoryGenResult] = useState("");

  // Verse explainer state
  const [explainingVerseIdx, setExplainingVerseIdx] = useState(null);
  const [verseExplanation, setVerseExplanation] = useState("");
  const [verseExplaining, setVerseExplaining] = useState(false);
  const [verseExplainError, setVerseExplainError] = useState("");

  const synthRef = useRef(window.speechSynthesis);
  const [reading, setReading] = useState(false);

  // Helper: detect if a line is a Bible verse (simple heuristic: contains quotes and a dash)
  const isVerseLine = (line) => /".+"\s*–\s*.+/.test(line);

  const handleSummarize = async () => {
    setSummaryLoading(true);
    setSummaryError("");
    setSummary("");
    try {
      const res = await fetch(API_ENDPOINTS.askAI, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Summarize the story of ${character?.name || id} for a young child.`,
          character: character?.name || id
        }),
      });
      const data = await res.json();
      if (data.answer) setSummary(data.answer);
      else setSummaryError("Sorry, I couldn't get a summary.");
    } catch (err) {
      setSummaryError("Something went wrong. Please try again.");
    }
    setSummaryLoading(false);
  };

  const handleReflection = async () => {
    setReflectionLoading(true);
    setReflectionError("");
    setReflection("");
    try {
      const res = await fetch(API_ENDPOINTS.askAI, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Ask a simple, child-friendly 'What would you do?' reflection question based on the story of ${character?.name || id}.`,
          character: character?.name || id
        }),
      });
      const data = await res.json();
      if (data.answer) setReflection(data.answer);
      else setReflectionError("Sorry, I couldn't get a reflection question.");
    } catch (err) {
      setReflectionError("Something went wrong. Please try again.");
    }
    setReflectionLoading(false);
  };

  const handlePrayer = async () => {
    setPrayerLoading(true);
    setPrayerError("");
    setPrayer("");
    try {
      const res = await fetch(API_ENDPOINTS.askAI, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Write a simple, child-friendly prayer related to the story of ${character?.name || id}.`,
          character: character?.name || id
        }),
      });
      const data = await res.json();
      if (data.answer) setPrayer(data.answer);
      else setPrayerError("Sorry, I couldn't get a prayer suggestion.");
    } catch (err) {
      setPrayerError("Something went wrong. Please try again.");
    }
    setPrayerLoading(false);
  };

  const handleNavigateToQuiz = () => {
    navigate(`/quiz/${id}`);
  };

  const handleOpenStoryGen = () => {
    setShowStoryGen(true);
    setStoryGenInput("");
    setStoryGenResult("");
    setStoryGenError("");
  };

  const handleCloseStoryGen = () => setShowStoryGen(false);

  const handleStoryGenSubmit = async (e) => {
    e.preventDefault();
    if (!storyGenInput.trim()) return;
    setStoryGenLoading(true);
    setStoryGenError("");
    setStoryGenResult("");
    try {
      const res = await fetch(API_ENDPOINTS.askAI, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Write a child-friendly Bible-style story about: ${storyGenInput}`,
          character: character?.name || id
        }),
      });
      const data = await res.json();
      if (data.answer) setStoryGenResult(data.answer);
      else setStoryGenError("Sorry, I couldn't generate a story.");
    } catch (err) {
      setStoryGenError("Something went wrong. Please try again.");
    }
    setStoryGenLoading(false);
  };

  const handleExplainVerse = async (line, idx) => {
    setExplainingVerseIdx(idx);
    setVerseExplaining(true);
    setVerseExplainError("");
    setVerseExplanation("");
    try {
      const res = await fetch(API_ENDPOINTS.askAI, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Explain this Bible verse for a young child: ${line}`,
          character: character?.name || id
        }),
      });
      const data = await res.json();
      if (data.answer) setVerseExplanation(data.answer);
      else setVerseExplainError("Sorry, I couldn't get an explanation.");
    } catch (err) {
      setVerseExplainError("Something went wrong. Please try again.");
    }
    setVerseExplaining(false);
  };

  const handleReadAloud = () => {
    if (reading) {
      synthRef.current.cancel();
      setReading(false);
      return;
    }
    let text = "";
    if (hasLevels && current) {
      text = `${current.title}. ${current.content.join(' ')}`;
    } else if (story.content) {
      text = story.content.join(' ');
    }
    if (text) {
      const utter = new window.SpeechSynthesisUtterance(text);
      utter.onend = () => setReading(false);
      utter.onerror = () => setReading(false);
      setReading(true);
      synthRef.current.speak(utter);
    }
  };

  if (!character || !story) return <p>Story not found.</p>;
  if (character.premium && !isPremiumUser) return <p>This story is locked 🔒. Please upgrade to access.</p>;

  const hasLevels = story.levels && story.levels.length > 0;
  const current = hasLevels ? story.levels[level] : null;
  const maxLevel = hasLevels ? story.levels.length - 1 : 0;

  return (
    <div style={{ padding: "2rem", position: "relative" }}>
      {/* Use AiBuddy component for cross-platform AI assistant */}
      <AiBuddy character={character?.name || id} context={current?.title || story?.name || id} />
      <h2>{story.name}</h2>
      <ShareButton message={`I'm reading the story of ${story.name} on Bible Quest!`} style={{ marginBottom: 16 }} />
      {story.image && (
        <img
          src={story.image}
          alt={story.name}
          style={{ maxWidth: "100%", height: "auto", marginBottom: "20px" }}
        />
      )}
      {/* Read Aloud button */}
      <div style={{ marginBottom: 12 }}>
        <button onClick={handleReadAloud} style={{ background: '#4caf50', color: 'white', border: 'none', borderRadius: 6, padding: '8px 16px', fontSize: 15, cursor: 'pointer' }}>
          {reading ? 'Stop' : '🔊 Read Aloud'}
        </button>
      </div>
      {hasLevels && current ? (
        <>
          <h3>{current.title}</h3>
          {current.content.map((line, index) => (
            <div key={index} style={{ marginBottom: 8 }}>
              <p style={{ display: 'inline', marginRight: 8 }}>{line}</p>
              {isVerseLine(line) && (
                <button
                  onClick={() => handleExplainVerse(line, index)}
                  style={{ marginLeft: 8, fontSize: 13, background: '#03a9f4', color: 'white', border: 'none', borderRadius: 4, padding: '3px 10px', cursor: verseExplaining && explainingVerseIdx === index ? 'not-allowed' : 'pointer', opacity: verseExplaining && explainingVerseIdx === index ? 0.7 : 1 }}
                  disabled={verseExplaining && explainingVerseIdx === index}
                >
                  {verseExplaining && explainingVerseIdx === index ? 'Explaining...' : 'Explain this verse'}
                </button>
              )}
              {/* Show explanation below the verse if this is the one being explained */}
              {explainingVerseIdx === index && (
                <div style={{ marginTop: 6 }}>
                  {verseExplanation && (
                    <div style={{ background: '#e3f7ff', padding: 8, borderRadius: 6, color: '#222' }}>
                      <strong>Explanation:</strong> {verseExplanation}
                    </div>
                  )}
                  {verseExplainError && (
                    <div style={{ color: 'red', fontSize: 14 }}>{verseExplainError}</div>
                  )}
                </div>
              )}
            </div>
          ))}
          <div style={{ margin: "16px 0" }}>
            {level < maxLevel && (
              <button
                onClick={() => {
                  const next = level + 1;
                  setLevel(next);
                  localStorage.setItem(`storyLevel_${id}`, next);
                  if (next === maxLevel) {
                    localStorage.setItem(`storyCompleted_${id}`, 'true');
                  }
                }}
              >
                Next Level
              </button>
            )}
          </div>
        </>
      ) : (
        story.content?.map((line, index) => (
          <div key={index} style={{ marginBottom: 8 }}>
            <p style={{ display: 'inline', marginRight: 8 }}>{line}</p>
            {isVerseLine(line) && (
              <button
                onClick={() => handleExplainVerse(line, index)}
                style={{ marginLeft: 8, fontSize: 13, background: '#03a9f4', color: 'white', border: 'none', borderRadius: 4, padding: '3px 10px', cursor: verseExplaining && explainingVerseIdx === index ? 'not-allowed' : 'pointer', opacity: verseExplaining && explainingVerseIdx === index ? 0.7 : 1 }}
                disabled={verseExplaining && explainingVerseIdx === index}
              >
                {verseExplaining && explainingVerseIdx === index ? 'Explaining...' : 'Explain this verse'}
              </button>
            )}
            {explainingVerseIdx === index && (
              <div style={{ marginTop: 6 }}>
                {verseExplanation && (
                  <div style={{ background: '#e3f7ff', padding: 8, borderRadius: 6, color: '#222' }}>
                    <strong>Explanation:</strong> {verseExplanation}
                  </div>
                )}
                {verseExplainError && (
                  <div style={{ color: 'red', fontSize: 14 }}>{verseExplainError}</div>
                )}
              </div>
            )}
          </div>
        ))
      )}
      {story.application && (
        <div>
          <h4>Application:</h4>
          <p>{story.application}</p>
        </div>
      )}
      <div style={{ margin: "16px 0", display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button onClick={handleNavigateToQuiz}>Take Quiz</button>
        <button onClick={handleReflection} disabled={reflectionLoading} style={{ backgroundColor: '#ff9800', color: 'white', border: 'none', borderRadius: 4, padding: '8px 16px' }}>
          {reflectionLoading ? 'Thinking...' : 'What Would You Do?'}
        </button>
        <button onClick={handleSummarize} disabled={summaryLoading} style={{ backgroundColor: '#03a9f4', color: 'white', border: 'none', borderRadius: 4, padding: '8px 16px' }}>
          {summaryLoading ? 'Summarizing...' : 'Summarize this story'}
        </button>
        <button onClick={handlePrayer} disabled={prayerLoading} style={{ backgroundColor: '#8bc34a', color: 'white', border: 'none', borderRadius: 4, padding: '8px 16px' }}>
          {prayerLoading ? 'Getting prayer...' : 'Prayer Suggestion'}
        </button>
      </div>
      {reflection && (
        <div style={{ marginTop: 10, background: '#fffbe7', padding: 10, borderRadius: 6, color: '#222' }}>
          <strong>Reflection:</strong> {reflection}
        </div>
      )}
      {reflectionError && (
        <div style={{ marginTop: 8, color: 'red', fontSize: 14 }}>{reflectionError}</div>
      )}
      {summary && (
        <div style={{ marginTop: 10, background: "#e3f7ff", padding: 10, borderRadius: 6 }}>
          <strong>Summary:</strong> {summary}
        </div>
      )}
      {summaryError && (
        <div style={{ marginTop: 8, color: "red", fontSize: 14 }}>{summaryError}</div>
      )}
      {prayer && (
        <div style={{ marginTop: 10, background: '#f1ffe7', padding: 10, borderRadius: 6, color: '#222' }}>
          <strong>Prayer:</strong> {prayer}
        </div>
      )}
      {prayerError && (
        <div style={{ marginTop: 8, color: 'red', fontSize: 14 }}>{prayerError}</div>
      )}
      {/* AI Story Generator Button (Premium only) */}
      {character.premium && (
        <div style={{ marginBottom: 16 }}>
          <button onClick={handleOpenStoryGen} style={{ background: '#673ab7', color: 'white', border: 'none', borderRadius: 6, padding: '10px 18px', fontSize: 16, cursor: 'pointer' }}>
            Generate a New Story
          </button>
        </div>
      )}
      {/* AI Story Generator Modal */}
      {showStoryGen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.3)',
          zIndex: 3000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 12,
            padding: 24,
            width: '90%',
            maxWidth: 420,
            boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
            position: 'relative',
          }}>
            <button
              onClick={handleCloseStoryGen}
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                background: 'none',
                border: 'none',
                fontSize: 22,
                cursor: 'pointer',
                color: '#888',
              }}
              aria-label="Close"
            >
              ×
            </button>
            <h2 style={{ marginBottom: 10, color: '#673ab7' }}>AI Story Generator</h2>
            <p style={{ fontSize: 15, marginBottom: 16 }}>Enter any topic and Bible Buddy will create a story for you!</p>
            <form onSubmit={handleStoryGenSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input
                type="text"
                value={storyGenInput}
                onChange={e => setStoryGenInput(e.target.value)}
                placeholder="Type a topic (e.g. kindness, forgiveness, a lion, etc.)"
                style={{ padding: 10, borderRadius: 6, border: '1px solid #ccc', fontSize: 16 }}
                disabled={storyGenLoading}
                autoFocus
              />
              <button
                type="submit"
                style={{
                  background: '#673ab7',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  padding: '10px 0',
                  fontSize: 16,
                  cursor: storyGenLoading ? 'not-allowed' : 'pointer',
                  opacity: storyGenLoading ? 0.7 : 1,
                }}
                disabled={storyGenLoading}
              >
                {storyGenLoading ? 'Generating...' : 'Generate Story'}
              </button>
            </form>
            {storyGenResult && (
              <div style={{ marginTop: 18, background: '#f1f8ff', padding: 12, borderRadius: 6, color: '#222', maxHeight: 250, overflowY: 'auto' }}>
                <strong>Story:</strong>
                <div style={{ marginTop: 8, whiteSpace: 'pre-line' }}>{storyGenResult}</div>
              </div>
            )}
            {storyGenError && (
              <div style={{ marginTop: 12, color: 'red', fontSize: 15 }}>{storyGenError}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default BibleStoryPage;



