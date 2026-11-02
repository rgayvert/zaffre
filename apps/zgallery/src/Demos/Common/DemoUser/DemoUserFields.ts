import { ValidationSchema, validationCheck as v, dropDownButtonSpec, atom, zget, Tuple4, RecordAtom, Atom, em, simpleMenuItemList } from "zaffre";
import { pickList } from "zaffre";
import { textInputSpec, emailInputSpec, passwordInputSpec, dateInputSpec, FormField } from "zaffre";
import { DemoUser, demoUserRoles, demoUserTitles } from "./DemoUser";

export const demoUserSchema = new ValidationSchema<DemoUser, keyof DemoUser>({
  title: v.string().nonempty(),
  firstName: v.string().nonempty(),
  lastName: v.string().min(1).max(20).lettersOnly(),
  email: v.email(),
  role: v.string().nonempty(),
  password: v.string().min(6),
  startDate: v.date().nonempty(),
});

export const initialDemoUser = () => new DemoUser({
  title: "Mr.",
  firstName: "John",
  lastName: "",
  email: "",
  password: "",
  role: "",
});

export const demoUserFields = (ra: RecordAtom<DemoUser>, disabled?: Atom<boolean>): FormField[]  => {
  const r = ra.get();
  const selectedTitle = ra.fieldAtom("title", r.title);
  const selectedRole = ra.fieldAtom("role", r.role);
  const titleList = simpleMenuItemList([...demoUserTitles], selectedTitle);
  const roleList = simpleMenuItemList([...demoUserRoles], selectedRole );
  const fields = [
    dropDownButtonSpec("title", selectedTitle, titleList).label("Title"),
    textInputSpec("lastName", ra.fieldAtom("lastName", r.lastName)).label("Last Name"),
    textInputSpec("firstName", ra.fieldAtom("firstName", r.firstName)).label("First Name"),
    emailInputSpec("email", ra.fieldAtom("email", r.email)).label("Email").width(em(30)),
    dropDownButtonSpec("role", selectedRole, roleList).label("Role"),
    passwordInputSpec("password", ra.fieldAtom("password", r.password)).label("Password"),
    dateInputSpec("startDate", ra.fieldAtom("startDate", r.startDate)).label("Start Date"),
  ];
  if (disabled) {
    fields.forEach((f) => f.disabled(disabled));
  }
  return fields.map((vf) => vf.build());
};

export type GridAreaMap = Record<string, Tuple4<number>>;

export const demoUserFieldsWithGridAreas = (ra: RecordAtom<DemoUser>): FormField[] => {
  const fields = demoUserFields(ra);
  const gridAreas: GridAreaMap = {
    "Title": [1, 1, 2, 3],
    "Last Name": [1, 3, 2, 12],
    "First Name": [1, 12, 2, 21],
    "Email": [2, 1, 3, 12],
    "Role": [2, 12, 3, 16],
    "Password": [3, 1, 4, 12],
    "Start Date": [3, 12, 4, 18]
  };
  const areaKeys = Object.keys(gridAreas);
  fields.forEach((field) => {
    const label = zget(field.label) || "";
    if (areaKeys.includes(label)) {
      const area = gridAreas[<keyof typeof gridAreas>label];
      field.setGridArea(...area);
    }
  })
  return fields;
}


