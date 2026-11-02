import { Atom, Repository, TEntity, TEntityList } from "zaffre";

export const demoUserRoles = ["", "User", "Admin"] as const;
export type DemoUserRole = (typeof demoUserRoles)[number];

export const demoUserTitles = ["", "Mr.", "Mrs.", "Miss", "Ms."] as const;
export type DemoUserTitle = (typeof demoUserTitles)[number];

export interface DemoUser extends TEntity {
  title: DemoUserTitle;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: DemoUserRole;
  startDate: Date;
  info: string;
}
export class DemoUser extends TEntity {

  constructor(data?: Partial<DemoUser>) {
    super(data);
  }
  defaultValues(): Partial<DemoUser> {
    return {
      title: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "",
      startDate: new Date(),
      info: "Some text"
    };
  }
  get name(): string {
    return [this.title, this.firstName, this.lastName].filter((v) => v).join(" ");
  }

  match!: Atom<string>;
  theMatch(): string {
    return this.match.get();
  }
}

export type DemoUserList = TEntityList<DemoUser>;

export interface DemoUserDb {
  users: Repository<DemoUser>;
}
