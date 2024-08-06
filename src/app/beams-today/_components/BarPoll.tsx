'use client'
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { recordPollResponse, getUserPollResponse } from "@/actions/beams-today/pollActions";
import { Chip } from "@nextui-org/react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { TickCircle } from 'iconsax-react';
import { useTheme } from "next-themes";

type VoteType = {
  id: string;
  title: string;
  votes: number;
  color: string;
  textcolor : string;
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
    "bg-[#F9D42E]",
    "bg-[#620097]",
    "bg-[#f96f2e]",
    "bg-[#370075]",
  ];
  const textcolors = [
    "text-black",
    "text-white",
    "text-white",
    "text-white",
  ];

  const [votes, setVotes] = useState<VoteType[]>(
    poll.options.map((option, index) => ({
      id: option.id,
      title: option.optionText,
      votes: option.votes,
      color: colors[index % colors.length], // Assign unique colors for each option
      textcolor : textcolors[index % textcolors.length]
    }))
  );
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [userResponse, setUserResponse] = useState<string | null>(null);
  const { theme }:any = useTheme();
  const lightBg = '/images/beams-today/poll-bg.png';
  const darkBg = '/images/beams-today/poll-bg-dark.png';
  useEffect(() => {
    const checkUserResponse = async () => {
      try {
        const response = await getUserPollResponse(poll.id);
        if (response) {
          setHasVoted(true);
          setShowResults(true);
          setUserResponse(response.pollOptionId);
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
      setUserResponse(vote.id);
    } catch (error) {
      console.error("Error recording vote:", error);
    }
  };

  const optionLabels = ["A", "B", "C", "D"];
  const user:any = useCurrentUser();
  return (
    <section className="bg-brand/10 p-6 mb-10 lg:mb-12 rounded-3xl" 
    style={{
      transformOrigin: "top center",
      backgroundImage: `url(${theme === "dark" ? darkBg : lightBg})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
    >
      {showResults ? (
        <Results votes={votes} poll={poll} optionLabels={optionLabels} userResponse={userResponse} />
      ) : (
        <Question
          name={user?.name}
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
  name,
  votes,
  handleIncrementVote,
  hasVoted,
  optionLabels
}: {
  poll: Poll;
  name: string;
  votes: VoteType[];
  handleIncrementVote: (vote: VoteType) => void;
  hasVoted: boolean;
  optionLabels: string[];
}) => {
  const totalVotes = votes.reduce((acc, cv) => (acc += cv.votes), 0);

  return (
    <>
     <h1 className="text-lg md:text-xl font-poppins font-bold mb-2">Poll</h1>
     <h1 className="text-lg md:text-xl font-display font-bold italic mb-1">Your Opinion Matters, {name}</h1>
     <div className="border-b-2 border-brand mb-6 w-full" style={{ maxWidth: '10%' }}></div>
      <div className="mb-6 mt-2 w-full flex-col-reverse justify-between flex md:flex-row items-start md:items-center gap-4">
     
        <div>
          <h3 className="text-xl md:text-2xl text-left font-medium text-text w-full ">
            {poll.question}
          </h3>
        </div>
        <Chip className="text-background bg-text">{totalVotes} Votes</Chip>
      </div>
      <div className="flex flex-col w-full lg:w-4/6 mt-4 gap-8">
        {votes.map((vote, index) => (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleIncrementVote(vote)}
            key={vote.id}
            className={`flex text-left px-4 items-start text-sm py-3 lg:text-base justify-start  w-full lg:w-4/6 rounded-lg ${vote.color}  ${vote.textcolor} font-medium`}
            disabled={hasVoted}
          >
            <span className="mr-2 text-left">{optionLabels[index]}.</span> {vote.title}
          </motion.button>
        ))}
      </div>
    </>
  );
};

const Results = ({ votes, poll, optionLabels, userResponse }: { votes: VoteType[]; poll: Poll; optionLabels: string[]; userResponse: string | null }) => {
  const totalVotes = votes.reduce((acc, cv) => (acc += cv.votes), 0);

  return (
    <>
     <h1 className="text-lg md:text-xl font-poppins font-bold mb-2">Poll</h1>
      <h1 className="text-xl md:text-xl italic font-display font-bold mb-1">Thanks For Your Response</h1>
      <div className="border-b-2 border-brand mb-6 w-full" style={{ maxWidth: '10%' }}></div>
      <div className="mb-6 w-full flex flex-col-reverse md:flex-row items-start md:items-center gap-4">
        <h3 className="text-xl md:text-3xl text-left font-medium text-text w-full md:w-5/6">
          {poll.question}
        </h3>
        <Chip className="text-background bg-text">{totalVotes} Votes</Chip>
      </div>
      <div className="col-span-1 grid gap-8">
        {votes.map((vote, index) => {
          const width = vote.votes
            ? ((vote.votes / totalVotes) * 100).toFixed(2)
            : 0;
          const userVoteClass = vote.id === userResponse ? 'flex items-center' : '';
          return (
            <div key={vote.id} className="w-full lg:w-4/6">
              <div className={`flex items-center mb-1 ${userVoteClass}`}>
                <span className="text-sm md:text-lg font-medium text-grey-2">{optionLabels[index]}. {vote.title}</span>
                {vote.id === userResponse && <TickCircle size="24" color="#34D399" className="ml-2" />}
                <span className="ml-2 text-xs md:text-base text-grey-2/70">{vote.votes} votes</span>
              </div>
              <div className="relative h-8 rounded-full bg-gray-200">
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