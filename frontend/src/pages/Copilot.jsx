import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  ShieldCheck, 
  BookOpen, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  Radio
} from 'lucide-react';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export default function Copilot() {
  const { lang, t } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentlySpeakingId, setCurrentlySpeakingId] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const chatEndRef = useRef(null);
  const speechRef = useRef(null);

  const getQuickPrompts = () => {
    if (lang === 'uz') {
      return [
        "Klopidogrel va Omeprazol dori vositalari o'rtasidagi ziddiyatni tekshirish",
        "Og'ir zotiljam (pnevmoniya) davolash bo'yicha shifokor ko'rsatmasi",
        "Shoshilinch o'tkir ishemik insult (FAST) qadamlari",
        "CURB-65 mezonlari va kislorod berish qoidalari"
      ];
    } else if (lang === 'ru') {
      return [
        "Проверить лекарственное взаимодействие Клопидогрела и Омепразола",
        "Протокол антибиотикотерапии тяжелой пневмонии",
        "Экстренный протокол FAST при подозрении на ишемический инсульт",
        "Критерии шкалы CURB-65 и оксигенотерапия"
      ];
    } else {
      return [
        "Check drug interactions between Clopidogrel and Omeprazole",
        "Empiric antibiotic regimen for severe Community-Acquired Pneumonia",
        "Recommend emergency FAST protocol steps for suspected stroke",
        "Calculate CURB-65 criteria and oxygen targets"
      ];
    }
  };

  useEffect(() => {
    // Initial welcome message
    setMessages([
      {
        id: 1,
        sender: 'system',
        text: `MedAI Clinical Copilot (${lang.toUpperCase()}) online. Protocol v2026.4.`,
        timestamp: new Date().toISOString()
      },
      {
        id: 2,
        sender: 'ai',
        text: t('copilot.welcomeMsg'),
        timestamp: new Date().toISOString(),
        suggestedActions: getQuickPrompts().slice(0, 3)
      }
    ]);
  }, [lang]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Clean plain text from markdown for TTS voice synthesis
  const cleanMarkdownForSpeech = (text) => {
    return text
      .replace(/###/g, '')
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/#/g, '')
      .replace(/-/g, ' ')
      .replace(/\n+/g, '. ');
  };

  // Text-To-Speech (TTS)
  const speakText = (text, messageId) => {
    if (!('speechSynthesis' in window)) {
      alert('Brauzeringizda ovozli o‘qish (Text-to-Speech) qo‘llab-quvvatlanmaydi.');
      return;
    }

    if (isSpeaking && currentlySpeakingId === messageId) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setCurrentlySpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = cleanMarkdownForSpeech(text);
    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Language setting
    if (lang === 'uz') {
      utterance.lang = 'uz-UZ';
      utterance.rate = 0.95;
    } else if (lang === 'ru') {
      utterance.lang = 'ru-RU';
      utterance.rate = 1.0;
    } else {
      utterance.lang = 'en-US';
      utterance.rate = 1.0;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setCurrentlySpeakingId(messageId);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setCurrentlySpeakingId(null);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setCurrentlySpeakingId(null);
    };

    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  // Speech-To-Text (Voice Microphone Input)
  const toggleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Brauzeringizda ovozli mikrofondan yozish qo‘llab-quvvatlanmaydi. Google Chrome tavsiya etiladi.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = lang === 'uz' ? 'uz-UZ' : lang === 'ru' ? 'ru-RU' : 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
        // Automatically send voice query
        handleSend(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error('Speech recognition error', err);
      setIsListening(false);
    }
  };

  const handleSend = async (textToSend = null) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await api.sendChatMessage({
        sessionId: 'default-session',
        message: query,
        role: 'doctor',
        language: lang
      });

      const aiMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        text: res.reply,
        timestamp: new Date().toISOString(),
        suggestedActions: res.suggestedFollowUps,
        clinicalCitation: res.medicalReferences?.[0]
      };

      setMessages(prev => [...prev, aiMessage]);

      // Automatically speak the response
      speakText(res.reply, aiMessage.id);
    } catch (err) {
      console.error('Chat error', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-8 max-w-5xl mx-auto flex flex-col h-[calc(100vh-130px)]">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white shadow-lg shadow-cyan-500/20">
            <Bot className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
              {t('copilot.title')}
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono">
                {t('copilot.badge')}
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              {t('copilot.subtitle')}
            </p>
          </div>
        </div>

        {/* Speaking Status Pill */}
        {isSpeaking && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-cyan-950/60 border border-cyan-500/50 text-cyan-300 text-xs font-bold animate-pulse">
            <Radio className="w-4 h-4 text-cyan-400 animate-spin" />
            <span>AI Shifokor Gapirmoqda...</span>
          </div>
        )}
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const isSystem = msg.sender === 'system';
          const isThisSpeaking = isSpeaking && currentlySpeakingId === msg.id;

          if (isSystem) {
            return (
              <div key={msg.id} className="text-center my-2">
                <span className="inline-block px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-400">
                  {msg.text}
                </span>
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className={`flex gap-3.5 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-gradient-to-br from-cyan-600 to-sky-700 text-white rounded-tr-none shadow-lg shadow-cyan-950/40'
                    : 'glass-panel rounded-tl-none border border-slate-800 text-slate-200 shadow-lg'
                }`}
              >
                {/* Message Header */}
                <div className="flex items-center justify-between mb-2 pb-1 border-b border-white/10 text-[10px] opacity-80">
                  <span className="font-bold">{isUser ? 'Shifokor' : 'MedAI Ovozli Shifokor'}</span>
                  <div className="flex items-center gap-2">
                    {!isUser && (
                      <button
                        onClick={() => speakText(msg.text, msg.id)}
                        className={`p-1 rounded hover:bg-slate-800 transition-all cursor-pointer flex items-center gap-1 ${
                          isThisSpeaking ? 'text-cyan-400 font-bold' : 'text-slate-400'
                        }`}
                        title={isThisSpeaking ? t('copilot.stopSpeakBtn') : t('copilot.speakBtn')}
                      >
                        {isThisSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                        <span className="text-[9px]">{isThisSpeaking ? 'To‘xtatish' : 'Ovozli Tinglash'}</span>
                      </button>
                    )}
                    <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>

                {/* Markdown text representation */}
                <div className="space-y-2 whitespace-pre-line font-normal">
                  {msg.text}
                </div>

                {/* AI Citations */}
                {msg.clinicalCitation && (
                  <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-cyan-400 flex items-center gap-1.5 font-medium">
                    <BookOpen className="w-3 h-3" />
                    <span>{t('copilot.citation')} {msg.clinicalCitation}</span>
                  </div>
                )}

                {/* Suggested Followups */}
                {msg.suggestedActions?.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-800 space-y-1.5">
                    <div className="text-[10px] uppercase font-bold text-slate-400">{t('copilot.suggestedFollowUps')}</div>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.suggestedActions.map((action, i) => (
                        <button
                          key={i}
                          onClick={() => handleSend(action)}
                          className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 text-[10px] font-medium border border-slate-700 transition-all cursor-pointer"
                        >
                          + {action}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200 shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-3.5 items-center text-xs text-cyan-400">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="glass-panel px-4 py-3 rounded-2xl rounded-tl-none border border-slate-800 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]" />
              <span className="text-[11px] font-medium text-slate-400 ml-1">{t('diagnostics.analyzing')}</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Quick Prompts Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 shrink-0 scrollbar-none">
        <span className="text-[10px] uppercase font-bold text-slate-400 whitespace-nowrap flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-cyan-400" /> {t('copilot.promptsTitle')}
        </span>
        {getQuickPrompts().map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSend(prompt)}
            className="px-3 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-[11px] font-medium border border-slate-800 whitespace-nowrap transition-all cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box with Microphone Voice Button */}
      <div className="glass-panel p-2 rounded-2xl border border-slate-800 flex items-center gap-2 shrink-0">
        {/* Voice Input Mic Button */}
        <button
          onClick={toggleVoiceInput}
          className={`p-3 rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
            isListening
              ? 'bg-rose-600 text-white animate-pulse shadow-lg shadow-rose-950'
              : 'bg-slate-800 hover:bg-slate-700 text-cyan-400'
          }`}
          title={isListening ? t('copilot.voiceInputStop') : t('copilot.voiceInputStart')}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          {isListening && <span className="text-[10px] font-bold">Tinglanmoqda...</span>}
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={isListening ? t('copilot.voiceInputListening') : t('copilot.inputPlaceholder')}
          className="flex-1 px-3 py-3 bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none"
        />

        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || loading}
          className="p-3 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-white shadow-md shadow-cyan-600/25 transition-all disabled:opacity-40 cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
