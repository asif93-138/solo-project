import { useContext, useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { UserContext } from "../contexts/UserContext";
import MovieForm from "../components/CreateMovie";

const Layout = () => {
    const [showNavModal, setShowNavModal] = useState(0);
    const [showFirstModal, setShowFirstModal] = useState(false);
    const context = useContext(UserContext);
    const location = useLocation();
    const navigate = useNavigate();
    function showModal() {
        setShowNavModal(1);
    }
    return (
        <>
            {
                !(location.pathname == '/login' || location.pathname == '/register')
                    ?
                    <nav className="navbar bg-slate-900 text-neutral-content md:px-8">
                        <div className="flex-1">
                            <Link to="/">      <div className="text-2xl font-bold text-primary hover:text-primary-focus transition-colors duration-300">
                                <span className="bg-yellow-500 text-black px-2 py-1 rounded">FILM</span>
                                <span className="text-white">Critic</span>
                            </div></Link>
                        </div>
                        <div className="flex-none gap-2">
                            {context?.user ?
                                <>
                                    <button onClick={showModal} type="button" className="md:flex hidden btn bg-transparent btn-nav-l text-white min-h-0 h-auto py-3 rounded-full"><i className="fa-solid fa-plus"></i> New Movie</button>
                                    {/* <Link to='/user'></Link> */}
                                    <details className="dropdown dropdown-end">
                                        <summary tabIndex={0} className="btn p-0 btn-ghost tool-tip">
                                            <img style={{ height: 'auto' }}
                                                alt="Tailwind CSS Navbar component"
                                                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                                                className="w-10 rounded-full border-2 border-yellow-500"
                                            />
                                            <small className="tooltiptext">{context.user.name}<br />{context.user.email}</small>
                                        </summary>
                                        <ul tabIndex={0} style={{ right: '-10px' }} className="menu mt-1 dropdown-content bg-base-100 rounded-box z-[1] w-32 shadow">
                                            {location.pathname != '/' && <li className="text-black"><Link className="mb-1" to='/' onClick={() => document.getElementsByTagName("details")[0].removeAttribute("open")}>Home</Link></li>}
                                            {location.pathname != '/user' && <li className="text-black"><Link className="mb-1" to='/user' onClick={() => document.getElementsByTagName("details")[0].removeAttribute("open")}>My List</Link></li>}
                                            <li><button onClick={() => {document.getElementsByTagName("details")[0].removeAttribute("open"); showModal();}} type="button" className="md:hidden flex flex-nowrap p-0 my-2 mb-3 btn bg-transparent btn-nav-l min-h-0 h-auto border-0 rounded-full"><i className="fa-solid fa-plus"></i><span className="font-normal">New Movie</span></button></li>
                                            <li className="text-black"><button type="button" className="" onClick={() => {
                                                context?.setUser(null);
                                                localStorage.clear();
                                                if (location.pathname != '/') {
                                                    navigate('/');
                                                }
                                            }}><i className="fa-solid fa-right-from-bracket"></i> Logout</button></li>
                                        </ul>

                                    </details>

                                    {/* <button className="btn bg-transparent btn-nav-l text-white min-h-0 h-auto py-3 rounded-full"><i className="fa-solid fa-right-from-bracket"></i> Logout</button>   style={{left: '-' + tooltipLeft + '%'}} */}
                                </>
                                :
                                <Link to="/login"><button className="btn bg-transparent btn-nav-l text-white min-h-0 h-auto py-3 rounded-full"><i className="fa-solid fa-right-to-bracket"></i> Login</button></Link>
                            }
                        </div>
                    </nav>
                    :
                    <nav className="mt-16">
                        <Link to="/" className="text-center"><div className="text-2xl font-bold text-primary hover:text-primary-focus transition-colors duration-300">
                            <span className="bg-yellow-500 text-white px-2 py-1 rounded">FILM</span>
                            <span className="text-black">Critic</span>
                        </div></Link>
                    </nav>
            }
            <dialog id="my_modal_nav" className={(showNavModal === 1) ? "modal text-black modal-open" : "modal text-black"}>
                <div className="modal-box max-w-full md:w-1/2">
                    {context && <MovieForm setHomeRefresh={context.setHomeRefresh} setListRefresh={context.setListRefresh} setShowFirstModal={setShowFirstModal} setShowNavModal={setShowNavModal} />}
                </div>
            </dialog>
            <div className={showFirstModal ? "toast toast-top toast-center" : "toast toast-top toast-center hidden"}>
                <div className="alert alert-warning block">
                    <span>Successfully inserted a new movie!</span>
                </div>
            </div>
            <Outlet />
        </>
    )
};

export default Layout;