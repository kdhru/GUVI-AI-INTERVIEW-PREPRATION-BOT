// ==== Question Bank (same as before) ====
const QUESTION_BANK = {
  "Software Developer": {
    Technical: {
      General: [
        "Explain the difference between arrays and linked lists.",
        "What is the difference between TCP and UDP?",
        "How does garbage collection work in Java?",
        "What are REST APIs and how do they work?",
        "Explain Big O notation with examples.",
        "What is multithreading and how is it implemented?",
        "Difference between stack and heap memory?",
        "What are design patterns? Give examples.",
        "What is the difference between compile-time and runtime errors?",
        "Explain SOLID principles in software development."
      ],
      Frontend: [
        "Explain the difference between client-side and server-side rendering.",
        "What is the virtual DOM and how does React use it?",
        "How does the browser render a webpage?",
        "Explain event delegation in JavaScript.",
        "What are CSS Flexbox and Grid, and when would you use them?",
        "What is CORS and how do you handle it?",
        "Explain how cookies, localStorage, and sessionStorage differ.",
        "How does responsive design work? Give techniques.",
        "What is accessibility (a11y) in web development?",
        "Explain how Single Page Applications (SPAs) work."
      ],
      Backend: [
        "How would you design a scalable authentication system?",
        "What’s the difference between SQL and NoSQL databases?",
        "How do you handle concurrency in backend systems?",
        "Explain microservices vs monolith architecture.",
        "What are message queues and why are they used?",
        "Explain how caching works (Redis, Memcached).",
        "How do you handle database migrations safely?",
        "What is an API gateway and why is it important?",
        "Explain horizontal vs vertical scaling.",
        "What is database indexing and how does it improve performance?"
      ],
      "System Design": [
        "Design a URL shortener like bit.ly.",
        "How would you design a messaging system like WhatsApp?",
        "What are load balancers and why are they important?",
        "Explain CAP theorem in distributed systems.",
        "Design an e-commerce checkout system.",
        "How would you design a recommendation system (like Netflix)?",
        "Explain CDN (Content Delivery Network) and its role.",
        "Design an online collaborative editor (like Google Docs).",
        "How would you design a scalable logging system?",
        "Explain sharding and replication in databases."
      ],
      "Machine Learning": [
        "What is supervised vs unsupervised learning?",
        "Explain bias-variance tradeoff.",
        "How do you evaluate a machine learning model?",
        "What is feature engineering and why is it important?",
        "Explain overfitting and underfitting.",
        "What is gradient descent and how does it work?",
        "What are confusion matrices and ROC curves?",
        "Explain reinforcement learning with an example.",
        "What is transfer learning and why is it useful?",
        "How do you handle imbalanced datasets?"
      ]
    },
    Behavioral: [
      "Tell me about a time you handled conflict in a team.",
      "How do you prioritize tasks under pressure?",
      "Describe a project where you faced major technical challenges.",
      "Tell me about a mistake you made and what you learned from it.",
      "Give an example of how you’ve demonstrated leadership in a project.",
      "How do you handle negative feedback?",
      "Describe a time you worked with a difficult teammate.",
      "How do you stay motivated when facing setbacks?",
      "Tell me about a time when you had to learn a new skill quickly.",
      "How do you ensure good communication in a team?"
    ]
  },

  "Product Manager": {
    Technical: {
      General: [
        "How do you define product requirements?",
        "Explain the difference between a roadmap and a backlog.",
        "What frameworks do you use for prioritizing features?",
        "How would you measure the success of a product launch?",
        "Explain MVP (Minimum Viable Product) and why it matters.",
        "How do you perform competitor analysis?",
        "What KPIs do you track for product growth?",
        "Explain Agile vs Waterfall methodologies.",
        "How do you decide build vs buy?",
        "What’s the role of A/B testing in product decisions?"
      ]
    },
    Behavioral: [
      "Tell me about a time you convinced stakeholders to support your vision.",
      "How do you handle disagreements between engineering and design teams?",
      "Describe a product you launched and the impact it had.",
      "How do you manage deadlines when priorities shift?",
      "Tell me about a failure in a product you managed and what you learned.",
      "Describe a time you handled customer complaints.",
      "How do you align cross-functional teams?",
      "Tell me about a time you handled resource constraints.",
      "How do you communicate product strategy to executives?",
      "Give an example of managing conflicting priorities."
    ]
  },

  "Data Analyst": {
    Technical: {
      General: [
        "What is the difference between INNER JOIN and LEFT JOIN?",
        "Explain normalization in databases.",
        "How do you handle missing data in datasets?",
        "Explain the difference between correlation and causation.",
        "How would you detect outliers in a dataset?",
        "What are the different types of data distributions?",
        "Explain hypothesis testing in statistics.",
        "What is regression analysis and when is it used?",
        "Explain data cleaning techniques.",
        "How do you optimize SQL queries for performance?"
      ]
    },
    Behavioral: [
      "Tell me about a time when your analysis impacted a business decision.",
      "How do you handle tight deadlines with large datasets?",
      "Describe a situation when you had to explain a complex analysis to a non-technical stakeholder.",
      "How do you ensure data accuracy in your reports?",
      "Tell me about a project where your insights were challenged.",
      "How do you prioritize multiple requests for analysis?",
      "Describe a time when your analysis revealed unexpected results.",
      "How do you handle pressure when executives need answers quickly?",
      "Tell me about a time you collaborated with engineers or product managers.",
      "How do you approach continuous learning as a data analyst?"
    ]
  }
};


