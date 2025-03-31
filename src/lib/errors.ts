export class PublicError extends Error {
  code: string;
  
  constructor(message: string, code = "ERROR") {
    super(message);
    this.code = code;
    Object.setPrototypeOf(this, PublicError.prototype);
  }
}

export class RateLimitError extends PublicError {
  constructor(message = "Too many requests, please try again later") {
    super(message, "RATE_LIMIT_ERROR");
    Object.setPrototypeOf(this, RateLimitError.prototype);
  }
}

export class AuthenticationError extends PublicError {
  constructor(message = "Authentication required") {
    super(message, "AUTHENTICATION_ERROR");
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}