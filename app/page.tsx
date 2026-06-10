'use client';

import { useState } from 'react';
import EmailForm from '@/components/EmailForm';
import EmailOutput from '@/components/EmailOutput';
import RecipientCards from '@/components/RecipientCards';
import { buildPrompt, FormData } from '@/lib/prompt';

export default function Home() {
  const [generatedEmails, setGeneratedEmails] = useState<Record<string, string>>({});
  const [activeRecipient, setActiveRecipient] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastRecipients, setLastRecipients] = useState<string[]>([]);

  async function handleGenerate(formData: FormData) {
    const { recipients } = formData;
    setIsGenerating(true);
    setGeneratedEmails({});
    setLastRecipients(recipients);
    setActiveRecipient(recipients[0] ?? null);

    await Promise.allSettled(
      recipients.map(async (recipient) => {
        const prompt = buildPrompt(formData, recipient);
        try {
          const res = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt, recipient }),
          });
          const data = await res.json();
          const email = res.ok ? (data.email as string) : `Error: ${data.error}`;
          setGeneratedEmails((prev) => ({ ...prev, [recipient]: email }));
        } catch {
          setGeneratedEmails((prev) => ({
            ...prev,
            [recipient]: 'Error: Failed to generate email. Please try again.',
          }));
        }
      })
    );

    setIsGenerating(false);
  }

  const activeEmail = activeRecipient ? generatedEmails[activeRecipient] ?? null : null;

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Email Template Generator</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Craft personalized emails for every recipient — powered by AI
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EmailForm onGenerate={handleGenerate} isGenerating={isGenerating} />
          <EmailOutput
            recipientName={activeRecipient}
            emailContent={activeEmail}
            isGenerating={isGenerating && !activeEmail}
          />
        </div>

        <RecipientCards
          recipients={lastRecipients}
          generatedEmails={generatedEmails}
          activeRecipient={activeRecipient}
          isGenerating={isGenerating}
          onSelectRecipient={setActiveRecipient}
        />
      </div>
    </main>
  );
}
