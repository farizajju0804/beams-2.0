import BackButton from "@/components/auth/back-button";
import { Header } from "@/components/auth/header";
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
                <BackButton label="Back to login" href="/auth/login"/>
          </CardFooter>

        </Card>
    )
}