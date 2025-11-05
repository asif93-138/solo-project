/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, Navigate, useNavigate } from "react-router";
import { UserContext } from "../contexts/UserContext";
import { useContext, useState } from "react";
import { userRegistration } from "../services/userServices";

const Registration = () => {
  const [showFirstToast, setShowFirstToast] = useState(false);
  const [showSecondToast, setShowSecondToast] = useState(false);
  const [showPassWarn, setShowPassWarn] = useState(false);
  const [showUniqueEmailWarn, setShowUniqueEmailWarn] = useState(false);
  const context = useContext(UserContext);
  const navigate = useNavigate();
  async function handleSubmit(event: {
    target: any; preventDefault: any;
  }) {
    event.preventDefault();
    const formName = event.target;
    if (formName.pass.value.length > 7) {
      setShowPassWarn(false);
      const response = await userRegistration({ name: formName.name.value, email: formName.email.value, password: formName.pass.value });
      if (response.user_id) {
        setShowUniqueEmailWarn(false);
        setShowSecondToast(true);
        setTimeout(() => {
          localStorage.clear();
          localStorage.setItem('user_id', response.user_id);
          localStorage.setItem('name', response.name);
          localStorage.setItem('email', response.email);
          context?.setUser({ user_id: response.user_id, name: response.name, email: response.email });
          setShowSecondToast(false);
          navigate('/');
        }, 1000)
      } else if (response.error == 'Email is already in use') {
        setShowUniqueEmailWarn(true);
      } else {
        setShowUniqueEmailWarn(false);
        setShowFirstToast(true);
        setTimeout(() => {
          setShowFirstToast(false);
        }, 2000);
      }
    } else {
      setShowPassWarn(true);
    }
  }

  if (context?.user) {
    return (<Navigate to="/" />);
  }

  return (
    <div className="p-8">
      <form className="border-2 p-6 rounded-lg md:w-2/5 mx-auto mt-4" onSubmit={handleSubmit}>
        <p className="text-2xl mb-4 font-medium">Register</p>
        <label htmlFor="name" className="font-medium">Name</label><br />
        <input type="text" id="name" name="name" className="border border-gray-400 rounded text-sm p-1 w-full mb-2" required /><br />
        <label htmlFor="email" className="font-medium">Email</label><br />
        <input type="email" id="email" name="email" className="border border-gray-400 rounded text-sm p-1 w-full mb-2" required /><br />
        {showUniqueEmailWarn && <p className="text-red-600">This email is already used!</p>}
        <label htmlFor="pass" className="font-medium">Password</label><br />
        <input type="password" id="pass" name="pass" className="border border-gray-400 rounded text-sm p-1 w-full" required /><br />
        <p id="passWarn" className={showPassWarn ? "text-red-600" : "text-red-600 hidden"}>Password must be at least 8 characters long!</p>
        <input type="submit" className="btn btn-warning my-4 w-full" value="Register" />
        <p className="text-center mb-2 text-slate-400">Already have an account?</p>
        <hr />
        <Link to='/login'><button type="button" className="btn mt-4 w-full">Login</button></Link>
      </form>
      <div className="toast toast-top toast-end">
        <div className={showSecondToast ? "alert alert-success block" : "alert alert-success hidden"}>
          <span className="text-lg text-white p-1">Registration successful!</span>
        </div>
        <div className={showFirstToast ? "alert alert-error block" : "alert alert-error hidden"}>
          <span className="text-lg text-white p-1">An error occurred!</span>
        </div>
      </div>
    </div>
  );
};

export default Registration;