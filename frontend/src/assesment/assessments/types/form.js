import { z } from 'zod';
// Base validation schema for different question types
export const questionResponseSchema = z.object({
  questionId: z.string(),
  type: z.enum(['single-choice', 'multi-choice', 'short-text', 'long-text', 'numeric', 'file-upload']),
  value: z.any() // Will be refined based on question type
});

// Specific validation schemas for each question type
export const singleChoiceResponseSchema = questionResponseSchema.extend({
  type: z.literal('single-choice'),
  value: z.string().min(1, 'Please select an option')
});
export const multiChoiceResponseSchema = questionResponseSchema.extend({
  type: z.literal('multi-choice'),
  value: z.array(z.string()).min(1, 'Please select at least one option')
});
export const shortTextResponseSchema = questionResponseSchema.extend({
  type: z.literal('short-text'),
  value: z.string().min(1, 'This field is required')
});
export const longTextResponseSchema = questionResponseSchema.extend({
  type: z.literal('long-text'),
  value: z.string().min(1, 'This field is required')
});
export const numericResponseSchema = questionResponseSchema.extend({
  type: z.literal('numeric'),
  value: z.number({
    message: 'Please enter a valid number'
  })
});
export const fileUploadResponseSchema = questionResponseSchema.extend({
  type: z.literal('file-upload'),
  value: z.object({
    name: z.string(),
    size: z.number(),
    type: z.string(),
    lastModified: z.number()
  }).nullable()
});

// Assessment form data type

// Assessment submission data

// Form validation context

// Conditional logic evaluation result

// Form state for runtime

// Validation rule types

// Custom validation function type

// Form field props for different question types

// Form section navigation

// Assessment form configuration

// Default form configuration
export const defaultFormConfig = {
  allowPartialSave: true,
  showProgress: true,
  enableSectionNavigation: true,
  validateOnChange: false,
  validateOnBlur: true,
  autoSave: true,
  autoSaveInterval: 30000 // 30 seconds
};

// Form event types