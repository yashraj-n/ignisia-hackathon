import { z } from "zod";

export const EmailEventSchema = z.object({
    from: z.string(),
    html: z.string().optional(),
    text: z.string().optional(),
    attachmentsUrl: z.array(z.string()).optional(),
});
export const emailEvent = "EMAIL";
export type EmailEvent = z.infer<typeof EmailEventSchema>;