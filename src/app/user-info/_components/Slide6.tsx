import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Select, SelectItem } from "@nextui-org/react";
import { useState, useEffect } from "react";
import Image from 'next/image';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { FaChevronRight } from "react-icons/fa6";
import BackButton from "./BackButton";
import { getSchools } from "@/actions/auth/onboarding";
import { School } from "@prisma/client";

// Validation schema for the school selection
const SchoolSchema = z.object({
  schoolId: z.string().nonempty("School selection is required"),
});

type SchoolData = z.infer<typeof SchoolSchema>;

interface Slide6Props {
  onNext: (data: any) => void;
  formData: any;
  handleBack: () => void;
  isLoading?: boolean;
}



const feedbackMessages = [
  "Nice choice, [Name]! 🏫 Your school just gained an extra dose of awesome with you on board!",
  "Way to rep your school, [Name]! 🎓 You’re officially the coolest student at [School Name]!",
  "[School Name] is lucky to have you, [Name]! 📚 Get ready to make some serious waves!",
  "Look out, [School Name]! [Name] is here to take things to the next level! 🚀",
  "[Name], you and [School Name] are a perfect match! 🎒 Let’s get ready to make some magic happen!"
];

const Slide6: React.FC<Slide6Props> = ({ onNext, formData, handleBack, isLoading }) => {
  const [schools, setSchools] = useState<School[]>([]);
  const [ctaText, setCtaText] = useState("Finish");
  const [feedbackMessageTemplate, setFeedbackMessageTemplate] = useState<string | null>(null);

  const form = useForm<SchoolData>({
    resolver: zodResolver(SchoolSchema),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: {
      schoolId: formData.schoolId,
    },
  });

  // Fetch schools on component mount
  useEffect(() => {
    const loadSchools = async () => {
      try {
        const schoolData: School[] = await getSchools();
        setSchools(schoolData);
      } catch (error) {
        console.error("Error loading schools:", error);
      }
    };
    loadSchools();
  }, []);

  const selectedSchool = schools.find(school => school.id === form.watch("schoolId"));

  useEffect(() => {
    if (!feedbackMessageTemplate) {
      const randomMessage = feedbackMessages[Math.floor(Math.random() * feedbackMessages.length)];
      setFeedbackMessageTemplate(randomMessage);
    }
  }, [feedbackMessageTemplate]);

  const getFormattedMessage = () => {
    if (feedbackMessageTemplate && selectedSchool) {
      return feedbackMessageTemplate
        .replace("[Name]", formData.firstName)
        .replace("[School Name]", selectedSchool.name);
    }
    return "";
  };

  const onSubmit = (data: SchoolData) => {
    const selectedSchool = schools.find(school => school.id === data.schoolId);
    onNext({ 
      schoolId: data.schoolId,
      schoolName: selectedSchool?.name // Include school name for display purposes if needed
    });
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
        priority
        className="mx-auto mb-4"
      />
      <div className="w-full max-w-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="schoolId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select
                      placeholder="Select your school"
                      {...field}
                      className="w-full"
                      aria-label="School"
                      autoComplete="school"
                      onSelectionChange={(keys) => {
                        const selectedValue = Array.from(keys)[0]?.toString();
                        if (selectedValue) {
                          field.onChange(selectedValue);
                          form.setValue('schoolId', selectedValue, {
                            shouldValidate: true,
                            shouldDirty: true,
                            shouldTouch: true
                          });
                          form.clearErrors('schoolId');
                        }
                      }}
                      defaultSelectedKeys={formData.schoolId ? [formData.schoolId] : []}
                    >
                      {schools.map((school) => (
                        <SelectItem key={school.id} value={school.id}>
                          {school.name}
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
                {getFormattedMessage()}
              </p>
            )}

            <div className="flex justify-between items-center gap-4">
              <BackButton handleBack={handleBack} />
              <Button
                type="submit"
                aria-label="submit"
                color="primary"
                isLoading={isLoading}
                endContent={<FaChevronRight />}
                className="w-full font-semibold text-lg py-6 md:text-xl text-white"
              >
                {isLoading ? 'Submitting...' : ctaText}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Slide6;