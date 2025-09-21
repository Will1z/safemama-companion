'use client';

import { ArrowLeft, Volume2, VolumeX, FileText, Download } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Bot } from 'lucide-react';

interface ChatHeaderProps {
  isAISpeaking?: boolean;
  voiceResponsesEnabled?: boolean;
  onToggleAudio?: () => void;
  onOpenSummary?: () => void;
  onGenerateSummary?: () => void;
  isGeneratingSummary?: boolean;
  messageCount?: number;
}

export function ChatHeader({ 
  isAISpeaking = false,
  voiceResponsesEnabled = false,
  onToggleAudio,
  onOpenSummary,
  onGenerateSummary,
  isGeneratingSummary = false,
  messageCount = 0
}: ChatHeaderProps) {
  return (
    <header
      className="sticky top-[var(--safe-top,0px)] z-30 bg-primary/95 backdrop-blur supports-[backdrop-filter]:bg-primary/80 border-b text-white"
      role="banner"
    >
      <div className="mx-auto max-w-6xl px-4 py-3 md:py-4">
        {/* Row 1 (mobile) / Single row (md+) */}
        <div className="grid grid-cols-3 items-center md:flex md:items-center md:justify-between md:gap-4">
          {/* Back */}
          <div className="justify-self-start">
            <Link href="/dashboard" aria-label="Back to Dashboard">
              <Button variant="ghost" size="sm" className="h-9 px-3 text-white hover:bg-white/10">
                <ArrowLeft className="mr-2 h-4 w-4" />
                <span className="hidden xs:inline">Back</span>
              </Button>
            </Link>
          </div>

          {/* Title */}
          <div className="justify-self-center text-center">
            <div className="flex items-center space-x-2 justify-center">
              <div className={`w-8 h-8 bg-accent rounded-full flex items-center justify-center ${
                isAISpeaking ? 'animate-pulse' : ''
              }`}>
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg md:text-xl font-semibold leading-tight">
                  Health Assistant
                </h1>
                <p className="text-xs text-white/80 hidden md:block">
                  {isAISpeaking ? "AI is speaking..." : "AI-powered symptom monitoring"}
                </p>
              </div>
            </div>
          </div>

          {/* Actions (md+ visible, mobile icon only) */}
          <div className="justify-self-end flex items-center gap-1 md:gap-2">
            <Button
              variant="ghost"
              size="sm"
              aria-label="Toggle voice"
              onClick={onToggleAudio}
              className="h-9 px-2 text-white hover:bg-white/10"
            >
              {voiceResponsesEnabled ? (
                <Volume2 className="h-4 w-4" />
              ) : (
                <VolumeX className="h-4 w-4" />
              )}
            </Button>
            
            {/* Desktop-only buttons */}
            <div className="hidden md:flex items-center gap-2">
              {messageCount > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onGenerateSummary}
                  disabled={isGeneratingSummary}
                  className="text-[#1C3D3A] bg-white border-[#1C3D3A]/20 hover:bg-[#EAF4F3] h-9"
                >
                  <FileText className="w-4 h-4 mr-1" />
                  {isGeneratingSummary ? 'Generating...' : 'Summary'}
                </Button>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                asChild 
                className="text-[#1C3D3A] bg-white border-[#1C3D3A]/20 hover:bg-[#EAF4F3] h-9"
              >
                <Link href="/summary">
                  <Download className="w-4 h-4 mr-1" />
                  Health Summary
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Row 2 (mobile-only): full-width action buttons */}
        <div className="mt-3 md:hidden flex gap-2">
          {messageCount > 1 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onGenerateSummary}
              disabled={isGeneratingSummary}
              className="flex-1 h-9 text-[#1C3D3A] bg-white border-[#1C3D3A]/20 hover:bg-[#EAF4F3]"
            >
              <FileText className="w-4 h-4 mr-1" />
              {isGeneratingSummary ? 'Generating...' : 'Summary'}
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenSummary}
            className="flex-1 h-9 text-[#1C3D3A] bg-white border-[#1C3D3A]/20 hover:bg-[#EAF4F3]"
          >
            <Download className="w-4 h-4 mr-1" />
            Health Summary
          </Button>
        </div>
      </div>
    </header>
  );
}
