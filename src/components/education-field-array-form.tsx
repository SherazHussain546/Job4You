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

interface EducationFieldArrayFormProps {
  form: UseFormReturn<UserProfile>;
}

export default function EducationFieldArrayForm({ form }: EducationFieldArrayFormProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'education',
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Education</CardTitle>
        <CardDescription>Your academic background.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="space-y-4 rounded-md border p-4 pt-8 relative">
            <FormField
              control={form.control}
              name={`education.${index}.qualification`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Qualification</FormLabel>
                  <FormControl>
                    <Input placeholder="B.S. in Computer Science" {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`education.${index}.institute`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Institute Name</FormLabel>
                  <FormControl>
                    <Input placeholder="State University" {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name={`education.${index}.startDate`}
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., August 2020" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name={`education.${index}.endDate`}
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., May 2024" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <FormField
              control={form.control}
              name={`education.${index}.achievements`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Achievements (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Dean's List, relevant coursework, thesis..." {...field} value={field.value ?? ''} />
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
          onClick={() => append({ qualification: '', institute: '', startDate: '', endDate: '', achievements: '' })}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add education
        </Button>
      </CardContent>
    </Card>
  );
}
