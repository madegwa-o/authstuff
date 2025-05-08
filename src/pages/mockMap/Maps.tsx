import { useState, useEffect } from 'react';

const calculateDistance = (point1, point2) => {
    // Haversine formula for calculating distance between two points on Earth
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Radius of the Earth in km

    const dLat = toRad(point2.lat - point1.lat);
    const dLon = toRad(point2.lng - point1.lng);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(point1.lat)) * Math.cos(toRad(point2.lat)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km

    return distance;
};

const calculatePathDistance = (points) => {
    if (points.length < 2) return 0;

    let totalDistance = 0;
    for (let i = 0; i < points.length - 1; i++) {
        totalDistance += calculateDistance(points[i], points[i + 1]);
    }

    return totalDistance;
};

export default function Maps() {
    // Sample data points (coordinates)
    const [points, setPoints] = useState([
        { id: 1, name: "Location A", lat: 34.0522, lng: -118.2437 },
        { id: 2, name: "Location B", lat: 37.7749, lng: -122.4194 },
        { id: 3, name: "Location C", lat: 40.7128, lng: -74.0060 },
        { id: 4, name: "Location D", lat: 32.7767, lng: -96.7970 },
        { id: 5, name: "Location E", lat: 29.7604, lng: -95.3698 }
    ]);

    const [selectedPoints, setSelectedPoints] = useState([]);
    const [pathDistance, setPathDistance] = useState(0);
    const [mapCenter, setMapCenter] = useState({ lat: -0.387506, lng: 37.151668 }); // havens 2
    const [zoom, setZoom] = useState(1);

    useEffect(() => {
        // Calculate the distance whenever selected points change
        const distance = calculatePathDistance(selectedPoints);
        setPathDistance(distance);
    }, [selectedPoints]);

    const handlePointSelection = (point) => {
        if (selectedPoints.find(p => p.id === point.id)) {
            // If already selected, remove it
            setSelectedPoints(selectedPoints.filter(p => p.id !== point.id));
        } else {
            // Add to selected points
            setSelectedPoints([...selectedPoints, point]);
        }
    };

    const resetSelection = () => {
        setSelectedPoints([]);
    };

    const isPointSelected = (pointId) => {
        return selectedPoints.some(p => p.id === pointId);
    };

    // Get index if point is in the path
    const getPointIndex = (pointId) => {
        const index = selectedPoints.findIndex(p => p.id === pointId);
        return index >= 0 ? index + 1 : null;
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-center p-4 bg-gray-100">
                <h1 className="text-xl font-bold">Interactive Map</h1>
                <div>
          <span className="mr-4">
            Total Distance: <strong>{pathDistance.toFixed(2)} km</strong>
          </span>
                    <button
                        onClick={resetSelection}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        Reset Path
                    </button>
                </div>
            </div>

            <div className="flex flex-1">
                {/* Map Area */}
                <div className="w-3/4 bg-blue-50 relative p-4">
                    <div className="bg-blue-100 h-full rounded-lg border-2 border-blue-200 relative overflow-hidden">
                        {/* Simple Map Visualization */}
                        <div className="absolute inset-0">
                            {/* Map lines connecting selected points */}
                            <svg className="w-full h-full absolute top-0 left-0">
                                {selectedPoints.length > 1 && selectedPoints.map((point, index) => {
                                    if (index < selectedPoints.length - 1) {
                                        // Convert geographic coordinates to screen coordinates
                                        const x1 = ((point.lng - mapCenter.lng) * 40) + 50;
                                        const y1 = -((point.lat - mapCenter.lat) * 40) + 50;
                                        const x2 = ((selectedPoints[index + 1].lng - mapCenter.lng) * 40) + 50;
                                        const y2 = -((selectedPoints[index + 1].lat - mapCenter.lat) * 40) + 50;

                                        return (
                                            <line
                                                key={`line-${index}`}
                                                x1={`${x1}%`}
                                                y1={`${y1}%`}
                                                x2={`${x2}%`}
                                                y2={`${y2}%`}
                                                stroke="blue"
                                                strokeWidth="2"
                                                strokeDasharray="5,5"
                                            />
                                        );
                                    }
                                    return null;
                                })}
                            </svg>

                            {/* Map Points */}
                            {points.map((point) => {
                                // Convert geographic coordinates to screen coordinates (simplified)
                                const x = ((point.lng - mapCenter.lng) * 40) + 50;
                                const y = -((point.lat - mapCenter.lat) * 40) + 50;

                                const isSelected = isPointSelected(point.id);
                                const pointIndex = getPointIndex(point.id);

                                return (
                                    <div
                                        key={point.id}
                                        className={`absolute w-6 h-6 -ml-3 -mt-3 rounded-full flex items-center justify-center cursor-pointer transition-all ${
                                            isSelected ? 'bg-green-500 text-white' : 'bg-red-500 text-white hover:bg-red-600'
                                        }`}
                                        style={{ left: `${x}%`, top: `${y}%` }}
                                        onClick={() => handlePointSelection(point)}
                                        title={point.name}
                                    >
                                        {pointIndex || ''}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Map Controls */}
                        <div className="absolute bottom-4 right-4 flex flex-col">
                            <button
                                className="mb-2 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center"
                                onClick={() => setZoom(zoom + 1)}
                            >
                                +
                            </button>
                            <button
                                className="w-8 h-8 bg-white rounded-full shadow flex items-center justify-center"
                                onClick={() => setZoom(Math.max(1, zoom - 1))}
                            >
                                -
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sidebar with location list */}
                <div className="w-1/4 p-4 bg-gray-50 overflow-y-auto">
                    <h2 className="text-lg font-bold mb-4">Locations</h2>
                    <ul className="space-y-2">
                        {points.map((point) => {
                            const isSelected = isPointSelected(point.id);
                            const pointIndex = getPointIndex(point.id);

                            return (
                                <li
                                    key={point.id}
                                    className={`p-3 rounded cursor-pointer ${
                                        isSelected ? 'bg-green-100 border-l-4 border-green-500' : 'bg-white hover:bg-gray-100'
                                    }`}
                                    onClick={() => handlePointSelection(point)}
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <span className="font-medium">{point.name}</span>
                                            <div className="text-xs text-gray-500">
                                                {point.lat.toFixed(4)}, {point.lng.toFixed(4)}
                                            </div>
                                        </div>
                                        {pointIndex && (
                                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
                                                {pointIndex}
                                            </div>
                                        )}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>

                    {selectedPoints.length > 1 && (
                        <div className="mt-6">
                            <h3 className="text-md font-bold mb-2">Path Details</h3>
                            <table className="w-full text-sm">
                                <thead>
                                <tr className="bg-gray-100">
                                    <th className="p-2 text-left">From</th>
                                    <th className="p-2 text-left">To</th>
                                    <th className="p-2 text-right">Distance</th>
                                </tr>
                                </thead>
                                <tbody>
                                {selectedPoints.map((point, index) => {
                                    if (index < selectedPoints.length - 1) {
                                        const nextPoint = selectedPoints[index + 1];
                                        const segmentDistance = calculateDistance(point, nextPoint);

                                        return (
                                            <tr key={`path-${index}`} className="border-b border-gray-200">
                                                <td className="p-2">{point.name}</td>
                                                <td className="p-2">{nextPoint.name}</td>
                                                <td className="p-2 text-right">{segmentDistance.toFixed(2)} km</td>
                                            </tr>
                                        );
                                    }
                                    return null;
                                })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}