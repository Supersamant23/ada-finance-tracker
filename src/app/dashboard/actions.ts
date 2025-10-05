'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { GoogleGenerativeAI } from '@google/generative-ai';

// --- Helper function to create the transaction ---
async function createTransaction(transactionData: {
  amount: number;
  description: string;
  type_name: string;
  category_name: string;
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const { data: account, error: accountError } = await supabase
    .from('accounts')
    .select('id')
    .eq('customer_id', user.id)
    .limit(1)
    .single();
  if (accountError || !account) throw new Error("Could not find a user account.");

  const { data: category, error: categoryError } = await supabase
    .from('categories')
    .select('id')
    .ilike('name', transactionData.category_name)
    .limit(1)
    .single();
  if (categoryError || !category) throw new Error(`Category "${transactionData.category_name}" not found.`);
  
  const { data: type, error: typeError } = await supabase
    .from('transaction_types')
    .select('id')
    .eq('name', transactionData.type_name)
    .limit(1)
    .single();
  if (typeError || !type) throw new Error(`Transaction type "${transactionData.type_name}" not found.`);

  const { error: insertError } = await supabase.from('transactions').insert({
    account_id: account.id,
    type_id: type.id,
    category_id: category.id,
    amount: transactionData.amount,
    description: transactionData.description,
  });

  if (insertError) throw new Error(insertError.message);

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/transactions');
}

// --- Main function to handle the AI prompt ---
export async function handlePrompt(prompt: string) {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  // The new masterPrompt from above goes here...
  const masterPrompt = `
    You are an expert financial assistant. Your task is to analyze the user's text and convert it into a structured JSON object.

    The output must be only the JSON object, with no additional text, formatting, or markdown.
    
    The root of the JSON object must be a key named "transactions", which holds an array of transaction objects.
    
    For each transaction object in the array, you must extract:
    - amount (number)
    - description (string)
    - type (string, must be either "debit" or "credit")
    - category (string, must be one of: Groceries, Salary, Transport, Utilities, Rent, Other)

    If the user's request is vague, respond with an object containing a "clarification_question" key.
    
    User's request: "${prompt}"
  `;

  try {
    const result = await model.generateContent(masterPrompt);
    const responseText = result.response.text();
    const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const jsonResponse = JSON.parse(cleanedText);

    // Check if the response contains a transactions array
    if (jsonResponse.transactions && Array.isArray(jsonResponse.transactions)) {
      // Create a promise for each transaction creation
      const transactionPromises = jsonResponse.transactions.map((tx: any) => 
        createTransaction({
          amount: tx.amount,
          description: tx.description,
          type_name: tx.type,
          category_name: tx.category,
        })
      );

      // Wait for all transactions to be processed
      await Promise.all(transactionPromises);

      return { success: true, message: `Successfully added ${jsonResponse.transactions.length} transactions!` };
    } 
    // Handle clarification questions
    else if (jsonResponse.clarification_question) {
      return { success: false, message: jsonResponse.clarification_question };
    } 
    // Handle unknown cases
    else {
      return { success: false, message: 'Sorry, I could not understand that.' };
    }
  } catch (error) {
    console.error('Error in handlePrompt:', error);
    return { success: false, message: 'An error occurred while processing your request.' };
  }
}