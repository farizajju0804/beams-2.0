import { CardStack } from "./CardStack";
import { SectionTitle } from "./SectionTitle"; // Import Title component

const CARDS = [
  {
    id: 0,
    name: "Manu Arora",
    designation: "Senior Software Engineer",
    imageUrl: "https://res.cloudinary.com/drlyyxqh9/image/upload/v1720690800/Beams%20today/thumbnails/ear_tbxkpk.png", // Add image URL
  },
  {
    id: 1,
    name: "Elon Musk",
    designation: "Senior Shitposter",
    imageUrl: "https://res.cloudinary.com/drlyyxqh9/image/upload/v1720690681/Beams%20today/thumbnails/headphnr_cqiulp.png", // Add image URL
  },
  {
    id: 2,
    name: "Tyler Durden",
    designation: "Manager Project Mayhem",
    imageUrl: "https://res.cloudinary.com/drlyyxqh9/image/upload/v1720690705/Beams%20today/thumbnails/robot_kxbv5o.png", // Add image URL
  },
];

export function TrendingCardStack() {
  return (
    <div className="my-8 flex items-center flex-col justify-center max-w-5xl w-[90%] lg:w-5/6 gap-12 relative mx-2 lg:mx-4 border-2 border-gray-100 px-8 py-4 pb-8 rounded-3xl">
      <div className="flex items-center justify-between w-full ">
        <SectionTitle text="Trending Shows" />
      </div>
      <CardStack items={CARDS} />
    </div>
  );
}
