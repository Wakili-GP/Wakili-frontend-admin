import { z } from "zod";

export const LawCategorySchema = z.object({
  name: z.string().min(3, "يجب أن يكون الاسم 3 أحرف على الأقل"),
  description: z.string().min(10, "يجب أن يكون الوصف 10 أحرف على الأقل"),
});

export type LawCategoryInput = z.infer<typeof LawCategorySchema>;
