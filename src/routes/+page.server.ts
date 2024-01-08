import { redirect } from '@sveltejs/kit';

interface IRes {
	session?: string;
}

export const load = async ({ parent }) => {
	const { session }: IRes = await parent();
	if (!session) {
		throw redirect(303, '/signin/student');
	}

	throw redirect(303, '/dashboard');
};
