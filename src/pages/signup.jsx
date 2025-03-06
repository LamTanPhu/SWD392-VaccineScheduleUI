import Doctor from "./../assets/images/doctor.png";

export default function Signup() {
    return <div className="flex items-center">
        <div className="w-1/2 bg-primary py-10 px-5">
            <img className="w-full h-full object-cover" src={Doctor}/>
        </div>
        <div className="px-10 w-1/2 max-w-[680px] mx-auto">
            <p className="font-bold text-2xl mb-6">Register to your account</p>
            <form className="text-sm">
                <div className="flex flex-col gap-2 mb-4">
                    <label className="text-sm">Fullname</label>
                    <input type="text" className="border border-gray px-5 py-2 rounded-lg" placeholder="enter your name...">

                    </input>
                </div>
                <div className="flex flex-col gap-2 mb-4">
                    <label className="text-sm">Email</label>
                    <input type="email" className="border border-gray px-5 py-2 rounded-lg" placeholder="enter your email...">

                    </input>
                </div>
                <div className="flex flex-col gap-2 mb-4">
                    <label className="text-sm">Password</label>
                    <input type="password" className="border border-gray px-5 py-2 rounded-lg" placeholder="enter your password">
                    </input>
                    <p className="text-gray">
                        Password must contain a minimum of 8 characters
                        <br />
                        Password must contain at least one symbol e.g. @, !
                    </p>
                </div>
                <div className="flex flex-col gap-2 mb-4">
                    <label className="text-sm">Confirm Password</label>
                    <input type="password" className="border border-gray px-5 py-2 rounded-lg" placeholder="re-enter your password">
                    </input>
                </div>
                <div className="flex flex-col gap-2 mb-4">
                    <label className="text-sm">Location <small>(optional)</small></label>
                    <select className="border border-gray px-5 py-2 rounded-lg">
                        <option value="LienChieu">
                            Lien Chieu
                        </option>
                    </select>
                </div>
                <button className="px-5 py-2 rounded-lg bg-primary text-white w-full mb-3">
                    Signup
                </button>
                <p className="text-center">
                    Already a user ? <a href="/login" className="text-primary font-bold">Login</a>
                </p>
            </form>
        </div>
    </div>
}