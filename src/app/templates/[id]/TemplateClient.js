"use client";

import React, { useEffect } from "react";
import resumeData from "../../../data/resume.json";

export default function TemplateClient({ id }) {
  const { personal, workExperience, education, skills, languages } = resumeData;

  const handleBackToSite = (e) => {
    e.preventDefault();
    const base = process.env.NODE_ENV === 'production' ? '/portfolio' : '';
    window.location.href = base ? `https://veerabadran-sellinall.github.io${base}/` : '/';
  };

  // Auto trigger browser print preview on load
  useEffect(() => {
    const timer = setTimeout(() => {
      window.print();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // 1. Classic corporate black and white style
  const renderClassic = () => (
    <div className="max-w-4xl mx-auto p-8 bg-white text-black font-serif text-sm">
      <div className="text-center border-b-2 border-black pb-4 mb-6">
        <h1 className="text-3xl font-bold uppercase tracking-wide">{personal.name}</h1>
        <p className="text-sm italic mt-1">{personal.title}</p>
        <p className="text-xs mt-2">
          {personal.location} | Email: {personal.email} | Phone: {personal.phone}
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-base font-bold uppercase tracking-wider border-b border-black pb-1 mb-2">Professional Summary</h2>
        <p className="text-xs leading-relaxed text-justify">{personal.summary}</p>
      </div>

      <div className="mb-6">
        <h2 className="text-base font-bold uppercase tracking-wider border-b border-black pb-1 mb-2">Work Experience</h2>
        {workExperience.map((exp, idx) => (
          <div key={idx} className="mb-4">
            <div className="flex justify-between font-bold text-xs">
              <span>{exp.role} - {exp.company}</span>
              <span>{exp.period}</span>
            </div>
            <p className="text-[11px] italic text-zinc-650 mb-1">{exp.location} | {exp.type}</p>
            <ul className="list-disc pl-4 space-y-1 mt-1.5">
              {exp.responsibilities.map((resp, rIdx) => (
                <li key={rIdx} className="text-xs leading-relaxed text-justify">
                  <strong className="text-black">{resp.title}:</strong> {resp.description}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mb-6 page-break-before">
        <h2 className="text-base font-bold uppercase tracking-wider border-b border-black pb-1 mb-2">Technical Skills & Expertise</h2>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(skills).map(([category, list]) => (
            <div key={category}>
              <h3 className="font-bold text-xs uppercase">{category}</h3>
              <p className="text-xs text-zinc-700 mt-1">{list.join(", ")}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-base font-bold uppercase tracking-wider border-b border-black pb-1 mb-2">Education</h2>
        {education.map((edu, idx) => (
          <div key={idx} className="mb-3 text-xs">
            <div className="flex justify-between font-bold">
              <span>{edu.degree}</span>
              <span>{edu.period}</span>
            </div>
            <div className="flex justify-between text-zinc-700 text-[11px]">
              <span>{edu.institution} - {edu.location} ({edu.type})</span>
              <span className="font-bold text-black">Score: {edu.score}</span>
            </div>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-base font-bold uppercase tracking-wider border-b border-black pb-1 mb-2">Languages</h2>
        <p className="text-xs">
          {languages.map(lang => `${lang.name} (${lang.level})`).join(" | ")}
        </p>
      </div>
    </div>
  );

  // 2. Modern tech style (Teal highlights, sans-serif typography)
  const renderModernTech = () => (
    <div className="max-w-4xl mx-auto p-10 bg-white text-zinc-800 font-sans text-sm">
      <div className="border-l-4 border-cyan-500 pl-4 mb-8">
        <h1 className="text-4xl font-extrabold text-zinc-900 tracking-tight">{personal.name}</h1>
        <p className="text-sm font-semibold text-cyan-600 font-mono mt-1">{personal.title}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500 mt-2 font-mono">
          <span>📍 {personal.location}</span>
          <span>✉️ {personal.email}</span>
          <span>📞 {personal.phone}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-600 font-mono mb-2">About Me</h2>
            <p className="text-xs leading-relaxed text-zinc-650">{personal.summary}</p>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-600 font-mono mb-4">Professional History</h2>
            {workExperience.map((exp, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-zinc-900 text-sm">{exp.role}</h3>
                  <span className="text-xs font-mono text-zinc-500">{exp.period}</span>
                </div>
                <div className="flex justify-between text-xs font-mono text-cyan-600">
                  <span>{exp.company} | {exp.location}</span>
                  <span>{exp.type} (Notice: {exp.noticePeriod})</span>
                </div>
                <ul className="space-y-2 pl-2 border-l border-cyan-100 mt-2">
                  {exp.responsibilities.map((resp, rIdx) => (
                    <li key={rIdx} className="text-xs text-zinc-650">
                      <strong className="text-zinc-800 block text-[11px]">{resp.title}</strong>
                      {resp.description}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-zinc-50 p-5 rounded-xl border border-zinc-100">
            <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-600 font-mono mb-3">Core Stack</h2>
            <div className="space-y-3">
              {Object.entries(skills).map(([category, list]) => (
                <div key={category} className="space-y-1">
                  <h4 className="text-[10px] uppercase font-bold text-zinc-500">{category}</h4>
                  <div className="flex flex-wrap gap-1">
                    {list.map((skill, sIdx) => (
                      <span key={sIdx} className="text-[10px] bg-white border border-zinc-200 px-2 py-0.5 rounded font-mono text-zinc-700">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-zinc-50 p-5 rounded-xl border border-zinc-100">
            <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-600 font-mono mb-3">Education</h2>
            <div className="space-y-4">
              {education.map((edu, idx) => (
                <div key={idx} className="text-xs space-y-1">
                  <h4 className="font-bold text-zinc-900">{edu.degree}</h4>
                  <p className="text-[11px] text-zinc-500 font-mono">{edu.institution} | {edu.period}</p>
                  <p className="text-[10px] text-cyan-600 font-bold">Score: {edu.score}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-zinc-50 p-5 rounded-xl border border-zinc-100">
            <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-600 font-mono mb-3">Languages</h2>
            <div className="space-y-2">
              {languages.map((lang, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-zinc-700">{lang.name}</span>
                  <span className="text-[10px] font-mono text-zinc-500">{lang.level}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // 3. Executive Leader layout (Indigo corporate header, structured margins)
  const renderExecutive = () => (
    <div className="max-w-4xl mx-auto p-12 bg-white text-slate-800 font-sans text-sm">
      <div className="text-center pb-6 border-b border-slate-200 mb-6">
        <h1 className="text-3xl font-extrabold text-indigo-900 tracking-tight">{personal.name}</h1>
        <p className="text-xs uppercase tracking-widest text-indigo-600 font-bold mt-1.5">{personal.title}</p>
        <div className="flex justify-center gap-6 text-xs text-slate-500 mt-3">
          <span>📍 {personal.location}</span>
          <span>•</span>
          <span>✉️ {personal.email}</span>
          <span>•</span>
          <span>📞 {personal.phone}</span>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-900 border-b border-indigo-200 pb-1 mb-2.5">Executive Summary</h2>
        <p className="text-xs leading-relaxed text-justify text-slate-600">{personal.summary}</p>
      </div>

      <div className="mb-6">
        <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-900 border-b border-indigo-200 pb-1 mb-3.5">Professional Experience</h2>
        {workExperience.map((exp, idx) => (
          <div key={idx} className="mb-5">
            <div className="flex justify-between items-baseline font-bold text-xs text-indigo-950">
              <span className="text-sm">{exp.role}</span>
              <span className="font-normal text-slate-500">{exp.period}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-600 mt-0.5">
              <span>{exp.company} | {exp.location}</span>
              <span className="italic">{exp.type} (Notice: {exp.noticePeriod})</span>
            </div>
            <ul className="list-disc pl-4 space-y-2 mt-3 text-xs text-slate-650">
              {exp.responsibilities.map((resp, rIdx) => (
                <li key={rIdx} className="text-justify">
                  <strong className="text-indigo-950 block text-[11px]">{resp.title}</strong>
                  {resp.description}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-8 page-break-before pt-4">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-900 border-b border-indigo-200 pb-1 mb-3">Skills Inventory</h2>
          <div className="space-y-3">
            {Object.entries(skills).map(([category, list]) => (
              <div key={category} className="text-xs">
                <span className="font-bold text-indigo-900 block">{category}</span>
                <span className="text-slate-650 text-[11px] mt-0.5 block">{list.join(", ")}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-900 border-b border-indigo-200 pb-1 mb-3">Academic credentials</h2>
            {education.map((edu, idx) => (
              <div key={idx} className="text-xs mb-3">
                <div className="flex justify-between font-bold text-indigo-950">
                  <span>{edu.degree}</span>
                  <span className="font-normal text-slate-500 text-[10px]">{edu.period}</span>
                </div>
                <p className="text-slate-650 text-[11px] mt-0.5">{edu.institution} - {edu.location}</p>
                <p className="text-indigo-600 font-bold text-[10px] mt-0.5">Score: {edu.score}</p>
              </div>
            ))}
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-900 border-b border-indigo-200 pb-1 mb-2">Languages</h2>
            <p className="text-xs text-slate-655">
              {languages.map(lang => `${lang.name} (${lang.level})`).join(" | ")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // 4. Compact single-page style (very tight spacing, small fonts, optimized for 1 page)
  const renderCompact = () => (
    <div className="max-w-4xl mx-auto p-6 bg-white text-zinc-900 font-sans text-xs">
      <div className="flex justify-between items-center border-b border-zinc-300 pb-3 mb-4">
        <div>
          <h1 className="text-2xl font-black uppercase text-zinc-900">{personal.name}</h1>
          <p className="text-xs font-bold text-cyan-600 mt-0.5 uppercase tracking-wide">{personal.title}</p>
        </div>
        <div className="text-right text-[10px] text-zinc-655 font-mono space-y-0.5">
          <p>{personal.location}</p>
          <p>{personal.email} | {personal.phone}</p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-[11px] leading-relaxed text-zinc-655 text-justify">{personal.summary}</p>
      </div>

      <div className="mb-4">
        <h2 className="text-xs font-bold uppercase tracking-wider border-b border-zinc-300 pb-0.5 mb-2 text-zinc-800">Experience Highlights</h2>
        {workExperience.map((exp, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex justify-between font-bold text-zinc-900">
              <span>{exp.role} @ {exp.company}</span>
              <span className="font-mono font-normal text-zinc-500 text-[10px]">{exp.period}</span>
            </div>
            <p className="text-[10px] text-zinc-500">{exp.location} | {exp.type} | Notice: {exp.noticePeriod}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 mt-1 pl-2 border-l border-zinc-200">
              {exp.responsibilities.map((resp, rIdx) => (
                <div key={rIdx} className="text-[10px] leading-tight text-zinc-655">
                  <strong className="text-zinc-800">{resp.title}:</strong> {resp.description}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6 pt-2 border-t border-zinc-100">
        <div className="col-span-2">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-zinc-300 pb-0.5 mb-2 text-zinc-800">Technical Stack</h2>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(skills).map(([category, list]) => (
              <div key={category} className="text-[10px]">
                <strong className="text-zinc-850 block text-[9px] uppercase tracking-wide">{category}</strong>
                <span className="text-zinc-655 mt-0.5 block">{list.join(", ")}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider border-b border-zinc-300 pb-0.5 mb-2 text-zinc-800">Education</h2>
            {education.map((edu, idx) => (
              <div key={idx} className="text-[10px] mb-1.5">
                <div className="flex justify-between font-bold text-zinc-900">
                  <span>{edu.degree.replace("Bachelor of Technology in ", "B.Tech ").replace("Master of Technology in ", "M.Tech ")}</span>
                  <span className="font-normal text-zinc-500 text-[8px]">{edu.period.split(" ").slice(-1)[0]}</span>
                </div>
                <p className="text-zinc-550 text-[9px]">{edu.institution} (Score: {edu.score})</p>
              </div>
            ))}
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider border-b border-zinc-300 pb-0.5 mb-1.5 text-zinc-800">Languages</h2>
            <p className="text-[10px] text-zinc-655 font-mono">
              {languages.map(lang => `${lang.name} (${lang.level.charAt(0)})`).join(" | ")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // 5. Creative Left Sidebar layout
  const renderCreative = () => (
    <div className="space-y-8 print:space-y-0 bg-zinc-100 print:bg-white">
      {/* PAGE 1 */}
      <div className="max-w-4xl mx-auto bg-white flex border border-zinc-200 rounded-lg overflow-hidden text-zinc-800 font-sans text-sm shadow-xl h-[1120px] print:h-[296mm] print:border-none print:shadow-none print:rounded-none">
        {/* Left Sidebar */}
        <div className="w-64 bg-zinc-900 text-zinc-355 p-6 flex flex-col justify-between select-none">
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="h-14 w-14 bg-cyan-500 rounded-2xl flex items-center justify-center font-mono font-extrabold text-zinc-950 text-xl">
                VV
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight leading-tight">{personal.name}</h1>
                <p className="text-[10px] text-cyan-400 font-mono mt-1">{personal.title}</p>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-zinc-800 text-[11px] font-mono leading-relaxed">
              <h3 className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">Contact</h3>
              <p className="text-zinc-405">📍 {personal.location.split(",")[0]}, India</p>
              <p className="text-zinc-405">✉️ {personal.email}</p>
              <p className="text-zinc-405">📞 {personal.phone}</p>
            </div>

            <div className="space-y-3 pt-4 border-t border-zinc-800">
              <h3 className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold font-mono">Technical Stack</h3>
              <p className="text-[11px] text-zinc-400 leading-relaxed">{skills["Technical Skills"].join(", ")}</p>
            </div>
            
            <div className="space-y-3 pt-4 border-t border-zinc-800">
              <h3 className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold font-mono">Project Mgmt</h3>
              <p className="text-[11px] text-zinc-400 leading-relaxed">{skills["Project Management"].join(", ")}</p>
            </div>
          </div>
          <div className="text-[9px] font-mono text-zinc-600">Page 1 of 2</div>
        </div>

        {/* Right Content */}
        <div className="flex-1 p-8 space-y-6 bg-white text-zinc-850">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-600 font-mono border-b border-zinc-200 pb-1 mb-2">About Veerabadran</h2>
            <p className="text-xs leading-relaxed text-zinc-650 text-justify">{personal.summary}</p>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-600 font-mono border-b border-zinc-200 pb-1 mb-3">Employment Record</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-zinc-900 text-sm">{workExperience[0].role}</h3>
                <span className="text-[10px] font-mono text-zinc-500">{workExperience[0].period}</span>
              </div>
              <div className="flex justify-between text-xs font-mono text-cyan-600">
                <span>{workExperience[0].company} | {workExperience[0].location}</span>
                <span>{workExperience[0].type}</span>
              </div>
              
              {/* Show first 4 responsibilities on Page 1 */}
              <ul className="space-y-2 pl-3 border-l-2 border-cyan-500/20 mt-2 text-xs text-zinc-600">
                {workExperience[0].responsibilities.slice(0, 4).map((resp, rIdx) => (
                  <li key={rIdx} className="text-justify">
                    <strong className="text-zinc-800 block text-[11px]">{resp.title}</strong>
                    {resp.description}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* PAGE 2 */}
      <div className="max-w-4xl mx-auto bg-white flex border border-zinc-200 rounded-lg overflow-hidden text-zinc-800 font-sans text-sm shadow-xl h-[1120px] print:h-[296mm] print:border-none print:shadow-none print:rounded-none page-break-before">
        {/* Left Sidebar */}
        <div className="w-64 bg-zinc-900 text-zinc-355 p-6 flex flex-col justify-between select-none">
          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold font-mono">Soft Skills</h3>
              <p className="text-[11px] text-zinc-400 leading-relaxed">{skills["Soft Skills"].join(", ")}</p>
            </div>
            
            <div className="space-y-3 pt-4 border-t border-zinc-800">
              <h3 className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold font-mono">Tools & Testing</h3>
              <p className="text-[11px] text-zinc-400 leading-relaxed">{skills["Tools"].join(", ")}</p>
            </div>

            <div className="space-y-3 pt-4 border-t border-zinc-800">
              <h3 className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold font-mono">Languages</h3>
              <div className="space-y-1.5">
                {languages.map((lang, lIdx) => (
                  <div key={lIdx} className="flex justify-between text-[11px] text-zinc-400">
                    <span>{lang.name}</span>
                    <span className="text-[9px] font-mono text-zinc-500">{lang.level}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="text-[9px] font-mono text-zinc-600">Page 2 of 2</div>
        </div>

        {/* Right Content */}
        <div className="flex-1 p-8 space-y-6 bg-white text-zinc-850">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-600 font-mono border-b border-zinc-200 pb-1 mb-3">Employment Record (Cont.)</h2>
            {/* Show last 4 responsibilities on Page 2 */}
            <ul className="space-y-2 pl-3 border-l-2 border-cyan-500/20 mt-2 text-xs text-zinc-650">
              {workExperience[0].responsibilities.slice(4).map((resp, rIdx) => (
                <li key={rIdx} className="text-justify">
                  <strong className="text-zinc-855 block text-[11px]">{resp.title}</strong>
                  {resp.description}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-600 font-mono border-b border-zinc-200 pb-1.5 mb-3">Academic Credentials</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {education.map((edu, idx) => (
                <div key={idx} className="text-xs space-y-0.5">
                  <div className="font-bold text-zinc-900 leading-tight">
                    {edu.degree}
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-zinc-500 font-mono">
                    <span>{edu.period}</span>
                    <span>{edu.location}</span>
                  </div>
                  <p className="text-zinc-655 text-[11px] leading-snug">{edu.institution} ({edu.type})</p>
                  <p className="text-cyan-600 font-bold text-[10px]">Score: {edu.score}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Selector mapping
  const renderTemplate = () => {
    switch (id) {
      case "classic":
        return renderClassic();
      case "modern-tech":
        return renderModernTech();
      case "executive":
        return renderExecutive();
      case "compact":
        return renderCompact();
      case "creative":
        return renderCreative();
      default:
        return renderClassic();
    }
  };

  return (
    <div className="min-h-screen bg-zinc-100 py-10 px-4 print:py-0 print:px-0 print:bg-white">
      {/* Dynamic Floating Action Header - hidden when printing */}
      <div className="max-w-4xl mx-auto bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-xl flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 border border-white/5 print:hidden">
        <div>
          <h2 className="text-sm font-bold font-mono text-cyan-400">PDF Print Console</h2>
          <p className="text-[10px] text-zinc-400">Select template style & click Print below. (Fits standard A4 paper sizes)</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleBackToSite}
            className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-mono transition-all cursor-pointer"
          >
            ← Back to Site
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-slate-950 text-xs font-mono font-bold transition-all shadow-md cursor-pointer"
          >
            Print / Save PDF
          </button>
        </div>
      </div>

      <div className="shadow-2xl print:shadow-none bg-white max-w-4xl mx-auto rounded-xl overflow-hidden">
        {renderTemplate()}
      </div>
    </div>
  );
}
