// src/components/SurveyForm.jsx
// ─── ONE component per file rule: SurveyForm only ───────────────────────────

import { useState, useCallback } from "react";
import InputField from "./InputField";
import { submitSurvey } from "../backend-api/api";
import { toast } from "react-toastify";
import MedicalLoader from "./MedicalLoader";
import { useRef } from "react";



// ── Static data (outside component to avoid re-creation) ──────────────────

const STEPS = [
  { id: 1, title: "Demographic Information", subtitle: "Basic personal details" },
  { id: 2, title: "Impact on Daily Life", subtitle: "Work, routine & social life" },
  { id: 3, title: "Vaccination & Prevention", subtitle: "Health & safety measures" },
  { id: 4, title: "Mental Health & Well-being", subtitle: "Psychological impact" },
  { id: 5, title: "Economic Impact", subtitle: "Income & financial stability" },
  { id: 6, title: "Open Ended Feedback", subtitle: "Your personal experience" },
];



const INITIAL_FORM = {
  // Section 1
  age: "",
  gender: "",
  education: "",
  occupation: "",

  // Section 2
  workStudyChange: "",
  socialLifeImpact: "",
  workedFromHomeBefore: "",
  dailyRoutineImpact: [],
  dailyRoutineOther: "",

  // Section 3
  vaccinated: "",
  preventivePractice: "",
  vaccineEffectiveness: "",
  vaccineType: "",
  covidTested: "",
  testType: "",
  doseCount: "",

  // Section 4
  mentalHealthImpact: "",
  anxietyLevel: "",
  soughtHelp: "",
  // NEW FIELDS
  healthcareAccessible: "",
  facedShortage: "",
  healthcareSatisfaction: "",

  // Section 5
  incomeImpact: "",
  financialDifficulty: "",
  spendingHabit: "",

  // Section 6
  openExperience: "",
  infoSource: "",
};


const AGE_OPTIONS = [
  { value: "18-24", label: "18–24" },
  { value: "25-30", label: "25–30" },
  { value: "30-40", label: "30–40" },
  { value: "40+", label: "40 or older" },
];

const YES_NO = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];
const SOCIAL_IMPACT = [
  { value: "very_negative", label: "Very negatively" },
  { value: "somewhat_negative", label: "Somewhat negatively" },
  { value: "no_change", label: "Not much" },
  { value: "positive", label: "Positively" },
];
const ROUTINE_IMPACT = [
  { value: "significant", label: "Significantly" },
  { value: "somewhat", label: "Somewhat" },
  { value: "no_change", label: "Not changed" },
  { value: "other", label: "Other" },
];
const VACCINE_TYPES = [
  { value: "covishield", label: "Covishield" },
  { value: "covaxin", label: "CO-Vaccine" },
  { value: "other", label: "Other" },
];
const MENTAL_IMPACT = [
  { value: "high_negative", label: "Significant negative impact" },
  { value: "moderate_negative", label: "Moderate negative impact" },
  { value: "low", label: "Little to no impact" },
  { value: "positive", label: "Positive impact" },
];


// Validation rules per step
const VALIDATORS = {
  1: (f) => {
    const e = {};
    if (!f.age) e.age = "Please select your age group.";
    if (!f.gender) e.gender = "Please select your gender.";
    if (!f.education.trim()) e.education = "Education is required.";
    if (!f.occupation.trim()) e.occupation = "Occupation is required.";
    return e;
  },

  2: (f) => {
    const e = {};
    if (!f.workStudyChange) e.workStudyChange = "Required.";
    if (!f.socialLifeImpact) e.socialLifeImpact = "Required.";
    if (!f.workedFromHomeBefore) e.workedFromHomeBefore = "Required.";
    if (!f.dailyRoutineImpact.length) e.dailyRoutineImpact = "Required.";
    return e;
  },

  3: (f) => {
    const e = {};
    if (!f.vaccinated) e.vaccinated = "Required.";
    if (!f.preventivePractice) e.preventivePractice = "Required.";
    if (!f.vaccineEffectiveness) e.vaccineEffectiveness = "Required.";

    if (f.vaccinated === "yes" && !f.vaccineType)
      e.vaccineType = "Required.";

    if (!f.covidTested) e.covidTested = "Required.";

    if (f.covidTested === "yes" && !f.testType)
      e.testType = "Required.";

    if (!f.doseCount) e.doseCount = "Required.";
    return e;
  },

  4: (f) => {
    const e = {};
    if (!f.mentalHealthImpact) e.mentalHealthImpact = "Required.";
    if (!f.anxietyLevel) e.anxietyLevel = "Required.";
    if (!f.soughtHelp) e.soughtHelp = "Required.";
    // NEW VALIDATIONS
    if (!f.healthcareAccessible) e.healthcareAccessible = "Required.";
    if (!f.facedShortage) e.facedShortage = "Required.";
    if (!f.healthcareSatisfaction) e.healthcareSatisfaction = "Required.";
    return e;
  },

  5: (f) => {
    const e = {};
    if (!f.financialDifficulty) e.financialDifficulty = "Required.";
    if (!f.spendingHabit) e.spendingHabit = "Required.";
    return e;
  },

  6: (f) => {
    const e = {};

    if (!f.openExperience || !f.openExperience.trim()) {
      e.openExperience = "Please share your experience.";
    }

    if (!f.infoSource || !f.infoSource.trim()) {
      e.infoSource = "This field is required.";
    }

    return e;
  },
};



