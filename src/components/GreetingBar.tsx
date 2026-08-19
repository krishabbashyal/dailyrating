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
    <div className="text-left">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-primary/60">Daily rating</p>
      <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">{randomGreeting}</h1>
      <div className="mt-1">
        <p className="font-medium text-slate-500">Here’s how you’ve been feeling lately.</p>
      </div>
    </div>
  );
};

export default GreetingBar;
