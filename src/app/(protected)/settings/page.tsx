// 'use client';
// import { settings } from "@/actions/auth/settings";
// import { Card, CardHeader, CardBody, Button } from '@nextui-org/react';
// import { useState, useTransition, useEffect } from "react";
// import { useSession } from "next-auth/react";
// import * as z from 'zod';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Form, FormField, FormControl, FormItem, FormMessage } from '@/components/ui/form';
// import { Input } from "@nextui-org/react";
// import { SettingsSchema } from "@/schema";
// import FormError from "@/components/form-error";
// import FormSuccess from "@/components/form-success";
// import { useCurrentUser } from "@/hooks/use-current-user";
// import { Switch } from "@nextui-org/switch";

// const Settings = () => {
//   const { update,data: session, status } = useSession();
//   const user = useCurrentUser();
//   const [error, setError] = useState<string | undefined>("");
//   const [success, setSuccess] = useState<string | undefined>("");
//   const [isPending, startTransition] = useTransition();

//   // State to track if user data is loaded
//   const [isUserLoaded, setIsUserLoaded] = useState(false);

//   const form = useForm<z.infer<typeof SettingsSchema>>({
//     resolver: zodResolver(SettingsSchema),
//     defaultValues: {
//       name: user?.name || '',
//       email: user?.email || '',
//       password: '',
//       newPassword: '',
//       isTwoFactorEnabled: user?.isTwoFactorEnabled || false,
//     },
//   });

//   // Update form values when user data is available
//   useEffect(() => {
//     if (user && !isUserLoaded) {
//       form.reset({
//         name: user.name || '',
//         email: user.email || '',
//         isTwoFactorEnabled: user.isTwoFactorEnabled || false,
//       });
//       setIsUserLoaded(true);
//     }
//   }, [user, form, isUserLoaded]);

//   const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
//     startTransition(() => {
//       settings(values)
//         .then((data) => {
//           if (data.error) {
//             setError(data.error);
//           }
//           if (data.success) {
//             update();
//             setSuccess(data.success);
//           }
//         })
//         .catch(() => { setError("Something went wrong") });
//     });
//   };

//   // Conditional rendering based on session status
//   if (status === "loading" || !isUserLoaded) {
//     return <div>Loading...</div>;
//   }

//   if (status === "unauthenticated") {
//     // Handle unauthenticated state
//     return <div>Please log in to view settings.</div>;
//   }

//   return (
//     <>
//       <Card className="w-[600px]">
//         <CardHeader>
//           <p className="text-2xl font-semibold text-center">Settings</p>
//         </CardHeader>
//         <CardBody>
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//               <div className="space-y-4">
//                 <FormField
//                   control={form.control}
//                   name="name"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormControl>
//                         <Input
//                           label="Name"
//                           {...field}
//                           disabled={isPending}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 {user?.isOAuth === false && (
//                   <>
//                     <FormField
//                       control={form.control}
//                       name="email"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormControl>
//                             <Input
//                               label="Email"
//                               {...field}
//                               disabled={isPending}
//                               type="email"
//                             />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                     <FormField
//                       control={form.control}
//                       name="password"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormControl>
//                             <Input
//                               label="Password"
//                               {...field}
//                               disabled={isPending}
//                               type="password"
//                             />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                     <FormField
//                       control={form.control}
//                       name="newPassword"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormControl>
//                             <Input
//                               label="New Password"
//                               {...field}
//                               disabled={isPending}
//                               type="password"
//                             />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                     <FormField
//                       control={form.control}
//                       name="isTwoFactorEnabled"
//                       render={({ field }) => (
//                         <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
//                           <FormControl>
//                             <Switch
//                               disabled={isPending}
//                               isSelected={field.value}
//                               onValueChange={field.onChange}
//                             >
//                               Enable Two Factor Authentication
//                             </Switch>
//                           </FormControl>
//                         </FormItem>
//                       )}
//                     />
//                   </>
//                 )}
//               </div>
//               <FormError message={error} />
//               <FormSuccess message={success} />
//               <Button type="submit" color="secondary" className="w-full">
//                 Save
//               </Button>
//             </form>
//           </Form>
//         </CardBody>
//       </Card>
//     </>
//   );
// };

// export default Settings;
