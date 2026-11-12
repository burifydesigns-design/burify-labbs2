"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

const questions = [
  { title: "Can a new visitor understand what you offer within a few seconds?", options: ["Yes, very clearly", "Somewhat", "Not really"] },
  { title: "Is it easy to request an appointment or make an enquiry on mobile?", options: ["Yes, in one or two steps", "It takes some effort", "There is no clear path"] },
  { title: "Does your website appear for the local services you want to be known for?", options: ["For most priority searches", "For a few searches", "Rarely or not sure"] },
  { title: "Do new enquiries receive a timely acknowledgement and follow-up?", options: ["Yes, consistently", "Sometimes", "No consistent process"] },
  { title: "Can you see which channels generate qualified enquiries?", options: ["Yes, with useful reporting", "Some basic tracking", "No"] },
  { title: "Do you review website performance and improve conversion paths?", options: ["Regularly", "Occasionally", "Not currently"] },
];

export function GrowthAssessment() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState(false);
  const score = useMemo(() => Object.values(answers).reduce((total, value) => total + (2 - value), 0), [answers]);
  const complete = Object.keys(answers).length === questions.length;
  const level = score >= 10 ? "Strong foundations" : score >= 6 ? "Room to improve" : "High-impact opportunities";

  return (
    <main id="main-content" className="growth-assessment">
      <section className="growth-hero">
        <div className="growth-container growth-narrow">
          <p className="growth-eyebrow">Free practice growth check</p>
          <h1>How well does your website turn interest into enquiries?</h1>
          <p className="growth-intro">Answer six practical questions to identify opportunities across clarity, booking, visibility, follow-up and measurement. This is a directional self-assessment, not an SEO audit or performance guarantee.</p>
        </div>
      </section>
      <section className="growth-section">
        <div className="growth-container growth-narrow">
          <div className="growth-progress"><span style={{ width: `${Object.keys(answers).length / questions.length * 100}%` }} /></div>
          <p className="growth-progress-label">{Object.keys(answers).length} of {questions.length} answered</p>
          {questions.map((question, index) => (
            <fieldset className="growth-question" key={question.title}>
              <legend><span>{String(index + 1).padStart(2, "0")}</span>{question.title}</legend>
              <div className="growth-options">
                {question.options.map((option, optionIndex) => (
                  <label key={option}>
                    <input type="radio" name={`question-${index}`} checked={answers[index] === optionIndex} onChange={() => { setAnswers((current) => ({ ...current, [index]: optionIndex })); setShowResult(false); }} />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
          <button className="growth-button growth-button-primary" disabled={!complete} onClick={() => setShowResult(true)}>View my assessment</button>
          {showResult && (
            <section className="growth-result" aria-live="polite">
              <p className="growth-eyebrow">Your directional result · {score}/12</p>
              <h2>{level}</h2>
              <p>{score >= 10 ? "You have useful foundations. Focus on testing individual conversion improvements and tracking their impact." : score >= 6 ? "There are several practical improvements worth prioritising. Start with the visitor journey and enquiry follow-up." : "Start with the basics: make your offer clear, make the next step obvious and ensure every enquiry is captured and handled reliably."}</p>
              <Link className="growth-button growth-button-secondary" href="/contact">Discuss your results with Burify</Link>
            </section>
          )}
        </div>
      </section>
    </main>
  );
}
