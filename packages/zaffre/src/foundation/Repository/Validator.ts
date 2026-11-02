import { ZArray } from "../Atom";
import { zutil } from "../Util";

// TODO: return cloned objects from builder methods
//
// - if simple objects, use return Object.assign(this, { y: value });
//
// OR: simply declare this to be a mutating builder pattern
//

class ValidationIssue {
  constructor(public code: string, public path: string | string[], public message: string) {}
}
const issue = (code: string, path: string | string[], message: string) => new ValidationIssue(code, path, message);

class ValidationError extends Error {
  constructor(public issues: ValidationIssue[]) {
    super();
  }
}
type ValidationSuccessResult<T> = {
  success: true;
  data: Partial<T>;
};
type ValidationErrorResult<T> = {
  success: false;
  error: ValidationError;
};

export const validationSuccess = { success: true, data: {} } as ValidationSuccessResult<any>;

// validation result is a discriminated union type
export type ValidationResult<T> = ValidationSuccessResult<T> | ValidationErrorResult<T>;

export abstract class Validator<R extends {}, T = R[keyof R]> {

  abstract parse(data: Partial<T> | undefined): Partial<T>;

  safeParse(data: Partial<T> | undefined): ValidationResult<T> {
    try {
      const result = this.parse(data);
      return { success: true, data: result };
    } catch (e) {
      return {
        success: false,
        error:
          e instanceof ValidationError ? e : new ValidationError([issue("unknown", "", zutil.extractErrorMessage(e))]),
      };
    }
  }
}

type ValCheckResult = {
  issues: ValidationIssue[];
  value: any;
};

class ValCheck<R extends {}, T = R[keyof R]> {
  constructor(public description?: string, public fn?: (key: string, val: any) => ValidationIssue | any) {}
  checks: ValCheck<R, T>[] = [];

  checkValue(key: string, val: any): ValCheckResult {
    const issues: ValidationIssue[] = [];
    let value = val;
    this.checks.forEach((valCheck) => {
      const result = valCheck.fn?.(key, value);
      if (result instanceof ValidationIssue) {
        //console.log(`valcheck(${valCheck.description}) failed`);
        issues.push(result);
      } else {
        value = val;
      }
    });
    return { issues, value };
  }

  addCheck(description: string, check: (key: string, val: any) => ValidationIssue | any): ValCheck<R, T> {
    this.checks.push(new ValCheck(description, check));
    return this;
  }

  date(msg = "expected date") {
    return this.addCheck("date", (key, val) => {
      return typeof val === "string" && zutil.isISO8601(val)
        ? new Date(val)
        : val instanceof Date
        ? val
        : issue("invalid type", key, msg);
    });
  }

  unique(existingValues: ZArray<string>, msg = "expected unique value") {
    return this.addCheck("unique", (key, val) => {
      return existingValues.some((v) => zutil.sameAs(v, val)) ? issue("invalid type", key, msg) : val
    });
  }
  string(msg = "expected string") {
    return this.addCheck("string", (key, val) => {
      return typeof val === "string" ? val : issue("invalid type", key, msg);
    });
  }
  number(msg = "expected number") {
    return this.addCheck("number", (key, val) => {
      return typeof val === "number" ? val : issue("invalid type", key, msg);
    });
  }
  object(msg = "expected object") {
    return this.addCheck("object", (key, val) => {
      return typeof val === "object" ? val : issue("invalid type", key, msg);
    });
  }
  nonempty(msg = "Required") {
    return this.addCheck("nonempty", (key, val) =>
      (Array.isArray(val) && val.length > 0) || val ? val : issue("empty", key, msg)
    );
  }
  min(minimum: number) {
    return this.addCheck("min", (key, val) => {
      if ((Array.isArray(val) || typeof val === "string") && val.length < minimum) {
        return issue("size", key, `min length is ${minimum}`);
      } else if (typeof val === "number" && val < minimum) {
        return issue("size", key, `min value is ${minimum}`);
      } else {
        return val;
      }
    });
  }
  max(maximum: number) {
    return this.addCheck("max", (key, val) => {
      if ((Array.isArray(val) || typeof val === "string") && val.length > maximum) {
        return issue("size", key, `max length is ${maximum}`);
      } else if (typeof val === "number" && val > maximum) {
        return issue("size", key, `max value is ${maximum}`);
      } else {
        return val;
      }
    });
  }
  lettersOnly(msg = "must be letters only") {
    return this.addCheck("lettersOnly", (key, val) =>
      typeof val === "string" && val.match(/^[A-Za-z]+$/) ? val : issue("letters only", key, msg)
    );
  }
  email(msg = "invalid email address") {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return this.addCheck("email", (key, val) =>
      typeof val === "string" && emailRegex.test(val.toLowerCase()) ? val : issue("invalid email", key, msg)
    );
  }
  enum(values: string[]) {
    return this.addCheck("enum", (key, val) =>
      values.includes(val) ? val : issue("empty", key, `Must be one of ${values}`)
    );
  }
}

class RootValCheck<R extends {}, T = R[keyof R]> extends ValCheck<R, T> {
  addCheck(description: string, check: (key: string, val: any) => ValidationIssue | any): ValCheck<R, T> {
    const answer = new ValCheck();
    answer.checks.push(new ValCheck("", check));
    return answer;
  }
}
export const validationCheck = new RootValCheck();

export interface ValidatorSchema<R extends {}, T = R[keyof R]> {
  [key: string]: ValCheck<R, T>;
}

export class ValidationSchema<R extends {}, T = R[keyof R]> extends Validator<R, T> {
  constructor(public schema: ValidatorSchema<R, T>) {
    super();
  }
  parse(data: Partial<T>): Partial<T> {
    const issues: ValidationIssue[] = [];
    Object.entries(data).forEach(([key, val]) => {
      const valCheck = (this.schema as any)[key];
      if (valCheck) {
        const checkResult = valCheck.checkValue(key, val);
        (data as any)[key] = checkResult.value;
        issues.push(...checkResult.issues);
      }
    });
    if (issues.length > 0) {
      throw new ValidationError(issues);
    }
    return data;
  }
}

// convert any ISO date strings to dates
export class BasicValidationSchema<R extends {}, T = R[keyof R]> extends ValidationSchema<R, T> {
  parseValue(val: any): any {
    return typeof val === "string" && zutil.isISO8601(val) ? new Date(val) : val;
  }
  parse(data: Partial<T> | undefined): Partial<T> {
    return data
      ? (Object.fromEntries(Object.entries(data).map(([k, v]) => [k, this.parseValue(v)])) as Partial<T>)
      : {};
  }
}

export const basicValidator = new BasicValidationSchema<any>({});
