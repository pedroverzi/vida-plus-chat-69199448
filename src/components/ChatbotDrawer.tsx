import { useState, useEffect, useRef } from "react";
import { X, Send, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: number;
  text: string;
  sender: "bot" | "user";
  options?: string[];
}

interface ChatbotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatbotDrawer = ({ isOpen, onClose }: ChatbotDrawerProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const chatFlow = {
    initial: {
      text: "Olá! Sou o assistente virtual da Clínica Vida+. Como posso ajudar?",
      options: [
        "Agendar uma consulta",
        "Ver horários disponíveis",
        "Saber especialidades",
        "Falar com atendente",
        "Cancelar ou remarcar consulta"
      ]
    },
    responses: {
      "Agendar uma consulta": "Para agendar sua consulta, por favor informe seu nome completo e o horário desejado. Nossa equipe entrará em contato em breve para confirmar!",
      "Ver horários disponíveis": "📅 Horários disponíveis esta semana:\n\n• Segunda a Sexta: 08h - 18h\n• Sábado: 08h - 12h\n\nQual horário prefere?",
      "Saber especialidades": "🏥 Especialidades atendidas:\n\n• Clínico Geral\n• Pediatria\n• Dermatologia\n• Cardiologia\n• Ortopedia\n\nQual especialidade você precisa?",
      "Falar com atendente": "📞 Conectando você com um atendente humano... Por favor, aguarde alguns instantes. Em breve você será atendido!",
      "Cancelar ou remarcar consulta": "Para cancelar ou remarcar sua consulta, informe seu nome completo e a data da consulta agendada. Vamos ajudar você!"
    }
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        setMessages([{
          id: Date.now(),
          text: chatFlow.initial.text,
          sender: "bot",
          options: chatFlow.initial.options
        }]);
      }, 500);
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleOptionClick = (option: string) => {
    const userMessage: Message = {
      id: Date.now(),
      text: option,
      sender: "user"
    };

    setMessages(prev => [...prev, userMessage]);

    setTimeout(() => {
      const botResponse: Message = {
        id: Date.now() + 1,
        text: chatFlow.responses[option as keyof typeof chatFlow.responses],
        sender: "bot",
        options: chatFlow.initial.options
      };
      setMessages(prev => [...prev, botResponse]);
    }, 800);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300 z-40 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full md:w-[400px] bg-card shadow-2xl transform transition-transform duration-300 ease-out z-50 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-primary text-primary-foreground">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold">Assistente Virtual</h3>
                <p className="text-xs opacity-90">Clínica Vida+</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id}>
                  <div
                    className={`flex ${
                      message.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                        message.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line">{message.text}</p>
                    </div>
                  </div>

                  {/* Options */}
                  {message.options && message.sender === "bot" && (
                    <div className="mt-3 space-y-2">
                      {message.options.map((option, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleOptionClick(option)}
                          className="w-full text-left px-4 py-2.5 rounded-xl border-2 border-primary/20 hover:border-primary hover:bg-accent transition-all duration-200 text-sm font-medium text-foreground"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Input (decorativo) */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Input
                placeholder="Digite sua mensagem..."
                className="flex-1"
                disabled
              />
              <Button size="icon" className="shrink-0" disabled>
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Use as opções acima para interagir
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatbotDrawer;
