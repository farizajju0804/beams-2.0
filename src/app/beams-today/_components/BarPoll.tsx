'use client'; // Ensures the component is rendered on the client side in a Next.js environment.

import { useEffect, useState } from "react";
import { motion } from "framer-motion"; // For animations during interactions.
import { recordPollResponse, getUserPollResponse } from "@/actions/beams-today/pollActions"; // API calls for recording and retrieving poll responses.
import { Chip } from "@nextui-org/react"; // UI component from NextUI for displaying chips.
import { useCurrentUser } from "@/hooks/use-current-user"; // Custom hook to retrieve current user information.
import { TickCircle } from 'iconsax-react'; // Icon to display when a user has selected an option.
import { useTheme } from "next-themes"; // Hook to access the current theme (light/dark).

// Type definition for vote options.
type VoteType = {
  id: string; // Unique identifier for the poll option.
  title: string; // The option's text.
  votes: number; // Number of votes for this option.
  color: string; // Background color used for the option.
  textcolor: string; // Text color used for the option.
};

// Type definition for each option in the poll.
interface PollOption {
  id: string; // Unique identifier for the poll option.
  optionText: string; // The displayed text for the poll option.
  votes: number; // The number of votes for the poll option.
}

// Type definition for the poll structure.
interface Poll {
  id: string; // Unique identifier for the poll.
  title: string; // Title of the poll.
  description: string; // Description of the poll.
  question: string; // The poll's question that users vote on.
  options: PollOption[]; // The available options for the poll.
}

// Type definition for the props passed to the BarPoll component.
interface PollComponentProps {
  poll: Poll; // The poll data object passed to the component.
}

