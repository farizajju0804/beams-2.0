import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@nextui-org/react";
import { useState, useEffect } from "react";
import Image from 'next/image';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { FaChevronRight } from "react-icons/fa6";

const NameSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .min(2, "First name must be at least 2 characters"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .min(2, "Last name must be at least 2 characters"),
});

type NameData = z.infer<typeof NameSchema>;

interface Slide1Props {
  onNext: (data: { firstName: string, lastName: string }) => void;
  formData : any;
}

const Slide1: React.FC<Slide1Props> = ({ onNext, formData }) => {
  const [ctaText, setCtaText] = useState("Let's Do This!");
  const [feedbackMessageTemplate, setFeedbackMessageTemplate] = useState(""); // Keep the template with [Name]
   console.log(formData)
  const feedbackMessages = [
    "[Name], that's a name destined for greatness! 🌟 Let's make it legendary!",
    "Well, hello there, [Name]! 👋 Your name is as awesome as you are!",
    "Nice to meet you, [Name]! 😄 Let's get this adventure started!",
    "[Name], your name just made our day! 🎉 Now, let's make yours even better!",
    "That's a name to remember, [Name]! 📝 Ready to rock and roll?"
  ];

  const form = useForm<NameData>({
    resolver: zodResolver(NameSchema),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: {
      firstName:  formData.firstName,
      lastName:  formData.lastName
    },
  });

  const firstName = form.watch("firstName");
  const lastName = form.watch("lastName");

  useEffect(() => {
    if (firstName) {
      setCtaText(`Let's Do This, ${firstName}`);
    } else {
      setCtaText("Let's Do This!");
    }
  }, [firstName]);

  // This useEffect will only set the template once when both fields are valid and the template isn't set
  useEffect(() => {
    if (!feedbackMessageTemplate && firstName && lastName && !form.formState.errors.firstName && !form.formState.errors.lastName) {
      const randomMessage = feedbackMessages[Math.floor(Math.random() * feedbackMessages.length)];
      setFeedbackMessageTemplate(randomMessage); // Set the message template with [Name]
    }
  }, [firstName, lastName, form.formState.errors, feedbackMessageTemplate]);

  const getFeedbackMessage = () => {
    return feedbackMessageTemplate.replace(/\[Name\]/g, firstName); // Replace [Name] with the current first name
  };

  const onSubmit = (data: { firstName: string, lastName: string }) => {
    console.log("First Name:", data.firstName);
    console.log("Last Name:", data.lastName);
    onNext(data); // Call the onNext function to move to the next slide
  };

  return (
    <div className="flex flex-col items-center justify-start w-full">
      <h1 className="text-2xl md:text-3xl font-poppins font-medium text-center mb-4">
        What Should We Call the Next Big Success Story? 🌟
      </h1>
      <p className="text-grey-2 text-center mb-6">
        Tell us your name so we can start this exciting journey together!
      </p>
      <Image
        src="https://res.cloudinary.com/drlyyxqh9/image/upload/v1725454911/authentication/name-3d-1_bwmorc.webp"
        alt="name"
        width={150}
        height={200}
        className="mx-auto mb-4"
      />
      <div className="w-full max-w-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="w-full flex items-center justify-between md:flex-row flex-col gap-6 px-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        {...field}
                        label="First Name"
                        placeholder="Enter your first name"
                        isRequired
                        variant="underlined"
                        labelPlacement="outside"
                        className="w-full"
                        classNames={{
                          label: 'font-semibold text-text',
                          mainWrapper: "w-full flex-1",
                          inputWrapper : "w-full h-12",
                          input: [
                            'w-full flex-1 font-medium'
                          ]
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        {...field}
                        label="Last Name"
                        variant="underlined"
                        labelPlacement="outside"
                        placeholder="Enter your last name"
                        isRequired
                        className="w-full"
                        classNames={{
                          label: 'font-semibold text-text',
                          mainWrapper: "w-full flex-1",
                          inputWrapper : "h-12",
                          input: [
                            'w-full flex-1 font-medium'
                          ]
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {feedbackMessageTemplate && (
              <p className="font-medium text-text mt-4 text-left">
                {getFeedbackMessage()} {/* Display the feedback message with the name dynamically */}
              </p>
            )}

            <Button
              type="submit"
              color="primary"
              endContent={<FaChevronRight />}
              className="w-full font-semibold text-lg py-6 md:text-xl text-white"
            >
              {ctaText}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Slide1;
