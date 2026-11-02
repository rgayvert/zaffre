
// Adapted from developer.mozilla.org


export class HoverAnimationModel {

  // colors & transforms for each of the faces of a cube
  
  faces = [
    ["#505050a1", "translateZ(50px)"],
    ["00d200a1", "rotateY(180deg) translateZ(50px)"],
    ["d20000a1", "rotateY(90deg) translateZ(50px)"],
    ["0000d2a1", "rotateY(-90deg) translateZ(50px)"],
    ["d2d200a1", "rotateX(90deg) translateZ(50px)"],
    ["d200d2a1", "rotateX(-90deg) translateZ(50px)"],
  ];

}
