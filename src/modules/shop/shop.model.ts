import z from 'zod'

export const shopPurchaseBodySchema = z
	.array(
		z.object({
			productId: z.number(),
			serverId: z.number(),
			productVariantId: z.number(),
		})
	)
	.refine(
		(items) => {
			const seen = new Set<string>()
			for (const item of items) {
				const key = `${item.serverId}-${item.productVariantId}`
				if (seen.has(key)) {
					return false
				}
				seen.add(key)
			}
			return true
		},
		{
			message: 'Каждый товар должен быть уникальным по serverId и productVariantId',
		}
	)

export type ShopPurchaseBody = z.infer<typeof shopPurchaseBodySchema>
