'use client';

import { useEffect, useRef, useState } from 'react';
import { buildDefaultPrompt, FormData } from '@/lib/prompt';
import PillInput from './PillInput';

interface EmailFormProps {
  onGenerate: (formData: FormData) => void;
  isGenerating: boolean;
}

const FIELD_CLASSES = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 bg-white transition-all placeholder-gray-400';
const LABEL_CLASSES = 'block text-sm font-semibold text-gray-700 mb-1';

export default function EmailForm({ onGenerate, isGenerating }: EmailFormProps) {
  const [type, setType] = useState<'Bachelorette' | 'UGC'>('Bachelorette');
  const [recipients, setRecipients] = useState<string[]>([]);
  const [brideName, setBrideName] = useState('');
  const [tripDate, setTripDate] = useState('');
  const [destination, setDestination] = useState('');
  const [prompt, setPrompt] = useState('');
  const [from, setFrom] = useState('');
  const isPromptCustomized = useRef(false);

  useEffect(() => {
    if (type === 'Bachelorette' && !isPromptCustomized.current) {
      setPrompt(buildDefaultPrompt(recipients, destination, brideName));
    } else if (type === 'UGC' && !isPromptCustomized.current) {
      setPrompt('');
    }
  }, [type, destination, brideName, recipients]);

  function handleTypeChange(newType: 'Bachelorette' | 'UGC') {
    setType(newType);
    isPromptCustomized.current = false;
  }

  function handlePromptChange(value: string) {
    setPrompt(value);
    isPromptCustomized.current = true;
  }

  function handleResetPrompt() {
    isPromptCustomized.current = false;
    if (type === 'Bachelorette') {
      setPrompt(buildDefaultPrompt(recipients, destination, brideName));
    } else {
      setPrompt('');
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onGenerate({ type, recipients, brideName, tripDate, destination, prompt, from });
  }

  const canGenerate = recipients.length > 0 && prompt.trim().length > 0 && !isGenerating;

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col gap-5">
      <h2 className="text-lg font-bold text-gray-800">Email Details</h2>

      {/* Type */}
      <div>
        <label className={LABEL_CLASSES}>Type</label>
        <select
          value={type}
          onChange={(e) => handleTypeChange(e.target.value as 'Bachelorette' | 'UGC')}
          className={FIELD_CLASSES}
          disabled={isGenerating}
        >
          <option value="Bachelorette">Bachelorette</option>
          <option value="UGC">UGC</option>
        </select>
      </div>

      {/* To */}
      <div>
        <label className={LABEL_CLASSES}>To</label>
        <PillInput
          value={recipients}
          onChange={setRecipients}
          placeholder="Type a name or company and press Enter..."
          disabled={isGenerating}
        />
        <p className="text-xs text-gray-400 mt-1">Press Enter after each name to add it as a tag</p>
      </div>

      {/* Bachelorette-specific fields */}
      {type === 'Bachelorette' && (
        <>
          <div>
            <label className={LABEL_CLASSES}>Name of Bride</label>
            <input
              type="text"
              value={brideName}
              onChange={(e) => setBrideName(e.target.value)}
              placeholder="e.g. Sarah"
              className={FIELD_CLASSES}
              disabled={isGenerating}
            />
          </div>

          <div>
            <label className={LABEL_CLASSES}>Date of Bachelorette Trip</label>
            <input
              type="date"
              value={tripDate}
              onChange={(e) => setTripDate(e.target.value)}
              className={FIELD_CLASSES}
              disabled={isGenerating}
            />
          </div>

          <div>
            <label className={LABEL_CLASSES}>Destination</label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g. Nashville"
              className={FIELD_CLASSES}
              disabled={isGenerating}
            />
          </div>
        </>
      )}

      {/* Prompt */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className={LABEL_CLASSES + ' mb-0'}>Prompt</label>
          {isPromptCustomized.current && (
            <button
              type="button"
              onClick={handleResetPrompt}
              className="text-xs text-pink-500 hover:text-pink-700 underline transition-colors"
            >
              Reset to default
            </button>
          )}
        </div>
        <textarea
          value={prompt}
          onChange={(e) => handlePromptChange(e.target.value)}
          rows={6}
          placeholder={type === 'UGC' ? 'Enter your custom prompt...' : 'Fill in the fields above to auto-generate a prompt...'}
          className={FIELD_CLASSES + ' resize-y leading-relaxed'}
          disabled={isGenerating}
        />
        {recipients.length > 1 && type === 'Bachelorette' && (
          <p className="text-xs text-gray-400 mt-1">
            [To] will be replaced with each recipient&apos;s name when generating
          </p>
        )}
      </div>

      {/* From */}
      <div>
        <label className={LABEL_CLASSES}>From</label>
        <input
          type="text"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          placeholder="Your name"
          className={FIELD_CLASSES}
          disabled={isGenerating}
        />
      </div>

      <button
        type="submit"
        disabled={!canGenerate}
        className="w-full bg-pink-600 hover:bg-pink-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-6 rounded-xl transition-colors text-sm shadow-sm"
      >
        {isGenerating ? 'Generating...' : 'Generate Email'}
      </button>
    </form>
  );
}
