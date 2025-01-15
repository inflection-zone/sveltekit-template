import {ZodError, ZodSchema } from 'zod';

////////////////////////////////////////////////////////////////////////////////

export const validateFormData = async <T extends ZodSchema>(
  formData: FormData,
  schema: T
) => {
  const data = Object.fromEntries(
    Array.from(formData.entries()).map(([key, value]) => {
      if (formData.getAll(key).length > 1) {
        return [key, formData.getAll(key)];
      } else {
        return [key, typeof value === 'string' ? value : ''];
      }
    })
  );
  try {
    const validationResult = schema.parse(data);
    return { validationResult, validationErrors: null };
  } catch (err) {
    const zodError = err as ZodError;
    const { fieldErrors: validationErrors } = zodError.flatten();
    return { validationResult: data, validationErrors };
  }
};