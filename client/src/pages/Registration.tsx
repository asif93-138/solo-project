import { Link, useNavigate } from "react-router";
import { UserContext } from "../contexts/UserContext";
import { useContext } from "react";
import { userRegistration } from "../services/userServices";

const Registration = () => {
  const context = useContext(UserContext);
  const navigate = useNavigate();
  async function handleSubmit(event: {
    target: any; preventDefault: any;
  }) {
    event.preventDefault();
    const formName = event.target;
    if (formName.pass.value.length > 7) {
      document.getElementById('passWarn')?.classList.add('hidden');
        const response = await userRegistration({ name: formName.name.value, email: formName.email.value, password: formName.pass.value });
        if (response.user_id) {
          document.getElementById('my_modal_2')?.classList.add('modal-open');
          setTimeout(() => {
            localStorage.clear();
            localStorage.setItem('user_id', response.user_id);
            localStorage.setItem('name', response.name);
            localStorage.setItem('email', response.email);
            context?.setUser({ user_id: response.user_id, name: response.name, email: response.email });
            document.getElementById('my_modal_2')?.classList.remove('modal-open');
            navigate('/');
          }, 1000)
        } else {
          document.getElementById('my_modal_1')?.classList.add('modal-open');
        }
      } else {
      document.getElementById('passWarn')?.classList.remove('hidden');
    }
  }
  function closeModal() {
    document.getElementById('my_modal_1')?.classList.remove('modal-open');
  }
  return (
    <div className="p-8">
      <form className="border-2 p-6 rounded-lg w-2/5 mx-auto mt-4" onSubmit={handleSubmit}>
        <p className="text-2xl mb-4 font-medium">Register</p>
        <label htmlFor="name" className="font-medium">Name</label><br />
        <input type="text" id="name" name="name" className="border border-gray-400 rounded text-sm p-1 w-full" required /><br />
        <label htmlFor="email" className="font-medium">Email</label><br />
        <input type="email" id="email" name="email" className="border border-gray-400 rounded text-sm p-1 w-full" required /><br />
        <label htmlFor="pass" className="font-medium">Password</label><br />
        <input type="password" id="pass" name="pass" className="border border-gray-400 rounded text-sm p-1 w-full" required /><br />
        <p id="passWarn" className="text-red-600 hidden">Password must be at least 8 characters long!</p>
        <input type="submit" className="btn btn-warning my-4 w-full" value="Register" />
        <p className="text-center mb-2 text-slate-400">Already have an account?</p>
        <hr />
        <Link to='/login'><button type="button" className="btn mt-4 w-full">Login</button></Link>
      </form>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <p className="py-4 text-red-500 font-medium text-center">An error occurred!</p>
          <div className="">
            <form method="dialog" className="text-center">
              <button className="btn" onClick={closeModal}>Close</button>
            </form>
          </div>
        </div>
      </dialog>
      <dialog id="my_modal_2" className="modal">
        <div className="modal-box">
          <p className="py-4 font-medium text-center">Registration successful!</p>

        </div>
      </dialog>
    </div>
  );
};

export default Registration;