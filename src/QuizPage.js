import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { App as CapacitorApp } from "@capacitor/app";
import { API_ENDPOINTS } from "./config.js";
import ShareButton from './components/ShareButton.js';

const quizzes = {
  david: [
    { question: "What did David use to defeat Goliath?", options: ["Sword", "Stone and Sling", "Arrow"], answer: "Stone and Sling" },
    { question: "What was David's job before becoming king?", options: ["Shepherd", "Farmer", "Fisherman"], answer: "Shepherd" },
    { question: "What instrument did David play?", options: ["Flute", "Harp", "Drum"], answer: "Harp" },
    { question: "Who was David's best friend?", options: ["Jonathan", "Saul", "Samuel"], answer: "Jonathan" },
    { question: "What animal did David protect his sheep from?", options: ["Lion", "Dog", "Cat"], answer: "Lion" },
    { question: "What did David use to play music for King Saul?", options: ["Harp", "Drum", "Trumpet"], answer: "Harp" }
  ],
  esther: [
    { question: "Esther became a…?", options: ["Queen", "Priest", "Judge"], answer: "Queen" },
    { question: "Who did Esther protect?", options: ["Romans", "Israelites", "Philistines"], answer: "Israelites" },
    { question: "Esther is known for her…", options: ["Wealth", "Courage", "Dancing"], answer: "Courage" },
    { question: "What did Esther wear to see the king?", options: ["Crown", "Hat", "Shoes"], answer: "Crown" },
    { question: "Who was Esther's cousin?", options: ["Mordecai", "David", "Noah"], answer: "Mordecai" },
    { question: "Did Esther love God?", options: ["Yes", "No", "Maybe"], answer: "Yes" }
  ],
  samson: [
    { question: "Samson had great…", options: ["Wisdom", "Wealth", "Strength"], answer: "Strength" },
    { question: "Samson's secret was in his…", options: ["Clothes", "Hair", "Shoes"], answer: "Hair" },
    { question: "Samson fought the…", options: ["Philistines", "Romans", "Egyptians"], answer: "Philistines" },
    { question: "What did Samson use to kill a lion?", options: ["Bare hands", "Sword", "Sling"], answer: "Bare hands" },
    { question: "Who betrayed Samson?", options: ["Delilah", "Ruth", "Esther"], answer: "Delilah" }
  ],
  joseph: [
    { question: "What did Joseph's brothers do to him?", options: ["Made him king", "Sold him", "Crowned him"], answer: "Sold him" },
    { question: "What special gift did Joseph have?", options: ["Dream interpretation", "Healing", "Magic"], answer: "Dream interpretation" },
    { question: "Joseph wore a coat of…", options: ["Armor", "Fur", "Many colors"], answer: "Many colors" },
    { question: "Who was Joseph's father?", options: ["Jacob", "Isaac", "Abraham"], answer: "Jacob" }
  ],
  "mary-joseph": [
    { question: "Mary was the mother of…", options: ["David", "Joseph", "Jesus"], answer: "Jesus" },
    { question: "Joseph worked as a…", options: ["Fisherman", "Carpenter", "Scribe"], answer: "Carpenter" },
    { question: "They traveled to…", options: ["Jericho", "Nazareth", "Bethlehem"], answer: "Bethlehem" },
    { question: "Who visited baby Jesus?", options: ["Shepherds", "Kings", "Both"], answer: "Both" }
  ],
  paul: [
    { question: "Paul's name before conversion was…", options: ["Peter", "Saul", "Stephen"], answer: "Saul" },
    { question: "Paul wrote many…", options: ["Songs", "Books", "Letters"], answer: "Letters" },
    { question: "Paul traveled to…", options: ["Preach", "Fish", "Build"], answer: "Preach" },
    { question: "Who did Paul meet on the road to Damascus?", options: ["Jesus", "Moses", "Elijah"], answer: "Jesus" }
  ],
  jesus: [
    { question: "Jesus was born in…", options: ["Nazareth", "Jerusalem", "Bethlehem"], answer: "Bethlehem" },
    { question: "He fed 5000 people with…", options: ["Fish and bread", "Milk and honey", "Fruits"], answer: "Fish and bread" },
    { question: "Jesus died on a…", options: ["Mountain", "Tree", "Cross"], answer: "Cross" },
    { question: "What did Jesus walk on?", options: ["Water", "Sand", "Grass"], answer: "Water" },
    { question: "Who was Jesus' mother?", options: ["Mary", "Esther", "Sarah"], answer: "Mary" }
  ],
  "adam-eve": [
    { question: "Adam and Eve lived in…", options: ["Bethlehem", "Eden", "Nazareth"], answer: "Eden" },
    { question: "What did they eat?", options: ["Banana", "Forbidden fruit", "Manna"], answer: "Forbidden fruit" },
    { question: "What was the consequence?", options: ["They slept", "They left Eden", "They sang"], answer: "They left Eden" },
    { question: "Who was the first man?", options: ["Adam", "Eve", "Noah"], answer: "Adam" }
  ],
  noah: [
    { question: "God told Noah to build an…", options: ["Altar", "Ark", "Alley"], answer: "Ark" },
    { question: "How many animals of each kind?", options: ["1", "2", "7"], answer: "2" },
    { question: "What sign did God give after the flood?", options: ["Star", "Rainbow", "Crown"], answer: "Rainbow" },
    { question: "Who closed the door of the ark?", options: ["Noah", "God", "Shem"], answer: "God" }
  ],
  abraham: [
    { question: "God promised Abraham…", options: ["Money", "Children", "Rain"], answer: "Children" },
    { question: "Abraham's wife was…", options: ["Leah", "Sarah", "Hannah"], answer: "Sarah" },
    { question: "Abraham trusted God with his…", options: ["Son", "Land", "Food"], answer: "Son" },
    { question: "Who was Abraham's son?", options: ["Isaac", "Jacob", "Joseph"], answer: "Isaac" }
  ],
  samuel: [
    { question: "Who called Samuel in the night?", options: ["David", "Eli", "God"], answer: "God" },
    { question: "What did Samuel become?", options: ["Shepherd", "King", "Prophet"], answer: "Prophet" },
    { question: "Samuel anointed…", options: ["Saul", "Moses", "Aaron"], answer: "Saul" },
    { question: "Who was Samuel's mother?", options: ["Hannah", "Sarah", "Leah"], answer: "Hannah" }
  ],
  naomi: [
    { question: "Naomi's daughter-in-law was…", options: ["Esther", "Leah", "Ruth"], answer: "Ruth" },
    { question: "Naomi returned to…", options: ["Jericho", "Bethlehem", "Nineveh"], answer: "Bethlehem" },
    { question: "Naomi told Ruth to…", options: ["Stay", "Go home", "Marry Boaz"], answer: "Go home" },
    { question: "Who married Boaz?", options: ["Naomi", "Ruth", "Esther"], answer: "Ruth" }
  ],
  daniel: [
    { question: "Daniel prayed…", options: ["Once a week", "Three times a day", "Only at night"], answer: "Three times a day" },
    { question: "Where was Daniel thrown?", options: ["Pit", "Fire", "Lions' den"], answer: "Lions' den" },
    { question: "What happened to Daniel?", options: ["He was eaten", "He escaped", "He was protected"], answer: "He was protected" },
    { question: "Who shut the lions' mouths?", options: ["Daniel", "Angel", "King"], answer: "Angel" }
  ],
  "cain-abel": [
    { question: "Cain and Abel were…", options: ["Friends", "Brothers", "Cousins"], answer: "Brothers" },
    { question: "Who gave a better offering?", options: ["Cain", "Abel", "Both"], answer: "Abel" },
    { question: "What did Cain do to Abel?", options: ["Helped", "Ignored", "Hurt"], answer: "Hurt" },
    { question: "What did God want from them?", options: ["Love", "Money", "Food"], answer: "Love" }
  ]
};

function QuizPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const questions = quizzes[id] || [];
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [completed, setCompleted] = useState(false);
  const [hint, setHint] = useState("");
  const [hintLoading, setHintLoading] = useState(false);
  const [hintError, setHintError] = useState("");
  const [explanation, setExplanation] = useState("");
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem(`quizHighScore_${id}`);
    return saved ? parseInt(saved, 10) : 0;
  });
  const synthRef = useRef(window.speechSynthesis);
  const [reading, setReading] = useState(false);

  useEffect(() => {
    let listenerObj = null;
    let isMounted = true;

    if (CapacitorApp.addListener) {
      CapacitorApp.addListener("backButton", () => {
        navigate("/dashboard");
      }).then((listener) => {
        if (isMounted) {
          listenerObj = listener;
        }
      });
    }

    return () => {
      isMounted = false;
      if (listenerObj && typeof listenerObj.remove === "function") {
        listenerObj.remove();
      }
    };
  }, [navigate]);

  if (!questions.length) return <p>No quiz found for this character.</p>;

  const playSound = () => {
    const audio = new Audio('/sounds/general.mp3');
    audio.play().catch(e => console.warn("Sound error:", e));
  };

  const handleAnswer = (choice) => {
    const isCorrect = choice === questions[current].answer;
    setFeedback(isCorrect ? "✅ Correct!" : "❌ Wrong");
    playSound();
    if (isCorrect) setScore(score + 1);
    // Show explanation if available and answer is incorrect
    if (!isCorrect && questions[current].explanation) {
      setExplanation(questions[current].explanation);
    } else if (!isCorrect) {
      setExplanation("Remember to read the story carefully and try again!");
    } else {
      setExplanation("");
    }
    setTimeout(() => {
      setFeedback("");
      setExplanation("");
      if (current + 1 < questions.length) {
        setCurrent(current + 1);
      } else {
        setCompleted(true);
        localStorage.setItem(`quizCompleted_${id}`, 'true');
        // Update high score if needed
        const finalScore = isCorrect ? score + 1 : score;
        if (finalScore > highScore) {
          setHighScore(finalScore);
          localStorage.setItem(`quizHighScore_${id}`, finalScore.toString());
        }
      }
    }, 1000);
  };

  const handleAskBuddy = async () => {
    setHintLoading(true);
    setHintError("");
    setHint("");
    try {
      const res = await fetch(API_ENDPOINTS.askAI, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `You are Bible Buddy. Give a helpful, child-friendly hint or explanation for this Bible quiz question: '${questions[current].question}' about ${id}.`,
          character: id
        }),
      });
      const data = await res.json();
      if (data.answer) setHint(data.answer);
      else setHintError("Sorry, I couldn't get help from Buddy.");
    } catch (err) {
      setHintError("Something went wrong. Please try again.");
    }
    setHintLoading(false);
  };

  const handleReadAloud = () => {
    if (reading) {
      synthRef.current.cancel();
      setReading(false);
      return;
    }
    const q = questions[current];
    let text = `${q.question}. Options: ${q.options.join(', ')}`;
    if (text) {
      const utter = new window.SpeechSynthesisUtterance(text);
      utter.onend = () => setReading(false);
      utter.onerror = () => setReading(false);
      setReading(true);
      synthRef.current.speak(utter);
    }
  };

  if (completed) {
    return (
      <div style={{ padding: "2rem" }}>
        <h2>🎉 Quiz Completed!</h2>
        <p>You scored: {score} / {questions.length}</p>
        <p>🏅 High Score: {highScore} / {questions.length}</p>
        <button onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
      </div>
    );
  }

  const q = questions[current];

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Quiz: {id.charAt(0).toUpperCase() + id.slice(1).replace("-", " ")}</h2>
      <ShareButton message={`I'm taking the ${id.replace("-", " & ")} quiz on Bible Quest!`} style={{ marginBottom: 16 }} />
      <div style={{ marginBottom: 12 }}>
        <button onClick={handleReadAloud} style={{ background: '#4caf50', color: 'white', border: 'none', borderRadius: 6, padding: '8px 16px', fontSize: 15, cursor: 'pointer' }}>
          {reading ? 'Stop' : '🔊 Read Aloud'}
        </button>
      </div>
      <p><strong>{q.question}</strong></p>
      <p style={{ fontSize: 15, color: '#1565c0', marginBottom: 8 }}>🏅 High Score: {highScore} / {questions.length}</p>
      {q.options.map((opt) => (
        <button
          key={opt}
          onClick={() => handleAnswer(opt)}
          style={{ display: "block", margin: "10px 0", padding: "10px 15px" }}
          disabled={!!feedback}
        >
          {opt}
        </button>
      ))}
      {/* Ask Buddy button for quiz question */}
      <button
        onClick={handleAskBuddy}
        style={{
          marginTop: 10,
          marginLeft: 8,
          padding: '6px 14px',
          fontSize: '14px',
          backgroundColor: '#03a9f4',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: hintLoading ? 'not-allowed' : 'pointer',
          opacity: hintLoading ? 0.7 : 1,
        }}
        disabled={hintLoading}
      >
        {hintLoading ? 'Buddy is thinking...' : 'Ask Buddy'}
      </button>
      {hint && (
        <div style={{ marginTop: 10, background: '#e3f7ff', padding: 10, borderRadius: 6, color: '#222' }}>
          <strong>Buddy says:</strong> {hint}
        </div>
      )}
      {hintError && (
        <div style={{ marginTop: 8, color: 'red', fontSize: 14 }}>{hintError}</div>
      )}
      {feedback && <p style={{ fontWeight: "bold" }}>{feedback}</p>}
      {explanation && (
        <div style={{ marginTop: 8, background: '#fffbe7', padding: 8, borderRadius: 6, color: '#222' }}>
          <strong>Explanation:</strong> {explanation}
        </div>
      )}
    </div>
  );
}


export default QuizPage;
