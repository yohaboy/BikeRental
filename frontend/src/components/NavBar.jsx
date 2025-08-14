function NavBar(){
    return (
        <div className="flex justify-between items-center bg-red-700 p-4 px-12 sticky top-0 z-50 shadow-sm">
            <div className="flex items-center gap-8 text-white">
                <span className="border p-2 bg-green-700 rounded-lg">BikeGO</span>
                <span>Home</span>
                <span>Dashboard</span>
                <span>About</span>
                <span>Contact</span>
            </div>
            <div className="flex items-center gap-8 text-white">
                <span className="border p-2 bg-blue-700 rounded-lg">Sign Up</span>
                <span className="border p-2 bg-gray-100 rounded-lg text-black">Log In</span>
            </div>
        </div>
    )
}

export default NavBar