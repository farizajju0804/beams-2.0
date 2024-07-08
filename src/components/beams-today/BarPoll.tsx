'use client'
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { recordPollResponse, getUserPollResponse } from "@/actions/beams-today/pollActions";

type VoteType = {
  id: string;
  title: string;
  votes: number;
  color: string;
};

interface PollOption {
  id: string;
  optionText: string;
  votes: number;
}

interface Poll {
  id: string;
  title: string;
  description: string;
  question: string;
  options: PollOption[];
}

interface PollComponentProps {
  poll: Poll;
}

const BarPoll: React.FC<PollComponentProps> = ({ poll }) => {
  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500"
  ];

  const [votes, setVotes] = useState<VoteType[]>(
    poll.options.map((option, index) => ({
      id: option.id,
      title: option.optionText,
      votes: option.votes,
      color: colors[index % colors.length], // Assign unique colors for each option
    }))
  );
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);

  useEffect(() => {
    const checkUserResponse = async () => {
      try {
        const response = await getUserPollResponse(poll.id);
        if (response) {
          setHasVoted(true);
          setShowResults(true);
        }
      } catch (error) {
        console.error("Error checking user response:", error);
      }
    };

    checkUserResponse();
  }, [poll.id]);

  const handleIncrementVote = async (vote: VoteType) => {
    try {
      await recordPollResponse(vote.id);
      const newVote = { ...vote, votes: vote.votes + 1 };
      setVotes((pv) => pv.map((v) => (v.id === newVote.id ? newVote : v)));
      setHasVoted(true);
      setShowResults(true); // Show results after voting
    } catch (error) {
      console.error("Error recording vote:", error);
    }
  };

  return (
    <section className="bg-white px-4 py-12">
      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-2 md:grid-cols-[1fr_400px] md:gap-12">
        {showResults ? (
          <Bars votes={votes} />
        ) : (
          <Options votes={votes} setVotes={setVotes} handleIncrementVote={handleIncrementVote} poll={poll} hasVoted={hasVoted} />
        )}
      </div>
    </section>
  );
};

const Options = ({
  votes,
  setVotes,
  handleIncrementVote,
  poll,
  hasVoted
}: {
  votes: VoteType[];
  setVotes: Dispatch<SetStateAction<VoteType[]>>;
  handleIncrementVote: (vote: VoteType) => void;
  poll: Poll;
  hasVoted: boolean;
}) => {
  const totalVotes = votes.reduce((acc, cv) => (acc += cv.votes), 0);

  return (
    <div className="col-span-1 py-12">
      <h3 className="mb-6 text-3xl font-semibold text-black">
        {poll.question}
      </h3>
      <div className="mb-6 space-y-2">
        {votes.map((vote) => (
          <motion.button
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.985 }}
            onClick={() => handleIncrementVote(vote)}
            key={vote.id}
            className={`w-full rounded-md ${vote.color} py-2 font-medium text-white`}
            disabled={hasVoted} // Disable button if user has already voted
          >
            {vote.title}
          </motion.button>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <span className="mb-2 italic text-slate-400">{totalVotes} votes</span>
      </div>
    </div>
  );
};

const Bars = ({ votes }: { votes: VoteType[] }) => {
  const totalVotes = votes.reduce((acc, cv) => (acc += cv.votes), 0);

  return (
    <div
      className="col-span-1 grid min-h-[200px] gap-2"
      style={{
        gridTemplateColumns: `repeat(${votes.length}, minmax(0, 1fr))`,
      }}
    >
      {votes.map((vote) => {
        const height = vote.votes
          ? ((vote.votes / totalVotes) * 100).toFixed(2)
          : 0;
        return (
          <div key={vote.id} className="col-span-1">
            <div className="relative flex h-full w-full items-end overflow-hidden rounded-2xl bg-gradient-to-b from-slate-700 to-slate-800">
              <motion.span
                animate={{ height: `${height}%` }}
                className={`relative z-0 w-full ${vote.color}`}
                transition={{ type: "spring" }}
              />
              <span className="absolute bottom-0 left-[50%] mt-2 inline-block w-full -translate-x-[50%] p-2 text-center text-sm text-slate-50">
                <b>{vote.title}</b>
                <br />
                <span className="text-xs text-slate-200">
                  {vote.votes} votes
                </span>
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BarPoll;
