import { useState, useRef } from "react";

const AIRTABLE_CONFIG = {
  API_KEY: import.meta.env.VITE_AIRTABLE_API_KEY || "YOUR_AIRTABLE_API_KEY",
  BASE_ID: import.meta.env.VITE_AIRTABLE_BASE_ID || "YOUR_BASE_ID",
};

const COLORS = {
  bg: "#FAF7F2",
  text: "#2C2416",
  textLight: "#7A6E5D",
  accent: "#B8860B",
  accentSoft: "#D4A84420",
  cardBg: "#FFFFFF",
  border: "#E8E0D4",
  green: "#5A8C5A",
  greenSoft: "#5A8C5A20",
  selected: "#B8860B18",
  selectedBorder: "#B8860B60",
};

const QUESTIONS = [
  {
    id: "name",
    field: "Writer Name",
    type: "text",
    title: "Before we begin...",
    question: "What's your name?",
    subtitle: "Just your first name is fine.",
    placeholder: "Your name",
  },
  {
    id: "experience",
    field: "Writing Experience",
    type: "single",
    title: "A little about you",
    question: "Have you written about your life before?",
    options: [
      "No, this is new for me",
      "A little — journals, letters, that sort of thing",
      "Yes — I've done Storyworth or something similar",
      "Yes — I've been working on a memoir or personal essays",
    ],
  },
  {
    id: "what_comes",
    field: "What Comes to Mind",
    type: "long",
    title: "Starting to think",
    question: "When you imagine writing about your life, what comes to mind first?",
    subtitle: "Write whatever surfaces — a time period, a person, a place, an image, a feeling. There's no wrong answer. If nothing specific comes to mind, that's okay too — just describe what draws you to the idea of writing about your life.",
    placeholder: "Whatever comes to mind...",
  },
  {
    id: "periods",
    field: "Life Periods",
    type: "multi",
    title: "Where in time",
    question: "Is there a particular period of your life you're drawn to?",
    subtitle: "Choose as many as feel right.",
    options: [
      "Childhood",
      "Teenage years",
      "Early adulthood / finding my way",
      "Marriage / partnership / family building",
      "Parenthood",
      "Career / professional life",
      "A period of major change or loss",
      "Later life / where I am now",
      "I'm not sure yet — I want to explore",
    ],
  },
  {
    id: "place",
    field: "First place you see",
    type: "long",
    title: "A first image",
    question: "Close your eyes for a moment. What's the first place from your past that you can see clearly?",
    subtitle: "Describe it — what does it look like, smell like, sound like? You don't need to explain why it matters. Just describe the place.",
    placeholder: "The place you see...",
  },
  {
    id: "people",
    field: "People in this story",
    type: "long",
    title: "The people",
    question: "Who are the people in this story?",
    subtitle: "List whoever comes to mind — family, friends, neighbors, strangers who mattered. You can just write names and a word or two about who they are. Or write more if you want.",
    placeholder: "The people who come to mind...",
  },
  {
    id: "one_person",
    field: "One person",
    type: "long",
    title: "One person",
    question: "Is there one person you find yourself wanting to write about — or needing to write about?",
    subtitle: "If so, who? And what's one word for your relationship with them?",
    placeholder: "The person, and one word...",
  },
  {
    id: "worried",
    field: "Worried about writing about",
    type: "long",
    title: "A gentle question",
    question: "Is there anyone you're worried about writing about?",
    subtitle: "You don't have to say why. Just a name or a relationship (e.g., \"my sister,\" \"my ex-husband\"). If there's no one, just skip this one.",
    placeholder: "Optional...",
    optional: true,
  },
  {
    id: "one_sentence",
    field: "One sentence",
    type: "long",
    title: "The big question",
    question: "If you had to describe what you want to write about in one sentence, what would you say?",
    subtitle: "Don't worry about getting it right. This will probably change. Just put down what feels true right now.",
    placeholder: "One sentence...",
  },
  {
    id: "why_now",
    field: "Why now",
    type: "long",
    title: "Why now",
    question: "What is it about this moment in your life that makes you want to write this?",
    subtitle: "Something may have happened recently, or it may be a feeling that's been building. Or maybe someone asked you to. Whatever the reason — why now?",
    placeholder: "Why now...",
  },
  {
    id: "hope",
    field: "What you hope for",
    type: "multi",
    title: "What you hope for",
    question: "What do you hope happens when you're done?",
    subtitle: "Choose as many as feel right.",
    options: [
      "I want a record of my life for my family",
      "I want to understand something about my own life better",
      "I want to write a book that others might read",
      "I want to process something difficult",
      "I want to preserve stories that would be lost otherwise",
      "I'm not sure — I just want to start",
    ],
  },
  {
    id: "hardest",
    field: "What feels hardest",
    type: "multi",
    title: "Being honest about the hard parts",
    question: "When you think about writing, what feels hardest?",
    subtitle: "Choose as many as apply.",
    options: [
      "Getting started — I don't know where to begin",
      "Keeping going — I start things but don't finish",
      "Being honest — I'm afraid of what might come out",
      "Organization — I don't know how to shape it",
      "The blank page — I freeze when I sit down to write",
      "Worrying about what others will think",
      "I'm not sure — I haven't tried yet",
    ],
  },
  {
    id: "relationship",
    field: "Relationship with writing",
    type: "long",
    title: "You and writing",
    question: "How would you describe your relationship with writing?",
    subtitle: "A sentence or two is fine. \"I've always loved it.\" \"I haven't written anything since school.\" \"I write emails and that's about it.\" Whatever's true.",
    placeholder: "Your relationship with writing...",
  },
  {
    id: "time",
    field: "Time per week",
    type: "single",
    title: "Practical matters",
    question: "How much time do you think you'll want to spend writing each week?",
    options: [
      "15–20 minutes",
      "30 minutes",
      "An hour",
      "More than an hour",
      "I have no idea",
    ],
  },
  {
    id: "anything",
    field: "Anything else",
    type: "long",
    title: "One last thing",
    question: "Is there anything else you'd like to share before we start?",
    subtitle: "Anything at all. Something you're excited about, something you're nervous about, a story you've been carrying, a question you have. This is just for us.",
    placeholder: "Whatever you'd like to share...",
    optional: true,
  },
];

