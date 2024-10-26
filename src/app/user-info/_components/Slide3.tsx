import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, DatePicker } from "@nextui-org/react";
import { useState } from "react";
import * as z from 'zod';

import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { FaChevronRight } from "react-icons/fa6";

import Image from "next/image";
import BackButton from "./BackButton";
import { parseDate, getLocalTimeZone, CalendarDate, today } from "@internationalized/date";


// Date validation schema
const DateSchema = z.object({
  dob: z
    .instanceof(CalendarDate, {
      message: 'Date of birth is required',  // Custom message for invalid date type
    })
    .refine((value) => value !== null, {
      message: 'Date of birth is required',  // Custom message for required date
    })
    .refine((value) => value && value.year && value.month && value.day, {
      message: 'Please enter a valid and complete date of birth',  // Custom message for incomplete date
    }),
});

type DateData = z.infer<typeof DateSchema>;

interface Slide3Props {
  onNext: (data: any) => void;
  formData: any;
  handleBack: () => void;
}

const Slide3: React.FC<Slide3Props> = ({ onNext, formData, handleBack }) => {
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const form = useForm<DateData>({
    resolver: zodResolver(DateSchema),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: {
      dob: formData.dob ? parseDate(formData.dob.split('T')[0]) : undefined,
    },
  });
  

  const calculateDaysUntilBirthday = (dob: CalendarDate) => {
    const now = today(getLocalTimeZone());
  
    const nowDate = now.toDate(getLocalTimeZone());
    const thisYearDate = new CalendarDate(now.year, dob.month, dob.day).toDate(getLocalTimeZone());
    const nextYearDate = new CalendarDate(now.year + 1, dob.month, dob.day).toDate(getLocalTimeZone());
  
    // Check if the birthday is in this year or next year
    const birthdayThisYear = thisYearDate >= nowDate ? thisYearDate : nextYearDate;
  
    // Calculate difference in time using native Date methods
    const differenceInTime = birthdayThisYear.getTime() - nowDate.getTime();
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
  
    // Special case for birthday today
    if (differenceInDays === 0) {
      return "It's your birthday today! 🎉 Happy Birthday! 🎂✨";
    }
  
    return `${differenceInDays} days until your next birthday! 🎉 We'll make sure it's special! 🎈✨`;
  };

  const handleDateChange = (date: CalendarDate | null) => {
  if (date) {
    form.setValue("dob", date, { shouldValidate: true });
    const feedbackMessage = calculateDaysUntilBirthday(date);
    setFeedbackMessage(feedbackMessage);
  }
};
  const maxDate = parseDate('2018-12-31');
  const minDate = parseDate('1900-01-01');
 
  const onSubmit = (data: DateData) => {
    if (data.dob) {
      // Get the year, month, and day directly from CalendarDate
      const { year, month, day } = data.dob;
  
      // Create a Date object in UTC without time zone shifts
      const utcDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0)); // month is zero-based in JS Date
  
      // Convert to ISO format with the time set to 00:00 UTC
      const isoString = utcDate.toISOString();
   
      // Store the date as ISO string
      onNext({ dob: isoString });
    }
   
  };

  return (
    <div className="flex flex-col items-center justify-start w-full">
      <h1 className="text-2xl md:text-3xl font-poppins font-medium text-center mb-4">
        When Did You Start Your Journey on Earth? 🌍
      </h1>
      <p className="text-grey-2 text-center mb-6">
        Enter your birthday, and we&apos;ll keep the confetti ready!
      </p>
      <Image
        src="https://res.cloudinary.com/drlyyxqh9/image/upload/v1725454912/authentication/birthday-3d-1_rewxti.webp"
        alt="name"
        width={140}
        priority
        height={200}
        className="mx-auto mb-4"
      />
      <div className="w-full max-w-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
               <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <DatePicker
                        label="Birth Date"
                        calendarWidth={256}
                        aria-label="dob"
                        minValue={minDate}
                        maxValue={maxDate}
                        value={field.value || undefined}
                        onChange={(date) => {
                          field.onChange(date);
                          handleDateChange(date);
                        }}
                        showMonthAndYearPickers
                        calendarProps={{
                          calendarWidth : 256,
                          classNames : {
                            gridWrapper : "w-full",
                            content: 'w-[256px]'
                          }
                        }}
                        classNames={
                          {
                            calendarContent : 'w-[256px]'
                          }
                        }
                        className="border-none m-0 min-w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            {feedbackMessage && (
              <p className="font-medium text-text mt-4 text-left">
                {feedbackMessage}
              </p>
            )}
             <div className="flex justify-between items-center gap-4">
             <BackButton handleBack={handleBack}/>
            <Button
              type="submit"
              color="primary"
              endContent={<FaChevronRight />}
              className="w-full font-semibold text-lg py-6 md:text-xl text-white"
            >
              Save My Birthdate
            </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Slide3;