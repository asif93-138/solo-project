import { Link, useNavigate } from "react-router";
import { UserContext } from "../contexts/UserContext";
import { useContext, useState } from "react";
import { userLogin } from "../services/userServices";

const Login = () => {
    const [showAlert, setShowAlert] = useState(false);
    const [showAlert_2, setShowAlert_2] = useState(false);
    const [showAlert_3, setShowAlert_3] = useState(false);
  const context = useContext(UserContext);
  const navigate = useNavigate();
  async function handleSubmit(event: {
    target: any; preventDefault: any;
  }) {
    event.preventDefault();
    const formName = event.target;
      const response = await userLogin({ email: formName.email.value, password: formName.pass.value });
      if (response.error) {
        setShowAlert_3(false);
        setShowAlert_2(true); formName.email.value = ''; formName.pass.value = '';
      }
      else if (response.password == formName.pass.value) {
        setShowAlert_3(false);
        setShowAlert_2(false);
        formName.email.value = '';
        formName.pass.value = '';
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          localStorage.clear();
          localStorage.setItem('user_id', response.user_id);
          localStorage.setItem('name', response.name);
          localStorage.setItem('email', response.email);
          context?.setUser({ user_id: response.user_id, name: response.name, email: response.email });
          navigate('/');
        }, 1000);
      } else {
        setShowAlert_2(false);
        setShowAlert_3(true);
      }
  }
  return (
    <div className="p-8">
      <form className="border-2 p-6 rounded-lg w-2/5 mx-auto mt-4" onSubmit={handleSubmit}>
        <p className="text-2xl mb-4 font-medium text-center">Log In</p>
        <label htmlFor="email" className="font-medium">Email</label><br />
        <input type="email" id="email" name="email" className="border border-gray-400 rounded text-sm p-1 w-full" required /><br />
        <label htmlFor="pass" className="font-medium">Password</label><br />
        <input type="password" id="pass" name="pass" className="border border-gray-400 rounded text-sm p-1 w-full" required /><br />
        <p className={showAlert_3? "text-center mt-2 text-red-500" : "text-center mt-2 text-red-500 hidden"}><b>Email or Password didn't match!</b></p>
        <p className={showAlert_2? "text-center mt-2 text-red-500" : "text-center mt-2 text-red-500 hidden"}><b>User isn't registered!</b></p>
        <input type="submit" className="btn btn-warning my-4 w-full" value="Login" />
        <p className="text-center mb-2 text-slate-400">New to movie review?</p>
        <hr />
        <Link to='/register'><button type="button" className="btn mt-4 w-full">Create your account</button></Link>
      </form>
      <div className="toast toast-top toast-end">
  <div className={showAlert? "alert alert-success" : "alert alert-success hidden"}>
    <span className="text-lg text-white p-1">Login successful!</span>
  </div>
</div>
    </div>
  );
};

export default Login;