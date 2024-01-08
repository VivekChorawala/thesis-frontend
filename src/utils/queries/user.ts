export const allUsers = `query Users ($filter: UserFilter){
    users(filter: $filter) {
      statusCode
      message
      data {
        role
        email
        first_name
        last_name
        id
        status
      }
    }
}`;

export const individualUser = `query User($id: Int!) {
  user(id: $id) {
    statusCode
    message
    data {
      id
      email
      first_name
      last_name
      status
      role
    }
  }
}`;

export const individualProfessor = `query Professor($professorId: Int) {
  professor(id: $professorId) {
    statusCode
    message
    data {
      id
      last_name
      first_name
      role
      email
      status
      subject
    }
  }
}`;