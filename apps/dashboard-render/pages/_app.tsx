import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Handle auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN') {
          console.log('User signed in:', session?.user?.email);
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return <Component {...pageProps} />;
}
