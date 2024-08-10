import { Suspense, type FC } from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: FC<Readonly<AuthLayoutProps>> = ({ children }) => {
  return (
    <Suspense>
    <div className="min-h-screen w-full flex items-center justify-center bg-yellow"
    style={{
      backgroundImage: `url(${'https://img.freepik.com/free-vector/stylish-bright-yellow-color-halftone-background_1055-8924.jpg?t=st=1723291082~exp=1723294682~hmac=76fbdcbee564fde2815c5a090e576aa1b47106892a9f9c8c47a4c69aa352b6ae&w=826'})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      objectFit: 'cover'
    }}
    >
      {children}
    </div>
    </Suspense>
  );
};

export default AuthLayout;