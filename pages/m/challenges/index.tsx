import { useQuery } from "@apollo/client";
import { FunctionComponent } from "react";

interface ChallengesProps {}

const Challenges: FunctionComponent<ChallengesProps> = () => {
  const { data, error, loading } = useQuery();

  return (
    <div>
      <div>도전 출판</div>
    </div>
  );
};

export default Challenges;
