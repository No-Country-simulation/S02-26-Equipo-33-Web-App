"use client";

import { useState, useEffect } from 'react'; 
import Link from 'next/link';
import { 
  Search, ArrowLeft, Send, Paperclip, Smile, 
  MoreVertical, Info, Check, CheckCheck 
} from 'lucide-react';
import { getConversations, getMessages, sendMessage } from '@/app/actions/chat';

export default function ChatClient({ currentUser }: { currentUser: any }) {
  
    // --- ESTADOS ---
    const [conversations, setConversations] = useState<any[]>([]);
    const [messages, setMessages] = useState<any[]>([]);   
    const [activeChatId, setActiveChatId] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState("");
    const [showMobileChat, setShowMobileChat] = useState(false);
    const [loading, setLoading] = useState(true);

    // Cargar la lista de chats 
    useEffect(() => {
    async function loadInitialData() {
        const data = await getConversations();
        setConversations(data);
        if (data.length > 0) setActiveChatId(data[0]._id); // Selecciona el primero por defecto
        setLoading(false);
    }
    loadInitialData();
    }, []);

    // Cargar mensajes cuando tocas un chat diferente
    useEffect(() => {
    if (activeChatId) {
        async function loadMessages() {
        const data = await getMessages(activeChatId!);
        setMessages(data);
        }
        loadMessages();
        const timer = setInterval(loadMessages, 5000);
        return () => clearInterval(timer);
    }
    }, [activeChatId]);


  // Derivados
    const activeConversation = conversations.find(c => c._id === activeChatId);
  

  // --- HANDLERS ---
  const handleSelectChat = (id: string) => {
    setActiveChatId(id);
    setShowMobileChat(true);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChatId) return;

    const textToSend = newMessage;
    setNewMessage("");

    try {
        await sendMessage(activeChatId, textToSend);
        const updatedMessages = await getMessages(activeChatId);
        setMessages(updatedMessages);
    } catch (error) {
        console.error("No se pudo enviar:", error);
    }
  };

  return (
    <div className="flex h-screen bg-equestrian-sand font-sans overflow-hidden pt-16"> {/* pt-16 para esquivar el header global si lo tuvieras */}
      
      {/* ==========================================
          COLUMNA IZQUIERDA: LISTA DE CHATS
          ========================================== */}
      <aside className={`w-full md:w-[380px] flex flex-col bg-white border-r border-slate-200 ${showMobileChat ? 'hidden md:flex' : 'flex'}`}>
        
        {/* Cabecera de la lista */}
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

        {/* Lista de Conversaciones */}
        <div className="flex-1 overflow-y-auto">
          {conversations.map((chat) => (
            <button
              key={chat._id}
              onClick={() => handleSelectChat(chat._id)}
              className={`w-full text-left flex gap-4 p-4 border-b border-slate-100 transition-colors hover:bg-slate-50 ${activeChatId === chat._id ? 'bg-equestrian-navy/5 border-l-4 border-l-equestrian-navy' : 'border-l-4 border-l-transparent'}`}
            >
              {/* Avatar con Fallback */}
              <div className="relative shrink-0">
                {chat.other_participant.profile_picture_url ? (
                  <img 
                    src={chat.other_participant.profile_picture_url} 
                    alt={chat.other_participant.full_name} 
                    className="w-12 h-12 rounded-full object-cover border border-slate-200" 
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-equestrian-gold/20 flex items-center justify-center text-equestrian-gold font-serif text-xl font-bold border border-equestrian-gold/30">
                    {chat.other_participant.full_name.charAt(0)}
                  </div>
                )}
                
                {chat.unread_count > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full"></span>
                )}
              </div>
              
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <p className="text-slate-900 font-bold text-sm truncate">{chat.other_participant.full_name}</p>
                  <p className={`text-xs whitespace-nowrap ml-2 ${chat.unread_count > 0 ? 'text-equestrian-navy font-bold' : 'text-slate-400'}`}>
                    {chat.last_message.sent_at}
                  </p>
                </div>
                <p className={`text-sm truncate ${chat.unread_count > 0 ? 'text-slate-900 font-bold' : 'text-slate-500'}`}>
                  {chat.last_message.text}
                </p>
                <p className="text-xs text-equestrian-gold font-medium mt-1 truncate">
                  Ref: {chat.horse_id.name}
                </p>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* ==========================================
          COLUMNA DERECHA: ÁREA DE CHAT ACTIVO
          ========================================== */}
      <main className={`flex-1 flex flex-col bg-[#f8f9fa] ${!showMobileChat ? 'hidden md:flex' : 'flex'}`}>
        
        {activeConversation ? (
          <>
            {/* Cabecera del Chat */}
            <header className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white shadow-sm z-10">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setShowMobileChat(false)}
                  className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <img 
                  src={activeConversation.horse_id.mainPhoto} 
                  alt="Caballo" 
                  className="w-12 h-12 rounded-lg object-cover border border-slate-200"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-slate-900 font-bold">{activeConversation.other_participant.full_name}</h2>
                    <span className="bg-equestrian-gold/20 text-equestrian-navy text-[10px] px-2 py-0.5 rounded font-black uppercase tracking-wider">
                      Interesado
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-500">
                    Consultando por <Link href={`/marketplace/${activeConversation.horse_id._id}`} className="text-equestrian-gold hover:underline">{activeConversation.horse_id.name}</Link>
                  </p>
                </div>
              </div>
              
              <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </header>

            {/* Área de Mensajes */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
              
              <div className="flex justify-center mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-200/50 px-3 py-1 rounded-full">
                  Hoy
                </span>
              </div>

              {messages.map((msg) => {
                const isMine = msg.sender_id === currentUser._id;
                return (
                  <div key={msg._id} className={`flex max-w-[80%] ${isMine ? 'self-end flex-row-reverse' : 'self-start'}`}>
                    <div className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                      <div className={`p-3.5 shadow-sm text-sm ${
                        isMine 
                          ? 'bg-equestrian-navy text-white rounded-2xl rounded-tr-sm' 
                          : 'bg-white border border-slate-200 text-slate-800 rounded-2xl rounded-tl-sm'
                      }`}>
                        <p className="leading-relaxed">{msg.text}</p>
                      </div>
                      <div className="flex items-center gap-1 mt-1 px-1">
                        <span className="text-[10px] text-slate-400 font-medium">{msg.sent_at}</span>
                        {isMine && (
                          msg.is_read ? <CheckCheck className="w-3 h-3 text-blue-500" /> : <Check className="w-3 h-3 text-slate-400" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input para Escribir */}
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
                      handleSendMessage(e);
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
              <div className="flex items-center justify-center gap-1 mt-3 text-slate-400">
                <Info className="w-3 h-3" />
                <p className="text-[10px] font-medium uppercase tracking-wider">
                  Mantené las conversaciones dentro de HorseTrust por seguridad.
                </p>
              </div>
            </div>
          </>
        ) : (
          /* Estado Vacío (Ningún chat seleccionado) */
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