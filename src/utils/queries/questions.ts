export const getAllQuestionsBySubject = `
query Query($filter: QuestionFilter) {
  questions(filter: $filter) {
    status
    message
    data {
      id
      question
      status
      subject_id
      subject_name
      subject_status
      subject_description
    }
  }
}
`
export const getIndividualQuestion = `
query Question($questionId: Int) {
  question(id: $questionId) {
    status
    message
    data {
      id
      question
      status
      subject_id
      subject_name
      subject_status
      subject_description
      options {
        id
        option
        answer
      }
    }
  }
}
`
