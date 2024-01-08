import { error, json } from '@sveltejs/kit';
import type { RequestEvent, RequestHandler } from './$types';

export const POST: RequestHandler = async (e: RequestEvent) => {
	const user = { admin: true };

	if (!user.admin) {
		throw error(401, 'Unpermitted');
	}

	return json({ statusCode: 200, message: 'Login successfully' });
	// return new Response();
};
