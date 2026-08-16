"use client";

import React, { useState, useEffect } from "react";
import resumeData from "../data/resume.json";

export default function Home() {
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedResponsibility, setExpandedResponsibility] = useState(null);
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalHistory, setTerminalHistory] = useState([
    { type: "system", text: "Veerabadran V Interactive Profile Terminal v1.1.0" },
    { type: "system", text: "Type 'help' or click commands below to query my data." }
  ]);

  // Theme state: "dark" or "light"
  const [theme, setTheme] = useState("dark");

  // Recruiter Fit Check state
  const [activeFitQuestion, setActiveFitQuestion] = useState(null);

  // Contact form state
  const [contactForm, setContactForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [communicationMode, setCommunicationMode] = useState("email"); // "email" or "whatsapp"
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Toast / Download simulation state
  const [toastMessage, setToastMessage] = useState("");
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showPhotoLightbox, setShowPhotoLightbox] = useState(false);

  // basePath is resolved ONLY on the client inside useEffect to avoid SSR race conditions.
  // During SSR window is undefined so basePath starts as "" which would produce wrong paths.
  const [basePath, setBasePath] = useState("");

  // Load resume data dynamically.
  // basePath is also resolved here so it is guaranteed to run after client hydration,
  // never during SSR. imgError is also reset so the image retries with the correct path.
  useEffect(() => {
    const resolvedBase = window.location.hostname.includes("github.io") ? "/portfolio" : "";
    setBasePath(resolvedBase);
    setMounted(true);
    setImgError(false); // reset so image retries once basePath is known
    const timer = setTimeout(() => {
      setData(resumeData);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Clear toast after 3 seconds
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(""), 3500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  if (!data) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-[#0b0f17] text-white">
        <div className="relative flex items-center justify-center">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"></div>
          <div className="absolute text-sm font-mono font-bold text-cyan-400">VV</div>
        </div>
        <p className="mt-4 text-xs font-mono text-zinc-500 animate-pulse">Loading developer credentials...</p>
      </div>
    );
  }

  const { personal, workExperience, education, skills, languages } = data;
  const profileThumbSrc = personal.photoUrl || `${basePath}/profile-thumb.png?v=1.0.3`;
  const profileFullSrc = personal.photoUrl || `${basePath}/profile.png?v=1.0.3`;

  // Flattened skills with categories for searching
  const allSkillsFlat = Object.entries(skills).flatMap(([category, skillList]) =>
    skillList.map(skill => ({ name: skill, category }))
  );

  const filteredSkills = allSkillsFlat.filter(skill => {
    const matchesCategory = activeTab === "all" || skill.category === activeTab;
    const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Fit check questions for recruiters
  const fitQuestions = [
    {
      id: "leadership",
      question: "Do you have Team Leadership experience?",
      answer: "Yes, absolutely. As a Lead Engineer at GRAAS, I lead a team of engineers, ensuring goal alignment, facilitating Jira project tracking, and fostering a collaborative, highly-motivated work environment."
    },
    {
      id: "databases",
      question: "Are you familiar with SQL, NoSQL & messaging?",
      answer: "Yes. I have hands-on experience managing relational databases (SQL) and NoSQL (MongoDB), along with message brokers (RabbitMQ) for building distributed systems."
    },
    {
      id: "notice",
      question: "What is your notice period and location status?",
      answer: "I am based in Coimbatore, Tamil Nadu, and have a 2-month notice period for new opportunities."
    },
    {
      id: "support",
      question: "How do you handle application support & debugging?",
      answer: "I take a hands-on approach to monitoring RabbitMQ and logs, debugging software bugs, conducting root cause analysis, and creating automation scripts to streamline support operations."
    }
  ];

  // Handle Interactive Terminal Commands
  const handleTerminalSubmit = (e) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    const cmd = terminalInput.trim().toLowerCase();
    const newHistory = [...terminalHistory, { type: "user", text: `$ ${terminalInput}` }];

    switch (cmd) {
      case "help":
        newHistory.push({
          type: "system",
          text: "Commands: summary | contact | skills | experience | clear"
        });
        break;
      case "summary":
        newHistory.push({ type: "output", text: personal.summary });
        break;
      case "contact":
        newHistory.push({
          type: "output",
          text: `Email: ${personal.email} | Phone: ${personal.phone} | Location: ${personal.location}`
        });
        break;
      case "skills":
        newHistory.push({
          type: "output",
          text: `Tech Stack: ${skills["Technical Skills"].join(", ")}`
        });
        break;
      case "experience":
        newHistory.push({
          type: "output",
          text: `Current Role: ${workExperience[0].role} (${workExperience[0].period}). Notice: ${workExperience[0].noticePeriod}`
        });
        break;
      case "clear":
        setTerminalHistory([]);
        setTerminalInput("");
        return;
      default:
        newHistory.push({
          type: "error",
          text: `Command not found: '${cmd}'. Available: help, summary, contact, skills, experience, clear`
        });
    }

    setTerminalHistory(newHistory);
    setTerminalInput("");
  };

  const executeQuickCommand = (cmd) => {
    setTerminalInput(cmd);
    setTimeout(() => {
      const newHistory = [...terminalHistory, { type: "user", text: `$ ${cmd}` }];
      if (cmd === "summary") {
        newHistory.push({ type: "output", text: personal.summary });
      } else if (cmd === "skills") {
        newHistory.push({ type: "output", text: `Tech Stack: ${skills["Technical Skills"].join(", ")}` });
      } else if (cmd === "experience") {
        newHistory.push({ type: "output", text: `Current Role: ${workExperience[0].role} (${workExperience[0].period})` });
      } else if (cmd === "contact") {
        newHistory.push({ type: "output", text: `Email: ${personal.email} | Phone: ${personal.phone}` });
      }
      setTerminalHistory(newHistory);
      setTerminalInput("");
    }, 100);
  };

  // Open the PDF Templates selector Modal
  const handleExportPDF = () => {
    setShowPDFModal(true);
  };

  // Handle Contact Form Submit
  const handleContactSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    const textMsg = `Hello Veerabadran,\n\nMy name is ${contactForm.name} (${contactForm.email}).\n\nSubject: ${contactForm.subject}\n\nMessage: ${contactForm.message}`;

    setTimeout(() => {
      setSubmitting(false);
      setFormSubmitted(true);
      setToastMessage("Direct link launched successfully!");

      if (communicationMode === "whatsapp") {
        const waUrl = `https://wa.me/919080133317?text=${encodeURIComponent(textMsg)}`;
        window.open(waUrl, "_blank");
      } else {
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${personal.email}&su=${encodeURIComponent(contactForm.subject)}&body=${encodeURIComponent(textMsg)}`;
        window.open(gmailUrl, "_blank");
      }
    }, 800);
  };

  // Custom styling tokens mapped by theme to guarantee NO blur/text visibility issues
  const isDark = theme === "dark";
  const bgClass = isDark ? "bg-[#0b0f17] text-zinc-100" : "bg-[#f8fafc] text-slate-800";
  const headerClass = isDark ? "bg-[#151e2d]/90 border-b border-zinc-800/80" : "bg-white/95 border-b border-slate-200 shadow-sm";
  const textTitleClass = isDark ? "text-white" : "text-slate-900";
  const textSubtitleClass = isDark ? "text-cyan-400" : "text-cyan-600";
  const textMutedClass = isDark ? "text-zinc-400" : "text-slate-600";
  const panelClass = isDark ? "bg-[#151e2d] border border-zinc-800" : "bg-white border border-slate-200 shadow-sm";
  const inputClass = isDark ? "bg-[#0b0f17] border-zinc-800 text-zinc-100 focus:border-cyan-500" : "bg-slate-50 border-slate-200 text-slate-950 focus:border-cyan-600 focus:bg-white";
  const badgeClass = isDark ? "bg-zinc-800/40 border border-zinc-800 text-zinc-300" : "bg-slate-100 border border-slate-200 text-slate-700";
  const borderClass = isDark ? "border-zinc-800" : "border-slate-200";

  return (
    <div className={`min-h-screen ${bgClass} flex flex-col relative print:bg-white print:text-black`}>

      {/* Toast Alert Indicator */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-[100] bg-cyan-900/90 text-cyan-200 border border-cyan-500/30 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md flex items-center gap-2 animate-bounce print:hidden">
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping"></span>
          <span className="text-xs font-mono">{toastMessage}</span>
        </div>
      )}

      {/* Decorative Cyber Grid & Background Glows */}
      {isDark && (
        <>
          <div className="absolute top-0 left-0 w-full h-[600px] bg-[linear-gradient(rgba(14,165,233,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none print:hidden"></div>
          <div className="absolute top-10 left-1/3 w-[350px] h-[350px] bg-cyan-500/5 rounded-full blur-[90px] pointer-events-none animate-pulse-glow print:hidden"></div>
          <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none animate-pulse-glow print:hidden" style={{ animationDelay: "2.5s" }}></div>
        </>
      )}

      {/* Navigation Header */}
      <header className={`sticky top-0 z-50 ${headerClass} px-6 py-4 print:hidden`}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-500 flex items-center justify-center font-mono font-bold text-slate-950 shadow-md">
              VV
            </div>
            <div>
              <span className={`font-semibold text-base tracking-tight block leading-tight ${textTitleClass}`}>{personal.name}</span>
              <span className="text-xs text-cyan-500 font-mono">Lead Engineer Portfolio</span>
            </div>
          </div>
          <nav className="flex items-center gap-5 text-xs sm:text-sm font-mono text-zinc-400">
            <a href="#about" className={`hover:text-cyan-500 transition-colors ${!isDark && "text-slate-600"}`}>About</a>
            <a href="#fit-check" className="hover:text-cyan-500 text-cyan-500/90 font-semibold transition-colors">FAQ</a>
            <a href="#experience" className={`hover:text-cyan-500 transition-colors ${!isDark && "text-slate-600"}`}>Experience</a>
            <a href="#skills" className={`hover:text-cyan-500 transition-colors ${!isDark && "text-slate-600"}`}>Skills</a>
            <a href="#education" className={`hover:text-cyan-500 transition-colors ${!isDark && "text-slate-600"}`}>Education</a>
            <a href="#terminal" className={`hover:text-cyan-500 transition-colors ${!isDark && "text-slate-600"}`}>Console</a>
            <a href="#contact" className={`hover:text-cyan-500 transition-colors ${!isDark && "text-slate-600"}`}>Contact</a>

            {/* Theme Toggle Button */}
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${isDark ? "border-zinc-800 text-cyan-400 hover:bg-zinc-800/40" : "border-slate-200 text-cyan-600 hover:bg-slate-100"}`}
              aria-label="Toggle Theme"
            >
              {isDark ? (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.364l-.707-.707M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            <button
              onClick={handleExportPDF}
              className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-semibold transition-all cursor-pointer ${isDark ? "bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border-cyan-500/30" : "bg-cyan-50 hover:bg-cyan-100 text-cyan-700 border-cyan-200"
                }`}
            >
              PDF Resume
            </button>
          </nav>
        </div>
      </header>

      {/* Recruiter Quick Scan Summary Grid */}
      <section className={`${isDark ? "bg-slate-900/60 border-b border-zinc-800/60" : "bg-slate-100/80 border-b border-slate-200"} py-4 px-6 print:hidden`}>
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center sm:text-left">
          <div className={`pr-4 ${isDark ? "border-r border-zinc-800" : "border-r border-slate-200"} last:border-none`}>
            <span className="text-[10px] uppercase tracking-wider text-zinc-500 block font-mono">Notice Period</span>
            <span className="text-sm sm:text-base font-bold text-emerald-500 font-mono">2 Months (Available)</span>
          </div>
          <div className={`pr-4 ${isDark ? "border-r border-zinc-800" : "border-r border-slate-200"} last:border-none`}>
            <span className="text-[10px] uppercase tracking-wider text-zinc-500 block font-mono">Current Position</span>
            <span className={`text-sm sm:text-base font-bold font-mono ${textTitleClass}`}>Lead Engineer</span>
          </div>
          <div className={`pr-4 ${isDark ? "border-r border-zinc-800" : "border-r border-slate-200"} last:border-none`}>
            <span className="text-[10px] uppercase tracking-wider text-zinc-500 block font-mono">Primary Stack</span>
            <span className="text-sm sm:text-base font-bold text-cyan-500 font-mono">Java, Python, Spring</span>
          </div>
          <div className="pr-4">
            <span className="text-[10px] uppercase tracking-wider text-zinc-500 block font-mono">Location Status</span>
            <span className={`text-sm sm:text-base font-bold font-mono ${textTitleClass}`}>Coimbatore (Open to Relocation)</span>
          </div>
        </div>
      </section>

      {/* Main Hero & Profile */}
      <section id="about" className="max-w-6xl mx-auto px-6 pt-16 pb-12 w-full flex flex-col lg:flex-row items-center gap-12 print:pt-4">
        <div className="flex-1 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 font-bold text-xs font-mono">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Dynamic Recruiter Dashboard
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
            Hi, I'm{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 via-emerald-500 to-teal-500">
              {personal.name}
            </span>
          </h1>
          <p className={`text-xl sm:text-2xl font-mono font-medium ${textSubtitleClass}`}>
            {personal.title}
          </p>
          <p className={`${textMutedClass} max-w-2xl leading-relaxed text-sm sm:text-base`}>
            {personal.summary}
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs sm:text-sm font-mono pt-2 print:flex-col print:items-start">
            <div className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border ${badgeClass}`}>
              <svg className="h-4 w-4 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              {personal.location}
            </div>
            <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${personal.email}`} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-colors ${badgeClass} hover:border-cyan-500/50`}>
              <svg className="h-4 w-4 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {personal.email}
            </a>
            <a href={`tel:${personal.phone}`} className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-colors ${badgeClass} hover:border-cyan-500/50`}>
              <svg className="h-4 w-4 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {personal.phone}
            </a>
          </div>
        </div>

        {/* Hero visual graphic representation */}
        <div className="w-full lg:w-96 flex justify-center print:hidden">
          <div className={`relative w-80 h-80 rounded-2xl overflow-hidden ${panelClass} flex flex-col items-center justify-center p-8 animate-float`}>
            {mounted && !imgError ? (
              <div 
                onClick={() => setShowPhotoLightbox(true)}
                className="h-32 w-32 rounded-2xl overflow-hidden mb-6 border-2 border-cyan-500/50 shadow-lg bg-zinc-800 select-none cursor-zoom-in hover:scale-105 transition-all duration-300"
              >
                <img
                  src={profileThumbSrc}
                  alt={personal.name}
                  onError={() => setImgError(true)}
                  onContextMenu={(e) => e.preventDefault()}
                  onDragStart={(e) => e.preventDefault()}
                  className="h-full w-full object-cover object-top select-none pointer-events-none"
                />
              </div>
            ) : (
              <div className="h-28 w-28 rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-500 flex items-center justify-center text-slate-950 text-4xl font-mono font-extrabold mb-6 shadow-lg select-none">
                VV
              </div>
            )}
            <h3 className={`text-xl font-bold tracking-wide ${textTitleClass}`}>{personal.name}</h3>
            <p className={`text-xs font-mono mt-1 ${textSubtitleClass}`}>Lead Engineer | Tech Innovator</p>
            <div className="flex gap-2.5 mt-6 flex-wrap justify-center">
              {["Java", "Python", "Spring Boot", "SQL"].map((lang, lIdx) => (
                <span key={lIdx} className={`text-[10px] px-2.5 py-1 rounded-md font-mono ${badgeClass}`}>
                  {lang}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Recruiter Screening Q&A */}
      <section id="fit-check" className="max-w-6xl mx-auto px-6 py-12 w-full print:hidden">
        <div className={`rounded-2xl p-6 sm:p-8 border ${isDark ? "border-cyan-500/10 bg-gradient-to-r from-cyan-950/20 to-emerald-950/10" : "border-slate-200 bg-slate-50"}`}>
          <h2 className={`text-xl sm:text-2xl font-bold mb-2 flex items-center gap-2 ${textTitleClass}`}>
            <svg className="h-6 w-6 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Recruiter Screening Q&A
          </h2>
          <p className={`text-xs mb-6 font-mono ${textMutedClass}`}>
            Hi! To save you screening time, I've compiled direct answers to common questions hiring managers and recruiters ask me. Click below to review my fit.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            {fitQuestions.map((fq) => {
              const isSelected = activeFitQuestion === fq.id;
              const fqCardClass = isSelected
                ? (isDark ? "bg-cyan-500/10 border-cyan-500/30" : "bg-cyan-50/50 border-cyan-300")
                : (isDark ? "bg-white/5 border-zinc-800 hover:bg-zinc-800/40" : "bg-white border-slate-200 hover:bg-slate-50");
              return (
                <div
                  key={fq.id}
                  onClick={() => setActiveFitQuestion(isSelected ? null : fq.id)}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all duration-300 ${fqCardClass}`}
                >
                  <div className="flex justify-between items-center gap-2">
                    <span className={`font-semibold text-sm ${textTitleClass}`}>{fq.question}</span>
                    <span className={`text-xs font-mono ${textSubtitleClass} ${isSelected ? "rotate-90" : ""}`}>➔</span>
                  </div>
                  {isSelected && (
                    <p className={`mt-3 text-xs font-mono leading-relaxed border-t ${borderClass} pt-2 ${textMutedClass}`}>
                      {fq.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Work Experience Section */}
      <section id="experience" className="max-w-6xl mx-auto px-6 py-12 w-full page-break-before">
        <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight mb-8 flex items-center gap-3 ${textTitleClass}`}>
          <span className="h-8 w-1 rounded bg-cyan-500"></span>
          Professional Experience
        </h2>
        {workExperience.map((exp, idx) => (
          <div key={idx} className={`${panelClass} rounded-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden print:border-none print:shadow-none print:p-0`}>
            <div className={`absolute top-0 right-0 px-4 py-2 border-l border-b ${borderClass} rounded-bl-xl text-xs font-mono ${textSubtitleClass} print:hidden`}>
              Notice Period: {exp.noticePeriod}
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className={`text-xl sm:text-2xl font-bold ${textTitleClass}`}>{exp.role}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-mono font-medium ${isDark ? "bg-cyan-500/10 border border-cyan-500/20 text-cyan-400" : "bg-cyan-50 border border-cyan-200 text-cyan-700"}`}>
                  {exp.type}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm font-mono text-zinc-500">
                <span className={`font-semibold ${textSubtitleClass}`}>{exp.company}</span>
                <span>•</span>
                <span>{exp.location}</span>
                <span>•</span>
                <span className="text-zinc-500">{exp.period}</span>
              </div>
            </div>

            <p className={`text-xs sm:text-sm leading-relaxed border-l-2 border-cyan-500/20 pl-4 ${textMutedClass}`}>
              Responsible for directing technical projects, coordinating engineers, addressing client escalations, performing troubleshooting operations, and refining system performance metrics. Click a specific key duty below to expand the operational impact.
            </p>

            {/* Responsibilities Accordion */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start print:grid-cols-1 print:gap-2">
              {exp.responsibilities.map((resp, rIdx) => {
                const isExpanded = expandedResponsibility === rIdx;
                const respCardClass = isExpanded
                  ? (isDark ? "bg-cyan-500/5 border-cyan-500/30" : "bg-cyan-50/20 border-cyan-200")
                  : (isDark ? "bg-white/5 border-zinc-800 hover:bg-zinc-800/40" : "bg-white border-slate-200 hover:bg-slate-50 print:border-none");
                return (
                  <div
                    key={rIdx}
                    className={`rounded-xl border transition-all duration-300 cursor-pointer print:cursor-default ${respCardClass}`}
                    onClick={() => setExpandedResponsibility(isExpanded ? null : rIdx)}
                  >
                    <div className="p-4 flex items-center justify-between gap-3 print:p-0 print:pt-2">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-cyan-500"></span>
                        <span className={`font-semibold text-xs sm:text-sm ${textTitleClass}`}>{resp.title}</span>
                      </div>
                      <svg
                        className={`h-4 w-4 text-zinc-500 transition-transform print:hidden ${isExpanded ? "rotate-180 text-cyan-500" : ""}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    {/* Render expanded details, always show in print mode */}
                    <div className={`${isExpanded ? "block" : "hidden print:block"} px-4 pb-4 pt-1 text-xs leading-relaxed border-t ${borderClass} ${textMutedClass} print:border-none print:px-0 print:pb-0 print:pt-1`}>
                      {resp.description}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </section>

      {/* Skills Interactive Dashboard */}
      <section id="skills" className="max-w-6xl mx-auto px-6 py-12 w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
          <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-3 ${textTitleClass}`}>
            <span className="h-8 w-1 rounded bg-cyan-500"></span>
            Technical Expertise
          </h2>
          {/* Dynamic Search Bar */}
          <div className="relative w-full sm:w-72 print:hidden">
            <input
              type="text"
              placeholder="Search stack/skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all pl-9 ${inputClass}`}
            />
            <svg className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Dynamic Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 print:hidden">
          {["all", ...Object.keys(skills)].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${activeTab === cat
                  ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/10"
                  : (isDark ? "bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200")
                }`}
            >
              {cat === "all" ? "All Skills" : cat}
            </button>
          ))}
        </div>

        {/* Dynamic Skills Render */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 print:grid-cols-3 print:gap-2">
          {filteredSkills.map((skill, index) => (
            <div
              key={index}
              className={`${panelClass} rounded-xl p-4 flex flex-col justify-between gap-3 group transition-all duration-300 print:shadow-none`}
            >
              <div className="space-y-1">
                <span className={`text-[10px] font-mono block ${textSubtitleClass}`}>{skill.category}</span>
                <span className={`font-bold text-xs sm:text-sm group-hover:text-cyan-500 transition-colors ${textTitleClass}`}>
                  {skill.name}
                </span>
              </div>
              <div className="w-full bg-zinc-800/40 rounded-full h-1 print:hidden">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-emerald-500 h-1 rounded-full"
                  style={{ width: skill.category === "Technical Skills" ? "90%" : "75%" }}
                ></div>
              </div>
            </div>
          ))}
          {filteredSkills.length === 0 && (
            <div className="col-span-full py-8 text-center text-zinc-500 font-mono">
              No matching credentials found.
            </div>
          )}
        </div>
      </section>

      {/* Education & Language Grid */}
      <div className="max-w-6xl mx-auto px-6 py-12 w-full grid grid-cols-1 lg:grid-cols-3 gap-8 page-break-before">
        {/* Education Section */}
        <section className="lg:col-span-2 space-y-6">
          <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-3 ${textTitleClass}`}>
            <span className="h-8 w-1 rounded bg-cyan-500"></span>
            Education
          </h2>
          <div className="space-y-6">
            {education.map((edu, index) => (
              <div
                key={index}
                className={`${panelClass} rounded-xl p-5 sm:p-6 space-y-3 print:border-none print:shadow-none print:p-0`}
              >
                <div className="flex flex-wrap justify-between items-start gap-2">
                  <div>
                    <h3 className={`font-bold text-sm sm:text-base ${textTitleClass}`}>{edu.degree}</h3>
                    <p className={`text-xs font-semibold mt-0.5 ${textSubtitleClass}`}>{edu.institution}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-mono ${badgeClass}`}>
                    {edu.period}
                  </span>
                </div>
                <div className={`flex flex-wrap items-center justify-between text-xs font-mono pt-2 border-t ${borderClass} print:border-none print:pt-1`}>
                  <span className={textMutedClass}>{edu.location}</span>
                  <span className="text-emerald-500 font-bold">Score: {edu.score}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Languages & Extras */}
        <section className="space-y-6">
          <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-3 ${textTitleClass}`}>
            <span className="h-8 w-1 rounded bg-cyan-500"></span>
            Languages
          </h2>
          <div className={`${panelClass} rounded-xl p-6 space-y-4 print:border-none print:p-0`}>
            {languages.map((lang, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className={`font-bold ${textTitleClass}`}>{lang.name}</span>
                  <span className={`font-mono font-semibold ${textSubtitleClass}`}>{lang.level}</span>
                </div>
                <div className="w-full bg-zinc-800/40 rounded-full h-1.5 print:hidden">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-emerald-500 h-1.5 rounded-full"
                    style={{
                      width:
                        lang.level === "Native" ? "100%" :
                          lang.level === "Fluent" ? "90%" :
                            lang.level === "Intermediate" ? "65%" : "50%"
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Metrics */}
          <div className={`${panelClass} rounded-xl p-6 space-y-4 print:hidden`}>
            <h3 className={`font-bold text-xs uppercase tracking-wider font-mono ${textTitleClass}`}>Hiring Metrics</h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className={`p-3 rounded-xl border ${borderClass} bg-slate-500/5`}>
                <span className="block text-xl font-bold text-cyan-500">5+ Yrs</span>
                <span className={`text-[10px] font-mono ${textMutedClass}`}>Product & Eng</span>
              </div>
              <div className={`p-3 rounded-xl border ${borderClass} bg-slate-500/5`}>
                <span className="block text-xl font-bold text-emerald-500">2 Mon</span>
                <span className={`text-[10px] font-mono ${textMutedClass}`}>Notice Period</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Interactive Sandbox Console */}
      <section id="terminal" className="max-w-6xl mx-auto px-6 py-12 w-full print:hidden">
        <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight mb-6 flex items-center gap-3 ${textTitleClass}`}>
          <span className="h-8 w-1 rounded bg-cyan-500"></span>
          Interactive Query Console
        </h2>
        <div className="w-full bg-[#0d1117] rounded-xl overflow-hidden border border-zinc-800 shadow-2xl font-mono text-xs sm:text-sm">
          <div className="bg-[#161b22] px-4 py-2 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex gap-2">
              <div className="h-3 w-3 rounded-full bg-rose-500"></div>
              <div className="h-3 w-3 rounded-full bg-amber-500"></div>
              <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
            </div>
            <span className="text-zinc-400 text-xs font-mono">sandboxveera@query-box ~ bash</span>
          </div>
          <div className="p-4 space-y-2 h-56 overflow-y-auto bg-[#0d1117]">
            {terminalHistory.map((item, idx) => (
              <div
                key={idx}
                className={
                  item.type === "user" ? "text-cyan-400 animate-pulse" :
                    item.type === "error" ? "text-rose-400" :
                      item.type === "system" ? "text-zinc-400 font-semibold" :
                        "text-zinc-200"
                }
              >
                {item.text}
              </div>
            ))}
          </div>
          {/* Quick command buttons */}
          <div className="px-4 py-2 bg-[#090d13] border-t border-zinc-800 flex flex-wrap gap-2 items-center">
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Quick Query:</span>
            {["summary", "skills", "experience", "contact"].map(cmd => (
              <button
                key={cmd}
                onClick={() => executeQuickCommand(cmd)}
                className="px-2 py-1 rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-[10px] font-mono border border-cyan-500/20 cursor-pointer"
              >
                {cmd}
              </button>
            ))}
          </div>
          <form onSubmit={handleTerminalSubmit} className="flex border-t border-zinc-800 bg-[#090d13]">
            <span className="text-cyan-400 pl-4 py-3 select-none">$</span>
            <input
              type="text"
              value={terminalInput}
              onChange={(e) => setTerminalInput(e.target.value)}
              className="flex-1 bg-transparent px-2 py-3 focus:outline-none text-zinc-100 placeholder:text-zinc-500"
              placeholder="type 'help' or execute dynamic scripts..."
            />
          </form>
        </div>
      </section>

      {/* Recruiter Message Console */}
      <section id="contact" className="max-w-4xl mx-auto px-6 py-12 w-full print:hidden">
        <div className={`${panelClass} rounded-3xl p-6 sm:p-10 relative overflow-hidden`}>
          <div className="text-center space-y-2 mb-8">
            <h2 className={`text-2xl sm:text-3xl font-bold ${textTitleClass}`}>Direct Message Console</h2>
            <p className={`max-w-md mx-auto text-xs sm:text-sm ${textMutedClass}`}>
              Reach out directly to request interviews, check references, or review project fits.
            </p>
          </div>

          <div className="flex justify-center gap-4 mb-8">
            <button
              type="button"
              onClick={() => setCommunicationMode("email")}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all flex items-center gap-2 cursor-pointer ${communicationMode === "email"
                  ? "bg-cyan-500 text-slate-950 shadow-md"
                  : (isDark ? "bg-white/5 text-zinc-400 hover:bg-white/10" : "bg-slate-100 text-slate-600 hover:bg-slate-200")
                }`}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email Channel
            </button>
            <button
              type="button"
              onClick={() => setCommunicationMode("whatsapp")}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all flex items-center gap-2 cursor-pointer ${communicationMode === "whatsapp"
                  ? "bg-emerald-500 text-slate-950 shadow-md"
                  : (isDark ? "bg-white/5 text-zinc-400 hover:bg-white/10" : "bg-slate-100 text-slate-600 hover:bg-slate-200")
                }`}
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.489 0 9.951-4.447 9.954-9.899.001-2.64-1.019-5.123-2.873-6.981-1.855-1.857-4.329-2.88-6.963-2.881-5.5 0-9.96 4.448-9.963 9.901-.001 1.869.52 3.693 1.509 5.298l-.99 3.613 3.73-.977zm11.362-7.054c-.302-.15-1.785-.88-2.062-.98-.276-.1-.478-.15-.678.15-.2.3-.778.98-.95 1.18-.172.2-.345.224-.648.075-.302-.15-1.276-.47-2.43-1.499-.896-.8-1.5-1.787-1.677-2.088-.177-.3-.018-.463.13-.61.137-.133.302-.35.454-.524.15-.174.2-.3.302-.5.101-.2.05-.376-.026-.525-.075-.15-.678-1.636-.93-2.247-.244-.588-.492-.51-.678-.52-.175-.007-.375-.009-.575-.009-.2 0-.527.075-.803.376-.277.3-1.055 1.03-1.055 2.515s1.08 2.916 1.23 3.116c.15.2 2.126 3.248 5.15 4.554.72.31 1.28.497 1.72.637.72.23 1.38.197 1.9.12.58-.087 1.787-.73 2.037-1.436.25-.706.25-1.31.175-1.436-.075-.12-.276-.197-.577-.347z" />
              </svg>
              WhatsApp Channel
            </button>
          </div>

          {formSubmitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="h-16 w-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-3xl">
                ✓
              </div>
              <h3 className={`text-xl font-bold ${textTitleClass}`}>Transmission Successful</h3>
              <p className={`text-xs max-w-sm mx-auto ${textMutedClass}`}>
                Your message has been processed successfully. Veerabadran will get in touch with you shortly.
              </p>
              <button
                onClick={() => {
                  setContactForm(prev => ({ ...prev, subject: "", message: "" }));
                  setFormSubmitted(false);
                }}
                className={`mt-4 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer ${isDark ? "bg-white/5 border border-zinc-850 hover:bg-white/10" : "bg-slate-100 border border-slate-200 hover:bg-slate-200"
                  }`}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className={`text-[10px] uppercase tracking-wider font-mono ${textMutedClass}`}>Your Name</label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className={`w-full border rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all ${inputClass}`}
                    placeholder="Recruiter Name"
                  />
                </div>
                <div className="space-y-1">
                  <label className={`text-[10px] uppercase tracking-wider font-mono ${textMutedClass}`}>Your Email</label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className={`w-full border rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all ${inputClass}`}
                    placeholder="recruiter@agency.com"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className={`text-[10px] uppercase tracking-wider font-mono ${textMutedClass}`}>Subject</label>
                <input
                  type="text"
                  required
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  className={`w-full border rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all ${inputClass}`}
                  placeholder="Opportunity for Lead Engineer position"
                />
              </div>
              <div className="space-y-1">
                <label className={`text-[10px] uppercase tracking-wider font-mono ${textMutedClass}`}>Message</label>
                <textarea
                  required
                  rows={4}
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  className={`w-full border rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all resize-none ${inputClass}`}
                  placeholder="Describe details about the role/budget..."
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className={`w-full py-3 rounded-xl font-bold transition-all shadow-md disabled:opacity-50 cursor-pointer text-slate-950 ${communicationMode === "whatsapp"
                    ? "bg-emerald-500 hover:bg-emerald-600"
                    : "bg-cyan-600 hover:bg-cyan-700"
                  }`}
              >
                {submitting ? "Processing Link..." : communicationMode === "whatsapp" ? "Launch WhatsApp Chat" : "Launch Email Client"}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className={`mt-auto border-t py-8 px-6 text-center text-[10px] font-mono ${isDark ? "border-zinc-800 bg-slate-950 text-zinc-500" : "border-slate-200 bg-slate-100 text-slate-500"}`}>
        <p>© {new Date().getFullYear()} Veerabadran V. Built with Next.js & Tailwind CSS v4.</p>
        <p className="mt-1">Dynamic Recruiter Console Engine Loaded in Real-Time</p>
      </footer>

      {/* PDF Templates selector Modal */}
      {showPDFModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`w-full max-w-lg rounded-2xl p-6 border ${panelClass} relative shadow-2xl`}>
            <button
              onClick={() => setShowPDFModal(false)}
              className="absolute top-4 right-4 text-zinc-550 hover:text-zinc-400 font-mono text-xs cursor-pointer"
            >
              ✕ Close
            </button>
            <h3 className={`text-xl font-bold mb-1 ${textTitleClass}`}>Select PDF Resume Style</h3>
            <p className={`text-xs mb-6 ${textMutedClass}`}>
              Choose a design template optimized for A4 paper and clean print output.
            </p>

            <div className="space-y-3">
              {[
                { id: "classic", name: "Classic Corporate", desc: "Traditional academic format in serif typography." },
                { id: "modern-tech", name: "Modern Tech Highlight", desc: "Cyan/slate highlights, perfect for technical engineering roles." },
                { id: "executive", name: "Executive Leader", desc: "Polished two-column indigo format for leadership reviews." },
                { id: "compact", name: "Single-Page Compact", desc: "Highly dense spacing designed to fit everything onto 1 sheet." },
                { id: "creative", name: "Creative Left-Sidebar", desc: "Sophisticated grey-panel layout highlighting stack lists." }
              ].map((template) => (
                <button
                  key={template.id}
                  onClick={() => {
                    window.open(`${basePath}/templates/${template.id}?v=1.0.4`, "_blank");
                    setShowPDFModal(false);
                  }}
                  className={`w-full text-left p-4 rounded-xl border flex items-center justify-between group transition-all cursor-pointer ${isDark
                      ? "bg-white/5 border-zinc-800 hover:bg-zinc-800/40 hover:border-cyan-500/50"
                      : "bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-cyan-500/50"
                    }`}
                >
                  <div className="space-y-0.5">
                    <span className={`font-semibold text-sm ${textTitleClass} group-hover:text-cyan-500 transition-colors`}>
                      {template.name}
                    </span>
                    <p className={`text-[10px] ${textMutedClass}`}>
                      {template.desc}
                    </p>
                  </div>
                  <span className={`text-xs ${textSubtitleClass} font-mono group-hover:translate-x-1 transition-transform`}>
                    ➔
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Photo Lightbox Modal with Copy Protection */}
      {showPhotoLightbox && (
        <div 
          onClick={() => setShowPhotoLightbox(false)}
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 cursor-zoom-out"
        >
          <div className="relative max-w-sm w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 p-1.5 bg-zinc-950 flex flex-col justify-center animate-fade-in">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowPhotoLightbox(false);
              }}
              className="absolute top-4 right-4 text-white/70 hover:text-white bg-black/40 hover:bg-black/60 rounded-full h-8 w-8 flex items-center justify-center font-mono text-sm cursor-pointer z-10"
            >
              ✕
            </button>
            <img
              src={profileFullSrc}
              alt={personal.name}
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
              onClick={(e) => e.stopPropagation()}
              className="w-full h-auto object-contain rounded-xl select-none pointer-events-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}
