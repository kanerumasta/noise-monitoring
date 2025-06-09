import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  FireIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/solid';

type TierInfo = {
  label: string;
  icon: JSX.Element;
  iconColor: string;
};

export const getTierLevelIcon = (soundLevel: number): TierInfo => {
  if (soundLevel >= 101) {
    return {
      label: "Tier 3",
      icon: <FireIcon className="w-5 h-5" />,
      iconColor: "text-red-600",
    };
  } else if (soundLevel >= 86) {
    return {
      label: "Tier 2",
      icon: <ExclamationCircleIcon className="w-5 h-5" />,
      iconColor: "text-orange-500",
    };
  } else if (soundLevel >= 71) {
    return {
      label: "Tier 1",
      icon: <ExclamationTriangleIcon className="w-5 h-5" />,
      iconColor: "text-yellow-500",
    };
  } else {
    return {
      label: "Normal",
      icon: <CheckCircleIcon className="w-5 h-5" />,
      iconColor: "text-green-500",
    };
  }
};