export default function MemoirIntake() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const textareaRef = useRef(null);

  const question = QUESTIONS[currentStep];
  const totalSteps = QUESTIONS.length;
  const progress = ((currentStep) / totalSteps) * 100;

  const currentAnswer = answers[question.id] || (question.type === "multi" ? [] : "");

  const canProceed = () => {
    if (question.optional) return true;
    if (question.type === "multi") return true; // multi-select can be empty
    if (question.type === "single") return currentAnswer !== "";
    return currentAnswer.trim() !== "";
  };

  const setAnswer = (value) => {
    setAnswers({ ...answers, [question.id]: value });
  };

  const toggleMulti = (option) => {
    const current = answers[question.id] || [];
    if (current.includes(option)) {
      setAnswer(current.filter((o) => o !== option));
    } else {
      setAnswer([...current, option]);
    }
  };

  const goNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
      setTimeout(() => {
        if (textareaRef.current) textareaRef.current.focus();
      }, 100);
    } else {
      submitIntake();
    }
  };

  const goBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const submitIntake = async () => {
    setIsSubmitting(true);

    const fields = {};
    QUESTIONS.forEach((q) => {
      const answer = answers[q.id];
      if (q.type === "multi" && answer && answer.length > 0) {
        fields[q.field] = answer;
      } else if (answer && answer !== "") {
        fields[q.field] = answer;
      }
    });

    try {
      const response = await fetch(
        `https://api.airtable.com/v0/${AIRTABLE_CONFIG.BASE_ID}/${encodeURIComponent("Intake")}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${AIRTABLE_CONFIG.API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fields }),
        }
      );

      if (response.ok) {
        setIsComplete(true);
      } else {
        const errorData = await response.json();
        console.error("Failed to submit intake:", JSON.stringify(errorData));
        console.error("Fields sent:", JSON.stringify(fields));
      }
    } catch (err) {
      console.error("Error submitting intake:", err);
      setIsComplete(true);
    }

    setIsSubmitting(false);
  };

  // Completion screen
  if (isComplete) {
    return (
      <div style={{
        minHeight: "100vh", backgroundColor: COLORS.bg,
        fontFamily: "'Georgia', 'Times New Roman', serif", color: COLORS.text,
        display: "flex", alignItems: "center", justifyContent: "center", padding: 28,
      }}>
        <div style={{ maxWidth: 520, textAlign: "center" }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%", backgroundColor: COLORS.greenSoft,
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 24px", fontSize: 28,
          }}>✓</div>
          <h1 style={{ fontSize: 28, fontWeight: 400, fontStyle: "italic", margin: "0 0 16px" }}>
            Thank you.
          </h1>
          <p style={{ fontSize: 19, lineHeight: 1.6, color: COLORS.textLight, margin: "0 0 12px" }}>
            Your answers will help create a writing journey that's truly yours.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.6, color: COLORS.textLight, margin: "0 0 12px" }}>
            We'll prepare your personalized prompts and be in touch soon with your first one. In the meantime—that place you described, the people you named, the sentence you wrote: hold onto those. They're the beginning.
          </p>
          <button onClick={() => { window.location.hash = "freewrite"; }} style={{
            padding: "16px 36px", borderRadius: 10, border: "none",
            backgroundColor: COLORS.accent, color: "#FFFEFA", fontSize: 17,
            fontWeight: 500, fontFamily: "'Inter', sans-serif",
            cursor: "pointer", minHeight: 52, marginTop: 24,
          }}>
            Can't wait to get started? Start writing now!
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh", backgroundColor: COLORS.bg,
      fontFamily: "'Georgia', 'Times New Roman', serif", color: COLORS.text,
      WebkitFontSmoothing: "antialiased", display: "flex", flexDirection: "column",
    }}>
      {/* Progress bar */}
      <div style={{
        height: 3, backgroundColor: COLORS.border, flexShrink: 0,
      }}>
        <div style={{
          height: "100%", backgroundColor: COLORS.accent,
          width: `${progress}%`, transition: "width 0.4s ease",
        }} />
      </div>

      {/* Header */}
      <div style={{
        padding: "16px 28px", display: "flex", justifyContent: "space-between",
        alignItems: "center", flexShrink: 0,
      }}>
        <p style={{
          fontSize: 15, color: COLORS.textLight, margin: 0,
          fontFamily: "'Inter', sans-serif",
        }}>
          {currentStep + 1} of {totalSteps}
        </p>
        {currentStep > 0 && (
          <button onClick={goBack} style={{
            background: "none", border: "none", color: COLORS.textLight,
            fontSize: 15, cursor: "pointer", fontFamily: "'Inter', sans-serif",
            minHeight: 44,
          }}>← Back</button>
        )}
      </div>

      {/* Question area */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column", justifyContent: "center",
        maxWidth: 640, width: "100%", margin: "0 auto", padding: "0 28px 32px",
      }}>
        <p style={{
          fontSize: 14, color: COLORS.accent, margin: "0 0 8px",
          fontFamily: "'Inter', sans-serif", fontWeight: 600,
          textTransform: "uppercase", letterSpacing: "0.05em",
        }}>{question.title}</p>

        <h2 style={{
          fontSize: 24, fontWeight: 400, lineHeight: 1.4,
          margin: "0 0 12px", color: COLORS.text,
        }}>{question.question}</h2>

        {question.subtitle && (
          <p style={{
            fontSize: 16, lineHeight: 1.6, color: COLORS.textLight,
            margin: "0 0 28px",
          }}>{question.subtitle}</p>
        )}

        {/* Text input */}
        {question.type === "text" && (
          <input
            type="text"
            value={currentAnswer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder={question.placeholder}
            autoFocus
            style={{
              padding: "18px 20px", borderRadius: 12,
              border: `1px solid ${COLORS.border}`, backgroundColor: COLORS.cardBg,
              color: COLORS.text, fontSize: 20, fontFamily: "'Georgia', serif",
              outline: "none", width: "100%", boxSizing: "border-box",
            }}
            onKeyDown={(e) => { if (e.key === "Enter" && canProceed()) goNext(); }}
          />
        )}

        {/* Long text input */}
        {question.type === "long" && (
          <textarea
            ref={textareaRef}
            value={currentAnswer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder={question.placeholder}
            autoFocus
            style={{
              padding: 20, borderRadius: 12,
              border: `1px solid ${COLORS.border}`, backgroundColor: COLORS.cardBg,
              color: COLORS.text, fontSize: 19, lineHeight: 1.7,
              fontFamily: "'Georgia', serif", resize: "none",
              outline: "none", width: "100%", boxSizing: "border-box",
              minHeight: 180,
            }}
          />
        )}

        {/* Single select */}
        {question.type === "single" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {question.options.map((option) => (
              <button
                key={option}
                onClick={() => setAnswer(option)}
                style={{
                  padding: "16px 20px", borderRadius: 10, textAlign: "left",
                  border: `1px solid ${currentAnswer === option ? COLORS.selectedBorder : COLORS.border}`,
                  backgroundColor: currentAnswer === option ? COLORS.selected : COLORS.cardBg,
                  color: COLORS.text, fontSize: 17, fontFamily: "'Georgia', serif",
                  cursor: "pointer", minHeight: 52, transition: "all 0.15s ease",
                }}
              >{option}</button>
            ))}
          </div>
        )}

        {/* Multi select */}
        {question.type === "multi" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {question.options.map((option) => {
              const isSelected = (currentAnswer || []).includes(option);
              return (
                <button
                  key={option}
                  onClick={() => toggleMulti(option)}
                  style={{
                    padding: "16px 20px", borderRadius: 10, textAlign: "left",
                    border: `1px solid ${isSelected ? COLORS.selectedBorder : COLORS.border}`,
                    backgroundColor: isSelected ? COLORS.selected : COLORS.cardBg,
                    color: COLORS.text, fontSize: 17, fontFamily: "'Georgia', serif",
                    cursor: "pointer", minHeight: 52, transition: "all 0.15s ease",
                    display: "flex", alignItems: "center", gap: 12,
                  }}
                >
                  <div style={{
                    width: 22, height: 22, borderRadius: 4, flexShrink: 0,
                    border: `2px solid ${isSelected ? COLORS.accent : COLORS.border}`,
                    backgroundColor: isSelected ? COLORS.accent : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.15s ease",
                  }}>
                    {isSelected && <span style={{ color: "#fff", fontSize: 14, lineHeight: 1 }}>✓</span>}
                  </div>
                  {option}
                </button>
              );
            })}
          </div>
        )}
        
{question.optional && question.type === "long" && currentAnswer === "" && (
          <p style={{
            fontSize: 14, color: COLORS.textLight, margin: "12px 0 0",
            fontFamily: "'Inter', sans-serif", textAlign: "right",
          }}>
            This one's optional — skip it if you'd like
          </p>
        )}
        {/* Next / Submit button */}
        <div style={{ marginTop: 32, display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={goNext}
            disabled={!canProceed() || isSubmitting}
            style={{
              padding: "16px 36px", borderRadius: 10, border: "none",
              backgroundColor: canProceed() && !isSubmitting ? COLORS.accent : COLORS.border,
              color: canProceed() && !isSubmitting ? "#FFFEFA" : COLORS.textLight,
              fontSize: 17, fontWeight: 500, fontFamily: "'Inter', sans-serif",
              cursor: canProceed() && !isSubmitting ? "pointer" : "default",
              minHeight: 52, transition: "all 0.2s ease",
            }}
          >
            {isSubmitting ? "Saving..." : currentStep === totalSteps - 1 ? "Finish" : "Next"}
          </button>
        </div>

        
      </div>

      <style>{`
        textarea::placeholder, input::placeholder {
          color: ${COLORS.textLight};
          opacity: 0.5;
          font-style: italic;
        }
      `}</style>
    </div>
  );
}
