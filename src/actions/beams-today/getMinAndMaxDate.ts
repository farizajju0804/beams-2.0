"use server"

import { getAllBeamsToday } from "./getAllBeamsToday"
import {  parseDate } from '@internationalized/date';
import { format } from 'date-fns';


export const getMinAndMaxDate= async() => {
const topics = await getAllBeamsToday()

if(topics){
const highlightDates1 = topics.map((topic: any) =>
    new Date(topic.date).toISOString().split("T")[0]
  );

  const highlightDates = highlightDates1.map((dateString: any) => {
    const date = new Date(dateString);
    return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  });
// Parse the date strings into DateValue objects.
  const minDateString =
    highlightDates.length > 0
      ? format(new Date(Math.min(...highlightDates.map((date: any) => date.getTime()))), "yyyy-MM-dd")
      : null;

  const maxDateString =
    highlightDates.length > 0
      ? format(new Date(Math.max(...highlightDates.map((date: any) => date.getTime()))), "yyyy-MM-dd")
      : null;

//   const minDate = minDateString ? parseDate(minDateString) : null;
//   const maxDate = maxDateString ? parseDate(maxDateString) : null;

  
  return {minDateString,maxDateString}
}
}