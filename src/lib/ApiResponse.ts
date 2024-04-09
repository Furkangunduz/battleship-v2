class ApiResponse {
  statusCode: number;
  data: any;
  message: string;
  success: boolean;

  constructor(statusCode: number, data: any, message: string = 'Success') {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }

  toJson() {
    return JSON.stringify({ status: this.statusCode, data: this.data, message: this.message });
  }
}

export default ApiResponse;
