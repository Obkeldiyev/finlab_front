import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { OpportunityDetail } from "@/data/opportunities";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";

interface OpportunityDialogProps {
  opportunity: OpportunityDetail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OpportunityDialog({ opportunity, open, onOpenChange }: OpportunityDialogProps) {
  if (!opportunity) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-start justify-between">
            <DialogTitle className="text-2xl font-display font-bold text-primary pr-8">
              {opportunity.title}
            </DialogTitle>
            <button
              onClick={() => onOpenChange(false)}
              className="rounded-full p-2 hover:bg-accent transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </DialogHeader>
        
        <ScrollArea className="px-6 pb-6" style={{ maxHeight: 'calc(90vh - 100px)' }}>
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground leading-relaxed">
              {opportunity.fullContent.introduction}
            </p>

            {opportunity.fullContent.sections.map((section, index) => (
              <div key={index} className="space-y-3">
                <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold">
                    {index + 1}
                  </span>
                  {section.title}
                </h3>
                <p className="text-base text-muted-foreground leading-relaxed pl-10">
                  {section.content}
                </p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
