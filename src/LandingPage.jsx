import { useState, useEffect, useRef } from "react";

const COLORS = {
  bg: "#FAF7F2",
  text: "#2C2416",
  textLight: "#7A6E5D",
  textLighter: "#A69B8D",
  accent: "#B8860B",
  accentSoft: "#B8860B18",
  teal: "#1A5C5A",
  tealSoft: "#1A5C5A10",
  cardBg: "#FFFFFF",
  border: "#E8E0D4",
  borderLight: "#F0EBE3",
};

function FadeSection({ children, style }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transition: "opacity 0.8s ease, transform 0.8s ease",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export default function LandingPage() {
  return (
    <div style={{
      backgroundColor: COLORS.bg,
      color: COLORS.text,
      fontFamily: "'Georgia', 'Times New Roman', serif",
      WebkitFontSmoothing: "antialiased",
    }}>

      {/* ============================================= */}
      {/* HERO — Wordmark + tagline */}
      {/* ============================================= */}
      <section style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 28px",
      }}>
        <img
          src="/wordmark.svg"
          alt="Throughline Memoir"
          style={{ width: "100%", maxWidth: "100%", height: "auto" }}
        />
        <p style={{
          fontSize: 21,
          fontStyle: "italic",
          color: COLORS.textLight,
          marginTop: 36,
          textAlign: "center",
          lineHeight: 1.6,
          maxWidth: 500,
        }}>
          Crafting memoir from memories.<br />
          From first prompt to published book.
        </p>
        <div style={{
          marginTop: 48,
          fontSize: 14,
          color: COLORS.textLighter,
          letterSpacing: 1,
          textTransform: "uppercase",
          fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
        }}>
          Scroll to learn more ↓
        </div>
      </section>

      {/* ============================================= */}
      {/* THE PROBLEM */}
      {/* ============================================= */}
      <section style={{
        padding: "100px 28px",
        maxWidth: 680,
        margin: "0 auto",
      }}>
        <FadeSection>
          <h2 style={{
            fontSize: 15,
            fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: 2,
            color: COLORS.accent,
            marginBottom: 32,
          }}>
            The problem
          </h2>
          <p style={{ fontSize: 22, lineHeight: 1.7, marginBottom: 28 }}>
            Everyone has a story worth telling, but if you&rsquo;re not a writer, it can feel intimidating to even try. When aspiring writers look for programs to help with memoir writing, they&rsquo;re faced with limited options.
          </p>
          <p style={{ fontSize: 19, lineHeight: 1.7, color: COLORS.textLight, marginBottom: 24 }}>
            <strong style={{ color: COLORS.text }}>Option one</strong> sends you weekly, unrelated writing prompts, collects your answers, and prints them up as a book. The result is a scrapbook of disconnected memories—not a memoir. 
          </p>
          <p style={{ fontSize: 19, lineHeight: 1.7, color: COLORS.textLight, marginBottom: 24 }}>
            <strong style={{ color: COLORS.text }}>Option two</strong> has AI do the writing for you, resulting in prose that sounds like a machine, not like you. Your voice disappears into the algorithm.
          </p>
          <p style={{ fontSize: 19, lineHeight: 1.7, color: COLORS.textLight }}>
            Both end in the same place: a collection of memories, and no guidance on how to shape them into a story.
          </p>
        </FadeSection>
      </section>

      {/* ============================================= */}
      {/* THE TURN */}
      {/* ============================================= */}
      <section style={{
        padding: "80px 28px",
        borderTop: "1px solid " + COLORS.borderLight,
        borderBottom: "1px solid " + COLORS.borderLight,
      }}>
        <FadeSection style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
          <p style={{
            fontSize: 26,
            lineHeight: 1.6,
            fontStyle: "italic",
          }}>
            Throughline Memoir is built on a different belief: that the hardest part of memoir isn&rsquo;t the writing—it&rsquo;s uncovering what the story is actually about.
          </p>
        </FadeSection>
      </section>

      {/* ============================================= */}
      {/* HOW IT WORKS */}
      {/* ============================================= */}
      <section style={{
        padding: "100px 28px",
        maxWidth: 680,
        margin: "0 auto",
      }}>
        <FadeSection>
          <h2 style={{
            fontSize: 15,
            fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: 2,
            color: COLORS.accent,
            marginBottom: 32,
          }}>
            How it works
          </h2>
          <p style={{ fontSize: 22, lineHeight: 1.7, marginBottom: 40 }}>
            A year-long guided writing program that meets you where you are and helps you discover the story only you can tell.
          </p>
        </FadeSection>

        <FadeSection>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 32,
          }}>
            {[
              {
                number: "01",
                title: "You start with an intake",
                description: "Fourteen questions that help us understand your territory—the people, places, and experiences you want to explore. Your answers shape everything that follows.",
              },
              {
                number: "02",
                title: "You receive personalized prompts",
                description: "Each week, a prompt designed specifically for you. Not generic questions, but prompts that respond to what you’ve actually written, guiding you deeper into your material.",
              },
              {
                number: "03",
                title: "You write in your own voice",
                description: "A warm, beautiful writing space where everything saves automatically. No AI writes for you. Every word is yours.",
              },
              {
                number: "04",
                title: "The system pays attention",
                description: "Editorial analysis tracks the themes, patterns, and connections in your writing—things you might not see yet. It helps you find the throughline: the thread running through everything you’ve written.",
              },
              {
                number: "05",
                title: "Your book takes shape",
                description: "Over time, your scattered entries become connected material. Chapters emerge. Structure reveals itself. The story you didn’t even know you were writing comes into focus.",
              },
              {
                number: "06",
                title: "You hold your finished book",
                description: "When you’re ready, a professionally designed and published book—your story, in your voice, with your name on the cover.",
              },
            ].map((step) => (
              <div key={step.number} style={{
                display: "flex",
                gap: 20,
                alignItems: "flex-start",
              }}>
                <div style={{
                  fontSize: 14,
                  fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
                  fontWeight: 500,
                  color: COLORS.accent,
                  minWidth: 28,
                  paddingTop: 4,
                }}>
                  {step.number}
                </div>
                <div>
                  <h3 style={{
                    fontSize: 20,
                    fontWeight: 400,
                    margin: "0 0 8px",
                  }}>
                    {step.title}
                  </h3>
                  <p style={{
                    fontSize: 17,
                    lineHeight: 1.6,
                    color: COLORS.textLight,
                    margin: 0,
                  }}>
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </FadeSection>
      </section>

      {/* ============================================= */}
      {/* WHAT MAKES IT DIFFERENT */}
      {/* ============================================= */}
      <section style={{
        padding: "80px 28px",
        borderTop: "1px solid " + COLORS.borderLight,
        borderBottom: "1px solid " + COLORS.borderLight,
        backgroundColor: COLORS.tealSoft,
      }}>
        <FadeSection style={{ maxWidth: 680, margin: "0 auto" }}>
          <h2 style={{
            fontSize: 15,
            fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: 2,
            color: COLORS.teal,
            marginBottom: 32,
          }}>
            What makes it different
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 36 }}>
            {[
              {
                heading: "Your voice, not AI’s",
                text: "We don’t write for you. We don’t rewrite what you’ve written. Our editorial analysis finds the patterns in your words. You do all the writing.",
              },
              {
                heading: "Prompts that actually know you",
                text: "Not \"what’s your favorite childhood memory.\" Prompts built from your intake answers and continually shaped by what you write. Each one takes you deeper into your specific territory.",
              },
              {
                heading: "A real book at the end",
                text: "Not a template printout. A professionally designed, published book, produced by a real publishing company. Something you can hold in your hands, share with your friends, and put on a shelf.",
              },
              {
                heading: "Your work is safe here",
                text: "Your writing is yours. It will never be used to train AI. It will never be shared, sold, or made public without your permission. The editorial analysis that powers your personalized prompts was built by a working writer and editor with 20 years of memoir expertise—not scraped from other people’s books.",
              },
            ].map((item, i) => (
              <div key={i}>
                <h3 style={{
                  fontSize: 20,
                  fontWeight: 400,
                  margin: "0 0 8px",
                  color: COLORS.teal,
                }}>
                  {item.heading}
                </h3>
                <p style={{
                  fontSize: 17,
                  lineHeight: 1.6,
                  color: COLORS.textLight,
                  margin: 0,
                }}>
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </FadeSection>
      </section>

      {/* ============================================= */}
      {/* WHO IT'S FOR */}
      {/* ============================================= */}
      <section style={{
        padding: "100px 28px",
        maxWidth: 680,
        margin: "0 auto",
      }}>
        <FadeSection>
          <h2 style={{
            fontSize: 15,
            fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: 2,
            color: COLORS.accent,
            marginBottom: 32,
          }}>
            Who it’s for
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 40 }}>
            {[
              {
                name: "The parent with stories to preserve",
                text: "She’s lived a remarkable life and her children want to capture it before the details fade. She did Storyworth and loved the writing process but was disappointed when it ended. She deserves more than a printed stack of email replies.",
              },
              {
                name: "The retiree who always meant to write",
                text: "He’s been saying \“I should write a book\” for twenty years. He has the stories. What he doesn’t have is structure, guidance, or a clear path from \“I want to write\” to a finished manuscript. He needs someone to help him start—and keep going.",
              },
              {
                name: "The writer processing something big",
                text: "She’s carrying a story—grief, a life transition, an experience that changed everything. She’s tried journaling and writing workshops, but she needs more than prompts. She needs a system that pays attention to what she’s written, finds the thread, and helps her shape it into something real.",
              },
            ].map((persona, i) => (
              <div key={i} style={{
                paddingLeft: 20,
                borderLeft: "2px solid " + COLORS.accent,
              }}>
                <h3 style={{
                  fontSize: 20,
                  fontWeight: 400,
                  fontStyle: "italic",
                  margin: "0 0 10px",
                }}>
                  {persona.name}
                </h3>
                <p style={{
                  fontSize: 17,
                  lineHeight: 1.6,
                  color: COLORS.textLight,
                  margin: 0,
                }}>
                  {persona.text}
                </p>
              </div>
            ))}
          </div>
        </FadeSection>
      </section>

      {/* ============================================= */}
      {/* THE FOUNDING STORY */}
      {/* ============================================= */}
      <section style={{
        padding: "80px 28px",
        borderTop: "1px solid " + COLORS.borderLight,
        borderBottom: "1px solid " + COLORS.borderLight,
      }}>
        <FadeSection style={{ maxWidth: 680, margin: "0 auto" }}>
          <h2 style={{
            fontSize: 15,
            fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: 2,
            color: COLORS.accent,
            marginBottom: 32,
          }}>
            Our story
          </h2>
          <p style={{ fontSize: 19, lineHeight: 1.8, marginBottom: 24 }}>
            Throughline Memoir was born when a writer watched her mother—a woman with Parkinson&rsquo;s disease, in assisted living—light up while answering weekly writing prompts. The memories were vivid. The voice was unmistakably hers. But then the year of writing prompts ended, and the product that collected those answers couldn&rsquo;t do anything with them. Couldn&rsquo;t help her find the thread. Couldn&rsquo;t help her tell a whole story. Couldn&rsquo;t help her craft the memoir inside the memories.
          </p>
          <p style={{ fontSize: 19, lineHeight: 1.8, marginBottom: 24 }}>
            So she and her sisters decided to build what should have existed all along: a guided writing program that helps people discover what their story is really about, and a publishing company that turns the finished manuscript into a real book.
          </p>
          <p style={{ fontSize: 19, lineHeight: 1.8, color: COLORS.textLight }}>
            Three sisters, building something for their mother—and for everyone with a story worth telling.
          </p>
        </FadeSection>
      </section>

      {/* ============================================= */}
      {/* CTA — Email signup */}
      {/* ============================================= */}
      <section style={{
        padding: "100px 28px 120px",
        textAlign: "center",
      }}>
        <FadeSection style={{ maxWidth: 520, margin: "0 auto" }}>
          <h2 style={{
            fontSize: 28,
            fontWeight: 400,
            fontStyle: "italic",
            marginBottom: 16,
          }}>
            We’re launching soon.
          </h2>
          <p style={{
            fontSize: 19,
            lineHeight: 1.6,
            color: COLORS.textLight,
            marginBottom: 36,
          }}>
            Join the list and be the first to know when Throughline Memoir opens to writers.
          </p>

          <a href="https://magic.beehiiv.com/v1/4a1be6fa-9616-4a98-b569-fd48cb1dff5b?email={{email}}&redirect_to=https%3A%2F%2Fthroughlinememoir.com%2F"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              padding: "16px 36px",
              fontSize: 17,
              fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
              fontWeight: 500,
              backgroundColor: "#B8860B",
              color: "#FFFEFA",
              border: "none",
              borderRadius: 10,
              cursor: "pointer",
              textDecoration: "none",
            }}
          >
            Get notified
          </a>
          
        </FadeSection>
      </section>

      {/* ============================================= */}
      {/* FOOTER */}
      {/* ============================================= */}
      <footer style={{
        padding: "32px 28px",
        borderTop: "1px solid " + COLORS.borderLight,
        textAlign: "center",
      }}>
        <p style={{
          fontSize: 13,
          fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
          color: COLORS.textLighter,
          margin: 0,
        }}>
          © 2026 Throughline Memoir. All rights reserved.
        </p>
      </footer>

    </div>
  );
}
