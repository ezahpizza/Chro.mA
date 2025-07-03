import { motion } from "framer-motion";
import clsx from "clsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SpotlightCard from "@/components/ui/SpotlightCard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface FeatureCardProps {
    icon: React.ElementType;
    title: string;
    description: string;
    buttonText: string;
    buttonColor: string;
    buttonTextColor: string;
    linkTo?: string;
    connectSpotify?: () => void;
    logoutSpotify?: () => void;
}

function FeatureCard(props: FeatureCardProps) {
    const {
        icon: Icon,
        title,
        description,
        buttonText,
        buttonColor,
        buttonTextColor,
        linkTo,
        connectSpotify,
        logoutSpotify,
    } = props;

    const navigate = useNavigate();

    const handleButtonClick = () => {
        if (logoutSpotify) {
            logoutSpotify();
        } else if (connectSpotify) {
            connectSpotify();
        } else if (linkTo) {
            navigate(linkTo);
        }
    };

    const buttonTextColorMap: Record<string, string> = {
        "pumpkin-orange": "text-pumpkin-orange",
        "persian-indigo": "text-persian-indigo",
        "rose-pink": "text-almond-white",
        "tile-green": "text-tile-green",
        "red/70": "text-red",
    };

    // Icon color mapping
    const iconColorMap: Record<string, string> = {
        "bg-pumpkin-orange": "text-persian-indigo",
        "bg-persian-indigo": "text-persian-indigo",
        "bg-rose-pink": "text-tile-green",
        "bg-tile-green": "text-tile-green",
        "bg-red/70": "text-red",
    };

    // Hover color mapping
    const hoverColorMap: Record<string, string> = {
        "bg-pumpkin-orange": "hover:bg-pumpkin-orange/70",
        "bg-persian-indigo": "hover:bg-persian-indigo/70",
        "bg-rose-pink": "hover:bg-rose-pink/70",
        "bg-tile-green": "hover:bg-tile-green/70",
        "bg-red/70": "hover:bg-red",
    };

    const buttonTextColorClass = buttonTextColorMap[buttonTextColor] ?? "text-white";
    const iconTextColorClass = iconColorMap[buttonColor] ?? "text-white";
    const hoverColorClass = hoverColorMap[buttonColor] ?? "hover:opacity-80";

    return (
        <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative h-90" 
        >
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10 w-[90%]">
                <Button
                onClick={handleButtonClick}
                className={clsx(
                    "font-bold font-fira-code w-full transition-all duration-300",
                    buttonColor,
                    buttonTextColorClass,
                    "border-almond-white border-r-4 border-b-4",
                    hoverColorClass,
                    "hover:border-none"
                )}
                >
                {buttonText}
                </Button>
            </div>

            <SpotlightCard
                className="custom-spotlight-card bg-gradient-to-br from-rose-pink to-pumpkin-orange h-full"
                spotlightColor="rgba(45, 28, 127, 1)"
            >
                <Card className="bg-transparent h-full flex flex-col">
                    <CardHeader className="text-center pb-4 flex-shrink-0"> 
                        <Icon className={clsx("w-12 h-12 mx-auto mb-4", iconTextColorClass)} />
                        <CardTitle className="font-biorhyme text-persian-indigo">{title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center flex-1 flex flex-col justify-start"> 
                        <p className="text-persian-indigo/80 mb-20 font-biorhyme text-sm">
                        {description}
                        </p>
                    </CardContent>
                </Card>
            </SpotlightCard>
        </motion.div>
    );
}

export default FeatureCard;
