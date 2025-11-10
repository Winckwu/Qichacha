import ChatInterface from '@/components/chat/ChatInterface';

export default function ChatPage() {
  return (
    <div className="h-[calc(100vh-8rem)] bg-white dark:bg-slate-900 rounded-lg shadow-lg overflow-hidden">
      <ChatInterface />
    </div>
  );
}
