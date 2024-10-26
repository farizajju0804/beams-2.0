import { Button } from '@nextui-org/react';
import React, { useState } from 'react';
import { FaChevronRight } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form,  FormField, FormMessage } from "@/components/ui/form";

// Define the schema using Zod
const UserTypeSchema = z.object({
  userType: z.enum(['STUDENT', 'NON_STUDENT'], { errorMap: () => ({ message: 'Please choose a path.' }) }),
});

type UserTypeData = z.infer<typeof UserTypeSchema>;

interface MainSlideProps {
  onNext: (data: UserTypeData) => void;
}

const MainSlide: React.FC<MainSlideProps> = ({ onNext }) => {
  const [selectedType, setSelectedType] = useState<'STUDENT' | 'NON_STUDENT'>('NON_STUDENT'); // Default to Professional
  const form = useForm<UserTypeData>({
    resolver: zodResolver(UserTypeSchema),
    mode: 'onSubmit',
    defaultValues: { userType: 'NON_STUDENT' }, // Default to 'NON_STUDENT'
  });

  const handleSelection = (type: 'STUDENT' | 'NON_STUDENT') => {
    setSelectedType(type);
    form.setValue('userType', type); // Update form value
  };

  const onSubmit = (data: UserTypeData) => {
    console.log("Selected Path:", data);
    onNext(data); // Pass selected data to the parent component
  };

  return (
    <div className="flex flex-col items-center justify-start w-full">
      <h1 className="text-2xl md:text-3xl font-poppins font-medium text-center mb-4">Choose Your Role?</h1>
      <div className='mb-6 text-center'>
        <span className='text-text font-semibold'>Please note: </span>
        <span className="text-grey-2">Once you choose, it can&apos;t be changed later.</span>
      </div>

      {/* Selection Cards */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-6 mb-8">
        
        <div
          onClick={() => handleSelection('NON_STUDENT')}
          className={`w-60 cursor-pointer p-4 rounded-lg ${selectedType === 'NON_STUDENT' ? 'bg-yellow text-black' : 'bg-white text-black'} shadow-md flex flex-col items-center`}
        >
          {/* <Image src="/path/to/professional-image.png" alt="Professional" width={100} height={100} /> */}
          <p className="mt-2 font-semibold">I&apos;m a Professional 💼</p>
        </div>
        <div
          onClick={() => handleSelection('STUDENT')}
          className={`w-60 cursor-pointer p-4 rounded-lg ${selectedType === 'STUDENT' ? 'bg-yellow text-black' : 'bg-white text-black'} shadow-md flex flex-col items-center`}
        >
          {/* <Image src="/path/to/student-image.png" alt="Student" width={100} height={100} /> */}
          <p className="mt-2 font-semibold">I&apos;m a Student 🎓</p>
        </div>
      </div>

      {/* Form and CTA */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-md">
          <FormField
            control={form.control}
            name="userType"
            render={() => <FormMessage />} // Show validation error
          />
          <Button
            type="submit"
            color="primary"
            aria-label='submit'
            endContent={<FaChevronRight />}
            className="w-full font-semibold text-lg py-6 md:text-xl text-white"
          >
            Yes, I&apos;m {selectedType === 'STUDENT' ? 'a Student' : 'a Professional'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default MainSlide;
