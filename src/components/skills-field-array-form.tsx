'use client';

import type { UseFormReturn } from 'react-hook-form';
import { useFieldArray } from 'react-hook-form';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { FormControl, FormField, FormItem, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Plus, Trash2 } from 'lucide-react';
import type { UserProfile } from '@/lib/types';
import { Badge } from './ui/badge';
import { useToast } from '@/hooks/use-toast';

interface SkillsFieldArrayFormProps {
  form: UseFormReturn<UserProfile>;
  name: 'skills';
  title: string;
  description: string;
  placeholder: string;
}

const suggestedSkills = [
  'Generative AI', 'Prompt Engineering', 'OpenAI', 'Google AI Studio', 'scikit-learn', 'Machine Learning Training Data', 
  'AWS', 'GCP', 'Azure', 'Kubernetes', 'Docker', 'CI/CD', 'Terraform',
  'Python', 'C#', 'TypeScript', 'JavaScript', 'SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Firebase', 'BigQuery',
  'Angular', 'React.js', 'Node.js', 'Express', 'FastAPI', 'Django', 'Flask', 'Ionic', 'HTML5', 'CSS3', 'Tailwind',
  'B2B Sales', 'Lead Generation', 'CRM', 'Agile Methodologies', 'Penetration Testing', 'Network Security'
];

export default function SkillsFieldArrayForm({ form, name, title, description, placeholder }: SkillsFieldArrayFormProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name,
  });
  const { toast } = useToast();

  const handleAddSuggestion = (skill: string) => {
    const currentSkills = form.getValues('skills');
    if (currentSkills.includes(skill)) {
      toast({
        title: 'Skill already added',
        description: `You've already added "${skill}" to your skills.`,
        variant: 'destructive',
      });
    } else {
      append(skill);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {suggestedSkills.map((skill) => (
            <Badge 
              key={skill} 
              variant="secondary" 
              className="cursor-pointer hover:bg-primary/20"
              onClick={() => handleAddSuggestion(skill)}
            >
              {skill}
            </Badge>
          ))}
        </div>
        <div className='space-y-4 pt-4'>
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
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append('')}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add custom skill
        </Button>
      </CardContent>
    </Card>
  );
}
