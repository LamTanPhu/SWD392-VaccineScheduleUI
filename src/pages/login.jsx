import Doctor from "./../assets/images/doctor.png";
import IconGg from "./../assets/images/ic_gg.png";

export default function LoginPage() {
    return <div className="flex items-center">
        <div className="w-1/2 bg-primary py-10 px-5">
            <img className="w-full h-full object-cover" src={Doctor}/>
        </div>
        <div className="px-10 w-1/2 max-w-[680px] mx-auto">
            <p className="font-bold text-2xl">Login to your account</p>
            <p className="mb-6">See what is going on with your business</p>
            <button className="flex items-center justify-center border border-gray px-5 py-2 rounded-lg gap-2 w-full mb-6">
                <img src={IconGg} alt="Icon google"/>
                <span className="font-semibold text-gray text-sm cursor-not-allowed">Continue with Google</span>
            </button>
            <form className="text-sm">
                <div className="flex flex-col gap-2 mb-4">
                    <label className="text-sm">Email</label>
                    <input type="email" className="border border-gray px-5 py-2 rounded-lg" placeholder="enter your email...">

                    </input>
                </div>
                <div className="flex flex-col gap-2 mb-4">
                    <label className="text-sm">Password</label>
                    <input type="password" className="border border-gray px-5 py-2 rounded-lg" placeholder="enter your password">

                    </input>
                </div>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                        <input type="checkbox"/>
                        <label>Remember me</label>
                    </div>
                    <a href="#">Forgot password ?</a>
                </div>
                <button className="px-5 py-2 rounded-lg bg-primary text-white w-full mb-3">
                    Login
                </button>
                <a href="/signup" className="block px-5 py-2 rounded-lg bg-white border border-primary text-primary w-full text-center">
                    Signup
                </a>
            </form>
        </div>
    </div>
}