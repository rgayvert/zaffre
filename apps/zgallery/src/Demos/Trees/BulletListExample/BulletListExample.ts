import { BulletList } from "zaffre";
import { bulletListExampleRules } from "./BulletListExample.rules";

const bulletText = `
line 1
 line 1.a
  line 1.a.1
  line 1.a.2
 line 1.b
line 2
 line 2.a
 line 2.b
`;

export const BulletListExample = () => {
  return BulletList(bulletText, { rules: bulletListExampleRules });
};
