// pages/signup.tsx
'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { motion } from 'framer-motion';
import { toast } from 'sonner'; // Changed import
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

// ... (keep existing form schema and component setup)

const onSubmit = (values: z.infer<typeof formSchema>) => {
  // Replace old toast with sonner
  toast.success('Account created (simulated)', {
    description: JSON.stringify(values, null, 2),
    action: {
      label: 'Close',
      onClick: () => console.log('Closed'),
    },
  });
};

// In your JSX, add Toaster component at root level
return (
  <>
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
      {/* ... (rest of your existing JSX) */}
    </div>
    <Toaster position="top-center" richColors /> {/* Add this line */}
  </>
);