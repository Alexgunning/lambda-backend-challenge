// types specific to function handlers

// I changed the name because it was conflicting with the response type of node fetch
export interface InternalResponse {
  statusCode: number
}

export interface ErrorResponse extends InternalResponse {
  errorMessage: string
  statusCode: number
}
