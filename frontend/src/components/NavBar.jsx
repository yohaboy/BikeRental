import {Bike} from 'lucide-react';

function NavBar(){
    return (
        <div className="flex justify-between items-center bg-red-700 p-4 px-12 sticky top-0 z-50 shadow-sm">
            <div className="flex items-center gap-8 text-white">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                        <Bike className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        BikeHub
                    </h1>
                </div>
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