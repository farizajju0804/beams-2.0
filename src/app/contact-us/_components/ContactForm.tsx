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
      const savedResponse = await saveContactFormResponse(data);
      console.log('Form Submitted:', savedResponse);
      toast.success('Message sent successfully!');
    } catch (error) {
      toast.error('Failed to send message. Please try again later.');
    }
  };

  const inputClasses = "border-gray-200 focus:border-purple shadow-none";
  const labelClasses = "text-sm black-text font-medium";

  return (
    <>
      <Toaster position="top-center" />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='flex-1 bg-white p-8 lg:px-12 lg:py-8 rounded-lg md:shadow-lg'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-10 mb-6'>
            <FormField
              control={control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      label="First Name"
                      classNames={{
                        inputWrapper: inputClasses,
                        label: labelClasses
                      }}
                      variant="underlined"
                      className="border-gray-200 focus:border-purple shadow-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      key={field.value}
                      label="Last Name"
                      variant="underlined"
                      classNames={{
                        inputWrapper: inputClasses,
                        label: labelClasses
                      }}
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
              label: labelClasses
            }}
            type="text"
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
          <div className='mb-6 hidden '>
            <p className="mb-2 black-text font-medium text-xs">Select Subject</p>
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
                      <Tab key="General Inquiry" title="General Inquiry" />
                      <Tab key="Technical Support" title="Technical Support" />
                      <Tab key="Account" title="Account" />
                      <Tab key="Feedback and Suggestions" title="Feedback and Suggestions" />
                    </Tabs>
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
                      labelPlacement='outside'
                      variant='underlined'
                      classNames={{
                        trigger:"mt-8",
                        label: labelClasses
                      }}
                      
                      selectedKeys={field.value ? [field.value] : []}
                      onSelectionChange={(keys) => field.onChange(Array.from(keys)[0])}
                      className="w-full space-y-0"
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
                      variant="underlined"
                    //   placeholder="Write your message..."
                      classNames={{
                        inputWrapper: inputClasses,
                        label: labelClasses
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
            className='w-full md:w-fit text-white font-medium mt-4 text-lg'
          >
            Send Message
          </Button>
        </form>
      </Form>
    </>
  );
};

export default ContactForm;