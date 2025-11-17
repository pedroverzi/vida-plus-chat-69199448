import { useState, useEffect, useRef } from "react";
import { X, Send, Bot, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: number;
  text: string;
  sender: "bot" | "user";
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

  const horariosDisponiveis = [
    "Segunda 09:00",
    "Segunda 14:00",
    "Terça 10:00",
    "Quarta 15:00",
    "Quinta 11:00",
    "Sexta 16:00"
  ];

  // Normalização para interpretação do texto
  const normalize = (text: string) =>
    text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // Detecta o que o usuário quer no menu
  const detectMenuOption = (text: string) => {
    const t = normalize(text);

    if (t.includes("agendar") || t.includes("consulta") || t.includes("marcar"))
      return "agendar";

    if (t.includes("horario") || t.includes("funcionamento"))
      return "horarios";

    if (t.includes("especialidade") || t.includes("medico") || t.includes("medicos"))
      return "especialidades";

    if (t.includes("atendente") || t.includes("humano") || t.includes("pessoa"))
      return "atendente";

    if (t.includes("cancelar") || t.includes("remarcar"))
      return "cancelar";

    return null;
  };

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
    setMessages([
      {
        id: Date.now(),
        text:
          "Olá! Sou o assistente virtual da Clínica Vida+. Como posso ajudar?\n\n" +
          "Tente algo como:\n" +
          "• Agendar consulta\n" +
          "• Ver horários\n" +
          "• Especialidades\n" +
          "• Falar com atendente\n" +
          "• Cancelar consulta",
        sender: "bot",
      },
    ]);
  };

  const addBotMessage = (text: string, showBackButton = true) => {
    const botMessage: Message = {
      id: Date.now(),
      text,
      sender: "bot",
      showBackButton
    };
    setMessages((prev) => [...prev, botMessage]);
  };

  const addUserMessage = (text: string) => {
    const userMessage: Message = {
      id: Date.now(),
      text,
      sender: "user"
    };
    setMessages((prev) => [...prev, userMessage]);
  };

  const handleBackToMenu = () => {
    setUserData({ nome: "", email: "", cpf: "", horario: "" });
    setInputValue("");
    setTimeout(() => {
      addBotMessage("Voltando ao menu principal...", false);
      showMenu();
    }, 300);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const value = inputValue.trim();
    addUserMessage(value);
    setInputValue("");

    // MENU → interpretar texto
    if (flowState === "menu") {
      const detected = detectMenuOption(value);

      if (!detected) {
        addBotMessage(
          "Desculpe, não entendi. Você pode tentar:\n" +
          "• agendar consulta\n• horários disponíveis\n• especialidades\n• falar com atendente\n• cancelar consulta"
        );
        return;
      }

      // Ações do menu
      if (detected === "agendar") {
        setFlowState("agendamento_nome");
        addBotMessage("Perfeito! Vamos agendar sua consulta. Qual é o seu nome completo?");
        return;
      }

      if (detected === "horarios") {
        addBotMessage(
          "📅 Horários de funcionamento:\n\n" +
          "Seg–Sex: 08h00 - 18h00\n" +
          "Sábado: 08h00 - 12h00\n" +
          "Domingo: Fechado"
        );
        return;
      }

      if (detected === "especialidades") {
        addBotMessage(
          "🏥 Especialidades da Clínica Vida+:\n\n" +
          "• Clínico Geral\n" +
          "• Pediatria\n" +
          "• Dermatologia\n" +
          "• Cardiologia\n" +
          "• Ortopedia\n" +
          "• Neurologia"
        );
        return;
      }

      if (detected === "atendente") {
        addBotMessage("📞 Conectando você com um atendente humano...");
        return;
      }

      if (detected === "cancelar") {
        setFlowState("cancelamento_cpf");
        addBotMessage("Por favor, informe seu CPF (somente números):");
        return;
      }
    }

    // AGENDAMENTO → fluxo normal
    if (flowState === "agendamento_nome") {
      setUserData((prev) => ({ ...prev, nome: value }));
      setFlowState("agendamento_email");
      addBotMessage(`Muito bem, ${value}! Agora, qual é o seu e-mail?`);
      return;
    }

    if (flowState === "agendamento_email") {
      setUserData((prev) => ({ ...prev, email: value }));
      setFlowState("agendamento_cpf");
      addBotMessage("Ótimo! Agora informe seu CPF:");
      return;
    }

    if (flowState === "agendamento_cpf") {
      setUserData((prev) => ({ ...prev, cpf: value }));
      setFlowState("agendamento_horario");

      addBotMessage(
        "Perfeito! Agora digite um dos horários disponíveis:\n\n" +
        horariosDisponiveis.map((h) => `• ${h}`).join("\n")
      );
      return;
    }

    if (flowState === "agendamento_horario") {
      if (!horariosDisponiveis.includes(value)) {
        addBotMessage(
          "Esse horário não está disponível. Tente um destes:\n\n" +
          horariosDisponiveis.map((h) => `• ${h}`).join("\n")
        );
        return;
      }

      addBotMessage(
        `✅ Consulta agendada com sucesso!\n\n` +
        `👤 Nome: ${userData.nome}\n` +
        `📧 E-mail: ${userData.email}\n` +
        `📱 CPF: ${userData.cpf}\n` +
        `📅 Horário: ${value}\n\n` +
        `Obrigado por escolher a Clínica Vida+!`
      );

      setFlowState("menu");
      return;
    }

    // CANCELAMENTO → fluxo normal
    if (flowState === "cancelamento_cpf") {
      setUserData((prev) => ({ ...prev, cpf: value }));

      addBotMessage(
        `Consulta encontrada:\n\n📅 15/12/2025 às 14:30\n` +
        `👨‍⚕️ Cardiologia – Dr. Carlos\n\n` +
        "Informe o motivo do cancelamento:"
      );
      setFlowState("cancelamento_motivo");
      return;
    }

    if (flowState === "cancelamento_motivo") {
      addBotMessage(
        `Consulta cancelada.\n\nMotivo registrado: "${value}"\n\n` +
        `Se quiser remarcar, basta digitar "agendar consulta".`
      );
      setFlowState("menu");
      return;
    }
  };

  const isInputEnabled = true;

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300 z-40 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

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
                  <div className={`flex ${
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

                  {/* Botão Voltar */}
                  {message.showBackButton && flowState !== "menu" && (
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
                placeholder="Digite sua mensagem..."
                className="flex-1"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSendMessage();
                }}
              />
              <Button size="icon" className="shrink-0" onClick={handleSendMessage}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Digite e pressione Enter ou clique em enviar
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatbotDrawer;
