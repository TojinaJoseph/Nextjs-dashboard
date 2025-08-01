'use server';
import {z} from 'zod';
import { revalidatePath } from 'next/cache';
import postgres from 'postgres';
import { redirect } from 'next/navigation';

const sql=postgres(process.env.POSTGRES_URL!, {ssl: 'require'});

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string().min(1, 'Customer is required'),
    amount: z.coerce.number().min(1, 'Amount is required'),
    status: z.enum(['pending', 'paid'], {
        errorMap: () => ({ message: 'Status is required' }),
    }),
    date: z.string(),
})
const CreateInvoice=FormSchema.omit({id:true,date:true});

export async function createInvoice(formData:FormData){
    const {customerId,amount,status}=CreateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    await sql`
    INSERT INTO invoices (customer_id,amount,status,date)
    VALUES (${customerId},${amountInCents},${status},${date})
    `;

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}