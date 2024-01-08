export const getProfessorExams = `query ExamsByProfessor($examsByProfessorId: Int, $filter: ExamFilter) {
  examsByProfessor(id: $examsByProfessorId, filter: $filter) {
    status
    message
    data {
      id
      name
      code
      category
      subject_id
      subject_name
      professor_id
      professor_name
      duration
      status
      total_questions
    }
  }
}`

export const getStudentExams = `query Query($filter: ExamFilter) {
  exams(filter: $filter) {
    status
    message
    data {
      id
      name
      category
      subject_id
      subject_name
      professor_id
      professor_name
      duration
      status
      total_questions
      completed_at
      studentExamId
      student
      started_at
      studentDuration
    }
  }
}`;
export const getExamByExamID = `
query Exam($examId: Int) {
  exam(id: $examId) {
    status
    message
    data {
      id
      name
      category
      subject_id
      subject_name
      professor_id
      professor_name
      duration
      status
      total_questions
    }
  }
}`


export const professorExamStudentList = `
query Query($filter: ExamFilter, $studentExamListByProfessorSubjectId: Int) {
  studentExamListByProfessorSubject(filter: $filter, id: $studentExamListByProfessorSubjectId) {
    status
    message
    data {
      student_id
      student_name
      exam_id
      exam_name
      student_exam_start_time
      student_exam_finished_at
      subject_id
      subject_name
      total_questions
      student_result
      exam_duration
    }
  }
}
`
