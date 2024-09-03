import BackButton from "@/app/auth/_components/back-button";
import { Header } from "@/app/auth/_components/header";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "@nextui-org/react"

export const ErrorCard = () => {
    return(
        <Card className="w-[400px] shadow-md">
            <CardHeader>
                <Header label="Oops! Something Went Wrong!"/>
            </CardHeader>
            <CardFooter>
                <BackButton position="bottom" label="Back to login" href="/auth/login"/>
          </CardFooter>

        </Card>
    )
}