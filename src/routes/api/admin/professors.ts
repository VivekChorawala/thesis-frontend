import request from "graphql-request";
import { allUsers, individualProfessor, individualUser } from "../../../utils/queries/user";
import { deleteProfessor, updateStatus } from "../../../utils/mutations/user";

export const professors = () => {
    const params: any = {
        limit: 200,
        page: 1,
        sort: "",
        dir: "",
        search: "",
        status: "",
        total: 0,
        role: "professor"
    };
    const loading = false
    let userList: any;
    params;
    loading;
    userList;

    function getUser() {
        let user: any = localStorage.getItem('user');
        user = JSON.parse(user);
        return user;
    }

    const getAllProfessors = async () => {
        const query = allUsers;
        const payload: any = {
            page: params.page,
            limit: params.limit,
            fields: params.fields,
            dir: params.dir,
            search: params.search,
            status: params.status,
            role: params.role
        }
        const user: any = getUser();
        
        const data: any = await request(import.meta.env.VITE_API_URL, query, {
            filter: payload
        }, { Authorization: `Bearer ${user.token}`});
        return data.users;
    }

    const updateStatusUser = async (userid: any) => {
        const mutation = updateStatus;
        const user: any = getUser();
        const data: any = await request(import.meta.env.VITE_API_URL, mutation, {
            updateUserId: userid
        }, { Authorization: `Bearer ${user.token}`});
        return data.updateUserStatus;
    }

    const getOneProfessor = async (userid: any) => {
        const user: any = getUser();
        const query = individualProfessor;
        const data: any = await request(import.meta.env.VITE_API_URL, query, {
            professorId: userid
        }, { Authorization: `Bearer ${user.token}`});
        return data.professor;
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
        getAllProfessors,
        getOneProfessor,
        updateStatusUser,
        deleteUser
    }
}
