'use client';

import { useRef, useState } from 'react';

interface PillInputProps {
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function PillInput({ value, onChange, placeholder = 'Type and press Enter...', disabled }: PillInputProps) {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  function addRecipient(name: string) {
    const trimmed = name.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
  }

  function removeRecipient(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      addRecipient(inputValue);
      setInputValue('');
    } else if (e.key === 'Backspace' && inputValue === '') {
      onChange(value.slice(0, -1));
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const text = e.clipboardData.getData('text');
    const tokens = text.split(/[,\n]+/).map((t) => t.trim()).filter(Boolean);
    if (tokens.length > 1) {
      e.preventDefault();
      const newValues = [...value];
      for (const token of tokens) {
        if (token && !newValues.includes(token)) newValues.push(token);
      }
      onChange(newValues);
    }
  }

  return (
    <div
      className="flex flex-wrap gap-2 items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-pink-400 focus-within:border-pink-400 min-h-[44px] cursor-text bg-white transition-all"
      onClick={() => inputRef.current?.focus()}
    >
      {value.map((name, i) => (
        <span
          key={i}
          className="flex items-center gap-1 bg-pink-100 text-pink-800 text-sm rounded-full px-3 py-1 font-medium"
        >
          {name}
          {!disabled && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); removeRecipient(i); }}
              className="hover:text-pink-600 ml-0.5 leading-none text-pink-400 transition-colors"
              aria-label={`Remove ${name}`}
            >
              ×
            </button>
          )}
        </span>
      ))}
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        placeholder={value.length === 0 ? placeholder : ''}
        disabled={disabled}
        className="flex-1 min-w-[140px] outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent disabled:cursor-not-allowed"
      />
    </div>
  );
}
