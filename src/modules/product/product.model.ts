import z from 'zod'

export const productVariantsSchema = z
	.array(
		z.object({
			label: z.string(),
			price: z.number(),
			duration: z.number(),
		})
	)
	.min(1)

export type ProductVariants = z.infer<typeof productVariantsSchema>

export const addProductDto = z.object({
	categoryId: z.number(),
	name: z.string().min(1),
	advantages: z.array(z.string()).min(1),
	variants: productVariantsSchema,
	imageUrl: z.optional(z.string()),
	discountPercent: z.optional(z.number()),
	isActive: z.boolean(),
})
