// src/components/InputField.jsx
// ─── ONE component per file rule: InputField only ───────────────────────────
//
// Supports: text | email | tel | select | radio | textarea
// Props:
//   id          string   – ties label to input
//   label       string   – visible label text
//   type        string   – input type or 'select' | 'radio' | 'textarea'
//   required    bool
//   placeholder string
//   value       any
//   onChange    fn(value: string) => void
//   options     array    – [{ value, label }] for select & radio
//   icon        string   – SVG path `d` attribute for decorative icon
//   error       string   – validation error message
//   hint        string   – helper text below input
//   rows        number   – textarea row count (default 3)

const SHARED_INPUT =
  "w-full rounded-xl border border-slate-200 bg-white/80 " +
  "text-sm sm:text-base font-medium text-slate-800 " +
  "placeholder-slate-300 shadow-sm transition-all duration-200 " +
  "focus:outline-none focus:ring-2 focus:ring-teal-400/60 focus:border-teal-400 " +
  "hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed";

// ── Sub-renderers (private, not exported) ──────────────────────────────────

const TextInput = ({ id, type, placeholder, value, onChange, icon, error }) => (
  <div className="relative">
    {icon && (
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-3 sm:left-3.5 md:left-4 top-1/2 -translate-y-1/2 text-slate-400"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-3.5 w-3.5 sm:h-4 sm:w-4"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d={icon} />
        </svg>
      </span>
    )}
    <input
      id={id}
      name={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-invalid={!!error}
      aria-describedby={error ? `${id}-error` : undefined}
      className={`${SHARED_INPUT} py-2.5 sm:py-3 md:py-4 pr-3 sm:pr-4 ${icon ? "pl-9 sm:pl-10 md:pl-12" : "pl-3 sm:pl-4"
        } ${error ? "border-rose-400 focus:ring-rose-400/40 focus:border-rose-400" : ""
        }`}
    />
  </div>
);

const SelectInput = ({ id, placeholder, value, onChange, options, error }) => (
  <div className="relative w-full">
    <select
      id={id}
      name={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-invalid={!!error}
      aria-describedby={error ? `${id}-error` : undefined}
      className={`
        ${SHARED_INPUT}
        cursor-pointer
        appearance-none
        w-full
        max-w-full
        py-2.5 sm:py-3 md:py-3.5
        pl-3 sm:pl-4
        pr-10 sm:pr-12
        bg-white
        text-sm sm:text-base
        ${value ? "text-slate-800" : "text-slate-400"}
        ${error ? "border-rose-400 focus:ring-rose-400/40 focus:border-rose-400" : ""}
      `}
      style={{
        WebkitAppearance: 'none',
        MozAppearance: 'none',
      }}
    >
      <option value="" disabled hidden>
        {placeholder || "Select an option"}
      </option>

      {options?.map(({ value: v, label }) => (
        <option
          key={v}
          value={v}
        >
          {label}
        </option>
      ))}
    </select>

    {/* Dropdown arrow icon */}
    <div className="pointer-events-none absolute right-3 sm:right-4 top-1/2 -translate-y-1/2">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </div>
  </div>
);

const RadioInput = ({ id, value, onChange, options }) => (
  <fieldset id={id}>
    <legend className="sr-only">Options</legend>
    <div
      className="flex flex-col xs:flex-row xs:flex-wrap gap-2 sm:gap-3"
      role="radiogroup"
    >
      {options?.map(({ value: v, label }) => {
        const isChecked = value === v;
        return (
          <label
            key={v}
            className={`flex cursor-pointer items-center gap-2 sm:gap-2.5 rounded-lg sm:rounded-xl border px-3 sm:px-4 py-2.5 sm:py-2.5 md:py-3 text-xs sm:text-sm font-semibold transition-all duration-200 w-full xs:w-auto ${isChecked
              ? "border-teal-400 bg-teal-50 text-teal-700 shadow-sm"
              : "border-slate-200 bg-white/70 text-slate-500 hover:border-slate-300 hover:bg-slate-50"
              }`}
          >
            <input
              type="radio"
              name={id}
              value={v}
              checked={isChecked}
              onChange={() => onChange(v)}
              className="sr-only"
            />
            {/* Custom radio dot */}
            <span
              aria-hidden="true"
              className={`flex h-4 w-4 sm:h-4 sm:w-4 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors ${isChecked ? "border-teal-500" : "border-slate-300"
                }`}
            >
              {isChecked && (
                <span className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-teal-500 block" />
              )}
            </span>
            <span className="text-xs sm:text-sm leading-tight">{label}</span>
          </label>
        );
      })}
    </div>
  </fieldset>
);

const TextareaInput = ({ id, placeholder, value, onChange, rows, error }) => (
  <textarea
    id={id}
    name={id}
    placeholder={placeholder}
    value={value}
    rows={rows || 3}
    onChange={(e) => onChange(e.target.value)}
    aria-invalid={!!error}
    aria-describedby={error ? `${id}-error` : undefined}
    className={`${SHARED_INPUT} resize-none px-3 sm:px-4 py-2.5 sm:py-3 md:py-3.5 text-sm sm:text-base ${error ? "border-rose-400 focus:ring-rose-400/40 focus:border-rose-400" : ""
      }`}
  />
);

// ── Main exported component ────────────────────────────────────────────────

const InputField = ({
  id,
  label,
  type = "text",
  required = false,
  placeholder,
  value,
  onChange,
  options,
  icon,
  error,
  hint,
  rows,
}) => {
  const renderControl = () => {
    switch (type) {
      case "select":
        return (
          <SelectInput
            id={id}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            options={options}
            error={error}
          />
        );
      case "radio":
        return (
          <RadioInput
            id={id}
            value={value}
            onChange={onChange}
            options={options}
          />
        );
      case "textarea":
        return (
          <TextareaInput
            id={id}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            rows={rows}
            error={error}
          />
        );
      case "checkbox-group":
        return (
          <CheckboxGroup
            id={id}
            value={value}
            onChange={onChange}
            options={options}
          />
        );
      default:
        return (
          <TextInput
            id={id}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            icon={icon}
            error={error}
          />
        );
    }
  };

  return (
    <div className="space-y-1 sm:space-y-1.5 md:space-y-2 w-full">
      {label && type !== "radio" && (
        <label
          htmlFor={id}
          className="block text-xs sm:text-sm font-semibold tracking-wide text-slate-600"
        >
          {label}
          {required && (
            <span aria-label="required" className="ml-1 text-rose-400">
              *
            </span>
          )}
        </label>
      )}

      {/* For radio, render label as legend via visually hidden technique */}
      {label && type === "radio" && (
        <p
          className="block text-xs sm:text-sm font-semibold tracking-wide text-slate-600"
          aria-hidden="true"
        >
          {label}
          {required && <span className="ml-1 text-rose-400">*</span>}
        </p>
      )}

      {renderControl()}

      {hint && !error && (
        <p id={`${id}-hint`} className="text-[10px] sm:text-xs text-slate-400 font-medium">
          {hint}
        </p>
      )}

      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-semibold text-rose-500"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

const CheckboxGroup = ({ id, value = [], onChange, options }) => {

  const toggleValue = (val) => {
    let updated;

    if (value.includes(val)) {
      updated = value.filter(v => v !== val);
    } else {
      updated = [...value, val];
    }

    onChange(updated);
  };

  return (
    <fieldset id={id}>
      <div className="flex flex-col gap-2">
        {options?.map(({ value: v, label }) => {
          const checked = value.includes(v);

          return (
            <label
              key={v}
              className={`flex items-center gap-3 cursor-pointer rounded-xl border px-4 py-3 transition-all
              ${checked
                  ? "border-teal-400 bg-teal-50"
                  : "border-slate-200 hover:bg-slate-50"
                }`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggleValue(v)}
                className="h-4 w-4 accent-teal-500"
              />

              <span className="text-sm font-medium text-slate-700">
                {label}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
};

export default InputField;