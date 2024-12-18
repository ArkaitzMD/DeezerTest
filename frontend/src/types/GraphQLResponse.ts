export interface GraphQLResult<T> {
  success: boolean; 
  data: T;          
  errorMessage?: string; 
}