// ── ProgressBar (private, local to this file) ─────────────────────────────
const ProgressBar = ({ current, total }) => {
  const pct = Math.round((current / total) * 100);
  return (
    <div aria-label={`Step ${current} of ${total}`} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-widest text-teal-600">
          Step {current} / {total}
        </span>
        <span className="text-xs font-semibold text-slate-400">{pct}% complete</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${pct}%`,
            background: "linear-gradient(90deg, #0d9488, #06b6d4)",
          }}
        />
      </div>
      {/* Step dots - horizontal scroll on mobile */}
      <div className="mt-4 -mx-4 px-4 overflow-x-auto">
        <ol aria-label="Steps" className="flex items-center justify-start sm:justify-center gap-1 sm:gap-2 min-w-max px-2">
          {STEPS.map((s) => (
            <li key={s.id} aria-current={current === s.id ? "step" : undefined}>
              <div
                className={`flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full text-[10px] sm:text-xs font-bold transition-all duration-300 ${s.id < current
                  ? "bg-teal-500 text-white shadow-sm shadow-teal-200"
                  : s.id === current
                    ? "border-2 border-teal-500 bg-white text-teal-600 shadow-sm"
                    : "border-2 border-slate-200 bg-white text-slate-300"
                  }`}
              >
                {s.id < current ? (
                  <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3 sm:h-3.5 sm:w-3.5" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  s.id
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

// ── SectionHeader (private, local to this file) ────────────────────────────
const SectionHeader = ({ step }) => (
  <div className="mb-4 sm:mb-6">
    <h2
      className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800"
      style={{ fontFamily: "var(--font-display)" }}
    >
      {step.title}
    </h2>
    <p className="mt-1 text-xs sm:text-sm text-slate-500">{step.subtitle}</p>
  </div>
);

// ── SuccessScreen (private, local to this file) ─────────────────────────────
const SuccessScreen = ({ onReset, responseId }) => (
  <div className="flex flex-col items-center px-4 sm:px-6 py-12 sm:py-16 text-center">
    <div
      className="mb-6 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full shadow-xl"
      style={{ background: "linear-gradient(135deg, #0d9488, #06b6d4)" }}
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 sm:h-10 sm:w-10 text-white" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </div>
    <h2
      className="mb-2 text-xl sm:text-2xl font-bold text-slate-800"
      style={{ fontFamily: "var(--font-display)" }}
    >
      Thank You!
    </h2>
    <p className="mb-6 max-w-sm text-xs sm:text-sm leading-relaxed text-slate-500">
      Your response has been recorded succesfully. Thank you for your valuable time.
    </p>
    <div className="mb-6 rounded-xl border border-teal-100 bg-teal-50 px-4 sm:px-5 py-2 sm:py-3">
      <p className="text-xs text-teal-600 font-medium">Response ID</p>
      <p className="mt-0.5 font-mono text-xs sm:text-sm font-bold text-teal-800">
        #{responseId}
      </p>
    </div>
    <button
      onClick={onReset}
      className="text-xs font-semibold text-slate-400 underline underline-offset-2 hover:text-slate-600 transition-colors"
    >
      Submit another response
    </button>
  </div>
);

// ── Main exported component ────────────────────────────────────────────────

const SurveyForm = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [responseId, setResponseId] = useState("");
  const isSubmittingRef = useRef(false);

  const setField = useCallback(
    (field) => (value) => setForm((prev) => ({ ...prev, [field]: value })),
    []
  );

  const validate = (s) => {
    const errs = VALIDATORS[s](form);
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // const focusFirstError = (errs) => {
  //   const firstField = Object.keys(errs)[0];
  //   if (!firstField) return;

  //   // Small delay to ensure DOM updates
  //   setTimeout(() => {
  //     const el = document.getElementById(firstField);
  //     if (el) {
  //       el.scrollIntoView({
  //         behavior: "smooth",
  //         block: "center",
  //       });
  //       el.focus({ preventScroll: true });
  //     }
  //   }, 100);
  // };
  const focusFirstError = (errs) => {
    const firstField = Object.keys(errs)[0];
    if (!firstField) return;

    setTimeout(() => {
      const el = document.querySelector(
        `[name="${firstField}"]`
      );

      if (el) {
        el.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        el.focus();

        // place cursor at end (textarea UX)
        if (el.setSelectionRange) {
          const len = el.value?.length || 0;
          el.setSelectionRange(len, len);
        }
      }
    }, 150);
  };

  const handleNext = () => {
    const errs = VALIDATORS[step](form);
    setErrors(errs);

    if (Object.keys(errs).length > 0) {
      focusFirstError(errs);
      return;
    }

    setStep((s) => Math.min(s + 1, STEPS.length));
    window.scrollTo({ top: 630, behavior: "smooth" });
  };


  const handleBack = () => {
    setErrors({});
    setStep((s) => Math.max(s - 1, 1));
    window.scrollTo({ top: 630, behavior: "smooth" });
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   const errs = VALIDATORS[step](form);
  //   setErrors(errs);

  //   if (Object.keys(errs).length > 0) {
  //     focusFirstError(errs);
  //     return;
  //   }

  //   setSubmitting(true);

  //   // simulate API call / UX delay
  //   setTimeout(() => {
  //     setSubmitting(false);
  //     setSubmitted(true);
  //   }, 900);
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Step validation (keep your logic)
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    const errs = VALIDATORS[step](form);
    setErrors(errs);

    if (Object.keys(errs).length > 0) {
      focusFirstError(errs);
      isSubmittingRef.current = false; // ⭐ FIX
      return;
    }

    setSubmitting(true);

    try {
      // ✅ Build payload from form state
      const surveyData = {
        age: form.age,
        gender: form.gender,
        education: form.education,
        occupation: form.occupation,

        workStudyChange: form.workStudyChange,
        socialLifeImpact: form.socialLifeImpact,
        wfhBeforeCovid: form.workedFromHomeBefore,
        //dailyRoutineImpact: form.dailyRoutineImpact,
        dailyRoutineImpact: form.dailyRoutineImpact.join(", "),

        vaccinated: form.vaccinated,
        maskPractice: form.preventivePractice,
        vaccineEffectiveness: form.vaccineEffectiveness,
        vaccineType: form.vaccineType,

        testedCovid: form.covidTested,
        testType: form.testType,
        doseCount: form.doseCount,

        mentalHealthImpact: form.mentalHealthImpact,
        anxietyStress: form.anxietyLevel,
        professionalHelp: form.soughtHelp,

        incomeImpact: form.incomeImpact,
        financialDifficulty: form.financialDifficulty,
        spendingHabit: form.spendingHabit,

        experienceShare: form.openExperience,
        infoSource: form.infoSource,

        // NEW DATA
        healthcareAccessible: form.healthcareAccessible,
        facedShortage: form.facedShortage,
        healthcareSatisfaction: form.healthcareSatisfaction,
      };


      // ✅ Send to Google Sheet
      const result = await submitSurvey(surveyData);

      if (result.code === 1) {
        setResponseId(result.responseId);
        setSubmitted(true);

        toast.success(result.msg, {
          icon: "🩺",
          toastId: "survey-success",
        });

      } else {
        toast.error("Server unreachable. Please try again.", {
          icon: "⚕️",
          toastId: "survey-error",
        });

      }


    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Server unreachable. Please try again.", {
        icon: "⚕️",
      });
    } finally {
      setSubmitting(false);
      isSubmittingRef.current = false;
    }
  };


  // const handleReset = () => {
  //   setForm(INITIAL_FORM);
  //   setErrors({});
  //   setStep(1);
  //   setSubmitted(false);
  // };
  const handleReset = () => {
    setForm(INITIAL_FORM);
    setErrors({});
    setStep(1);
    setSubmitted(false);
    setResponseId(""); // add this
  };

  const err = (f) => errors[f] || "";

  return (
    <section
      aria-label="Medical student survey form"
      className="mx-auto w-full max-w-2xl px-3 sm:px-4 pb-12 sm:pb-16"
    >
      {submitting && <MedicalLoader />}
      {submitted ? (
        <div
          className="glass-card overflow-hidden rounded-xl sm:rounded-2xl shadow-xl
             animate-[fadeIn_0.5s_ease-out] scale-100"
          style={{ boxShadow: "0 8px 40px -8px rgba(13,148,136,0.18)" }}
        >

          <SuccessScreen
            onReset={handleReset}
            responseId={responseId}
          />

        </div>
      ) : (
        <form
          noValidate
          onSubmit={handleSubmit}
          aria-label={`Survey step ${step}: ${STEPS[step - 1].title}`}
        >
          {/* Progress card */}
          <div
            className="glass-card mb-3 sm:mb-4 animate-fade-up animate-fade-up-1 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm"
          >
            <ProgressBar current={step} total={STEPS.length} />
          </div>

          {/* Form card */}
          <div
            className={`glass-card rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 shadow-xl transition-all duration-500 ease-out
    ${submitting ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"}
  `}
            style={{ boxShadow: "0 8px 40px -8px rgba(10,37,64,0.12)" }}
          >

            <SectionHeader step={STEPS[step - 1]} />

            {/* ── STEP 1: Personal Details ── */}
            {step === 1 && (
              <div className="space-y-4 sm:space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <InputField
                    id="age"
                    label="Age"
                    type="select"
                    required
                    placeholder="Select age group"
                    value={form.age}
                    onChange={setField("age")}
                    options={AGE_OPTIONS}
                  />

                  <InputField
                    id="gender"
                    label="Gender"
                    type="select"
                    required
                    placeholder="Select gender"
                    value={form.gender}
                    onChange={setField("gender")}
                    options={[
                      { value: "male", label: "Male" },
                      { value: "female", label: "Female" },
                      { value: "other", label: "Other" },
                    ]}
                  />

                  <InputField
                    id="education"
                    label="Education"
                    type="text"
                    placeholder="Your highest education"
                    value={form.education}
                    onChange={setField("education")}
                  />

                  <InputField
                    id="occupation"
                    label="Occupation"
                    type="text"
                    placeholder="Your current occupation"
                    value={form.occupation}
                    onChange={setField("occupation")}
                  />

                </div>
              </div>
            )}

            {/* ── STEP 2: Academic Profile ── */}
            {step === 2 && (
              <div className="space-y-5 sm:space-y-6">

                <InputField
                  id="workStudyChange"
                  label="Have you experienced any changes in work or studies?"
                  type="radio"
                  required
                  value={form.workStudyChange}
                  onChange={setField("workStudyChange")}
                  options={YES_NO}
                  error={err("workStudyChange")}
                />

                <InputField
                  id="socialLifeImpact"
                  label="How has COVID-19 impacted your social life?"
                  type="radio"
                  required
                  value={form.socialLifeImpact}
                  onChange={setField("socialLifeImpact")}
                  options={SOCIAL_IMPACT}
                  error={err("socialLifeImpact")}
                />

                <InputField
                  id="workedFromHomeBefore"
                  label="Did you work or study from home before COVID-19?"
                  type="radio"
                  required
                  value={form.workedFromHomeBefore}
                  onChange={setField("workedFromHomeBefore")}
                  options={YES_NO}
                  error={err("workedFromHomeBefore")}
                />

                <InputField
                  id="dailyRoutineImpact"
                  label="How has COVID-19 affected your daily routine?"
                  type="checkbox-group"
                  required
                  value={form.dailyRoutineImpact}
                  onChange={setField("dailyRoutineImpact")}
                  options={ROUTINE_IMPACT}
                  error={err("dailyRoutineImpact")}
                />

                {form.dailyRoutineImpact.includes("other") && (
                  <InputField
                    id="dailyRoutineOther"
                    label="Please specify"
                    type="textarea"
                    rows={3}
                    placeholder="Describe how your routine changed"
                    value={form.dailyRoutineOther}
                    onChange={setField("dailyRoutineOther")}
                  />
                )}
              </div>
            )}


            {/* ── STEP 3: Learning & Wellbeing ── */}
            {step === 3 && (
              <div className="space-y-5 sm:space-y-6">

                <InputField
                  id="vaccinated"
                  label="Have you received COVID-19 vaccine?"
                  type="radio"
                  required
                  value={form.vaccinated}
                  onChange={setField("vaccinated")}
                  options={YES_NO}
                  error={err("vaccinated")}
                />

                <InputField
                  id="preventivePractice"
                  label="Do you practice social distancing and wear masks in public?"
                  type="radio"
                  required
                  value={form.preventivePractice}
                  onChange={setField("preventivePractice")}
                  options={[
                    { value: "always", label: "Always" },
                    { value: "sometimes", label: "Sometimes" },
                    { value: "rarely", label: "Rarely" },
                    { value: "never", label: "Never" },
                  ]}
                  error={err("preventivePractice")}
                />

                <InputField
                  id="vaccineEffectiveness"
                  label="Do you think COVID-19 vaccine is effective in preventing severe illness?"
                  type="radio"
                  required
                  value={form.vaccineEffectiveness}
                  onChange={setField("vaccineEffectiveness")}
                  options={[
                    { value: "strongly_agree", label: "Strongly agree" },
                    { value: "somewhat_agree", label: "Somewhat agree" },
                    { value: "neutral", label: "Neutral" },
                    { value: "disagree", label: "Disagree" },
                  ]}
                  error={err("vaccineEffectiveness")}
                />

                {form.vaccinated === "yes" && (
                  <InputField
                    id="vaccineType"
                    label="Which COVID-19 vaccine did you receive?"
                    type="select"
                    required
                    placeholder="Select vaccine"
                    value={form.vaccineType}
                    onChange={setField("vaccineType")}
                    options={VACCINE_TYPES}
                    error={err("vaccineType")}
                  />
                )}

                <InputField
                  id="covidTested"
                  label="Have you been tested for COVID-19?"
                  type="radio"
                  required
                  value={form.covidTested}
                  onChange={setField("covidTested")}
                  options={YES_NO}
                  error={err("covidTested")}
                />

                {form.covidTested === "yes" && (
                  <InputField
                    id="testType"
                    label="What test did you undergo?"
                    type="select"
                    required
                    placeholder="Select test type"
                    value={form.testType}
                    onChange={setField("testType")}
                    options={[
                      { value: "rt_pcr", label: "RT-PCR" },
                      { value: "rat", label: "RAT (Rapid Antigen Test)" },
                      { value: "blood", label: "Blood Test" },
                      { value: "other", label: "Other" },
                    ]}
                    error={err("testType")}
                  />
                )}

                <InputField
                  id="doseCount"
                  label="How many doses have you taken?"
                  type="radio"
                  required
                  value={form.doseCount}
                  onChange={setField("doseCount")}
                  options={[
                    { value: "1", label: "1" },
                    { value: "2", label: "2" },
                    { value: "3", label: "3" },
                    { value: "0", label: "No doses" },
                  ]}
                  error={err("doseCount")}
                />

              </div>
            )}


            {/* ── STEP 4: Open Feedback ── */}
            {step === 4 && (
              <div className="space-y-5 sm:space-y-6">
                <InputField
                  id="mentalHealthImpact"
                  label="How has COVID-19 affected your mental health?"
                  type="radio"
                  required
                  value={form.mentalHealthImpact}
                  onChange={setField("mentalHealthImpact")}
                  options={MENTAL_IMPACT}
                  error={err("mentalHealthImpact")}
                />

                <InputField
                  id="anxietyLevel"
                  label="Have you experienced anxiety or stress related to COVID-19?"
                  type="radio"
                  required
                  value={form.anxietyLevel}
                  onChange={setField("anxietyLevel")}
                  options={[
                    { value: "often", label: "Often" },
                    { value: "sometimes", label: "Sometimes" },
                    { value: "rarely", label: "Rarely" },
                    { value: "never", label: "Not at all" },
                  ]}
                  error={err("anxietyLevel")}
                />

                <InputField
                  id="soughtHelp"
                  label="Have you sought professional help for mental health concerns?"
                  type="radio"
                  required
                  value={form.soughtHelp}
                  onChange={setField("soughtHelp")}
                  options={YES_NO}
                  error={err("soughtHelp")}
                />

                <InputField
                  id="healthcareAccessible"
                  label="Was healthcare easily accessible during the pandemic?"
                  type="radio"
                  required
                  value={form.healthcareAccessible}
                  onChange={setField("healthcareAccessible")}
                  options={YES_NO}
                  error={err("healthcareAccessible")}
                />
                <InputField
                  id="facedShortage"
                  label="Did you face shortage of hospital beds, oxygen, or medicines?"
                  type="radio"
                  required
                  value={form.facedShortage}
                  onChange={setField("facedShortage")}
                  options={YES_NO}
                  error={err("facedShortage")}
                />
                <InputField
                  id="healthcareSatisfaction"
                  label="Rate your satisfaction with healthcare services:"
                  type="radio"
                  required
                  value={form.healthcareSatisfaction}
                  onChange={setField("healthcareSatisfaction")}
                  options={[
                    { value: "very_satisfied", label: "Very satisfied" },
                    { value: "satisfied", label: "Satisfied" },
                    { value: "neutral", label: "Neutral" },
                    { value: "dissatisfied", label: "Dissatisfied" },
                  ]}
                  error={err("healthcareSatisfaction")}
                />
              </div>
            )}

            {step === 5 && (
              <div className="space-y-5 sm:space-y-6">
                <InputField
                  id="financialDifficulty"
                  label="Have you experienced financial difficulties due to COVID-19?"
                  type="radio"
                  required
                  value={form.financialDifficulty}
                  onChange={setField("financialDifficulty")}
                  options={[
                    { value: "significant", label: "Yes, significantly" },
                    { value: "moderate", label: "Yes, moderately" },
                    { value: "none", label: "No financial difficulties" },
                  ]}
                  error={err("financialDifficulty")}
                />

                <InputField
                  id="spendingHabit"
                  label="How has COVID-19 impacted your spending habits?"
                  type="radio"
                  required
                  value={form.spendingHabit}
                  onChange={setField("spendingHabit")}
                  options={[
                    { value: "reduced", label: "Reduced spending" },
                    { value: "increased", label: "Increased spending" },
                    { value: "no_change", label: "No change" },
                    { value: "unsure", label: "Unsure" },
                  ]}
                  error={err("spendingHabit")}
                />
              </div>
            )}

            {step === 6 && (
              <div className="space-y-4 sm:space-y-5">
                <InputField
                  id="openExperience"
                  label="Is there anything else you would like to share about your COVID-19 experience?"
                  type="textarea"
                  required
                  rows={4}
                  placeholder="Your experience..."
                  value={form.openExperience}
                  onChange={setField("openExperience")}
                  error={err("openExperience")}
                />

                <InputField
                  id="infoSource"
                  label="Which source of information do you use to stay informed about COVID-19?"
                  type="textarea"
                  required
                  rows={3}
                  placeholder="News, Government websites, social media, etc."
                  value={form.infoSource}
                  onChange={setField("infoSource")}
                  error={err("infoSource")}
                />
              </div>
            )}





            {/* ── Navigation ── */}
            <div className="mt-5 sm:mt-6 md:mt-8 flex flex-col-reverse xs:flex-row items-center gap-2 sm:gap-3 w-full">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="w-full xs:flex-1 flex items-center justify-center gap-2 rounded-lg sm:rounded-xl border border-slate-200 bg-white py-2.5 sm:py-3 md:py-3.5 text-xs sm:text-sm font-semibold text-slate-600 shadow-sm transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-teal-400"
                >
                  <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
              )}

              {step < STEPS.length ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleNext();
                  }}

                  className="w-full xs:flex-1 flex items-center justify-center gap-2 sm:gap-2.5 rounded-lg sm:rounded-xl py-2.5 sm:py-3 md:py-3.5 text-xs sm:text-sm font-bold tracking-wide text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:shadow-md"
                  style={{
                    background: "linear-gradient(135deg, #0d9488, #06b6d4)",
                    boxShadow: "0 8px 24px -4px rgba(13,148,136,0.45)",
                  }}
                >
                  Continue
                  <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-full xs:flex-1 flex items-center justify-center gap-2 sm:gap-2.5
    rounded-lg sm:rounded-xl py-2.5 sm:py-3 md:py-3.5
    text-xs sm:text-sm font-bold tracking-wide text-white
    transition-all duration-300
    ${submitting ? "opacity-80 cursor-not-allowed" : "hover:-translate-y-0.5"}
  `}
                  style={{
                    background: "linear-gradient(135deg, #0d9488, #06b6d4)",
                    boxShadow: "0 8px 24px -4px rgba(13,148,136,0.45)",
                  }}
                >
                  {submitting ? (
                    <>
                      <svg
                        className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                      >
                        <circle cx="12" cy="12" r="10" opacity="0.25" />
                        <path d="M22 12a10 10 0 01-10 10" />
                      </svg>
                      Submitting…
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Submit Survey
                    </>
                  )}
                </button>

              )}
            </div>

          </div>
        </form>
      )}
    </section>
  );
};

export default SurveyForm;