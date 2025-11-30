'use client';

import type { UseFormReturn } from 'react-hook-form';
import { useFieldArray } from 'react-hook-form';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { FormControl, FormField, FormItem, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Plus, Trash2 } from 'lucide-react';
import type { UserProfile } from '@/lib/types';

interface FieldArrayFormProps {
  form: UseFormReturn<UserProfile>;
  name: 'education' | 'experience' | 'skills';
  title: string;
  description: string;
  placeholder: string;
}

export default function FieldArrayForm({ form, name, title, description, placeholder }: FieldArrayFormProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.map((field, index) => (
          <FormField
            key={field.id}
            control={form.control}
            name={`${name}.${index}`}
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormControl>
                    <Input placeholder={placeholder} {...field} />
                  </FormControl>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    className="shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Remove</span>
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append('')}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add {name.slice(0, -1)}
        </Button>
      </CardContent>
    </Card>
  );
}
