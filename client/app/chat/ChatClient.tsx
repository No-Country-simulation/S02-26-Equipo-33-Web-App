"use client";

import { useState, useEffect } from 'react'; 
import Link from 'next/link';
import { 
  Search, ArrowLeft, Send, Paperclip, Smile, 
  MoreVertical, Info, Check, CheckCheck 
} from 'lucide-react';
import { getConversations, getMessages, sendMessage } from '@/app/actions/chat';

export default function ChatClient({ currentUser }: { currentUser: any }) {
  
    const [conversations, setConversations] = useState<any[]>([]);
    const [messages, setMessages] = useState<any[]>([]);   
    const [activeChatId, setActiveChatId] = useState<number | string | null>(null);
    const [newMessage, setNewMessage] = useState("");
    const [showMobileChat, setShowMobileChat] = useState(false);

    useEffect(() => {
      async function loadInitialData() {
        const data = await getConversations();
        setConversations(data || []); 
        if (data && data.length > 0) {
          setActiveChatId(data[0].ID); 
        }
      }
      loadInitialData();
    }, []);

    useEffect(() => {
      if (activeChatId) {
        async function loadMessages() {
          const data = await getMessages(activeChatId!.toString());
          setMessages(data || []);
        }
        loadMessages();
        const timer = setInterval(loadMessages, 5000); // Refresco cada 5 seg
        return () => clearInterval(timer);
      }
    }, [activeChatId]);

  const activeConversation = conversations.find(c => c.ID === activeChatId);
  
  const handleSelectChat = (id: number | string) => {
    setActiveChatId(id);
    setShowMobileChat(true);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChatId) return;

    const textToSend = newMessage;
    setNewMessage("");

    try {
        await sendMessage(activeChatId.toString(), textToSend);
        const updatedMessages = await getMessages(activeChatId.toString());
        setMessages(updatedMessages || []);
    } catch (error) {
        console.error("No se pudo enviar:", error);
    }
  };

  const formatTime = (isoString: string) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex h-screen bg-equestrian-sand font-sans overflow-hidden pt-16">
      
      {/* ==========================================
          COLUMNA IZQUIERDA: LISTA DE CHATS
          ========================================== */}
      <aside className={`w-full md:w-[380px] flex flex-col bg-white border-r border-slate-200 ${showMobileChat ? 'hidden md:flex' : 'flex'}`}>
        
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <h1 className="text-xl font-black text-equestrian-navy mb-4">Mensajes</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar conversaciones..." 
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-equestrian-navy/20 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.map((chat) => {
            const chatId = chat.ID;
            const fullName = chat.OTHER_USER || "Usuario Desconocido";
            const horseName = chat.HORSE_NAME || "Caballo consultado";
            const lastUpdate = formatTime(chat.UPDATED_AT);
            
            return (
              <button
                key={chatId}
                onClick={() => handleSelectChat(chatId)}
                className={`w-full text-left flex gap-4 p-4 border-b border-slate-100 transition-colors hover:bg-slate-50 ${activeChatId === chatId ? 'bg-equestrian-navy/5 border-l-4 border-l-equestrian-navy' : 'border-l-4 border-l-transparent'}`}
              >
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-full bg-equestrian-gold/20 flex items-center justify-center text-equestrian-gold font-serif text-xl font-bold border border-equestrian-gold/30">
                    {fullName.charAt(0).toUpperCase()}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <p className="text-slate-900 font-bold text-sm truncate">{fullName}</p>
                    <p className="text-xs whitespace-nowrap ml-2 text-slate-400">
                      {lastUpdate}
                    </p>
                  </div>
                  <p className="text-sm truncate text-slate-500">
                    Ver mensajes...
                  </p>
                  <p className="text-xs text-equestrian-gold font-medium mt-1 truncate">
                    Ref: {horseName}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* ==========================================
          COLUMNA DERECHA: ÁREA DE CHAT ACTIVO
          ========================================== */}
      <main className={`flex-1 flex flex-col bg-[#f8f9fa] ${!showMobileChat ? 'hidden md:flex' : 'flex'}`}>
        
        {activeConversation ? (() => {
          const fullName = activeConversation.OTHER_USER || "Usuario";
          const horseName = activeConversation.HORSE_NAME || "Caballo consultado";
          const horseId = activeConversation.HORSE_ID;

          return (
            <>
              <header className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white shadow-sm z-10">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setShowMobileChat(false)}
                    className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  
                  <div className="w-10 h-10 rounded-full bg-equestrian-navy text-white flex items-center justify-center font-bold">
                    {fullName.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-slate-900 font-bold">{fullName}</h2>
                    </div>
                    <p className="text-xs font-bold text-slate-500">
                      Consultando por <Link href={`/marketplace/${horseId}`} className="text-equestrian-gold hover:underline">{horseName}</Link>
                    </p>
                  </div>
                </div>
                
                <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </header>

              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 custom-scrollbar">
                
                {messages.map((msg) => {
                  const msgId = msg.ID;
                  const msgText = msg.CONTENT;
                  const msgTime = formatTime(msg.SENT_AT);
                  const isRead = msg.IS_READ === 1;
                  
                  const currentUserName = currentUser.full_name || currentUser.NAME || currentUser.name || "";
                  const isMine = msg.SENDER_NAME === currentUserName || msg.SENDER_ID === (currentUser.ID || currentUser.id || currentUser._id);

                  return (
                    <div key={msgId} className={`flex max-w-[80%] ${isMine ? 'self-end flex-row-reverse' : 'self-start'}`}>
                      <div className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                        <div className={`p-3.5 shadow-sm text-sm ${
                          isMine 
                            ? 'bg-equestrian-navy text-white rounded-2xl rounded-tr-sm' 
                            : 'bg-white border border-slate-200 text-slate-800 rounded-2xl rounded-tl-sm'
                        }`}>
                          <p className="leading-relaxed">{msgText}</p>
                        </div>
                        <div className="flex items-center gap-1 mt-1 px-1">
                          <span className="text-[10px] text-slate-400 font-medium">{msgTime}</span>
                          {isMine && (
                            isRead ? <CheckCheck className="w-3 h-3 text-blue-500" /> : <Check className="w-3 h-3 text-slate-400" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 bg-white border-t border-slate-200">
                <form onSubmit={handleSendMessage} className="flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-equestrian-navy/20 transition-all">
                  <button type="button" className="p-2.5 text-slate-400 hover:text-equestrian-navy hover:bg-slate-200/50 rounded-xl transition-colors shrink-0">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  
                  <textarea 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e as any);
                      }
                    }}
                    placeholder="Escribí un mensaje..." 
                    className="w-full bg-transparent border-none text-sm text-slate-800 focus:ring-0 p-2.5 resize-none max-h-32 custom-scrollbar placeholder:text-slate-400"
                    rows={1}
                  />
                  
                  <div className="flex items-center gap-1 shrink-0 pb-1">
                    <button type="button" className="p-2 text-slate-400 hover:text-equestrian-navy transition-colors hidden sm:block">
                      <Smile className="w-5 h-5" />
                    </button>
                    <button 
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="bg-equestrian-gold hover:bg-equestrian-gold/90 disabled:bg-slate-200 disabled:text-slate-400 text-equestrian-navy p-2.5 rounded-xl transition-colors shadow-sm"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </form>
              </div>
            </>
          );
        })() : (
          <div className="flex-1 flex flex-col items-center justify-center bg-slate-50/50">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mb-4">
              <Send className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">Tus Mensajes</h3>
            <p className="text-sm text-slate-500 max-w-sm text-center">
              Seleccioná una conversación a la izquierda para ver el historial o responder consultas.
            </p>
          </div>
        )}
      </main>

    </div>
  );
}