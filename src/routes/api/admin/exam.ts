import request from "graphql-request";
import { allUsers, individualUser } from "../../../utils/queries/user";
import { deleteProfessor, updateStatus } from "../../../utils/mutations/user";
import { getExamForAdmin } from "../../../utils/queries/exam";
import { getResultMutation } from "../../../utils/mutations/exams";

export const exams = () => {
    let params: any = {
        limit: 200,
        page: 1,
        sort: "",
        dir: "",
        search: "",
        status: "",
        total: 0,
        role: "admin"
    };
    let loading = false
    let userList: any;
    $: params;
    $: loading;
    $: userList;

    function getUser() {
        let user: any = localStorage.getItem('user');
        user = JSON.parse(user);
        return user;
    }

    const getAllExams = async () => {
        const query = getExamForAdmin;
        let payload: any = {
            page: params.page,
            limit: params.limit,
            fields: params.fields,
            dir: params.dir,
            search: params.search,
            status: params.status,
            role: params.role
        }
        let user: any = getUser();

        const data: any = await request(import.meta.env.VITE_API_URL, query, {
            filter: payload
        }, { Authorization: `Bearer ${user.token}`});
        return data.getExamsForAdmin;
    }

    const getResultFunc = async (exam_id: any, student_id: any) => {
        try {
            const mutation = getResultMutation;
            const user: any = getUser();
            const data: any = await request(import.meta.env.VITE_API_URL, mutation, {
                getResultInput: { student_id: Number(student_id), exam_id: Number(exam_id) }
            }, { Authorization: `Bearer ${user.token}`});

            return data.getResult;
        } catch (error: any) {
            console.log(error);
        }
    }

    return {
        params,
        userList,
        loading,
        getAllExams,
        getResultFunc
    }
}
