import { Composition } from "remotion";
import { StatCard } from "./StatCard";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="StatCard"
      component={StatCard}
      durationInFrames={150}
      fps={30}
      width={1080}
      height={1350}
      defaultProps={{
        label: "Qualified enquiries",
        value: 240,
        prefix: "",
        suffix: "+",
        client: "Dublin Property Agency",
      }}
    />
  );
};
