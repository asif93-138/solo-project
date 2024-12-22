import { useContext, useEffect, useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { UserContext } from "./UserContext";
import img from '../public/e4e42631158aa2ab3a546299087e534d.png'

const Layout = () => {
    const context = useContext(UserContext);
    const location = useLocation();
    const navigate = useNavigate();
    const [tooltipLeft, setTooltipLeft] = useState(90);
    useEffect(() => {
        if (context?.user) {
            setTimeout(() => {
                const tooltipElement = document.getElementsByClassName('tooltiptext')[0] as HTMLElement;
                setTooltipLeft(tooltipElement.offsetWidth - 131 + 90);
            }, 1500);
        }
    }, [context?.user])
    // console.log(); 
    return (
        <>
            {
                !(location.pathname == '/login' || location.pathname == '/register')
                &&
                <nav className="navbar bg-neutral text-neutral-content px-8">
                    <div className="flex-1">
                        <Link to="/" className="m-2">      <div className="text-3xl md:text-4xl font-bold text-primary hover:text-primary-focus transition-colors duration-300">
        <span className="bg-yellow-500 text-black px-2 py-1 rounded">FILM</span>
        <span className="text-white">Critic</span>
      </div></Link>
                    </div>
                    <div className="flex-none gap-2">
                        {context?.user ?
                            <>
                                <Link to='/user'>
                                    <div className="dropdown dropdown-end  tool-tip">
                                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                            <div className="w-10 rounded-full">
                                                <img
                                                    alt="Tailwind CSS Navbar component"
                                                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                                                    
                                            </div>
                                        </div>
                                        <small style={{left: '-' + tooltipLeft + '%'}} className="tooltiptext">{context.user.name}<br />{context.user.email}</small>
                                    </div>
                                </Link>
                                <button className="btn text-slate-50 btn-nav-l min-h-0 h-auto py-3 bg-slate-500 border-0" onClick={() => {
                                    context?.setUser(null);
                                    localStorage.clear();
                                    if (location.pathname != '/') {
                                        navigate('/');
                                    }
                                }}>Logout</button>
                            </>
                            :
                            <Link to="/login"><button className="btn text-slate-50 btn-nav-l min-h-0 h-auto py-3 bg-slate-500 border-0">Login</button></Link>
                        }
                    </div>
                </nav>
                // <nav className="navbar bg-neutral text-neutral-content justify-between">
                //     <Link to="/"><button className="btn btn-ghost text-xl">Home</button></Link>
                //     <div className="">
                //         {true ?
                //             <div className="flex">
                //                 <Link to=''>
                //                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M399 384.2C376.9 345.8 335.4 320 288 320l-64 0c-47.4 0-88.9 25.8-111 64.2c35.2 39.2 86.2 63.8 143 63.8s107.8-24.7 143-63.8zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256 16a72 72 0 1 0 0-144 72 72 0 1 0 0 144z"/></svg>
                //                 </Link>
                //                 <button className="btn" onClick={() => { context?.setUser(null) }}>Logout</button>
                //             </div>
                //             :
                //             <Link to="/login"><button className="btn">Login</button></Link>
                //         }
                //     </div>
                // </nav>
            }
            <Outlet />
        </>
    )
};

export default Layout;