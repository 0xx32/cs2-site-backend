import z from 'zod'

export const cartParamsSchema = z.object({
	id: z.coerce.number().min(1),
})

export const addToCartBodySchema = z.object({
	productVariantId: z.number().min(1),
	serverId: z.number().min(1),
})
