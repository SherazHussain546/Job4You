'use client';

import type { UseFormReturn } from 'react-hook-form';
import { useFieldArray } from 'react-hook-form';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Plus, Trash2 } from 'lucide-react';
import type { UserProfile } from '@/lib/types';

interface ExperienceFieldArrayFormProps {
  form: UseFormReturn<UserProfile>;
}

export default function ExperienceFieldArrayForm({ form }: ExperienceFieldArrayFormProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'experience',
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Work Experience</CardTitle>
        <CardDescription>List your professional roles.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="space-y-4 rounded-md border p-4 relative pt-8">
            <FormField
              control={form.control}
              name={`experience.${index}.title`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Software Engineer" {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`experience.${index}.company`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company / Organization</FormLabel>
                  <FormControl>
                    <Input placeholder="SYNCTECH.ie" {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name={`experience.${index}.startDate`}
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., March 2024" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name={`experience.${index}.endDate`}
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., Present" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <FormField
              control={form.control}
              name={`experience.${index}.responsibilities`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Responsibilities</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe your responsibilities..." {...field} value={field.value ?? ''} />
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
          onClick={() => append({ title: '', company: '', startDate: '', endDate: '', responsibilities: '' })}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add experience
        </Button>
      </CardContent>
    </Card>
  );
}
