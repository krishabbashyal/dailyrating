const GreetingBar = () => {

const greetings = [
  "Hello There!",
  "Hi There!",
  "Hey There!",
  "Good To See You!",
  "Welcome Back!",
  "Hey, Welcome!",
  "How’s It Going?",
  "Hope You’re Doing Well!",
  "Nice to See You!",
  "Hey You!",
  "What’s Up?",
  "How Are You?",
  "Glad You’re Here!",
  "Good to Have You Here!",
  "Hey, How’s Your Day!",
  "Welcome!",
  "Hey, What’s Going On!",
  "Great to See You!",
  "Hey There, My Wuzza!",
  "Ready to Check In?",
  "How’s Everything?",
  "Buzz!!",
  "My Wuzza!",
  "Hope You’re Doing Great!"
];

  const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];

  return (
    <div className="text-left mt-6 ">
      <h1 className="text-3xl font-black text-brand-primary">{randomGreeting}</h1>
      <div className="text-left  mt-0.5 mb-4">
        <p className="text font-medium text-gray-500">How has today been?</p>
      </div>
    </div>
  );
};

export default GreetingBar;
