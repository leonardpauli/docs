import {gql} from 'apollo-server-koa'
export default gql`query {User{me{email}}}`
