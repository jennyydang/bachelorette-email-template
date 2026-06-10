'use client';

interface EmailOutputProps {
  recipientName: string | null;
  emailContent: string | null;
  isGenerating: boolean;
}

function SkeletonLine({ width }: { width: string }) {
  return <div className={`h-3.5 bg-gray-200 rounded animate-pulse ${width}`} />;
}

export default function EmailOutput({ recipientName, emailContent, isGenerating }: EmailOutputProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col gap-4 min-h-[400px]">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800">Generated Email</h2>
        {recipientName && (
          <span className="text-sm text-pink-600 font-medium bg-pink-50 px-3 py-1 rounded-full">
            To: {recipientName}
          </span>
        )}
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
