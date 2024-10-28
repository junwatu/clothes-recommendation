import { Card } from '../components/ui/card';
import { Loader } from 'lucide-react';

interface Recommendation {
	id: string;
	productDisplayName: string;
	articleType: string;
	baseColour: string;
	masterCategory: string;
	subCategory: string;
	gender: string;
	season: string;
	year: string;
	similarity: number;
}

interface RecommendationCardProps {
	recommendation: Recommendation;
	isLoading?: boolean;
}

const RecommendationCard = ({ recommendation, isLoading = false }: RecommendationCardProps) => {
	const imagePath = `/data/images/${recommendation.id}.jpg`;

	if (isLoading) {
		return (
			<Card className="p-4 bg-gray-50 h-56">
				<div className="h-full flex items-center justify-center">
					<Loader className="w-8 h-8 text-blue-500 animate-spin" />
				</div>
			</Card>
		);
	}

	return (
		<Card className="p-4 bg-gray-50 relative">
			<div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
				{(recommendation.similarity * 100).toFixed(0)}% match
			</div>
			<div className="h-32 flex items-center justify-center mb-2">
				<img
					src={imagePath}
					alt={recommendation.productDisplayName}
					className="object-contain w-full h-full"
				/>
			</div>
			<div className="text-center">
				<h4 className="font-medium text-sm mb-1 line-clamp-2">{recommendation.productDisplayName}</h4>
				<div className="text-xs text-gray-600 space-y-1">
					<p>{recommendation.gender} • {recommendation.articleType}</p>
					<p>{recommendation.baseColour}</p>
					<p className="text-xs text-gray-500">{recommendation.season} {recommendation.year}</p>
				</div>
			</div>
		</Card>
	);
};

export default RecommendationCard;