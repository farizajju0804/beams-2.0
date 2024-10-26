import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Select, SelectItem } from "@nextui-org/react";
import { useState, useEffect } from "react";
import Image from 'next/image';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { FaChevronRight } from "react-icons/fa6";
import BackButton from "./BackButton";

const GradeSchema = z.object({
  grade: z.string().nonempty("Grade selection is required"),
});

type GradeData = z.infer<typeof GradeSchema>;

interface Slide5Props {
  onNext: (data: any) => void;
  formData: any;
  handleBack: () => void;
}

const grades = ['Grade 4','Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9'] as const;
type Grade = typeof grades[number];

const feedbackMessages: Record<Grade, string> = {
  'Grade 4': "[Name], you're officially a Grade 4 legend! 🎒 Ready to unlock the mysteries of the future.",
  'Grade 5': "[Name], you're officially a Grade 5 legend! 🎒 Ready to unlock the mysteries of the future.",
  'Grade 6': "Watch out, world—[Name] is in Grade 6! 📚 Time to show everyone that you're the boss of middle school madness!",
  'Grade 7': "Grade 7 just got a whole lot cooler with [Name] around! 🔥 Get ready to master the art of being awesome (and acing those tests)!",
  'Grade 8': "[Name], you've leveled up to Grade 8! 🧠 The final boss of middle school doesn't stand a chance against you!",
  'Grade 9': "High school, beware—[Name] is here! 🏆 Grade 9 is just the beginning of your epic rise to fame and glory!"
};

const Slide5: React.FC<Slide5Props> = ({ onNext, formData, handleBack }) => {
  const [ctaText, setCtaText] = useState("Onward!");
  const [feedbackMessageTemplate, setFeedbackMessageTemplate] = useState("");

  const form = useForm<GradeData>({
    resolver: zodResolver(GradeSchema),
    mode: 'onChange',
    defaultValues: {
      grade: formData.grade,
    },
  });

  const selectedGrade = form.watch("grade");

  useEffect(() => {
    if (formData.firstName) {
      setCtaText(`Onward, ${formData.firstName}`);
    }
  }, [formData.firstName]);

  useEffect(() => {
    if (selectedGrade && selectedGrade in feedbackMessages) {
      // Type assertion after verification
      const grade = selectedGrade as Grade;
      const feedbackMessage = feedbackMessages[grade].replace("[Name]", formData.firstName || "");
      setFeedbackMessageTemplate(feedbackMessage);
      form.clearErrors("grade");
    } else {
      setFeedbackMessageTemplate("");
    }
  }, [selectedGrade, formData.firstName, form]);

  const onSubmit = (data: { grade: string }) => {
    onNext({ grade: data.grade });
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
        priority
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
                      className="w-full"
                      aria-label="Grade"
                      autoComplete="grade"
                      defaultSelectedKeys={formData.grade ? [formData.grade] : []}
                      onSelectionChange={(keys) => {
                        const selectedValue = Array.from(keys)[0]?.toString();
                        if (selectedValue) {
                          field.onChange(selectedValue);
                          form.clearErrors("grade");
                        }
                      }}
                      selectedKeys={field.value ? [field.value] : []}
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
                {feedbackMessageTemplate}
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