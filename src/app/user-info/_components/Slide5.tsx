import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Select, SelectItem } from "@nextui-org/react";
import { useState, useEffect } from "react";
import Image from 'next/image';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { FaChevronRight } from "react-icons/fa6";
import BackButton from "./BackButton";

// Validation schema for the grade selection
const GradeSchema = z.object({
  grade: z.string().nonempty("Grade selection is required"), // Validate the grade selection
});

type GradeData = z.infer<typeof GradeSchema>;

interface Slide5Props {
  onNext: (data: any) => void;
  formData: any;
  handleBack: () => void;
}

// Define the grades and feedback messages
const grades = ['Grade 4','Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9'] as const;
type Grade = typeof grades[number];

const feedbackMessages: Record<Grade, string> = {
  'Grade 4': "[Name], you're officially a Grade 4 legend! 🎒 Ready to unlock the mysteries of the future.",
  'Grade 5': "[Name], you're officially a Grade 5 legend! 🎒 Ready to unlock the mysteries of the future.",
  'Grade 6': "Watch out, world—[Name] is in Grade 6! 📚 Time to show everyone that you're the boss of middle school madness!",
  'Grade 7': "Grade 7 just got a whole lot cooler with [Name] around! 🔥 Get ready to master the art of being awesome (and acing those tests)!",
  'Grade 8': "[Name], you've leveled up to Grade 8! 🧠 The final boss of middle school doesn’t stand a chance against you!",
  'Grade 9': "High school, beware—[Name] is here! 🏆 Grade 9 is just the beginning of your epic rise to fame and glory!"
};

const Slide5: React.FC<Slide5Props> = ({ onNext, formData, handleBack }) => {
  const [ctaText, setCtaText] = useState("Onward!"); // Default CTA text
  const [feedbackMessageTemplate, setFeedbackMessageTemplate] = useState(""); // Feedback message template

  const form = useForm<GradeData>({
    resolver: zodResolver(GradeSchema),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: {
      grade: formData.grade, // Prefill the grade if available
    },
  });

  const selectedGrade: Grade |undefined = form.watch("grade") as Grade; // Watch the selected grade and define its type

  useEffect(() => {
    if (formData.firstName) {
      setCtaText(`Onward, ${formData.firstName}`); // Dynamically set the CTA text
    }
  }, [formData.firstName]);

  useEffect(() => {
    if (selectedGrade && !feedbackMessageTemplate) {
      const feedbackMessage = feedbackMessages[selectedGrade].replace("[Name]", formData.firstName);
      setFeedbackMessageTemplate(feedbackMessage); // Set the feedback message for the selected grade
    }
  }, [selectedGrade, formData.firstName, feedbackMessageTemplate]);

  const onSubmit = (data: { grade: string }) => {
    onNext({ grade: data.grade }); // Pass the selected grade to the next step
  };

  return (
    <div className="flex flex-col items-center justify-start w-full">
      <h1 className="text-2xl md:text-3xl font-poppins font-medium text-center mb-4">
        Where Are You in Your Academic Journey? 📚
      </h1>
      <p className="text-grey-2 text-center mb-6">
        Choose your grade and let&apos;s get ready for some awesome learning!
      </p>
      <Image
        src="https://res.cloudinary.com/drlyyxqh9/image/upload/v1725454914/authentication/grade-3d-1_yriu5r.webp"
        alt="grade"
        width={240}
        height={200}
        className="mx-auto mb-4"
      />
      <div className="w-full max-w-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="grade"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select
                      placeholder="Select your grade"
                      {...field}
                      className="w-full"
                      aria-label="Grade"
                      defaultSelectedKeys={formData.grade ? [formData.grade] : []}
                    >
                      {grades.map((grade) => (
                        <SelectItem key={grade} value={grade}>
                          {grade}
                        </SelectItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {feedbackMessageTemplate && (
              <p className="font-medium text-text mt-4 text-left">
                {feedbackMessageTemplate} {/* Display the feedback message dynamically */}
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

export default Slide5;
