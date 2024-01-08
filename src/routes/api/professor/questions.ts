import request from "graphql-request";
import { addSubjectWiseQuestion, deleteSubjectQuestion, editSubjectQuestion, updateSubjectQuestionStatus } from "../../../utils/mutations/questions";
import { getAllQuestionsBySubject, getIndividualQuestion } from "../../../utils/queries/questions";

export const professorSubject = () => {
    const params: any = {
        page: 1,
        limit: 200,
        fields: null,
        dir: null,
        search: null,
        status: null,
    };
    const loading = false;
    
    function getUser() {
        let user: any = localStorage.getItem('user');
        user = JSON.parse(user);
        return user;
    }
    
    const addQuestionToSubject = async(input:any) => {
        const mutation = addSubjectWiseQuestion;
        const user: any = getUser();

        const data: any = await request(import.meta.env.VITE_API_URL, mutation, {
            input: input
        }, { Authorization: `Bearer ${user.token}` });
        
        return data.createQuestion;
    }
    
    const getAllQuestionBySubjectAndProfessor = async() => {
        const user: any = getUser();
        
        const query = getAllQuestionsBySubject;
        const payload: any = {
            page: params.page,
            limit: params.limit,
            fields: params.fields,
            dir: params.dir,
            search: params.search,
            status: params.status,
            role: params.role,
            professor_id: user.id,
            subject_id: user.subject_id
        }
        
        const data: any = await request(import.meta.env.VITE_API_URL, query, {
            filter: payload
        }, { Authorization: `Bearer ${user.token}`});
        
        return data.questions;
    }
    
    const getIndividualQuestionBySubject = async(questionId: any) => {

        const user: any = getUser();
        const query = getIndividualQuestion;
        const data: any = await request(import.meta.env.VITE_API_URL, query, {
            questionId: +questionId
        }, { Authorization: `Bearer ${user.token}`});
        
        return data.question;
    }
    
    const deleteQuestion = async(questionID: any) => {
        const user: any = getUser();
        const query = deleteSubjectQuestion;
        const data: any = await request(import.meta.env.VITE_API_URL, query, {
            deleteQuestionId: questionID
        }, { Authorization: `Bearer ${user.token}`});
        
        return data.deleteQuestion;
    }
    
    const editQuestion = async (questionID: any,formData: any) => {
        const user: any = getUser();
        const query = editSubjectQuestion;
        const data: any = await request(import.meta.env.VITE_API_URL, query, {
            input: formData,
            updateQuestionId: +questionID
        }, { Authorization: `Bearer ${user.token}`});
        
        return data.updateQuestion;
    }

    const updateQuestionStatus = async (questionID: any) => {
        const mutation = updateSubjectQuestionStatus;
        const user: any = getUser();
        const data: any = await request(import.meta.env.VITE_API_URL, mutation, {
            updateQuestionStatusId: questionID
        }, { Authorization: `Bearer ${user.token}`});
        
        return data.updateQuestionStatus;
    }
    
    return {
        params,
        loading,
        getUser,
        addQuestionToSubject,
        getAllQuestionBySubjectAndProfessor,
        getIndividualQuestionBySubject,
        deleteQuestion,
        editQuestion,
        updateQuestionStatus
        // getOneUser,
        // updateStatusUser
    }
    
}
