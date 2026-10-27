import { useId, useState } from 'react';

// Example React island. It shows the pattern for interactive case components:
// local state, accessible controls, and the synthetic data label. Copy it to start a real demo.
export default function ExampleDemo() {
  const id = useId();
  const [value, setValue] = useState(50);

  return (
    <div>
      <label htmlFor={id} className="type-label text-muted">
        Example input
      </label>
      <input
        id={id}
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(event) => setValue(Number(event.target.value))}
        className="mt-3 block w-full accent-accent"
      />
      <p className="mt-4 font-display text-[40px] leading-[44px]" aria-live="polite">
        {value}
      </p>
      <p className="type-label mt-4 font-semibold text-accent-ink">Synthetic data, illustrative only</p>
    </div>
  );
}
