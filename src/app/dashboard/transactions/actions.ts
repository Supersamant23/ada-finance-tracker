// src/app/dashboard/transactions/actions.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function addTransaction(formData: FormData) {
  const supabase = createClient();

  // We need to convert form data to a plain object
  const data = Object.fromEntries(formData.entries());

  const { error } = await supabase.from('transactions').insert({
    account_id: data.account_id,
    type_id: data.type_id,
    category_id: data.category_id,
    amount: data.amount,
    description: data.description,
  });

  if (error) {
    console.error('Error inserting transaction:', error);
    return;
  }

  revalidatePath('/dashboard/transactions');
}