import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Select, SelectItem } from "@nextui-org/react";
import { useState, useEffect } from "react";
import Image from 'next/image';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { FaChevronRight } from "react-icons/fa6";
import BackButton from "./BackButton";

// Validation schema for the school selection
const SchoolSchema = z.object({
  schoolName: z.string().nonempty("School selection is required"), // Validate the school selection
});

type SchoolData = z.infer<typeof SchoolSchema>;

interface Slide6Props {
  onNext: (data: any) => void;
  formData: any;
  handleBack: () => void;
}

// List of random schools in San Francisco
const schools = [
  'Lowell High School',
  'Washington High School',
  'Galileo Academy',
  'Balboa High School',
  'Mission High School'
] as const;
type School = typeof schools[number];

const feedbackMessages = [
  "Nice choice, [Name]! 🏫 Your school just gained an extra dose of awesome with you on board!",
  "Way to rep your school, [Name]! 🎓 You’re officially the coolest student at [School Name]!",
  "[School Name] is lucky to have you, [Name]! 📚 Get ready to make some serious waves!",
  "Look out, [School Name]! [Name] is here to take things to the next level! 🚀",
  "[Name], you and [School Name] are a perfect match! 🎒 Let’s get ready to make some magic happen!"
];

const Slide6: React.FC<Slide6Props> = ({ onNext, formData, handleBack }) => {
  const [ctaText, setCtaText] = useState("Finish"); // Default CTA text
  const [feedbackMessageTemplate, setFeedbackMessageTemplate] = useState<string | null>(null); // Fixed feedback message template

  const form = useForm<SchoolData>({
    resolver: zodResolver(SchoolSchema),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: {
      schoolName: formData.schoolName, // Prefill the school name if available
    },
  });

  const selectedSchool: School | undefined = form.watch("schoolName") as School;

  useEffect(() => {
    if (formData.firstName) {
      setCtaText("Finish"); // CTA is always "Finish"
    }
  }, [formData.firstName]);

  useEffect(() => {
    if (!feedbackMessageTemplate) {
      // Randomly pick a feedback message and set it only once
      const randomMessage = feedbackMessages[Math.floor(Math.random() * feedbackMessages.length)];
      setFeedbackMessageTemplate(randomMessage); // Set the feedback message only once
    }
  }, [feedbackMessageTemplate]);

  const getFormattedMessage = () => {
    if (feedbackMessageTemplate && selectedSchool) {
      return feedbackMessageTemplate
        .replace("[Name]", formData.firstName)
        .replace("[School Name]", selectedSchool);
    }
    return "";
  };

  const onSubmit = (data: { schoolName: string }) => {
    onNext({ schoolName: data.schoolName }); // Pass the selected school to the next step
  };

  return (
    <div className="flex flex-col items-center justify-start w-full">
      <h1 className="text-2xl md:text-3xl font-poppins font-medium text-center mb-4">
        Tell Us Your School&apos;s Name! 🏫
      </h1>
      <p className="text-grey-2 text-center mb-6">
        We&apos;d love to know where you&apos;re making strides in learning!
      </p>
      <Image
        src="https://res.cloudinary.com/drlyyxqh9/image/upload/v1725454916/authentication/school-3d-1_zg9pdy.webp"
        alt="school"
        width={310}
        height={200}
        className="mx-auto mb-4"
      />
      <div className="w-full max-w-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="schoolName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select
                      placeholder="Select your school"
                      {...field}
                      className="w-full"
                      aria-label="School"
                      defaultSelectedKeys={formData.schoolName ? [formData.schoolName] : []} // Set default selection
                    >
                      {schools.map((school) => (
                        <SelectItem key={school} value={school}>
                          {school}
                        </SelectItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {getFormattedMessage() && (
              <p className="font-medium text-text mt-4 text-left">
                {getFormattedMessage()} {/* Display the feedback message */}
              </p>
            )}

            <div className="flex justify-between items-center gap-4">
              <BackButton handleBack={handleBack} />
              <Button
                type="submit"
                color="primary"
                endContent={<FaChevronRight />}
                className="w-full font-semibold text-lg py-6 md:text-xl text-white"
              >
                {ctaText}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Slide6;
