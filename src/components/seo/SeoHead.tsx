import { Helmet } from 'react-helmet-async';

interface SeoProps {
    title: string;
    description: string;
    image?: string;
    url?: string;
}

export default function SeoHead({ title, description, image, url }: SeoProps) {
    const siteTitle = "Abbey Collections & Designs";
    const defaultImage = "https://your-domain.com/default-share-image.jpg"; // Replace with a generic banner
    const siteUrl = "https://abbey-collections.web.app";

    return (
        <Helmet>
            {/* Basic */}
            <title>{`${title} | ${siteTitle}`}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={url || siteUrl} />

            {/* Open Graph (Facebook/WhatsApp) */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image || defaultImage} />
            <meta property="og:url" content={url || siteUrl} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image || defaultImage} />
        </Helmet>
    );
}