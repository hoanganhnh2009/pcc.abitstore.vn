class ResponseService {
  static error(error) {
    let defaultError = {
      error: {
        message: "",
        code: ""
      }
    };
    error = {
      ...defaultError,
      error: { ...defaultError.error, ...error }
    };
    return error;
  }
  static error404(error) {
    let defaultError = {
      error: {
        message: "No Data Found",
        code: 404
      }
    };
    error = {
      ...defaultError,
      error: { ...defaultError.error, ...error }
    };
    return error;
  }
  static errorBadRequest(error) {
    let defaultError = {
      error: {
        message: "Bad Request",
        code: 400
      }
    };
    error = {
      ...defaultError,
      error: { ...defaultError.error, ...error }
    };
    return error;
  }
  static noDataFound() {
    return {
      error: {
        message: "No Data Found",
        code: 404
      }
    };
  }

  static errorServer() {
    return {
      error: {
        message: "Server Error",
        code: 501
      }
    };
  }
  static success(data) {
    return {
      success: true,
      code: 200,
      ...data
    };
  }
}

module.exports = ResponseService;
