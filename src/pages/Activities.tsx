import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ActivityStatusBadge, PriorityBadge } from "@/components/StatusBadge";
import { useActivities } from "@/contexts/ActivityContext";
import { leads, getUserName, getLeadName, getLeadCompany, currentUser } from "@/lib/mock-data";
import { Activity, ActivityType, Priority } from "@/lib/types";
import {
  Search, Plus, Phone, Mail, Users, Monitor, ArrowUpRight,
  FileText, LayoutList, Clock3, CalendarDays, StickyNote,
  CheckCircle2, AlertCircle, Circle
} from "lucide-react";

const typeIcons: Record<string, React.ElementType> = {
  call: Phone, meeting: Users, email: Mail,
  demo: Monitor, "follow-up": ArrowUpRight, note: FileText,
};
const typeColors: Record<string, string> = {
  call: "bg-blue-500/10 text-blue-600 border-blue-200",
  meeting: "bg-purple-500/10 text-purple-600 border-purple-200",
  email: "bg-amber-500/10 text-amber-600 border-amber-200",
  demo: "bg-cyan-500/10 text-cyan-600 border-cyan-200",
  "follow-up": "bg-orange-500/10 text-orange-600 border-orange-200",
  note: "bg-green-500/10 text-green-600 border-green-200",
};
const timelineLineColors: Record<string, string> = {
  call: "bg-blue-400", meeting: "bg-purple-400", email: "bg-amber-400",
  demo: "bg-cyan-400", "follow-up": "bg-orange-400", note: "bg-green-400",
};
const statusIcons = {
  completed: <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />,
  planned:   <Clock3 className="h-3.5 w-3.5 text-blue-500" />,
  missed:    <AlertCircle className="h-3.5 w-3.5 text-red-500" />,
};

const emptyForm = {
  title: "", type: "call" as ActivityType, leadId: "", dateTime: "",
  priority: "medium" as Priority, description: "", notes: "",
};

