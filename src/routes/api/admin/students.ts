import request from "graphql-request";
import { allUsers, individualUser } from "../../../utils/queries/user";
import { deleteProfessor, updateStatus } from "../../../utils/mutations/user";

export const students = () => {
    let params: any = {
        limit: 200,
        page: 1,
        sort: "",
        dir: "",
        search: "",
        status: "",
        total: 0,
        role: "student"
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

    const getAllStudents = async () => {
        const query = allUsers;
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
        return data.users;
    }

    const updateStatusUser = async (userid: any) => {
        const mutation = updateStatus;
        let user: any = getUser();
        const data: any = await request(import.meta.env.VITE_API_URL, mutation, {
            updateUserId: userid
        }, { Authorization: `Bearer ${user.token}`});
        return data.updateUserStatus;
    }

    const getOneStudent = async (userid: any) => {
        let user: any = getUser();
        let query = individualUser;
        const data: any = await request(import.meta.env.VITE_API_URL, query, {
            id: userid
        }, { Authorization: `Bearer ${user.token}`});
        return data.user;
    }

    const deleteUser = async (userid: any) => {
        let user: any = getUser();
        let query = deleteProfessor;
        const data: any = await request(import.meta.env.VITE_API_URL, query, {
            deleteUserId: userid
        }, { Authorization: `Bearer ${user.token}`});
        return data.deleteUser;
    }
    return {
        params,
        userList,
        loading,
        getAllStudents,
        getOneStudent,
        updateStatusUser,
        deleteUser
    }
}
