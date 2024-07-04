import Navbar  from "./_components/Navbar";

interface LayoutProps{
    children : React.ReactNode
}

const Layout = ({children} : LayoutProps) => {
    return (
        <div className="w-full h-screen flex flex-col gap-y-10 items-center justify-center bg-sky-500">
            <Navbar/>
            {children}
        </div>
    )

}

export default Layout;