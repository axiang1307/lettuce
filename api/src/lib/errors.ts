// Errors thrown by services to say what went wrong; controllers map them to status codes.
export class ForbiddenError extends Error {}

// The resource doesn't exist, or the caller has no access to it (deliberately indistinguishable).
export class NotFoundError extends Error {}

// The request is well-formed but breaks a business rule that needs stored data to check.
export class ValidationError extends Error {}
