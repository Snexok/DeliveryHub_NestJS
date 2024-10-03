import { gql } from "@apollo/client";

export const CREATE_CATEGORY = gql`
  mutation CreateCategory($name: String!) {
    createCategory(createCategoryInput: { name: $name }) {
      id
      name
    }
  }
`;
