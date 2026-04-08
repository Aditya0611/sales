import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useActivities } from "@/contexts/ActivityContext";
import { leads, getUserName, currentUser } from "@/lib/mock-data";
import { LeadStatusBadge, ActivityStatusBadge, PriorityBadge } from "@/components/StatusBadge";
import { Activity, ActivityType, Priority } from "@/lib/types";
import {
  ArrowLeft, Plus, Building2, Mail, Phone as PhoneIcon, Globe,
  DollarSign, User, CalendarDays, Clock3, StickyNote,
  Phone, Users, Monitor, ArrowUpRight, FileText
} from "lucide-react";

const typeIcons: Record<string, React.ElementType> = {
  call: Phone, meeting: Users, email: Mail,
  demo: Monitor, "follow-up": ArrowUpRight, note: FileText,
};
const typeColors: Record<string, string> = {
  call: "bg-blue-500/10 text-blue-600 border-blue-300",
  meeting: "bg-purple-500/10 text-purple-600 border-purple-300",
  email: "bg-amber-500/10 text-amber-600 border-amber-300",
  demo: "bg-cyan-500/10 text-cyan-600 border-cyan-300",
  "follow-up": "bg-orange-500/10 text-orange-600 border-orange-300",
  note: "bg-green-500/10 text-green-600 border-green-300",
};

const emptyForm = {
  title: "", type: "call" as ActivityType, dateTime: "",
  priority: "medium" as Priority, description: "", notes: "",
};

