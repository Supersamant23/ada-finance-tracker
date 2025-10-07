// src/app/dashboard/accounts/actions.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function addAccount(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.error('User is not authenticated');
    return;
  }

  // For now, we'll hardcode a bank_id. Later, this would come from the user's session.
  const bankId = 1;

  const accountName = formData.get('account_name') as string;
  const accountType = formData.get('account_type') as string;

  const { error } = await supabase.from('accounts').insert({
    customer_id: user.id,
    bank_id: bankId,
    account_name: accountName,
    account_type: accountType,
    balance: 0, // Starting balance
  });

  if (error) {
    console.error('Error inserting account:', error);
    // You can return an error message to display in the UI
    return;
  }

  revalidatePath('/dashboard/accounts');
}