import { Time } from '../backend';

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp: Time;
}

export default function ChatMessage({ message, isUser, timestamp }: ChatMessageProps) {
  const formatTime = (ts: Time) => {
    const date = new Date(Number(ts) / 1000000);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] space-y-1`}>
        <div
          className={`rounded-2xl px-4 py-2 ${
            isUser
              ? 'bg-primary text-primary-foreground rounded-br-sm'
              : 'bg-muted text-foreground rounded-bl-sm'
          }`}
        >
          <p className="text-sm leading-relaxed">{message}</p>
        </div>
        <p className={`text-xs text-muted-foreground ${isUser ? 'text-right' : 'text-left'}`}>
          {formatTime(timestamp)}
        </p>
      </div>
    </div>
  );
}
