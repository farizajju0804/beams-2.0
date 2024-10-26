import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/react";
import { useState, useEffect } from "react";
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { FaChevronRight } from "react-icons/fa6";
import BackButton from "./BackButton";

// Custom error messages
const customErrorMap = {
  required: 'Select at least 3 topics',
  invalidType: 'Invalid topic selection',
};

// Schema for validation
const TopicsSchema = z.object({
  topics: z
    .array(z.string(), {
      required_error: customErrorMap.required,
      invalid_type_error: customErrorMap.invalidType,
    })
    .min(3, customErrorMap.required), // Ensure at least 3 topics are selected
});

type TopicsData = z.infer<typeof TopicsSchema>;

interface Slide4Props {
  onNext: (data: any) => void;
  formData: any; // First name, userType, etc. from previous form data
  handleBack: () => void;
  isLoading?: boolean;
}

// TopicOption component for reusable topic options
interface TopicOptionProps {
  topicName: string;
  isSelected: boolean;
  emoji: string;
  title: string;
  handleSelect: (name: string) => void;
}

// TopicOption component (for each topic)
const TopicOption = ({
  topicName,
  isSelected,
  emoji,
  title,
  handleSelect,
}: TopicOptionProps) => {
  const borderColor = isSelected ? "2px solid #F96f2e" : ""; // Yellow border for selected option

  return (
    <div
      onClick={() => handleSelect(topicName)}
      className={`cursor-pointer flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 bg-background transition-all`}
      style={{ border: borderColor }}
    >
      <span className="text-4xl">{emoji}</span> {/* Use Emoji instead of image */}
      <p className="font-semibold text-lg">{title}</p>
    </div>
  );
};

const Slide4: React.FC<Slide4Props> = ({ onNext, formData, handleBack,isLoading }) => {
  const [ctaText, setCtaText] = useState(formData.userType === 'STUDENT' ? "Proceed" : "Finish");
  const [feedbackMessageTemplate, setFeedbackMessageTemplate] = useState<string>(''); // To store feedback template
  const [selectedTopics, setSelectedTopics] = useState<string[]>(formData.topics || []); // Selected topics
  
  const form = useForm<TopicsData>({
    resolver: zodResolver(TopicsSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      topics: formData.topics || [], 
    },
  });

  const topics = [
    { title: 'Art', name: 'ART', emoji: '🎨' },
    { title: 'Maths', name: 'MATHS', emoji: '📐' },
    { title: 'Science', name: 'SCIENCE', emoji: '🔬' },
    { title: 'Music', name: 'MUSIC', emoji: '🎵' },
    { title: 'Computer Science', name: 'COMPUTER_SCIENCE', emoji: '💻' },
    { title: 'Physical Education', name: 'PHYSICAL_EDUCATION', emoji: '🏃' },
    { title: 'Geography', name: 'GEOGRAPHY', emoji: '🌍' },
    { title: 'Others', name: 'OTHERS', emoji: '💡' }
  ];

  const feedbackMessages = [
    "Fantastic picks, [Name]! 🎨 Your journey just got a whole lot more interesting!",
    "Great choices, [Name]! 🌟 We're curating something special just for you!",
    "[Name], you've got style! 😎 Get ready for some personalized content!",
    "You're all set, [Name]! 🚀 We're tailoring your experience based on your awesome picks!",
    "Excellent selection, [Name]! 🎉 We're building a journey around your interests!"
  ];

  useEffect(() => {
    if (formData.firstName && selectedTopics.length >= 3 && !feedbackMessageTemplate) {
      const randomMessage = feedbackMessages[Math.floor(Math.random() * feedbackMessages.length)];
      setFeedbackMessageTemplate(randomMessage); // Set feedback message with [Name]
    }
  }, [selectedTopics, formData.firstName, feedbackMessageTemplate]);

  const getFeedbackMessage = () => {
    return feedbackMessageTemplate.replace(/\[Name\]/g, formData.firstName); // Replace [Name] with the first name
  };

  const handleTopicSelect = (topicName: string) => {
    const updatedTopics = selectedTopics.includes(topicName)
      ? selectedTopics.filter((name) => name !== topicName)  // Remove if already selected
      : [...selectedTopics, topicName]; // Add to the selected topics

    setSelectedTopics(updatedTopics);
    form.setValue('topics', updatedTopics, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true
    });

    if (updatedTopics.length >= 3) {
      form.clearErrors('topics');
    }
  };

  const onSubmit = (data: TopicsData) => {
    onNext({ topics: selectedTopics });
  };

  return (
    <div className="flex flex-col items-center justify-start w-full">
      <h1 className="text-2xl md:text-3xl font-poppins font-medium text-center mb-4">
        What Are You Passionate About? 💡
      </h1>
      <p className="text-grey-2 text-center mb-6">
        Pick at least three topics that light you up—we&apos;ll take care of the rest!
      </p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center max-w-lg w-full mb-6">
        {topics.map((topicOption) => (
          <TopicOption
            key={topicOption.name}
            topicName={topicOption.name}
            isSelected={selectedTopics.includes(topicOption.name)}
            emoji={topicOption.emoji}
            title={topicOption.title}
            handleSelect={handleTopicSelect} // Call the topic select handler
          />
        ))}
      </div>

      <div className="w-full max-w-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="topics"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    {/* Hidden input to store the selected topics */}
                    <input
                      {...field}
                      aria-label="topics"
                      autoComplete="topics"
                      type="hidden"
                      value={selectedTopics.join(',')} // Join selected topics as a string
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Feedback message after 3 topics are selected */}
            {feedbackMessageTemplate && selectedTopics.length >= 3 && (
              <p className="font-medium text-text mt-4 text-left">
                {getFeedbackMessage()}
              </p>
            )}

            <div className="flex justify-between items-center gap-4">
              <BackButton handleBack={handleBack} />
              <Button
                type="submit"
                color="primary"
                aria-label="submit"
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

export default Slide4;