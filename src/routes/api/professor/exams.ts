import request from "graphql-request";
import { logoutUser } from '../../../utils/mutations/user';
import { getProfessorExams,getExamByExamID, getStudentExams, professorExamStudentList } from "../../../utils/queries/professor-exam";
import { createExamMutation, deleteExamMutation, editExamMutation, changeExamStatusMutation, joinExamMutation, captureAnswer, saveExamMutation, checkExamValidity, getResultMutation, checkExamCodeMutation } from "../../../utils/mutations/exams";
// import { getProfessorExams } from "../../../utils/queries/professor-exam";

export const professorExams = () => {
    const params: any = {
        page: 1,
        limit: 200,
        fields: null,
        dir: null,
        search: null,
        status: null,
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

    const getAllExams = async () => {
        const user: any = getUser();
        
        const query = getProfessorExams;
        const payload: any = {
            page: params.page,
            limit: params.limit,
            fields: params.fields,
            dir: params.dir,
            search: user.subject_name,
            status: params.status,
            role: params.role
        }
        
        const data: any = await request(import.meta.env.VITE_API_URL, query, {
            examsByProfessorId: user.id,
            filter: payload
        }, { Authorization: `Bearer ${user.token}`});
        
        return data.examsByProfessor;
    }

    const getExamsForStudent = async () => {
        const user: any = getUser();
        
        const query = getStudentExams;
        const payload: any = {
            page: params.page,
            limit: params.limit,
            fields: params.fields,
            dir: params.dir,
            search: user.subject_name,
            status: params.status,
            student: user.id
        }

        const data: any = await request(import.meta.env.VITE_API_URL, query, {
            filter: payload
        }, { Authorization: `Bearer ${user.token}`});

        return data.exams;
    }
    
    const createExam = async (formData: any) => {
        const mutation = createExamMutation;
        const user: any = getUser();

        const data: any = await request(import.meta.env.VITE_API_URL, mutation, {
            input: formData
        }, { Authorization: `Bearer ${user.token}` });

        return data.createExam;
    }
    
    const deleteExam = async (examID: any) => {
        
        const user: any = getUser();
        const query = deleteExamMutation;
        const data: any = await request(import.meta.env.VITE_API_URL, query, {
            deleteExamId: examID
        }, { Authorization: `Bearer ${user.token}`});
        
        return data.deleteExam;
    }
    
    
    const getExamByExamId = async (examID: any) => {
        const user: any = getUser();
        const query = getExamByExamID;
        const data: any = await request(import.meta.env.VITE_API_URL, query, {
            examId: +examID
        }, { Authorization: `Bearer ${user.token}`});
        
        return data.exam;
    }
    
    const editExam = async (examID: any,formData: any) => {
        const user: any = getUser();
        const query = editExamMutation;
        const data: any = await request(import.meta.env.VITE_API_URL, query, {
            input: formData,
            updateExamId: +examID
        }, { Authorization: `Bearer ${user.token}`});
        
        return data.updateExam;     
    }
    
    const updateExamStatus = async (examId: any) => {
        const mutation = changeExamStatusMutation;
        const user: any = getUser();
        const data: any = await request(import.meta.env.VITE_API_URL, mutation, {
            updateExamStatusId: examId
        }, { Authorization: `Bearer ${user.token}`});
        
        return data.updateExamStatus;
    }
    
    const userLogout = async() => {
        const mutation = logoutUser;
        const user : any = getUser();
        const data: any = await request(import.meta.env.VITE_API_URL, mutation, {
            logoutUserId: user.id,
            token: user.token
        }, { Authorization: `Bearer ${user.token}`});
        
        return data.logoutUser;        
    }

    const joinExamFunc =async (examId: any) => {
        try {
            const mutation = joinExamMutation;
            const user: any = getUser();
            const data: any = await request(import.meta.env.VITE_API_URL, mutation, {
                joinExamInput: { exam_id: Number(examId), student_id: Number(user.id) }
            }, { Authorization: `Bearer ${user.token}`});
            
            return data.joinExam;
        } catch (error: any) {
            console.log(error);
        }
    }

    const captureAnswerFunc =async (option_id: any, question_id: any, exam_id: any) => {
        try {
            const mutation = captureAnswer;
            const user: any = getUser();
            const data: any = await request(import.meta.env.VITE_API_URL, mutation, {
                captureAnswerInput: { student_id: Number(user.id), question_id: Number(question_id), option_id: Number(option_id), exam_id: Number(exam_id) }
            }, { Authorization: `Bearer ${user.token}`});

            return data.captureAnswer;
        } catch (error: any) {
            console.log(error);
        }
    }

    const saveExamFunc =async (exam_id: any) => {
        try {
            const mutation = saveExamMutation;
            const user: any = getUser();
            const data: any = await request(import.meta.env.VITE_API_URL, mutation, {
                saveExamInput: { student_id: Number(user.id), exam_id: Number(exam_id) }
            }, { Authorization: `Bearer ${user.token}`});

            return data.saveExam;
        } catch (error: any) {
            console.log(error);
        }
    }

    const checkExamFunc =async (exam_id: any) => {
        try {
            const mutation = checkExamValidity;
            const user: any = getUser();
            const data: any = await request(import.meta.env.VITE_API_URL, mutation, {
                checkExamValidityInput: { student_id: Number(user.id), exam_id: Number(exam_id) }
            }, { Authorization: `Bearer ${user.token}`});

            return data.checkExamValidity;
        } catch (error: any) {
            console.log(error);
        }
    }

    const getResultFunc = async (exam_id: any) => {
        try {
            const mutation = getResultMutation;
            const user: any = getUser();
            const data: any = await request(import.meta.env.VITE_API_URL, mutation, {
                getResultInput: { student_id: Number(user.id), exam_id: Number(exam_id) }
            }, { Authorization: `Bearer ${user.token}`});

            return data.getResult;
        } catch (error: any) {
            console.log(error);
        }
    }

    const checkExamCodeFunc = async (exam_id: any, code: any) => {
        try {
            const mutation = checkExamCodeMutation;
            const user: any = getUser();
            const data: any = await request(import.meta.env.VITE_API_URL, mutation, {
                checkExamCodeInput: { student_id: Number(user.id), exam_id: Number(exam_id), code: Number(code) }
            }, { Authorization: `Bearer ${user.token}`});

            return data.checkExamCode;
        } catch (error: any) {
            console.log(error);
        }
    }
    
    const professorExamStudentListing = async() => {
        const user: any = getUser();
        
        const query = professorExamStudentList;
        const payload: any = {
            dir: params.dir,
            fields: params.fields,
            page: params.page,
            limit: params.limit,
            search: params.search,
            status: params.status,
            role: params.role,
            student: null
        }

        const data: any = await request(import.meta.env.VITE_API_URL, query, {
            filter: payload,
            studentExamListByProfessorSubjectId: user.id
        }, { Authorization: `Bearer ${user.token}`});
        
        return data.studentExamListByProfessorSubject;
    }
    
    return {
        params,
        userList,
        loading,
        getAllExams,
        createExam,
        getUser,
        deleteExam,
        getExamByExamId,
        editExam,
        updateExamStatus,
        userLogout,
        getExamsForStudent,
        joinExamFunc,
        captureAnswerFunc,
        saveExamFunc,
        checkExamFunc,
        getResultFunc,
        checkExamCodeFunc,
        professorExamStudentListing
        // getOneUser,
        // updateStatusUser
    }
}
