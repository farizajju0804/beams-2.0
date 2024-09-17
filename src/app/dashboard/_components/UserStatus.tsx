interface UserStatusProps {
    rank: number;
    score: number;
  }
  
  const UserStatus: React.FC<UserStatusProps> = ({ rank, score }) => {
    const getMessageForRank = (rank: number): string => {
      switch (rank) {
        case 1: return "Champion! You're leading everyone!";
        case 2: return "Runner up! Just one step away from glory!";
        case 3: return "Third place! Almost at the top, keep pushing!";
        case 4: return "Fourth place! You're doing great, keep it up!";
        case 5: return "Top 5! Excellent work, try for the top 3!";
        case 6: return "Sixth place! You're in the upper ranks, well done!";
        case 7: return "Seventh heaven! Great effort, top 5 is close!";
        case 8: return "Eighth wonder! Keep pushing, the top is within reach!";
        case 9: return "Ninth place! Almost in the top 5, keep going!";
        case 10: return "Top 10! You're in a strong position, strive for higher!";
        default: return `You're in ${rank}th place. Keep moving up, the top is just ahead!`;
      }
    };
  
    const bgColor = rank <= 3 ? "bg-yellow" : (rank <= 10 ? "bg-yellow/80" : "bg-grey-1");
    const textColor = rank <= 10 ? "text-text" : "text-grey-2";
  
    return (
        <div className="px-4 w-full flex flex-col gap-6 mt-16 items-center justify-center">
      <div className={`${bgColor} w-full md:w-2/6 p-4 rounded-3xl flex items-center justify-between shadow-lg mx-auto text-lg ${textColor}`}>
      <div className="flex items-center gap-4">
        <span className="w-8 h-8 bg-text text-background flex items-center justify-center rounded-full">{rank}</span>
        <span className="text-text font-semibold text-lg">You</span>
        </div>
        <span className="font-semibold font-poppins">{score}</span>
      </div>
        <p className="mx-auto font-medium text-center text-base md:text-lg">{getMessageForRank(rank)}</p>
    </div>
    );
  };
  

  export default UserStatus