// follows with RFC 7807 (Problem Details) and RFC 9457 conventions
export type ProblemDetails = {
  type: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
  [key: string]: any;
};

export class ApiError extends Error {

  public readonly problem: ProblemDetails;
  
  constructor(problem: ProblemDetails) {
    super(problem.title ?? "API Error");
    this.name = "ApiError";
    this.problem = problem;
  }
}

