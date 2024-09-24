interface UserStatusProps {
  rank: number; // Make rank optional
  score: number; // Make score optional
}

const UserStatus: React.FC<UserStatusProps> = ({ rank = 0, score = 0 }) => {
  const getMessageForRank = (rank: number): string => {
    switch (rank) {
      case 1: return "You're in the lead! Stay sharp, the competition is close!";
      case 2: return "Second place! You're almost there, push for the top!";
      case 3: return "You're in third! Keep focused, you can climb higher!";
      case 4: return "Fourth place! You're close to the top, keep up the momentum!";
      case 5: return "Top 5! You're doing great, aim for a top 3 finish!";
      case 6: return "Sixth place! A solid effort, push forward for the top 5!";
      case 7: return "Seventh place! Keep the energy up, the top ranks are within reach!";
      case 8: return "Eighth place! Stay focused, the top 5 is not far off!";
      case 9: return "Ninth place! You're close to the upper ranks, keep going!";
      case 10: return "Top 10! Strong position, aim to move up further!";
      default: return `You're in ${rank}th place. Stay determined, the top is just ahead!`;
    }
  };
  

  const bgColor = rank <= 3 ? "bg-yellow" : (rank <= 10 ? "bg-yellow" : "bg-grey-1");
  const textColor = rank <= 10 ? "text-black" : "text-grey-2";

  return (

        <div className="px-4 w-full flex flex-col gap-6 mt-8 items-center justify-center">
          <div className={`${bgColor} w-full md:w-2/6 p-4 rounded-3xl flex items-center justify-between shadow-lg mx-auto text-lg ${textColor}`}>
            <div className="flex items-center gap-4">
              <span className="w-8 h-8 bg-text text-background flex items-center justify-center rounded-full">{rank}</span>
              <span className="font-semibold text-lg">You</span>
            </div>
            <span className="font-semibold font-poppins">{score}</span>
          </div>
          <p className="mx-auto font-medium text-center text-base md:text-lg">{getMessageForRank(rank)}</p>
        </div>

  );
};

export default UserStatus;
