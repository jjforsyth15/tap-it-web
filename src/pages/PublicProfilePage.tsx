import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPublicProfile } from "../api/profileApi";

type ProfileLink = {
    label: string;
    url: string;
};

type PublicProfile = {
    profile_id: string;
    profile_name: string;
    bio?: string;
    website_url?: string;
    links?: ProfileLink[];
};

export default function PublicProfilePage() {
    const { profileId } = useParams();
    const [profile, setProfile] = useState<PublicProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchProfile() {

            if (!profileId) 
                return;

            try {
                const data = await getPublicProfile(profileId);

                setProfile(data);
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchProfile();
    }, [profileId]);

    if (isLoading) 
        return <div>Loading...</div>;

    if (!profile) 
        return <div>{"Profile not found"}</div>;

    return (
        <div>
            <h1>{profile.profile_name}</h1>

            <p>{profile.bio}</p>

            {profile.website_url && (
                <a href={profile.website_url} target="_blank" rel="noopener noreferrer">
                    Website
                </a>
            )}

            <div> 
                {profile.links?.map((link, index) => (
                    <div key={index}>
                        <a href={link.url} target="_blank" rel="noopener noreferrer">
                            {link.label}
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}