import React from 'react'; // Importing React library
import { currentUser } from '@/libs/auth'; // Importing the currentUser function to retrieve user data
import { TrendingFacts } from './_components/TrendingFacts'; // Importing the TrendingFacts component
import {  getFactAndCompletionStatus, getTrendingFacts } from '@/actions/fod/fod'; // Importing functions for fetching facts
import { cookies } from 'next/headers'; // Importing cookies utility from Next.js headers
import FactOfTheDay from './_components/FactOfTheDay';
import FactSearch from './_components/FactsSearch';
import { getAllFactCategories } from '@/actions/fod/search';

// Asynchronous page component to fetch and display facts
const page = async () => {
    // Retrieve the current user information
    const user: any = await currentUser();

    // Access the cookie store to get client-specific settings
    const cookieStore = cookies();
    
    // Retrieve the client's time zone from cookies or default to 'UTC'
    const timeZone = cookieStore.get('client_time_zone')?.value || 'UTC';

    // Get the current date in the client's locale format
    const now = new Date();
    const clientDate = now.toLocaleDateString('en-CA', { timeZone });

    // Fetch the fact of the day and completion status for the current user
    const factData = await getFactAndCompletionStatus(user.id, clientDate);

    // Extract the user ID for further use
    const userId = user.id;
    const categories = await getAllFactCategories();
    // Fetch the initial trending facts based on the current date and user ID
    const initialData = await getTrendingFacts({
        clientDate: clientDate,
        page: 1,
        sortBy: "dateDesc", // Sorting by date in descending order
        filterOption: "all", // No filter applied
        userId
    });

    // console.log(initialData)


    // Render the component
    return (
        <div className="flex mx-auto max-w-[100vw] lg:max-w-5xl flex-col gap-3 md:gap-6 items-center justify-center w-full bg-background">
            <h1 className="font-poppins my-3 md:my-0 text-2xl md:text-4xl uppercase font-semibold bg-purple text-yellow p-2">
                Beams Facts
            </h1>
            <FactOfTheDay fact={factData} userId={userId}/>
            <FactSearch categories={categories} userId={userId} /> 
            <TrendingFacts initialData={initialData} userId={userId} clientDate={clientDate} />
        </div>
    );
};

export default page; // Export the page component for use in other parts of the application
