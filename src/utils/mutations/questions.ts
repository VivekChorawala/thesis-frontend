export const addSubjectWiseQuestion = `
mutation Mutation($input: QuestionInput!) {
  createQuestion(input: $input) {
    message
    status
  }
}
`

export const deleteSubjectQuestion = `
mutation Mutation($deleteQuestionId: Int) {
  deleteQuestion(id: $deleteQuestionId) {
    message
    status
  }
}`


export const editSubjectQuestion = `
mutation Mutation($input: UpdateQuestionInput!, $updateQuestionId: Int) {
  updateQuestion(input: $input, id: $updateQuestionId) {
    message
    status
  }
}
`


export const updateSubjectQuestionStatus = `
mutation UpdateQuestionStatus($updateQuestionStatusId: Int) {
  updateQuestionStatus(id: $updateQuestionStatusId) {
    message
    status
  }
}
`
