
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

interface ProjectsFieldArrayFormProps {
  form: UseFormReturn<UserProfile>;
}

export default function ProjectsFieldArrayForm({ form }: ProjectsFieldArrayFormProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'projects',
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Projects</CardTitle>
        <CardDescription>Showcase your personal or professional projects.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="space-y-4 rounded-md border p-4 pt-8 relative">
            <FormField
              control={form.control}
              name={`projects.${index}.name`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input placeholder="AI Resume Builder" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`projects.${index}.date`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date / Timeline (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Jan 2023 - Mar 2023" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`projects.${index}.achievements`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Achievements / Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe the project and your key contributions..." {...field} />
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
          onClick={() => append({ name: '', date: '', achievements: '' })}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add project
        </Button>
      </CardContent>
    </Card>
  );
}
