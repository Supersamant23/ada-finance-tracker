// src/app/signup/actions.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function signup(formData: FormData) {
  const supabase = createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error('Signup error:', error.message);
    return redirect('/signup?message=Could not create user');
  }

  return redirect('/login?message=Signup successful! Please log in.');
}