'use client';

interface RecipientCardsProps {
  recipients: string[];
  generatedEmails: Record<string, string>;
  activeRecipient: string | null;
  isGenerating: boolean;
  onSelectRecipient: (name: string) => void;
}

export default function RecipientCards({
  recipients,
  generatedEmails,
  activeRecipient,
  isGenerating,
  onSelectRecipient,
}: RecipientCardsProps) {
  if (recipients.length <= 1) return null;

  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold text-gray-600 mb-3">
        Emails for {recipients.length} recipients — click a card to view
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {recipients.map((name) => {
          const isActive = name === activeRecipient;
          const isGenerated = !!generatedEmails[name];
          const isPending = isGenerating && !isGenerated;

          return (
            <button
              key={name}
              type="button"
              onClick={() => onSelectRecipient(name)}
              className={[
                'text-left bg-white rounded-xl border p-4 transition-all hover:shadow-md cursor-pointer',
                isActive
                  ? 'border-pink-500 ring-2 ring-pink-200 shadow-sm'
                  : 'border-gray-200 hover:border-pink-300',
              ].join(' ')}
            >
              <p className="font-semibold text-sm text-gray-800 truncate mb-2">{name}</p>
              {isPending ? (
                <span className="inline-flex items-center gap-1 bg-yellow-50 text-yellow-700 text-xs rounded-full px-2 py-0.5">
                  <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse" />
                  Generating
                </span>
              ) : isGenerated ? (
                <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs rounded-full px-2 py-0.5">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  Generated
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-500 text-xs rounded-full px-2 py-0.5">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                  Pending
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
