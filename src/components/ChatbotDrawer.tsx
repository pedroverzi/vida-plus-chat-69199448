import { useState, useEffect, useRef } from "react";
import { X, Send, Bot, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: number;
  text: string;
  sender: "bot" | "user";
  options?: string[];
  showBackButton?: boolean;
}

interface ChatbotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

type FlowState = 
  | "menu"
  | "agendamento_nome"
  | "agendamento_email"
  | "agendamento_cpf"
  | "agendamento_horario"
  | "cancelamento_cpf"
  | "cancelamento_motivo";

const ChatbotDrawer = ({ isOpen, onClose }: ChatbotDrawerProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [flowState, setFlowState] = useState<FlowState>("menu");
  const [userData, setUserData] = useState({
    nome: "",
    email: "",
    cpf: "",
    horario: "",
  });
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const menuOptions = [
    "Agendar uma consulta",
    "Ver horários disponíveis",
    "Saber especialidades",
    "Falar com atendente",
    "Cancelar ou remarcar consulta"
  ];

  const horariosDisponiveis = [
    "Segunda 09:00",
    "Segunda 14:00",
    "Terça 10:00",
    "Quarta 15:00",
    "Quinta 11:00",
    "Sexta 16:00"
  ];

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        showMenu();
      }, 500);
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const showMenu = () => {
    setFlowState("menu");
    setMessages([{
      id: Date.now(),
      text: "Olá! Sou o assistente virtual da Clínica Vida+. Como posso ajudar?",
      sender: "bot",
      options: menuOptions
    }]);
  };

  const addBotMessage = (text: string, options?: string[], showBackButton = true) => {
    const botMessage: Message = {
      id: Date.now(),
      text,
      sender: "bot",
      options,
      showBackButton
    };
    setMessages(prev => [...prev, botMessage]);
  };

  const addUserMessage = (text: string) => {
    const userMessage: Message = {
      id: Date.now(),
      text,
      sender: "user"
    };
    setMessages(prev => [...prev, userMessage]);
  };

  const handleBackToMenu = () => {
    setUserData({ nome: "", email: "", cpf: "", horario: "" });
    setInputValue("");
    setTimeout(() => {
      addBotMessage(
        "Voltando ao menu principal...",
        menuOptions,
        false
      );
      setFlowState("menu");
    }, 300);
  };

  const handleOptionClick = (option: string) => {
    addUserMessage(option);

    setTimeout(() => {
      if (option === "Agendar uma consulta") {
        setFlowState("agendamento_nome");
        addBotMessage("Perfeito! Vamos agendar sua consulta. Para começar, qual é o seu nome completo?");
      } else if (option === "Ver horários disponíveis") {
        addBotMessage(
          "📅 Horários de funcionamento da Clínica Vida+:\n\n• Segunda a Sexta: 08h00 - 18h00\n• Sábado: 08h00 - 12h00\n• Domingo: Fechado\n\nEstamos prontos para te atender!",
          menuOptions
        );
        setFlowState("menu");
      } else if (option === "Saber especialidades") {
        addBotMessage(
          "🏥 Sobre a Clínica Vida+:\n\nSomos uma clínica moderna com atendimento de excelência! Contamos com profissionais especializados nas seguintes áreas:\n\n• 👨‍⚕️ Clínico Geral - Consultas de rotina e check-ups\n• 👶 Pediatria - Cuidados com a saúde infantil\n• 💆 Dermatologia - Tratamentos de pele, cabelo e unhas\n• ❤️ Cardiologia - Saúde do coração\n• 🦴 Ortopedia - Tratamento de ossos e articulações\n• 🧠 Neurologia - Saúde neurológica\n• 🔬 Exames Laboratoriais - Análises clínicas completas\n\nTodos os nossos médicos são certificados e atualizados com as melhores práticas da medicina moderna.",
          menuOptions
        );
        setFlowState("menu");
      } else if (option === "Falar com atendente") {
        addBotMessage(
          "📞 Conectando você com um atendente humano... Por favor, aguarde alguns instantes. Em breve você será atendido!",
          menuOptions
        );
        setFlowState("menu");
      } else if (option === "Cancelar ou remarcar consulta") {
        setFlowState("cancelamento_cpf");
        addBotMessage("Para localizar sua consulta, por favor informe seu CPF (apenas números):");
      }
    }, 800);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    addUserMessage(inputValue);
    const value = inputValue.trim();
    setInputValue("");

    setTimeout(() => {
      if (flowState === "agendamento_nome") {
        setUserData(prev => ({ ...prev, nome: value }));
        setFlowState("agendamento_email");
        addBotMessage(`Muito bem, ${value}! Agora, qual é o seu e-mail?`);
      } else if (flowState === "agendamento_email") {
        setUserData(prev => ({ ...prev, email: value }));
        setFlowState("agendamento_cpf");
        addBotMessage("Ótimo! Para finalizar, informe seu CPF (apenas números):");
      } else if (flowState === "agendamento_cpf") {
        setUserData(prev => ({ ...prev, cpf: value }));
        setFlowState("agendamento_horario");
        addBotMessage(
          "Perfeito! Agora selecione um dos horários disponíveis:",
          horariosDisponiveis
        );
      } else if (flowState === "cancelamento_cpf") {
        const cpfConsulta = value;
        const dataFicticia = "15/12/2025 às 14:30";
        setUserData(prev => ({ ...prev, cpf: cpfConsulta }));
        setFlowState("cancelamento_motivo");
        addBotMessage(
          `✅ Consulta encontrada!\n\n📅 Data: ${dataFicticia}\n👨‍⚕️ Especialidade: Cardiologia\n🏥 Dr. Carlos Silva\n\nPor favor, informe o motivo do cancelamento:`
        );
      } else if (flowState === "cancelamento_motivo") {
        addBotMessage(
          `✅ Consulta cancelada com sucesso!\n\nMotivo registrado: "${value}"\n\nSe precisar remarcar, é só voltar ao menu e escolher "Agendar uma consulta".`,
          menuOptions
        );
        setFlowState("menu");
        setUserData({ nome: "", email: "", cpf: "", horario: "" });
      }
    }, 800);
  };

  const handleHorarioClick = (horario: string) => {
    addUserMessage(horario);
    setUserData(prev => ({ ...prev, horario }));

    setTimeout(() => {
      addBotMessage(
        `✅ Consulta agendada com sucesso!\n\n👤 Nome: ${userData.nome}\n📧 E-mail: ${userData.email}\n📱 CPF: ${userData.cpf}\n📅 Horário: ${horario}\n\n🎉 Você receberá uma confirmação por e-mail em breve. Obrigado por escolher a Clínica Vida+!`,
        menuOptions
      );
      setFlowState("menu");
      setUserData({ nome: "", email: "", cpf: "", horario: "" });
    }, 800);
  };

  const isInputEnabled = [
    "agendamento_nome",
    "agendamento_email",
    "agendamento_cpf",
    "cancelamento_cpf",
    "cancelamento_motivo"
  ].includes(flowState);

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
                          onClick={() => {
                            if (flowState === "agendamento_horario") {
                              handleHorarioClick(option);
                            } else {
                              handleOptionClick(option);
                            }
                          }}
                          className="w-full text-left px-4 py-2.5 rounded-xl border-2 border-primary/20 hover:border-primary hover:bg-accent transition-all duration-200 text-sm font-medium text-foreground"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Back to Menu Button */}
                  {message.showBackButton && message.sender === "bot" && flowState !== "menu" && (
                    <div className="mt-3">
                      <button
                        onClick={handleBackToMenu}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all duration-200 text-sm font-medium"
                      >
                        <Home className="w-4 h-4" />
                        Voltar ao Menu
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Input
                placeholder={isInputEnabled ? "Digite sua mensagem..." : "Use as opções acima"}
                className="flex-1"
                disabled={!isInputEnabled}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && isInputEnabled) {
                    handleSendMessage();
                  }
                }}
              />
              <Button 
                size="icon" 
                className="shrink-0" 
                disabled={!isInputEnabled || !inputValue.trim()}
                onClick={handleSendMessage}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              {isInputEnabled ? "Digite e pressione Enter ou clique em enviar" : "Use as opções acima para interagir"}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatbotDrawer;
