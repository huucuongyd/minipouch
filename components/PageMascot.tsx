"use client";

import { Mascot } from "page-mascot";

export function PageMascot() {
  return (
    <div className="pointer-events-none fixed right-3 bottom-0 z-40 sm:right-5">
      <div className="pointer-events-auto">
        <Mascot
          directions="/mascots/ballerina-directions.webp"
          reactions="/mascots/ballerina-reactions.webp"
          label="ballerina"
          size={120}
        />
      </div>
    </div>
  );
}
