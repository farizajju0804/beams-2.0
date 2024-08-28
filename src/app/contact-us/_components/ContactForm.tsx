'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast, Toaster } from 'react-hot-toast';
import { Send2 } from 'iconsax-react';
import { Input, Textarea, Button, Tabs, Tab, Select, SelectItem } from '@nextui-org/react';
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { saveContactFormResponse } from '@/actions/others/contact';

const formSchema = z.object({
  firstName: z.string().min(1, 'First Name is required'),
  lastName: z.string().min(1, 'Last Name is required'),
  email: z.string().email({ message: 'Invalid email!' }).min(1, { message: 'Email is required!' }),
  subject: z.enum(['General Inquiry', 'Technical Support', 'Account', 'Feedback and Suggestions']),
  message: z.string().min(1, 'Message is required').max(500, 'Message cannot exceed 500 characters'),
});

const subjectOptions = [
  { value: 'General Inquiry', label: 'General Inquiry' },
  { value: 'Technical Support', label: 'Technical Support' },
  { value: 'Account', label: 'Account' },
  { value: 'Feedback and Suggestions', label: 'Feedback and Suggestions' },
];

type FormData = z.infer<typeof formSchema>;

const ContactForm: React.FC = () => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: {
      subject: 'General Inquiry',
    },
  });

  const { control, watch } = form;

  const message = watch('message', '');

  const onSubmit = async (data: FormData) => {
    try {
      await saveContactFormResponse(data);
      toast.success('Message sent successfully!');
    } catch (error) {
      toast.error('Failed to send message. Please try again later.');
    }
  };

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
                        input : "text-black font-medium"
                      }}
                      variant="underlined"
                      className="border-gray-200 focus:border-purple shadow-none"
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
                        input : "text-black font-medium"
                      }}
                      variant="underlined"
                      className="border-gray-200 focus:border-purple shadow-none"
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
                      classNames={{
                        inputWrapper: inputClasses,
                        label: labelClasses,
                        input : "text-black font-medium"
                      }}
                      type="text"
                      isRequired
                      label="Email"
                      variant="underlined"
                      className="border-gray-200 focus:border-purple shadow-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* <div className='mb-6 hidden'>
            <p className="mb-2 text-gray-400 font-medium text-xs">Select Subject</p>
            <FormField
              control={control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Tabs
                      {...field}
                      aria-label="Subject options"
                      selectedKey={field.value}
                      onSelectionChange={field.onChange}
                      className='p-0 text-black bg-transparent'
                      color='warning'
                      classNames={{
                        tabList: "p-0 m-0",
                        tabContent: "group-data-[selected=true]:text-black"
                      }}
                    >
                      {subjectOptions.map((option) => (
                        <Tab key={option.value} title={option.label} />
                      ))}
                    </Tabs>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div> */}
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
                        trigger:"mt-8",
                        label: "group-data-[filled=true]:text-gray-400 text-xs",
                        value : "text-black font-medium"
                      }}
                      selectedKeys={field.value ? [field.value] : []}
                      onSelectionChange={(keys) => field.onChange(Array.from(keys)[0])}
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
                        input : "text-black font-medium"
                      }}
                      className="border-gray-200 focus:border-purple shadow-none"
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
            startContent={<Send2 />}
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
