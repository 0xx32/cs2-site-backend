import { Hono } from 'hono'

import { authController } from '@/modules/auth'
import { cartController } from '@/modules/cart'
// import { playerController } from "@/modules/player/player.controller";
import { productController } from '@/modules/product'
import { serverController } from '@/modules/server'
import { shopController } from '@/modules/shop'
import { userController } from '@/modules/user'

export const apiRoute = new Hono()
	.route('/auth', authController)
	// .route("/players", playerController)
	.route('/servers', serverController)
	.route('/products', productController)
	.route('/shop', shopController)
	.route('/cart', cartController)
	.route('/users', userController)
