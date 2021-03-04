/**
1. Install and configure `react-native-orientation-locker`.
2. In both the iOS and Android projects, set the allowed platform orientations to everything except upside down.
*/

import { useEffect } from "react";
import Orientation, { OrientationType } from "react-native-orientation-locker";

export function useLockOrientationPortrait() {
  Orientation.lockToPortrait();
}

/// Unlocks rotation when a component mounts. Resets orientation when component unmounts.
export function useAnyOrientation() {
  useEffect(() => {
    let previousOrientation: OrientationType;
    Orientation.getOrientation((orientation) => {
      previousOrientation = orientation;
      Orientation.unlockAllOrientations();
    });

    return () => {
      switch (previousOrientation) {
        case "LANDSCAPE-LEFT":
          Orientation.lockToLandscapeLeft();
          break;
        case "LANDSCAPE-RIGHT":
          Orientation.lockToLandscapeRight();
          break;
        default:
          Orientation.lockToPortrait();
          break;
      }
    };
  }, []);
}
