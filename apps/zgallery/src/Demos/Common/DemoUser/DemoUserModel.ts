import { TEntityList, Repository, LocalDataRepository } from "zaffre";
import { DemoUser } from "./DemoUser";

class DemoUserDB {
  users: Repository<DemoUser>;
  constructor() {
  this. users = new LocalDataRepository<DemoUser>("demo_user", (data) => new DemoUser(data));
    this.addInitialRecord();
  }
  get allUsers(): TEntityList<DemoUser> {
    const list = this.users.createList();
    this.users.getAll(list);
    return list;
  }
  addInitialRecord(): void {
    const list = this.users.createList();
    list.addAction((records) => {
      if (records.length === 0) {
        const record = new DemoUser({
          title: "Mr.",
          firstName: "John",
          lastName: "Smith",
          email: "john@smith.com",
          password: "123456",
          role: "Admin",
        });
        this.users.create(record);
      }
    });
    this.users.getAll(list);
  }
}

/*
export class DemoUserModel extends TFModel<DemoUser> {
  constructor() {
    super("Users", (new DemoUserDB()).allUsers, () => new DemoUser());
  }

  createTableModel(): TableModel<DemoUser> {
    return new TableModel(this.records, this.columns);
  }
  createFormModel(): FormModel<DemoUser> {
    //const record = this.editedRecord.get();
    const fields = demoUserFieldsWithGridAreas(this.editedRecord);
    return new FormModel(this.editedRecord, fields, this.schema);
  }

  db = new DemoUserDB();

  schema = new ValidationSchema<DemoUser, keyof DemoUser>({
    title: v.string().nonempty(),
    firstName: v.string().nonempty(),
    lastName: v.string().min(1).max(20).lettersOnly(),
    email: v.email(),
    role: v.string().nonempty(),
    password: v.string().min(6),
    startDate: v.date().nonempty(),
  });

  columns = [
    stringColumn<DemoUser>("Name", (r) => r.name),
    stringColumn<DemoUser>("Email", (r) => r.email),
    stringColumn<DemoUser>("Role", (r) => r.role),
  ];

  afterSubmit(user: DemoUser): void {
    this.db.users.save(user);
  }
  afterDelete(user: DemoUser): void {
    this.db.users.delete(user);
  }

  submitLabel(): string {
    return this.editedRecord.get().isPersisted() ? "Update" : "Create";
  }
}

*/