export default function LeadDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { activities, addActivity } = useActivities();
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const lead = leads.find((l) => l.id === id);

  if (!lead) {
    return (
      <AppLayout title="Lead Not Found">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Lead not found</p>
        </div>
      </AppLayout>
    );
  }

  const leadActivities = activities
    .filter((a) => a.leadId === lead.id)
    .sort((a, b) => b.dateTime.localeCompare(a.dateTime));

  const handleAddSubmit = () => {
    if (!form.title || !form.dateTime) return;
    const newActivity: Activity = {
      id: `a${Date.now()}`,
      title: form.title,
      description: form.description || `${form.type} with ${lead.name}`,
      type: form.type,
      leadId: lead.id,
      assignedTo: currentUser.id,
      dateTime: form.dateTime,
      status: "planned",
      priority: form.priority,
      notes: form.notes || undefined,
      createdAt: new Date().toISOString(),
    };
    addActivity(newActivity);
    setForm(emptyForm);
    setAddOpen(false);
  };

  return (
    <AppLayout title={lead.name}>
      <div className="space-y-6">
        <Button variant="ghost" size="sm" onClick={() => navigate("/leads")}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Leads
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lead Info */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Lead Info</CardTitle>
                <LeadStatusBadge status={lead.status} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                  {lead.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="font-semibold">{lead.name}</p>
                  <p className="text-sm text-muted-foreground">{lead.company}</p>
                </div>
              </div>
              <div className="space-y-2.5 text-sm">
                {[
                  { icon: Building2, value: lead.industry },
                  { icon: Mail,      value: lead.email },
                  { icon: PhoneIcon, value: lead.phone },
                  { icon: Globe,     value: lead.source },
                  { icon: DollarSign, value: `$${lead.dealValue.toLocaleString()}` },
                  { icon: User,      value: getUserName(lead.assignedTo) },
                ].map(({ icon: Icon, value }) => (
                  <div key={value} className="flex items-center gap-2.5 text-muted-foreground">
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{value}</span>
                  </div>
                ))}
              </div>

              {/* Activity Summary */}
              <div className="border-t pt-4 space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Activity Summary</p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  {[
                    { label: "Total", count: leadActivities.length, color: "text-foreground" },
                    { label: "Done", count: leadActivities.filter(a => a.status === "completed").length, color: "text-green-500" },
                    { label: "Missed", count: leadActivities.filter(a => a.status === "missed").length, color: "text-red-500" },
                  ].map(({ label, count, color }) => (
                    <div key={label} className="bg-muted/40 rounded-lg py-2">
                      <p className={`text-lg font-bold ${color}`}>{count}</p>
                      <p className="text-[10px] text-muted-foreground">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Timeline */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock3 className="h-4 w-4 text-primary" />
                  Activity Timeline
                  <span className="ml-1 text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    {leadActivities.length}
                  </span>
                </CardTitle>
                <Button size="sm" id="lead-add-activity-btn" onClick={() => setAddOpen(true)}>
                  <Plus className="h-4 w-4 mr-1" /> Add Activity
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {leadActivities.length === 0 ? (
                <div className="text-center py-12">
                  <Clock3 className="h-8 w-8 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No activities yet</p>
                  <p className="text-xs text-muted-foreground mt-1">Log a call, email, or meeting to get started</p>
                </div>
              ) : (
                <div className="space-y-0">
                  {leadActivities.map((act, i) => {
                    const Icon = typeIcons[act.type] || FileText;
                    const iconColor = typeColors[act.type] ?? "";
                    const dt = new Date(act.dateTime);
                    return (
                      <div key={act.id} className="relative flex gap-4 group">
                        {/* Connector line */}
                        {i < leadActivities.length - 1 && (
                          <div className="absolute left-[19px] top-10 bottom-0 w-0.5 bg-border" />
                        )}
                        {/* Icon */}
                        <div className={`h-10 w-10 rounded-full border-2 flex items-center justify-center shrink-0 z-10 mt-1 transition-transform group-hover:scale-110 ${iconColor}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        {/* Body */}
                        <div className="flex-1 pb-6">
                          <div className="bg-muted/30 hover:bg-muted/60 border border-border/50 rounded-xl p-3 transition-colors">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <div>
                                <p className="text-sm font-semibold">{act.title}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">{act.description}</p>
                              </div>
                              <div className="flex gap-1.5 shrink-0">
                                <ActivityStatusBadge status={act.status} />
                                <PriorityBadge priority={act.priority} />
                              </div>
                            </div>
                            {/* Notes block */}
                            {act.notes && (
                              <div className="flex items-start gap-1.5 mt-2 p-2 bg-amber-50 border border-amber-200 rounded-lg">
                                <StickyNote className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                                <p className="text-xs text-amber-900 leading-relaxed">{act.notes}</p>
                              </div>
                            )}
                            {/* Metadata row */}
                            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground flex-wrap">
                              <span className="flex items-center gap-1">
                                <CalendarDays className="h-3 w-3" />
                                {dt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock3 className="h-3 w-3" />
                                {dt.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                              </span>
                              <span>·</span>
                              <span className="capitalize font-medium">{act.type}</span>
                              <span>·</span>
                              <span>{getUserName(act.assignedTo)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Activity Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Log Activity for {lead.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="ld-title">Title *</Label>
              <Input id="ld-title" placeholder="e.g. Call with Vikram about pricing"
                value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="ld-type">Activity Type *</Label>
                <Select value={form.type} onValueChange={(v) => setForm(f => ({ ...f, type: v as ActivityType }))}>
                  <SelectTrigger id="ld-type"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="call">📞 Call</SelectItem>
                    <SelectItem value="meeting">👥 Meeting</SelectItem>
                    <SelectItem value="email">✉️ Email</SelectItem>
                    <SelectItem value="demo">🖥️ Demo</SelectItem>
                    <SelectItem value="follow-up">↗️ Follow-up</SelectItem>
                    <SelectItem value="note">📝 Note</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ld-priority">Priority</Label>
                <Select value={form.priority} onValueChange={(v) => setForm(f => ({ ...f, priority: v as Priority }))}>
                  <SelectTrigger id="ld-priority"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">🔴 High</SelectItem>
                    <SelectItem value="medium">🟡 Medium</SelectItem>
                    <SelectItem value="low">🟢 Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ld-datetime">Date & Time *</Label>
              <Input id="ld-datetime" type="datetime-local"
                value={form.dateTime} onChange={(e) => setForm(f => ({ ...f, dateTime: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ld-desc">Description</Label>
              <Input id="ld-desc" placeholder="Brief description..."
                value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ld-notes">Interaction Notes</Label>
              <Textarea id="ld-notes"
                placeholder="Notes from this interaction — what was discussed, action items, customer feedback..."
                value={form.notes} onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))}
                rows={3} className="resize-none" />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button id="ld-submit" onClick={handleAddSubmit} disabled={!form.title || !form.dateTime}>
              <Plus className="h-4 w-4 mr-1" /> Log Activity
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
