import { zfd } from 'zod-form-data';
import { z } from 'zod';

////////////////////////////////////////////////////////////////////////////////

export const generateOtpSchema = zfd.formData({
  countryCode: z
    .string()
    .regex(/^\+\d{1,4}$/, "Invalid country code. Must start with a '+' followed by 1 to 4 digits."),
  phone: z
    .string()
    .min(8, "Phone number must be at least 8 digits long.")
    .max(15, "Phone number cannot exceed 15 digits.") 
    .regex(/^\d+$/, "Phone number must contain only numbers.") 
});


export const loginWithOtpSchema = zfd.formData({
  otp: z.string().min(6, "OTP must be at least 6 digits long.").max(6, "OTP cannot exceed 6 digits."),
  phone: z
    .string()
    .min(8, "Phone number must be at least 8 digits long.")
    .max(15, "Phone number cannot exceed 15 digits.") 
    .regex(/^\d+$/, "Phone number must contain only numbers.") 
});

