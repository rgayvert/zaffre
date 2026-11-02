import { ch} from ":attributes";
import { zborder, zspace } from ":theme";

export const hstackExampleRules = {
  "container": {
    minWidth: ch(30),
    gap: zspace.s3,
    border: zborder.thin,
    padding: zspace.s3,
    alignItems: "center",
    justifyContent: "center",
  }
};