export default function Activities() {
  const { activities, addActivity } = useActivities();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"table" | "timeline">("timeline");
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const filtered = activities.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      getLeadName(a.leadId).toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || a.status === statusFilter;
    const matchesType = typeFilter === "all" || a.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const sorted = [...filtered].sort((a, b) => b.dateTime.localeCompare(a.dateTime));

  const handleAddSubmit = () => {
    if (!form.title || !form.leadId || !form.dateTime) return;
    const newActivity: Activity = {
      id: `a${Date.now()}`,
      title: form.title,
      description: form.description || `${form.type} activity`,
      type: form.type,
      leadId: form.leadId,
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
    <AppLayout title="Activities">
      <div className="space-y-4">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex gap-3 flex-1 w-full sm:w-auto flex-wrap">
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input id="activities-search" placeholder="Search activities or leads..." className="pl-8"
                value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger id="status-filter" className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="planned">Planned</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="missed">Missed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger id="type-filter" className="w-32">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="call">Call</SelectItem>
                <SelectItem value="meeting">Meeting</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="demo">Demo</SelectItem>
                <SelectItem value="follow-up">Follow-up</SelectItem>
                <SelectItem value="note">Note</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            {/* View Toggle */}
            <div className="flex rounded-lg border border-border overflow-hidden">
              <button
                id="view-table"
                onClick={() => setViewMode("table")}
                className={`px-3 py-1.5 text-sm flex items-center gap-1.5 transition-colors ${
                  viewMode === "table" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                }`}
              >
                <LayoutList className="h-3.5 w-3.5" /> Table
              </button>
              <button
                id="view-timeline"
                onClick={() => setViewMode("timeline")}
                className={`px-3 py-1.5 text-sm flex items-center gap-1.5 transition-colors ${
                  viewMode === "timeline" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                }`}
              >
                <Clock3 className="h-3.5 w-3.5" /> Timeline
              </button>
            </div>
            <Button id="add-activity-btn" size="sm" onClick={() => setAddOpen(true)}>
              <Plus className="h-4 w-4 mr-1" /> Add Activity
            </Button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Total", count: activities.length, icon: Circle, color: "text-foreground" },
            { label: "Completed", count: activities.filter(a => a.status === "completed").length, icon: CheckCircle2, color: "text-green-500" },
            { label: "Overdue", count: activities.filter(a => a.status === "missed").length, icon: AlertCircle, color: "text-red-500" },
          ].map(({ label, count, icon: Icon, color }) => (
            <Card key={label} className="py-3">
              <CardContent className="p-0 flex items-center gap-3 px-4">
                <Icon className={`h-5 w-5 ${color}`} />
                <div>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="text-xl font-bold">{count}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* TIMELINE VIEW */}
        {viewMode === "timeline" && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-primary" /> Activity Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sorted.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No activities match your filters</p>
              ) : (
                <div className="space-y-0">
                  {sorted.map((act, i) => {
                    const Icon = typeIcons[act.type] || Circle;
                    const iconColor = typeColors[act.type] ?? "";
                    const lineColor = timelineLineColors[act.type] ?? "bg-border";
                    const dt = new Date(act.dateTime);
                    return (
                      <div key={act.id} className="relative flex gap-4 group">
                        {/* Vertical line */}
                        {i < sorted.length - 1 && (
                          <div className={`absolute left-[19px] top-10 bottom-0 w-0.5 ${lineColor} opacity-30`} />
                        )}
                        {/* Icon bubble */}
                        <div className={`h-10 w-10 rounded-full border-2 flex items-center justify-center shrink-0 z-10 mt-1 transition-transform group-hover:scale-110 ${iconColor}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        {/* Content */}
                        <div
                          className="flex-1 pb-6 cursor-pointer"
                          onClick={() => setSelectedActivity(act)}
                        >
                          <div className="bg-muted/30 hover:bg-muted/60 border border-border/50 rounded-xl p-3 transition-colors">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold truncate">{act.title}</p>
                                <p className="text-xs text-muted-foreground mt-0.5 truncate">{act.description}</p>
                              </div>
                              <div className="flex gap-1.5 shrink-0">
                                <ActivityStatusBadge status={act.status} />
                                <PriorityBadge priority={act.priority} />
                              </div>
                            </div>
                            {/* Notes preview */}
                            {act.notes && (
                              <div className="flex items-start gap-1.5 mt-2 p-2 bg-background rounded-lg border border-border/50">
                                <StickyNote className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                                <p className="text-xs text-muted-foreground line-clamp-2">{act.notes}</p>
                              </div>
                            )}
                            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground flex-wrap">
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
                              <span>{getLeadName(act.leadId)}</span>
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
        )}

        {/* TABLE VIEW */}
        {viewMode === "table" && (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead className="hidden md:table-cell">Type</TableHead>
                    <TableHead className="hidden md:table-cell">Lead</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden lg:table-cell">Priority</TableHead>
                    <TableHead className="hidden lg:table-cell">Date & Time</TableHead>
                    <TableHead className="hidden lg:table-cell">Assigned To</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sorted.map((act) => {
                    const Icon = typeIcons[act.type] || Circle;
                    return (
                      <TableRow key={act.id} className="cursor-pointer" onClick={() => setSelectedActivity(act)}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                            <div>
                              <p className="font-medium">{act.title}</p>
                              <p className="text-xs text-muted-foreground md:hidden capitalize">{act.type}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell capitalize">{act.type}</TableCell>
                        <TableCell className="hidden md:table-cell">{getLeadName(act.leadId)}</TableCell>
                        <TableCell><ActivityStatusBadge status={act.status} /></TableCell>
                        <TableCell className="hidden lg:table-cell"><PriorityBadge priority={act.priority} /></TableCell>
                        <TableCell className="hidden lg:table-cell text-sm">
                          {new Date(act.dateTime).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">{getUserName(act.assignedTo)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Detail Sheet */}
      <Sheet open={!!selectedActivity} onOpenChange={() => setSelectedActivity(null)}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          {selectedActivity && (() => {
            const Icon = typeIcons[selectedActivity.type] || Circle;
            const iconColor = typeColors[selectedActivity.type] ?? "";
            const dt = new Date(selectedActivity.dateTime);
            return (
              <>
                <SheetHeader>
                  <div className={`h-10 w-10 rounded-full border-2 flex items-center justify-center ${iconColor} mb-2`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <SheetTitle>{selectedActivity.title}</SheetTitle>
                  <p className="text-sm text-muted-foreground">{selectedActivity.description}</p>
                </SheetHeader>
                <div className="mt-6 space-y-5">
                  <div className="flex gap-2">
                    <ActivityStatusBadge status={selectedActivity.status} />
                    <PriorityBadge priority={selectedActivity.priority} />
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {[
                      { label: "Type", value: <span className="capitalize font-medium">{selectedActivity.type}</span> },
                      { label: "Lead", value: getLeadName(selectedActivity.leadId) },
                      { label: "Company", value: getLeadCompany(selectedActivity.leadId) },
                      { label: "Assigned To", value: getUserName(selectedActivity.assignedTo) },
                    ].map(({ label, value }) => (
                      <div key={label} className="bg-muted/40 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">{label}</p>
                        <p className="font-medium">{value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-muted/40 rounded-lg p-3 text-sm">
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <CalendarDays className="h-3.5 w-3.5" /> Date & Time
                    </p>
                    <p className="font-medium">
                      {dt.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                    </p>
                    <p className="text-muted-foreground text-xs mt-0.5">
                      {dt.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  {selectedActivity.notes && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <p className="text-xs font-semibold text-amber-700 mb-1 flex items-center gap-1">
                        <StickyNote className="h-3.5 w-3.5" /> Interaction Notes
                      </p>
                      <p className="text-sm text-amber-900 leading-relaxed">{selectedActivity.notes}</p>
                    </div>
                  )}
                </div>
              </>
            );
          })()}
        </SheetContent>
      </Sheet>

      {/* Add Activity Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Log New Activity</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="form-title">Title *</Label>
              <Input id="form-title" placeholder="e.g. Discovery call with Vikram" value={form.title}
                onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="form-type">Activity Type *</Label>
                <Select value={form.type} onValueChange={(v) => setForm(f => ({ ...f, type: v as ActivityType }))}>
                  <SelectTrigger id="form-type"><SelectValue /></SelectTrigger>
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
                <Label htmlFor="form-priority">Priority</Label>
                <Select value={form.priority} onValueChange={(v) => setForm(f => ({ ...f, priority: v as Priority }))}>
                  <SelectTrigger id="form-priority"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">🔴 High</SelectItem>
                    <SelectItem value="medium">🟡 Medium</SelectItem>
                    <SelectItem value="low">🟢 Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="form-lead">Link to Lead / Contact *</Label>
              <Select value={form.leadId} onValueChange={(v) => setForm(f => ({ ...f, leadId: v }))}>
                <SelectTrigger id="form-lead"><SelectValue placeholder="Select lead..." /></SelectTrigger>
                <SelectContent>
                  {leads.map(l => (
                    <SelectItem key={l.id} value={l.id}>{l.name} — {l.company}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="form-datetime">Date & Time *</Label>
              <Input id="form-datetime" type="datetime-local" value={form.dateTime}
                onChange={(e) => setForm(f => ({ ...f, dateTime: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="form-desc">Description</Label>
              <Input id="form-desc" placeholder="Brief description..." value={form.description}
                onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="form-notes">Interaction Notes</Label>
              <Textarea id="form-notes" placeholder="Add notes from this interaction — key points, follow-ups needed, customer feedback..."
                value={form.notes} onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))}
                rows={3} className="resize-none" />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button id="form-submit" onClick={handleAddSubmit}
              disabled={!form.title || !form.leadId || !form.dateTime}>
              <Plus className="h-4 w-4 mr-1" /> Log Activity
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
