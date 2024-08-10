interface HeaderProps {
  label: string;
}

export const Header = ({ label }: HeaderProps) => {
  return (
    <div className="w-full flex flex-col gap-y-4 items-center justify-center">
      <h1 className="text-xl lg:text-3xl text-text font-poppins lg:my-2 font-semibold">{label}</h1>
    </div>
  );
};