import { View, BulletList, ch, core } from "zaffre";

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

export function BulletListExample(): View {
  return BulletList(bulletText, {
    indent: ch(1.5),
    bullets: "⦿◦+‣",  
    textLabelOptions: {
      color: core.color.blue
    }
  });
}
