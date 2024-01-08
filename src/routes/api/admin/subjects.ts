import request from "graphql-request";
import { allSubjects, getAllSubjectsWithoutAuth, individualSubject } from "../../../utils/queries/subject";
import { createSubjectMutation, deleteSubjectMutation, editSubjectMutation, updateStatusMutation } from "../../../utils/mutations/subject";

export const subjects = () => {
    const params: any = {
        page: 1,
        limit: 200,
        fields: "",
        dir: "",
        search: null,
        status: "active",
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

    const getAllSubjects = async () => {
        const query = getAllSubjectsWithoutAuth;
        const payload: any = {
            page: params.page,
            limit: params.limit,
            fields: params.fields,
            dir: params.dir,
            search: params.search,
            status: params.status,
        }
        const data: any = await request(import.meta.env.VITE_API_URL, query, {
            filter: payload
        });
        return data.subjects;
    }

    const updateSubject = async (subjectid: number, formData: any) => {
        const mutation = editSubjectMutation;        
        const user: any = getUser();
        
        const data: any = await request(import.meta.env.VITE_API_URL, mutation, {
            input: formData,
            updateSubjectId: +subjectid
        }, { Authorization: `Bearer ${user.token}` });
        return data.updateSubject;
    }

    const createSubject = async (formData: any) => {
        const mutation = createSubjectMutation;
        const user: any = getUser();

        const data: any = await request(import.meta.env.VITE_API_URL, mutation, {
            input: formData
        }, { Authorization: `Bearer ${user.token}` });
        return data.createSubject;
    }
    const getAllSubjectList = async () => {
        const query = allSubjects;
        const payload: any = {
            page: params.page,
            limit: params.limit,
            fields: params.fields,
            dir: params.dir,
            search: params.search,
            status: null,
        }
        const user: any = getUser();
        
        const data: any = await request(import.meta.env.VITE_API_URL, query, {
            filter: payload
        }, { Authorization: `Bearer ${user.token}` });        
        return data.allSubjects;
    }
    const updateSubjectStatus = async (userid: any) => {        
        const mutation = updateStatusMutation;
        const user: any = getUser();
        const data: any = await request(import.meta.env.VITE_API_URL, mutation, {
            updateSubjectId: userid
        }, { Authorization: `Bearer ${user.token}`});
        return data.updateSubjectStatus;
    }

    const getOneSubject = async (subjectid: any) => {        
        const user: any = getUser();
        const query = individualSubject;
        const data: any = await request(import.meta.env.VITE_API_URL, query, {
            subjectId: subjectid
        }, { Authorization: `Bearer ${user.token}`});
        return data.subject;
    }
    const deleteSubject = async (userid: any) => {
        const user: any = getUser();
        const query = deleteSubjectMutation;
        const data: any = await request(import.meta.env.VITE_API_URL, query, {
            deleteSubjectId: userid
        }, { Authorization: `Bearer ${user.token}`});
        return data.deleteSubject;
    }
    return {
        params,
        userList,
        loading,
        getAllSubjects,
        getAllSubjectList,
        updateSubjectStatus,
        createSubject,
        getOneSubject,
        updateSubject,
        deleteSubject,
        getUser,
        // getOneUser,
        // updateStatusUser
    }
}
