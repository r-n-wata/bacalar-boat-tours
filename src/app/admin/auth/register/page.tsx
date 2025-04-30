import Label from "@/components/atoms/label";
import Input from "@/components/atoms/inputs";

function Register() {
  return (
    <form className="max-w-md mx-auto">
      <div className="relative z-0 w-full mb-5 group">
        <Input type="email" id="floating_email" required placeholder=" " />

        <Label name="Email address" forInput="floating_email" />
      </div>
      <div className="relative z-0 w-full mb-5 group">
        <Input
          type="password"
          id="floating_password"
          required
          placeholder=" "
        />
        <Label name="Password" forInput="floating_password" />
      </div>
      <div className="relative z-0 w-full mb-5 group">
        <Input
          type="password"
          id="floating_repeat_password"
          required
          placeholder=" "
        />
        <Label name="Repeat Password" forInput="floating_repeat_password" />
      </div>
      <div className="grid md:grid-cols-2 md:gap-6">
        <div className="relative z-0 w-full mb-5 group">
          <Input
            type="text"
            id="floating_first_name"
            required
            placeholder=" "
          />
          <Label name="First name" forInput="floating_first_name" />
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <Input type="text" id="floating_last_name" required placeholder=" " />
          <Label name="Last name" forInput="floating_last_name" />
        </div>
      </div>
      <div className="grid md:grid-cols-2 md:gap-6">
        <div className="relative z-0 w-full mb-5 group">
          <Input type="text" id="floating_phone" required placeholder=" " />
          <Label name="Phone number" forInput="floating_phone" />
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <Input type="text" id="floating_company" required placeholder=" " />
          <Label name="Company" forInput="floating_company" />
        </div>
      </div>
      <button
        type="submit"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Submit
      </button>
    </form>
  );
}

export default Register;
