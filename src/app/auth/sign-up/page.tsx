'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'sonner';
import GlassCard from '@/components/shared/GlassCard';
import Link from 'next/link';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
        }
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Check your email for the confirmation link!");
      router.push('/auth/sign-in');
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-void p-6">
        <Toaster theme="dark" />
        <GlassCard className="p-8 w-full max-w-sm">
            <h1 className="text-2xl font-serif mb-8 text-center text-text-primary">Create an Account</h1>

            <form onSubmit={handleSignUp} className="flex flex-col gap-4">
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-3 rounded-xl bg-deep border border-glass-border text-sm focus:border-glow focus:outline-none transition-all"
                    onChange={e => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full p-3 rounded-xl bg-deep border border-glass-border text-sm focus:border-glow focus:outline-none transition-all"
                    onChange={e => setPassword(e.target.value)}
                    required
                />
                <button
                    className="w-full bg-glow hover:bg-glow/90 text-white p-3 rounded-xl font-medium text-sm transition-all shadow-lg shadow-glow/10"
                    disabled={loading}
                >
                    {loading ? 'Signing up...' : 'Sign Up'}
                </button>
            </form>

            <div className="mt-6 text-center text-sm text-text-muted">
                Already have an account?{' '}
                <Link href="/auth/sign-in" className="text-glow hover:underline">
                    Sign In
                </Link>
            </div>
        </GlassCard>
    </div>
  );
}