// BarPoll component definition.
const BarPoll: React.FC<PollComponentProps> = ({ poll }) => {
  // Color options for the poll bars.
  const colors = ["bg-[#F9D42E]", "bg-[#620097]", "bg-[#f96f2e]", "bg-[#370075]"];
  const textcolors = ["text-black", "text-white", "text-white", "text-white"];

  // State to manage the votes for each option.
  const [votes, setVotes] = useState<VoteType[]>(
    poll.options.map((option, index) => ({
      id: option.id,
      title: option.optionText,
      votes: option.votes,
      color: colors[index % colors.length], // Assign unique background colors for each option.
      textcolor: textcolors[index % textcolors.length] // Assign unique text colors for each option.
    }))
  );

  const [hasVoted, setHasVoted] = useState<boolean>(false); // State to track if the user has already voted.
  const [showResults, setShowResults] = useState<boolean>(false); // State to show the poll results.
  const [userResponse, setUserResponse] = useState<string | null>(null); // State to track the user's selected option.
  const { theme }: any = useTheme(); // Retrieve the current theme (light/dark).
  const lightBg = '/images/beams-today/poll-bg.png'; // Background image for light theme.
  const darkBg = '/images/beams-today/poll-bg-dark.png'; // Background image for dark theme.

  // Effect to check if the user has already voted on the poll.
  useEffect(() => {
    const checkUserResponse = async () => {
      try {
        const response = await getUserPollResponse(poll.id); // Retrieve the user's previous response.
        if (response) {
          setHasVoted(true); // Set hasVoted to true if the user has already voted.
          setShowResults(true); // Show the poll results if the user has voted.
          setUserResponse(response.pollOptionId); // Track the user's selected option.
        }
      } catch (error) {
        console.error("Error checking user response:", error); // Log errors if any.
      }
    };

    checkUserResponse(); // Call the function on component mount.
  }, [poll.id]); // Dependency on poll.id to refetch if poll changes.

  // Function to increment the vote count for an option.
  const handleIncrementVote = async (vote: VoteType) => {
    try {
      await recordPollResponse(vote.id); // Record the user's vote via API.
      const newVote = { ...vote, votes: vote.votes + 1 }; // Increment the vote count locally.
      setVotes((pv) => pv.map((v) => (v.id === newVote.id ? newVote : v))); // Update the state with the new vote count.
      setHasVoted(true); // Set hasVoted to true after the user has voted.
      setShowResults(true); // Show the results after voting.
      setUserResponse(vote.id); // Track the user's selected option.
    } catch (error) {
      console.error("Error recording vote:", error); // Log any errors during the voting process.
    }
  };

  const optionLabels = ["A", "B", "C", "D"]; // Option labels for the poll options.
  const user: any = useCurrentUser(); // Retrieve current user information.

  return (
    <section
      className="bg-brand/10 p-6 mb-10 lg:mb-12 rounded-3xl"
      style={{
        transformOrigin: "top center", // Origin point for animations.
        backgroundImage: `url(${theme === "dark" ? darkBg : lightBg})`, // Dynamically change background image based on the theme.
        backgroundSize: "cover", // Ensure the background image covers the section.
        backgroundPosition: "center", // Center the background image.
      }}
    >
      {showResults ? (
        <Results votes={votes} poll={poll} optionLabels={optionLabels} userResponse={userResponse} /> // Show the results if the user has voted.
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

// Component to display the poll question and voting options.
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
  const totalVotes = votes.reduce((acc, cv) => (acc += cv.votes), 0); // Calculate the total votes across all options.

  return (
    <>
      <h1 className="text-lg md:text-xl font-poppins font-bold mb-2">Poll</h1>
      <h1 className="text-lg md:text-xl font-display font-bold italic mb-1">Your Opinion Matters, {name}</h1>
      <div className="border-b-2 border-brand mb-6 w-full" style={{ maxWidth: '10%' }}></div>
      <div className="mb-6 mt-2 w-full flex-col-reverse justify-between flex md:flex-row items-start md:items-center gap-4">
        <div>
          <h3 className="text-xl md:text-2xl text-left font-medium text-text w-full ">
            {poll.question} {/* Display the poll question */}
          </h3>
        </div>
        <Chip className="text-background bg-text">{totalVotes} Votes</Chip> {/* Display total vote count */}
      </div>
      <div className="flex flex-col w-full lg:w-4/6 mt-4 gap-8">
        {votes.map((vote, index) => (
          <motion.button
            whileHover={{ scale: 1.05 }} // Animation on hover.
            whileTap={{ scale: 0.95 }} // Animation on tap.
            onClick={() => handleIncrementVote(vote)} // Increment vote on button click.
            key={vote.id}
            className={`flex text-left px-4 items-start text-sm py-3 lg:text-base justify-start  w-full lg:w-4/6 rounded-lg ${vote.color}  ${vote.textcolor} font-medium`}
            disabled={hasVoted} // Disable the button if the user has already voted.
          >
            <span className="mr-2 text-left">{optionLabels[index]}.</span> {vote.title} {/* Display option label and text */}
          </motion.button>
        ))}
      </div>
    </>
  );
};

// Component to display the poll results after the user has voted.
const Results = ({
  votes,
  poll,
  optionLabels,
  userResponse
}: {
  votes: VoteType[];
  poll: Poll;
  optionLabels: string[];
  userResponse: string | null;
}) => {
  const totalVotes = votes.reduce((acc, cv) => (acc += cv.votes), 0); // Calculate the total votes.

  return (
    <>
      <h1 className="text-lg md:text-xl font-poppins font-bold mb-2">Poll</h1>
      <h1 className="text-xl md:text-xl italic font-display font-bold mb-1">Thanks For Your Response</h1>
      <div className="border-b-2 border-brand mb-6 w-full" style={{ maxWidth: '10%' }}></div>
      <div className="mb-6 w-full flex flex-col-reverse md:flex-row items-start md:items-center gap-4">
        <h3 className="text-xl md:text-3xl text-left font-medium text-text w-full md:w-5/6">
          {poll.question} {/* Display the poll question */}
        </h3>
        <Chip className="text-background bg-text">{totalVotes} Votes</Chip> {/* Display total vote count */}
      </div>
      <div className="col-span-1 grid gap-8">
        {votes.map((vote, index) => {
          const width = vote.votes
            ? ((vote.votes / totalVotes) * 100).toFixed(2) // Calculate the percentage of votes.
            : 0;
          const userVoteClass = vote.id === userResponse ? 'flex items-center' : ''; // Highlight user's vote.
          return (
            <div key={vote.id} className="w-full lg:w-4/6">
              <div className={`flex items-center mb-1 ${userVoteClass}`}>
                <span className="text-sm md:text-lg font-medium text-grey-2">{optionLabels[index]}. {vote.title}</span>
                {vote.id === userResponse && <TickCircle size="24" color="#34D399" className="ml-2" />} {/* Show tick icon if user selected this option */}
                <span className="ml-2 text-xs md:text-base text-grey-2/70">{vote.votes} votes</span>
              </div>
              <div className="relative h-8 rounded-full bg-gray-200">
                <motion.span
                  animate={{ width: `${width}%` }} // Animate the bar width to represent the vote percentage.
                  className={`absolute top-0 left-0 h-full rounded-full ${vote.color}`} // Style the vote bar.
                  transition={{ type: "spring" }} // Use spring animation for smooth transitions.
                />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default BarPoll; // Export the BarPoll component for use in other parts of the application.
