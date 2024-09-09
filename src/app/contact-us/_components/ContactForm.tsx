// Import necessary dependencies and components
'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast, Toaster } from 'react-hot-toast';
import { Send2 } from 'iconsax-react'; // Icon for button
import { Input, Textarea, Button, Select, SelectItem } from '@nextui-org/react'; // UI components from NextUI
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { saveContactFormResponse } from '@/actions/others/contact';

// Define form validation schema using Zod
const formSchema = z.object({
  firstName: z.string().min(1, { message: 'First Name is required' }),
  lastName: z.string().min(1, { message: 'Last Name is required' }),
  email: z.string().min(1, { message: 'Email is required' }).email({ message: 'Invalid email address' }),
  subject: z.enum(['General Inquiry', 'Technical Support', 'Account', 'Feedback and Suggestions'], {
    required_error: 'Please select a subject',
    invalid_type_error: 'Please select a valid subject',
  }),
  message: z.string().min(1, { message: 'Message is required' }).max(500, { message: 'Message cannot exceed 500 characters' }),
}).required();

// Define subject options for the select dropdown
const subjectOptions = [
  { value: 'General Inquiry', label: 'General Inquiry' },
  { value: 'Technical Support', label: 'Technical Support' },
  { value: 'Account', label: 'Account' },
  { value: 'Feedback and Suggestions', label: 'Feedback and Suggestions' },
];

type FormData = z.infer<typeof formSchema>; // Define form data type based on schema

const ContactForm: React.FC = () => {
  // Initialize form with react-hook-form and zodResolver for validation
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onBlur',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      subject: 'General Inquiry',
      message: '',
    },
  });

  const { control, watch, reset, formState: { errors } } = form;
  const message = watch('message', ''); // Watch for changes in the message field
  const subject = watch('subject'); // Watch for changes in the subject field

  React.useEffect(() => {
    console.log('Form errors:', errors);
    console.log('Selected subject:', subject);
  }, [errors, subject]);

  // Handle form submission
  const onSubmit = async (data: FormData) => {
    try {
      console.log('Form submitted with data:', data);
      await saveContactFormResponse(data); // Save form data using server action
      toast.success('Message sent successfully!'); // Show success toast
      reset(); // Reset the form
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to send message. Please try again later.'); // Show error toast
    }
  };

  // Define input and label styles
  const inputClasses = "border-gray-200 focus:border-purple shadow-none";
  const labelClasses = "text-sm text-gray-400 group-data-[has-value=true]:text-gray-400 font-medium";

  return (
    <>
      <Toaster position="top-center" />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='flex-1 bg-background p-8 lg:px-12 lg:py-8 md:rounded-lg text-black md:shadow-lg'>
          <div className='mb-6'>
            <FormField
              control={control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      label="First Name"
                      isRequired
                      classNames={{
                        inputWrapper: inputClasses,
                        label: labelClasses,
                        input: "text-black font-medium"
                      }}
                      variant="underlined"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='mb-6'>
            <FormField
              control={control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      label="Last Name"
                      isRequired
                      classNames={{
                        inputWrapper: inputClasses,
                        label: labelClasses,
                        input: "text-black font-medium"
                      }}
                      variant="underlined"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='mb-6'>
            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      label="Email"
                      isRequired
                      classNames={{
                        inputWrapper: inputClasses,
                        label: labelClasses,
                        input: "text-black font-medium"
                      }}
                      variant="underlined"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='mb-6'>
            <FormField
              control={control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select
                      label="Select Subject"
                      isRequired
                      labelPlacement='outside'
                      variant='underlined'
                      classNames={{
                        trigger: "mt-8",
                        label: "group-data-[filled=true]:text-gray-400 text-xs",
                        value: "text-black font-medium"
                      }}
                      selectedKeys={field.value ? [field.value] : []}
                      onChange={(e) => field.onChange(e.target.value)} // Handle subject change
                      className="w-full space-y-0 text-text"
                    >
                      {subjectOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='mb-6'>
            <FormField
              control={control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      {...field}
                      label="Message"
                      isRequired
                      variant="underlined"
                      classNames={{
                        inputWrapper: inputClasses,
                        label: labelClasses,
                        input: "text-black font-medium"
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <p className="text-xs text-gray-500 text-right mt-2">{message.length}/500 characters</p>
          </div>
          <Button
            color="primary"
            variant="solid"
            type="submit"
            startContent={<Send2 />} // Add Send2 icon
            className='w-full md:w-fit text-white font-medium text-lg'
          >
            Send Message
          </Button>
        </form>
      </Form>
    </>
  );
};

export default ContactForm;
