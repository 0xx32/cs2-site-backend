import z from 'zod'

export const productParamsSchema = z.object({
	id: z.coerce.number().min(1),
})

export const productVariantsSchema = z
	.array(
		z.object({
			price: z.number(),
			durationDays: z.number(),
			durationLabel: z.string(),
		})
	)
	.min(1)

export type ProductVariants = z.infer<typeof productVariantsSchema>

export const addProductBodySchema = z.object({
	name: z.string().min(1),
	description: z.optional(z.string()),
	type: z.enum(['privilege', 'character_model']),
	discountPercent: z.number().min(0).max(100).optional(),
	advantages: z.array(z.string()).min(1).optional(),
	image: z.url().optional(),
	characterModelId: z.number().min(1).optional(),
	privilegeName: z.string().optional(),
	variants: productVariantsSchema,
})

export type AddProductParams = z.infer<typeof addProductBodySchema>

export const updateProductBodySchema = z.object({
	name: z.string().min(1).optional(),
	description: z.optional(z.string()),
	type: z.enum(['privilege', 'character_model']).optional(),
	discountPercent: z.number().min(0).max(100).optional(),
	advantages: z.array(z.string()).min(1).optional(),
	image: z.url().optional(),
	characterModelId: z.number().min(1).optional(),
	variants: productVariantsSchema.optional(),
	enabled: z.boolean().optional(),
})

export type UpdateProductParams = z.infer<typeof updateProductBodySchema>

export const deleteProductParamsSchema = z.object({
	id: z.number().min(1),
})

export type DeleteProductParams = z.infer<typeof deleteProductParamsSchema>
