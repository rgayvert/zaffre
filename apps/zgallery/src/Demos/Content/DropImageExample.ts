import { ImageBox, atom, px, zborder } from "zaffre";

export const DropImageExample = () => {
  const url = atom("image.no-image-available");

  const willAcceptData = (data: any) => {
    console.log("acceptData: "+data);
    return true;
  }
  const performDrop = (data: any) => {
    console.log("acceptData: "+data);
    return ;
  }

  return ImageBox(url, {
    width: px(100),
    height: px(100),
    padding: px(10),
    border: zborder.thin,
    events: {
      drop: {
        acceptsDrop: true,
        acceptsData: (data) => willAcceptData(data),
        dropAction: (data: unknown) => performDrop(data),
      },
    },
  });
};
