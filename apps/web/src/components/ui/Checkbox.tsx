interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

/** Toggle-style checkbox consistent with the coach mode toggle in ProfilePage. */
export function Checkbox({ checked, onChange, label, disabled }: CheckboxProps) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-3 ${disabled ? 'opacity-50' : ''}`}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none ${
          checked ? 'bg-woof-accent' : 'bg-woof-border'
        }`}
      >
        <span
          className={`absolute h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
            checked ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </button>
      {label ? <span className="text-sm text-tg-text">{label}</span> : null}
    </label>
  );
}
