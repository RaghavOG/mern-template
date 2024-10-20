// src/pages/Home.jsx
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
            <main className="flex flex-col items-center">
                <h1 className="text-4xl font-bold text-blue-400 mb-10">MERN Vite shadcn Template</h1>
                <h2 className="text-3xl font-semibold text-gray-200">Welcome to Your New Project!</h2>
                <p className="mt-4 text-center text-gray-400 max-w-md">
                    This template will help you quickly set up a MERN stack application with a modern frontend using Vite and Tailwind CSS.
                </p>
                <Button 
                    className="mt-6 bg-blue-500 hover:bg-blue-600"
                    onClick={() => window.open('https://ui.shadcn.com/docs/components', '_blank')}
                >
                    Explore shadcn Components
                </Button>
            </main>
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 container mx-auto">
                <Card className="p-6 shadow-lg bg-gray-800 rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-200">React + Vite</h3>
                    <p className="mt-2 text-gray-400">Leverage the power of React with the speed of Vite for an optimized development experience.</p>
                </Card>
                <Card className="p-6 shadow-lg bg-gray-800 rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-200">Express Backend</h3>
                    <p className="mt-2 text-gray-400">Robust and scalable backend powered by Express.js for efficient API development.</p>
                </Card>
                <Card className="p-6 shadow-lg bg-gray-800 rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-200">MongoDB Integration</h3>
                    <p className="mt-2 text-gray-400">Seamless integration with MongoDB for flexible and powerful data storage solutions.</p>
                </Card>
                <Card className="p-6 shadow-lg bg-gray-800 rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-200">Tailwind CSS + ShadCN</h3>
                    <p className="mt-2 text-gray-400">Beautiful, responsive UI components with Tailwind CSS and ShadCN for rapid development.</p>
                </Card>
            </section>
        </div>
    );
};

export default Home;
