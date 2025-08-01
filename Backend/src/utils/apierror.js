class ApiError extends Error {
  constructor(
    statusCode,
    messsage="something went wrong",
    error=[],
    stack=""
    
  ){
    super(messsage);
    this.statusCode = statusCode;
    this.data=null;
    this.message = messsage;
    this.success = false;
    this.error =  error;
    if(stack){
      this.stack = stack;
    }
    else{
      Error.captureStackTrace(this, this.constructor);
    }

  }
}
export default ApiError;