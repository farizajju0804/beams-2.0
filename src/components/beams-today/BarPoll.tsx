'use client'
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { recordPollResponse, getUserPollResponse } from "@/actions/beams-today/pollActions";
import { Chip } from "@nextui-org/react";

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

  const optionLabels = ["A", "B", "C", "D", "E", "F", "G", "H"];

  return (
    <section className="bg-brand-100 p-6 rounded-3xl">
      {showResults ? (
        <Results votes={votes} poll={poll} optionLabels={optionLabels} />
      ) : (
        <Question
          poll={poll}
          votes={votes}
          handleIncrementVote={handleIncrementVote}
          hasVoted={hasVoted}
          optionLabels={optionLabels}
        />
      )}
    </section>
  );
};

const Question = ({
  poll,
  votes,
  handleIncrementVote,
  hasVoted,
  optionLabels
}: {
  poll: Poll;
  votes: VoteType[];
  handleIncrementVote: (vote: VoteType) => void;
  hasVoted: boolean;
  optionLabels: string[];
}) => {
  const totalVotes = votes.reduce((acc, cv) => (acc += cv.votes), 0);

  return (
    <>
      <div className="mb-6 mt-2 w-full flex-col-reverse flex md:flex-row items-start md:items-center gap-4">
        <div>
          <h3 className="text-xl md:text-4xl text-left font-semibold text-black w-full md:w-5/6">
            {poll.question}
          </h3>
        </div>
        <Chip className="text-white bg-black">{totalVotes} Votes</Chip>
      </div>
      <div className="flex flex-col mt-4 gap-6">
        {votes.map((vote, index) => (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleIncrementVote(vote)}
            key={vote.id}
            className={`flex items-center text-base py-4 lg:text-lg justify-center  w-full rounded-lg ${vote.color} text-white font-medium`}
            disabled={hasVoted}
          >
            <span className="mr-2 text-left">{optionLabels[index]}.</span> {vote.title}
          </motion.button>
        ))}
      </div>
    </>
  );
};

const Results = ({ votes, poll, optionLabels }: { votes: VoteType[]; poll: Poll; optionLabels: string[] }) => {
  const totalVotes = votes.reduce((acc, cv) => (acc += cv.votes), 0);

  return (
    <>
     <h1 className="text-xl md:text-3xl font-display font-bold mb-1">Poll</h1>
     <div className="border-b-2 border-brand-950 mb-6 w-full" style={{ maxWidth: '10%' }}></div>
      <div className="mb-6 w-full flex flex-col-reverse md:flex-row items-start md:items-center gap-4">
        <h3 className="text-xl md:text-4xl text-left font-semibold text-black w-full md:w-5/6">
          {poll.question}
        </h3>
        <Chip className="text-white bg-black">{totalVotes} Votes</Chip>
      </div>
      <div className="col-span-1 grid gap-6">
        {votes.map((vote, index) => {
          const width = vote.votes
            ? ((vote.votes / totalVotes) * 100).toFixed(2)
            : 0;
          return (
            <div key={vote.id} className="w-full">
              <div className="flex items-center mb-1">
                <span className="text-sm font-medium text-gray-700">{optionLabels[index]}. {vote.title}</span>
                <span className="ml-2 text-xs text-gray-500">{vote.votes} votes</span>
              </div>
              <div className="relative h-8 rounded-full bg-gray-300">
                <motion.span
                  animate={{ width: `${width}%` }}
                  className={`absolute top-0 left-0 h-full rounded-full ${vote.color}`}
                  transition={{ type: "spring" }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default BarPoll;
