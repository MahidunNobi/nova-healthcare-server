import z from "zod";

const updateAdmin = z.object({
  name: z.string().optional(),
  contactNumber: z.string().optional(),
});

export const adminValidationSchemas = {
  updateAdmin,
};
