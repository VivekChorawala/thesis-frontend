export const getExamForAdmin = `query GetExamsForAdmin($filter: ExamFilter) {
    getExamsForAdmin(filter: $filter) {
      message
      status
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
}`;