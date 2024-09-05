import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/react";
import { useState, useEffect } from "react";
import Image from 'next/image';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { FaChevronRight } from "react-icons/fa6";
import BackButton from "./BackButton";


const customErrorMap = {
  required: 'Gender is required.',
  invalidType: 'Gender is required',
  tooManyTopics: 'You can select up to 10 topics only.',
  tooLong: 'The input is too long.',
};
// Define the schema for form validation
const GenderSchema = z.object({
  gender: z
    .string({
      errorMap: (issue, { defaultError }) => ({
        message: issue.code === 'invalid_type' ? customErrorMap.invalidType : defaultError,
      }),
    })
    .min(1, { message: customErrorMap.required }) // Ensures non-empty string for gender
    .max(255, { message: customErrorMap.tooLong }) // Optional: Limits gender string length
});

type GenderData = z.infer<typeof GenderSchema>;

interface Slide2Props {
  onNext: (data: any ) => void;
  formData: any ; // First name from previous form data
  handleBack : () => void;
}

// GenderOption component for reusable gender options
interface GenderOptionProps {
  genderName: string;
  isSelected: boolean;
  imageUrl: string;
  title: string;
  handleChange: (name: string, value: string) => void;
}

// GenderOption component
const GenderOption = ({
  genderName,
  isSelected,
  imageUrl,
  title,
  handleChange,
}: GenderOptionProps) => {
  const borderColor = isSelected ? "2px solid #F96f2e" : ""; // Yellow border for selected option

  return (
    <div 
      onClick={() => handleChange("gender", genderName)} 
      className={`cursor-pointer flex flex-col items-center justify-center gap-2`}
    >
      <Image
        style={{ border: borderColor }}
        className="rounded-full border-2" // Rounded full image
        src={imageUrl}
        alt={genderName}
        height={100}
        width={100}
      />
      <p className="font-semibold text-lg">{title}</p>
    </div>
  );
};

// Main Component
const Slide2: React.FC<Slide2Props> = ({ onNext, formData, handleBack }) => {
  const [ctaText, setCtaText] = useState("Keep Going!");
  const [feedbackMessageTemplate, setFeedbackMessageTemplate] = useState<string>(''); // To store feedback template
  const [selectedGender, setSelectedGender] = useState<string>(formData.gender || ''); // No gender is selected by default
  
  const form = useForm<GenderData>({
    resolver: zodResolver(GenderSchema),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: {
      gender: formData.gender,
    },
  });

  const genders = [
    { title: 'Male', name: 'MALE', image: '/images/male.png' },
    { title: 'Female', name: 'FEMALE', image: '/images/female.png' },
    { title: 'Transgender', name: 'TRANSGENDER', image: '/images/transgender.png' },
    { title: 'Bisexual', name: 'BISEXUAL', image: '/images/bisexual.png' },
    { title: 'Prefer Not to Say', name: 'PREFER_NOT_TO_SAY', image: '/images/prefernotosay.png' },
  ];

  const feedbackMessages = [
    "Great choice, [Name]! 🌟 Let’s keep going!",
    "[Name], you’re making awesome progress! 🚀",
    "You’ve got this, [Name]! 😄 Keep it up!",
    "[Name], you’re on a roll! 🎉 Let’s continue!",
    "Fantastic, [Name]! Let’s finish strong! 💪"
  ];

  useEffect(() => {
    if (formData.firstName) {
      const truncatedFirstName = formData.firstName.length > 10 ? formData.firstName.slice(0, 10) : formData.firstName;
      setCtaText(`Keep Going, ${formData.firstName}`);
     
    }
  }, [formData.firstName]);

  // Select random feedback message only after the gender is selected
  useEffect(() => {
    if (selectedGender && !feedbackMessageTemplate) {
      const randomMessage = feedbackMessages[Math.floor(Math.random() * feedbackMessages.length)];
      setFeedbackMessageTemplate(randomMessage); // Set the message template with [Name]
    }
  }, [selectedGender]);

  const getFeedbackMessage = () => {
    return feedbackMessageTemplate.replace(/\[Name\]/g, formData.firstName); // Replace [Name] with the first name
  };

  const handleGenderSelect = (genderName: string) => {
    setSelectedGender(genderName);
    form.setValue('gender', genderName, { shouldValidate: true })
  };

  const onSubmit = (data: GenderData) => {
    console.log("Selected Gender:", data.gender);
    onNext({ gender: data.gender });
  };

  return (
    <div className="flex flex-col items-center justify-start w-full">
      <h1 className="text-2xl md:text-3xl font-poppins font-medium text-center mb-4">
        How Do You Identify? 🌟
      </h1>
      <p className="text-grey-2 text-center mb-6">
        Pick the option that best represents you. We&apos;re all about inclusivity here.
      </p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center max-w-md w-full mb-6">
        {genders.map((genderOption) => (
          <GenderOption
            key={genderOption.name}
            genderName={genderOption.name}
            isSelected={selectedGender === genderOption.name}
            imageUrl={genderOption.image}
            title={genderOption.title}
            handleChange={(_, value) => handleGenderSelect(value)} // Call the gender select handler
          />
        ))}
      </div>

      <div className="w-full max-w-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    {/* Hidden input to store the selected gender */}
                    <input
                      required
                      {...field}
                      type="hidden"
                      value={selectedGender}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Feedback message when gender is selected */}
            {feedbackMessageTemplate && (
              <p className="font-medium text-text mt-4 text-left">
                {getFeedbackMessage()}
              </p>
            )}
            <div className="flex justify-between items-center gap-4">
            <BackButton handleBack={handleBack}/>
            <Button
              type="submit"
              color="primary"
              endContent={<FaChevronRight />}
              className="w-full font-semibold text-lg py-6 md:text-xl text-white"
              // disabled={!selectedGender} // Disable until a gender is selected
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

export default Slide2;
