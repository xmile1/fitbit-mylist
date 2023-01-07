import { inbox } from "file-transfer";
import { getLists } from "./getLists";
import { setColorScheme } from "./setColorScheme";

export const processInbox = (initializeView) => {
  let fileName;
  while ((fileName = inbox.nextFile())) {
    if (fileName === "listFromSettings.cbor") {
      const list = getLists(fileName);
      initializeView(list);
    }
    if (fileName === "color.txt") {
      setColorScheme();
    }
  }
};
