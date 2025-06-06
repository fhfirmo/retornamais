import { Coins } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';

interface LogoProps {
  className?: string;
  iconSize?: number;
  textSize?: string;
  showText?: boolean;
}

export function Logo({ className, iconSize = 24, textSize = "text-xl", showText = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Coins className="text-primary" size={iconSize} />
      {showText && <span className={`font-headline font-bold ${textSize} text-foreground`}>{APP_NAME}</span>}
    </div>
  );
}
