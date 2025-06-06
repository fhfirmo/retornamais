import { Logo } from '@/components/Logo';
import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/40 p-4">
      <Link href="/" className="mb-8">
        <Logo iconSize={32} textSize="text-2xl" />
      </Link>
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
