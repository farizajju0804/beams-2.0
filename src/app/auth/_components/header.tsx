// Define an interface for the expected props of the Header component
interface HeaderProps {
  label: string; // Required prop that sets the text content of the header
}

// Header component that accepts a label prop
export const Header = ({ label }: HeaderProps) => {
  return (
    // Render the label inside an h1 element with responsive and stylistic classes
    <h1 className="text-2xl text-left md:text-4xl flex-1 text-text font-poppins font-semibold">
      {label} {/* Displays the provided label text */}
    </h1>
  );
};
