// src/pages/Home.jsx
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FaLinkedin, FaGithub } from 'react-icons/fa';

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-blue-900 text-white">
            <main className="flex flex-col items-center px-4 py-10">
                <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-10">MERN Vite shadcn Template</h1>
                <h2 className="text-3xl font-semibold text-gray-200 mb-4">Welcome to Your New Project!</h2>
                <p className="mt-2 text-center text-gray-300 max-w-md text-lg">
                    This template will help you quickly set up a MERN stack application with a modern frontend using Vite and Tailwind CSS.
                </p>
                <Button 
                    className="mt-8 bg-blue-600 hover:bg-blue-700 text-lg px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105"
                    onClick={() => window.open('https://ui.shadcn.com/docs/components', '_blank')}
                >
                    Explore shadcn Components
                </Button>
            </main>
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16 container mx-auto px-4">
                <Card className="p-6 shadow-xl bg-gray-800 rounded-lg border border-blue-500 hover:border-purple-500 transition-all duration-300">
                    <h3 className="text-2xl font-semibold text-blue-400">React + Vite</h3>
                    <p className="mt-3 text-gray-300">Leverage the power of React with the speed of Vite for an optimized development experience.</p>
                </Card>
                <Card className="p-6 shadow-xl bg-gray-800 rounded-lg border border-blue-500 hover:border-purple-500 transition-all duration-300">
                    <h3 className="text-2xl font-semibold text-blue-400">Express Backend</h3>
                    <p className="mt-3 text-gray-300">Robust and scalable backend powered by Express.js for efficient API development.</p>
                </Card>
                <Card className="p-6 shadow-xl bg-gray-800 rounded-lg border border-blue-500 hover:border-purple-500 transition-all duration-300">
                    <h3 className="text-2xl font-semibold text-blue-400">MongoDB Integration</h3>
                    <p className="mt-3 text-gray-300">Seamless integration with MongoDB for flexible and powerful data storage solutions.</p>
                </Card>
                <Card className="p-6 shadow-xl bg-gray-800 rounded-lg border border-blue-500 hover:border-purple-500 transition-all duration-300">
                    <h3 className="text-2xl font-semibold text-blue-400">Tailwind CSS + ShadCN</h3>
                    <p className="mt-3 text-gray-300">Beautiful, responsive UI components with Tailwind CSS and ShadCN for rapid development.</p>
                </Card>
            </section>
            <footer className="mt-20 w-full bg-gray-800 py-10 px-4 text-center">
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-4">Created by Raghav Singla</h2>
                <p className="text-gray-300 mb-4">Full Stack Developer | MERN Stack | Open Source Contributor</p>
                <div className="flex justify-center space-x-6 text-2xl">
                    <a href="https://www.linkedin.com/in/singlaraghav" className="text-blue-400 hover:text-blue-300 transition-colors duration-300" target="_blank" rel="noopener noreferrer">
                        <FaLinkedin />
                    </a>
                    <a href="https://github.com/RaghavOG" className="text-purple-400 hover:text-purple-300 transition-colors duration-300" target="_blank" rel="noopener noreferrer">
                        <FaGithub />
                    </a>
                </div>
            </footer>
        </div>
    );
};

export default Home;
