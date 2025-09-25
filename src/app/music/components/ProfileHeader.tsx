export default function ProfileHeader() {
    return (
        <div className="text-[#FF4500]">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-mondwest">Music</h1>
                    <p className="text-sm opacity-70 mt-1">Sharing my musical journey</p>
                </div>
            </div>
            <div className="mt-4 flex gap-6 text-sm">
                <span>42 followers</span>
                <span>Active</span>
            </div>
        </div>
    );
}