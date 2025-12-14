import { Github, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  showBackButton?: boolean;
  onBack?: () => void;
}

export function Header({ showBackButton, onBack }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showBackButton ? (
            <Button variant="ghost" size="sm" onClick={onBack}>
              ← Back
            </Button>
          ) : (
            <>
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-accent">
                <Code2 className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">
                <span className="text-foreground">Git</span>
                <span className="gradient-text">Grade</span>
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" asChild>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Github className="w-4 h-4" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
