import z from 'zod'

export const shopCheckoutBodySchema = z.array(
	z.object({
		serverId: z.number(),
		productId: z.number(),
		productVariantId: z.number(),
	})
)

export type CheckoutDto = z.infer<typeof shopCheckoutBodySchema>
