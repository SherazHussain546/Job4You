'use client';

import type { UseFormReturn } from 'react-hook-form';
import { useFieldArray } from 'react-hook-form';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Plus, Trash2 } from 'lucide-react';
import type { UserProfile } from '@/lib/types';

interface CertificationsFieldArrayFormProps {
  form: UseFormReturn<UserProfile>;
}

export default function CertificationsFieldArrayForm({ form }: CertificationsFieldArrayFormProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'certifications',
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Certifications</CardTitle>
        <CardDescription>List your professional certifications.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="space-y-4 rounded-md border p-4 pt-8 relative">
            <FormField
              control={form.control}
              name={`certifications.${index}.name`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Certification Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Certified Kubernetes Administrator" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`certifications.${index}.organization`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Issuing Organization</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., The Linux Foundation" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`certifications.${index}.date`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date Issued (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., June 2023" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`certifications.${index}.link`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Certificate Link (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://your-certificate-link.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => remove(index)}
                className="absolute top-2 right-2"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Remove</span>
              </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ name: '', organization: '', date: '', link: '' })}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add certification
        </Button>
      </CardContent>
    </Card>
  );
}
