
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface PageHeaderProps {
    title: string;
    showBackButton?: boolean;
}

function PageHeader({ title, showBackButton = true }: PageHeaderProps) {
    const navigate = useNavigate();

    return (
        <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
        duration: 1,
        type: "spring",
        stiffness: 100
        }} className="relative w-full mb-8">
            {showBackButton && (
                <Button
                onClick={() => navigate('/')}
                variant="ghost"
                size="sm"
                className="relative left-0 top-0 text-persian-indigo hover:bg-persian-indigo/10 font-fira-code"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Home
                </Button>
            )}
            <div>
                <h1 className="text-4xl font-biorhyme-expanded font-bold text-persian-indigo text-center">
                    {title}
                </h1>
            </div>
        </motion.div>
    );
};

export default PageHeader;
