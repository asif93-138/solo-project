import { useContext, useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { UserContext } from "../context/UserContext";
import MovieForm from "../components/CreateMovie";

const Layout = () => {
    const context = useContext(UserContext);
    const location = useLocation();
    const navigate = useNavigate();
    const [tooltipLeft, setTooltipLeft] = useState(90);
    function showModal() {
        document.getElementById('my_modal_nav')?.classList.add('modal-open');
    }
    return (
        <>
            {
                !(location.pathname == '/login' || location.pathname == '/register')
                    ?
                    <nav className="navbar bg-slate-900 bg-neutral text-neutral-content px-8">
                        <div className="flex-1">
                            <Link to="/" className="m-2">      <div className="text-2xl font-bold text-primary hover:text-primary-focus transition-colors duration-300">
                                <span className="bg-yellow-500 text-black px-2 py-1 rounded">FILM</span>
                                <span className="text-white">Critic</span>
                            </div></Link>
                        </div>
                        <div className="flex-none gap-2">
                            {context?.user ?
                                <>
                                    <button onClick={showModal} type="button" className="btn bg-transparent btn-nav-l text-white min-h-0 h-auto py-3 rounded-full"><i className="fa-solid fa-plus"></i> New Movie</button>
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
                                        <ul tabIndex={0} style={{ right: '-15px' }} className="menu mt-1 dropdown-content bg-base-100 rounded-box z-[1] w-32 shadow">
                                            {location.pathname != '/' && <li className="text-black"><Link className="mb-1" to='/' onClick={() => document.getElementsByTagName("details")[0].removeAttribute("open")}>Home</Link></li>}
                                            {location.pathname != '/user' && <li className="text-black"><Link className="mb-1" to='/user' onClick={() => document.getElementsByTagName("details")[0].removeAttribute("open")}>My List</Link></li>}
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
            <dialog id="my_modal_nav" className="modal text-black">
                <div className="modal-box">
                    <section className="hidden text-center">
                        <p className="py-4">Successfully inserted a new movie!</p>
                        <button type="button" className="btn" onClick={() => {
                            document.getElementById('my_modal_nav')?.classList.remove('modal-open');
                            document.getElementsByTagName('section')[0].classList.add('hidden');
                            document.getElementsByTagName('section')[1].classList.remove('hidden');
                            if (location.pathname != '/' && location.pathname != '/user') { navigate('/user'); }
                        }}>Close</button>
                    </section>
                    <section className="">
                        <MovieForm setHomeRefresh={context?.setHomeRefresh ? context?.setHomeRefresh : setTooltipLeft} setListRefresh={context?.setListRefresh ? context?.setListRefresh : setTooltipLeft} />
                    </section>

                </div>
            </dialog>
            <Outlet />
        </>
    )
};

export default Layout;