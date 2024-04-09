class ApiError extends Error {
  statusCode: number;
  data: any;
  message: string;
  success: boolean;
  errors: any[];

  constructor(statusCode: number, message: string = 'Something went wrong!', errors: any = []) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;

    Error.captureStackTrace(this, this.constructor);
  }
  toJson() {
    return JSON.stringify({ status: this.statusCode, message: this.message, errors: this.errors });
  }
}

export default ApiError;
