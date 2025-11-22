/* eslint-disable no-extend-native */
// eslint-disable-next-line ts/ban-ts-comment
//@ts-nocheck
BigInt.prototype.toJSON = function () {
	return this.toString()
}
