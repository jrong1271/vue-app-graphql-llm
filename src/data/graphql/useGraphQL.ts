import { useMutation, useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'

// Mutation: Add a new todo
const ADD_TODO = gql`
  mutation ($label: String!) {
    addTodo(label: $label) {
      id
      label
      checked
    }
  }
`

// Query: List all todos
const GET_TODOS = gql`
  query {
    todos {
      id
      label
      checked
    }
  }
`

// Mutation: Delete a todo
const DELETE_TODO = gql`
  mutation ($id: ID!) {
    deleteTodo(id: $id) {
      id
    }
  }
`

// Mutation: Update a todo's checked status
const UPDATE_TODO = gql`
  mutation ($id: ID!, $checked: Boolean!) {
    updateTodo(id: $id, checked: $checked) {
      id
      label
      checked
    }
  }
`

// Export reusable hooks
export function useAddTodo() {
  return useMutation(ADD_TODO)
}

export function useGetTodos() {
  return useQuery(GET_TODOS)
}

export function useDeleteTodo() {
  return useMutation(DELETE_TODO)
}

export function useUpdateTodo() {
  return useMutation(UPDATE_TODO)
}
