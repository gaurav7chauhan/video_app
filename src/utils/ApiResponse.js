class ApiResponse {
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}

/*
  Purpose:
  - This class helps in creating consistent and structured API responses.
  - Instead of sending raw objects from controllers, we can wrap them using this class for clarity and uniformity.
  - Example usage in a controller:
      return res.status(200).json(new ApiResponse(200, userData, "User fetched successfully"));
*/
