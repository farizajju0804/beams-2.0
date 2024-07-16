
import { Badge } from "@nextui-org/react"; // Import Badge from NextUI

export const SectionTitle = ({ text }: { text: string }) => {
  return (
    <Badge
      color="primary"
      variant="flat"
      className="bg-black text-white p-2 rounded-md text-xl lg:text-2xl"
    >
      {text}
    </Badge>
  );
};
