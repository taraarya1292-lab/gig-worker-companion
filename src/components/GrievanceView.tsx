"use client";

import { useState } from "react";
import { channelDetail, channelLabel, knownChannels } from "@/lib/channels";
import { evidenceStarters, localFacts, localLetter, readRupeeAmount, schemeIdsFor } from "@/lib/resolution";
import { SCHEMES } from "@/lib/schemes";
import { isoDaysAgo, isoPlusDays, todayISO } from "@/lib/storage";
import { t } from "@/lib/text";
import type { CaseStatus, Earning, Profile, SavedDocument, WorkCase } from "@/lib/types";
import { useGuide } from "@/lib/useGuide";
import { Icon } from "@/components/Icon";
import { SpeakButton } from "@/components/SpeakButton";

export function GrievanceView({
  profile,
  earnings,
  documentNote,
  cases,
  draft,
  onSaveCase,
  onUpdateCase,
  onClearDraft,
}: {
  profile: Profile;
  earnings: Earning[];
  documentNote: SavedDocument | null;
  cases: WorkCase[];
  draft: string;
  onSaveCase: (workCase: WorkCase) => void;
  onUpdateCase: (workCase: WorkCase) => void;
  onClearDraft: () => void;
}) {
  const language = profile.language;
  const [problem, setProblem] = useState(draft);
  const [useRecords, setUseRecords] = useState(true);
  const [askedAmount, setAskedAmount] = useState("");
  const [letter, setLetter] = useState("");
  const [letterSource, setLetterSource] = useState<"gemini" | "records" | "">("");
  const [plan, setPlan] = useState<string[]>([]);
  const [assumptions, setAssumptions] = useState<string[]>([]);
  const [evidence, setEvidence] = useState<string[]>([]);
  const [checkedEvidence, setCheckedEvidence] = useState<string[]>([]);
  const [channelIds, setChannelIds] = useState<string[]>([]);
  const [missing, setMissing] = useState<string[]>([]);
  const [active, setActive] = useState<WorkCase | null>(null);
  const [savedNote, setSavedNote] = useState<string | null>(null);
  const guide = useGuide();
  const recent = earnings.filter((entry) => entry.date >= isoDaysAgo(6));
  const shared = useRecords ? recent : [];
  const facts = localFacts(shared);
  const needsAmount = problem.trim().length >= 10 && readRupeeAmount(problem) == null && askedAmount.trim() === "";
  const schemes = SCHEMES.filter((scheme) => schemeIdsFor(profile.role).includes(scheme.id));

  async function resolve() {
    setSavedNote(null);
    const detail = askedAmount.trim()
      ? `${problem.trim()}\nAmount the worker added: ₹${askedAmount.trim()}.`
      : problem.trim();
    const result = await guide.ask({
      task: "resolve",
      profile,
      earnings: shared,
      dispute: detail,
      documentText: documentNote ? `${documentNote.excerpt}\n${documentNote.summary}` : "",
    });
    const fallback = localLetter({ role: profile.role, state: profile.state, problem: detail, entries: shared });
    if (result) {
      setLetter(result.letter || result.summary);
      setLetterSource("gemini");
      setPlan(result.plan.length > 0 ? result.plan : result.points);
      setAssumptions(result.assumptions);
      setEvidence(result.evidence.length > 0 ? result.evidence : evidenceStarters(language));
      setChannelIds(result.channels);
      setMissing(result.missing);
    } else {
      setLetter(fallback);
      setLetterSource("records");
      setPlan([]);
      setAssumptions([]);
      setEvidence(evidenceStarters(language));
      setChannelIds([]);
      setMissing([]);
    }
    setCheckedEvidence([]);
    onClearDraft();
  }

  function saveCase() {
    const workCase: WorkCase = {
      id: crypto.randomUUID(),
      created: todayISO(),
      followUp: isoPlusDays(3),
      status: "open",
      problem: problem.trim(),
      facts,
      assumptions,
      plan,
      letter,
      evidence: checkedEvidence.length > 0 ? checkedEvidence : evidence,
      notes: "",
      sample: recent.some((entry) => entry.id.startsWith("demo-")),
    };
    onSaveCase(workCase);
    setActive(workCase);
    setSavedNote(t(language, "Case saved on this phone. Nothing was submitted.", "केस इस फोन पर सेव हुआ। कहीं जमा नहीं हुआ।"));
  }

  const channels = knownChannels(channelIds);

  return (
    <div className="grid gap-4">
      <section className="rounded-3xl border border-[#e8e2d6] bg-white p-5 shadow-[0_12px_32px_rgba(47,97,84,0.06)]">
        <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-[#3d7a64]">
          <Icon name="path" />
          {t(language, "Problem to resolution", "समस्या से समाधान")}
        </p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#2f6154]">{t(language, "Fix a work problem", "काम की समस्या सुलझाएँ")}</h2>
        <p className="mt-2 text-base leading-7">
          {t(language, "Describe it once. Sathi AI uses your records only if you allow it, then prepares a letter you can edit.", "एक बार लिखें। साथी AI आपके रिकॉर्ड तभी देखेगा जब आप अनुमति देंगे, फिर एक पत्र तैयार करेगा जिसे आप बदल सकते हैं।")}
        </p>
      </section>

      {cases.length > 0 && (
        <section className="rounded-2xl border border-[#e8e2d6] bg-white p-4">
          <h2 className="text-xl font-semibold">{t(language, "Saved cases", "सेव किए केस")}</h2>
          <ul className="mt-2 grid gap-2">
            {cases.map((item) => (
              <li key={item.id}>
                <button type="button" onClick={() => setActive(item)} className="min-h-12 w-full rounded-xl bg-[#f3efe6] px-3 text-left text-base">
                  <span className="font-semibold">{item.problem.slice(0, 80)}</span>
                  <span className="mt-1 block text-sm text-[#66716c]">{item.status} · {t(language, "Follow up", "फॉलो अप")} {item.followUp}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {active && (
        <CaseEditor
          language={language}
          workCase={active}
          onChange={(next) => {
            setActive(next);
            onUpdateCase(next);
          }}
        />
      )}

      <section className="rounded-2xl border border-[#e8e2d6] bg-white p-4">
        <label className="block text-base font-semibold" htmlFor="problem">
          {t(language, "What went wrong?", "क्या गलत हुआ?")}
          <textarea id="problem" value={problem} maxLength={1000} rows={5} onChange={(event) => setProblem(event.target.value)} className="mt-1 w-full rounded-xl border border-[#ddd6c8] px-3 py-2 text-lg" />
        </label>
        <SpeakButton language={language} onText={(spoken) => setProblem((current) => `${current} ${spoken}`.trim())} />
        {needsAmount && (
          <label className="mt-3 block text-base font-semibold" htmlFor="missing-amount">
            {t(language, "How many rupees were taken or missing?", "कितने रुपये कटे या कम मिले?")}
            <input id="missing-amount" inputMode="numeric" value={askedAmount} onChange={(event) => setAskedAmount(event.target.value)} className="mt-1 min-h-12 w-full rounded-xl border border-[#ddd6c8] px-3 text-lg" />
          </label>
        )}
        <label className="mt-3 flex min-h-12 items-center gap-3 text-base">
          <input type="checkbox" className="h-6 w-6" checked={useRecords} onChange={(event) => setUseRecords(event.target.checked)} />
          {t(language, "Use my saved earnings from the last 7 days", "पिछले 7 दिन की सेव कमाई इस्तेमाल करें")} ({recent.length})
        </label>
        <button type="button" disabled={problem.trim().length < 10 || needsAmount || guide.loading} onClick={resolve} className="mt-3 min-h-12 w-full rounded-xl bg-[#3d5c52] text-lg font-semibold text-white disabled:opacity-50">
          {guide.loading ? t(language, "Asking Gemini…", "Gemini से पूछ रहे हैं…") : t(language, "Build a resolution", "समाधान तैयार करें")}
        </button>
        {guide.error && <p role="alert" className="mt-3 rounded-xl bg-[#fdeeee] px-3 py-2 text-base text-[#9a4a4a]">{guide.error}</p>}
      </section>

      {letter && (
        <section className="grid gap-3 rounded-2xl border border-[#d5eadf] bg-[#f4faf6] p-4" aria-live="polite">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#3d7a64]">
            {letterSource === "gemini"
              ? t(language, "Gemini draft — edit before you use it", "Gemini का मसौदा — इस्तेमाल से पहले बदलें")
              : t(language, "Draft from your records — Gemini did not write this", "आपके रिकॉर्ड से मसौदा — इसे Gemini ने नहीं लिखा")}
          </p>
          <h2 className="text-xl font-semibold">{t(language, "Known from your records", "आपके रिकॉर्ड से पता")}</h2>
          <ul className="list-disc space-y-1 pl-5 text-base">{facts.map((fact) => <li key={fact}>{fact}</li>)}</ul>
          {assumptions.length > 0 && (
            <>
              <h2 className="text-xl font-semibold">{t(language, "Not confirmed", "पुष्टि नहीं हुई")}</h2>
              <ul className="list-disc space-y-1 pl-5 text-base">{assumptions.map((item) => <li key={item}>{item}</li>)}</ul>
            </>
          )}
          {plan.length > 0 && (
            <>
              <h2 className="text-xl font-semibold">{t(language, "What to do", "क्या करें")}</h2>
              <ol className="list-decimal space-y-1 pl-5 text-base">{plan.map((item) => <li key={item}>{item}</li>)}</ol>
            </>
          )}
          {missing.length > 0 && (
            <p className="text-base"><span className="font-semibold">{t(language, "Still missing: ", "अभी नहीं पता: ")}</span>{missing.join(" ")}</p>
          )}
          <label className="text-base font-semibold" htmlFor="letter">
            {t(language, "Complaint you can edit", "शिकायत जिसे आप बदल सकते हैं")}
            <textarea id="letter" value={letter} rows={8} onChange={(event) => setLetter(event.target.value)} className="mt-1 w-full rounded-xl border border-[#ddd6c8] bg-white px-3 py-2 text-lg" />
          </label>
          <h2 className="text-xl font-semibold">{t(language, "Evidence to gather", "जुटाने वाले सबूत")}</h2>
          <ul className="grid gap-2">
            {evidence.map((item) => (
              <li key={item}>
                <label className="flex min-h-12 items-center gap-3 text-base">
                  <input type="checkbox" className="h-6 w-6" checked={checkedEvidence.includes(item)} onChange={() => setCheckedEvidence((current) => current.includes(item) ? current.filter((value) => value !== item) : [...current, item])} />
                  {item}
                </label>
              </li>
            ))}
          </ul>
          <h2 className="text-xl font-semibold">{t(language, "Where you can take this", "इसे कहाँ ले जाएँ")}</h2>
          <ul className="grid gap-2">
            {channels.map((channel) => (
              <li key={channel.id} className="rounded-xl bg-white p-3 text-base">
                <p className="font-semibold">{channelLabel(channel, language)}</p>
                <p>{channelDetail(channel, language)}</p>
                {channel.url && <a className="mt-1 inline-block font-semibold text-[#3d7a64] underline" href={channel.url} target="_blank" rel="noopener noreferrer">{channel.url}</a>}
              </li>
            ))}
          </ul>
          <h2 className="text-xl font-semibold">{t(language, "Schemes worth checking", "जाँचने लायक योजनाएँ")}</h2>
          <p className="text-base text-[#66716c]">{t(language, "These are not a decision that you qualify. No verification date is stored here.", "इसका मतलब यह नहीं कि आप योग्य हैं। यहाँ कोई जाँच की तारीख सेव नहीं है।")}</p>
          <ul className="grid gap-2">
            {schemes.map((scheme) => (
              <li key={scheme.id} className="rounded-xl bg-white p-3 text-base">
                <p className="font-semibold">{scheme.name}</p>
                <p>{scheme.what}</p>
                <p className="mt-1">{scheme.papers}</p>
                {scheme.url && <a className="mt-1 inline-block font-semibold text-[#3d7a64] underline" href={scheme.url} target="_blank" rel="noopener noreferrer">{scheme.url}</a>}
              </li>
            ))}
          </ul>
          <button type="button" onClick={saveCase} className="min-h-12 rounded-xl bg-[#3d7a64] text-lg font-semibold text-white">
            {t(language, "Save case on this phone", "केस इस फोन पर सेव करें")}
          </button>
          {savedNote && <p role="status">{savedNote}</p>}
          <p className="text-sm text-[#66716c]">{t(language, "Guidance, not legal advice. Sathi AI does not submit this complaint.", "यह मदद है, कानूनी सलाह नहीं। साथी AI यह शिकायत जमा नहीं करता।")}</p>
        </section>
      )}
    </div>
  );
}

function CaseEditor({
  language,
  workCase,
  onChange,
}: {
  language: Profile["language"];
  workCase: WorkCase;
  onChange: (next: WorkCase) => void;
}) {
  return (
    <section className="grid gap-3 rounded-2xl border border-[#e8e2d6] bg-white p-4">
      <h2 className="text-xl font-semibold">{t(language, "Open case", "खुला केस")}</h2>
      {workCase.sample && <p className="text-base text-[#66716c]">{t(language, "This case uses the sample pay story.", "इस केस में नमूना कमाई की कहानी है।")}</p>}
      <label className="text-base font-semibold" htmlFor="case-status">
        {t(language, "Status", "स्थिति")}
        <select id="case-status" value={workCase.status} onChange={(event) => onChange({ ...workCase, status: event.target.value as CaseStatus })} className="mt-1 min-h-12 w-full rounded-xl border border-[#ddd6c8] px-3 text-lg">
          <option value="open">{t(language, "Open", "खुला")}</option>
          <option value="waiting">{t(language, "Waiting for a reply", "जवाब का इंतज़ार")}</option>
          <option value="done">{t(language, "Done", "पूरा")}</option>
        </select>
      </label>
      <label className="text-base font-semibold" htmlFor="case-follow">
        {t(language, "Follow up on", "फॉलो अप की तारीख")}
        <input id="case-follow" type="date" value={workCase.followUp} onChange={(event) => onChange({ ...workCase, followUp: event.target.value })} className="mt-1 min-h-12 w-full rounded-xl border border-[#ddd6c8] px-3 text-lg" />
      </label>
      <label className="text-base font-semibold" htmlFor="case-notes">
        {t(language, "Notes", "नोट")}
        <textarea id="case-notes" value={workCase.notes} rows={3} onChange={(event) => onChange({ ...workCase, notes: event.target.value })} className="mt-1 w-full rounded-xl border border-[#ddd6c8] px-3 py-2 text-lg" />
      </label>
      <p className="whitespace-pre-wrap text-base">{workCase.letter}</p>
      <p className="text-sm text-[#66716c]">{t(language, "Saved only on this phone. It has not been submitted.", "सिर्फ इस फोन पर सेव है। इसे जमा नहीं किया गया।")}</p>
    </section>
  );
}
