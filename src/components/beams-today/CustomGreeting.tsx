import { currentUser } from "@/libs/auth";

const messages = [
  "Have a great day, {name}!",
  "Wishing you a productive day, {name}!",
  "Good morning, {name}! Let's make today amazing.",
  "Hello, {name}! Ready to tackle the day?",
  "Hi, {name}! Hope you have a fantastic day ahead.",
  "Hey there, {name}! Keep shining today.",
  "What's up, {name}? Let's make the most of today.",
  "Greetings, {name}! Let's achieve great things today.",
  "Good day, {name}! Keep pushing forward.",
  "Hello, {name}! Make today your masterpiece."
];

export const CustomGreeting = async () => {
  const user:any = await currentUser();
  
  if (user) {
    const date = new Date();
    const messageIndex = date.getDate() % messages.length;
    const selectedMessage = messages[messageIndex].replace('{name}', user.name);
    return selectedMessage;
  }

  return "Hello, guest! Have a great day!";
};
