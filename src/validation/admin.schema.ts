import { z } from "zod";

export const createAdminSchema = z
  .object({
    firstName: z.string().min(1, "الاسم الأول مطلوب"),

    lastName: z.string().min(1, "اسم العائلة مطلوب"),

    email: z
      .string()
      .min(1, "البريد الإلكتروني مطلوب")
      .email("بريد إلكتروني غير صالح"),

    password: z
      .string()
      .min(8, "يجب أن تكون 8 أحرف على الأقل")
      .regex(/\d/, "يجب أن تحتوي كلمة المرور على رقم واحد على الأقل"),

    confirmPassword: z.string(),

    role: z.enum(["admin", "moderator"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمات المرور غير متطابقة",
    path: ["confirmPassword"],
  });

export type CreateAdminFormData = z.infer<typeof createAdminSchema>;
