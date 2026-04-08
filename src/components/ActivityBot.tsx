import { useState } from "react";
import { Bot, X, ChevronRight, Phone, Mail, Users, Monitor, ArrowUpRight, FileText, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useActivities } from "@/contexts/ActivityContext";
import { leads, currentUser } from "@/lib/mock-data";
import { ActivityType, Priority } from "@/lib/types";

type Step = "idle" | "type" | "lead" | "details" | "notes" | "done";

const typeOptions: { value: ActivityType; label: string; icon: typeof Phone; color: string }[] = [
  { value: "call",      label: "Call",      icon: Phone,       color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  { value: "meeting",   label: "Meeting",   icon: Users,       color: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
  { value: "email",     label: "Email",     icon: Mail,        color: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  { value: "demo",      label: "Demo",      icon: Monitor,     color: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20" },
  { value: "follow-up", label: "Follow-up", icon: ArrowUpRight, color: "bg-orange-500/10 text-orange-500 border-orange-500/20" },
  { value: "note",      label: "Note",      icon: FileText,    color: "bg-green-500/10 text-green-500 border-green-500/20" },
];

interface BotMessage {
  from: "bot" | "user";
  text: string;
}

export function ActivityBot() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("idle");
  const [selectedType, setSelectedType] = useState<ActivityType | "">("");
  const [selectedLeadId, setSelectedLeadId] = useState("");
  const [title, setTitle] = useState("");
  const [dateTime, setDateTime] = useState(() => new Date().toISOString().slice(0, 16));
  const [priority, setPriority] = useState<Priority>("medium");
  const [notes, setNotes] = useState("");
  const [messages, setMessages] = useState<BotMessage[]>([
    { from: "bot", text: "👋 Hi! I'm your Activity Assistant. I can help you log calls, meetings, emails, notes and more. Ready to log an activity?" },
  ]);
  const { addActivity } = useActivities();

  const pushMessage = (from: BotMessage["from"], text: string) => {
    setMessages((prev) => [...prev, { from, text }]);
  };

  const handleOpen = () => {
    setOpen(true);
    if (step === "idle") setStep("type");
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleReset = () => {
    setStep("type");
    setSelectedType("");
    setSelectedLeadId("");
    setTitle("");
    setDateTime(new Date().toISOString().slice(0, 16));
    setPriority("medium");
    setNotes("");
    setMessages([
      { from: "bot", text: "✅ Activity logged! Want to log another one?" },
    ]);
  };

  const handleSelectType = (type: ActivityType) => {
    setSelectedType(type);
    const label = typeOptions.find(t => t.value === type)?.label ?? type;
    pushMessage("user", `Log a ${label}`);
    pushMessage("bot", `Great! Which lead is this ${label.toLowerCase()} for?`);
    setStep("lead");
  };

  const handleSelectLead = (leadId: string) => {
    setSelectedLeadId(leadId);
    const leadName = leads.find(l => l.id === leadId)?.name ?? "";
    pushMessage("user", leadName);
    pushMessage("bot", `Got it! Now give this activity a title and set the date/time and priority.`);
    setStep("details");
  };

  const handleDetailsNext = () => {
    if (!title.trim()) return;
    pushMessage("user", `Title: "${title}" at ${new Date(dateTime).toLocaleString()}`);
    pushMessage("bot", `Almost done! Any notes or observations from this interaction? (optional)`);
    setStep("notes");
  };

  const handleSubmit = () => {
    const newActivity = {
      id: `a${Date.now()}`,
      title: title.trim(),
      description: notes.trim() || `${selectedType} activity logged via bot`,
      type: selectedType as ActivityType,
      leadId: selectedLeadId,
      assignedTo: currentUser.id,
      dateTime,
      status: "completed" as const,
      priority,
      notes: notes.trim() || undefined,
      createdAt: new Date().toISOString(),
    };
    addActivity(newActivity);
    const leadName = leads.find(l => l.id === selectedLeadId)?.name ?? "";
    pushMessage("user", notes.trim() || "(no notes)");
    pushMessage("bot", `✅ Activity logged successfully for ${leadName}! You can view it in the Activities & Timeline pages.`);
    setStep("done");
  };

  const selectedTypeInfo = typeOptions.find(t => t.value === selectedType);

  return (
    <>
      {/* Floating Button */}
      <button
        id="activity-bot-trigger"
        onClick={handleOpen}
        className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full shadow-2xl text-white font-semibold text-sm transition-all duration-300 ${
          open ? "scale-0 opacity-0" : "scale-100 opacity-100"
        }`}
        style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" }}
      >
        <Sparkles className="h-4 w-4" />
        Log Activity
        <Bot className="h-4 w-4" />
      </button>

      {/* Bot Panel */}
      <div
        className={`fixed bottom-6 right-6 z-50 w-[370px] max-h-[600px] bg-background border border-border rounded-2xl shadow-2xl flex flex-col transition-all duration-300 origin-bottom-right ${
          open ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 rounded-t-2xl border-b border-border"
          style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" }}>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Activity Assistant</p>
              <p className="text-[10px] text-white/70 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400 inline-block" /> Online
              </p>
            </div>
          </div>
          <button onClick={handleClose} className="text-white/70 hover:text-white transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0" style={{ maxHeight: "300px" }}>
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
              {msg.from === "bot" && (
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-2 shrink-0 mt-0.5">
                  <Bot className="h-3 w-3 text-primary" />
                </div>
              )}
              <div
                className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                  msg.from === "bot"
                    ? "bg-muted text-foreground rounded-tl-sm"
                    : "bg-primary text-primary-foreground rounded-tr-sm"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="border-t border-border p-4 space-y-3">
          {/* STEP: Choose Type */}
          {step === "type" && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground font-medium">Select activity type:</p>
              <div className="grid grid-cols-3 gap-2">
                {typeOptions.map((t) => (
                  <button
                    key={t.value}
                    id={`bot-type-${t.value}`}
                    onClick={() => handleSelectType(t.value)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl border text-xs font-medium transition-all hover:scale-105 ${t.color}`}
                  >
                    <t.icon className="h-4 w-4" />
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP: Choose Lead */}
          {step === "lead" && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground font-medium">Select lead or contact:</p>
              <div className="space-y-1 max-h-44 overflow-y-auto pr-1">
                {leads.map((lead) => (
                  <button
                    key={lead.id}
                    id={`bot-lead-${lead.id}`}
                    onClick={() => handleSelectLead(lead.id)}
                    className="w-full text-left px-3 py-2 rounded-lg border border-border hover:bg-muted text-sm flex items-center justify-between transition-colors"
                  >
                    <div>
                      <p className="font-medium">{lead.name}</p>
                      <p className="text-xs text-muted-foreground">{lead.company}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP: Details */}
          {step === "details" && (
            <div className="space-y-2">
              <Input
                id="bot-activity-title"
                placeholder="Activity title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-sm"
              />
              <div className="grid grid-cols-2 gap-2">
                <Input
                  id="bot-activity-datetime"
                  type="datetime-local"
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                  className="text-xs"
                />
                <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
                  <SelectTrigger id="bot-activity-priority" className="text-xs">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">🔴 High</SelectItem>
                    <SelectItem value="medium">🟡 Medium</SelectItem>
                    <SelectItem value="low">🟢 Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                id="bot-details-next"
                size="sm"
                className="w-full"
                onClick={handleDetailsNext}
                disabled={!title.trim()}
              >
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}

          {/* STEP: Notes */}
          {step === "notes" && (
            <div className="space-y-2">
              <Textarea
                id="bot-activity-notes"
                placeholder="Add notes from this interaction... (e.g. client mentioned budget concerns, follow up needed by Friday)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="text-sm resize-none"
                rows={3}
              />
              <div className="flex gap-2">
                <Button id="bot-skip-notes" variant="outline" size="sm" className="flex-1" onClick={handleSubmit}>
                  Skip & Log
                </Button>
                <Button id="bot-submit" size="sm" className="flex-1" onClick={handleSubmit}>
                  <CheckCircle2 className="h-4 w-4 mr-1" /> Log Activity
                </Button>
              </div>
            </div>
          )}

          {/* STEP: Done */}
          {step === "done" && (
            <div className="space-y-2">
              <div className="text-center py-2">
                <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm font-medium">Activity logged!</p>
              </div>
              <Button id="bot-log-another" size="sm" className="w-full" onClick={handleReset}>
                Log Another Activity
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
