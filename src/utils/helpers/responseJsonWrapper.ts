export const responseJsonWrapper = (
	message: string = 'успех',
	result?: unknown,
	status: boolean = true
) => ({
	success: status,
	message,
	result,
})