// ==== State ====
const el = id => document.getElementById(id);
let state = {
  role: "",
  domain: "",
  mode: "",
  qcount: 5,
  questions: [],
  current: 0,
  results: [],
  timer: null,
  timeLeft: 60,
  recognition: null,
  listening: false
};

// ==== Helpers ====
function pickQuestions() {
  let pool = [];
  if (state.mode === "Technical") {
    if (state.domain && QUESTION_BANK[state.role].Technical[state.domain]) {
      pool = QUESTION_BANK[state.role].Technical[state.domain];
    } else {
      Object.values(QUESTION_BANK[state.role].Technical).forEach(arr => pool.push(...arr));
    }
  } else if (state.mode === "Behavioral") {
    pool = QUESTION_BANK[state.role].Behavioral;
  }
  return pool.sort(() => Math.random() - 0.5).slice(0, state.qcount);
}

function renderQuestion() {
  const q = state.questions[state.current];
  el("qnum").innerText = `Question ${state.current + 1} of ${state.qcount}`;
  el("question").innerText = q;
  el("answer").value = "";
  el("feedback").classList.add("hidden");
  el("progress").style.width = `${(state.current / state.qcount) * 100}%`;
  resetTimer();

  speakQuestion(q);
}

function handleSubmit(skip = false) {
  const answer = skip ? "" : el("answer").value.trim();
  const feedback = answer.length > 15
    ? "✅ Good answer. Covered key points."
    : "⚠️ Try to expand more with examples.";
  state.results.push({ question: state.questions[state.current], answer, feedback });
  el("feedback").innerText = feedback;
  el("feedback").classList.remove("hidden");

  clearInterval(state.timer);
  setTimeout(() => {
    state.current++;
    if (state.current >= state.qcount) {
      showSummary();
    } else {
      renderQuestion();
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(state.timer);
  state.timeLeft = 60;
  el("timer").innerText = `Time left: ${state.timeLeft}s`;
  state.timer = setInterval(() => {
    state.timeLeft--;
    el("timer").innerText = `Time left: ${state.timeLeft}s`;
    if (state.timeLeft <= 0) {
      clearInterval(state.timer);
      handleSubmit(false);
    }
  }, 1000);
}

function showSummary() {
  el("interview").classList.add("hidden");
  el("summary").classList.remove("hidden");

  // --- Compute Average Score ---
  const scores = state.results.map(r => r.score || 0);
  const avgScore = scores.length 
    ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) 
    : "N/A";

  // --- Aggregate Strengths & Improvements ---
  let allStrengths = [];
  let allImprovements = [];

  state.results.forEach(r => {
    if (r.feedback) {
      const strengthsMatch = r.feedback.match(/Strengths: (.*)/);
      const improvementsMatch = r.feedback.match(/Improvements: (.*)/);

      if (strengthsMatch && strengthsMatch[1] && strengthsMatch[1] !== "-") {
        allStrengths.push(...strengthsMatch[1].split(",").map(s => s.trim()));
      }
      if (improvementsMatch && improvementsMatch[1] && improvementsMatch[1] !== "-") {
        allImprovements.push(...improvementsMatch[1].split(",").map(s => s.trim()));
      }
    }
  });

  // Deduplicate
  allStrengths = [...new Set(allStrengths)];
  allImprovements = [...new Set(allImprovements)];

  // --- Render Score ---
  el("finalScore").innerHTML = `
    <h3 style="margin-bottom:6px;">Your Performance</h3>
    <div style="font-size:1.2rem;font-weight:700;color:#ffd36b;">
      Average Score: ${avgScore}/10
    </div>
  `;

  // --- Render Strengths (only if available) ---
  let strengthsHTML = "";
  if (allStrengths.length) {
    strengthsHTML = `
      <h3>💡 Strengths</h3>
      <ul>${allStrengths.map(s => `<li>✅ ${s}</li>`).join("")}</ul>
    `;
  }

  // --- Render Improvements (only if available) ---
  let improvementsHTML = "";
  if (allImprovements.length) {
    improvementsHTML = `
      <h3 style="margin-top:14px;">📉 Areas for Improvement</h3>
      <ul>${allImprovements.map(s => `<li>⚠️ ${s}</li>`).join("")}</ul>
    `;
  }

  // --- Build Results Section ---
  let qaHTML = "";
  state.results.forEach((r, i) => {
    qaHTML += `
      <div style=" h2 {
                    text-align: center;
                    font-size: 1.8rem;
                    margin-bottom: 16px;
                    color: #fff;
                  }

                  .score-box {
                    text-align: center;
                    margin-bottom: 20px;
                    padding: 20px;
                    border-radius: 16px;
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(10px);
                    box-shadow: 0 4px 16px rgba(0,0,0,0.3);
                    animation: fadeIn 0.6s ease-in-out;
                  }

                  .score-box .score {
                    font-size: 2.2rem;
                    font-weight: 800;
                    color: #ffd36b;
                    text-shadow: 0 0 8px rgba(255, 211, 107, 0.6);
                  }

                  .badge {
                    display: inline-block;
                    padding: 6px 12px;
                    margin: 4px;
                    border-radius: 999px;
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: #fff;
                    animation: popIn 0.4s ease;
                  }

                  .badge.green { background: linear-gradient(135deg,#42e695,#3bb2b8); }
                  .badge.orange { background: linear-gradient(135deg,#ffb347,#ff6b6b); }
                  .badge.red { background: linear-gradient(135deg,#ff758c,#ff7eb3); }

                  .qa-card {
                    margin-bottom: 14px;
                    padding: 16px;
                    border-radius: 14px;
                    background: rgba(255, 255, 255, 0.08);
                    backdrop-filter: blur(6px);
                    box-shadow: 0 2px 8px rgba(0,0,0,0.25);
                    transition: transform 0.2s ease;
                  }

                  .qa-card:hover {
                    transform: translateY(-3px);
                  }

                  .qa-card strong { color: #ffd6f2; }

                  /* Animations */
                  @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                  }
                  @keyframes popIn {
                    from { transform: scale(0.8); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                  }">
        <div style="font-weight:600;margin-bottom:6px;color:#ffd6f2;">
          Q${i+1}: ${r.question}
        </div>
        <div style="white-space:pre-wrap;margin-bottom:6px;color:#fff;">
          <strong>Answer:</strong> ${r.answer || "<span style='color:#ff8080;'>[skipped]</span>"}
        </div>
        <div style="font-size:0.9rem;opacity:0.9;color:#42e695;">
          ${r.feedback || ""}
        </div>
      </div>
    `;
  });

  // --- Final Render ---
  el("resultsPre").innerHTML = strengthsHTML + improvementsHTML + `
    <h3 style="margin-top:14px;">📝 Question-wise Breakdown</h3>
    ${qaHTML}
  `;
}


function restart() {
  state = { ...state, role: "", domain: "", mode: "", qcount: 5, questions: [], current: 0, results: [] };
  el("setup").classList.remove("hidden");
  el("interview").classList.add("hidden");
  el("summary").classList.add("hidden");
}

function downloadResults() {
  const blob = new Blob([JSON.stringify(state.results, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "interview_results.json";
  a.click();
  URL.revokeObjectURL(url);
}

// ==== Voice Recognition ====
function initVoiceRecognition() {
  if (!("webkitSpeechRecognition" in window)) {
    alert("Speech recognition not supported in this browser.");
    return;
  }

  state.recognition = new webkitSpeechRecognition();
  state.recognition.lang = "en-US";
  state.recognition.interimResults = true;
  state.recognition.continuous = true; // keep listening

  state.recognition.onresult = function (event) {
  let interim = "";
  let final = "";

  for (let i = event.resultIndex; i < event.results.length; ++i) {
    let transcript = event.results[i][0].transcript;
    if (event.results[i].isFinal) {
      final += transcript + " ";
    } else {
      interim += transcript;
    }
  }

  // Append only final to textarea
  if (final) {
    el("answer").value += final;
  }

  // Show interim live (but not saved permanently)
  el("answer").placeholder = interim;
};


  state.recognition.onerror = function () {
    stopListening();
  };

  state.recognition.onend = function () {
    if (state.listening) {
      // auto-restart if user still wants listening
      state.recognition.start();
    } else {
      stopListening();
    }
  };
}

function toggleListening() {
  if (!state.recognition) initVoiceRecognition();
  if (state.listening) {
    stopListening();
  } else {
    startListening();
  }
}

function startListening() {
  if (state.recognition) {
    state.recognition.start();
    state.listening = true;
    el("micBtn").innerText = "🛑 Stop Voice";
  }
}

function stopListening() {
  if (state.recognition) {
    state.recognition.stop();
    state.listening = false;
    el("micBtn").innerText = "🎤 Voice";
  }
}



function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(10);
  doc.text("Interview Summary", 14, 20);

  let y = 30;
  state.results.forEach((r, i) => {
    const text = `Q${i+1}: ${r.question}\nAnswer: ${r.answer || "[skipped]"}\nFeedback: ${r.feedback}\n\n`;
    const splitText = doc.splitTextToSize(text, 180); // wrap text
    doc.text(splitText, 14, y);
    y += splitText.length * 7;

    if (y > 270) { // avoid text overflow
      doc.addPage();
      y = 20;
    }
  });

  doc.save("interview_summary.pdf");
}



/* ---------------------------
   Speak Question (TTS)
   --------------------------- */
function speakQuestion(text) {
  if (!("speechSynthesis" in window)) return; // Not supported
  window.speechSynthesis.cancel(); // stop any previous speech
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US-GuyNeural";
  utterance.rate = 1; // speed (0.5 – 2)
  utterance.pitch = 1; // pitch (0–2)
  window.speechSynthesis.speak(utterance);
}


// ==== Event Listeners ====
document.addEventListener("DOMContentLoaded", () => {
  el("btnStart").addEventListener("click", () => {
    state.role = el("role").value;
    state.domain = el("domain").value;
    state.mode = el("mode").value;
    state.qcount = parseInt(el("qcount").value);

    if (!state.role || !state.mode) {
      alert("Please select role and mode");
      return;
    }

    state.questions = pickQuestions();
    state.current = 0;
    state.results = [];

    el("setup").classList.add("hidden");
    el("interview").classList.remove("hidden");
    renderQuestion();
  });

  el("btnPractice").addEventListener("click", () => {
    state.role = el("role").value;
    state.domain = el("domain").value;
    state.mode = el("mode").value;
    state.qcount = parseInt(el("qcount").value);

    if (!state.role || !state.mode) {
      alert("Please select role and mode");
      return;
    }

    state.questions = pickQuestions();
    state.current = 0;
    state.results = [];

    el("setup").classList.add("hidden");
    el("interview").classList.remove("hidden");
    renderQuestion();
  });
function preserveCaret(fn) {
  const textarea = el("answer");
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  fn();
  // Restore caret
  textarea.selectionStart = start;
  textarea.selectionEnd = end;
  textarea.focus();
}

  el("btnSubmit").addEventListener("click", () => preserveCaret(() => handleSubmit(false)));
  el("btnSkip").addEventListener("click", () => preserveCaret(() => handleSubmit(true)));
  el("btnQuit").addEventListener("click", () => preserveCaret(showSummary));
  el("micBtn").addEventListener("click", () => preserveCaret(toggleListening));
  el("btnRestart").addEventListener("click", restart);
  el("btnDownloadPdf").addEventListener("click", downloadPDF);
  el("btnDownload").addEventListener("click", downloadResults);
  
});
