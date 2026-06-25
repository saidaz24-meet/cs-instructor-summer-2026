import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, PlusCircle, Briefcase, Copy, Check, Download } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

type AgentMode = 'maya' | 'career';

const AGENT_CONFIG = {
  maya: {
    name: 'Maya — Interview Coach',
    subtitle: 'AI-powered interview practice for students and professionals',
    icon: Bot,
    gradient: 'from-emerald-400 to-teal-500',
    welcome: "I'm Maya, your interview coach. Tell me what type of interview you're preparing for, and let's get started!",
  },
  career: {
    name: 'Alex — Career Advisor',
    subtitle: 'Strategic career guidance for your professional journey',
    icon: Briefcase,
    gradient: 'from-amber-400 to-orange-500',
    welcome: "I'm Alex, your career advisor. Whether you're job hunting, considering a pivot, or negotiating an offer, I'm here to help you navigate your career path!",
  },
};

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [agentMode, setAgentMode] = useState<AgentMode>('maya');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleNewChat = () => {
    setMessages([]);
    setInput('');
  };

  const handleModeSwitch = (mode: AgentMode) => {
    if (mode !== agentMode) {
      setAgentMode(mode);
      setMessages([]);
      setInput('');
    }
  };

  const handleCopy = async (id: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      console.error('Failed to copy');
    }
  };

  const handleExport = () => {
    if (messages.length === 0) return;

    const agentName = AGENT_CONFIG[agentMode].name;
    const date = new Date().toLocaleDateString();
    const time = new Date().toLocaleTimeString();

    const header = `${agentName} - Conversation Export\nDate: ${date} ${time}\n${'='.repeat(50)}\n\n`;

    const content = messages
      .map((m) => `[${m.role === 'user' ? 'You' : agentName.split(' —')[0]}]: ${m.content}`)
      .join('\n\n');

    const blob = new Blob([header + content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conversation-${agentMode}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('chat', {
        body: {
          agentMode,
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        },
      });

      if (error) throw new Error(error.message);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Something went wrong. Please try again.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const currentAgent = AGENT_CONFIG[agentMode];
  const AgentIcon = currentAgent.icon;
  const userMessageCount = messages.filter((m) => m.role === 'user').length;
  const totalMessageCount = messages.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${currentAgent.gradient} flex items-center justify-center shadow-lg`}>
                <AgentIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-white">{currentAgent.name}</h1>
                <p className="text-sm text-slate-400">{currentAgent.subtitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Message Count */}
              {messages.length > 0 && (
                <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-sm text-slate-400">
                  <span>{userMessageCount} messages</span>
                  <span className="text-slate-600">|</span>
                  <span>{totalMessageCount} total</span>
                </div>
              )}
              {/* Agent Mode Toggle */}
              <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
                <button
                  onClick={() => handleModeSwitch('maya')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                    agentMode === 'maya'
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Bot className="w-4 h-4" />
                    <span className="hidden sm:inline">Maya</span>
                  </span>
                </button>
                <button
                  onClick={() => handleModeSwitch('career')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                    agentMode === 'career'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4" />
                    <span className="hidden sm:inline">Alex</span>
                  </span>
                </button>
              </div>
              {/* Export Button */}
              {messages.length > 0 && (
                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white transition-all duration-200"
                  title="Export conversation"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Export</span>
                </button>
              )}
              {/* New Chat Button */}
              <button
                onClick={handleNewChat}
                disabled={messages.length === 0}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Start new chat"
              >
                <PlusCircle className="w-4 h-4" />
                <span className="hidden sm:inline">New</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center">
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${currentAgent.gradient} flex items-center justify-center shadow-xl mb-6`}>
                <AgentIcon className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-white mb-2">
                {agentMode === 'maya' ? 'Welcome to Interview Practice' : 'Welcome to Career Coaching'}
              </h2>
              <p className="text-slate-400 max-w-md mb-8">{currentAgent.welcome}</p>
              <div className="flex flex-wrap gap-3 justify-center">
                {agentMode === 'maya' ? (
                  ['Software Engineer', 'Product Manager', 'Data Scientist', 'Business Analyst'].map((role) => (
                    <button
                      key={role}
                      onClick={() => setInput(`I'm preparing for a ${role} interview.`)}
                      className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white transition-all duration-200 text-sm"
                    >
                      {role}
                    </button>
                  ))
                ) : (
                  ['Job Search Strategy', 'Resume Review', 'Salary Negotiation', 'Career Pivot'].map((topic) => (
                    <button
                      key={topic}
                      onClick={() => setInput(`I need help with ${topic.toLowerCase()}.`)}
                      className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white transition-all duration-200 text-sm"
                    >
                      {topic}
                    </button>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className={`flex-shrink-0 w-9 h-9 rounded-lg bg-gradient-to-br ${currentAgent.gradient} flex items-center justify-center`}>
                      <AgentIcon className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div className={`max-w-[80%] ${message.role === 'user' ? 'order-1' : ''}`}>
                    <div
                      className={`rounded-2xl px-4 py-3 ${
                        message.role === 'user'
                          ? `bg-gradient-to-r ${currentAgent.gradient} text-white`
                          : 'bg-slate-800 border border-slate-700 text-slate-200'
                      }`}
                    >
                      <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    </div>
                    {/* Copy button for assistant messages */}
                    {message.role === 'assistant' && (
                      <button
                        onClick={() => handleCopy(message.id, message.content)}
                        className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
                      >
                        {copiedId === message.id ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                  {message.role === 'user' && (
                    <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-slate-700 flex items-center justify-center">
                      <User className="w-5 h-5 text-slate-300" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-4 justify-start">
                  <div className={`flex-shrink-0 w-9 h-9 rounded-lg bg-gradient-to-br ${currentAgent.gradient} flex items-center justify-center`}>
                    <AgentIcon className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </main>

      {/* Input Area */}
      <footer className="border-t border-slate-700/50 bg-slate-900/80 backdrop-blur-sm sticky bottom-0">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                rows={1}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 resize-none transition-all duration-200"
                style={{ minHeight: '48px', maxHeight: '120px' }}
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={`px-5 py-3 bg-gradient-to-r ${currentAgent.gradient} text-white rounded-xl font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2`}
            >
              <Send className="w-4 h-4" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </footer>
    </div>
  );
}

export default App;
