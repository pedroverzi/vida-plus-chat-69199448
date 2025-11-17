import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, Calendar, Users, Brain, Clock, Shield } from "lucide-react";
import ChatbotDrawer from "@/components/ChatbotDrawer";

const Index = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">Clínica Vida+</h1>
            </div>
            <nav className="hidden md:flex gap-6 text-sm font-medium">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Início</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Especialidades</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Sobre</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Contato</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent via-background to-background opacity-60"></div>
        
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/50 border border-accent-foreground/20 mb-6">
              <Brain className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-accent-foreground">Tecnologia + Cuidado Humano</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Atendimento rápido,<br />
              moderno e com apoio de<br />
              <span className="text-primary">Inteligência Artificial</span>
            </h2>
            
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
              Na Clínica Vida+, combinamos tecnologia de ponta com atendimento humanizado para cuidar da sua saúde com excelência.
            </p>

            <Button
              onClick={() => setIsChatOpen(true)}
              size="lg"
              className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              Agende sua consulta aqui
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-2xl bg-card border border-border hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Agendamento Inteligente</h3>
              <p className="text-muted-foreground text-sm">
                Agende consultas 24/7 através do nosso assistente virtual com confirmação instantânea
              </p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-card border border-border hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                <Users className="w-7 h-7 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Equipe Especializada</h3>
              <p className="text-muted-foreground text-sm">
                Profissionais qualificados em diversas especialidades prontos para atender você
              </p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-card border border-border hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Clock className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Atendimento Rápido</h3>
              <p className="text-muted-foreground text-sm">
                Horários flexíveis e atendimento ágil para respeitar seu tempo
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Especialidades */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Nossas Especialidades
            </h2>
            <p className="text-muted-foreground text-lg">
              Atendimento completo para toda a família
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[
              "Clínico Geral",
              "Pediatria",
              "Dermatologia",
              "Cardiologia",
              "Ortopedia",
              "Ginecologia"
            ].map((especialidade, idx) => (
              <div
                key={idx}
                className="px-6 py-4 rounded-xl bg-card border border-border text-center font-medium text-foreground hover:border-primary transition-colors"
              >
                {especialidade}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">Clínica Vida+</span>
          </div>
          <p className="text-muted-foreground text-sm">
            © 2024 Clínica Vida+. Cuidando da sua saúde com tecnologia e humanização.
          </p>
        </div>
      </footer>

      {/* Chatbot Drawer */}
      <ChatbotDrawer isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default Index;
