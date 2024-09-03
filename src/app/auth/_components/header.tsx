interface HeaderProps {
  label: string;
}

export const Header = ({ label }: HeaderProps) => {
  return (
   
      <h1 className="text-2xl text-left md:text-4xl flex-1 text-text font-poppins font-semibold">{label}</h1>
  
  );
};