import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/react";
import { useState, useEffect, useRef } from "react";
import * as z from 'zod';
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { FaChevronRight } from "react-icons/fa6";
import { Calendar } from "iconsax-react";
import Image from "next/image";
import BackButton from "./BackButton";

// Date validation schema
const DateSchema = z.object({
  dob: z.date().nullable().refine((value) => value !== null, "Date of birth is required"),
});

type DateData = z.infer<typeof DateSchema>;

interface Slide3Props {
  onNext: (data: any) => void;
  formData: any;
  handleBack: () => void;
}

const Slide3: React.FC<Slide3Props> = ({ onNext, formData, handleBack }) => {
  const [feedbackMessage, setFeedbackMessage] = useState(""); // Store feedback message
  const form = useForm<DateData>({
    resolver: zodResolver(DateSchema),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: {
      // Convert formData.dob to Date object if it's a string
      dob: formData.dob ? new Date(formData.dob) : undefined,
    },
  });
  const datePickerRef = useRef<ReactDatePicker>(null);
  const years = Array.from({ length: 100 }, (_, index) => new Date().getFullYear() - index);
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const calculateDaysUntilBirthday = (dob: Date) => {
    const now = new Date();
    const thisYear = new Date(now.getFullYear(), dob.getMonth(), dob.getDate());
    const nextYear = new Date(now.getFullYear() + 1, dob.getMonth(), dob.getDate());
    
    const birthdayThisYear = thisYear >= now ? thisYear : nextYear;
    const differenceInTime = birthdayThisYear.getTime() - now.getTime();
    const daysUntilBirthday = Math.ceil(differenceInTime / (1000 * 60 * 60 * 24));

    return daysUntilBirthday;
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      form.setValue("dob", date, { shouldValidate: true });
      const daysUntilBirthday = calculateDaysUntilBirthday(date);
      setFeedbackMessage(`${daysUntilBirthday} days until your next birthday! 🎉 We’ll make sure it’s special! 🎈✨`);
    }
  };

  const onSubmit = (data: { dob: Date }) => {
    const formattedDob = data.dob.toISOString(); // Convert to ISO string
    onNext({ dob: formattedDob });
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
                  <div className="relative">
                    <ReactDatePicker
                        selected={field.value}
                        ref={datePickerRef}
                        onChange={(date) => handleDateChange(date)}
                        renderCustomHeader={({
                        date,
                        changeYear,
                        changeMonth,
                        decreaseMonth,
                        increaseMonth,
                        prevMonthButtonDisabled,
                        nextMonthButtonDisabled,
                        }) => (
                        <div className="focus:outline-none flex w-full items-center justify-center space-x-4">
                            <button
                            type="button"
                            onClick={decreaseMonth}
                            disabled={prevMonthButtonDisabled}
                            className="focus:outline-none bg-white"
                            >
                            &#8592;
                            </button>
                            <select
                            value={date.getFullYear()}
                            onChange={({ target: { value } }) => changeYear(Number(value))}
                            className="border rounded-md p-1 bg-white focus:ring-2 focus:ring-blue-500" // Custom focus ring color
                            >
                            {years.map((year) => (
                                <option key={year} value={year}>
                                {year}
                                </option>
                            ))}
                            </select>
                            <select
                            value={months[date.getMonth()]}
                            onChange={({ target: { value } }) => changeMonth(months.indexOf(value))}
                            className="border bg-white rounded-md p-1 focus:ring-2 focus:ring-blue-500" // Custom focus ring color
                            >
                            {months.map((month) => (
                                <option key={month} value={month}>
                                {month}
                                </option>
                            ))}
                            </select>
                            <button
                            type="button"
                            onClick={increaseMonth}
                            disabled={nextMonthButtonDisabled}
                            className="focus:outline-none bg-white"
                            >
                            &#8594;
                            </button>
                        </div>
                        )}
                        dateFormat="yyyy-MM-dd"
                        placeholderText="Select your date of birth"
                        className="w-full px-4 h-12 border-b-2 border-grey-300 focus:ring-2 focus:ring-blue-500" // Custom focus ring for the input
                    />
            
                    <Calendar
                     onClick={() => datePickerRef.current?.setFocus()}
                        size="24" 
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                    />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {feedbackMessage && (
              <p className="font-medium text-text mt-4 text-left">
                {feedbackMessage} {/* Display feedback message dynamically */}
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
