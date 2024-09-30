import { ColorToken, Attributes } from ":attributes";
import { AttributeEffect } from ":effect";

//
// Basic color transition, useful for images.
//

export function coreColorEffect(color: ColorToken): AttributeEffect {
    const attrs: Attributes = {
      color: color
    };
    return new AttributeEffect(attrs, "in&out");
  }
  