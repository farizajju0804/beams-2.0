import * as React from "react";
import { APITypes, PlyrInstance, PlyrProps, usePlyr } from "plyr-react";
import "plyr-react/dist/plyr.css";

const CustomPlyrInstance = React.forwardRef<APITypes, PlyrProps>(
  (props, ref) => {
    const { source, options = null } = props;
    const raptorRef = usePlyr(ref, { options, source });

    React.useEffect(() => {
      const { current } = ref as React.MutableRefObject<APITypes>;
      if (current.plyr.source === null) return;

      const api = current as { plyr: PlyrInstance };
      api.plyr.on("ready", () => console.log("I'm ready"));
      api.plyr.on("canplay", () => {
        api.plyr.play();
        console.log("duration of audio is", api.plyr.duration);
      });
      api.plyr.on("ended", () => console.log("I'm Ended"));
    }, [ref]);

    return (
      <video
        ref={raptorRef as React.MutableRefObject<HTMLVideoElement>}
        className="plyr-react plyr"
      />
    );
  }
);

CustomPlyrInstance.displayName = "CustomPlyrInstance";

export default CustomPlyrInstance;
