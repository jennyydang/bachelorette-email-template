'use client';

import { useState } from 'react';

interface EmailOutputProps {
  recipientName: string | null;
  emailContent: string | null;
  isGenerating: boolean;
}

function SkeletonLine({ width }: { width: string }) {
  return <div className={`h-3.5 bg-gray-200 rounded animate-pulse ${width}`} />;
}

export default function EmailOutput({ recipientName, emailContent, isGenerating }: EmailOutputProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!emailContent) return;
    await navigator.clipboard.writeText(emailContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col gap-4 min-h-[400px]">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-lg font-bold text-gray-800">Generated Email</h2>
        <div className="flex items-center gap-2">
          {emailContent && (
            <button
              type="button"
              onClick={handleCopy}
              className="text-sm font-medium px-3 py-1 rounded-full border border-gray-200 hover:border-pink-300 hover:text-pink-600 text-gray-500 transition-colors"
            >
              {copied ? '✓ Copied!' : 'Copy'}
            </button>
          )}
          {recipientName && (
            <span className="text-sm text-pink-600 font-medium bg-pink-50 px-3 py-1 rounded-full">
              To: {recipientName}
            </span>
          )}
        </div>
      </div>

      <div className="flex-1">
        {isGenerating && !emailContent ? (
          <div className="flex flex-col gap-3 pt-2">
            <SkeletonLine width="w-3/4" />
            <SkeletonLine width="w-full" />
            <SkeletonLine width="w-5/6" />
            <SkeletonLine width="w-full" />
            <SkeletonLine width="w-4/5" />
            <div className="mt-2" />
            <SkeletonLine width="w-full" />
            <SkeletonLine width="w-3/4" />
            <SkeletonLine width="w-full" />
            <SkeletonLine width="w-2/3" />
          </div>
        ) : emailContent ? (
          <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800 leading-relaxed overflow-auto">
            {emailContent}
          </pre>
        ) : (
          <div className="flex items-center justify-center h-full min-h-[300px]">
            <p className="text-gray-400 italic text-sm text-center">
              Fill in the form and click &ldquo;Generate Email&rdquo; to see your personalized email here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
