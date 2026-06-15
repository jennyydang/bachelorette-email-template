export const BACHELORETTE_TEMPLATE =
  'Write an email to [To] to see if they are willing to contribute to a bachelorette trip to [destination] for a group of [number of guests]. Make it sound genuine and no hyphen. Make it personable by including a funny story about [name of bride] and saying the [To] in a joke or play on word. Include that I am willing to share/post to socials. Keep it short but personable. End with a pun.';

export interface FormData {
  type: 'Bachelorette' | 'UGC';
  recipients: string[];
  brideName: string;
  tripDate: string;
  destination: string;
  guestCount: string;
  prompt: string;
  from: string;
}

export function buildPrompt(formData: FormData, recipient: string): string {
  return formData.prompt
    .replaceAll('[To]', recipient)
    .replaceAll('[destination]', formData.destination)
    .replaceAll('[name of bride]', formData.brideName)
    .replaceAll('[number of guests]', formData.guestCount || '[number of guests]');
}

export function buildDefaultPrompt(
  recipients: string[],
  destination: string,
  brideName: string,
  guestCount: string
): string {
  const toDisplay = recipients.length === 1 ? recipients[0] : '[To]';
  return BACHELORETTE_TEMPLATE.replace('[To]', toDisplay)
    .replace('[destination]', destination || '[destination]')
    .replace('[name of bride]', brideName || '[name of bride]')
    .replace('[number of guests]', guestCount || '[number of guests]');
}
