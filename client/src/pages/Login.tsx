import { Link, useNavigate } from "react-router";
import { UserContext } from "../contextAPI/UserContext";
import { useContext } from "react";


const Login = () => {
  const context = useContext(UserContext);
  const navigate = useNavigate();
  // console.log(context?.user);
  function handleSubmit(event: {
    target: any; preventDefault: any;
  }) {
    event.preventDefault();
    const formName = event.target;
    // console.log(formName.email.value, formName.pass.value); formName.email.value
    fetch('http://localhost:3000/api/user/', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({ email: formName.email.value, password: formName.pass.value })
    })
      .then(res => res.json())
      .then(data => {
        if (data.password == formName.pass.value) {
          formName.email.value = '';
          formName.pass.value = '';
          document.getElementById('my_modal_2')?.classList.add('modal-open');
          setTimeout(() => {
            document.getElementById('my_modal_2')?.classList.remove('modal-open');
            localStorage.clear();
            localStorage.setItem('user_id', data.user_id);
            localStorage.setItem('name', data.name);
            localStorage.setItem('email', data.email);
            context?.setUser({ user_id: data.user_id, name: data.name, email: data.email });
            navigate('/');
          }, 1000);
        } else {
          document.getElementById('my_modal_1')?.classList.add('modal-open');
        }
      })
  }
  function closeModal() {
    document.getElementById('my_modal_1')?.classList.remove('modal-open');
  }
  return (
    <div className="p-8">
      <form className="border-2 p-6 rounded-lg w-2/5 mx-auto mt-4" onSubmit={handleSubmit}>
        <p className="text-2xl mb-4 font-medium text-center">Log In</p>
        <label htmlFor="email" className="font-medium">Email</label><br />
        <input type="email" id="email" name="email" className="border border-gray-400 rounded text-sm p-1 w-full" required /><br />
        <label htmlFor="pass" className="font-medium">Password</label><br />
        <input type="password" id="pass" name="pass" className="border border-gray-400 rounded text-sm p-1 w-full" required /><br />
        <input type="submit" className="btn btn-warning my-4 w-full" value="Login" />
        <p className="text-center mb-2 text-slate-400">New to movie review?</p>
        <hr />
        <Link to='/register'><button type="button" className="btn mt-4 w-full">Create your account</button></Link>
      </form>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <p className="py-4 text-red-500 font-medium text-center">Email or Password didn't match!</p>
          <div className="">
            <form method="dialog" className="text-center">
              <button className="btn" onClick={closeModal}>Close</button>
            </form>
          </div>
        </div>
      </dialog>
      <dialog id="my_modal_2" className="modal">
        <div className="modal-box">
          <p className="py-4 font-medium text-center">Login successful!</p>

        </div>
      </dialog>
    </div>
  );
};

export default Login;